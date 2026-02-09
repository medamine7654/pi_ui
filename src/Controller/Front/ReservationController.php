<?php

namespace App\Controller\Front;

use App\Entity\Reservation;
use App\Entity\User;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/reservations')]
class ReservationController extends AbstractController
{
    #[Route('/', name: 'app_reservations')]
    public function index(Request $request, ReservationRepository $reservationRepository): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $statusFilter = (string) $request->query->get('status', 'all');
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('Utilisateur invalide.');
        }

        $reservations = $reservationRepository->findByUserAndStatus($user, $statusFilter);

        return $this->render('front/reservation/index.html.twig', [
            'reservations' => $reservations,
            'status' => $statusFilter,
        ]);
    }

    #[Route('/{id}/cancel', name: 'app_reservation_cancel', methods: ['POST'])]
    public function cancel(
        Reservation $reservation,
        Request $request,
        EntityManagerInterface $entityManager,
        ReservationRepository $reservationRepository
    ): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        if (!$this->isCsrfTokenValid('cancel-reservation' . $reservation->getId(), (string) $request->request->get('_token'))) {
            $this->addFlash('error', 'Jeton CSRF invalide.');
            return $this->redirectToRoute('app_reservations');
        }

        $user = $this->getUser();
        if (!$user instanceof User || $reservation->getUser()?->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException('Operation non autorisee.');
        }

        if ($reservation->getStatus() !== 'confirmed') {
            $this->addFlash('error', 'Cette reservation ne peut pas etre annulee.');
            return $this->redirectToRoute('app_reservations');
        }

        $reservation->setStatus('cancelled');
        if ($reservation->getMateriel() !== null) {
            $materiel = $reservation->getMateriel();
            $remainingConfirmed = $reservationRepository->countConfirmedForMaterielExcludingReservation(
                (int) $materiel->getId(),
                (int) $reservation->getId()
            );
            if ($remainingConfirmed === 0) {
                $materiel->setDisponible(true);
            }
        }

        $entityManager->flush();

        $typeLabel = $reservation->getType() === 'service' ? 'service' : 'materiel';
        $this->addFlash('success', 'Reservation de ' . $typeLabel . ' annulee avec succes.');
        return $this->redirectToRoute('app_reservations');
    }
}
