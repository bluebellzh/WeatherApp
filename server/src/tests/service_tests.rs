use crate::service::weather::WeatherServiceImpl;
use crate::proto::weather::WeatherRequest;
use crate::proto::weather::weather_service_server::WeatherService;
use tonic::Request;

#[tokio::test]
async fn test_weather_service_integration() {
    let service = WeatherServiceImpl::new();
    
    let weather_request = Request::new(WeatherRequest {
        latitude: 40.7128,
        longitude: -74.0060,
        provider: "weatherapi".to_string(),
        client_id: "test_client".to_string(),
    });

    let weather_response = service
        .get_current_weather(weather_request)
        .await
        .expect("Failed to get weather");

    assert!(weather_response.get_ref().temperature >= -100.0);
    assert!(weather_response.get_ref().temperature <= 100.0);
    assert!(!weather_response.get_ref().condition.is_empty());
}