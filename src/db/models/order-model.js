// import { model } from 'mongoose';
// import { orderedProductSchema, orderSchema } from '../schemas/order-schema';

// const orderModel = model('order', orderSchema);
// const orderedProductModel = model('orderedProduct', orderedProductSchema);

// export { orderModel, orderedProductModel };
//////////////////////////////////////////////////

import { model } from 'mongoose';
import { orderedProductSchema, orderSchema } from '../schemas/order-schema';

const order = model('order', orderSchema);
const orderedProduct = model('orderedProduct', orderedProductSchema);

export class OrderModel {
	// 주문 생성 (데이터 객체로 받음)
	async create(data) {
		const createOrder = await order.create(data);
		return createOrder;
	}

	// 생성된 주문의 주문항목에 하나를 추가
	async pushOrder(recentOrder, orderedProduct) {
		const pushOrder = await order
			.findByIdAndUpdate(
				recentOrder._id,
				{ $push: { orderList: orderedProduct } },
				{ new: true },
			)
			.populate({
				path: 'orderList',
				populate: 'productId',
			});
		return pushOrder;
	}

	// 주문 조회 (개인용)
	async findOwn(userId) {
		const findOrder = await order
			.find({ $and: [{ userId }, { deleteFlag: 0 }] })
			.populate({
				path: 'orderList',
				populate: 'productId',
			});

		return findOrder;
	}

	// 주문 조회 (관리자용)
	async findAll() {
		const findAllOrder = await order.find({ deleteFlag: 0 }).populate({
			path: 'orderList',
			populate: 'productId',
		});
		return findAllOrder;
	}

	// 주문 관리
	async update(orderId, status) {
		const updateOrder = await order
			.findByIdAndUpdate({ _id: orderId }, { status: status }, { new: true })
			.populate('orderList');
		return updateOrder;
	}

	// 주문 삭제
	async delete(_id) {
		const changeDeleteFlag = await order
			.findOneAndUpdate({ _id: _id }, { deleteFlag: 1 }, { new: true })
			.populate('orderList');
		return changeDeleteFlag;
	}
}

export class OrderedProductModel {
	// 하나의 주문 상품 항목 (상품 id, 개수를 객체로 받음)
	async create(data) {
		const createOneOrder = await orderedProduct.create(data);
		return createOneOrder;
	}
}

const orderModel = new OrderModel();
const orderedProductModel = new OrderedProductModel();

export { orderModel, orderedProductModel };
