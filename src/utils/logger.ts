import { LogEntry } from '../types';

type LogListener = (logs: LogEntry[]) => void;

class RoyaleLogger {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();
  private maxLogs = 200;

  constructor() {
    this.info('System', 'Hamper Queen Atelier logging system initialized.');
  }

  private addEntry(type: LogEntry['type'], category: string, message: string, details?: Record<string, unknown> | string) {
    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      category,
      message,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console output for developer inspection
    const stylePrefix = `[Hamper Queen :: ${category}]`;
    if (type === 'error') {
      console.error(`🔴 ${stylePrefix} ${message}`, details || '');
    } else if (type === 'warn') {
      console.warn(`🟡 ${stylePrefix} ${message}`, details || '');
    } else if (type === 'action') {
      console.log(`✨ ${stylePrefix} ${message}`, details || '');
    } else {
      console.log(`ℹ️ ${stylePrefix} ${message}`, details || '');
    }

    this.notifyListeners();
  }

  info(category: string, message: string, details?: Record<string, unknown> | string) {
    this.addEntry('info', category, message, details);
  }

  warn(category: string, message: string, details?: Record<string, unknown> | string) {
    this.addEntry('warn', category, message, details);
  }

  error(category: string, message: string, details?: Record<string, unknown> | string) {
    this.addEntry('error', category, message, details);
  }

  action(category: string, message: string, details?: Record<string, unknown> | string) {
    this.addEntry('action', category, message, details);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.info('System', 'Log history cleared.');
    this.notifyListeners();
  }

  subscribe(listener: LogListener) {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = [...this.logs];
    this.listeners.forEach((listener) => {
      try {
        listener(copy);
      } catch (err) {
        console.error('Error notifying log listener:', err);
      }
    });
  }
}

export const royaleLogger = new RoyaleLogger();
