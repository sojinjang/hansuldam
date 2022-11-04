import { Schema } from "mongoose";
import { CartSchema } from "./cart-schema";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
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
    role: {
      type: String,
      required: false,
      default: "basic-user",
    },
    orders: {
      type: [String],
      required: false,
      default: [],
    },
    productsInCart: {
      type: [CartSchema],
      required: false,
      default: [],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export { UserSchema };
