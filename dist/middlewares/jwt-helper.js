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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import util from "util";
const util = require('util');
const user_model_1 = __importDefault(require("../models/user.model"));
const response_1 = require("../utils/response");
const verifyJwtAsync = util.promisify(jsonwebtoken_1.default.verify);
class JwtHelper {
    verifyJwtToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            if (req && req.headers && 'authorization' in req.headers && req.headers['authorization'])
                token = req.headers['authorization'].split(' ')[1];
            if (!token)
                return res.status(403).send((0, response_1.failAction)('No token provided.', 403));
            else {
                try {
                    const decoded = yield verifyJwtAsync(token, process.env.JWT_SECRET);
                    req._id = decoded._id;
                    req._email = decoded._email;
                    next();
                }
                catch (err) {
                    return res.status(500).send((0, response_1.failAction)('Token authentication failed.', 500));
                }
            }
        });
    }
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({ _id: req._id }).lean();
                if (!user) {
                    return res.status(404).send((0, response_1.failAction)('Not Authorized!', 404));
                }
                else if (!user.isAdmin) {
                    return res.status(401).send((0, response_1.failAction)('Not Authorized!', 401));
                }
                else {
                    next();
                }
            }
            catch (err) {
                return res.status(500).send((0, response_1.failAction)(err.message || 'Internal Server Error', 500));
            }
        });
    }
    ;
}
exports.default = JwtHelper;
// export { verifyJwtToken, isAdmin };
