import { Schema } from 'mongoose';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
        ],

    },
    {
        collection: 'categories',
        timestamps: true,
    },
);

export { CategorySchema };
