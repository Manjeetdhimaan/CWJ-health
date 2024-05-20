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
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = __importDefault(require("mongoose"));
const service_model_1 = __importDefault(require("../models/service.model"));
const sub_service_model_1 = __importDefault(require("../models/sub-service.model"));
const response_1 = require("../utils/response");
class ServiceController {
    constructor() {
        // Services
        this.createService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
                    return res.status(500).json((0, response_1.failAction)('Server error, pls try again.', 500));
                }
                ;
                return res.status(201).json((0, response_1.successAction)(savedService, 'Service created successfully', true));
            }
            catch (error) {
                return next(error);
            }
        });
        this.updateService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { _id: req.body._id };
                const serviceSlug = (0, slugify_1.default)(req.body.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
                const payload = req.body;
                if (!payload.serviceTitle || !payload.serviceDescription || !payload.serviceIcon) {
                    return res.status(422).json((0, response_1.failAction)('All fields are required.', 422));
                }
                const updateDoc = {
                    $set: {
                        serviceTitle: req.body.serviceTitle,
                        serviceDescription: req.body.serviceDescription,
                        serviceIcon: req.body.serviceIcon,
                        serviceSlug,
                        isDeleted: false
                    }
                };
                const result = yield service_model_1.default.findOneAndUpdate(filter, updateDoc, { new: true });
                if (!result) {
                    return res.status(500).json((0, response_1.failAction)('No service found with this ID, pls try again.', 500));
                }
                ;
                return res.status(201).json((0, response_1.successAction)(result, 'Service updated successfully', true));
            }
            catch (error) {
                return next(error);
            }
        });
        this.getServices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const perPage = Number(req.query.perPage) || 10;
                const page = Number(req.query.page) || 1;
                const foundServices = yield service_model_1.default.find({ isDeleted: false }).limit(perPage)
                    .skip(perPage * (page - 1)).lean();
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
                    return res.status(200).json((0, response_1.failAction)('No services created yet.', 200));
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
        this.getService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const foundService = yield service_model_1.default.findOne({ isDeleted: false, serviceSlug: req.query.serviceSlug }).lean();
                if (foundService) {
                    // find 1 service created before current service including current service // limit(2) to also include the current serice
                    const servicesBefore = yield service_model_1.default.find({
                        $and: [
                            { isDeleted: false },
                            {
                                $or: [
                                    { createdAt: { $lt: foundService.createdAt } },
                                    { _id: foundService._id }
                                ]
                            }
                        ]
                    }).sort({ createdAt: -1 }).limit(2).select('serviceTitle serviceSlug -_id').lean();
                    // find 1 service created after current service
                    const servicesAfter = yield service_model_1.default.find({
                        $and: [
                            { isDeleted: false },
                            {
                                $or: [
                                    { createdAt: { $gt: foundService.createdAt } },
                                ]
                            }
                        ]
                    }).limit(1).select('serviceTitle serviceSlug -_id').lean();
                    const relatedServices = [...servicesBefore.reverse(), ...servicesAfter];
                    const subServices = yield sub_service_model_1.default.find({ parentService: foundService._id, isDeleted: false });
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
        this.deleteService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            try {
                session.startTransaction();
                // Find and delete the service within the transaction
                const serviceDeleteRes = yield service_model_1.default.findByIdAndDelete(req.query.id).session(session);
                const subServiceDeleteRes = yield sub_service_model_1.default.deleteMany({ parentService: req.query.id }, { session });
                // Commit the transaction if successful
                if (serviceDeleteRes && subServiceDeleteRes && subServiceDeleteRes.deletedCount >= 0 && subServiceDeleteRes.acknowledged) {
                    yield session.commitTransaction();
                    session.endSession();
                    return res.status(201).json({
                        success: true,
                        message: 'Service and its sub services deleted successfully'
                    });
                }
                ;
                // If an error occurs, abort the transaction and handle the error
                yield session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    success: false,
                    message: "Please check service ID you are trying to delete."
                });
            }
            catch (error) {
                // If an error occurs, abort the transaction and handle the error
                yield session.abortTransaction();
                session.endSession();
                return next(error);
            }
        });
        // Sub services
        this.createSubService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const foundService = yield service_model_1.default.findOne({ _id: req.body.parentService, isDeleted: false });
                if (!foundService) {
                    return res.status(404).json({
                        success: false,
                        message: 'No parent service found with this ID'
                    });
                }
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
        this.updateSubService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { _id: req.body._id };
                const payload = Object.assign({}, req.body);
                const serviceSlug = (0, slugify_1.default)(payload.subServiceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
                if (!payload.subServiceTitle || !payload.subServiceDescription || !payload.subServiceIcon || !payload.parentService) {
                    return res.status(422).json({
                        success: false,
                        message: 'All fields are required.'
                    });
                }
                ;
                const foundService = yield service_model_1.default.findOne({ _id: req.body.parentService, isDeleted: false });
                if (!foundService) {
                    return res.status(404).json({
                        success: false,
                        message: 'No parent service found with this ID'
                    });
                }
                const updateDoc = {
                    $set: {
                        subServiceTitle: payload.subServiceTitle,
                        subServiceDescription: payload.subServiceDescription,
                        subServiceIcon: payload.subServiceIcon,
                        subServiceSlug: serviceSlug,
                        parentService: payload.parentService,
                        isDeleted: false
                    }
                };
                const result = yield sub_service_model_1.default.findOneAndUpdate(filter, updateDoc, { new: true });
                if (!result) {
                    return res.status(500).json({
                        success: false,
                        message: 'No sub service found with this ID, pls try again.'
                    });
                }
                ;
                return res.status(201).json({
                    success: true,
                    service: result,
                    message: 'Sub-Service updated successfully'
                });
            }
            catch (error) {
                return next(error);
            }
        });
        this.getSubService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const foundService = yield sub_service_model_1.default.findOne({ isDeleted: false, subServiceSlug: req.query.subServiceSlug }).populate('parentService', 'serviceTitle serviceSlug serviceIcon').lean();
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
        this.deleteSubService = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteSubServiceRes = yield sub_service_model_1.default.findByIdAndDelete(req.query.id);
                if (!deleteSubServiceRes) {
                    return res.status(201).json({
                        success: false,
                        message: 'No sub service found with this ID'
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: 'Sub service deleted successfully'
                });
            }
            catch (error) {
                return next(error);
            }
        });
    }
}
exports.default = ServiceController;
