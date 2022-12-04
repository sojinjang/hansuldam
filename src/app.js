import cors from "cors";
import express from "express";
import {
  viewsRouter,
  userRouter,
  categoryRouter,
  productRouter,
  imageRouter,
  commentRouter,
  orderRouter,
  cartRouter,
  naverRouter,
} from "./routers";
import { errorHandler } from "./middlewares";
import { ApiUrl } from "./views/constants/ApiUrl.js";

const app = express();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅
app.use(ApiUrl.USER, userRouter);
app.use(ApiUrl.CATEGORY, categoryRouter);
app.use(ApiUrl.PRODUCTS, productRouter);
app.use(ApiUrl.IMAGE, imageRouter);
app.use(ApiUrl.ORDERS, orderRouter);
app.use(ApiUrl.CART_BASE, cartRouter);
app.use(ApiUrl.COMMENTS, commentRouter);
app.use(ApiUrl.NAVER_OAUTH, naverRouter);

// 에러 라우팅
app.use(errorHandler);

export { app };
