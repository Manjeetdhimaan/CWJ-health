"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const service_controller_1 = require("../controllers/service.controller");
// Services
router.post('/create-service', service_controller_1.createService);
router.put('/update-service', service_controller_1.updateService);
router.get('/get-services', service_controller_1.getServices);
router.get('/get-service', service_controller_1.getService);
// Sub services
router.post('/create-sub-service', service_controller_1.createSubService);
router.put('/update-sub-service', service_controller_1.updateSubService);
router.get('/get-sub-service', service_controller_1.getSubService);
exports.default = router;
