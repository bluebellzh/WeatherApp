import React from 'react';

export const WeatherIcon = ({ condition, size }: { condition: string; size: string }) => (
  <div data-testid="weather-icon" data-condition={condition} data-size={size}>
    Weather Icon Mock
  </div>
);