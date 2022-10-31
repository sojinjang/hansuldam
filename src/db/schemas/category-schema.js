import { Schema } from 'mongoose';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'category',
        timestamps: true,
    },
);

export { CategorySchema };
