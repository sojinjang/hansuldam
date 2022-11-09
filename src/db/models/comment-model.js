import { model } from "mongoose";
import { CommentSchema } from "../schemas/comment-schema";

const Comment = model("comments", CommentSchema);

export class CommentModel {
  async findById(commentId) {
    const comment = await Comment.findOne({ _id: commentId });
    return comment;
  }

  async findAllByProductId(productId) {
    const comments = await Comment.find({ productId });
    return comments;
  }

  async create(commentInfo) {
    const createdNewcomment = await Comment.create(commentInfo);
    return createdNewcomment;
  }

  async findAll() {
    const comments = await Comment.find({});
    return comments;
  }

  async update({ commentId, update }) {
    const filter = { _id: commentId };
    const option = { returnOriginal: false };

    const updatedcomment = await Comment.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedcomment;
  }

  async deleteById(commentId) {
    const result = await Comment.deleteOne({ _id: commentId });
    return result;
  }
}

const commentModel = new CommentModel();

export { commentModel };
