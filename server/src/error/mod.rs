use thiserror::Error;
use tonic::Status;

#[derive(Error, Debug)]
pub enum AppError {

    #[error("Provider error: {0}")]
    Provider(String),

    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Weather API error: {0}")]
    WeatherApi(String),

    #[error("Invalid reqwest: {0}")]
    Invalidreqwest(String),

    #[error("Not found: {0}")]
    NotFound(String),
}

impl From<AppError> for Status {
    fn from(error: AppError) -> Self {
        match error {
            AppError::Provider(e) => Status::failed_precondition(e),
            AppError::Config(e) => Status::internal(format!("Configuration error: {}", e)),
            AppError::WeatherApi(e) => Status::unavailable(e),
            AppError::Invalidreqwest(e) => Status::invalid_argument(e),
            AppError::NotFound(e) => Status::not_found(e),
        }
    }
}

pub type AppResult<T> = Result<T, AppError>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_provider_error_conversion() {
        let error = AppError::Provider("provider error".to_string());
        let status = Status::from(error);
        assert_eq!(status.code(), tonic::Code::FailedPrecondition);
        assert_eq!(status.message(), "provider error");
    }

    #[test]
    fn test_config_error_conversion() {
        let error = AppError::Config("config error".to_string());
        let status = Status::from(error);
        assert_eq!(status.code(), tonic::Code::Internal);
        assert_eq!(status.message(), "Configuration error: config error");
    }

    #[test]
    fn test_weather_api_error_conversion() {
        let error = AppError::WeatherApi("weather api error".to_string());
        let status = Status::from(error);
        assert_eq!(status.code(), tonic::Code::Unavailable);
        assert_eq!(status.message(), "weather api error");
    }

    #[test]
    fn test_invalid_reqwest_error_conversion() {
        let error = AppError::Invalidreqwest("invalid request".to_string());
        let status = Status::from(error);
        assert_eq!(status.code(), tonic::Code::InvalidArgument);
        assert_eq!(status.message(), "invalid request");
    }

    #[test]
    fn test_not_found_error_conversion() {
        let error = AppError::NotFound("resource not found".to_string());
        let status = Status::from(error);
        assert_eq!(status.code(), tonic::Code::NotFound);
        assert_eq!(status.message(), "resource not found");
    }
}