<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public const SERVICE_CATEGORIES = [
        ['name' => 'Plumbing', 'description' => 'Plumbing and pipe services', 'icon' => 'fa-solid fa-pipe'],
        ['name' => 'Electrical', 'description' => 'Electrical repairs and installations', 'icon' => 'fa-solid fa-bolt'],
        ['name' => 'Gardening', 'description' => 'Garden maintenance and landscaping', 'icon' => 'fa-solid fa-seedling'],
        ['name' => 'Cleaning', 'description' => 'House and office cleaning services', 'icon' => 'fa-solid fa-broom'],
        ['name' => 'Painting', 'description' => 'Interior and exterior painting', 'icon' => 'fa-solid fa-paint-roller'],
        ['name' => 'Moving', 'description' => 'Moving and transport services', 'icon' => 'fa-solid fa-truck-moving'],
        ['name' => 'Tutoring', 'description' => 'Educational tutoring services', 'icon' => 'fa-solid fa-book-open'],
        ['name' => 'IT Support', 'description' => 'Computer and tech support', 'icon' => 'fa-solid fa-laptop'],
    ];

    public const TOOL_CATEGORIES = [
        ['name' => 'Power Tools', 'description' => 'Electric and battery-powered tools', 'icon' => 'fa-solid fa-screwdriver-wrench'],
        ['name' => 'Hand Tools', 'description' => 'Manual tools and equipment', 'icon' => 'fa-solid fa-hammer'],
        ['name' => 'Garden Tools', 'description' => 'Lawn and garden equipment', 'icon' => 'fa-solid fa-trowel'],
        ['name' => 'Ladders', 'description' => 'Ladders and scaffolding', 'icon' => 'fa-solid fa-ladder'],
        ['name' => 'Cleaning Equipment', 'description' => 'Vacuum cleaners and pressure washers', 'icon' => 'fa-solid fa-spray-can'],
        ['name' => 'Measuring Tools', 'description' => 'Levels, tape measures, and laser tools', 'icon' => 'fa-solid fa-ruler'],
        ['name' => 'Outdoor Equipment', 'description' => 'Camping and outdoor gear', 'icon' => 'fa-solid fa-campground'],
        ['name' => 'Party Equipment', 'description' => 'Tables, chairs, and party supplies', 'icon' => 'fa-solid fa-cake-candles'],
    ];

    // Reference constants for other fixtures
    public const PLUMBING_CATEGORY = 'category_plumbing';
    public const GARDENING_CATEGORY = 'category_gardening';
    public const POWER_TOOLS_CATEGORY = 'category_power_tools';
    public const GARDEN_TOOLS_CATEGORY = 'category_garden_tools';

    public function load(ObjectManager $manager): void
    {
        // Create service categories
        foreach (self::SERVICE_CATEGORIES as $index => $data) {
            $category = new Category();
            $category->setName($data['name'])
                ->setDescription($data['description'])
                ->setIcon($data['icon'])
                ->setType('service');
            
            $manager->persist($category);
            
            // Add references for commonly used categories
            if ($data['name'] === 'Plumbing') {
                $this->addReference(self::PLUMBING_CATEGORY, $category);
            } elseif ($data['name'] === 'Gardening') {
                $this->addReference(self::GARDENING_CATEGORY, $category);
            }
        }

        // Create tool categories
        foreach (self::TOOL_CATEGORIES as $index => $data) {
            $category = new Category();
            $category->setName($data['name'])
                ->setDescription($data['description'])
                ->setIcon($data['icon'])
                ->setType('tool');
            
            $manager->persist($category);
            
            // Add references for commonly used categories
            if ($data['name'] === 'Power Tools') {
                $this->addReference(self::POWER_TOOLS_CATEGORY, $category);
            } elseif ($data['name'] === 'Garden Tools') {
                $this->addReference(self::GARDEN_TOOLS_CATEGORY, $category);
            }
        }

        $manager->flush();
    }
}
