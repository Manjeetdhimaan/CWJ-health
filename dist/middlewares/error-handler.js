"use strict";
// global error handler
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// interface ValidationError extends Error {
//     name: 'ValidationError';
//     errors: Record<string, { message: string }>;
// }
// interface UnauthorizedError extends Error {
//     name: 'UnauthorizedError';
//     statusCode: number; // Add statusCode property
// }
// interface CastError extends Error {
//     name: 'CastError';
//     kind: 'ObjectId';
//     statusCode: number; // Add statusCode property
// }
// type CustomError = ValidationError | UnauthorizedError | CastError;
exports.errorHandler = ((err, req, res, next) => {
    console.log("Server error ==> ", err);
    if (err.name === 'ValidationError') {
        const valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        return res.status(422).send(valErrors);
    }
    if (err.statusCode === 401 && err.error.code === 'BAD_REQUEST_ERROR') {
        return res.status(401).send({
            success: false,
            message: err.error.description,
        });
    }
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(500).json({
            success: false,
            message: 'Invalid Id'
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
    }
    if (err.code === 11000) {
        return res.status(422).json({
            success: false,
            message: `This value already exists, Pls try with another one`,
            value: err.keyValue['serviceSlug'] ? {
                serviceTitle: req.body.serviceTitle
            } : err.keyValue
        });
    }
    return res.status(503).send({
        success: false,
        message: "Internal server error",
        error: err.name
    });
});
