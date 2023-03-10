import { Router } from "express";
import { BadRequest } from "../utils/error-codes";
import { upload } from "../utils";
import { productService, commentService } from "../services";

const imageRouter = Router();

// 이미지 저장후 상품 및 댓글에 이미지 경로 추가
imageRouter.post("/:id", upload.single("uploadImg"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequest("Fail Upload Image", 4006);
    }
    const { id } = req.params;
    if (!id) {
      throw new BadRequest("Undefined params", 4005);
    }

    // location
    const location = req.query.location;

    // 이미지 경로
    const image = req.file.path;

    let success = null;
    if (location == "products") {
      success = await productService.updateProductImage(id, image);
    } else if (location == "comments") {
      success = await commentService.updateCommentImage(id, image);
    }

    res.status(201).json(success);
  } catch (error) {
    next(error);
  }
});

export { imageRouter };
