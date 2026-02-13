<?php

namespace App\Controller;

use App\Form\SearchFilterType;
use App\Repository\ServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ServiceController extends AbstractController
{
    #[Route('/services', name: 'app_services')]
    public function index(Request $request, ServiceRepository $serviceRepository): Response
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

        return $this->render('services/index.html.twig', [
            'services' => $services,
            'searchForm' => $form->createView(),
        ]);
    }

    #[Route('/services/{id}', name: 'app_service_show')]
    public function show(int $id, ServiceRepository $serviceRepository): Response
    {
        $service = $serviceRepository->find($id);

        if (!$service || !$service->getIsActive()) {
            throw $this->createNotFoundException('Service not found');
        }

        return $this->render('services/show.html.twig', [
            'service' => $service,
        ]);
    }
}
