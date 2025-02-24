import { upload } from "../config/cloudinary.js";
import { createCar, fetchCar } from "../controller/carController.js";
import express from "express";

const carRoutes = express.Router();

carRoutes.route("/create").post(
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "insuranceFile", maxCount: 1 },
    { name: "yellowCardFile", maxCount: 1 },
  ]),
  createCar
);
carRoutes.route("/get").get(fetchCar);

export { carRoutes };
