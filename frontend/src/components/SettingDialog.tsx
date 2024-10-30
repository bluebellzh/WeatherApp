import React from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { 
  WeatherProvider, 
  TemperatureUnit, 
  UpdateFrequency,
  WeatherProviderType,
  TemperatureUnitType,
  UpdateFrequencyType 
} from '../weather';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  weatherProvider: WeatherProviderType;
  temperatureUnit: TemperatureUnitType;
  updateFrequency: UpdateFrequencyType;
  onProviderChange: (event: SelectChangeEvent) => void;
  onTemperatureUnitChange: (event: SelectChangeEvent) => void;
  onUpdateFrequencyChange: (event: SelectChangeEvent) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  weatherProvider,
  temperatureUnit,
  updateFrequency,
  onProviderChange,
  onTemperatureUnitChange,
  onUpdateFrequencyChange,
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    className="settings-dialog"
  >
    <DialogTitle>Settings</DialogTitle>
    <DialogContent>
      <FormControl fullWidth className="settings-form-control">
        <InputLabel>Weather Provider</InputLabel>
        <Select
          value={weatherProvider}
          label="Weather Provider"
          onChange={onProviderChange}
        >
          <MenuItem value={WeatherProvider.OPENWEATHER}>OpenWeather</MenuItem>
          <MenuItem value={WeatherProvider.WEATHERAPI}>WeatherAPI</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth className="settings-form-control">
        <InputLabel>Temperature Unit</InputLabel>
        <Select
          value={temperatureUnit}
          label="Temperature Unit"
          onChange={onTemperatureUnitChange}
        >
          <MenuItem value={TemperatureUnit.CELSIUS}>Celsius</MenuItem>
          <MenuItem value={TemperatureUnit.FAHRENHEIT}>Fahrenheit</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth className="settings-form-control">
        <InputLabel>Update Frequency</InputLabel>
        <Select
          value={updateFrequency.toString()}
          label="Update Frequency"
          onChange={onUpdateFrequencyChange}
        >
          <MenuItem value={UpdateFrequency.FIVE_MINUTES}>5 minutes</MenuItem>
          <MenuItem value={UpdateFrequency.FIFTEEN_MINUTES}>15 minutes</MenuItem>
          <MenuItem value={UpdateFrequency.THIRTY_MINUTES}>30 minutes</MenuItem>
          <MenuItem value={UpdateFrequency.ONE_HOUR}>1 hour</MenuItem>
        </Select>
      </FormControl>
    </DialogContent>
  </Dialog>
);