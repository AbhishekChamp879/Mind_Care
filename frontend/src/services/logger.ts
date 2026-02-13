/**
 * Logger Service for Mind Care Application
 * 
 * Provides structured logging with different levels and environment-aware output.
 * In production, logs can be sent to external logging services.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 1000;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, category: string, message: string, data?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
    };
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const levelName = LogLevel[entry.level];
    return `[${timestamp}] [${levelName}] [${entry.category}] ${entry.message}`;
  }

  private outputToConsole(entry: LogEntry): void {
    if (!this.isDevelopment && entry.level < LogLevel.WARN) {
      return; // Don't output debug/info logs in production
    }

    const formattedMessage = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, entry.data || '', entry.error || '');
        break;
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // In production, you might want to send logs to external services
    // like LogRocket, Sentry, DataDog, etc.
    if (!this.isDevelopment && entry.level >= LogLevel.ERROR) {
      // Example: Send to error tracking service
      // errorTrackingService.captureError(entry);
    }
  }

  private log(level: LogLevel, category: string, message: string, data?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, category, message, data, error);
    this.addToHistory(entry);
    this.outputToConsole(entry);
    this.sendToExternalService(entry);
  }

  // Public logging methods
  public debug(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  public info(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  public warn(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  public error(category: string, message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  // Utility methods
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public getLogHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  public clearHistory(): void {
    this.logHistory = [];
  }

  // Specialized logging methods for different categories
  public logAudioError(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.error('AUDIO', message, error, data);
  }

  public logVideoCallEvent(message: string, data?: Record<string, unknown>): void {
    this.info('VIDEO_CALL', message, data);
  }

  public logVideoCallError(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.error('VIDEO_CALL', message, error, data);
  }

  public logMeditationSession(message: string, data?: Record<string, unknown>): void {
    this.info('MEDITATION', message, data);
  }

  public logStudyGroupEvent(message: string, data?: Record<string, unknown>): void {
    this.info('STUDY_GROUP', message, data);
  }

  public logUserPreferences(message: string, data?: Record<string, unknown>): void {
    this.info('USER_PREFERENCES', message, data);
  }

  public logPerformance(message: string, data?: Record<string, unknown>): void {
    this.debug('PERFORMANCE', message, data);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions for common usage patterns
export const logAudioError = (message: string, error?: Error, data?: Record<string, unknown>): void => 
  logger.logAudioError(message, error, data);

export const logVideoCall = (message: string, data?: Record<string, unknown>): void => 
  logger.logVideoCallEvent(message, data);

export const logVideoCallError = (message: string, error?: Error, data?: Record<string, unknown>): void => 
  logger.logVideoCallError(message, error, data);

export const logMeditation = (message: string, data?: Record<string, unknown>): void => 
  logger.logMeditationSession(message, data);

export const logStudyGroup = (message: string, data?: Record<string, unknown>): void => 
  logger.logStudyGroupEvent(message, data);

export const logUserPrefs = (message: string, data?: Record<string, unknown>): void => 
  logger.logUserPreferences(message, data);

export const logPerformance = (message: string, data?: Record<string, unknown>): void => 
  logger.logPerformance(message, data);

// Default export
export default logger;