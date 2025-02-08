import fs from 'fs';
import winston from 'winston';

const fsPromise = fs.promises; //fs has object name promised which allow read/write asynch

//function to log date in text file
// async function log(logData)
// {
//     try
//     {
//         logData =`\n ${new Date().toString() }- ${logData}`;
//         await  fsPromise.appendFile("log.txt", logData);
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
// }

const logger = winston.createLogger({
    level: 'info', //lowest level of permission
    format: winston.format.json(),
    defaultMeta: { service: 'request-logging'},
    transports:[
        new winston.transports.File({
            filename: 'logs.txt'
        })
    ]
})


const loggerMiddleware = async (req, res,next) =>{
    //1. Log request body
    if(! req.url.includes('signin')){
    const logData = `${req.url} - ${JSON.stringify(req.body)}`
   // console.log(req.body)
    //await log(logData);
    logger.info(logData)
    }
    next();
}

export default loggerMiddleware;