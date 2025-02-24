import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Car Owner
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    }, // Business that rents the car
    brand: { type: String, required: true },
    transmission: { type: String, required: true },
    fuelType: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    images: [{ type: String, required: true }],
    description: { type: String },
    availableUntil: { type: Date, required: true }, // Car is available until a certain date
    isApproved: { type: Boolean, default: false }, // Admin Approval
    isRentedByBusiness: { type: Boolean, default: false }, // True when a business rents it
    location: { type: String, required: true },
    insuranceFileUrl: { type: String, required: true },
    yellowCardFileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export { Car };
