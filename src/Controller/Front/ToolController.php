<?php

namespace App\Controller\Front;

use App\Entity\Materiel;
use App\Entity\Reservation;
use App\Entity\User;
use App\Repository\MaterielRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/tools')]
class ToolController extends AbstractController
{
    #[Route('/', name: 'app_tools')]
    public function index(Request $request, MaterielRepository $materielRepository): Response
    {
        $filters = [
            'q' => $request->query->get('q'),
            'available' => $request->query->get('available') === '1',
        ];

        $tools = $materielRepository->searchByTerm($filters['q'], $filters['available']);

        return $this->render('front/tools/index.html.twig', [
            'tools' => $tools,
            'filters' => $filters,
        ]);
    }

    #[Route('/{id}', name: 'app_tool_show')]
    public function show(int $id): Response
    {
        // TODO: Implement tool detail page
        return new Response('Tool detail page - ID: ' . $id);
    }

    #[Route('/{id}/book', name: 'app_tool_book', methods: ['POST'])]
    public function book(Materiel $materiel, Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('book_tool_' . $materiel->getId(), (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_tools');
        }

        if (!$materiel->isDisponible()) {
            $this->addFlash('error', 'Ce materiel est indisponible.');
            return $this->redirectToRoute('app_tools');
        }

        $startValue = (string) $request->request->get('start_date', '');
        $endValue = (string) $request->request->get('end_date', '');

        if ($startValue === '' || $endValue === '') {
            $this->addFlash('error', 'Les dates de reservation sont obligatoires.');
            return $this->redirectToRoute('app_tools');
        }

        try {
            $startDate = new \DateTimeImmutable($startValue);
            $endDate = new \DateTimeImmutable($endValue);
        } catch (\Exception) {
            $this->addFlash('error', 'Format de date invalide.');
            return $this->redirectToRoute('app_tools');
        }

        if ($endDate < $startDate) {
            $this->addFlash('error', 'La date de fin doit etre apres la date de debut.');
            return $this->redirectToRoute('app_tools');
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur invalide.');
        }

        $reservation = (new Reservation())
            ->setUser($user)
            ->setMateriel($materiel)
            ->setType('tool')
            ->setStatus('confirmed')
            ->setStartDate($startDate)
            ->setEndDate($endDate)
            ->setTotalPrice('0.00')
            ->setCreatedAt(new \DateTimeImmutable());

        // Optional basic stock behavior: one reservation marks material unavailable
        $materiel->setDisponible(false);

        $entityManager->persist($reservation);
        $entityManager->flush();

        $this->addFlash('success', 'Materiel reserve avec succes.');
        return $this->redirectToRoute('app_reservations');
    }

    #[Route('/create', name: 'app_tool_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('create_tool', (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_tools');
        }

        $nom = trim((string) $request->request->get('nom', ''));
        $etat = trim((string) $request->request->get('etat', ''));
        $disponible = $request->request->getBoolean('disponible', true);

        if ($nom === '') {
            $this->addFlash('error', 'Le nom du materiel est obligatoire.');
            return $this->redirectToRoute('app_tools');
        }

        $materiel = (new Materiel())
            ->setNom($nom)
            ->setEtat($etat !== '' ? $etat : null)
            ->setDisponible($disponible);

        $entityManager->persist($materiel);
        $entityManager->flush();

        $this->addFlash('success', 'Materiel ajoute avec succes.');
        return $this->redirectToRoute('app_tools');
    }
}
