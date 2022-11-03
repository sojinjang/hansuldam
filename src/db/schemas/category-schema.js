import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    productList: {
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
