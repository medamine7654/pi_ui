<?php

namespace App\Controller\Front;

use App\Repository\CovoiturageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/covoiturages')]
class CovoiturageController extends AbstractController
{
    #[Route('/', name: 'app_covoiturages', methods: ['GET'])]
    public function index(CovoiturageRepository $covoiturageRepository): Response
    {
        return $this->render('front/covoiturage/index.html.twig', [
            'covoiturages' => $covoiturageRepository->findBy([], ['id' => 'DESC']),
        ]);
    }
}
