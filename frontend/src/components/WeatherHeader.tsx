import React from 'react';
import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WeatherData } from '../types/weather';
import { TemperatureUnitType } from '../weather';

interface WeatherHeaderProps {
  selectedCity: string;
  currentWeather: WeatherData;
  temperatureUnit: TemperatureUnitType;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  selectedCity,
  currentWeather,
}) => (
  <Box className="weather-header">
    <Box>
      <Box className="weather-header__location">
        <LocationOnIcon />
        <Typography variant="h6">
          {selectedCity}, {currentWeather.country}
        </Typography>
      </Box>
    </Box>
    {/* ... Time display ... */}
  </Box>
);