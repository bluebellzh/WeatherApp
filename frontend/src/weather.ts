// Weather provider constants
export const WeatherProvider = {
    OPENWEATHER: 'openweather',
    WEATHERAPI: 'weatherapi',
  } as const;
  
  // Update frequency constants (in milliseconds)
  export const UpdateFrequency = {
    FIVE_MINUTES: 5 * 60 * 1000,    // 300000ms
    FIFTEEN_MINUTES: 15 * 60 * 1000, // 900000ms
    THIRTY_MINUTES: 30 * 60 * 1000,  // 1800000ms
    ONE_HOUR: 60 * 60 * 1000,       // 3600000ms
  } as const;
  
  // Temperature unit constants
  export const TemperatureUnit = {
    CELSIUS: 'celsius',
    FAHRENHEIT: 'fahrenheit',
  } as const;
  
  // Weather condition constants
  export const WeatherCondition = {
    SUNNY: 'sunny',
    CLOUDY: 'cloudy',
    RAINY: 'rainy',
    SNOWY: 'snowy',
    STORMY: 'stormy',
    PARTLY_CLOUDY: 'partly_cloudy',
  } as const;
  
  // UI constants
  export const UI = {
    SIDEBAR_WIDTH: 380,
    DRAWER_WIDTH: 240,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 48,
  } as const;
  
  // Wind direction constants
  export const WindDirection = {
    NORTH: 'N',
    NORTH_EAST: 'NE',
    EAST: 'E',
    SOUTH_EAST: 'SE',
    SOUTH: 'S',
    SOUTH_WEST: 'SW',
    WEST: 'W',
    NORTH_WEST: 'NW',
  } as const;
  
  // TypeScript type definitions
  export type WeatherProviderType = typeof WeatherProvider[keyof typeof WeatherProvider];
  export type TemperatureUnitType = typeof TemperatureUnit[keyof typeof TemperatureUnit];
  export type UpdateFrequencyType = typeof UpdateFrequency[keyof typeof UpdateFrequency];
  export type WeatherConditionType = typeof WeatherCondition[keyof typeof WeatherCondition];
  export type WindDirectionType = typeof WindDirection[keyof typeof WindDirection];
  
  // Storage keys
  export const STORAGE_KEYS = {
    CITIES: 'weather-app-cities',
    SELECTED_CITY: 'weather-app-selected-city',
    SETTINGS: 'weather-app-settings',
  } as const;