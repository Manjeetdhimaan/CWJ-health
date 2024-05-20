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
const user_model_1 = __importDefault(require("../models/user.model"));
class UserController {
    constructor() {
        // sign up as user
        this.createAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield this.userExists(req.body.email)) {
                    return res.status(409).json({
                        success: false,
                        message: 'Account with this email address exists already! Please try with different one.'
                    });
                }
                const user = new user_model_1.default({
                    name: req.body.name,
                    // @ts-ignore
                    passwordHash: user_model_1.default.hashPassword(req.body.password),
                    email: req.body.email,
                    isDeleted: false
                });
                const savedUser = yield user.save();
                if (!savedUser) {
                    return res.status(500).send({
                        success: false,
                        message: 'An error occured! Please try again.'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Account created succussfully!'
                });
            }
            catch (err) {
                return next(err);
            }
        });
        // login as user
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.default.findOne({
                    email: req.body.email,
                    isDeleted: false
                });
                if (!user) {
                    return res.status(404).send({
                        success: false,
                        message: 'No account found with this email address!'
                    });
                }
                else if (!user.verifyPassword(req.body.password)) {
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect password'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'User authenticated succussfully!',
                    _id: user['_id'],
                    name: user['name'],
                    token: user.generateJwt(req.body.remeberMe)
                });
            }
            catch (err) {
                return next(err);
            }
        });
    }
    userExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({
                email: email.toLowerCase().trim(),
                isDeleted: false
            });
            return !!user;
        });
    }
}
exports.default = UserController;
// const userExists = async (email: string) => {
//     const user = await User.findOne({
//         email: email.toLowerCase().trim(),
//         isDeleted: false
//     });
//     return !!user;
// }
// // sign up as user
// const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
//     try {
//         if (await userExists(req.body.email)) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Account with this email address exists already! Please try with different one.'
//             });
//         }
//         const user = new User({
//             name: req.body.name,
//             // @ts-ignore
//             passwordHash: User.hashPassword(req.body.password),
//             email: req.body.email,
//             isDeleted: false
//         });
//         const savedUser = await user.save();
//         if (!savedUser) {
//             return res.status(500).send({
//                 success: false,
//                 message: 'An error occured! Please try again.'
//             });
//         }
//         return res.status(200).send({
//             success: true,
//             message: 'Account created succussfully!'
//         });
//     } catch (err) {
//         return next(err);
//     }
// }
// // login as user
// const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
//     try {
//         const user: any = await User.findOne({
//             email: req.body.email,
//             isDeleted: false
//         });
//         if (!user) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'No account found with this email address!'
//             });
//         } else if (!user.verifyPassword(req.body.password)) {
//             return res.status(401).send({
//                 success: false,
//                 message: 'Incorrect password'
//             });
//         }
//         return res.status(200).send({
//             success: true,
//             message: 'User authenticated succussfully!',
//             _id: user['_id'],
//             name: user['name'],
//             token: user.generateJwt(req.body.remeberMe)
//         });
//     } catch (err) {
//         return next(err);
//     }
// };
// export { createAccount, authenticate };
