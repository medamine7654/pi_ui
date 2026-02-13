<?php

namespace App\Controller;

use App\Form\SearchFilterType;
use App\Repository\ToolRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ToolController extends AbstractController
{
    #[Route('/tools', name: 'app_tools')]
    public function index(Request $request, ToolRepository $toolRepository): Response
    {
        // Create the search form
        $form = $this->createForm(SearchFilterType::class, null, ['type' => 'tool']);
        $form->handleRequest($request);

        // Get filter values
        $query = $form->get('query')->getData();
        $category = $form->get('category')->getData();
        $location = $form->get('location')->getData();
        $minPrice = $form->get('minPrice')->getData();
        $maxPrice = $form->get('maxPrice')->getData();
        $sortBy = $form->get('sortBy')->getData();

        // Fetch filtered tools
        $tools = $toolRepository->findBySearchFilters(
            $query,
            $category,
            $location,
            $minPrice,
            $maxPrice,
            $sortBy
        );

        return $this->render('tools/index.html.twig', [
            'tools' => $tools,
            'searchForm' => $form->createView(),
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
