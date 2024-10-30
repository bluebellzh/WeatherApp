import { WeatherService } from '../weatherService';
import { WeatherServiceClient } from '../../proto/WeatherServiceClientPb';
import {
  WeatherRequest,
  WeatherResponse,
  ForecastRequest,
  ForecastResponse,
  DayForecast,
} from '../../proto/weather_pb';
import { RpcError } from 'grpc-web';
import { ClientReadableStream } from 'grpc-web';

// Mock the gRPC client
jest.mock('../../proto/WeatherServiceClientPb');

const mockWeatherStream = {
  on: jest.fn().mockReturnThis(),
  removeListener: jest.fn(),
  cancel: jest.fn(),
} as unknown as ClientReadableStream<WeatherResponse>;

const mockForecastStream = {
  on: jest.fn(),
  removeListener: jest.fn(),
  cancel: jest.fn(),
} as unknown as ClientReadableStream<ForecastResponse>;

describe('WeatherService', () => {
  let mockClient: jest.Mocked<WeatherServiceClient>;
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockClient = new WeatherServiceClient('') as jest.Mocked<WeatherServiceClient>;
    (WeatherServiceClient as jest.Mock).mockImplementation(() => mockClient);
    (WeatherService as any).client = mockClient;
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather successfully', async () => {
      const mockResponse = new WeatherResponse();
      mockResponse.setTemperature(20);
      mockResponse.setHumidity(65);
      mockResponse.setCondition('sunny');
      mockResponse.setWindSpeed(10);
      mockResponse.setWindDirection(180);
      mockResponse.setUvIndex(5);
      mockResponse.setVisibility(10000);
      mockResponse.setCountry('US');
      mockResponse.setMaxTemp(25);
      mockResponse.setMinTemp(15);

      mockClient.getCurrentWeather.mockImplementation((_, __, callback) => {
        callback(null as any, mockResponse);
        return mockWeatherStream;
      });

      const result = await WeatherService.getCurrentWeather(40.7128, -74.0060);

      expect(result).toEqual({
        temperature: 20,
        humidity: 65,
        condition: 'sunny',
        windSpeed: 10,
        windDirection: 180,
        uvIndex: 5,
        visibility: 10000,
        rainChance: 0,
        country: 'US',
        maxTemp: 25,
        minTemp: 15,
      });
    });

    it('should handle errors when fetching weather', async () => {
      const rpcError: RpcError = {
        code: 13,
        message: 'Network error',
        metadata: {},
        name: 'Error'
      };

      mockClient.getCurrentWeather.mockImplementation((_, __, callback) => {
        callback(rpcError, null as any);
        return mockWeatherStream;
      });

      await expect(
        WeatherService.getCurrentWeather(40.7128, -74.0060)
      ).rejects.toEqual(rpcError);
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast successfully', async () => {
      const mockResponse = new ForecastResponse();
      const forecastDay = new DayForecast();
      forecastDay.setDate('2024-03-20');
      forecastDay.setMaxTemp(25);
      forecastDay.setMinTemp(15);
      forecastDay.setCondition('sunny');
      
      mockResponse.setForecastsList([forecastDay]);

      mockClient.getForecast.mockImplementation((_, __, callback) => {
        callback(null as any, mockResponse);
        return mockForecastStream;
      });

      const result = await WeatherService.getForecast(40.7128, -74.0060, 1);

      expect(result).toEqual([{
        date: '2024-03-20',
        temperature: 25,
        minTemp: 15,
        maxTemp: 25,
        condition: 'sunny',
      }]);
    });

    it('should retry on connection errors', async () => {
      const rpcError: RpcError = {
        code: 13,
        message: 'Connection error',
        metadata: {},
        name: 'Error'
      };

      const mockResponse = new ForecastResponse();
      const forecastDay = new DayForecast();
      forecastDay.setDate('2024-03-20');
      forecastDay.setMaxTemp(25);
      forecastDay.setMinTemp(15);
      forecastDay.setCondition('sunny');
      mockResponse.setForecastsList([forecastDay]);

      let attempts = 0;
      mockClient.getForecast.mockImplementation((_, __, callback) => {
        attempts++;
        if (attempts < 3) {
          callback(rpcError, null as any);
        } else {
          callback(null as any, mockResponse);
        }
        return mockForecastStream;
      });

      const result = await WeatherService.getForecast(40.7128, -74.0060, 1);

      expect(attempts).toBe(3);
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe('2024-03-20');
    });
  });

  describe('calculateRainChance', () => {
    const testCases = [
      { condition: 'rain', expected: 80 },
      { condition: 'light rain', expected: 60 },
      { condition: 'thunderstorm', expected: 90 },
      { condition: 'sunny', expected: 0 },
      { condition: 'unknown condition', expected: 0 },
    ];

    testCases.forEach(({ condition, expected }) => {
      it(`should calculate rain chance correctly for ${condition}`, () => {
        const result = (WeatherService as any).calculateRainChance(condition);
        expect(result).toBe(expected);
      });
    });
  });

  describe('clientId management', () => {
    it('should create and store new clientId if none exists', () => {
      localStorage.clear();
      
      const clientId = (WeatherService as any).getOrCreateClientId();
      
      const storedClientId = localStorage.getItem('weatherClientId');
      expect(storedClientId).toBeTruthy();
      expect(storedClientId).toMatch(/^web-[a-z0-9]{9}$/);
    });

    it('should reuse existing clientId from localStorage', () => {
      const existingClientId = 'web-123456789';
      localStorage.setItem('weatherClientId', existingClientId);
      
      const clientId = (WeatherService as any).getOrCreateClientId();
      
      expect(clientId).toBe(existingClientId);
    });
  });
});