import winston from 'winston';
// import TelegramLogger from 'winston-telegram';
import { PrismaWinstonTransporter } from "./winston-prisma-transport";

import prisma from './prisma';

const { combine, timestamp, json } = winston.format;


export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' , handleExceptions: true,}),
    // new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    // new winston.transports.Console({
    //   format: winston.format.simple(),
    // }),
    new PrismaWinstonTransporter({
      level: "silly",
      prisma,
      tableName: "Log",
      handleExceptions: true
    }),
    // new winston.transports.Http({
    //   path: "https://cloud.axiom.co/api/v1/datasets/winston/ingest",
    //   headers: {
    //     "Authorization": "Bearer " + "",
    //     "Content-Type": "application/x-ndjson",
    //   }
    // })
    // new TelegramLogger({
    //   token: process.env.TELEGRAM_BOT_TOKEN,
    //   chatId: Number(process.env.TELEGRAM_LOG_CHAT_ID),
    //   level: "silly",
    //   handleExceptions: true,
    //   formatMessage: (m: any) => JSON.stringify(m).slice(0,280) + "..."
    // }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({
    format: winston.format.simple(),
    filename: "logs/combined"
  }))
}