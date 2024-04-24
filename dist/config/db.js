"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import '../models/service.model';
// import '../models/sub-service.model';
mongoose_1.default.set('strictQuery', true);
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MongoDB URI is not provided in the environment variables.");
}
mongoose_1.default.connect(MONGO_URI).then(() => {
    console.log('MongoDB connection succeeded.');
}).catch((err) => {
    console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
});
