import React, { useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { CitySearch } from './CitySearch';
import { CityCard } from './CityCard';
import { TemperatureUnitType } from '../weather';

interface City {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface CityData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  condition: string;
  chanceOfRain: number;
}

interface SidebarProps {
  cities: Array<{
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    temperature: number;
    condition: string;
    chanceOfRain: number;
  }>;
  selectedCity: CityData | null;
  temperatureUnit: TemperatureUnitType;
  onCitySelect: (city: CityData) => void;
  onCityDelete: (city: string) => void;
  onCityAdd: (city: string, country: string, latitude: number, longitude: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  cities,
  selectedCity,
  temperatureUnit,
  onCitySelect,
  onCityDelete,
  onCityAdd,
}) => {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';

  const [searchValue, setSearchValue] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCitySelect = (city: City) => {
    const isDuplicate = cities.some(
      existingCity => 
        existingCity.latitude === city.lat && 
        existingCity.longitude === city.lon
    );

    if (isDuplicate) {
      setOpenSnackbar(true);
      return;
    }
    onCityAdd(city.name, city.country, city.lat, city.lon);
    setSearchValue('');
  };

  return (
    <Box className="sidebar">
      <Box className="sidebar__header">
        <Typography variant="h5" className="sidebar__header-title">
          Weather.me
        </Typography>
        <CitySearch 
          apiKey={API_KEY}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onCitySelect={handleCitySelect}
        />
      </Box>
      
      <Box className="sidebar__content">
        {cities.map((city) => (
          <CityCard
            key={city.city}
            city={city.city}
            country={city.country}
            temperature={city.temperature}
            condition={city.condition}
            chanceOfRain={city.chanceOfRain}
            latitude={city.latitude}
            longitude={city.longitude}
            isSelected={selectedCity?.city === city.city}
            temperatureUnit={temperatureUnit}
            onSelect={() => onCitySelect(city)}
            onDelete={() => onCityDelete(city.city)}
          />
        ))}
      </Box>
      
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          This city is already in your list
        </Alert>
      </Snackbar>
    </Box>
  );
};