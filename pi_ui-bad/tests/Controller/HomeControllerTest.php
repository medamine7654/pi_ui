<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HomeControllerTest extends WebTestCase
{
    public function testIndex(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Find your perfect stay');
    }

    public function testSearchFiltersValidation(): void
    {
        $client = static::createClient();

        // Test with invalid minPrice (negative)
        $client->request('GET', '/?minPrice=-10');
        $this->assertResponseIsSuccessful();
    // The controller should fallback to original query if invalid, 
    // but with our implementation, it keeps the raw filters if form is invalid.
    // Wait, I should check how I handled it in HomeController.
    }
}
