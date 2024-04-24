"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubService = exports.getService = exports.getServices = exports.createSubService = exports.createService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const service_model_1 = __importDefault(require("../models/service.model"));
const sub_service_model_1 = __importDefault(require("../models/sub-service.model"));
// Services
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = (0, slugify_1.default)(req.body.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
        const service = new service_model_1.default({
            serviceTitle: req.body.serviceTitle,
            serviceDescription: req.body.serviceDescription,
            serviceIcon: req.body.serviceIcon,
            serviceSlug: slug
        });
        const savedService = yield service.save();
        if (!savedService) {
            return res.status(500).json({
                success: false,
                message: 'Server error, pls try again.'
            });
        }
        ;
        return res.status(201).json({
            success: true,
            service: savedService,
            message: 'Service created successfully'
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createService = createService;
const getServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundServices = yield service_model_1.default.find({ isDeleted: false }).lean();
        // this solution is with Promise.all (use if you prefer it and comment out the below code using await and for loop);
        // const populatedServices = await Promise.all(foundServices.map(async (service) => {
        //     const populatedService: any = service.toObject(); // Convert to plain JavaScript object
        //     populatedService.subServices = await SubService.find({ parentService: service._id, isDeleted: false });
        //     return populatedService;
        // }));
        for (const service of foundServices) {
            const populatedService = service;
            const subServices = yield sub_service_model_1.default.find({ parentService: populatedService._id, isDeleted: false });
            populatedService.subServices = subServices;
        }
        if (!foundServices || foundServices.length <= 0) {
            return res.status(200).json({
                success: true,
                message: 'No services found',
                services: []
            });
        }
        ;
        return res.status(200).json({
            success: true,
            services: foundServices,
            message: 'Services fetched successfully'
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getServices = getServices;
const getService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundService = yield service_model_1.default.findOne({ isDeleted: false, serviceSlug: req.query.serviceSlug }).lean();
        if (foundService) {
            // find 1 service created before current service including current service
            const servicesBefore = yield service_model_1.default.find({
                $or: [
                    { createdAt: { $lt: foundService.createdAt } },
                    { _id: foundService._id }
                ]
            }).sort({ createdAt: -1 }).limit(2).select('serviceTitle serviceSlug -_id').lean();
            // find 1 service created after current service
            const servicesAfter = yield service_model_1.default.find({
                $or: [
                    { createdAt: { $gt: foundService.createdAt } },
                ]
            }).limit(1).select('serviceTitle serviceSlug -_id').lean();
            const relatedServices = [...servicesBefore.reverse(), ...servicesAfter];
            const subServices = yield sub_service_model_1.default.find({ parentService: foundService._id, isDeleted: false });
            // @ts-ignore
            foundService.subServices = subServices;
            return res.status(200).json({
                success: true,
                service: foundService,
                relatedServices: relatedServices,
                message: 'Service fetched successfully'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'No service found',
            services: []
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getService = getService;
// Sub services
const createSubService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = (0, slugify_1.default)(req.body.subServiceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
        const service = new sub_service_model_1.default({
            subServiceTitle: req.body.subServiceTitle,
            subServiceDescription: req.body.subServiceDescription,
            subServiceIcon: req.body.subServiceIcon,
            subServiceSlug: slug,
            parentService: req.body.parentService
        });
        const savedService = yield service.save();
        if (!savedService) {
            return res.status(500).json({
                success: false,
                message: 'Server error, pls try again'
            });
        }
        ;
        return res.status(201).json({
            success: true,
            service: savedService,
            message: 'Service created successfully'
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createSubService = createSubService;
const getSubService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundService = yield sub_service_model_1.default.findOne({ isDeleted: false, subServiceSlug: req.query.subServiceSlug }).populate('parentService', 'serviceTitle serviceSlug serviceIcon').lean();
        // @ts-ignore
        if (foundService && foundService.parentService && foundService.parentService.serviceSlug === req.query.parentServiceSlug) {
            return res.status(200).json({
                success: true,
                services: foundService,
                message: 'Service fetched successfully'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'No service found',
            services: []
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.getSubService = getSubService;
