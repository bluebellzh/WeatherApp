import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { WeatherIcon } from './WeatherIcon';
import { convertTemperature } from '../utils/utils';
import { 
  TemperatureUnitType, 
  TemperatureUnit 
} from '../weather';

interface CityCardProps {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  condition: string;
  chanceOfRain: number;
  isSelected?: boolean;
  temperatureUnit: TemperatureUnitType;
  onSelect: () => void;
  onDelete: () => void;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  country,
  latitude,
  longitude,
  temperature,
  condition,
  chanceOfRain,
  isSelected,
  temperatureUnit,
  onSelect,
  onDelete,
}) => (
  <Box
    onClick={onSelect}
    className={`city-card ${isSelected ? 'city-card--selected' : ''}`}
  >
    {isSelected ? (
      <Box className="city-card__content">
        <IconButton 
          size="small" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="city-card__delete-button city-card__delete-button--selected"
        >
          <DeleteIcon />
        </IconButton>

        <Typography sx={{ fontSize: '0.875rem', mb: 1, opacity: 0.8 }}>
          Chance of rain {chanceOfRain}%
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          {condition}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon sx={{ fontSize: '1.25rem' }} />
              <Typography>{city}, {country}</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              {Math.round(convertTemperature(temperature, temperatureUnit))}°
              {temperatureUnit === TemperatureUnit.FAHRENHEIT ? 'F' : 'C'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <WeatherIcon condition={condition} size="large" />
          </Box>
        </Box>
      </Box>
    ) : (
      <Box className="city-card__content--unselected">
        <Box className="city-card__location">
          <LocationOnIcon className="city-card__location-icon" />
          <Box>
            <Typography className="city-card__location-city">
              {city}
            </Typography>
            <Typography className="city-card__location-country">
              {country}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WeatherIcon condition={condition} size="medium" />
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="city-card__delete-button"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    )}
  </Box>
);