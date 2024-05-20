"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const service_controller_1 = __importDefault(require("../controllers/service.controller"));
const jwt_helper_1 = __importDefault(require("../middlewares/jwt-helper"));
const verifyToken = new jwt_helper_1.default().verifyJwtToken;
const verifyAdmin = new jwt_helper_1.default().isAdmin;
// Services
const serviceCtrl = new service_controller_1.default();
router.post('/create-service', verifyToken, verifyAdmin, serviceCtrl.createService);
router.put('/update-service', verifyToken, verifyAdmin, serviceCtrl.updateService);
router.get('/get-services', serviceCtrl.getServices);
router.get('/get-service', serviceCtrl.getService);
router.delete('/delete-service', verifyToken, verifyAdmin, serviceCtrl.deleteService);
// Sub services
router.post('/create-sub-service', verifyToken, verifyAdmin, serviceCtrl.createSubService);
router.put('/update-sub-service', verifyToken, verifyAdmin, serviceCtrl.updateSubService);
router.get('/get-sub-service', serviceCtrl.getSubService);
router.delete('/delete-sub-service', verifyToken, verifyAdmin, serviceCtrl.deleteSubService);
exports.default = router;
