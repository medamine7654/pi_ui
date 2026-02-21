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
}
