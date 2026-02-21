<?php

namespace App\Controller;

use App\Repository\HomeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/homes', name: 'app_homes')]
    public function list(HomeRepository $homeRepository): Response
    {
        $homes = $homeRepository->findAllActive();

        return $this->render('home/list.html.twig', [
            'homes' => $homes,
        ]);
    }

    #[Route('/homes/{id}', name: 'app_home_show')]
    public function show(int $id, HomeRepository $homeRepository): Response
    {
        $home = $homeRepository->find($id);

        if (!$home || !$home->getIsActive()) {
            throw $this->createNotFoundException('Home not found');
        }

        return $this->render('home/show.html.twig', [
            'home' => $home,
        ]);
    }
}
