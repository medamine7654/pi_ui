<?php

namespace App\Controller;

use App\Form\SearchFilterType;
use App\Repository\FavoriteRepository;
use App\Repository\ServiceRepository;
use App\Service\QualityScoreService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ServiceController extends AbstractController
{
    #[Route('/services', name: 'app_services')]
    public function index(Request $request, ServiceRepository $serviceRepository, QualityScoreService $qualityScoreService, FavoriteRepository $favoriteRepository): Response
    {
        // Create the search form
        $form = $this->createForm(SearchFilterType::class, null, ['type' => 'service']);
        $form->handleRequest($request);

        // Get filter values
        $query = $form->get('query')->getData();
        $category = $form->get('category')->getData();
        $location = $form->get('location')->getData();
        $minPrice = $form->get('minPrice')->getData();
        $maxPrice = $form->get('maxPrice')->getData();
        $sortBy = $form->get('sortBy')->getData();

        // Fetch filtered services
        $services = $serviceRepository->findBySearchFilters(
            $query,
            $category,
            $location,
            $minPrice,
            $maxPrice,
            $sortBy
        );

        // Calculate quality scores and check favorites for each service
        $servicesWithScores = [];
        $user = $this->getUser();
        foreach ($services as $service) {
            $isFavorite = false;
            if ($user) {
                $isFavorite = $favoriteRepository->isFavorite($user, 'service', $service->getId());
            }
            
            $servicesWithScores[] = [
                'service' => $service,
                'qualityScore' => $qualityScoreService->calculateServiceScore($service),
                'isFavorite' => $isFavorite,
            ];
        }

        return $this->render('services/index.html.twig', [
            'servicesWithScores' => $servicesWithScores,
            'searchForm' => $form->createView(),
        ]);
    }

    #[Route('/services/{id}', name: 'app_service_show')]
    public function show(int $id, ServiceRepository $serviceRepository, QualityScoreService $qualityScoreService): Response
    {
        $service = $serviceRepository->find($id);

        if (!$service || !$service->getIsActive()) {
            throw $this->createNotFoundException('Service not found');
        }

        $qualityScore = $qualityScoreService->calculateServiceScore($service);

        return $this->render('services/show.html.twig', [
            'service' => $service,
            'qualityScore' => $qualityScore,
        ]);
    }
}
