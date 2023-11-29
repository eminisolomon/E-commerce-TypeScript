import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/config';
import { CREDENTIALS, ORIGIN } from './config/config';
import Logging from './utils/Logging';
import { router as v1 } from './routes/Root';
import { HttpError } from './utils/HttpError';
import { crateRole } from '@controllers/roleController';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
const swaggerJsDocs = YAML.load('./swagger.yaml');

const router = express();

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info(`Running on ENV = ${process.env.NODE_ENV}`);
        Logging.info('Connected to mongoDB.');
        StartServer();
        crateRole();
    })
    .catch(error => {
        Logging.error('Unable to connect.');
        Logging.error(error);
    });

const StartServer = async () => {
    router.use((req, res, next) => {
        Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
            return res.status(200).json({});
        }
        next();
    });

    router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
    router.use('/api', v1);
    router.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));

    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    router.use('/', express.static(path.join(__dirname, './public')));

    router.get('/', (req: Request, res: Response) => {
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, './views/index.html'));
        }
    });

    router.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404);
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, './views/404.html'));
        }
    });

    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        Logging.error(err.stack);

        if (err instanceof HttpError) {
            const httpError = err as HttpError;
            return res.status(httpError.status).json({
                error: httpError.message,
            });
        } else {
            return res.status(500).json({
                error: 'An error occurred. Please retry again later',
            });
        }
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}.`));
};
