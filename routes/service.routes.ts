import express, { Request, Response, NextFunction, RequestHandler } from "express";
const router = express.Router();

import {
    createService,
    createSubService,
    getServices,
    getService,
    getSubService,
    updateService,
    updateSubService,
    deleteService,
    deleteSubService
} from '../controllers/service.controller';
import { verifyJwtToken, isAdmin } from "../middlewares/jwt-helper";
const verifyToken = verifyJwtToken as any;
const verifyAdmin = isAdmin as any;
// Services

router.post('/create-service', verifyToken, verifyAdmin, createService);
router.put('/update-service', verifyToken, verifyAdmin, updateService);
router.get('/get-services', getServices);
router.get('/get-service', getService);
router.delete('/delete-service', verifyToken, verifyAdmin, deleteService);

// Sub services
router.post('/create-sub-service', verifyToken, verifyAdmin, createSubService);
router.put('/update-sub-service', verifyToken, verifyAdmin, updateSubService);
router.get('/get-sub-service', getSubService);
router.delete('/delete-sub-service', verifyToken, verifyAdmin, deleteSubService);

export default router;