# Weather App Frontend

A modern weather application built with React and Material-UI that displays weather information and forecasts.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository

2. Install dependencies

npm install


The application will start in development mode and open in your default browser at [http://localhost:3000](http://localhost:3000).

## Development Mode

By default, the application runs with mock data in development mode. This means:
- No backend connection is required
- Weather data is simulated
- API calls return predictable data
- Network delays are simulated (500ms)

### Mock Data Includes

- Current weather for default cities:
  - Washington DC, USA
  - Lisboa, Portugal
  - Kyiv, Ukraine
  - Berlin, Germany

- Weather metrics:
  - Temperature: 13°C
  - Humidity: 84%
  - Wind Speed: 5 m/s
  - UV Index: 2
  - Visibility: 134 km

- 5-day forecast with varying conditions

### Testing the UI

You can interact with the application as if it were connected to a real backend:
1. Search for cities (mock data will be returned)
2. Add/remove cities from your list
3. View weather details and forecasts
4. Switch between weather providers

### Available Scripts

## Mock Service vs Real Service

The application uses different services based on the environment:

- **Development**: Uses `MockWeatherService` with hardcoded data
- **Production**: Uses `WeatherService` with real API calls

This is handled automatically by the `serviceFactory.ts`:
export const weatherService = process.env.NODE_ENV === 'development'
? MockWeatherService
: WeatherService;

## Customizing Mock Data

To modify the mock data, edit `src/services/mockWeatherService.ts`:
/ Example: Change temperature
async getCurrentWeather(city: string): Promise<WeatherData> {
return {
temperature: 25, // Change this value
humidity: 84,
// ... other properties
};
}

## Switching to Real API

When you're ready to use the real API:

1. Ensure your backend is running
2. Update the API endpoint in `src/services/weatherService.ts`
3. Build the application for production:
npm run build


## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Troubleshooting

### Common Issues

1. **Mock data not updating:**
   - Ensure you're in development mode
   - Check that `NODE_ENV` is set to 'development'
   - Clear browser cache and restart the development server

2. **TypeScript errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check that your TypeScript version matches the project requirements

For more help, please submit an issue in the repository.
## Protocol generation
```
protoc -I=../proto \
  --js_out=import_style=commonjs:./src/proto \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/proto \
  ../proto/weather.proto
```