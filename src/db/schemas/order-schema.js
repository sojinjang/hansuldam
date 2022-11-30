import { Schema } from "mongoose";
import { CartSchema } from "./cart-schema";

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: new Schema(
        {
          postalCode: { type: String, required: true },
          address1: { type: String, required: true },
          address2: { type: String, required: false },
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
    status: {
      type: String,
      enum: ["상품준비중", "상품배송중", "배송완료"],
      default: "상품준비중",
      required: true,
    },
    shipping: {
      type: String,
      required: false,
    },
    payment: {
      type: new Schema(
        {
          method: String,
          detail: String,
          number: String,
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    productsInOrder: {
      type: [CartSchema],
      required: false,
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
