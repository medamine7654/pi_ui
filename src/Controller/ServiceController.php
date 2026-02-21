<?php

namespace App\Controller;

use App\Repository\ServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ServiceController extends AbstractController
{
    #[Route('/services', name: 'app_services')]
    public function index(ServiceRepository $serviceRepository): Response
    {
        $services = $serviceRepository->findAllActive();

        return $this->render('services/index.html.twig', [
            'services' => $services,
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
