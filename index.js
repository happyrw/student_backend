import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./mongodb/db.js";
import { userRouter } from "./route/userRoute.js";
import { businessRoutes } from "./route/businessRoute.js";
import { carRoutes } from "./route/carRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple route
app.get("/", (req, res) => {
  res.send("Welcome to Car Rental API");
});

app.use("/auth/user", userRouter);
app.use("/root/business", businessRoutes);
app.use("/root/cars", carRoutes);

const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log(error);
  }
});
