import { uploadToCloudinary } from "../config/cloudinary.js";
import { Car } from "../mongodb/model/carModel.js";
import { User } from "../mongodb/model/userModel.js";

const createCar = async (req, res) => {
  try {
    const {
      brand,
      transmission,
      fuelType,
      model,
      year,
      pricePerDay,
      description,
      availableUntil,
      userId,
      role,
    } = req.body;
    if (
      !brand ||
      !transmission ||
      !fuelType ||
      !model ||
      !year ||
      !pricePerDay
    ) {
      return res.status(404).json({ message: "Some fields not found" });
    }

    if (!userId || role !== "carOwner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let images = [];
    const imageFiles = req.files;

    if (imageFiles.length > 0) {
      images = await Promise.all(
        imageFiles.map(async (imageFile) => {
          return await uploadToCloudinary(imageFile.buffer);
        })
      );
    }

    const newCar = new Car({
      ownerId: userId,
      brand,
      transmission,
      fuelType,
      model,
      year,
      pricePerDay,
      description,
      availableUntil,
      images,
    });

    const car = await newCar.save();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { car: car._id } },
      { new: true }
    );
    res.status(201).json({ car, updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchCar = async (req, res) => {
  try {
    const cars = await Car.find();

    res.status(201).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { createCar, fetchCar };
