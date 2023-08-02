import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.db_uri;
    await mongoose.connect(uri, { 
        useNewUrlParser: true 
    });
}

export default connectDB;
