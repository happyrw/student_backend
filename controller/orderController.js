import { Business } from "../mongodb/model/businessModel.js";
import { Car } from "../mongodb/model/carModel.js";
import { Order } from "../mongodb/model/orderModel.js";
import { User } from "../mongodb/model/userModel.js";

const createOrder = async (req, res) => {
  try {
    const {
      clientId,
      carId,
      businessId,
      startDate,
      endDate,
      contactNumber,
      totalAmount,
      carOwnerId,
    } = req.body;

    console.log(req.body);
    if (
      !carOwnerId ||
      !clientId ||
      !carId ||
      !businessId ||
      !startDate ||
      !endDate ||
      !contactNumber
    ) {
      return res
        .status(400)
        .json({ message: "Some fields not found for rental" });
    }

    console.log(typeof carOwnerId);

    const carOwner = await User.findById({
      _id: carOwnerId,
    });

    const newOrder = new Order({
      carOwnerId,
      clientId,
      businessId,
      carId,
      startDate,
      endDate,
      totalPrice: totalAmount,
      businessContact: contactNumber,
      ownerContact: carOwner.contact,
    });

    const order = await newOrder.save();

    await Business.findOneAndUpdate(
      { _id: businessId },
      { $push: { orders: order._id } },
      { new: true }
    );

    res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("businessId");
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId, status, carId } = req.params;

    if (status === "confirmed") {
      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { status },
        { new: true }
      );

      await Car.findByIdAndUpdate(
        { _id: carId },
        { isRentedByBusiness: true },
        { new: true }
      );
      res.status(200).json(order);
    } else {
      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { status },
        { new: true }
      );
      await Car.findByIdAndUpdate(
        { _id: carId },
        { isRentedByBusiness: false },
        { new: true }
      );
      res.status(200).json(order);
    }
  } catch {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { createOrder, getOrders, updateOrder };
