"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
require("./config/db");
const error_handler_1 = require("./middlewares/error-handler");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const api = process.env.API_URL || '/api/v1';
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:4173",
        "http://localhost:4173",
        "https://dev.cwjhealth.com",
        "https://rcm-pi.vercel.app"
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization");
    // @ts-ignore
    res.header("Access-Control-Allow-Credentials", true);
    return next();
});
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (_, res) => {
    res.send("Node server running successfully");
});
app.use(`${api}/services`, service_routes_1.default);
app.use(`${api}/users`, user_routes_1.default);
app.use(error_handler_1.errorHandler);
const swaggerDocument = yamljs_1.default.load("./swagger.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`[server]: Node server is running at http://localhost:${port}`);
});
