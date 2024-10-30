import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherHeader } from './WeatherHeader';
import { TemperatureUnit } from '../weather';

describe('WeatherHeader', () => {
  const mockWeatherData = {
    temperature: 20,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 5,
    windDirection: 45,
    uvIndex: 6,
    chanceOfRain: 10,
    rainChance: 10,
    visibility: 10,
    maxTemp: 22,
    minTemp: 18,
    country: 'GB',
  };

  const defaultProps = {
    selectedCity: 'London',
    currentWeather: mockWeatherData,
    temperatureUnit: TemperatureUnit.CELSIUS,
  };

  it('renders city name and country', () => {
    render(<WeatherHeader {...defaultProps} />);
    
    expect(screen.getByText('London, GB')).toBeInTheDocument();
  });

  it('renders with location icon', () => {
    render(<WeatherHeader {...defaultProps} />);
    
    expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
  });

  it('renders with different city and country', () => {
    const props = {
      ...defaultProps,
      selectedCity: 'Paris',
      currentWeather: { ...mockWeatherData, country: 'FR' },
    };

    render(<WeatherHeader {...props} />);
    
    expect(screen.getByText('Paris, FR')).toBeInTheDocument();
  });
});