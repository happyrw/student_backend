import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  await mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Mongodb connected successfully"))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));
};

export { connectDB };
