import { commentModel } from "../db";
import { BadRequest, Unauthorized } from "../utils/errorCodes";

class CommentService {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  async addComment(commentInfo) {
    // db에 저장
    const createdNewComment = await this.commentModel.create(commentInfo);

    return createdNewComment;
  }

  async getAllComments() {
    const comments = await this.commentModel.findAll();

    return comments;
  }

  async getCommentsByProductId(productId) {
    const comments = await this.commentModel.findAllByProductId(productId);

    return comments;
  }

  async userSetComment(curUserId, commentId, toUpdate) {
    const { userId } = await this.commentModel.findById(commentId);

    if (curUserId !== userId.toString()) {
      throw new Unauthorized("userID mismatch", 4502);
    }

    const updatedComment = await this.commentModel.update({
      commentId,
      update: toUpdate,
    });

    return updatedComment;
  }

  async userDeleteComment(curUserId, commentId) {
    const { userId } = await this.commentModel.findById(commentId);
    if (curUserId !== userId.toString()) {
      throw new Unauthorized("userID mismatch", 4502);
    }

    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new BadRequest("Failed to Delete Comment", 4502);
    }

    return { result: "success" };
  }

  async deleteComment(commentId) {
    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new BadRequest("Failed to Delete Comment", 4502);
    }

    return { result: "success" };
  }
}

const commentService = new CommentService(commentModel);

export { commentService };
