import * as Transport from 'winston-transport';
import * as FluentLogger from 'fluent-logger';

export class FluentTransport extends Transport {
  private fluent: typeof FluentLogger;

  constructor(opts: any) {
    super(opts);
    this.fluent = FluentLogger;
    this.fluent.configure(opts.tag, {
      host: opts.host,
      port: opts.port,
      timeout: opts.timeout,
      reconnectInterval: opts.reconnectInterval,
    });
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    this.fluent.emit('log', {
      level: info.level,
      message: info.message,
      timestamp: new Date().toISOString(),
    });
    callback();
  }
}
