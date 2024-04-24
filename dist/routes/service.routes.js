"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const service_controller_1 = require("../controllers/service.controller");
// Services
/**
     * @openapi
     * '/api/v1/services/create-service':
     *  post:
     *     tags:
     *     - Service Controller
     *     summary: Create a service
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - serviceTitle
     *              - serviceDescription
     *              - serviceIcon
     *            properties:
     *              serviceTitle:
     *                type: string
     *                default: ""
     *              serviceDescription:
     *                type: string
     *                default: ""
     *              serviceIcon:
     *                type: string
     *                default: ""
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        desccription: Server Error
     */
router.post('/create-service', service_controller_1.createService);
router.get('/get-services', service_controller_1.getServices);
router.get('/get-service', service_controller_1.getService);
// Sub services
router.post('/create-sub-service', service_controller_1.createSubService);
router.get('/get-sub-service', service_controller_1.getSubService);
exports.default = router;
