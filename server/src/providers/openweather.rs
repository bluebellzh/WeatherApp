use async_trait::async_trait;
use serde::Deserialize;
use crate::providers::traits::{WeatherProvider, CurrentWeather, DayForecast};
use crate::config::Settings;
use once_cell::sync::Lazy;
use reqwest;
use std::collections::HashMap;
use tracing::debug;

// Static provider instance
static OPENWEATHER: Lazy<OpenWeatherProvider> = Lazy::new(|| {
    let settings = Settings::new()
        .expect("Failed to load settings");
    
    OpenWeatherProvider {
        api_key: settings.providers.openweather_api_key.clone(),
        client: reqwest::Client::new(),
    }
});

pub struct OpenWeatherProvider {
    api_key: String,
    client: reqwest::Client,
}

impl OpenWeatherProvider {
    pub fn new() -> &'static Self {
        &OPENWEATHER
    }
}

#[derive(Deserialize)]
struct OpenWeatherResponse {
    main: MainData,
    weather: Vec<WeatherData>,
    wind: WindData,
    visibility: i32,
    sys: SysData,
}

#[derive(Deserialize)]
struct MainData {
    temp: f32,
    humidity: f32,
    temp_max: f32,
    temp_min: f32,
}

#[derive(Deserialize)]
struct WeatherData {
    main: String,
}

#[derive(Deserialize)]
struct WindData {
    speed: f32,
    deg: f32,
}

#[derive(Deserialize)]
struct OpenWeatherForecastResponse {
    list: Vec<ForecastData>,
}

#[derive(Deserialize)]
struct ForecastData {
    dt_txt: String,
    main: MainData,
    weather: Vec<WeatherData>,
}

#[derive(Deserialize)]
struct SysData {
    country: String,
}

#[async_trait]
impl WeatherProvider for OpenWeatherProvider {
    fn name(&self) -> String {
        "OpenWeather".to_string()
    }

    async fn get_current_weather(
        &self,
        latitude: f64,
        longitude: f64,
    ) -> Result<CurrentWeather, Box<dyn std::error::Error + Send + Sync>> {
        let url = format!(
            "https://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&appid={}&units=metric",
            latitude, longitude, self.api_key
        );
        debug!(url = %url, "Fetching weather");

        let response = self.client
            .get(&url)
            .send()
            .await?;
        
        debug!(status = ?response.status(), "OpenWeather API response status");
        
        let response_text = response.text().await?;
        debug!(response = %response_text, "OpenWeather API response body");
        
        let weather_response: OpenWeatherResponse = serde_json::from_str(&response_text)?;
        
        let weather = CurrentWeather {
            temperature: weather_response.main.temp as f64,
            humidity: weather_response.main.humidity as f64,
            condition: weather_response.weather[0].main.clone(),
            wind_speed: weather_response.wind.speed as f64,
            wind_direction: weather_response.wind.deg as f64,
            uv_index: 0.0,
            visibility: (weather_response.visibility as f32 / 1000.0) as f64,
            country: weather_response.sys.country,
            max_temp: weather_response.main.temp_max as f64,
            min_temp: weather_response.main.temp_min as f64,
        };
        
        debug!(?weather, "Transformed weather data");
        Ok(weather)
    }

    async fn get_forecast(
        &self,
        latitude: f64,
        longitude: f64,
        days: i32,
    ) -> Result<Vec<DayForecast>, Box<dyn std::error::Error + Send + Sync>> {
        let url = format!(
            "https://api.openweathermap.org/data/2.5/forecast?lat={}&lon={}&appid={}&units=metric",
            latitude, longitude, self.api_key
        );

        let response: OpenWeatherForecastResponse = self.client
            .get(&url)
            .send()
            .await?
            .json()
            .await?;

        // Group forecasts by date
        let mut daily_forecasts: HashMap<String, Vec<ForecastData>> = HashMap::new();
        
        for forecast in response.list {
            let date = forecast.dt_txt.split_whitespace().next()
                .unwrap_or_default()
                .to_string();
            daily_forecasts.entry(date).or_default().push(forecast);
        }

        let mut result: Vec<DayForecast> = daily_forecasts
            .into_iter()
            .take(days as usize)
            .map(|(date, forecasts)| {
                let (max_temp, min_temp) = forecasts.iter()
                    .fold((f32::MIN, f32::MAX), |(max, min), f| {
                        (max.max(f.main.temp), min.min(f.main.temp))
                    });

                // Use the most common condition for the day
                let condition = forecasts.iter()
                    .map(|f| f.weather[0].main.clone())
                    .next()
                    .unwrap_or_else(|| "Unknown".to_string());

                DayForecast {
                    date,
                    max_temp,
                    min_temp,
                    condition,
                }
            })
            .collect();

        result.sort_by(|a, b| a.date.cmp(&b.date));
        Ok(result)
    }
}