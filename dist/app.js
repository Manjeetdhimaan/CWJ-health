"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
dotenv_1.default.config();
require("./config/db");
const error_handler_1 = require("./middlewares/error-handler");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const api = process.env.API_URL || '/api/v1';
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (_, res) => {
    res.send("Express + TypeScript Server");
});
app.use(`${api}/services`, service_routes_1.default);
app.use(error_handler_1.errorHandler);
const swaggerDocument = yamljs_1.default.load("./swagger.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`[server]: Node server is running at http://localhost:${port}`);
});
