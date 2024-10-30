use async_trait::async_trait;
use serde::Deserialize;
use crate::providers::traits::{WeatherProvider, CurrentWeather, DayForecast};
use crate::config::Settings;
use once_cell::sync::Lazy;
use reqwest;
use tracing::debug;

static WEATHERAPI: Lazy<WeatherApiProvider> = Lazy::new(|| {
    let settings = Settings::new()
        .expect("Failed to load settings");
    
    WeatherApiProvider {
        api_key: settings.providers.weatherapi_api_key.clone(),
        client: reqwest::Client::new(),
    }
});

pub struct WeatherApiProvider {
    api_key: String,
    client: reqwest::Client,
}

#[derive(Deserialize)]
struct WeatherApiResponse {
    current: CurrentData,
    location: LocationData,
}

#[derive(Deserialize)]
struct LocationData {
    country: String,
}

#[derive(Deserialize)]
struct CurrentData {
    temp_c: f32,
    humidity: f32,
    condition: ConditionData,
    wind_kph: f32,
    wind_dir: String,
    uv: f32,
    vis_km: f32,
}

#[derive(Deserialize)]
struct ConditionData {
    text: String,
}

#[derive(Deserialize)]
struct WeatherApiForecastResponse {
    forecast: ForecastData,
}

#[derive(Deserialize)]
struct ForecastData {
    forecastday: Vec<ForecastDay>,
}

#[derive(Deserialize)]
struct ForecastDay {
    date: String,
    day: DayData,
}

#[derive(Deserialize)]
struct DayData {
    maxtemp_c: f32,
    mintemp_c: f32,
    condition: ConditionData,
}

impl WeatherApiProvider {
    pub fn new() -> &'static Self {
        &WEATHERAPI
    }

    fn wind_direction_to_degrees(&self, direction: &str) -> f64 {
        match direction {
            "N" => 0.0,
            "NNE" => 22.5,
            "NE" => 45.0,
            "ENE" => 67.5,
            "E" => 90.0,
            "ESE" => 112.5,
            "SE" => 135.0,
            "SSE" => 157.5,
            "S" => 180.0,
            "SSW" => 202.5,
            "SW" => 225.0,
            "WSW" => 247.5,
            "W" => 270.0,
            "WNW" => 292.5,
            "NW" => 315.0,
            "NNW" => 337.5,
            _ => 0.0,
        }
    }
}

#[async_trait]
impl WeatherProvider for WeatherApiProvider {
    fn name(&self) -> String {
        "WeatherAPI".to_string()
    }

    async fn get_current_weather(
        &self,
        latitude: f64,
        longitude: f64,
    ) -> Result<CurrentWeather, Box<dyn std::error::Error + Send + Sync>> {
        let url = format!(
            "http://api.weatherapi.com/v1/current.json?key={}&q={},{}&aqi=no",
            self.api_key, latitude, longitude
        );
        debug!(url = %url, "Fetching weather from WeatherAPI");

        let response = self.client
            .get(&url)
            .send()
            .await?;
            
        debug!(status = ?response.status(), "WeatherAPI response status");

        let weather_response: WeatherApiResponse = response.json().await?;
        debug!(
            temperature = weather_response.current.temp_c,
            condition = %weather_response.current.condition.text,
            "Received weather data"
        );

        let weather = CurrentWeather {
            temperature: weather_response.current.temp_c as f64,
            humidity: weather_response.current.humidity as f64,
            condition: weather_response.current.condition.text,
            wind_speed: weather_response.current.wind_kph as f64,
            wind_direction: self.wind_direction_to_degrees(&weather_response.current.wind_dir) as f64,
            uv_index: weather_response.current.uv as f64,
            visibility: weather_response.current.vis_km as f64,
            country: weather_response.location.country,
            max_temp: (weather_response.current.temp_c + 2.0) as f64,
            min_temp: (weather_response.current.temp_c - 2.0) as f64,
        };

        Ok(weather)
    }

    async fn get_forecast(
        &self,
        latitude: f64,
        longitude: f64,
        days: i32,
    ) -> Result<Vec<DayForecast>, Box<dyn std::error::Error + Send + Sync>> {
        let url = format!(
            "http://api.weatherapi.com/v1/forecast.json?key={}&q={},{}&days={}&aqi=no",
            self.api_key, latitude, longitude, days
        );

        let response: WeatherApiForecastResponse = self.client
            .get(&url)
            .send()
            .await?
            .json()
            .await?;

        Ok(response.forecast.forecastday
            .into_iter()
            .map(|f| DayForecast {
                date: f.date,
                max_temp: f.day.maxtemp_c,
                min_temp: f.day.mintemp_c,
                condition: f.day.condition.text,
            })
            .collect())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wind_direction_to_degrees() {
        let provider = WeatherApiProvider {
            api_key: "test_key".to_string(),
            client: reqwest::Client::new(),
        };

        assert_eq!(provider.wind_direction_to_degrees("N"), 0.0);
        assert_eq!(provider.wind_direction_to_degrees("E"), 90.0);
        assert_eq!(provider.wind_direction_to_degrees("S"), 180.0);
        assert_eq!(provider.wind_direction_to_degrees("W"), 270.0);
        assert_eq!(provider.wind_direction_to_degrees("NW"), 315.0);
    }
}