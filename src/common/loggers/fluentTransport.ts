import * as Transport from 'winston-transport';
import * as fluentLogger from 'fluent-logger';

export class FluentTransport extends Transport {
  private fluent: typeof fluentLogger;

  constructor(opts: any) {
    super(opts);
    this.fluent = fluentLogger;
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
