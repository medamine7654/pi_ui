<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Repository\FavoriteRepository;
use App\Repository\ServiceRepository;
use App\Repository\ToolRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
class FavoriteController extends AbstractController
{
    #[Route('/favorites', name: 'app_favorites')]
    public function index(
        FavoriteRepository $favoriteRepository,
        ServiceRepository $serviceRepository,
        ToolRepository $toolRepository
    ): Response {
        $user = $this->getUser();
        $favorites = $favoriteRepository->findByUser($user);

        $services = [];
        $tools = [];

        foreach ($favorites as $favorite) {
            if ($favorite->getItemType() === 'service') {
                $service = $serviceRepository->find($favorite->getItemId());
                if ($service && $service->getIsActive()) {
                    $services[] = $service;
                }
            } elseif ($favorite->getItemType() === 'tool') {
                $tool = $toolRepository->find($favorite->getItemId());
                if ($tool && $tool->getIsActive()) {
                    $tools[] = $tool;
                }
            }
        }

        return $this->render('favorites/index.html.twig', [
            'services' => $services,
            'tools' => $tools,
        ]);
    }

    #[Route('/favorites/toggle/{type}/{id}', name: 'app_favorites_toggle', methods: ['POST'])]
    public function toggle(
        string $type,
        int $id,
        FavoriteRepository $favoriteRepository,
        EntityManagerInterface $entityManager
    ): Response {
        $user = $this->getUser();

        if (!in_array($type, ['service', 'tool'])) {
            throw $this->createNotFoundException('Invalid item type');
        }

        $favorite = $favoriteRepository->findFavorite($user, $type, $id);

        if ($favorite) {
            $entityManager->remove($favorite);
            $message = 'Removed from favorites';
        } else {
            $favorite = new Favorite();
            $favorite->setUser($user);
            $favorite->setItemType($type);
            $favorite->setItemId($id);
            $entityManager->persist($favorite);
            $message = 'Added to favorites';
        }

        $entityManager->flush();

        $this->addFlash('success', $message);

        return $this->redirectToRoute('app_' . $type . 's');
    }
}
