<?php

namespace App\Controller\Admin;

use App\Entity\Tool;
use App\Repository\ToolRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/admin/tools')]
#[IsGranted('ROLE_ADMIN')]
class AdminToolController extends AbstractController
{
    #[Route('/', name: 'admin_tools')]
    public function index(ToolRepository $toolRepository): Response
    {
        $tools = $toolRepository->findAllForAdmin();

        return $this->render('admin/tools/index.html.twig', [
            'tools' => $tools,
        ]);
    }

    #[Route('/{id}/approve', name: 'admin_tool_approve', methods: ['POST'])]
    public function approve(Tool $tool, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('approve'.$tool->getId(), $request->request->get('_token'))) {
            $tool->setIsActive(true);
            $em->flush();

            $this->addFlash('success', 'Tool approved successfully!');
        }

        return $this->redirectToRoute('admin_tools');
    }

    #[Route('/{id}/hide', name: 'admin_tool_hide', methods: ['POST'])]
    public function hide(Tool $tool, Request $request, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('hide'.$tool->getId(), $request->request->get('_token'))) {
            $tool->setIsActive(false);
            $em->flush();

            $this->addFlash('success', 'Tool hidden successfully!');
        }

        return $this->redirectToRoute('admin_tools');
    }
}
