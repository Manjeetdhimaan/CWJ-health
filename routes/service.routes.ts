import express from "express";
const router = express.Router();

import { createService, createSubService, getServices, getService, getSubService, updateService, updateSubService } from '../controllers/service.controller'
// Services

router.post('/create-service', createService);
router.put('/update-service', updateService);
router.get('/get-services', getServices);
router.get('/get-service', getService);

// Sub services
router.post('/create-sub-service', createSubService);
router.put('/update-sub-service', updateSubService);
router.get('/get-sub-service', getSubService);

export default router;