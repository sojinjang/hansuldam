import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("orders", OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async findAll() {
    const orders = await Order.find();
    return orders;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };
    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }

  async delete({ orderId }) {
    const filter = { _id: orderId };
    const deletedorders = await Order.deleteOne(filter);
    return deletedorders;
  }

  async findById(orderId) {
    const order = await Order.findOne({ _id: orderId });
    return order;
  }

  async findByUserId(userId) {
    const order = await Order.findOne({ _id: userId });
    return order;
  }
}

const orderModel = new OrderModel();

export { orderModel };
