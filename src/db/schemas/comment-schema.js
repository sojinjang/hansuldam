import { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "proucts",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    collection: "comments",
    timestamps: true,
  }
);

export { CommentSchema };
