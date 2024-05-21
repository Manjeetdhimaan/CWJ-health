import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser';
import serviceRoutes from './routes/service.routes';
import userRoutes from './routes/user.routes'
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

import { errorHandler } from './middlewares/error-handler';
import './config/db';
const app: Express = express();
const port = process.env.PORT || 3000;
const api = process.env.API_URL || '/api/v1';

function main() {
    app.use((req: Request, res: Response, next: NextFunction): Response | void => {
        const allowedOrigins = [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:4173",
            "http://localhost:4173",
            "https://dev.cwjhealth.com",
            "https://rcm-pi.vercel.app"
        ];
        const origin = req.headers.origin as string;
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }

        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        res.header(
            "Access-Control-Allow-Headers",
            "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization"
        );
        res.header("Access-Control-Allow-Credentials", "true");
        return next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get("/", (_: Request, res: Response) => {
        res.send("Node server running successfully");
    });

    app.use(`${api}/services`, serviceRoutes);
    app.use(`${api}/users`, userRoutes);
    app.use(errorHandler);

    const swaggerDocument = YAML.load("./swagger.yaml");
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    app.listen(port, () => {
        console.log(`[server]: Node server is running at http://localhost:${port}`);
    });
}

main();