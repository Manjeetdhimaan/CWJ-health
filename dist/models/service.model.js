"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const serviceSchema = new mongoose_1.default.Schema({
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
serviceSchema.virtual('slug').get(function () {
    return (0, slugify_1.default)(this.serviceTitle, { lower: true, remove: /[*+~.()'"!:@]/g });
});
const Service = mongoose_1.default.model('Service', serviceSchema);
exports.default = Service;
