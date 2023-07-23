type ConsoleError = typeof console.error;
type ConsoleWarn = typeof console.warn;
type ConsoleInfo = typeof console.info;
type ConsoleDebug = typeof console.debug;
type ConsoleTrace = typeof console.trace;

export type Console =
  | ConsoleError
  | ConsoleWarn
  | ConsoleInfo
  | ConsoleDebug
  | ConsoleTrace;
export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

const getLogger = (level: LogLevel) => {
  const getConsole = (level: LogLevel): [Console, number] => {
    switch (level) {
      case "error":
        return [console.error, 31];
      case "warn":
        return [console.warn, 33];
      case "info":
        return [console.info, 36];
      case "debug":
        return [console.debug, 34];
      case "trace":
        return [console.trace, 35];
    }
  };

  const [logger, color] = getConsole(level);
  const logLevelAnnotation = `\x1b[1;${color}m[${level
    .toUpperCase()
    .padStart(5)}]\x1b[0m`;
  const logDateAnnotation = () =>
    `\x1b[${color}m${new Date().toISOString()}\x1b[0m`;

  return (...args: any[]) => {
    logger(logLevelAnnotation, logDateAnnotation(), ...args);
  };
};

export const logger = {
  error: getLogger("error"),
  warn: getLogger("warn"),
  info: getLogger("info"),
  debug: getLogger("debug"),
  trace: getLogger("trace"),
};

export type Logger = typeof logger;
