<?php

namespace App\Controller\Admin;

use App\Entity\Service;
use App\Repository\ServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/services')]
#[IsGranted('ROLE_ADMIN')]
class AdminServiceController extends AbstractController
{
    #[Route('/', name: 'admin_services')]
    public function index(ServiceRepository $serviceRepository): Response
    {
        $services = $serviceRepository->findAllForAdmin();

        return $this->render('admin/services/index.html.twig', [
            'services' => $services,
        ]);
    }

    #[Route('/{id}/approve', name: 'admin_service_approve', methods: ['POST'])]
    public function approve(Service $service, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('approve'.$service->getId(), $request->request->get('_token'))) {
            $service->setIsActive(true);
            $em->flush();

            $this->addFlash('success', 'Service approved successfully!');
        }

        return $this->redirectToRoute('admin_services');
    }

    #[Route('/{id}/hide', name: 'admin_service_hide', methods: ['POST'])]
    public function hide(Service $service, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('hide'.$service->getId(), $request->request->get('_token'))) {
            $service->setIsActive(false);
            $em->flush();

            $this->addFlash('success', 'Service hidden successfully!');
        }

        return $this->redirectToRoute('admin_services');
    }
}
