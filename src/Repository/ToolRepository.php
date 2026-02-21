<?php

namespace App\Repository;

use App\Entity\Tool;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ToolRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tool::class);
    }

    public function findAllActive(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByHost(User $host): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.host = :host')
            ->setParameter('host', $host)
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAllForAdmin(): array
    {
        return $this->createQueryBuilder('t')
            ->orderBy('t.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search and filter tools with sorting
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
        $qb = $this->createQueryBuilder('t')
            ->where('t.isActive = :active')
            ->setParameter('active', true);

        // Search query (case-insensitive, partial match)
        if ($query) {
            $qb->andWhere('LOWER(t.name) LIKE LOWER(:query) OR LOWER(t.description) LIKE LOWER(:query)')
               ->setParameter('query', '%' . $query . '%');
        }

        // Category filter
        if ($category) {
            $qb->andWhere('t.category = :category')
               ->setParameter('category', $category);
        }

        // Location filter (case-insensitive, partial match)
        if ($location) {
            $qb->andWhere('LOWER(t.location) LIKE LOWER(:location)')
               ->setParameter('location', '%' . $location . '%');
        }

        // Price range (pricePerDay for tools)
        if ($minPrice !== null) {
            $qb->andWhere('t.pricePerDay >= :minPrice')
               ->setParameter('minPrice', $minPrice);
        }

        if ($maxPrice !== null) {
            $qb->andWhere('t.pricePerDay <= :maxPrice')
               ->setParameter('maxPrice', $maxPrice);
        }

        // Sorting
        switch ($sortBy) {
            case 'date_asc':
                $qb->orderBy('t.createdAt', 'ASC');
                break;
            case 'price_asc':
                $qb->orderBy('t.pricePerDay', 'ASC');
                break;
            case 'price_desc':
                $qb->orderBy('t.pricePerDay', 'DESC');
                break;
            case 'name_asc':
                $qb->orderBy('t.name', 'ASC');
                break;
            case 'name_desc':
                $qb->orderBy('t.name', 'DESC');
                break;
            case 'date_desc':
            default:
                $qb->orderBy('t.createdAt', 'DESC');
                break;
        }

        return $qb;
    }
}
