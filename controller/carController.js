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
      location,
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

    console.log(req.body);

    // Extract files from req.files
    const imageFiles = req.files["images"] || []; // Array of image files
    const insuranceFile = req.files["insuranceFile"]
      ? req.files["insuranceFile"][0]
      : null;
    const yellowCardFile = req.files["yellowCardFile"]
      ? req.files["yellowCardFile"][0]
      : null;

    let images = null;

    if (imageFiles.length > 0) {
      images = await Promise.all(
        imageFiles.map(async (imageFile) => {
          return await uploadToCloudinary(imageFile.buffer);
        })
      );
    }

    // Upload insuranceFile if available
    let insuranceFileUrl = insuranceFile
      ? await uploadToCloudinary(insuranceFile.buffer)
      : null;

    // Upload yellowCardFile if available
    let yellowCardFileUrl = yellowCardFile
      ? await uploadToCloudinary(yellowCardFile.buffer)
      : null;

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
      location,
      insuranceFileUrl,
      yellowCardFileUrl,
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

const updateCar = async (req, res) => {
  const { declineReason } = req.body;
  try {
    if (declineReason) {
      const car = await Car.findOneAndUpdate(
        { _id: req.params.carId },
        {
          declineReason: declineReason,
          isApproved: false,
        },
        { new: true }
      );
      res.status(200).json(car);
    } else {
      const car = await Car.findOneAndUpdate(
        { _id: req.params.carId },
        {
          isApproved: true,
        },
        { new: true }
      );
      res.status(200).json(car);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCarAvailabilityTime = async (req, res) => {
  const availableUntil = req.body;
  try {
    await Car.findOneAndUpdate({ _id: req.params.carId }, availableUntil, {
      new: true,
    });
    const car = await Car.findOneAndUpdate(
      { _id: req.params.carId },
      { isApproved: false },
      { new: true }
    );
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createCar, fetchCar, updateCar, updateCarAvailabilityTime };
