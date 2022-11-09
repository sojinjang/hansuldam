import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
