use config::{Config, ConfigError, File};
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
pub struct ProvidersConfig {
    pub openweather_api_key: String,
    pub weatherapi_api_key: String,
}

#[derive(Debug, Deserialize)]
pub struct Settings {
    pub providers: ProvidersConfig,
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        let run_mode = env::var("RUN_MODE").unwrap_or_else(|_| "development".into());

        let s = Config::builder()
            // Start with default settings
            .add_source(File::with_name("config/default"))
            // Add environment-specific settings
            .add_source(File::with_name(&format!("config/{}", run_mode)).required(false))
            // Add local settings
            .add_source(File::with_name("config/local").required(false))
            // Add environment variables with prefix "APP"
            .add_source(config::Environment::with_prefix("APP"))
            .build()?;

        // Deserialize the config into our Settings struct
        s.try_deserialize()
    }
}