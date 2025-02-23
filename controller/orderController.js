import { Business } from "../mongodb/model/businessModel.js";
import { Order } from "../mongodb/model/orderModel.js";

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

    const newOrder = new Order({
      carOwnerId,
      clientId,
      businessId,
      carId,
      startDate,
      endDate,
      totalPrice: totalAmount,
      contact: contactNumber,
    });

    const order = await newOrder.save();

    await Business.findOneAndUpdate(
      { _id: businessId },
      { $push: { orders: order._id } },
      { new: true }
    );

    console.log(order);
    res.status(200).json(order);
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
    const { orderId, status } = req.params;
    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { status },
      { new: true }
    );
    res.status(200).json(order);
  } catch {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { createOrder, getOrders, updateOrder };
