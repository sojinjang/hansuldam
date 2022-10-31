import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export { ProductSchema };
