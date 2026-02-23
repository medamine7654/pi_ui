<?php

namespace App\Controller\Api;

use App\Repository\LogementRepository;
use App\Service\WeatherService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/weather', name: 'api_weather_')]
class WeatherApiController extends AbstractController
{
    public function __construct(
        private WeatherService $weatherService,
        private LogementRepository $logementRepository
    ) {
    }

    /**
     * Get weather for a specific logement
     */
    #[Route('/logement/{id}', name: 'logement', methods: ['GET'])]
    public function getLogementWeather(int $id): JsonResponse
    {
        $logement = $this->logementRepository->find($id);

        if (!$logement) {
            return $this->json([
                'success' => false,
                'error' => 'Logement not found'
            ], 404);
        }

        $city = $logement->getCity();
        $country = $logement->getCountry();

        if (!$city) {
            return $this->json([
                'success' => false,
                'error' => 'Logement location not available'
            ], 400);
        }

        $weatherData = $this->weatherService->getWeatherByCity($city, $country);

        return $this->json([
            'logement' => [
                'id' => $logement->getId(),
                'name' => $logement->getName(),
                'city' => $city,
                'country' => $country,
                'address' => $logement->getAddress()
            ],
            'weather' => $weatherData
        ]);
    }

    /**
     * Get weather for all active logements
     */
    #[Route('/logements', name: 'all_logements', methods: ['GET'])]
    public function getAllLogementsWeather(): JsonResponse
    {
        $logements = $this->logementRepository->findBy(['isActive' => true]);

        $results = [];
        $processedCities = []; // Cache to avoid duplicate API calls for same city

        foreach ($logements as $logement) {
            $city = $logement->getCity();
            $country = $logement->getCountry();

            if (!$city) {
                continue;
            }

            // Create a cache key for the city
            $cacheKey = strtolower($city . '_' . $country);

            // Check if we already fetched weather for this city
            if (!isset($processedCities[$cacheKey])) {
                $processedCities[$cacheKey] = $this->weatherService->getWeatherByCity($city, $country);
            }

            $results[] = [
                'logement' => [
                    'id' => $logement->getId(),
                    'name' => $logement->getName(),
                    'city' => $city,
                    'country' => $country,
                    'price_per_night' => $logement->getPricePerNight()
                ],
                'weather' => $processedCities[$cacheKey]
            ];
        }

        return $this->json([
            'success' => true,
            'count' => count($results),
            'data' => $results
        ]);
    }

    /**
     * Get weather by city name
     */
    #[Route('/city/{city}', name: 'city', methods: ['GET'])]
    public function getWeatherByCity(string $city): JsonResponse
    {
        $weatherData = $this->weatherService->getWeatherByCity($city);

        return $this->json($weatherData);
    }
}
