import mongoose from "mongoose";

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern");
  console.log("Connected to db");
};

export default connectToDb;