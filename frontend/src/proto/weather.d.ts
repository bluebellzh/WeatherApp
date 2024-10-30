declare module '*_grpc_web_pb' {
    export * from './weather_pb';
    export class WeatherServiceClient {
        constructor(hostname: string, credentials?: null, options?: null);
        // Add other method signatures as needed
    }
}