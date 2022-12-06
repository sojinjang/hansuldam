import express from "express";
import path from "path";

const viewsRouter = express.Router();

viewsRouter.use("/", serveStatic("home"));
viewsRouter.use("/join", serveStatic("join"));
viewsRouter.use("/login", serveStatic("login"));
viewsRouter.use("/cart", serveStatic("cart"));
viewsRouter.use("/products", serveStatic("category_page"));
viewsRouter.use("/product-detail", serveStatic("product_detail"));
viewsRouter.use("/event-page", serveStatic("event_page"));
viewsRouter.use("/admin", serveStatic("admin"));
viewsRouter.use("/order-pay", serveStatic("order_pay"));
viewsRouter.use("/adult-certification", serveStatic("adult_certification"));
viewsRouter.use("/my-order-list", serveStatic("my_order_list"));
viewsRouter.use("/find-password", serveStatic("find_password"));
viewsRouter.use("/my-information", serveStatic("my_information"));
viewsRouter.use("/my-page", serveStatic("my_page"));
viewsRouter.use("/search", serveStatic("search"));
viewsRouter.use("/filter", serveStatic("filter"));

viewsRouter.use("/", serveStatic(""));

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

export { viewsRouter };
