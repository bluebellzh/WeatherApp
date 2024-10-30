use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurrentWeather {
    pub temperature: f64,
    pub humidity: f64,
    pub condition: String,
    pub wind_speed: f64,
    pub wind_direction: f64,
    pub uv_index: f64,
    pub visibility: f64,
    pub country: String,
    pub max_temp: f64,
    pub min_temp: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DayForecast {
    pub date: String,
    pub max_temp: f32,
    pub min_temp: f32,
    pub condition: String,
}

#[async_trait]
pub trait WeatherProvider: Send + Sync {
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