import { Router } from "express";

import { BadRequest } from "../utils/errorCodes";
import { upload } from "../utils/multer";

import { productService } from "../services";

const imageRouter = Router();

// 이미지 저장후 상품에 이미지 경로 추가
imageRouter.post(
  "/:productId",
  upload.single("uploadImg"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new BadRequest("Fail Upload Image", 4006);
      }
      const { productId } = req.params;
      if (!productId) {
        throw new BadRequest("Undefined params", 4005);
      }
      // 이미지 경로
      const image = req.file.path;

      const product = await productService.updateProductImage(productId, image);

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

export { imageRouter };
