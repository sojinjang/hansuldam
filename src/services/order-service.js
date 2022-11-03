import { orderModel } from "../db";

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  //주문 추가 // 여기에 user id false로 하고 주문을 하면 구분이 가능할듯?
  async addOrder(orderInfo) {
    // db에 저장
    const createdNewOrder = await this.orderModel.create(orderInfo);
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
      res.status(404);
      throw new Error(
        "일치하는 카테고리가 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 업데이트 진행
    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  //구매자 주문 수정
  async updateOrder(orderId, toUpdate) {
    let order = await this.orderModel.findById(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      res.status(404);
      throw new Error(
        "일치하는 주문 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }
    //findbyid
    if (order.status !== "상품준비중") {
      res.status(404);
      throw new Error("상품이 배송중이기에 고객센터에 문의 부탁드립니다.");
    }

    // 업데이트 진행
    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  //주문 취소

  //관리자 주문 삭제
  async deleteOrder(orderId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findById(orderId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      res.status(404);
      throw new Error(
        "일치하는 주문 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
    }

    // 업데이트 진행
    const deletedOrder = await this.orderModel.delete({ orderId });
    return deletedOrder;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
