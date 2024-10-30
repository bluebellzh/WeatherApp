import React from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { convertTemperature } from '../utils/utils';
import { TemperatureUnitType } from '../weather';

interface WeatherForecastProps {
  forecast: ForecastData[];
  temperatureUnit: TemperatureUnitType;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, temperatureUnit }) => {
  return (
    <Box className="forecast">
      <Box className="forecast-header">
        <CalendarTodayIcon />
        <Typography variant="h6">5-Day Forecast</Typography>
      </Box>
      <Grid container spacing={6}>
        {forecast.slice(0, 5).map((day, index) => (
          <Grid item xs key={index}>
            <Box className="forecast-card">
              <Typography className="forecast-day">
                {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </Typography>
              <Box className="forecast-icon">
                <WeatherIcon condition={day.condition} size="large" />
              </Box>
              <Box className="forecast-temperature">
                <Typography className="temperature-value">
                  {Math.round(convertTemperature(day.temperature, temperatureUnit))}
                </Typography>
                <Typography className="temperature-unit">
                  °{temperatureUnit === 'fahrenheit' ? 'F' : 'C'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};