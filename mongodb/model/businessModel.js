import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Business Owner
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    licenseFile: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    tin: { type: String, default: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    rentals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);
export { Business };
