import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser = require("body-parser");
import serviceRoutes from './routes/service.routes'
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs'

import { errorHandler } from './middlewares/error-handler';
const api = process.env.API_URL || '/api/v1';
dotenv.config();
import './config/db';


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use(`${api}/services`, serviceRoutes);

app.use(errorHandler);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});