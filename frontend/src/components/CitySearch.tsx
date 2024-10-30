import React, { useState } from 'react';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

interface City {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export const CitySearch: React.FC<{
  apiKey: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCitySelect: (city: City) => void;
}> = ({ apiKey, searchValue, onSearchChange, onCitySelect }) => {
  const [options, setOptions] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (value: string) => {
    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    // Easier and faster to use OpenWeatherMap API for this, since we don't need to process the data.
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(value)}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();
      const validCities = Array.isArray(data) ? data.map((city: any) => ({
        name: city.name || '',
        state: city.state || undefined,
        country: city.country || '',
        lat: city.lat || 0,
        lon: city.lon || 0
      })) : [];
      setOptions(validCities);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={options}
      inputValue={searchValue}
      value={null}
      onInputChange={(_, value, reason) => {
        if (reason === 'clear') {
          onSearchChange('');
          setOptions([]);
        } else {
          onSearchChange(value);
          handleSearch(value);
        }
      }}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') {
          onCitySelect(value);
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return `${option.name}${option.state ? `, ${option.state}` : ''}, ${option.country}`;
      }}
      isOptionEqualToValue={(option, value) => {
        // Compare using coordinates for uniqueness
        return option.lat === value.lat && 
               option.lon === value.lon && 
               option.name === value.name;
      }}
      // Add this to ensure unique keys
      getOptionKey={(option) => {
        if (typeof option === 'string') return option;
        return `${option.name}-${option.lat}-${option.lon}`;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a city"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};