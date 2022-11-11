import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

viewsRouter.use('/', serveStatic('home'));
viewsRouter.use('/join', serveStatic('join'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/cart', serveStatic('cart'));
viewsRouter.use('/products', serveStatic('category_page'));
viewsRouter.use('/product-detail', serveStatic('product_detail'));
viewsRouter.use('/event-page', serveStatic('event_page'));
viewsRouter.use('/admin', serveStatic('admin'));
viewsRouter.use('/order-pay-member', serveStatic('order_pay_member'));
viewsRouter.use('/order-pay-nonmember', serveStatic('order_pay_nonmember'));
viewsRouter.use('/adult-certification', serveStatic('adult_certification'));
viewsRouter.use('/order-list', serveStatic('order_list'));
viewsRouter.use('/find-password', serveStatic('find_password'));
viewsRouter.use('/user-infomation', serveStatic('user_infomation'));
viewsRouter.use('/myPage', serveStatic('myPage'));

viewsRouter.use('/', serveStatic(''));

function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  return express.static(resourcePath, option);
}

export { viewsRouter };
