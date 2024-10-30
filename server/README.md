# Weather Service

A gRPC-based weather service that aggregates data from multiple weather providers.

## Features

- Multiple weather provider support (OpenWeather, WeatherAPI)
- gRPC API for real-time weather data
- Configurable provider settings
- User city preferences storage

## Prerequisites

- Rust (1.70 or later)
- PostgreSQL (14.0 or later)
- API keys for weather providers

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your_username/weather-service.git
cd server
```

2. Copy the configuration template:

```bash
cp config/template.toml config/development.toml
```
3. Create `.env` file:

```bash
cp .env.example .env
```

## Getting API Keys

### OpenWeather API
1. Go to [OpenWeather Sign Up](https://home.openweathermap.org/users/sign_up)
2. Create a free account
3. Navigate to "API Keys" section
4. Copy your API key
5. Add it to `config/development.toml`:
   ```toml
   [providers]
   openweather_api_key = "your_key_here"
   ```

### WeatherAPI
1. Visit [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to `config/development.toml`:
   ```toml
   [providers]
   weatherapi_api_key = "your_key_here"
   ```

# Running the Server

1. Build the project:

```bash
cargo build
```

2. Run the server:

```bash
cargo run
```

The server will start on `127.0.0.1:50051` by default.

## API Examples

Using [grpcurl](https://github.com/fullstorydev/grpcurl):

```bash
Get current weather
grpcurl -plaintext -import-path ../proto -proto weather.proto -d '{"city": "London"}' localhost:50051 weather.WeatherService/GetCurrentWeather

Get forecast
grpcurl -plaintext -import-path ..proto -proto weather.proto -d '{"city": "London", "days": 3}' localhost:50051 weather.WeatherService/GetForecast
```

## Development

Running tests:

```bash
cargo test
```

## Envoy

```bash
envoy -c envoy.yaml --log-level debug
```
