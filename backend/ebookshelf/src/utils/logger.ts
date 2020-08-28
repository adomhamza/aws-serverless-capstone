import * as winston from "winston";

/**
 * 
 * @param loggerName - a name of the logger
 */

export function createLogger(loggerName: string){
    return winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { name: loggerName },
        transports: [ new winston.transports.Console() ]
    })
}