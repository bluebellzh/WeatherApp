import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsDialog } from './SettingDialog';
import { 
  WeatherProvider, 
  TemperatureUnit, 
  UpdateFrequency 
} from '../weather';

describe('SettingsDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    weatherProvider: WeatherProvider.OPENWEATHER,
    temperatureUnit: TemperatureUnit.CELSIUS,
    updateFrequency: UpdateFrequency.FIFTEEN_MINUTES,
    onProviderChange: jest.fn(),
    onTemperatureUnitChange: jest.fn(),
    onUpdateFrequencyChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all settings options when open', async () => {
    render(<SettingsDialog {...defaultProps} />);

    // Check if dialog title is rendered
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Check if all provider options are available
    const providerSelect = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(providerSelect);
    const providerList = screen.getByRole('listbox');
    expect(within(providerList).getByRole('option', { name: /OpenWeather/i })).toBeInTheDocument();
    expect(within(providerList).getByRole('option', { name: /WeatherAPI/i })).toBeInTheDocument();

    // Close the provider select
    fireEvent.keyDown(providerList, { key: 'Escape' });

    // Check if all temperature unit options are available
    const tempUnitSelect = screen.getAllByRole('combobox')[1];
    fireEvent.mouseDown(tempUnitSelect);
    const tempUnitList = screen.getByRole('listbox');
    expect(within(tempUnitList).getByRole('option', { name: /Celsius/i })).toBeInTheDocument();
    expect(within(tempUnitList).getByRole('option', { name: /Fahrenheit/i })).toBeInTheDocument();

    // Close the temperature unit select
    fireEvent.keyDown(tempUnitList, { key: 'Escape' });

    // Check if all update frequency options are available
    const freqSelect = screen.getAllByRole('combobox')[2];
    fireEvent.mouseDown(freqSelect);
    const freqList = screen.getByRole('listbox');
    expect(within(freqList).getByRole('option', { name: '5 minutes' })).toBeInTheDocument();
    expect(within(freqList).getByRole('option', { name: '15 minutes' })).toBeInTheDocument();
    expect(within(freqList).getByRole('option', { name: '30 minutes' })).toBeInTheDocument();
    expect(within(freqList).getByRole('option', { name: '1 hour' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SettingsDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('calls onProviderChange when weather provider is changed', async () => {
    render(<SettingsDialog {...defaultProps} />);
    
    const select = screen.getAllByRole('combobox')[0];
    fireEvent.mouseDown(select);
    
    const option = screen.getByRole('option', { name: /WeatherAPI/i });
    fireEvent.click(option);
    
    expect(defaultProps.onProviderChange).toHaveBeenCalled();
  });

  it('calls onTemperatureUnitChange when temperature unit is changed', async () => {
    render(<SettingsDialog {...defaultProps} />);
    
    const select = screen.getAllByRole('combobox')[1];
    fireEvent.mouseDown(select);
    
    const option = screen.getByRole('option', { name: /Fahrenheit/i });
    fireEvent.click(option);
    
    expect(defaultProps.onTemperatureUnitChange).toHaveBeenCalled();
  });

  it('calls onUpdateFrequencyChange when update frequency is changed', async () => {
    render(<SettingsDialog {...defaultProps} />);
    
    const select = screen.getAllByRole('combobox')[2];
    fireEvent.mouseDown(select);
    
    const option = screen.getByRole('option', { name: '30 minutes' });
    fireEvent.click(option);
    
    expect(defaultProps.onUpdateFrequencyChange).toHaveBeenCalled();
  });

  it('calls onClose when dialog is closed', () => {
    render(<SettingsDialog {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('displays correct initial values', () => {
    const customProps = {
      ...defaultProps,
      weatherProvider: WeatherProvider.WEATHERAPI,
      temperatureUnit: TemperatureUnit.FAHRENHEIT,
      updateFrequency: UpdateFrequency.THIRTY_MINUTES,
    };

    render(<SettingsDialog {...customProps} />);

    const [providerSelect, tempUnitSelect, freqSelect] = screen.getAllByRole('combobox');

    // Check if the correct values are selected
    expect(providerSelect).toHaveTextContent(/WeatherAPI/i);
    expect(tempUnitSelect).toHaveTextContent(/Fahrenheit/i);
    expect(freqSelect).toHaveTextContent(/30 minutes/i);
  });

  it('maintains proper spacing between form controls', () => {
    render(<SettingsDialog {...defaultProps} />);
    
    const formControls = screen.getAllByRole('combobox');
    expect(formControls).toHaveLength(3); // Weather Provider, Temperature Unit, Update Frequency
  });
});