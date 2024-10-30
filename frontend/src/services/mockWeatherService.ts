import { WeatherData, ForecastData } from '../types/weather';

class MockWeatherServiceImpl {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      temperature: 13,
      humidity: 84,
      condition: 'Cloudy',
      windSpeed: 5,
      windDirection: 0,
      uvIndex: 2,
      visibility: 134,
      rainChance: 80,
      country: 'USA',
      maxTemp: 15,
      minTemp: 10
    };
  }

  async getForecast(city: string): Promise<ForecastData[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { date: 'Today', temperature: 13, condition: 'Cloudy', minTemp: 8, maxTemp: 13 },
      { date: 'Sat', temperature: 10, condition: 'Partly Cloudy', minTemp: 7, maxTemp: 10 },
      { date: 'Sun', temperature: 8, condition: 'Cloudy', minTemp: 5, maxTemp: 8 },
      { date: 'Mon', temperature: 11, condition: 'Rain', minTemp: 7, maxTemp: 11 },
      { date: 'Tue', temperature: 24, condition: 'Sunny', minTemp: 18, maxTemp: 24 },
      { date: 'Wed', temperature: 12, condition: 'Partly Cloudy', minTemp: 9, maxTemp: 12 },
      { date: 'Thu', temperature: 10, condition: 'Cloudy', minTemp: 7, maxTemp: 10 },
    ];
  }

  async getUserCities(): Promise<string[]> {
    return ['Washington DC, USA', 'Lisboa, Portugal', 'Kyiv, Ukraine', 'Berlin, Germany'];
  }

  async addCity(city: string): Promise<boolean> {
    return true;
  }

  async removeCity(city: string): Promise<boolean> {
    return true;
  }

  async setProvider(provider: string): Promise<boolean> {
    return true;
  }
}

// Export the mock service for development
export const MockWeatherService = new MockWeatherServiceImpl();