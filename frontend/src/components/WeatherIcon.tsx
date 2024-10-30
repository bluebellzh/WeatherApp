import React from 'react';
import SunnyIcon from '../assets/icons/sunny.svg';
import CloudyIcon from '../assets/icons/cloudy.svg';
import RainyIcon from '../assets/icons/rainy.svg';
import StormyIcon from '../assets/icons/stormy.svg';
import SnowyIcon from '../assets/icons/snowy.svg';
import MistyIcon from '../assets/icons/windy.svg';

interface WeatherIconProps {
  condition: string;
  size?: 'small' | 'medium' | 'large' | number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 'medium',
  className 
}) => {
  // Convert size props to pixels
  const getIconSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 24;
      case 'large': return 120;
      default: return 32; // medium
    }
  };

  const iconStyle = {
    width: getIconSize(),
    height: getIconSize(),
  };

  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return SunnyIcon;
      case 'clouds':
      case 'partly cloudy':
      case 'overcast':
        return CloudyIcon;
      case 'thunderstorm':
      case 'thunder':
        return StormyIcon;
      case 'rain':
      case 'light rain':
      case 'shower':
      case 'moderate rain':
      case 'heavy rain':
        return RainyIcon;
      case 'snow':
      case 'light snow':
      case 'heavy snow':
      case 'blizzard':
        return SnowyIcon;
      case 'mist':
      case 'fog':
      case 'haze':
        return MistyIcon;
      default:
        return CloudyIcon;
    }
  };

  return (
    <img 
      src={getWeatherIcon()} 
      alt={condition}
      style={iconStyle}
      className={className}
    />
  );
};