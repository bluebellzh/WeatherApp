pub mod providers;
pub mod proto;
pub mod config;
pub mod service;
pub mod error;
#[cfg(test)]
mod tests;


use tonic::transport::Server;
use service::weather::WeatherServiceImpl;
use proto::weather::weather_service_server::WeatherServiceServer;
use tracing::info;
use tracing_subscriber::{self, EnvFilter};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing with filtered output
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(tracing::Level::INFO.into())
                // Suppress h2 debug logs
                .parse("h2=error,tower_http=error")
                .unwrap()
        )
        .init();

    let addr = "0.0.0.0:50051".parse()?;
    let weather_service = WeatherServiceImpl::new();

    info!("Weather server listening on {}", addr);

    Server::builder()
        .add_service(WeatherServiceServer::new(weather_service))
        .serve(addr)
        .await?;

    Ok(())
}