import { Schema } from 'mongoose';
const ProductSchema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
        },
        brand: {
            type: String,
            required: true,
        },
        productName: {
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
            required: true,
        },
        // 이하 나중에 구현할?
        quantity: { 
            type: Number,
            required: true,
        },
        img: {
            type: String,
            required: true,
        },
        sold: {
            type: Number,
            required: true,
            default: 0,
        },
        alcoholType: {
            type: String,
            required: true,
        },
        alcoholDegree: {
            type: Number,
            required: true,
        },
        manufacturedDate: {
            type: Date,
            required: false,
        },
    },
    {
        collection: 'products',
        timestamps: true,
    },
);

export { ProductSchema };
