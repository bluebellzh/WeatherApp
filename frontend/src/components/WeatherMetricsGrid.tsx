import React from 'react';
import { Grid, Card, Typography, Box } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface WeatherMetricsProps {
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  humidity: number;
  visibility: number;
}

// Add these helper functions before the WeatherMetricsGrid component
const getUVDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

export const WeatherMetricsGrid: React.FC<WeatherMetricsProps> = ({
  windSpeed,
  windDirection,
  uvIndex,
  humidity,
  visibility,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card className="weather-metrics__card">
          <Typography variant="h6">Wind Status</Typography>
          <Box className="weather-metrics__content">
            <Box className="weather-metrics__wind-circle">
              <Typography className="weather-metrics__wind-circle-direction">N</Typography>
              <AirIcon sx={{ transform: `rotate(${windDirection === 'North' ? 0 : 45}deg)` }} />
            </Box>
          </Box>
          <Box className="weather-metrics__text-center">
            <Typography variant="body1" className="weather-metrics__value">WIND</Typography>
            <Typography variant="h5">{windSpeed} m/s</Typography>
            <Typography variant="body1" className="weather-metrics__value">DIRECTION</Typography>
            <Typography variant="h5">{windDirection}</Typography>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card className="weather-metrics__card">
          <Typography variant="h6">UV Index</Typography>
          <Box className="weather-metrics__content weather-metrics__large-icon">
            <WbSunnyIcon />
          </Box>
          <Box className="weather-metrics__text-center">
            <Typography variant="h5">{uvIndex} UV</Typography>
            <Typography variant="body1">{getUVDescription(uvIndex)}</Typography>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card className="weather-metrics__card">
          <Typography variant="h6">Humidity</Typography>
          <Box className="weather-metrics__text-center weather-metrics__content">
            <Box className="weather-metrics__large-icon">
              <OpacityIcon />
              <Typography variant="h5">{humidity}%</Typography>
            </Box>
          </Box>
          <Typography variant="body2" className="weather-metrics__value weather-metrics__text-center">
            The dew point is 27° right now
          </Typography>
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card className="weather-metrics__card">
          <Typography variant="h6">Visibility</Typography>
          <Box className="weather-metrics__text-center weather-metrics__content">
            <Box className="weather-metrics__large-icon">
              <VisibilityIcon />
              <Typography variant="h5">{visibility} km</Typography>
            </Box>
          </Box>
          <Typography variant="body2" className="weather-metrics__value weather-metrics__text-center">
            Haze is affecting visibility
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
};