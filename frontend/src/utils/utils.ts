import { WindDirection, WindDirectionType } from '../weather';

export const convertTemperature = (celsius: number, unit: string): number => {
    if (unit === 'fahrenheit') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

export function getWindDirection(degrees: number): WindDirectionType {
  // Normalize the angle to be between 0 and 360
  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  
  // Define the ranges for each direction (each range is 45 degrees)
  if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) {
    return WindDirection.NORTH;
  } else if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) {
    return WindDirection.NORTH_EAST;
  } else if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) {
    return WindDirection.EAST;
  } else if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) {
    return WindDirection.SOUTH_EAST;
  } else if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) {
    return WindDirection.SOUTH;
  } else if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) {
    return WindDirection.SOUTH_WEST;
  } else if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) {
    return WindDirection.WEST;
  } else {
    return WindDirection.NORTH_WEST;
  }
}