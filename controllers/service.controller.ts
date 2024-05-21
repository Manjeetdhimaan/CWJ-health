import { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import mongoose from "mongoose";

import Service, { IPopulatedService, IService } from '../models/service.model';
import SubService from '../models/sub-service.model';
import { successAction, failAction } from "../utils/response";
import { LeanDocument } from "mongoose";

export default class ServiceController {
    // Services
    createService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const slug = slugify(req.body.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
            const service = new Service({
                serviceTitle: req.body.serviceTitle,
                serviceDescription: req.body.serviceDescription,
                serviceIcon: req.body.serviceIcon,
                serviceSlug: slug
            });
            const savedService = await service.save();
            if (!savedService) {
                return res.status(500).json(failAction('Server error, pls try again.', 500))
            };
            return res.status(201).json(successAction(savedService, 'Service created successfully', true));
        } catch (error) {
            return next(error);
        }
    }

    updateService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const filter = { _id: req.body._id };
            const serviceSlug = slugify(req.body.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
            const payload = req.body
            if (!payload.serviceTitle || !payload.serviceDescription || !payload.serviceIcon) {
                return res.status(422).json(failAction('All fields are required.', 422))
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
            const result = await Service.findOneAndUpdate(filter, updateDoc, { new: true });
            if (!result) {
                return res.status(500).json(failAction('No service found with this ID, pls try again.', 500))
            };
            return res.status(201).json(successAction(result, 'Service updated successfully', true));
        } catch (error) {
            return next(error);
        }
    }

    getServices = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const perPage = Number(req.query.perPage) || 10;
            const page = Number(req.query.page) || 1;
            const foundServices = await Service.find({ isDeleted: false }).limit(perPage)
                .skip(perPage * (page - 1)).lean();
            // this solution is with Promise.all (use if you prefer it and comment out the below code using await and for loop);
            // const populatedServices = await Promise.all(foundServices.map(async (service) => {
            //     const populatedService: IPopulatedService = service.toObject(); // Convert to plain JavaScript object
            //     populatedService.subServices = await SubService.find({ parentService: service._id, isDeleted: false });
            //     return populatedService;
            // }));
            for (const service of foundServices) {
                const populatedService = service as IPopulatedService;
                const subServices = await SubService.find({ parentService: populatedService._id, isDeleted: false });
                populatedService.subServices = subServices;
            }
            if (!foundServices || foundServices.length <= 0) {
                return res.status(200).json(failAction('No services created yet.', 200));
            };
            return res.status(200).json(successAction<{ services: LeanDocument<IService[]> }>({ services: foundServices }, 'Services fetched successfully', true));
        } catch (error) {
            return next(error);
        }
    }

    getService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const foundService = await Service.findOne({ isDeleted: false, serviceSlug: req.query.serviceSlug }).lean();
            if (foundService) {
                // find 1 service created before current service including current service // limit(2) to also include the current serice
                const servicesBefore = await Service.find({
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
                const servicesAfter = await Service.find({
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

                const subServices = await SubService.find({ parentService: foundService._id, isDeleted: false });
                (foundService as any).subServices = subServices;
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

        } catch (error) {
            return next(error);
        }
    }

    deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            // Find and delete the service within the transaction
            const serviceDeleteRes = await Service.findByIdAndDelete(req.query.id).session(session);
            const subServiceDeleteRes = await SubService.deleteMany({ parentService: req.query.id }, { session });
            // Commit the transaction if successful
            if (serviceDeleteRes && subServiceDeleteRes && subServiceDeleteRes.deletedCount >= 0 && subServiceDeleteRes.acknowledged) {
                await session.commitTransaction();
                session.endSession();
                return res.status(201).json({
                    success: true,
                    message: 'Service and its sub services deleted successfully'
                });
            };
            // If an error occurs, abort the transaction and handle the error
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Please check service ID you are trying to delete."
            });
        } catch (error) {
            // If an error occurs, abort the transaction and handle the error
            await session.abortTransaction();
            session.endSession();
            return next(error);
        }
    }

    // Sub services
    createSubService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const foundService = await Service.findOne({ _id: req.body.parentService, isDeleted: false });
            if (!foundService) {
                return res.status(404).json({
                    success: false,
                    message: 'No parent service found with this ID'
                });
            }
            const slug = slugify(req.body.subServiceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
            const service = new SubService({
                subServiceTitle: req.body.subServiceTitle,
                subServiceDescription: req.body.subServiceDescription,
                subServiceIcon: req.body.subServiceIcon,
                subServiceSlug: slug,
                parentService: req.body.parentService
            });
            const savedService = await service.save();
            if (!savedService) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error, pls try again'
                })
            };
            return res.status(201).json({
                success: true,
                service: savedService,
                message: 'Service created successfully'
            });
        } catch (error) {
            return next(error);
        }
    }

    updateSubService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const filter = { _id: req.body._id };
            const payload = { ...req.body };
            const serviceSlug = slugify(payload.subServiceTitle, { lower: true, remove: /[*+~.()'"!:@]/g, trim: true });
            if (!payload.subServiceTitle || !payload.subServiceDescription || !payload.subServiceIcon || !payload.parentService) {
                return res.status(422).json({
                    success: false,
                    message: 'All fields are required.'
                });
            };
            const foundService = await Service.findOne({ _id: req.body.parentService, isDeleted: false });
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
            const result = await SubService.findOneAndUpdate(filter, updateDoc, { new: true });
            if (!result) {
                return res.status(500).json({
                    success: false,
                    message: 'No sub service found with this ID, pls try again.'
                });
            };
            return res.status(201).json({
                success: true,
                service: result,
                message: 'Sub-Service updated successfully'
            });
        } catch (error) {
            return next(error);
        }
    }

    getSubService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const foundService = await SubService.findOne({ isDeleted: false, subServiceSlug: req.query.subServiceSlug }).populate('parentService', 'serviceTitle serviceSlug serviceIcon').lean();
            if (foundService && foundService.parentService && (foundService.parentService as any).serviceSlug === req.query.parentServiceSlug) {
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

        } catch (error) {
            return next(error);
        }
    }

    deleteSubService = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const deleteSubServiceRes = await SubService.findByIdAndDelete(req.query.id);
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
        } catch (error) {
            return next(error);
        }
    }
}