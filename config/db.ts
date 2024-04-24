import mongoose from 'mongoose';

// import '../models/service.model';
// import '../models/sub-service.model';

mongoose.set('strictQuery', true);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MongoDB URI is not provided in the environment variables.");
}
mongoose.connect(MONGO_URI).then(() => {
    console.log('MongoDB connection succeeded.');
}).catch((err: Error) => {
    console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
});