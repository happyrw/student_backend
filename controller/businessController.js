import { model } from "mongoose";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { Business } from "../mongodb/model/businessModel.js";
import { User } from "../mongodb/model/userModel.js";

const createBusiness = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, location, contact, tin, userId, role } =
      req.body;
    if (!userId || !name || !description || !location) {
      return res.status(404).json({ message: "Some fields not found" });
    }

    let licenseFile = null;
    if (req.file) {
      licenseFile = await uploadToCloudinary(req.file.buffer);
    }

    const existingBusiness = await Business.findOne({ name });
    if (existingBusiness) res.status(200).json({ message: "Business exists" });

    const newBusiness = new Business({
      ownerId: userId,
      name,
      tin,
      description,
      location,
      contact,
      licenseFile,
    });

    const business = await newBusiness.save();

    await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { businessId: business._id }, role },
      { new: true }
    );
    res.status(200).json({ business });
  } catch (error) {
    console.error("Getting user error business :", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getBusiness = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const business = await Business.findOne({ ownerId })
      .populate("rentals")
      .populate({
        path: "orders",
        populate: {
          path: "carId",
          model: "Car",
        },
      });
    res.status(200).json({ business });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const allBusiness = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json({ businesses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateBusiness = async (req, res) => {
  const { businessId } = req.params;
  try {
    const businesses = await Business.findOneAndUpdate(
      { _id: businessId },
      { isApproved: true },
      { new: true }
    );
    res.status(200).json(businesses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { createBusiness, getBusiness, allBusiness, updateBusiness };
