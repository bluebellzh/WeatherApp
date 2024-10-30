# Weather Service Application

A modern weather application that aggregates data from multiple weather providers using gRPC for communication between the frontend and backend.

## Project Overview

- **Frontend**: React application with Material-UI
- **Backend**: Rust gRPC service
- **Communication**: gRPC-Web with Envoy proxy
- **Weather Providers**: OpenWeather and WeatherAPI support

## Features

- Real-time weather data
- Multiple weather provider support
- 5-day weather forecast
- City search functionality
- Responsive Material-UI design
- gRPC-based communication

## Architecture

```
├── frontend/          # React frontend application
├── server/            # Rust backend service
├── proto/             # Protocol buffer definitions
└── docker-compose.yml # Docker deployment configuration
```

## Prerequisites

- Docker and Docker Compose
- Node.js 14+ (for local development)
- Rust 1.70+ (for local development)
- API keys for weather providers:
  - OpenWeather API
  - WeatherAPI

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/bluebellzh/WeatherApp.git
cd WeatherApp
```

2. Set up environment variables:
```bash
# Create .env file in server directory
cp server/.env.example server/.env

# Add your API keys to the configuration
nano server/config/development.toml
```

3. Run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend gRPC: localhost:50051
- gRPC-Web Proxy: http://localhost:8080

## Local Development

### Frontend

```bash
cd frontend
npm install
npm start
```

The development server will start at http://localhost:3000 with:
- Hot reload support
- Mock data in development mode
- TypeScript type checking

### Backend

```bash
cd server
cargo run
```

The gRPC server will start at localhost:50051 with:
- Hot reload with cargo watch
- Debug logging
- gRPC reflection enabled

### Protocol Buffers

When updating the protocol buffer definitions:

1. Edit `proto/weather.proto`
2. Generate frontend code:
```bash
cd frontend
protoc -I=../proto \
  --js_out=import_style=commonjs:./src/proto \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./src/proto \
  ../proto/weather.proto
```

3. Backend code will automatically regenerate on build

## API Examples

Using grpcurl to test the backend:

```bash
# Get current weather
grpcurl -plaintext -d '{"client_id": "test", "latitude": 51.5074, "longitude": -0.1278}' \
  localhost:50051 weather.WeatherService/GetCurrentWeather

# Get forecast
grpcurl -plaintext -d '{"client_id": "test", "latitude": 51.5074, "longitude": -0.1278, "days": 5}' \
  localhost:50051 weather.WeatherService/GetForecast
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd server
cargo test
```

## Deployment

### Using Docker Compose
```bash
# Production build and deploy
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
See detailed deployment guides in:
- `frontend/README.md`
- `server/README.md`

## Configuration

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

### Backend Configuration
- Weather provider API keys in `config/development.toml`
- Logging level via `RUST_LOG` environment variable
- Server address and port in configuration file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under GPL-3.0 license - see the LICENSE file for details.

## Acknowledgments

- OpenWeather API
- WeatherAPI
- gRPC-Web
- Envoy Proxy
- Material-UI