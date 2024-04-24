"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bodyParser = require("body-parser");
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const error_handler_1 = require("./middlewares/error-handler");
const api = process.env.API_URL || '/api/v1';
dotenv_1.default.config();
require("./config/db");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use(`${api}/services`, service_routes_1.default);
app.use(error_handler_1.errorHandler);
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
