import { Schema } from 'mongoose';

const OrderSchema = new Schema(
    {
        userId: { // 회원으로 검색했을 때
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
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
            required: true,
        },
        status: {
            type: String,
            enum: ["상품준비중", "상품배송중", "배송완료"],
            default: "상품준비중",
        },
        priceSum: {
            type: Number,
            required: true,
        },
        productList: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true,
                },
              },
        ],
    },
    {
      collection: "orders",
      timestamps: true,
    },
  );
  
  export { OrderSchema };