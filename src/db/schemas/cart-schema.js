import { Schema } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    productsInCart: {
      type: [
        new Schema(
          {
            id: { type: String, required: true },
            quantity: { type: Number, default: 1, required: true },
          },
          {
            _id: false,
          }
        ),
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
