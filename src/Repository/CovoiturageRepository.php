<?php

namespace App\Repository;

use App\Entity\Covoiturage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Covoiturage>
 */
class CovoiturageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Covoiturage::class);
    }

    /**
     * @return Covoiturage[]
     */
    public function findLatestForFront(int $limit = 50): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.conducteur', 'u')
            ->addSelect('u')
            ->orderBy('c.dateDepart', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
