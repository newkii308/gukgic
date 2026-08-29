type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  route?: string;
  [key: string]: any;
}

class Logger {
  private format(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...context,
    });
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.format('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.format('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.format('warn', message, context));
  }

  error(message: string, error?: any, context?: LogContext) {
    const errorDetails = error instanceof Error
      ? { errorMessage: error.message, stack: error.stack }
      : { error };

    console.error(
      this.format('error', message, {
        ...context,
        ...errorDetails,
      })
    );
  }
}

export const logger = new Logger();
