mod traits;
mod openweather;
mod weatherapi;

pub use traits::WeatherProvider;
pub use openweather::OpenWeatherProvider;
pub use weatherapi::WeatherApiProvider;
pub use self::traits::CurrentWeather;