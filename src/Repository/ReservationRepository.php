<?php

namespace App\Repository;

use App\Entity\Reservation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Reservation>
 */
class ReservationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

    /**
     * @return Reservation[]
     */
    public function findByUserAndStatus(User $user, string $status): array
    {
        $qb = $this->createQueryBuilder('r')
            ->leftJoin('r.service', 's')
            ->addSelect('s')
            ->leftJoin('r.materiel', 'm')
            ->addSelect('m')
            ->andWhere('r.user = :user')
            ->setParameter('user', $user)
            ->orderBy('r.createdAt', 'DESC');

        if ($status !== 'all') {
            $qb->andWhere('r.status = :status')->setParameter('status', $status);
        }

        return $qb->getQuery()->getResult();
    }

    public function countConfirmedForMaterielExcludingReservation(int $materielId, int $excludeReservationId): int
    {
        return (int) $this->createQueryBuilder('r')
            ->select('COUNT(r.id)')
            ->andWhere('r.materiel = :materielId')
            ->andWhere('r.status = :status')
            ->andWhere('r.id != :excludeId')
            ->setParameter('materielId', $materielId)
            ->setParameter('status', 'confirmed')
            ->setParameter('excludeId', $excludeReservationId)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
