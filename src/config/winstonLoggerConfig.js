
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;
import { getCurrentDateTime } from "../helpers/date";
import { config } from "../config/envConfig";
import DailyRotateFile from "winston-daily-rotate-file";

const myFormat = printf(({ level, message, timestamp }) => {
    return `${getCurrentDateTime()} [${level}] : ${message}`;
});

let logger;

if (config.NODE_ENV === 'production') {
    const dailyRotateFileTransport = new DailyRotateFile({
        filename: './logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
    });

    logger = createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            myFormat,
        ),
        transports: [
            dailyRotateFileTransport
        ],
        exceptionHandlers: [
            dailyRotateFileTransport
        ]
    });
} else {
    logger = createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            format.colorize(),
            myFormat,
        ),
        transports: [
            new transports.Console({
                format: combine(
                    timestamp(),
                    format.colorize(),
                    myFormat,
                ),
                level: 'info'
            }),
        ],
        exceptionHandlers: [
            new transports.Console({
                format: combine(
                    timestamp(),
                    format.colorize(),
                    myFormat,
                )
            })
        ]
    });
}


export default logger;