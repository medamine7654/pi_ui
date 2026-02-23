<?php

namespace App\Repository;

use App\Entity\Logement;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class LogementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Logement::class);
    }

    public function findAllActive(): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByHost(User $host): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.host = :host')
            ->setParameter('host', $host)
            ->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAllForAdmin(): array
    {
        return $this->createQueryBuilder('l')
            ->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search and filter logements with sorting
     * Returns QueryBuilder for pagination support
     */
    public function findBySearchFiltersQuery(
        ?string $query,
        ?\App\Entity\Category $category,
        ?string $location,
        ?float $minPrice,
        ?float $maxPrice,
        ?string $sortBy = 'date_desc'
    ) {
        $qb = $this->createQueryBuilder('l')
            ->where('l.isActive = :active')
            ->setParameter('active', true);

        // Search query (case-insensitive, partial match)
        if ($query) {
            $qb->andWhere('LOWER(l.name) LIKE LOWER(:query) OR LOWER(l.description) LIKE LOWER(:query)')
               ->setParameter('query', '%' . $query . '%');
        }

        // Category filter
        if ($category) {
            $qb->andWhere('l.category = :category')
               ->setParameter('category', $category);
        }

        // Location filter (case-insensitive, partial match - searches city and country)
        if ($location) {
            $qb->andWhere('LOWER(l.city) LIKE LOWER(:location) OR LOWER(l.country) LIKE LOWER(:location)')
               ->setParameter('location', '%' . $location . '%');
        }

        // Price range
        if ($minPrice !== null) {
            $qb->andWhere('l.pricePerNight >= :minPrice')
               ->setParameter('minPrice', $minPrice);
        }

        if ($maxPrice !== null) {
            $qb->andWhere('l.pricePerNight <= :maxPrice')
               ->setParameter('maxPrice', $maxPrice);
        }

        // Sorting
        switch ($sortBy) {
            case 'date_asc':
                $qb->orderBy('l.createdAt', 'ASC');
                break;
            case 'price_asc':
                $qb->orderBy('l.pricePerNight', 'ASC');
                break;
            case 'price_desc':
                $qb->orderBy('l.pricePerNight', 'DESC');
                break;
            case 'name_asc':
                $qb->orderBy('l.name', 'ASC');
                break;
            case 'name_desc':
                $qb->orderBy('l.name', 'DESC');
                break;
            case 'date_desc':
            default:
                $qb->orderBy('l.createdAt', 'DESC');
                break;
        }

        return $qb;
    }

    /**
     * Find similar logements using AI-powered recommendation algorithm
     * Scoring: Category match (50%) + Price range ±25% (30%) + City match (20%)
     */
    public function findSimilar(Logement $logement, int $limit = 3): array
    {
        $categoryId = $logement->getCategory()?->getId();
        $price = $logement->getPricePerNight();
        $city = $logement->getCity();
        
        // Calculate price range (±25%)
        $minPrice = $price * 0.75;
        $maxPrice = $price * 1.25;

        $qb = $this->createQueryBuilder('l')
            ->where('l.id != :currentId')
            ->andWhere('l.isActive = :active')
            ->setParameter('currentId', $logement->getId())
            ->setParameter('active', true);

        // If category exists, prioritize same category
        if ($categoryId) {
            $qb->andWhere('l.category = :category')
               ->setParameter('category', $logement->getCategory());
        }

        // Add scoring logic
        $qb->addSelect('
            (CASE WHEN l.category = :categoryParam THEN 50 ELSE 0 END) +
            (CASE WHEN l.pricePerNight BETWEEN :minPrice AND :maxPrice THEN 30 ELSE 0 END) +
            (CASE WHEN l.city = :city THEN 20 ELSE 0 END) as HIDDEN score
        ')
        ->setParameter('categoryParam', $logement->getCategory())
        ->setParameter('minPrice', $minPrice)
        ->setParameter('maxPrice', $maxPrice)
        ->setParameter('city', $city)
        ->orderBy('score', 'DESC')
        ->addOrderBy('l.createdAt', 'DESC')
        ->setMaxResults($limit);

        return $qb->getQuery()->getResult();
    }

    /**
     * Get all prices for logements in a specific category
     * Used for price suggestion algorithm
     */
    public function getPricesByCategory(\App\Entity\Category $category): array
    {
        $results = $this->createQueryBuilder('l')
            ->select('l.pricePerNight')
            ->where('l.category = :category')
            ->andWhere('l.isActive = :active')
            ->setParameter('category', $category)
            ->setParameter('active', true)
            ->getQuery()
            ->getResult();

        // Extract prices from result array
        return array_map(fn($item) => (float) $item['pricePerNight'], $results);
    }
}
