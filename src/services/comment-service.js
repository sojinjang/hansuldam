import fs from "fs";
import { commentModel } from "../db";
import { BadRequest, Unauthorized, NotFound } from "../utils/errorCodes";

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

  async userSetComment(curUserId, commentId, updateObj) {
    const filterObj = { _id: commentId };
    const { userId } = await this.commentModel.findByObj(filterObj);

    if (curUserId !== userId._id.toString()) {
      throw new Unauthorized("userID mismatch", 4502);
    }
    const updatedComment = await this.commentModel.update(filterObj, updateObj);

    return updatedComment;
  }

  async userDeleteComment(curUserId, commentId) {
    const filterObj = { _id: commentId };
    const { userId, image } = await this.commentModel.findByObj(filterObj);

    if (curUserId !== userId._id.toString()) {
      throw new Unauthorized("userID mismatch", 4502);
    }

    if (image) {
      if (fs.existsSync(image)) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(image);
        } catch (error) {
          throw new BadRequest("Fail Delete Image", 4007);
        }
      }
    }

    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new BadRequest("Failed to Delete Comment", 4502);
    }

    return { result: "success" };
  }

  async deleteComment(commentId) {
    // comment 찾기
    const filterObj = { _id: commentId };
    let comment = await this.commentModel.findByObj(filterObj);

    if (comment.image) {
      if (fs.existsSync(comment.image)) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(comment.image);
        } catch (error) {
          throw new BadRequest("Fail Delete Image", 4007);
        }
      }
    }

    //삭제 진행
    const { deletedCount } = await this.commentModel.deleteById(commentId);

    // 삭제에 실패한 경우, 에러 메시지 반환
    if (deletedCount === 0) {
      throw new BadRequest("Failed to Delete Comment", 4502);
    }

    return { result: "success" };
  }

  async updateCommentImage(commentId, image) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    const filterObj = { _id: commentId };
    let comment = await this.commentModel.findByObj(filterObj);

    if (!comment) {
      try {
        fs.unlinkSync(image);
      } catch (error) {
        throw new BadRequest("Fail Delete Image", 4007);
      }
      throw new NotFound("This Product Not In DB", 4203);
    }

    if (comment.image) {
      if (fs.existsSync(comment.image)) {
        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        try {
          fs.unlinkSync(comment.image);
        } catch (error) {
          throw new BadRequest("Fail Delete Image", 4007);
        }
      }
    }
    const updateObj = { image };
    // 업데이트 진행
    comment = await this.commentModel.update(filterObj, updateObj);

    return comment;
  }
}

const commentService = new CommentService(commentModel);

export { commentService };
