import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../mongodb/model/userModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    let imageUrl = null;
    const imageFile = req.file;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile.buffer);
    }

    // Create new user
    const registeredUser = new User({
      fullname,
      email,
      password,
      imageUrl,
      role: null,
    });

    const newUser = await registeredUser.save();
    // Generate token
    const token = generateToken(newUser);

    res
      .status(201)
      .json({ message: "User registered successfully", token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ONBOARDING
const completeOnboarding = async (req, res) => {
  try {
    const { userId, role, businessId } = req.body; // businessId is only for business users

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    if (!["carOwner", "business"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assign role
    user.role = role;

    if (role === "business") {
      if (!businessId) {
        return res
          .status(400)
          .json({ message: "Business ID is required for businesses" });
      }
      user.businessId = businessId;
    }

    await user.save();

    res
      .status(200)
      .json({ message: "Onboarding completed successfully", user });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user
const getUser = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim(); // ✅ Properly extracts token

    const decode = jwt.decode(token, process.env.JWT_SECRET);
    const userId = decode.id;
    const user = await User.findById(userId)
      .populate("car")
      .populate("businessId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Getting user error getUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { registerUser, loginUser, completeOnboarding, getUser, updateUser };
