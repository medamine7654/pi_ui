<?php

namespace App\Repository;

use App\Entity\Home;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Home>
 *
 * @method Home|null find($id, $lockMode = null, $lockVersion = null)
 * @method Home|null findOneBy(array $criteria, array $orderBy = null)
 * @method Home[]    findAll()
 * @method Home[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HomeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Home::class);
    }

    public function findAllActive(): array
    {
        return $this->createQueryBuilder('h')
            ->where('h.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('h.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByHost(User $host): array
    {
        return $this->createQueryBuilder('h')
            ->where('h.host = :host')
            ->setParameter('host', $host)
            ->orderBy('h.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
