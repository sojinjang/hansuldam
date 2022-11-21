import { Router } from "express";
import { productService } from "../services";
import { BadRequest } from "../utils/errorCodes";
import { isEmptyObject, loginRequired, adminRequired } from "../middlewares";

const productRouter = Router();
const adminRouter = Router();

productRouter.use("/admin", loginRequired, adminRequired, adminRouter);

// ---- 관리자
// 제품 추가
adminRouter.post("/", isEmptyObject, async (req, res, next) => {
  try {
    // req (request)의 body 에서 데이터 가져오기
    const {
      name,
      price,
      category,
      brand,
      description,
      stock,
      volume,
      sales,
      alcoholType,
      alcoholDegree,
    } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const newProduct = await productService.addProduct({
      name,
      price,
      volume,
      category,
      brand,
      description,
      stock,
      sales,
      alcoholType,
      alcoholDegree,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
adminRouter.patch("/:productId", isEmptyObject, async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const {
      name,
      price,
      volume,
      category,
      brand,
      description,
      stock,
      sales,
      alcoholType,
      alcoholDegree,
    } = req.body;

    // 위 데이터를 상품 db에 추가하기
    const updateProduct = await productService.updateProduct(productId, {
      name,
      price,
      volume,
      category,
      brand,
      description,
      stock,
      sales,
      alcoholType,
      alcoholDegree,
    });

    // 업데이트 이후의 데이터를 프론트에 보내 줌
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제
adminRouter.delete("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }

    const deletedproduct = await productService.deleteProduct(productId);
    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(deletedproduct);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 목록을 가져옴 (배열 형태)
productRouter.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 8);
    const pageObj = { page, perPage };
    // 전체 상품 목록을 얻음
    let { products, totalPage } = await productService.getProducts(pageObj);

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({ products, totalPage });
  } catch (error) {
    next(error);
  }
});

// 상품 필터링 조회
productRouter.get("/filter-search", async (req, res, next) => {
  try {
    const key = req.query.key;
    if (!key) {
      throw new BadRequest("Undefined key", 4204);
    }
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);
    const str = req.query.str;
    const min = Number(req.query.min || 0);
    const max = Number(req.query.max || 0);
    const sort = Number(req.query.sort) === -1 ? -1 : 1;
    const pageObj = { page, perPage };
    const inputFilterObj = { key, str, min, max, sort };

    let { products, totalPage } = await productService.getfilteredProducts(
      pageObj,
      inputFilterObj
    );

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({ products, totalPage });
  } catch (error) {
    next(error);
  }
});

// 상품 상세 정보를 가져옴
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequest("Undefined params", 4005);
    }
    const product = await productService.getProductById(productId);

    // 상품 목록을 JSON 형태로 프론트에 보냄
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
