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
        name: {
            type: String,
            required: true,
            index: true,
        },
        price: {
            type: Number,
            required: true,
        },
            // 이하 나중에 구현할?
        volume: {
            type: Number,
            required: false,
        },
        quantity: { 
            type: Number,
            required: false,
        },
        img: {
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
        collection: 'products',
        timestamps: true,
    },
);

export { ProductSchema };
