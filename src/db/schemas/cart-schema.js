import { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    productList: {
      type: [
        {
          id: String,
          quantity: Number,
        },
      ],
      required: false,
    },
  },
  {
    collection: "carts",
    timestamps: true,
  }
);

export { CartSchema };
