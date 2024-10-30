import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherMetricsGrid } from './WeatherMetricsGrid';

describe('WeatherMetricsGrid', () => {
  const defaultProps = {
    windSpeed: 5.5,
    windDirection: 'North',
    uvIndex: 6,
    humidity: 65,
    visibility: 10,
  };

  it('renders all metric cards', () => {
    render(<WeatherMetricsGrid {...defaultProps} />);
    
    expect(screen.getByText('Wind Status')).toBeInTheDocument();
    expect(screen.getByText('UV Index')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Visibility')).toBeInTheDocument();
  });

  describe('Wind Status Card', () => {
    it('displays wind speed and direction', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText('5.5 m/s')).toBeInTheDocument();
      expect(screen.getByText('North')).toBeInTheDocument();
    });

    it('shows wind direction indicator', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      const windCircle = screen.getByText('N');
      expect(windCircle).toBeInTheDocument();
    });
  });

  describe('UV Index Card', () => {
    it('displays UV index value', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText('6 UV')).toBeInTheDocument();
    });

    it('shows correct UV description for different values', () => {
      const testCases = [
        { uv: 1, expected: 'Low' },
        { uv: 4, expected: 'Moderate' },
        { uv: 6, expected: 'High' },
        { uv: 8, expected: 'Very High' },
        { uv: 11, expected: 'Extreme' },
      ];

      testCases.forEach(({ uv, expected }) => {
        render(
          <WeatherMetricsGrid 
            {...defaultProps}
            uvIndex={uv}
          />
        );
        
        expect(screen.getByText(expected)).toBeInTheDocument();
      });
    });
  });

  describe('Humidity Card', () => {
    it('displays humidity percentage', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText('65%')).toBeInTheDocument();
    });

    it('displays dew point information', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText(/dew point/i)).toBeInTheDocument();
    });
  });

  describe('Visibility Card', () => {
    it('displays visibility in kilometers', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText('10 km')).toBeInTheDocument();
    });

    it('displays visibility status message', () => {
      render(<WeatherMetricsGrid {...defaultProps} />);
      
      expect(screen.getByText(/affecting visibility/i)).toBeInTheDocument();
    });
  });

  it('renders with different wind directions', () => {
    const directions = ['North', 'South', 'East', 'West'];
    
    directions.forEach(direction => {
      render(
        <WeatherMetricsGrid 
          {...defaultProps}
          windDirection={direction}
        />
      );
      
      expect(screen.getByText(direction)).toBeInTheDocument();
    });
  });

  it('handles zero values correctly', () => {
    render(
      <WeatherMetricsGrid 
        windSpeed={0}
        windDirection="North"
        uvIndex={0}
        humidity={0}
        visibility={0}
      />
    );
    
    expect(screen.getByText('0 m/s')).toBeInTheDocument();
    expect(screen.getByText('0 UV')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0 km')).toBeInTheDocument();
  });
});