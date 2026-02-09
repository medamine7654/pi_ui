<?php

namespace App\Repository;

use App\Entity\Service;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Service>
 */
class ServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Service::class);
    }

    /**
     * @return Service[]
     */
    public function searchByTerm(?string $term): array
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.user', 'u')
            ->addSelect('u')
            ->orderBy('s.dateService', 'DESC');

        if ($term !== null && trim($term) !== '') {
            $qb
                ->andWhere('s.titre LIKE :term OR s.description LIKE :term')
                ->setParameter('term', '%' . trim($term) . '%');
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Service[]
     */
    public function findForAdmin(?string $search, string $sort): array
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.user', 'u')
            ->addSelect('u');

        if ($search !== null && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $qb
                ->andWhere('s.titre LIKE :term OR s.description LIKE :term OR u.email LIKE :term')
                ->setParameter('term', $term);
        }

        $this->applyAdminSort($qb, $sort);

        return $qb->getQuery()->getResult();
    }

    public function getAdminStats(): array
    {
        $total = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $now = new \DateTimeImmutable();
        $todayStart = $now->setTime(0, 0, 0);
        $todayEnd = $todayStart->modify('+1 day');

        $upcoming = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->andWhere('s.dateService >= :now')
            ->setParameter('now', $now)
            ->getQuery()
            ->getSingleScalarResult();

        $past = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->andWhere('s.dateService < :now')
            ->setParameter('now', $now)
            ->getQuery()
            ->getSingleScalarResult();

        $today = (int) $this->createQueryBuilder('s')
            ->select('COUNT(s.id)')
            ->andWhere('s.dateService >= :start')
            ->andWhere('s.dateService < :end')
            ->setParameter('start', $todayStart)
            ->setParameter('end', $todayEnd)
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $total,
            'upcoming' => $upcoming,
            'past' => $past,
            'today' => $today,
        ];
    }

    private function applyAdminSort(\Doctrine\ORM\QueryBuilder $qb, string $sort): void
    {
        if ($sort === 'title_asc') {
            $qb->orderBy('s.titre', 'ASC');
            return;
        }

        if ($sort === 'title_desc') {
            $qb->orderBy('s.titre', 'DESC');
            return;
        }

        if ($sort === 'date_asc') {
            $qb->orderBy('s.dateService', 'ASC');
            return;
        }

        if ($sort === 'owner') {
            $qb->orderBy('u.email', 'ASC')->addOrderBy('s.id', 'DESC');
            return;
        }

        $qb->orderBy('s.dateService', 'DESC');
    }
}
