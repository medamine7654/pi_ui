<?php

namespace App\Repository;

use App\Entity\Materiel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Materiel>
 */
class MaterielRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Materiel::class);
    }

    /**
     * @return Materiel[]
     */
    public function searchByTerm(?string $term, bool $availableOnly = false): array
    {
        $qb = $this->createQueryBuilder('m')
            ->orderBy('m.id', 'DESC');

        if ($term !== null && trim($term) !== '') {
            $qb
                ->andWhere('m.nom LIKE :term OR m.etat LIKE :term')
                ->setParameter('term', '%' . trim($term) . '%');
        }

        if ($availableOnly) {
            $qb->andWhere('m.disponible = :available')
                ->setParameter('available', true);
        }

        return $qb->getQuery()->getResult();
    }

    /**
     * @return Materiel[]
     */
    public function findForAdmin(?string $search, ?string $status, string $sort): array
    {
        $qb = $this->createQueryBuilder('m');

        if ($search !== null && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $qb
                ->andWhere('m.nom LIKE :term OR m.etat LIKE :term')
                ->setParameter('term', $term);
        }

        if ($status === 'available') {
            $qb->andWhere('m.disponible = true');
        } elseif ($status === 'unavailable') {
            $qb->andWhere('m.disponible = false');
        }

        $this->applyAdminSort($qb, $sort);

        return $qb->getQuery()->getResult();
    }

    public function getAdminStats(): array
    {
        $total = (int) $this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $available = (int) $this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->andWhere('m.disponible = true')
            ->getQuery()
            ->getSingleScalarResult();

        $unavailable = max($total - $available, 0);

        $withEtat = (int) $this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->andWhere('m.etat IS NOT NULL')
            ->andWhere("m.etat <> ''")
            ->getQuery()
            ->getSingleScalarResult();

        return [
            'total' => $total,
            'available' => $available,
            'unavailable' => $unavailable,
            'withEtat' => $withEtat,
        ];
    }

    private function applyAdminSort(\Doctrine\ORM\QueryBuilder $qb, string $sort): void
    {
        if ($sort === 'name_asc') {
            $qb->orderBy('m.nom', 'ASC');
            return;
        }

        if ($sort === 'name_desc') {
            $qb->orderBy('m.nom', 'DESC');
            return;
        }

        if ($sort === 'etat') {
            $qb->orderBy('m.etat', 'ASC')->addOrderBy('m.nom', 'ASC');
            return;
        }

        if ($sort === 'available_first') {
            $qb->orderBy('m.disponible', 'DESC')->addOrderBy('m.nom', 'ASC');
            return;
        }

        if ($sort === 'oldest') {
            $qb->orderBy('m.id', 'ASC');
            return;
        }

        $qb->orderBy('m.id', 'DESC');
    }
}
