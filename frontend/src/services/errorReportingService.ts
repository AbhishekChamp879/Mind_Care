import React from 'react';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error categories for mental health platform
 */
export enum ErrorCategory {
  TECHNICAL = 'technical',
  USER = 'user',
  SYSTEM = 'system',
  DATA = 'data',
  PRIVACY = 'privacy',
  CRISIS = 'crisis'
}

/**
 * Error type classifications
 */
export enum ErrorType {
  NETWORK = 'network',
  CHUNK_LOAD = 'chunk_load',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  AUTHENTICATION = 'authentication',
  DATA_CORRUPTION = 'data_corruption',
  CRISIS_DETECTION = 'crisis_detection',
  PRIVACY_VIOLATION = 'privacy_violation',
  UNKNOWN = 'unknown'
}

/**
 * Error context interface for additional metadata
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  route?: string;
  timestamp?: Date;
  userAgent?: string;
  viewport?: { width: number; height: number };
  connectivity?: 'online' | 'offline';
  mentalHealthContext?: {
    crisisIndicators?: boolean;
    moodState?: string;
    supportLevel?: 'low' | 'medium' | 'high';
  };
  [key: string]: unknown;
}

/**
 * Error report interface
 */
export interface ErrorReport {
  id: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  errorInfo?: {
    componentStack: string;
  };
  classification: {
    type: ErrorType;
    severity: ErrorSeverity;
    category: ErrorCategory;
  };
  context: ErrorContext;
  timestamp: Date;
  userFriendlyMessage: string;
  actionable: boolean;
  privacyLevel: 'public' | 'internal' | 'restricted';
}

/**
 * Error reporting configuration
 */
interface ErrorReportingConfig {
  enableReporting: boolean;
  enableConsoleLogging: boolean;
  maxReportsPerSession: number;
  reportingEndpoint?: string;
  privacyMode: boolean;
  crisisDetectionEnabled: boolean;
}

/**
 * Error classification patterns
 */
const ERROR_PATTERNS = {
  [ErrorType.NETWORK]: {
    patterns: ['fetch', 'network', 'connection', 'timeout', 'cors'],
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.SYSTEM
  },
  [ErrorType.CHUNK_LOAD]: {
    patterns: ['chunk', 'loading css', 'loading js', 'import'],
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.TECHNICAL
  },
  [ErrorType.PERMISSION]: {
    patterns: ['permission', 'unauthorized', 'forbidden', 'access denied'],
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.USER
  },
  [ErrorType.VALIDATION]: {
    patterns: ['validation', 'invalid', 'required', 'format'],
    severity: ErrorSeverity.LOW,
    category: ErrorCategory.USER
  },
  [ErrorType.AUTHENTICATION]: {
    patterns: ['auth', 'login', 'token', 'session expired'],
    severity: ErrorSeverity.MEDIUM,
    category: ErrorCategory.USER
  },
  [ErrorType.RUNTIME]: {
    patterns: ['reference', 'type', 'undefined', 'null'],
    severity: ErrorSeverity.HIGH,
    category: ErrorCategory.TECHNICAL
  },
  [ErrorType.CRISIS_DETECTION]: {
    patterns: ['crisis', 'emergency', 'self-harm', 'suicide'],
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.CRISIS
  },
  [ErrorType.PRIVACY_VIOLATION]: {
    patterns: ['privacy', 'data leak', 'unauthorized access'],
    severity: ErrorSeverity.CRITICAL,
    category: ErrorCategory.PRIVACY
  }
};

/**
 * User-friendly error messages by category and type
 */
const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: {
    default: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
    crisis: "We're having connection issues, but help is still available. If this is urgent, please call 988 or text HOME to 741741."
  },
  [ErrorType.CHUNK_LOAD]: {
    default: "We're updating the app to serve you better. Please refresh the page to get the latest version.",
    crisis: "Please refresh the page. If you need immediate support, crisis resources are available below."
  },
  [ErrorType.PERMISSION]: {
    default: "You don't have access to this feature. If you believe this is a mistake, please contact support.",
    crisis: "Access restricted. If this is a crisis situation, please use the emergency resources below instead."
  },
  [ErrorType.VALIDATION]: {
    default: "Please check the information you entered and try again.",
    crisis: "There's an issue with the form. For immediate help, please use the crisis resources below."
  },
  [ErrorType.AUTHENTICATION]: {
    default: "Your session has expired. Please log in again to continue.",
    crisis: "Session expired. For immediate support without logging in, please call 988."
  },
  [ErrorType.RUNTIME]: {
    default: "Something unexpected happened. Your data is safe, and we're working to fix this issue.",
    crisis: "Technical issue detected. Your safety is our priority - please use emergency resources if needed."
  },
  [ErrorType.CRISIS_DETECTION]: {
    default: "We detected this might be urgent. Immediate help is available through the resources below.",
    crisis: "Crisis support activated. Please contact emergency services or use the resources provided immediately."
  },
  [ErrorType.DATA_CORRUPTION]: {
    default: "We detected a data integrity issue. Your information is being protected and we're working to resolve this.",
    crisis: "Data integrity issue detected. For immediate support, please use emergency resources while we secure your information."
  },
  [ErrorType.PRIVACY_VIOLATION]: {
    default: "We detected a potential privacy concern. Your data security is our top priority and we're investigating immediately.",
    crisis: "Privacy concern detected. For immediate support, please use emergency resources while we secure your information."
  },
  [ErrorType.UNKNOWN]: {
    default: "We encountered an unexpected issue. Your data is safe, and our team has been notified.",
    crisis: "Unexpected error. If this is a crisis, please don't wait - use emergency resources immediately."
  }
};

