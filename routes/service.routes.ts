import express, { Request, Response, NextFunction, RequestHandler } from "express";
const router = express.Router();

import ServiceController from '../controllers/service.controller';
import JwtHelper from "../middlewares/jwt-helper";
const verifyToken = new JwtHelper().verifyJwtToken as any;
const verifyAdmin = new JwtHelper().isAdmin as any;
// Services
const serviceCtrl = new ServiceController();
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

export default router;