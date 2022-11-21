import { Router } from "express";
import { isEmptyObject, loginRequired, adminRequired } from "../middlewares";
import { BadRequest } from "../utils/errorCodes";

import { commentService } from "../services";

const commentRouter = Router();
const authRouter = Router();
const adminRouter = Router();

commentRouter.use("/auth", loginRequired, authRouter);
commentRouter.use("/admin", loginRequired, adminRequired, adminRouter);

//댓글 조회
commentRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const comments = await commentService.getCommentsByProductId(productId);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

//댓글 등록(회원)
authRouter.post("/", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { productId, content } = req.body;

    const commentInfo = await commentService.addComment({
      productId,
      userId,
      content,
    });

    res.status(200).json(commentInfo);
  } catch (error) {
    next(error);
  }
});

//댓글 수정(회원)
authRouter.patch("/:commentId", isEmptyObject, async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { commentId } = req.params;
    if (!commentId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const { content } = req.body;

    const commentInfo = await commentService.userSetComment(userId, commentId, {
      content,
    });

    res.status(200).json(commentInfo);
  } catch (error) {
    next(error);
  }
});

//댓글 삭제(회원)
authRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const userId = req.currentUser.userId;
    const { commentId } = req.params;
    if (!commentId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const deleted = await commentService.userDeleteComment(userId, commentId);

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
});

// 모든댓글 조회(관리자)
adminRouter.get("/", async (req, res, next) => {
  try {
    const comments = await commentService.getAllComments();

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// 댓글 삭제(관리자)
adminRouter.delete("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!categoryId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const deleted = await commentService.deleteComment(commentId);

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
});

export { commentRouter };
