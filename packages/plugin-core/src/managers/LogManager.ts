/* eslint-disable @typescript-eslint/member-ordering */
import { Manager } from '@gecs/lib';

export enum MessageType {
  INFO = 0,
  ERROR = 1,
  WARNING = 2,
  MESSAGE = 3,
  BANNER = 4
}

export interface LogMessage {
  type: MessageType;
  time: number;
  title?: string;
  text?: string;
}

export class LogManager extends Manager {
  protected messages: Set<LogMessage> = new Set();

  protected handle = (type: MessageType, text: string, title: string = ''): void => {
    const message = { type, text, title, time: Date.now() };
    this.messages.add(message);
    this.update();
    setTimeout(() => {
      this.messages.delete(message);
      this.update();
    }, 2.5 * 1000);
  };

  public clear(): void {
    this.messages = new Set();
  }

  public all(): LogMessage[] {
    return Array.from(this.messages);
  }

  public *[Symbol.iterator](): Iterator<LogMessage> {
    yield* this.messages;
  }

  public info(text: string): void {
    return this.handle(MessageType.INFO, text);
  }

  public error(text: string): void {
    return this.handle(MessageType.ERROR, text);
  }

  public warn(text: string): void {
    return this.handle(MessageType.WARNING, text);
  }

  public message(text: string): void {
    return this.handle(MessageType.MESSAGE, text);
  }

  public banner(title: string, text: string): void {
    return this.handle(MessageType.BANNER, text, title);
  }

  protected update(): void {
    const current = this.ctx.$.state.current;
    if (current) {
      this.ctx.$.events.emit('state.update', current);
    }
  }
}
