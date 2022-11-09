import cors from "cors";
import express from "express";
import {
  viewsRouter,
  userRouter,
  categoryRouter,
  productRouter,
  adminRouter,
  orderRouter,
  authRouter,
} from "./routers";
import { errorHandler, loginRequired, adminRequired } from "./middlewares";
import passport from "passport";

const app = express();

// CORS 에러 방지
app.use(cors());

require("./services/passport")();

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// passport 초기화
app.use(passport.initialize());

// api 라우팅
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/auth", loginRequired, authRouter);
app.use("/api/admin", loginRequired, adminRequired, adminRouter);

// 에러 라우팅
app.use(errorHandler);

export { app };
