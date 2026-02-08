<?php

namespace App\Controller;

use App\Repository\ToolRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ToolController extends AbstractController
{
    #[Route('/tools', name: 'app_tools')]
    public function index(ToolRepository $toolRepository): Response
    {
        $tools = $toolRepository->findAllActive();

        return $this->render('tools/index.html.twig', [
            'tools' => $tools,
        ]);
    }

    #[Route('/tools/{id}', name: 'app_tool_show')]
    public function show(int $id, ToolRepository $toolRepository): Response
    {
        $tool = $toolRepository->find($id);

        if (!$tool || !$tool->getIsActive()) {
            throw $this->createNotFoundException('Tool not found');
        }

        return $this->render('tools/show.html.twig', [
            'tool' => $tool,
        ]);
    }
}
