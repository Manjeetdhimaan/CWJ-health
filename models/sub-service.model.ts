import mongoose, { Document, Schema } from "mongoose";

interface ISubService extends Document {
    subServiceTitle: string;
    subServiceSlug: string;
    subServiceDescription: string;
    subServiceIcon: string;
    parentService: Schema.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date
}

const subServiceSchema = new Schema<ISubService>({
    subServiceTitle: {
        type: String,
        trim: true,
        required: [true, 'Please provide Sub service name'],
        unique: true
    },
    subServiceSlug: {
        type: String,
        trim: true,
        required: [true, 'Please provide slug'],
        unique: true
    },
    subServiceDescription: {
        type: String,
        trim: true,
        required: [true, 'Please provide service description']
    },
    subServiceIcon: {
        type: String,
        trim: true,
        // required: [true, 'Please provide certificate number']
    },
    parentService: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Please provide Parent service ID']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

const SubService = mongoose.model<ISubService>('SubService', subServiceSchema);
export default SubService;