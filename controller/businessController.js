import { Business } from "../mongodb/model/businessModel.js";
import { User } from "../mongodb/model/userModel.js";

const createBusiness = async (req, res) => {
  try {
    const {
      businessData: { name, description, location, contact },
      userId,
      role,
    } = req.body;
    if (!userId || !name || !description || !location) {
      return res.status(404).json({ message: "Some fields not found" });
    }

    const existingBusiness = await Business.findOne({ name });
    if (existingBusiness) res.status(200).json({ message: "Business exists" });

    const newBusiness = new Business({
      ownerId: userId,
      name,
      description,
      location,
      contact,
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
    const business = await Business.findOne({ ownerId }).populate("rentals");
    res.status(200).json({ business });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
export { createBusiness, getBusiness };
