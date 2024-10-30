export interface WeatherData {
    temperature: number;
    humidity: number;
    condition: string;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    visibility: number;
    rainChance: number;
    country: string;
    maxTemp: number;
    minTemp: number;
  }
  
  export interface ForecastData {
    date: string;
    temperature: number;
    condition: string;
    minTemp: number;
    maxTemp: number;
  }
  
  export interface WeatherProvider {
    id: string;
    name: string;
  }
  
  export interface CityData {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temperature: number;
    condition: string;
    chanceOfRain: number;
  }