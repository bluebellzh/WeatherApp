import * as jspb from 'google-protobuf'



export class WeatherRequest extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): WeatherRequest;

  getLatitude(): number;
  setLatitude(value: number): WeatherRequest;

  getLongitude(): number;
  setLongitude(value: number): WeatherRequest;

  getProvider(): string;
  setProvider(value: string): WeatherRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeatherRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WeatherRequest): WeatherRequest.AsObject;
  static serializeBinaryToWriter(message: WeatherRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeatherRequest;
  static deserializeBinaryFromReader(message: WeatherRequest, reader: jspb.BinaryReader): WeatherRequest;
}

export namespace WeatherRequest {
  export type AsObject = {
    clientId: string,
    latitude: number,
    longitude: number,
    provider: string,
  }
}

export class WeatherResponse extends jspb.Message {
  getTemperature(): number;
  setTemperature(value: number): WeatherResponse;

  getCondition(): string;
  setCondition(value: string): WeatherResponse;

  getWindSpeed(): number;
  setWindSpeed(value: number): WeatherResponse;

  getWindDirection(): number;
  setWindDirection(value: number): WeatherResponse;

  getHumidity(): number;
  setHumidity(value: number): WeatherResponse;

  getVisibility(): number;
  setVisibility(value: number): WeatherResponse;

  getUvIndex(): number;
  setUvIndex(value: number): WeatherResponse;

  getRainChance(): number;
  setRainChance(value: number): WeatherResponse;

  getMaxTemp(): number;
  setMaxTemp(value: number): WeatherResponse;

  getMinTemp(): number;
  setMinTemp(value: number): WeatherResponse;

  getCountry(): string;
  setCountry(value: string): WeatherResponse;

  getProvider(): string;
  setProvider(value: string): WeatherResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeatherResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WeatherResponse): WeatherResponse.AsObject;
  static serializeBinaryToWriter(message: WeatherResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeatherResponse;
  static deserializeBinaryFromReader(message: WeatherResponse, reader: jspb.BinaryReader): WeatherResponse;
}

export namespace WeatherResponse {
  export type AsObject = {
    temperature: number,
    condition: string,
    windSpeed: number,
    windDirection: number,
    humidity: number,
    visibility: number,
    uvIndex: number,
    rainChance: number,
    maxTemp: number,
    minTemp: number,
    country: string,
    provider: string,
  }
}

export class ForecastRequest extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): ForecastRequest;

  getLatitude(): number;
  setLatitude(value: number): ForecastRequest;

  getLongitude(): number;
  setLongitude(value: number): ForecastRequest;

  getProvider(): string;
  setProvider(value: string): ForecastRequest;

  getDays(): number;
  setDays(value: number): ForecastRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ForecastRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ForecastRequest): ForecastRequest.AsObject;
  static serializeBinaryToWriter(message: ForecastRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ForecastRequest;
  static deserializeBinaryFromReader(message: ForecastRequest, reader: jspb.BinaryReader): ForecastRequest;
}

export namespace ForecastRequest {
  export type AsObject = {
    clientId: string,
    latitude: number,
    longitude: number,
    provider: string,
    days: number,
  }
}

export class ForecastResponse extends jspb.Message {
  getForecastsList(): Array<DayForecast>;
  setForecastsList(value: Array<DayForecast>): ForecastResponse;
  clearForecastsList(): ForecastResponse;
  addForecasts(value?: DayForecast, index?: number): DayForecast;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ForecastResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ForecastResponse): ForecastResponse.AsObject;
  static serializeBinaryToWriter(message: ForecastResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ForecastResponse;
  static deserializeBinaryFromReader(message: ForecastResponse, reader: jspb.BinaryReader): ForecastResponse;
}

export namespace ForecastResponse {
  export type AsObject = {
    forecastsList: Array<DayForecast.AsObject>,
  }
}

export class DayForecast extends jspb.Message {
  getDate(): string;
  setDate(value: string): DayForecast;

  getMaxTemp(): number;
  setMaxTemp(value: number): DayForecast;

  getMinTemp(): number;
  setMinTemp(value: number): DayForecast;

  getCondition(): string;
  setCondition(value: string): DayForecast;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DayForecast.AsObject;
  static toObject(includeInstance: boolean, msg: DayForecast): DayForecast.AsObject;
  static serializeBinaryToWriter(message: DayForecast, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DayForecast;
  static deserializeBinaryFromReader(message: DayForecast, reader: jspb.BinaryReader): DayForecast;
}

export namespace DayForecast {
  export type AsObject = {
    date: string,
    maxTemp: number,
    minTemp: number,
    condition: string,
  }
}

