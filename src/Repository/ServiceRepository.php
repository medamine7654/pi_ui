<?php

namespace App\Repository;

use App\Entity\Service;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Service::class);
    }

    public function findAllActive(): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByHost(User $host): array
    {
        return $this->createQueryBuilder('s')
            ->where('s.host = :host')
            ->setParameter('host', $host)
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAllForAdmin(): array
    {
        return $this->createQueryBuilder('s')
            ->orderBy('s.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Search and filter services with sorting
     */
    public function findBySearchFilters(
        ?string $query,
        ?\App\Entity\Category $category,
        ?string $location,
        ?float $minPrice,
        ?float $maxPrice,
        ?string $sortBy = 'date_desc'
    ): array {
        $qb = $this->createQueryBuilder('s')
            ->where('s.isActive = :active')
            ->setParameter('active', true);

        // Search query (case-insensitive, partial match)
        if ($query) {
            $qb->andWhere('LOWER(s.name) LIKE LOWER(:query) OR LOWER(s.description) LIKE LOWER(:query)')
               ->setParameter('query', '%' . $query . '%');
        }

        // Category filter
        if ($category) {
            $qb->andWhere('s.category = :category')
               ->setParameter('category', $category);
        }

        // Location filter (case-insensitive, partial match)
        if ($location) {
            $qb->andWhere('LOWER(s.location) LIKE LOWER(:location)')
               ->setParameter('location', '%' . $location . '%');
        }

        // Price range
        if ($minPrice !== null) {
            $qb->andWhere('s.basePrice >= :minPrice')
               ->setParameter('minPrice', $minPrice);
        }

        if ($maxPrice !== null) {
            $qb->andWhere('s.basePrice <= :maxPrice')
               ->setParameter('maxPrice', $maxPrice);
        }

        // Sorting
        switch ($sortBy) {
            case 'date_asc':
                $qb->orderBy('s.createdAt', 'ASC');
                break;
            case 'price_asc':
                $qb->orderBy('s.basePrice', 'ASC');
                break;
            case 'price_desc':
                $qb->orderBy('s.basePrice', 'DESC');
                break;
            case 'name_asc':
                $qb->orderBy('s.name', 'ASC');
                break;
            case 'name_desc':
                $qb->orderBy('s.name', 'DESC');
                break;
            case 'date_desc':
            default:
                $qb->orderBy('s.createdAt', 'DESC');
                break;
        }

        return $qb->getQuery()->getResult();
    }
}
