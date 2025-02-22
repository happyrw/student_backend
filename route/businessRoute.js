import express from "express";
import {
  createBusiness,
  getBusiness,
} from "../controller/businessController.js";

const businessRoutes = express.Router();

businessRoutes.route("/create").post(createBusiness);
businessRoutes.route("/get/:ownerId").get(getBusiness);

export { businessRoutes };
