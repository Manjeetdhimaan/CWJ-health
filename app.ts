import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import serviceRoutes from './routes/service.routes';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
import './config/db';
import { errorHandler } from './middlewares/error-handler';
const app: Express = express();
const port = process.env.PORT || 3000;
const api = process.env.API_URL || '/api/v1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (_: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use(`${api}/services`, serviceRoutes);
app.use(errorHandler);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`[server]: Node server is running at http://localhost:${port}`);
});