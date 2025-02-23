import express from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
} from "../controller/orderController.js";

const orderRoute = express.Router();

// "/root/orders"

orderRoute.route("/create").post(createOrder);
orderRoute.route("/get").get(getOrders);
orderRoute.route("/update/:orderId/:status").put(updateOrder);

export { orderRoute };
