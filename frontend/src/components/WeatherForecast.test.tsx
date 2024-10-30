import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherForecast } from './WeatherForecast';
import { ForecastData } from '../types/weather';
import { TemperatureUnit } from '../weather';

// Mock the WeatherIcon component
jest.mock('./WeatherIcon', () => ({
  WeatherIcon: ({ condition, size }: { condition: string; size: string }) => (
    <div data-testid="weather-icon" data-condition={condition} data-size={size}>
      Weather Icon Mock
    </div>
  ),
}));

describe('WeatherForecast', () => {
  // Mock current date to ensure consistent testing
  const mockDate = new Date('2024-03-20');
  
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockForecastData: ForecastData[] = [
    {
      date: '2024-03-20',
      temperature: 20,
      condition: 'Sunny',
      minTemp: 15,
      maxTemp: 20,
    },
    {
      date: '2024-03-21',
      temperature: 18,
      condition: 'Cloudy',
      minTemp: 15,
      maxTemp: 20,
    },
    {
      date: '2024-03-22',
      temperature: 15,
      condition: 'Rainy',
      minTemp: 15,
      maxTemp: 20,
    },
    {
      date: '2024-03-23',
      temperature: 17,
      condition: 'Partly Cloudy',
      minTemp: 15,
      maxTemp: 20,
    },
    {
      date: '2024-03-24',
      temperature: 22,
      condition: 'Clear',
      minTemp: 15,
      maxTemp: 20,
    },
  ];

  const defaultProps = {
    forecast: mockForecastData,
    temperatureUnit: TemperatureUnit.CELSIUS,
  };

  it('renders 5-day forecast correctly', () => {
    render(<WeatherForecast {...defaultProps} />);

    // Check header
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();

    // Check if Today is shown for the first day
    expect(screen.getByText('Today')).toBeInTheDocument();

    // Check if we have the correct number of forecast days
    const forecastDays = screen.getAllByTestId('weather-icon');
    expect(forecastDays).toHaveLength(5);

    // Check if other days are shown (using a more flexible approach)
    const dayElements = screen.getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
    expect(dayElements).toHaveLength(4); // 4 days after "Today"
  });

  it('displays temperatures in Celsius correctly', () => {
    render(<WeatherForecast {...defaultProps} />);

    // Check if temperatures are displayed correctly
    mockForecastData.forEach(day => {
      expect(screen.getByText(day.temperature.toString())).toBeInTheDocument();
    });

    // Check for Celsius symbol
    const celsiusSymbols = screen.getAllByText('°C');
    expect(celsiusSymbols).toHaveLength(5);
  });

  it('displays temperatures in Fahrenheit correctly', () => {
    render(
      <WeatherForecast 
        {...defaultProps} 
        temperatureUnit={TemperatureUnit.FAHRENHEIT}
      />
    );

    // Check if temperatures are converted and displayed correctly
    const fahrenheitTemps = [68, 64, 59, 63, 72]; // Converted from Celsius
    fahrenheitTemps.forEach(temp => {
      expect(screen.getByText(temp.toString())).toBeInTheDocument();
    });

    // Check for Fahrenheit symbol
    const fahrenheitSymbols = screen.getAllByText('°F');
    expect(fahrenheitSymbols).toHaveLength(5);
  });

  it('renders weather icons correctly', () => {
    render(<WeatherForecast {...defaultProps} />);

    const weatherIcons = screen.getAllByTestId('weather-icon');
    expect(weatherIcons).toHaveLength(5);

    // Check if icons have correct conditions
    expect(weatherIcons[0]).toHaveAttribute('data-condition', 'Sunny');
    expect(weatherIcons[1]).toHaveAttribute('data-condition', 'Cloudy');
    expect(weatherIcons[2]).toHaveAttribute('data-condition', 'Rainy');
    expect(weatherIcons[3]).toHaveAttribute('data-condition', 'Partly Cloudy');
    expect(weatherIcons[4]).toHaveAttribute('data-condition', 'Clear');
  });

  it('handles less than 5 days of forecast data', () => {
    const shortForecast = {
      ...defaultProps,
      forecast: mockForecastData.slice(0, 3),
    };

    render(<WeatherForecast {...shortForecast} />);

    const forecastCards = screen.getAllByTestId('weather-icon');
    expect(forecastCards).toHaveLength(3);
  });

  it('handles more than 5 days of forecast data', () => {
    const extendedForecast = {
      ...defaultProps,
      forecast: [
        ...mockForecastData,
        {
          date: '2024-03-25',
          temperature: 19,
          condition: 'Sunny',
          minTemp: 15,
          maxTemp: 20,
        },
      ],
    };

    render(<WeatherForecast {...extendedForecast} />);

    const forecastCards = screen.getAllByTestId('weather-icon');
    expect(forecastCards).toHaveLength(5); // Should still only show 5 days
  });

  it('maintains consistent layout with extreme temperatures', () => {
    const extremeTemps = {
      ...defaultProps,
      forecast: mockForecastData.map(day => ({
        ...day,
        temperature: 100, // Very high temperature
      })),
    };

    render(<WeatherForecast {...extremeTemps} />);

    // Check if all temperatures are displayed
    const temps = screen.getAllByText('100');
    expect(temps).toHaveLength(5);
  });

  it('handles empty forecast data gracefully', () => {
    render(<WeatherForecast forecast={[]} temperatureUnit={TemperatureUnit.CELSIUS} />);
    
    // Should still render the header
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
    
    // But no forecast cards
    const forecastCards = screen.queryAllByTestId('weather-icon');
    expect(forecastCards).toHaveLength(0);
  });
});