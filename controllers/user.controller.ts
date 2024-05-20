import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export default class UserController {
    async userExists(email: string) {
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            isDeleted: false
        });
        return !!user;
    }

    // sign up as user
    createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            if (await this.userExists(req.body.email)) {
                return res.status(409).json({
                    success: false,
                    message: 'Account with this email address exists already! Please try with different one.'
                });
            }
            const user = new User({
                name: req.body.name,
                // @ts-ignore
                passwordHash: User.hashPassword(req.body.password),
                email: req.body.email,
                isDeleted: false
            });
            const savedUser = await user.save();
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

        } catch (err) {
            return next(err);
        }
    }

    // login as user
    authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const user: any = await User.findOne({
                email: req.body.email,
                isDeleted: false
            });
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'No account found with this email address!'
                });
            } else if (!user.verifyPassword(req.body.password)) {
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
        } catch (err) {
            return next(err);
        }
    };

}

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