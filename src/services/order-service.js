import { orderModel, productModel, userModel } from "../db";
import { NotFound, Forbidden } from "../utils/errorCodes";

class OrderService {
  constructor(orderModel, productModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
    this.userModel = userModel;
  }

  //주문 추가 // 여기에 user id false로 하고 주문을 하면 구분이 가능할듯?
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }

  async authAddOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
    const { userId, orderId: _id } = createdNewOrder;

    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new NotFound("UserId does not in DB", 4104);
    }

    const toUpdate = { $push: { orders: orderId } };
    // 업데이트 진행
    user = await this.userModel.update({ _id: userId }, toUpdate);

    return createdNewOrder;
  }

  async getOrders() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  async getOrderById(orderId) {
    const order = await this.orderModel.findById(orderId);
    return order;
  }

  // 관리자 주문 상태 수정
  async updateOrderAdmin(orderId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findById(orderId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new NotFound("This Order Not in DB", 4303);
    }

    // 업데이트 진행
    order = await this.orderModel.update({ _id: orderId }, toUpdate);

    return order;
  }

  //구매자 주문 수정
  async updateOrder(orderId, toUpdate) {
    let order = await this.orderModel.findById(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new NotFound("This Order Not in DB", 4303);
    }
    //findbyid
    if (order.status !== "상품준비중") {
      throw new Forbidden("Can not Change Order", 4302);
    }

    // 업데이트 진행
    order = await this.orderModel.update({ _id: orderId }, toUpdate);

    return order;
  }

  //주문 취소

  //관리자 주문 삭제
  async deleteOrder(orderId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findById(orderId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new NotFound("This Order Not in DB", 4303);
    }

    // 업데이트 진행
    const deletedOrder = await this.orderModel.delete({ orderId });
    return deletedOrder;
  }

  //주문한 상품 리스트
  async getOrderList(orderId) {
    //{ id , quantity }
    const { productsInOrder } = await this.orderModel.findById(orderId);

    const productIdArr = productsInOrder.map(({ id }) => id);

    const products = await this.productModel.findByIdArray(productIdArr);
    function compareId(a, b) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    }
    await products.sort(function (a, b) {
      return compareId(a._id.toString(), b._id.toString());
    });

    await productsInOrder.sort(function (a, b) {
      return compareId(a.id, b.id);
    });

    let productsIn = [];
    await productsInOrder.forEach((cur, idx) => {
      const product = products[idx];
      const quantity = cur.quantity;
      productsIn.push({ product, quantity });
    });

    return productsIn;
  }
}

const orderService = new OrderService(orderModel, productModel, userModel);

export { orderService };
