import { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        }
      ),
      required: false,
    },
    status: {
      type: String,
      enum: ["상품준비중", "상품배송중", "배송완료"],
      default: "상품준비중",
      required: false,
    },
    shipping: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    paymentDetail: {
      type: String,
      required: false,
    },
    priceSum: {
      type: Number,
      required: true,
    },
    productList: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: false,
        },
      },
    ],
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

export { OrderSchema };
