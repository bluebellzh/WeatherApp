import React from 'react';
import {
  Card,
  Box,
  Typography,
  Grid,
  styled,
} from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature } from '../utils/utils';
import { 
  TemperatureUnitType, 
  TemperatureUnit 
} from '../weather';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4B75E8 0%, #5B8FF9 100%)',
  color: 'white',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));

const WeatherMetric = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.9)',
}));


interface WeatherCardProps {
  city: string;
  weather: WeatherData;
  temperatureUnit: TemperatureUnitType;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ city, weather, temperatureUnit }) => {
  return (
    <StyledCard>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 1 }}>
            Chance of rain {weather.rainChance}%
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {weather.condition}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            {Math.round(convertTemperature(weather.temperature, temperatureUnit))}°{temperatureUnit === TemperatureUnit.FAHRENHEIT ? 'F' : 'C'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <WeatherMetric>
                <CloudIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{weather.humidity}%</Typography>
              </WeatherMetric>
            </Grid>
            <Grid item>
              <WeatherMetric>
                <WbSunnyIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{weather.uvIndex} UV</Typography>
              </WeatherMetric>
            </Grid>
            <Grid item>
              <WeatherMetric>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{weather.windSpeed} mp/h</Typography>
              </WeatherMetric>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <WeatherIcon condition={weather.condition} size="large" />
        </Grid>
      </Grid>
    </StyledCard>
  );
};