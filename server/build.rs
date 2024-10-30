use tracing::{info, warn};
use tracing_subscriber::FmtSubscriber;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize basic tracing subscriber for build script
    FmtSubscriber::builder()
        .with_env_filter("info")
        .init();

    let proto_file = "../proto/weather.proto";
    let proto_dir = "../proto";

    info!(
        proto_file = %proto_file,
        proto_dir = %proto_dir,
        "Building protocol buffers"
    );
    
    match tonic_build::configure()
        .build_server(true)
        .build_client(true)
        .compile(&[proto_file], &[proto_dir])
    {
        Ok(_) => {
            info!("Successfully compiled protocol buffers");
            Ok(())
        }
        Err(e) => {
            warn!(error = %e, "Failed to compile protocol buffers");
            Err(e.into())
        }
    }
} 