import mongoose from "mongoose";
import slugify from 'slugify';

const serviceSchema = new mongoose.Schema({
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
        // required: [true, 'Please provide certificate number']
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

const Service = mongoose.model('Service', serviceSchema);

export default Service;