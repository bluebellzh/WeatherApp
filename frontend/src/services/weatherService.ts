import { WeatherServiceClient } from '../../../frontend/src/proto/WeatherServiceClientPb';
import {
  WeatherRequest,
  ForecastRequest,
  WeatherResponse,
  ForecastResponse,
} from '../../../frontend/src/proto/weather_pb';
import { WeatherData, ForecastData } from '../types/weather';

class WeatherServiceImpl {
  private client: WeatherServiceClient;
  private defaultProvider: string = 'openweather';
  private clientId: string;

  constructor() {
    this.client = new WeatherServiceClient('http://localhost:8080', {
      withCredentials: 'false',
      format: 'text',
      suppressCorsPreflight: 'false',
      headers: JSON.stringify({
        'Content-Type': 'application/grpc-web-text',
        'X-Requested-With': 'XMLHttpRequest'
      })
    });
    this.clientId = this.getOrCreateClientId();
  }

  private getOrCreateClientId(): string {
    // Try to get existing client ID from local storage
    const storedClientId = localStorage.getItem('weatherClientId');
    if (storedClientId) {
      return storedClientId;
    }

    // Generate new client ID if none exists
    const newClientId = 'web-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('weatherClientId', newClientId);
    return newClientId;
  }

  async getCurrentWeather(
    latitude: number,
    longitude: number,
    provider: string = this.defaultProvider
  ): Promise<WeatherData> {
    const request = new WeatherRequest();
    request.setLatitude(latitude);
    request.setLongitude(longitude);
    request.setClientId(this.clientId);
    request.setProvider(provider);

    try {
      const response = await new Promise<WeatherResponse>((resolve, reject) => {
        this.client.getCurrentWeather(
          request,
          null,
          (err: any, response: WeatherResponse) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          }
        );
      });

      if (!response) {
        throw new Error('Empty response received');
      }

      return {
        temperature: response.getTemperature(),
        humidity: response.getHumidity(),
        condition: response.getCondition(),
        windSpeed: response.getWindSpeed(),
        windDirection: response.getWindDirection(),
        uvIndex: response.getUvIndex(),
        visibility: response.getVisibility(),
        rainChance: this.calculateRainChance(response.getCondition()),
        country: response.getCountry(),
        maxTemp: response.getMaxTemp(),
        minTemp: response.getMinTemp(),
      };
    } catch (error) {
      throw error;
    }
  }

  async getForecast(
    latitude: number,
    longitude: number,
    days: number = 7,
    provider: string = this.defaultProvider
  ): Promise<ForecastData[]> {
    const request = new ForecastRequest();
    request.setLatitude(latitude);
    request.setLongitude(longitude);
    request.setClientId(this.clientId);
    request.setProvider(provider);
    request.setDays(days);

    const retryOperation = async (attempt = 1): Promise<ForecastResponse> => {
      try {
        const response = await new Promise<ForecastResponse>((resolve, reject) => {
          this.client.getForecast(
            request,
            null,
            (err: any, response: ForecastResponse) => {
              if (err) {
                reject(err);
              } else {
                resolve(response);
              }
            }
          );
        });

        if (!response) {
          throw new Error('No response received');
        }

        return response;
      } catch (error: any) {
        if (error.code === 13 && attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return retryOperation(attempt + 1);
        }
        throw error;
      }
    };

    const response = await retryOperation();
    return response.getForecastsList().map(forecast => ({
      date: forecast.getDate(),
      temperature: forecast.getMaxTemp(),
      minTemp: forecast.getMinTemp(),
      maxTemp: forecast.getMaxTemp(),
      condition: forecast.getCondition(),
    }));
  }

  private calculateRainChance(condition: string): number {
    // Simple algorithm to estimate rain chance based on condition
    const rainConditions: { [key: string]: number } = {
      'rain': 80,
      'light rain': 60,
      'shower': 70,
      'thunderstorm': 90,
      'drizzle': 50,
      'cloudy': 30,
      'partly cloudy': 20,
      'overcast': 40,
      'clear': 0,
      'sunny': 0,
    };

    const lowerCondition = condition.toLowerCase();
    return rainConditions[lowerCondition] || 0;
  }

  // Utility method to handle errors
  private handleError(error: any): never {
    console.error('WeatherService Error:', error);
    throw error;
  }
}

// Export a singleton instance
export const WeatherService = new WeatherServiceImpl();