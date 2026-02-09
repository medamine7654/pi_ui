<?php

namespace App\Controller\Front;

use App\Entity\Reservation;
use App\Entity\Service;
use App\Entity\User;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/services')]
class ServiceController extends AbstractController
{
    #[Route('/', name: 'app_services')]
    public function index(Request $request, ServiceRepository $serviceRepository): Response
    {
        $filters = [
            'q' => $request->query->get('q'),
        ];

        $services = $serviceRepository->searchByTerm($filters['q']);

        return $this->render('front/services/index.html.twig', [
            'services' => $services,
            'filters' => $filters,
        ]);
    }

    #[Route('/create', name: 'app_service_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('create_service', (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_services');
        }

        $titre = trim((string) $request->request->get('titre', ''));
        $description = trim((string) $request->request->get('description', ''));
        $dateValue = (string) $request->request->get('date_service', '');

        if ($titre === '' || $dateValue === '') {
            $this->addFlash('error', 'Le titre et la date du service sont obligatoires.');
            return $this->redirectToRoute('app_services');
        }

        try {
            $dateService = new \DateTimeImmutable($dateValue);
        } catch (\Exception) {
            $this->addFlash('error', 'Format de date invalide.');
            return $this->redirectToRoute('app_services');
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur invalide.');
        }

        $service = (new Service())
            ->setTitre($titre)
            ->setDescription($description !== '' ? $description : null)
            ->setDateService($dateService)
            ->setUser($user);

        $entityManager->persist($service);
        $entityManager->flush();

        $this->addFlash('success', 'Service ajoute avec succes.');
        return $this->redirectToRoute('app_services');
    }

    #[Route('/{id}/book', name: 'app_service_book', methods: ['POST'])]
    public function book(Service $service, Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('book_service_' . $service->getId(), (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_services');
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur invalide.');
        }

        $startDate = $service->getDateService();
        if (!$startDate instanceof \DateTimeImmutable) {
            $this->addFlash('error', 'Ce service ne peut pas etre reserve.');
            return $this->redirectToRoute('app_services');
        }

        $reservation = (new Reservation())
            ->setUser($user)
            ->setService($service)
            ->setType('service')
            ->setStatus('confirmed')
            ->setStartDate($startDate)
            ->setEndDate($startDate->modify('+2 hours'))
            ->setTotalPrice('0.00')
            ->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($reservation);
        $entityManager->flush();

        $this->addFlash('success', 'Service reserve avec succes.');
        return $this->redirectToRoute('app_reservations');
    }
}
