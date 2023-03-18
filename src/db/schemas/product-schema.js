import { Schema } from "mongoose";
const ProductSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: false,
    },
    sales: {
      type: Number,
      required: false,
      default: 0,
    },
    alcoholType: {
      type: String,
      required: false,
    },
    alcoholDegree: {
      type: Number,
      required: false,
    },
    manufacturedDate: {
      type: Date,
      required: false,
    },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

export { ProductSchema };
