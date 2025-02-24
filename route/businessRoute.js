import express from "express";
import {
  allBusiness,
  createBusiness,
  getBusiness,
  updateBusiness,
} from "../controller/businessController.js";
import { upload } from "../config/cloudinary.js";

const businessRoutes = express.Router();

businessRoutes
  .route("/create")
  .post(upload.single("licenseFile"), createBusiness);
businessRoutes.route("/get/:ownerId").get(getBusiness);
businessRoutes.route("/get").get(allBusiness);
businessRoutes.route("/update/:businessId").put(updateBusiness);

export { businessRoutes };
