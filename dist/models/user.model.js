"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'User name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email is required']
    },
    passwordHash: {
        type: String,
        required: [true, 'User password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    resettoken: {
        type: String
    },
}, {
    timestamps: true
});
const JWT_SECRET = process.env.JWT_SECRET;
userSchema.statics.hashPassword = function hashPassword(password) {
    return bcryptjs_1.default.hashSync(password, 10);
};
userSchema.methods.verifyPassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.passwordHash);
};
userSchema.methods.generateJwt = function (remeberMe = false) {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, JWT_SECRET, {
        expiresIn: remeberMe ? '365d' : process.env.JWT_EXP
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
