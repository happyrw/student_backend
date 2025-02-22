import { upload } from "../config/cloudinary.js";
import { createCar, fetchCar } from "../controller/carController.js";
import express from "express";

const carRoutes = express.Router();

carRoutes.route("/create").post(upload.array("images"), createCar);
carRoutes.route("/get").get(fetchCar);

export { carRoutes };
