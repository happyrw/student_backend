import express from "express";
import {
  completeOnboarding,
  getUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controller/userController.js";
import { upload } from "../config/cloudinary.js";

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("imageFile"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/onboarding").post(completeOnboarding);

userRouter.route("/update_user").put(updateUser);
userRouter.route("/get_session_user").get(getUser);

export { userRouter };
