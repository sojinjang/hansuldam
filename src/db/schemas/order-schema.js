import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
    status: {
      type: String,
      enum: ["상품준비중", "상품배송중", "배송완료"],
      default: "상품준비중",
      required: true,
    },
    shipping: {
      type: String,
      required: false,
    },
    payment: {
      type: new Schema(
        {
          way: String,
          detail: String,
          number: String,
        },
        {
          _id: false,
        }
      ),
      required: false,
    },
    priceSum: {
      type: Number,
      required: true,
    },
    productsInOrder: {
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
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
