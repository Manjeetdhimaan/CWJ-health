import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
    isDeleted: boolean;
    resettoken?: string;
    verifyPassword(password: string): boolean;
    generateJwt(remeberFlag: boolean): string;
}

interface IUserModel extends Model<IUser> {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string): Promise<string>;
}

const userSchema = new Schema<IUser>({
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

const JWT_SECRET = process.env.JWT_SECRET as string;

userSchema.statics.hashPassword = function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.verifyPassword = function (password: string) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJwt = function (remeberMe = false) {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, JWT_SECRET, {
        expiresIn: remeberMe ? '365d' : process.env.JWT_EXP
    });
}

const User = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;