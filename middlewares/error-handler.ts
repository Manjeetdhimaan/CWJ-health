// global error handler

import { NextFunction, Request, Response } from "express";
interface ValidationError extends Error {
    name: 'ValidationError';
    errors: Record<string, { message: string }>;
}

// Define cast error type
interface CastError extends Error {
    name: 'CastError';
    kind: 'ObjectId';
}

// Define unauthorized error type
interface UnauthorizedError extends Error {
    name: 'UnauthorizedError';
    statusCode: number;
    error: {
        code: string;
        description: string;
    };
}

// Define MongoDB duplicate key error type
interface MongoError extends Error {
    code: number;
    keyValue: Record<string, any>;
}

// Combine all error types into a union type
type AppError = ValidationError | CastError | UnauthorizedError | MongoError | Error;

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction): Response => {
    console.log("Server error ==> ", err);

    if (err.name === 'ValidationError') {
        const valErrors: string[] = [];
        Object.keys((err as ValidationError).errors).forEach(key => valErrors.push((err as ValidationError).errors[key].message));
        return res.status(422).send(valErrors);
    }

    if ((err as UnauthorizedError).statusCode === 401 && (err as UnauthorizedError).error.code === 'BAD_REQUEST_ERROR') {
        return res.status(401).send({
            success: false,
            message: (err as UnauthorizedError).error.description,
        });
    }

    if (err.name === 'CastError' && (err as CastError).kind === 'ObjectId') {
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

    if ((err as MongoError).code === 11000) {
        return res.status(422).json({
            success: false,
            message: `This value already exists, please try with another one`,
            value: (err as MongoError).keyValue['serviceSlug'] ? {
                serviceTitle: req.body.serviceTitle
            } : (err as MongoError).keyValue
        });
    }

    return res.status(503).send({
        success: false,
        message: "Internal server error",
        error: err.name
    });
};

// export const errorHandler = ((err: AppError, req: Request, res: Response, next: NextFunction): Response => {
//     console.log("Server error ==> ", err);
//     if (err.name === 'ValidationError') {
//         const valErrors: string[] = [];
//         Object.keys((err as ValidationError).errors).forEach(key => valErrors.push((err as ValidationError).errors[key].message));
//         return res.status(422).send(valErrors);
//     }
//     if (err.statusCode === 401 && err.error.code === 'BAD_REQUEST_ERROR') {
//         return res.status(401).send({
//             success: false,
//             message: err.error.description,
//         });
//     }
//     if (err.name === 'CastError' && err.kind === 'ObjectId') {
//         return res.status(500).json({
//             success: false,
//             message: 'Invalid Id'
//         });
//     }
//     if (err.name === 'UnauthorizedError') {
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid Token'
//         });
//     }
//     if (err.code === 11000) {
//         return res.status(422).json({
//             success: false,
//             message: `This value already exists, Pls try with another one`,
//             value: err.keyValue['serviceSlug'] ? {
//                 serviceTitle: req.body.serviceTitle
//             } : err.keyValue
//         });
//     }
//     return res.status(503).send({
//         success: false,
//         message: "Internal server error",
//         error: err.name
//     });
// });