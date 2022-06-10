import { orderModel, orderedProductModel, productModel } from '../db';

class OrderService {
  constructor(orderModel, orderedProductModel, productModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
    this.orderedProductModel = orderedProductModel;
  }
  // 주문 생성
  async addOrder(data) {
    const {
      userId,
      receiver,
      phone,
      address,
      orderRequest,
      totalPrice,
      orderList,
    } = data;
    if (receiver == '') {
      throw new Error('수령자 이름을 입력해주세요.');
    }
    if (phone == '') {
      throw new Error('연락처를 입력해주세요.');
    }
    if (address == '') {
      throw new Error('주소를 입력해주세요.');
    }

    const addOrder = await this.orderModel.create({
      userId,
      receiver,
      phone,
      address,
      orderRequest,
      totalPrice,
    });

    let newOrder;
    for (let i = 0; i < orderList.length; i++) {
      let productData = orderList[i];
      let orderedProduct = await this.orderedProductModel.create(productData);

      // 생성된 newOrder에 orderList를 채워서 반환
      newOrder = await this.orderModel.pushOrder(addOrder, orderedProduct);

      // product 모델에서 storage 값을 주문량만큼 차감
      await this.productModel.updateStorage(productData);
    }
    return newOrder;
  }

  // 주문 내역 조회
  async getOwnList(userId) {
    const findOrder = await this.orderModel.findOwn(userId);
    return findOrder;
  }

  // 관리자용 주문 내역 조회
  async getAllList() {
    const findAllOrder = await this.orderModel.findAll();
    return findAllOrder;
  }

  // 주문 관리
  async changeStatus(orderId, status) {
    const updatedStatus = await this.orderModel.update(orderId, status);
    return updatedStatus;
  }

  // 주문 삭제
  async deleteOrder(_id) {
    const deletedOrder = await this.orderModel.delete(_id);
    return deletedOrder;
  }
}

const orderService = new OrderService(
  orderModel,
  orderedProductModel,
  productModel,
);

export { orderService };
