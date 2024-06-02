import winston from "winston"
import { config } from "../config/config.js"


const logger = winston.createLogger({
    levels: { fatal: 0, error: 1, warning: 2, info: 3, http: 4, debug: 5 },
    transports: []
})

const loggerFileError = new winston.transports.File(
    {
        level: "error",
        filename: "../src/logs/errors.log",
        format: winston.format.json()
    }
)


const loggerDev = new winston.transports.Console(
    {
        level: "debug",
        format: winston.format.combine(
            winston.format.colorize({
                colors: { fatal: "magenta", error: "red", warning: "yellow", info: "green", http: "blue", debug: "white" }
            }),
            winston.format.simple()
        )
    }
)

const loggerProduction = new winston.transports.Console(
    {
        level: "info",
        format: winston.format.combine(
            winston.format.colorize({
                colors: { fatal: "magenta", error: "red", warning: "yellow", info: "green", http: "blue", debug: "white" }
            }),
            winston.format.simple()
        )
    }
)

if (config.MODE == "development") {

    logger.add(loggerDev)
}
if (config.MODE == "production") {

    logger.add(loggerFileError)
    logger.add(loggerProduction)
}

export const loggerMid = (req, res, next) => {

    req.logger = logger

    next()
}