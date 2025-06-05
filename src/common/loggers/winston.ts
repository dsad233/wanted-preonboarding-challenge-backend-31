import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { FluentTransport } from './fluentTransport';

// 참고: https://sjh9708.tistory.com/52

const appendTimestamp = winston.format((info, opts) => {
  if (opts) {
    info.timestamp = new Date();
  }
  return info;
});

// 로그 저장 파일 옵션
const dailyOptions = {
  level: 'http', //http보다 높은 단계의 로그만 기록
  datePattern: 'YYYY-MM-DD', //날짜 포멧 지정
  dirname: __dirname + '/logs', //저장할 URL
  filename: `app.log.%DATE%`,
  maxFiles: 30, //30일의 로그 저장
  zippedArchive: true, // 로그가 쌓였을 때 압축
  colorize: false,
  handleExceptions: true,
  json: false,
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // 콘솔 출력 옵션 지정
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'http' : 'silly',
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.simple() //production 환경에서는 로그를 최소화
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('NestJS Project', {
                prettyPrint: true, // 로그를 예쁘게 출력해줌
              }),
            ),
    }),

    // 파일 로깅 옵션 지정
    new winstonDaily(dailyOptions),
    new FluentTransport({
      host: process.env.FLUENTD_HOST,
      port: Number(process.env.FLUENTD_PORT),
      tag: process.env.FLUENTD_TAG,
      timeout: Number(process.env.FLUENTD_TIMEOUT),
      reconnectInterval: Number(process.env.FLUENTD_RECONNECTINTERVAL),
    }),
  ],
  // 포멧 지정
  format: winston.format.combine(
    appendTimestamp({ tz: process.env.TZ }),
    winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level} [${process.pid}]: ${info.message}`;
    }),
  ),
});
