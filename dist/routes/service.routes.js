"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const service_controller_1 = require("../controllers/service.controller");
const jwt_helper_1 = require("../middlewares/jwt-helper");
const verifyToken = jwt_helper_1.verifyJwtToken;
const verifyAdmin = jwt_helper_1.isAdmin;
// Services
router.post('/create-service', verifyToken, verifyAdmin, service_controller_1.createService);
router.put('/update-service', verifyToken, verifyAdmin, service_controller_1.updateService);
router.get('/get-services', service_controller_1.getServices);
router.get('/get-service', service_controller_1.getService);
router.delete('/delete-service', verifyToken, verifyAdmin, service_controller_1.deleteService);
// Sub services
router.post('/create-sub-service', verifyToken, verifyAdmin, service_controller_1.createSubService);
router.put('/update-sub-service', verifyToken, verifyAdmin, service_controller_1.updateSubService);
router.get('/get-sub-service', service_controller_1.getSubService);
router.delete('/delete-sub-service', verifyToken, verifyAdmin, service_controller_1.deleteSubService);
exports.default = router;
