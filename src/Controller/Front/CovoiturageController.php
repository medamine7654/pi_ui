<?php

namespace App\Controller\Front;

use App\Entity\Covoiturage;
use App\Entity\User;
use App\Repository\CovoiturageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/covoiturages')]
class CovoiturageController extends AbstractController
{
    #[Route('/', name: 'app_covoiturages', methods: ['GET'])]
    public function index(CovoiturageRepository $covoiturageRepository): Response
    {
        return $this->render('front/covoiturage/index.html.twig', [
            // Avoid loading a potentially huge dataset on one request.
            'covoiturages' => $covoiturageRepository->findLatestForFront(50),
        ]);
    }

    #[Route('/create', name: 'app_covoiturage_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('create_covoiturage', (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_covoiturages');
        }

        $depart = trim((string) $request->request->get('depart', ''));
        $destination = trim((string) $request->request->get('destination', ''));
        $dateValue = (string) $request->request->get('date_depart', '');
        $placesValue = (string) $request->request->get('places', '');

        try {
            $dateDepart = new \DateTimeImmutable($dateValue);
        } catch (\Exception) {
            $this->addFlash('error', 'Format de date invalide.');
            return $this->redirectToRoute('app_covoiturages');
        }

        if (!ctype_digit($placesValue)) {
            $this->addFlash('error', 'Le nombre de places doit etre un nombre entier.');
            return $this->redirectToRoute('app_covoiturages');
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur invalide.');
        }

        $covoiturage = (new Covoiturage())
            ->setDepart($depart)
            ->setDestination($destination)
            ->setDateDepart($dateDepart)
            ->setPlaces((int) $placesValue)
            ->setConducteur($user);

        $errors = $validator->validate($covoiturage);
        if (count($errors) > 0) {
            foreach ($errors as $error) {
                $this->addFlash('error', $error->getMessage());
            }
            return $this->redirectToRoute('app_covoiturages');
        }

        $entityManager->persist($covoiturage);
        $entityManager->flush();

        $this->addFlash('success', 'Covoiturage ajoute avec succes.');
        return $this->redirectToRoute('app_covoiturages');
    }
}
