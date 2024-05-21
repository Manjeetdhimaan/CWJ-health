import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import util from "util";
const util = require('util');
import User from "../models/user.model";
import { failAction } from "../utils/response";
const verifyJwtAsync = util.promisify(jwt.verify);
interface IRequest extends Request {
    _id: string,
    _email: string
}
export default class JwtHelper {
    async verifyJwtToken(req: IRequest, res: Response, next: NextFunction) {
        let token;
        if (req && req.headers && 'authorization' in req.headers && req.headers['authorization'])
            token = req.headers['authorization'].split(' ')[1];
        if (!token)
            return res.status(403).send(failAction('No token provided.', 403));
        else {
            try {
                const decoded = await verifyJwtAsync(token, process.env.JWT_SECRET);
                req._id = decoded._id;
                req._email = decoded._email;
                next();
            } catch (err) {
                return res.status(500).send(failAction('Token authentication failed.', 500));
            }
        }
    }

    async isAdmin(req: IRequest, res: Response, next: NextFunction): Promise<void | Response> {
        try {
            const user = await User.findOne({ _id: req._id }).lean();
            if (!user) {
                return res.status(404).send(failAction('Not Authorized!', 404));
            } else if (!user.isAdmin) {
                return res.status(401).send(failAction('Not Authorized!', 401));
            } else {
                next();
            }
        } catch (err) {
            return res.status(500).send(failAction((err as Error).message || 'Internal Server Error', 500));
        }
    };
}



// export { verifyJwtToken, isAdmin };