import { Injectable, LoggerService } from '@nestjs/common';

// Логгер в формате TSKV (Tab-Separated Key-Value)

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const time = new Date().toISOString();
    const context = optionalParams.join(' ') || '';
    // Формат TSKV: ключ=значение, разделённые \t
    return `time=${time}\tlevel=${level}\tmessage=${String(
      message,
    )}\tcontext=${context}`;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }
}
