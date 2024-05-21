import mongoose, { Document } from "mongoose";
import slugify from 'slugify';
import { ISubService } from "./sub-service.model";

export interface IService extends Document {
    serviceTitle: string;
    serviceSlug: string;
    serviceDescription: string;
    serviceIcon: string;
    isDeleted: boolean;
    createdAt: Date;
}

export interface IPopulatedService extends IService {
    subServices: ISubService[];
}


const serviceSchema = new mongoose.Schema<IService>({
    serviceTitle: {
        type: String,
        trim: true,
        required: [true, 'Please provide service name'],
        unique: true,
    },
    serviceSlug: {
        type: String,
        trim: true,
        required: [true, 'Please provide slug'],
        unique: true
    },
    serviceDescription: {
        type: String,
        trim: true,
        required: [true, 'Please provide service description']
    },
    serviceIcon: {
        type: String,
        trim: true,
        // required: [true, 'Please provide service icon']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
    toObject: { virtuals: true }
});

serviceSchema.virtual('slug').get(function (this: { serviceTitle: string }) {
    return slugify(this.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g });
});

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;