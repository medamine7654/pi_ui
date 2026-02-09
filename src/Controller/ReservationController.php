<?php

namespace App\Controller;

use App\Entity\Reservation;
use App\Entity\Logement;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/reservation')]
class ReservationController extends AbstractController
{
    #[Route('/', name: 'app_reservation_index', methods: ['GET'])]
    public function index(ReservationRepository $reservationRepository): Response
    {
        // Pour la démo, on récupère toutes les réservations
        // Dans un vrai projet, on filtrerait par utilisateur connecté
        $reservations = $reservationRepository->findAll();

        return $this->render('reservation/index.html.twig', [
            'reservations' => $reservations,
        ]);
    }

    #[Route('/new/{id}', name: 'app_reservation_new', methods: ['GET', 'POST'])]
    public function new(Request $request, int $id, EntityManagerInterface $entityManager): Response
    {
        // Charger le logement manuellement
        $logement = $entityManager->getRepository(Logement::class)->find($id);
        
        if (!$logement) {
            $this->addFlash('error', 'Ce logement n\'existe pas.');
            return $this->redirectToRoute('app_home');
        }
        
        if ($request->isMethod('POST')) {
            // Pour la démo, on utilise le premier utilisateur
            $user = $entityManager->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'locataire@rentall.com']);
            
            if (!$user) {
                $this->addFlash('error', 'Utilisateur non trouvé. Veuillez charger les fixtures.');
                return $this->redirectToRoute('app_home');
            }

            $dateArrivee = new \DateTime($request->request->get('dateArrivee'));
            $dateDepart = new \DateTime($request->request->get('dateDepart'));
            
            // Calculer le nombre de nuits
            $interval = $dateArrivee->diff($dateDepart);
            $nombreNuits = $interval->days;
            
            // Calculer le montant total
            $montantTotal = $nombreNuits * $logement->getPrixParNuit();

            $reservation = new Reservation();
            $reservation->setLogement($logement);
            $reservation->setLocataire($user);
            $reservation->setDateDebut($dateArrivee);
            $reservation->setDateFin($dateDepart);
            $reservation->setMontantTotal($montantTotal);
            $reservation->setStatut('confirmee');
            $reservation->setDateCreation(new \DateTime());

            $entityManager->persist($reservation);
            $entityManager->flush();

            $this->addFlash('success', 'Réservation créée avec succès !');
            return $this->redirectToRoute('app_reservation_show', ['id' => $reservation->getId()]);
        }

        return $this->render('reservation/new.html.twig', [
            'logement' => $logement,
        ]);
    }

    #[Route('/{id}', name: 'app_reservation_show', methods: ['GET'])]
    public function show(Reservation $reservation): Response
    {
        return $this->render('reservation/show.html.twig', [
            'reservation' => $reservation,
        ]);
    }

    #[Route('/{id}/cancel', name: 'app_reservation_cancel', methods: ['POST'])]
    public function cancel(Reservation $reservation, EntityManagerInterface $entityManager): Response
    {
        // Vérifier si la réservation peut être annulée (plus de 3 jours avant l'arrivée)
        if (!$reservation->peutEtreAnnulee()) {
            $this->addFlash('error', 'Cette réservation ne peut plus être annulée (moins de 3 jours avant l\'arrivée).');
            return $this->redirectToRoute('app_reservation_show', ['id' => $reservation->getId()]);
        }

        $reservation->setStatut('annulee');
        $entityManager->flush();

        $this->addFlash('success', 'Réservation annulée avec succès.');
        return $this->redirectToRoute('app_reservation_index');
    }
}
