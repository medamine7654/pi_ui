<?php

namespace App\Controller;

use App\Form\SearchFilterType;
use App\Repository\FavoriteRepository;
use App\Repository\LogementRepository;
use App\Service\QualityScoreService;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LogementController extends AbstractController
{
    #[Route('/logements', name: 'app_logements')]
    public function index(
        Request $request, 
        LogementRepository $logementRepository, 
        QualityScoreService $qualityScoreService, 
        FavoriteRepository $favoriteRepository,
        PaginatorInterface $paginator
    ): Response {
        // Create the search form
        $form = $this->createForm(SearchFilterType::class, null, ['type' => 'logement']);
        $form->handleRequest($request);

        // Get filter values
        $query = $form->get('query')->getData();
        $category = $form->get('category')->getData();
        $location = $form->get('location')->getData();
        $minPrice = $form->get('minPrice')->getData();
        $maxPrice = $form->get('maxPrice')->getData();
        $sortBy = $form->get('sortBy')->getData();

        // Get QueryBuilder for filtered logements
        $queryBuilder = $logementRepository->findBySearchFiltersQuery(
            $query,
            $category,
            $location,
            $minPrice,
            $maxPrice,
            $sortBy
        );

        // Paginate results
        $pagination = $paginator->paginate(
            $queryBuilder,
            $request->query->getInt('page', 1),
            12 // items per page
        );

        // Calculate quality scores and check favorites for each logement
        $logementsWithScores = [];
        $user = $this->getUser();
        foreach ($pagination as $logement) {
            $isFavorite = false;
            if ($user) {
                $isFavorite = $favoriteRepository->isFavorite($user, 'logement', $logement->getId());
            }
            
            $logementsWithScores[] = [
                'logement' => $logement,
                'qualityScore' => $qualityScoreService->calculateLogementScore($logement),
                'isFavorite' => $isFavorite,
            ];
        }

        return $this->render('logements/index.html.twig', [
            'logementsWithScores' => $logementsWithScores,
            'pagination' => $pagination,
            'searchForm' => $form->createView(),
        ]);
    }

    #[Route('/logements/{id}', name: 'app_logement_show')]
    public function show(int $id, LogementRepository $logementRepository, QualityScoreService $qualityScoreService): Response
    {
        $logement = $logementRepository->find($id);

        if (!$logement || !$logement->getIsActive()) {
            throw $this->createNotFoundException('Logement not found');
        }

        $qualityScore = $qualityScoreService->calculateLogementScore($logement);

        return $this->render('logements/show.html.twig', [
            'logement' => $logement,
            'qualityScore' => $qualityScore,
        ]);
    }
}
