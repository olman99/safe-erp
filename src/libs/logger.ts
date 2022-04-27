import { injectable } from "inversify";
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "dev";
  const isDevelopment = env === "dev";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const winstonLogger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export interface ILogger {
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  http(message: string): void;
  debug(message: string): void;
}

@injectable()
class Logger implements ILogger {
  private _logger;

  constructor() {
    this._logger = winstonLogger;
  }

  public error(message: string): void {
    this._logger.error(message);
  }

  public warn(message: string): void {
    this._logger.warn(message);
  }

  public info(message: string): void {
    this._logger.info(message);
  }

  public http(message: string): void {
    this._logger.http(message);
  }

  public debug(message: string): void {
    this._logger.debug(message);
  }
}

export default Logger;
