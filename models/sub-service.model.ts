import mongoose, { Schema } from "mongoose";

const subServiceSchema = new mongoose.Schema({
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


const SubService = mongoose.model('SubService', subServiceSchema);

export default SubService;