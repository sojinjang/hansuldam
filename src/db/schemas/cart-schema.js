import { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    id: { type: String, required: true },
    quantity: { type: String, default: 1, required: true },
  },
  {
    _id: false,
  }
);

export { CartSchema };
