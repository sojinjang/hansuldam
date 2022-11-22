import { model } from "mongoose";
import { CommentSchema } from "../schemas/comment-schema";

const Comment = model("comments", CommentSchema);

export class CommentModel {
  async findByObj(filterObj) {
    const comment = await Comment.findOne(filterObj);
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

  async update(filterObj, updateObj) {
    const option = { returnOriginal: false };

    const updatedcomment = await Comment.findOneAndUpdate(filterObj, updateObj, option);
    return updatedcomment;
  }

  async deleteById(commentId) {
    const result = await Comment.deleteOne({ _id: commentId });
    return result;
  }

  async deleteByProduct(productId) {
    const result = await Comment.deleteMany({ _id: productId });
    return result;
  }
}

const commentModel = new CommentModel();

export { commentModel };
