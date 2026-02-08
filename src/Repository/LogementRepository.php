<?php

namespace App\Repository;

use App\Entity\Logement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Logement>
 */
class LogementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Logement::class);
    }

    public function findActiveLogements(): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.status = :status')
            ->setParameter('status', 'active')
            ->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByFilters(array $filters): array
    {
        $qb = $this->createQueryBuilder('l')
            ->where('l.status = :status')
            ->setParameter('status', 'active');

        if (!empty($filters['category'])) {
            $qb->andWhere('l.category = :category')
                ->setParameter('category', $filters['category']);
        }

        if (!empty($filters['location'])) {
            $qb->andWhere('(l.location LIKE :location OR l.city LIKE :location OR l.country LIKE :location OR l.title LIKE :location)')
                ->setParameter('location', '%' . $filters['location'] . '%');
        }

        if (!empty($filters['minPrice'])) {
            $qb->andWhere('l.pricePerNight >= :minPrice')
                ->setParameter('minPrice', $filters['minPrice']);
        }

        if (!empty($filters['maxPrice'])) {
            $qb->andWhere('l.pricePerNight <= :maxPrice')
                ->setParameter('maxPrice', $filters['maxPrice']);
        }

        if (!empty($filters['guests'])) {
            $qb->andWhere('l.maxGuests >= :guests')
                ->setParameter('guests', $filters['guests']);
        }

        return $qb->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByOwner($owner): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.owner = :owner')
            ->setParameter('owner', $owner)
            ->orderBy('l.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findReported(): array
    {
        return $this->createQueryBuilder('l')
            ->where('l.status = :status')
            ->setParameter('status', 'reported')
            ->orderBy('l.updatedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
