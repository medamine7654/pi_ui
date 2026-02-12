<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    /**
     * Find categories by type (service or tool)
     */
    public function findByType(string $type): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.type = :type')
            ->setParameter('type', $type)
            ->orderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get category statistics
     */
    public function getCategoryStats(): array
    {
        return $this->createQueryBuilder('c')
            ->select('c.id, c.name, c.type, c.icon, COUNT(DISTINCT s.id) as serviceCount, COUNT(DISTINCT t.id) as toolCount')
            ->leftJoin('c.services', 's')
            ->leftJoin('c.tools', 't')
            ->groupBy('c.id')
            ->orderBy('c.type', 'ASC')
            ->addOrderBy('c.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
