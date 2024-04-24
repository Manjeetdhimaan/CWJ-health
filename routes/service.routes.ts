import express from "express";
const router = express.Router();

import { createService, createSubService, getServices, getService, getSubService } from '../controllers/service.controller'
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
router.post('/create-service', createService);
router.get('/get-services', getServices);
router.get('/get-service', getService);

// Sub services
router.post('/create-sub-service', createSubService);
router.get('/get-sub-service', getSubService);

export default router;