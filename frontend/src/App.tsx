import React, { useState, useEffect, useRef } from 'react';
import { Box, ThemeProvider, CssBaseline, Drawer, Typography, IconButton, SelectChangeEvent } from '@mui/material';
import './styles/main.scss';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { WeatherForecast } from './components/WeatherForecast';
import { Sidebar } from './components/Sidebar';
import { weatherService } from './services/serviceFactory';
import { theme } from './theme/theme';
import { WeatherData, ForecastData, CityData } from './types/weather';
import { convertTemperature, getWindDirection } from './utils/utils';
import SettingsIcon from '@mui/icons-material/Settings';
import { WeatherHeader } from './components/WeatherHeader';
import { SettingsDialog } from './components/SettingDialog';
import { 
  WeatherProvider, 
  TemperatureUnit, 
  UpdateFrequency,
  WeatherProviderType,
  TemperatureUnitType,
  UpdateFrequencyType,
  STORAGE_KEYS,
} from './weather';
import backgroundImage from './assets/images/clouds-background.jpg';
import { WeatherIcon } from './components/WeatherIcon';

const App: React.FC = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weatherProvider, setWeatherProvider] = useState<WeatherProviderType>(WeatherProvider.OPENWEATHER);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnitType>(TemperatureUnit.CELSIUS);
  const [updateFrequency, setUpdateFrequency] = useState<UpdateFrequencyType>(UpdateFrequency.THIRTY_MINUTES);

  // First, let's create a ref to track if we've loaded the initial data
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (initialLoadDone.current) return; // Skip if we've already loaded

    try {
      console.log('Loading saved data from localStorage...');
      
      const savedCities = localStorage.getItem(STORAGE_KEYS.CITIES);
      const savedSelectedCity = localStorage.getItem(STORAGE_KEYS.SELECTED_CITY);
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      // Batch our state updates
      if (savedCities) {
        const parsedCities = JSON.parse(savedCities);
        setCities(parsedCities);
      }

      if (savedSelectedCity) {
        const parsedSelectedCity = JSON.parse(savedSelectedCity);
        setSelectedCity(parsedSelectedCity);
      }

      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (Object.values(WeatherProvider).includes(settings.weatherProvider)) {
          setWeatherProvider(settings.weatherProvider);
        }
        if (Object.values(TemperatureUnit).includes(settings.temperatureUnit)) {
          setTemperatureUnit(settings.temperatureUnit);
        }
        if (Object.values(UpdateFrequency).includes(settings.updateFrequency)) {
          setUpdateFrequency(settings.updateFrequency);
        }
      }

      initialLoadDone.current = true; // Mark initial load as complete
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []); // Empty dependency array

  // Save cities whenever they change
  useEffect(() => {
    console.log('Saving cities to localStorage:', cities);
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities));
  }, [cities]);

  // Save selected city whenever it changes
  useEffect(() => {
    console.log('Saving selected city to localStorage:', selectedCity);
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITY, JSON.stringify(selectedCity));
  }, [selectedCity]);

  // Save settings whenever they change
  useEffect(() => {
    const settings = {
      weatherProvider,
      temperatureUnit,
      updateFrequency,
    };
    console.log('Saving settings to localStorage:', settings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [weatherProvider, temperatureUnit, updateFrequency]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log('Fetching weather data at:', new Date().toLocaleTimeString());
      
      if (selectedCity) {
        try {
          const weather = await weatherService.getCurrentWeather(
            selectedCity.latitude,
            selectedCity.longitude,
            weatherProvider
          );
          const forecastData = await weatherService.getForecast(
            selectedCity.latitude,
            selectedCity.longitude,
            5,
            weatherProvider
          );
          setCurrentWeather(weather);
          setForecast(forecastData);
          
          // Update the cities array with new weather data
          setCities(prevCities => prevCities.map(city => 
            city.city === selectedCity.city 
              ? {
                  ...city,
                  temperature: weather.temperature,
                  condition: weather.condition,
                  chanceOfRain: weather.rainChance || 0,
                }
              : city
          ));
          
          console.log('Weather data updated successfully');
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    // Initial fetch
    console.log('Setting up interval with frequency:', updateFrequency, 'ms');
    fetchWeatherData();
    
    // Set up interval
    const interval = setInterval(fetchWeatherData, updateFrequency);
    
    // Cleanup function
    return () => {
      console.log('Cleaning up interval at:', new Date().toLocaleTimeString());
      clearInterval(interval);
    };
  }, [selectedCity, weatherProvider, updateFrequency]);

  const handleCityAdd = async (city: string, country: string, latitude: number, longitude: number) => {
    try {
      const weather = await weatherService.getCurrentWeather(latitude, longitude);
      
      const newCity: CityData = {
        city,
        country,
        latitude,
        longitude,
        temperature: weather.temperature,
        condition: weather.condition,
        chanceOfRain: weather.rainChance || 0,
      };
      
      setCities([...cities, newCity]);
      setSelectedCity(newCity);
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);
  const handleProviderChange = async (event: SelectChangeEvent) => {
    const newProvider = event.target.value as WeatherProviderType;
    console.log('Weather provider changed to:', newProvider);
    setWeatherProvider(newProvider);
    
    // Refresh weather data with new provider
    if (selectedCity) {
      try {
        const weather = await weatherService.getCurrentWeather(
          selectedCity.latitude,
          selectedCity.longitude,
          newProvider
        );
        const forecastData = await weatherService.getForecast(
          selectedCity.latitude,
          selectedCity.longitude,
          7,
          newProvider
        );
        setCurrentWeather(weather);
        setForecast(forecastData);
      } catch (error) {
        console.error('Error refreshing weather data:', error);
      }
    }
  };

  const handleTemperatureUnitChange = (event: SelectChangeEvent) => {
    const newUnit = event.target.value as TemperatureUnitType;
    setTemperatureUnit(newUnit);
    
    // Refresh weather data to update temperature displays
    if (selectedCity && currentWeather) {
      setCurrentWeather({
        ...currentWeather,
        // No need to convert here as the base data should always be in Celsius
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        className="app-container"
        sx={{
          '--background-image': `url(${backgroundImage})`
        } as any}
      >
        <Box className="background-gradient" />
        
        <Box className="content-wrapper">
          <Drawer
            variant="permanent"
            className="sidebar-drawer"
          >
            <Sidebar
              cities={cities}
              selectedCity={selectedCity}
              temperatureUnit={temperatureUnit}
              onCitySelect={setSelectedCity}
              onCityDelete={(city) => {
                setCities(cities.filter(c => c.city !== city));
                if (selectedCity?.city === city) {
                  setSelectedCity(null);
                }
              }}
              onCityAdd={handleCityAdd}
            />
          </Drawer>

          <Box className="main-content">
            {!selectedCity ? (
              <Typography variant="h5" className="message message--center">
                Please select or search for a city
              </Typography>
            ) : currentWeather ? (
              <>
                <WeatherHeader
                  selectedCity={selectedCity.city}
                  currentWeather={currentWeather}
                  temperatureUnit={temperatureUnit}
                />

                <Box className="weather-grid">
                  <WeatherMetricsGrid
                    windSpeed={Math.round(currentWeather.windSpeed)}
                    windDirection={getWindDirection(currentWeather.windDirection)}
                    uvIndex={Math.round(currentWeather.uvIndex)}
                    humidity={currentWeather.humidity}
                    visibility={currentWeather.visibility}
                  />
                  
                  <Box className="temperature-container">
                    <Box className="weather-icon-wrapper">
                      <WeatherIcon 
                        condition={currentWeather?.condition || 'clear'}
                        size="large"
                        className="weather-icon"
                      />
                    </Box>
                    
                    <Box className="temperature-display">
                      <Typography className="temperature-value">
                        {Math.round(convertTemperature(currentWeather?.temperature || 0, temperatureUnit))}
                      </Typography>
                      <Typography className="temperature-unit">
                        °{temperatureUnit === 'fahrenheit' ? 'F' : 'C'}
                      </Typography>
                    </Box>
                    
                    <Typography className="temperature-range">
                      H: {Math.round(convertTemperature(currentWeather?.maxTemp || 0, temperatureUnit))}° 
                      L: {Math.round(convertTemperature(currentWeather?.minTemp || 0, temperatureUnit))}°
                    </Typography>
                  </Box>
                </Box>

                {forecast && (
                  <WeatherForecast 
                    forecast={forecast} 
                    temperatureUnit={temperatureUnit}
                  />
                )}
              </>
            ) : (
              <Typography variant="h5" className="message message--center">
                Loading...
              </Typography>
            )}
          </Box>
        </Box>

        <Box className="settings-panel">
          <IconButton
            onClick={handleSettingsOpen}
            className="settings-button"
          >
            <SettingsIcon data-testid="SettingsIcon" />
          </IconButton>
          <Typography className="time-display">
            {new Date().toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </Typography>
          <Typography className="date-display">
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>

      <SettingsDialog
        open={settingsOpen}
        onClose={handleSettingsClose}
        weatherProvider={weatherProvider}
        temperatureUnit={temperatureUnit}
        updateFrequency={updateFrequency}
        onProviderChange={handleProviderChange}
        onTemperatureUnitChange={handleTemperatureUnitChange}
        onUpdateFrequencyChange={(e) => setUpdateFrequency(Number(e.target.value))}
      />
    </ThemeProvider>
  );
};

export default App;