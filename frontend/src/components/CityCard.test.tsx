import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CityCard } from './CityCard';
import { TemperatureUnit } from '../weather';

// Mock the entire WeatherIcon component
jest.mock('./WeatherIcon', () => ({
  WeatherIcon: ({ condition, size }: { condition: string; size: string }) => (
    <div data-testid="weather-icon" data-condition={condition} data-size={size}>
      Weather Icon Mock
    </div>
  ),
}));

// Mock MUI icons
jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <div>Delete Icon Mock</div>,
}));

jest.mock('@mui/icons-material/LocationOn', () => ({
  __esModule: true,
  default: () => <div>Location Icon Mock</div>,
}));

describe('CityCard', () => {
  const defaultProps = {
    city: 'London',
    country: 'UK',
    latitude: 51.5074,
    longitude: -0.1278,
    temperature: 20,
    condition: 'Sunny',
    chanceOfRain: 10,
    temperatureUnit: TemperatureUnit.CELSIUS,
    onSelect: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders unselected card correctly', () => {
    render(<CityCard {...defaultProps} isSelected={false} />);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('UK')).toBeInTheDocument();
  });

  it('renders selected card correctly', () => {
    render(<CityCard {...defaultProps} isSelected={true} />);
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('Chance of rain 10%')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });

  it('converts temperature to Fahrenheit when unit is Fahrenheit', () => {
    render(
      <CityCard 
        {...defaultProps} 
        isSelected={true}
        temperatureUnit={TemperatureUnit.FAHRENHEIT}
      />
    );
    expect(screen.getByText('68°F')).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    render(<CityCard {...defaultProps} />);
    fireEvent.click(screen.getByText('London'));
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<CityCard {...defaultProps} />);
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it('prevents card selection when clicking delete button', () => {
    render(<CityCard {...defaultProps} />);
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });
});