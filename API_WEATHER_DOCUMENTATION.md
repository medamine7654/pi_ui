# Weather API Documentation

This API provides weather information for logements based on their location using the Open-Meteo weather service.

## Endpoints

### 1. Get Weather for a Specific Logement

**Endpoint:** `GET /api/weather/logement/{id}`

**Description:** Returns current weather and 3-day forecast for a specific logement based on its location.

**Parameters:**
- `id` (path parameter): The ID of the logement

**Example Request:**
```
GET /api/weather/logement/1
```

**Example Response:**
```json
{
  "logement": {
    "id": 1,
    "name": "Cozy Studio in Downtown Tunis",
    "city": "Tunis",
    "country": "Tunisia",
    "address": "15 Avenue Habib Bourguiba"
  },
  "weather": {
    "success": true,
    "city": "Tunis",
    "coordinates": {
      "latitude": 36.8065,
      "longitude": 10.1815
    },
    "current": {
      "temperature": 18.5,
      "feels_like": 17.2,
      "humidity": 65,
      "precipitation": 0,
      "wind_speed": 12.5,
      "weather_code": 1,
      "description": "Partly cloudy",
      "unit": "°C"
    },
    "forecast": [
      {
        "date": "2026-02-23",
        "temp_max": 20.5,
        "temp_min": 14.2,
        "precipitation": 0,
        "weather_code": 1,
        "description": "Partly cloudy"
      },
      {
        "date": "2026-02-24",
        "temp_max": 21.0,
        "temp_min": 15.0,
        "precipitation": 2.5,
        "weather_code": 61,
        "description": "Rain"
      },
      {
        "date": "2026-02-25",
        "temp_max": 19.5,
        "temp_min": 13.8,
        "precipitation": 0,
        "weather_code": 0,
        "description": "Clear sky"
      }
    ],
    "timezone": "Africa/Tunis"
  }
}
```

### 2. Get Weather for All Active Logements

**Endpoint:** `GET /api/weather/logements`

**Description:** Returns weather information for all active logements. Optimized to avoid duplicate API calls for logements in the same city.

**Example Request:**
```
GET /api/weather/logements
```

**Example Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "logement": {
        "id": 1,
        "name": "Cozy Studio in Downtown Tunis",
        "city": "Tunis",
        "country": "Tunisia",
        "price_per_night": "45.00"
      },
      "weather": {
        "success": true,
        "city": "Tunis",
        "current": { ... },
        "forecast": [ ... ]
      }
    },
    ...
  ]
}
```

### 3. Get Weather by City Name

**Endpoint:** `GET /api/weather/city/{city}`

**Description:** Returns weather information for any city by name.

**Parameters:**
- `city` (path parameter): The name of the city

**Example Request:**
```
GET /api/weather/city/Tunis
```

**Example Response:**
```json
{
  "success": true,
  "city": "Tunis",
  "coordinates": {
    "latitude": 36.8065,
    "longitude": 10.1815
  },
  "current": {
    "temperature": 18.5,
    "feels_like": 17.2,
    "humidity": 65,
    "precipitation": 0,
    "wind_speed": 12.5,
    "weather_code": 1,
    "description": "Partly cloudy",
    "unit": "°C"
  },
  "forecast": [ ... ],
  "timezone": "Africa/Tunis"
}
```

## Weather Codes

The API uses WMO Weather interpretation codes:

- `0`: Clear sky
- `1, 2, 3`: Partly cloudy
- `45, 48`: Foggy
- `51, 53, 55`: Drizzle
- `61, 63, 65`: Rain
- `71, 73, 75`: Snow
- `80, 81, 82`: Rain showers
- `85, 86`: Snow showers
- `95`: Thunderstorm
- `96, 99`: Thunderstorm with hail

## Error Responses

**Logement Not Found (404):**
```json
{
  "success": false,
  "error": "Logement not found"
}
```

**Location Not Available (400):**
```json
{
  "success": false,
  "error": "Logement location not available"
}
```

**City Not Found:**
```json
{
  "success": false,
  "error": "City not found"
}
```

## Integration in Views

Weather information is automatically displayed on the logement detail page when viewing a property. The weather widget shows:
- Current temperature and conditions
- Feels like temperature
- Humidity percentage
- Wind speed
- Precipitation (if any)
- 3-day forecast with high/low temperatures

## Data Source

Weather data is provided by [Open-Meteo](https://open-meteo.com/), a free weather API that doesn't require an API key.

## Notes

- Weather data is fetched in real-time when the API is called
- The service caches city coordinates to optimize performance when multiple logements are in the same city
- All temperatures are in Celsius (°C)
- Wind speed is in km/h
- Precipitation is in mm
- The API is free and doesn't require authentication
