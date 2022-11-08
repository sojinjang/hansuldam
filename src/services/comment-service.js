import { commentModel } from "../db";

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
      throw new Error(`권한이 없습니다.`);
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
      throw new Error(`권한이 없습니다.`);
    }

    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new Error(`${commentId} 주문의 삭제에 실패하였습니다`);
    }

    return { result: "success" };
  }

  async deleteComment(commentId) {
    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new Error(`${commentId} 주문의 삭제에 실패하였습니다`);
    }

    return { result: "success" };
  }
}

const commentService = new CommentService(commentModel);

export { commentService };
