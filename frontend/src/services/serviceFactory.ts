import { WeatherService } from './weatherService';
import { MockWeatherService } from './mockWeatherService';

// Use mock service in development, real service in production
// export const weatherService = process.env.NODE_ENV === 'development' 
//   ? MockWeatherService 
//   : WeatherService;
export const weatherService = WeatherService;