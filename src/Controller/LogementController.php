<?php

namespace App\Controller;

use App\Entity\Logement;
use App\Repository\LogementRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/logement')]
class LogementController extends AbstractController
{
    #[Route('/{id}', name: 'app_logement_show', methods: ['GET'])]
    public function show(int $id, LogementRepository $logementRepository): Response
    {
        $logement = $logementRepository->find($id);

        if (!$logement) {
            $this->addFlash('error', 'Ce logement n\'existe pas.');
            return $this->redirectToRoute('app_home');
        }

        return $this->render('logement/show.html.twig', [
            'logement' => $logement,
        ]);
    }
}
