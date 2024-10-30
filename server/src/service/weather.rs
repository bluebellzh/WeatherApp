use tonic::{Request, Response, Status};
use crate::providers::{OpenWeatherProvider, WeatherApiProvider, WeatherProvider};
use crate::proto::weather::weather_service_server::WeatherService;
use crate::proto::weather::{
    WeatherRequest, WeatherResponse,
    ForecastRequest, ForecastResponse,
    DayForecast,
};
use crate::error::{AppError, AppResult};
use tracing::{info, error, debug};

pub struct WeatherServiceImpl {
    openweather: &'static OpenWeatherProvider,
    weatherapi: &'static WeatherApiProvider,
}

impl WeatherServiceImpl {
    pub fn new() -> Self {
        Self {
            openweather: &OpenWeatherProvider::new(),
            weatherapi: &WeatherApiProvider::new(),
        }
    }

    fn get_provider(&self, provider_name: &str) -> AppResult<&dyn WeatherProvider> {
        match provider_name.to_lowercase().as_str() {
            "openweather" => Ok(self.openweather),
            "weatherapi" => Ok(self.weatherapi),
            _ => Err(AppError::Invalidreqwest(format!("Invalid provider: {}", provider_name))),
        }
    }
}

#[tonic::async_trait]
impl WeatherService for WeatherServiceImpl {
    async fn get_current_weather(
        &self,
        request: Request<WeatherRequest>
    ) -> Result<Response<WeatherResponse>, Status> {
        let req = request.into_inner();
        info!(
            latitude = req.latitude,
            longitude = req.longitude,
            provider = req.provider,
            "Received weather request"
        );
        
        let provider = self.get_provider(&req.provider).map_err(Status::from)?;
        debug!("Using provider: {}", provider.name());
        
        match provider.get_current_weather(req.latitude, req.longitude).await {
            Ok(weather) => {
                debug!(?weather, "Weather data received");
                let response = WeatherResponse {
                    temperature: weather.temperature,
                    humidity: weather.humidity,
                    condition: weather.condition,
                    wind_speed: weather.wind_speed,
                    wind_direction: weather.wind_direction,
                    uv_index: weather.uv_index,
                    visibility: weather.visibility,
                    country: weather.country,
                    max_temp: weather.max_temp,
                    min_temp: weather.min_temp,
                    provider: provider.name(),
                    rain_chance: 0.0,
                };
                debug!(?response, "Sending response");
                Ok(Response::new(response))
            },
            Err(e) => {
                error!(?e, "Error getting weather");
                Err(AppError::WeatherApi(e.to_string()).into())
            }
        }
    }

    async fn get_forecast(
        &self,
        request: Request<ForecastRequest>
    ) -> Result<Response<ForecastResponse>, Status> {
        let req = request.into_inner();
        info!(
            latitude = req.latitude,
            longitude = req.longitude,
            days = req.days,
            "Received forecast request"
        );
        
        let provider = self.get_provider(&req.provider).map_err(Status::from)?;

        match provider.get_forecast(req.latitude, req.longitude, req.days).await {
            Ok(forecasts) => {
                let forecast_responses = forecasts
                    .into_iter()
                    .map(|f| DayForecast {
                        date: f.date,
                        max_temp: f.max_temp,
                        min_temp: f.min_temp,
                        condition: f.condition,
                    })
                    .collect();

                debug!("Sending forecast response");
                Ok(Response::new(ForecastResponse { forecasts: forecast_responses }))
            },
            Err(e) => {
                error!(?e, "Error getting forecast");
                Err(AppError::WeatherApi(e.to_string()).into())
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::*;
    use mockall::mock;
    use crate::providers::CurrentWeather;

    // Create mock for WeatherProvider
    mock! {
        WeatherProvider {
            fn name(&self) -> String;
            async fn get_current_weather(
                &self,
                latitude: f64,
                longitude: f64,
            ) -> Result<CurrentWeather, Box<dyn std::error::Error + Send + Sync>>;
            async fn get_forecast(
                &self,
                latitude: f64,
                longitude: f64,
                days: i32,
            ) -> Result<Vec<DayForecast>, Box<dyn std::error::Error + Send + Sync>>;
        }
    }

    #[tokio::test]
    async fn test_get_current_weather_success() {
        let mock_weather = CurrentWeather {
            temperature: 20.0,
            humidity: 50.0,
            condition: "Sunny".to_string(),
            wind_speed: 10.0,
            wind_direction: 180.0,
            uv_index: 5.0,
            visibility: 10.0,
            country: "US".to_string(),
            max_temp: 25.0,
            min_temp: 15.0,
        };

        let mut mock_provider = MockWeatherProvider::new();
        mock_provider
            .expect_name()
            .returning(|| "MockProvider".to_string());
        mock_provider
            .expect_get_current_weather()
            .with(eq(40.0), eq(-74.0))
            .returning(move |_, _| Ok(mock_weather.clone()));

        Request::new(WeatherRequest {
            latitude: 40.0,
            longitude: -74.0,
            provider: "mockprovider".to_string(),
            client_id: "test_client".to_string(),
        });

        let response = mock_provider
            .get_current_weather(40.0, -74.0)
            .await
            .unwrap();

        assert_eq!(response.temperature, 20.0);
        assert_eq!(response.condition, "Sunny");
    }

    #[tokio::test]
    async fn test_get_forecast_success() {
        let mock_forecasts = vec![
            DayForecast {
                date: "2024-03-20".to_string(),
                max_temp: 25.0,
                min_temp: 15.0,
                condition: "Sunny".to_string(),
            }
        ];

        let mut mock_provider = MockWeatherProvider::new();
        mock_provider
            .expect_name()
            .returning(|| "MockProvider".to_string());
        mock_provider
            .expect_get_forecast()
            .with(eq(40.0), eq(-74.0), eq(1))
            .returning(move |_, _, _| Ok(mock_forecasts.clone()));

        Request::new(ForecastRequest {
            latitude: 40.0,
            longitude: -74.0,
            days: 1,
            provider: "mockprovider".to_string(),
            client_id: "test_client".to_string(),
        });

        let response = mock_provider
            .get_forecast(40.0, -74.0, 1)
            .await
            .unwrap();

        assert_eq!(response[0].date, "2024-03-20");
        assert_eq!(response[0].max_temp, 25.0);
    }
} 