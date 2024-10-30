use crate::providers::{OpenWeatherProvider, WeatherApiProvider, WeatherProvider};

#[tokio::test]
async fn test_providers_integration() {
    let openweather = OpenWeatherProvider::new();
    let weatherapi = WeatherApiProvider::new();

    // Test both providers with the same coordinates
    let latitude = 40.7128;
    let longitude = -74.0060;

    // Test OpenWeather
    let ow_result = openweather
        .get_current_weather(latitude, longitude)
        .await
        .expect("OpenWeather request failed");

    // Test WeatherAPI
    let wa_result = weatherapi
        .get_current_weather(latitude, longitude)
        .await
        .expect("WeatherAPI request failed");

    // Both should return reasonable values
    assert!(ow_result.temperature >= -100.0 && ow_result.temperature <= 100.0);
    assert!(wa_result.temperature >= -100.0 && wa_result.temperature <= 100.0);
}