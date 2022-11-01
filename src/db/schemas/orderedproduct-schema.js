import { Schema } from "mongoose";

const OrderedProductSchema = new Schema(
  {
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
  },
  {
    collection: "orderedproducts",
    timestamps: true,
  }
);

export { OrderedProductSchema };
