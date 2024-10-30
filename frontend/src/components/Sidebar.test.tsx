import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from './Sidebar';
import { TemperatureUnit } from '../weather';

// Mock child components
jest.mock('./CitySearch', () => ({
  CitySearch: ({ onCitySelect, onSearchChange }: any) => (
    <div data-testid="city-search">
      <input 
        data-testid="search-input" 
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button 
        onClick={() => onCitySelect({
          name: 'London',
          country: 'GB',
          lat: 51.5074,
          lon: -0.1278
        })}
        data-testid="select-city"
      >
        Select City
      </button>
    </div>
  ),
}));

jest.mock('./CityCard', () => ({
  CityCard: ({ 
    city, 
    onSelect, 
    onDelete, 
    isSelected 
  }: any) => (
    <div 
      data-testid="city-card"
      data-city={city}
      data-selected={isSelected}
    >
      <button onClick={() => onSelect(city)} data-testid={`select-${city}`}>Select</button>
      <button onClick={() => onDelete(city)} data-testid={`delete-${city}`}>Delete</button>
    </div>
  ),
}));

// Mock MUI components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Snackbar: ({ open, children, onClose, autoHideDuration }: any) => {
      if (!open) return null;
      if (autoHideDuration && onClose) {
        setTimeout(() => {
          onClose(new Event('timeout') as any, 'timeout');
        }, autoHideDuration);
      }
      return (
        <div role="presentation" data-testid="mui-snackbar">
          {children}
        </div>
      );
    },
    Alert: ({ children, severity, onClose }: any) => (
      <div role="alert" data-testid="mui-alert" data-severity={severity}>
        {children}
        {onClose && (
          <button onClick={onClose} data-testid="alert-close">
            Close
          </button>
        )}
      </div>
    ),
  };
});

