import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCard } from './WeatherCard';
import { WeatherData } from '../types/weather';
import { TemperatureUnit } from '../weather';

// Mock the WeatherIcon component
jest.mock('./WeatherIcon', () => ({
  WeatherIcon: ({ condition, size }: { condition: string; size: string }) => (
    <div data-testid="weather-icon" data-condition={condition} data-size={size}>
      Weather Icon Mock
    </div>
  ),
}));

describe('WeatherCard', () => {
  const mockWeatherData: WeatherData = {
    temperature: 20,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 10,
    windDirection: 180,
    uvIndex: 5,
    visibility: 10000,
    rainChance: 10,
    maxTemp: 25,
    minTemp: 15,
    country: 'GB',
  };

  const defaultProps = {
    city: 'London',
    weather: mockWeatherData,
    temperatureUnit: TemperatureUnit.CELSIUS,
  };

  it('renders weather information correctly in Celsius', () => {
    render(<WeatherCard {...defaultProps} />);

    // Check if main weather information is displayed
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Chance of rain 10%')).toBeInTheDocument();

    // Check if weather metrics are displayed
    expect(screen.getByText('65%')).toBeInTheDocument(); // Humidity
    expect(screen.getByText('5 UV')).toBeInTheDocument(); // UV Index
    expect(screen.getByText('10 mp/h')).toBeInTheDocument(); // Wind Speed
  });

  it('renders weather information correctly in Fahrenheit', () => {
    render(
      <WeatherCard 
        {...defaultProps} 
        temperatureUnit={TemperatureUnit.FAHRENHEIT}
      />
    );

    // Temperature should be converted to Fahrenheit (20°C = 68°F)
    expect(screen.getByText('68°F')).toBeInTheDocument();
  });

  it('renders weather icon with correct props', () => {
    render(<WeatherCard {...defaultProps} />);

    const weatherIcon = screen.getByTestId('weather-icon');
    expect(weatherIcon).toHaveAttribute('data-condition', 'Sunny');
    expect(weatherIcon).toHaveAttribute('data-size', 'large');
  });

  it('handles different weather conditions', () => {
    const weatherWithRain = {
      ...defaultProps,
      weather: {
        ...mockWeatherData,
        condition: 'Rainy',
        rainChance: 80,
      },
    };

    render(<WeatherCard {...weatherWithRain} />);

    expect(screen.getByText('Rainy')).toBeInTheDocument();
    expect(screen.getByText('Chance of rain 80%')).toBeInTheDocument();
  });

  it('displays extreme temperature values correctly', () => {
    const extremeWeather = {
      ...defaultProps,
      weather: {
        ...mockWeatherData,
        temperature: 40,
        humidity: 90,
        uvIndex: 11,
      },
    };

    render(<WeatherCard {...extremeWeather} />);

    expect(screen.getByText('40°C')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('11 UV')).toBeInTheDocument();
  });

  it('handles zero and negative temperatures', () => {
    const coldWeather = {
      ...defaultProps,
      weather: {
        ...mockWeatherData,
        temperature: -5,
      },
    };

    render(<WeatherCard {...coldWeather} />);
    expect(screen.getByText('-5°C')).toBeInTheDocument();
  });

  it('rounds temperature values correctly', () => {
    const decimalWeather = {
      ...defaultProps,
      weather: {
        ...mockWeatherData,
        temperature: 20.7,
      },
    };

    render(<WeatherCard {...decimalWeather} />);
    expect(screen.getByText('21°C')).toBeInTheDocument(); // Should round to nearest integer
  });

  it('maintains consistent layout with long city names', () => {
    const longCityName = {
      ...defaultProps,
      city: 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch',
    };

    render(<WeatherCard {...longCityName} />);
    
    // The card should still render all weather information
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByTestId('weather-icon')).toBeInTheDocument();
  });

  it('displays all required weather metrics', () => {
    render(<WeatherCard {...defaultProps} />);

    // Check for presence of all weather metrics
    const metrics = [
      { value: '65%', label: 'humidity' },
      { value: '5 UV', label: 'UV index' },
      { value: '10 mp/h', label: 'wind speed' },
    ];

    metrics.forEach(metric => {
      expect(screen.getByText(metric.value)).toBeInTheDocument();
    });
  });
});