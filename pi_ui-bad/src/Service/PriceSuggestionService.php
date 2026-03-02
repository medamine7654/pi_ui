<?php

namespace App\Service;

use App\Entity\Category;
use App\Repository\ServiceRepository;
use App\Repository\ToolRepository;
use App\Repository\LogementRepository;

/**
 * AI-Powered Price Suggestion Service
 * Analyzes marketplace data to suggest optimal listing prices
 */
class PriceSuggestionService
{
    public function __construct(
        private ServiceRepository $serviceRepository,
        private ToolRepository $toolRepository,
        private LogementRepository $logementRepository
    ) {}

    /**
     * Get price suggestion for a service
     */
    public function getServicePriceSuggestion(?Category $category): ?array
    {
        if (!$category) {
            return null;
        }

        $prices = $this->serviceRepository->getPricesByCategory($category);
        
        if (empty($prices)) {
            return null;
        }

        return $this->calculateSuggestion($prices);
    }

    /**
     * Get price suggestion for a tool
     */
    public function getToolPriceSuggestion(?Category $category): ?array
    {
        if (!$category) {
            return null;
        }

        $prices = $this->toolRepository->getPricesByCategory($category);
        
        if (empty($prices)) {
            return null;
        }

        return $this->calculateSuggestion($prices);
    }

    /**
     * Get price suggestion for a logement
     */
    public function getLogementPriceSuggestion(?Category $category): ?array
    {
        if (!$category) {
            return null;
        }

        $prices = $this->logementRepository->getPricesByCategory($category);
        
        if (empty($prices)) {
            return null;
        }

        return $this->calculateSuggestion($prices);
    }

    /**
     * Calculate price suggestion from array of prices
     * Returns median, mean, min, max, and count
     */
    private function calculateSuggestion(array $prices): array
    {
        $count = count($prices);
        
        // Sort prices for median calculation
        sort($prices);
        
        // Calculate median
        $middle = floor($count / 2);
        if ($count % 2 == 0) {
            $median = ($prices[$middle - 1] + $prices[$middle]) / 2;
        } else {
            $median = $prices[$middle];
        }
        
        // Calculate mean (average)
        $mean = array_sum($prices) / $count;
        
        // Get min and max
        $min = min($prices);
        $max = max($prices);
        
        return [
            'suggested' => round($median, 2),  // Use median as suggested price
            'median' => round($median, 2),
            'mean' => round($mean, 2),
            'min' => round($min, 2),
            'max' => round($max, 2),
            'count' => $count,
            'range' => [round($min, 2), round($max, 2)]
        ];
    }
}
