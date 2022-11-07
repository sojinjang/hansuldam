import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: {
      type: [String],
      required: false,
    },
  },
  {
    collection: "categories",
    timestamps: true,
  }
);

export { CategorySchema };
