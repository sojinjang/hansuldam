import { Schema } from "mongoose";
const ProductSchema = new Schema(
  {
    category: {
      type: Schema.Types.String,
      ref: "categories",
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },

    volume: {
      type: Number,
      required: false,
    },
    stock: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    sold: {
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