/**
 * Error Reporting Service Class
 */
class ErrorReportingService {
  private config: ErrorReportingConfig;
  private reportCount: number = 0;
  private reportedErrors: Set<string> = new Set();

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enableReporting: true,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      maxReportsPerSession: 50,
      privacyMode: true,
      crisisDetectionEnabled: true,
      ...config
    };
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Classify error based on message and stack trace
   */
  public classifyError(error: Error): {
    type: ErrorType;
    severity: ErrorSeverity;
    category: ErrorCategory;
  } {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Check for crisis-related keywords first (highest priority)
    if (this.config.crisisDetectionEnabled) {
      const crisisPattern = ERROR_PATTERNS[ErrorType.CRISIS_DETECTION];
      if (crisisPattern.patterns.some(pattern =>
        message.includes(pattern) || name.includes(pattern) || stack.includes(pattern)
      )) {
        return {
          type: ErrorType.CRISIS_DETECTION,
          severity: ErrorSeverity.CRITICAL,
          category: ErrorCategory.CRISIS
        };
      }
    }

    // Check other patterns
    for (const [type, pattern] of Object.entries(ERROR_PATTERNS)) {
      if (type === ErrorType.CRISIS_DETECTION) continue; // Already checked

      if (pattern.patterns.some(p =>
        message.includes(p) || name.includes(p) || stack.includes(p)
      )) {
        return {
          type: type as ErrorType,
          severity: pattern.severity,
          category: pattern.category
        };
      }
    }

    // Default classification
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.TECHNICAL
    };
  }

  /**
   * Get user-friendly error message
   */
  public getUserFriendlyMessage(error: Error, context?: ErrorContext): string {
    const classification = this.classifyError(error);
    const isCrisisContext = context?.mentalHealthContext?.crisisIndicators ||
      classification.category === ErrorCategory.CRISIS;

    const messages = ERROR_MESSAGES[classification.type] || ERROR_MESSAGES[ErrorType.UNKNOWN];

    return isCrisisContext && messages.crisis ? messages.crisis : messages.default;
  }

  /**
   * Detect if error indicates a crisis situation
   */
  public isCrisisRelated(error: Error, context?: ErrorContext): boolean {
    const classification = this.classifyError(error);
    return classification.category === ErrorCategory.CRISIS ||
      classification.severity === ErrorSeverity.CRITICAL ||
      context?.mentalHealthContext?.crisisIndicators === true;
  }

  /**
   * Sanitize sensitive data from error reports
   */
  private sanitizeErrorData(error: Error, context: ErrorContext): {
    sanitizedError: {
      name: string;
      message: string;
      stack?: string;
    };
    sanitizedContext: ErrorContext;
  } {
    if (!this.config.privacyMode) {
      return { sanitizedError: error, sanitizedContext: context };
    }

    // Sanitize error message and stack
    const sanitizedError = {
      name: error.name,
      message: this.sanitizeMessage(error.message),
      stack: this.sanitizeStack(error.stack)
    };

    // Sanitize context
    const sanitizedContext = {
      ...context,
      userId: context.userId ? this.hashUserId(context.userId) : undefined,
      sessionId: context.sessionId ? this.hashSessionId(context.sessionId) : undefined,
      // Remove potentially sensitive fields
      personalData: undefined,
      sensitiveInfo: undefined,
    };

    return { sanitizedError, sanitizedContext };
  }

  /**
   * Sanitize error message to remove sensitive information
   */
  private sanitizeMessage(message: string): string {
    return message
      .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]') // Email addresses
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN format
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD]') // Credit card format
      .replace(/token[:\s=][\w-]+/gi, 'token:[REDACTED]') // Auth tokens
      .replace(/password[:\s=]\S+/gi, 'password:[REDACTED]'); // Passwords
  }

  /**
   * Sanitize stack trace
   */
  private sanitizeStack(stack?: string): string | undefined {
    if (!stack) return undefined;

    return stack
      .replace(/file:\/\/\/[^\s]+/g, 'file://[PATH]')
      .replace(/http:\/\/localhost:\d+/g, 'http://localhost:[PORT]')
      .replace(/webpack-internal:\/\/\/[^\s]+/g, 'webpack-internal://[PATH]');
  }

  /**
   * Hash user ID for privacy
   */
  private hashUserId(userId: string): string {
    // Simple hash for demonstration - use proper hashing in production
    return `user_${btoa(userId).slice(0, 8)}`;
  }

  /**
   * Hash session ID for privacy
   */
  private hashSessionId(sessionId: string): string {
    return `session_${btoa(sessionId).slice(0, 8)}`;
  }

  /**
   * Check if error should be rate limited
   */
  private shouldReportError(error: Error): boolean {
    const errorSignature = `${error.name}:${error.message.slice(0, 100)}`;

    // Check rate limiting
    if (this.reportCount >= this.config.maxReportsPerSession) {
      return false;
    }

    // Check for duplicate errors
    if (this.reportedErrors.has(errorSignature)) {
      return false;
    }

    this.reportedErrors.add(errorSignature);
    return true;
  }

  /**
   * Report error to external service
   */
  private async sendErrorReport(report: ErrorReport): Promise<void> {
    if (!this.config.enableReporting || !this.config.reportingEndpoint) {
      return;
    }

    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
    } catch (reportingError) {
      if (this.config.enableConsoleLogging) {
        console.error('Failed to send error report:', reportingError);
      }
    }
  }

  /**
   * Main error reporting method
   */
  public async reportError(
    error: Error,
    context: ErrorContext = {},
    errorInfo?: React.ErrorInfo
  ): Promise<string> {
    const errorId = this.generateErrorId();

    // Check if we should report this error
    if (!this.shouldReportError(error)) {
      return errorId;
    }

    const classification = this.classifyError(error);
    const { sanitizedError, sanitizedContext } = this.sanitizeErrorData(error, context);

    // Enhance context with environment data
    const enhancedContext: ErrorContext = {
      ...sanitizedContext,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connectivity: navigator.onLine ? 'online' : 'offline',
      route: window.location.pathname,
    };

    const report: ErrorReport = {
      id: errorId,
      error: sanitizedError,
      errorInfo: errorInfo && errorInfo.componentStack ? {
        componentStack: errorInfo.componentStack
      } : undefined,
      classification,
      context: enhancedContext,
      timestamp: new Date(),
      userFriendlyMessage: this.getUserFriendlyMessage(error, context),
      actionable: classification.severity !== ErrorSeverity.CRITICAL,
      privacyLevel: classification.category === ErrorCategory.PRIVACY ? 'restricted' :
        classification.category === ErrorCategory.CRISIS ? 'internal' : 'public'
    };

    // Log to console in development
    if (this.config.enableConsoleLogging) {
      console.group(`🚨 Error Report: ${errorId}`);
      console.error('Error:', error);
      console.log('Classification:', classification);
      console.log('Context:', context);
      console.log('User Message:', report.userFriendlyMessage);
      console.groupEnd();
    }

    // Send to external reporting service
    await this.sendErrorReport(report);

    // Increment report count
    this.reportCount++;

    // Handle crisis situations
    if (this.isCrisisRelated(error, context)) {
      this.handleCrisisError(report);
    }

    return errorId;
  }

  /**
   * Handle crisis-related errors with immediate response
   */
  private handleCrisisError(report: ErrorReport): void {
    // Log crisis situation
    console.warn('🚨 CRISIS SITUATION DETECTED:', report.id);

    // Could trigger additional crisis protocols:
    // - Immediate notification to support team
    // - Display crisis resources
    // - Log to high-priority monitoring

    // For now, just ensure it's properly flagged
    if (this.config.enableConsoleLogging) {
      console.warn('Crisis detection activated for error:', report.id);
    }
  }

  /**
   * Get error statistics for monitoring
   */
  public getErrorStats(): {
    totalReports: number;
    uniqueErrors: number;
    reportingEnabled: boolean;
  } {
    return {
      totalReports: this.reportCount,
      uniqueErrors: this.reportedErrors.size,
      reportingEnabled: this.config.enableReporting
    };
  }

  /**
   * Clear error history (for new session)
   */
  public clearErrorHistory(): void {
    this.reportCount = 0;
    this.reportedErrors.clear();
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create and export singleton instance
export const errorReportingService = new ErrorReportingService();