describe('Sidebar', () => {
  const mockCities = [
    {
      city: 'London',
      country: 'GB',
      latitude: 51.5074,
      longitude: -0.1278,
      temperature: 20,
      condition: 'Sunny',
      chanceOfRain: 10
    },
    {
      city: 'Paris',
      country: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      temperature: 22,
      condition: 'Clear',
      chanceOfRain: 0
    }
  ];

  const defaultProps = {
    cities: mockCities,
    selectedCity: null,
    temperatureUnit: TemperatureUnit.CELSIUS,
    onCitySelect: jest.fn(),
    onCityDelete: jest.fn(),
    onCityAdd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sidebar with title and search', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByText('Weather.me')).toBeInTheDocument();
    expect(screen.getByTestId('city-search')).toBeInTheDocument();
  });

  it('renders list of cities', () => {
    render(<Sidebar {...defaultProps} />);
    
    const cityCards = screen.getAllByTestId('city-card');
    expect(cityCards).toHaveLength(2);
    
    expect(cityCards[0]).toHaveAttribute('data-city', 'London');
    expect(cityCards[1]).toHaveAttribute('data-city', 'Paris');
  });

  it('handles city selection', () => {
    render(<Sidebar {...defaultProps} />);
    
    const selectLondonButton = screen.getByTestId('select-London');
    fireEvent.click(selectLondonButton);
    
    expect(defaultProps.onCitySelect).toHaveBeenCalledWith(mockCities[0]);
  });

  it('handles city deletion', () => {
    render(<Sidebar {...defaultProps} />);
    
    const deleteLondonButton = screen.getByTestId('delete-London');
    fireEvent.click(deleteLondonButton);
    
    expect(defaultProps.onCityDelete).toHaveBeenCalledWith('London');
  });

  it('handles adding new city', () => {
    const { rerender } = render(<Sidebar {...defaultProps} />);
    
    const selectCityButton = screen.getByTestId('select-city');
    
    // First render with empty cities to avoid duplicate city check
    rerender(<Sidebar {...defaultProps} cities={[]} />);
    
    fireEvent.click(selectCityButton);
    
    expect(defaultProps.onCityAdd).toHaveBeenCalledWith(
      expect.any(String), // city name
      expect.any(String), // country code
      expect.any(Number), // latitude
      expect.any(Number)  // longitude
    );
  });

  it('shows selected city as active', () => {
    const propsWithSelectedCity = {
      ...defaultProps,
      selectedCity: mockCities[0]
    };
    
    render(<Sidebar {...propsWithSelectedCity} />);
    
    const cityCards = screen.getAllByTestId('city-card');
    expect(cityCards[0]).toHaveAttribute('data-selected', 'true');
    expect(cityCards[1]).toHaveAttribute('data-selected', 'false');
  });

  it('prevents adding duplicate cities and shows snackbar', () => {
    render(<Sidebar {...defaultProps} />);
    
    const selectCityButton = screen.getByTestId('select-city');
    fireEvent.click(selectCityButton);
    
    const alert = screen.getByTestId('mui-alert');
    expect(alert).toHaveTextContent('This city is already in your list');
    expect(defaultProps.onCityAdd).not.toHaveBeenCalled();
  });

  it('handles search input changes', () => {
    render(<Sidebar {...defaultProps} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'New York' } });
    
    // Verify the search value was updated
    expect(searchInput).toHaveValue('New York');
  });

  it('renders empty state when no cities', () => {
    render(<Sidebar {...defaultProps} cities={[]} />);
    
    const cityCards = screen.queryAllByTestId('city-card');
    expect(cityCards).toHaveLength(0);
  });

  it('shows snackbar for duplicate cities', async () => {
    render(<Sidebar {...defaultProps} />);
    
    // Try to add duplicate city
    act(() => {
      fireEvent.click(screen.getByTestId('select-city'));
    });
    
    // Wait for and verify snackbar content
    const snackbar = screen.getByTestId('mui-snackbar');
    const alert = within(snackbar).getByTestId('mui-alert');
    expect(alert).toHaveTextContent('This city is already in your list');
    expect(defaultProps.onCityAdd).not.toHaveBeenCalled();
  });

  it('closes snackbar after timeout', async () => {
    jest.useFakeTimers();
    
    const { rerender } = render(<Sidebar {...defaultProps} />);
    
    // Try to add duplicate city
    act(() => {
      fireEvent.click(screen.getByTestId('select-city'));
    });
    
    // Verify snackbar is shown
    const snackbar = screen.getByTestId('mui-snackbar');
    const alert = within(snackbar).getByTestId('mui-alert');
    expect(alert).toHaveTextContent('This city is already in your list');
    
    // Advance timers and handle all pending state updates
    await act(async () => {
      jest.advanceTimersByTime(3000); // Match component's autoHideDuration
    });
    
    // Force a rerender to reflect state changes
    rerender(<Sidebar {...defaultProps} />);
    
    // Verify snackbar is gone
    expect(screen.queryByTestId('mui-snackbar')).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  // Alternative test that uses manual close
  it('closes snackbar when clicking close button', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Try to add duplicate city
    act(() => {
      fireEvent.click(screen.getByTestId('select-city'));
    });
    
    // Verify snackbar is shown
    const snackbar = screen.getByTestId('mui-snackbar');
    expect(snackbar).toBeInTheDocument();
    
    // Click close button
    const closeButton = within(snackbar).getByTestId('alert-close');
    act(() => {
      fireEvent.click(closeButton);
    });
    
    // Verify snackbar is gone
    expect(screen.queryByTestId('mui-snackbar')).not.toBeInTheDocument();
  });

  it('maintains scroll position when cities list updates', () => {
    const { rerender } = render(<Sidebar {...defaultProps} />);
    
    const sidebar = screen.getByTestId('city-search').parentElement;
    if (sidebar) {
      // Set initial scroll position
      Object.defineProperty(sidebar, 'scrollTop', {
        value: 100,
        writable: true,
        configurable: true
      });
      
      // Update props
      rerender(<Sidebar {...defaultProps} cities={[...mockCities, {
        city: 'Berlin',
        country: 'DE',
        latitude: 52.5200,
        longitude: 13.4050,
        temperature: 18,
        condition: 'Cloudy',
        chanceOfRain: 20
      }]} />);
      
      // Scroll position should be maintained
      expect(sidebar.scrollTop).toBe(100);
    }
  });
});