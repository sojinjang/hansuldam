import { model } from "mongoose";
import { CommentSchema } from "../schemas/comment-schema";

const Comment = model("comments", CommentSchema);

export class CommentModel {
  async findByObj(filterObj) {
    const comment = await Comment.findOne(filterObj).populate("userId", "fullName");
    return comment;
  }

  async findAllByProductId(productId) {
    const comments = await Comment.find({ productId }).populate("userId", "fullName");
    return comments;
  }

  async create(commentInfo) {
    const createdNewcomment = await Comment.create(commentInfo);
    return createdNewcomment;
  }

  async findAll() {
    const comments = await Comment.find({}).populate("userId", "fullName");
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

  async setTestdata(arr) {
    await Comment.deleteMany({});
    const comments = await Comment.insertMany(arr);
    return comments;
  }
}
const commentModel = new CommentModel();

export { commentModel };
