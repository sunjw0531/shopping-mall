import express from 'express';
const orderRouter = express.Router();
import { orderModel, orderedProductModel } from '../db/models/order-model';

import { loginRequired, adminConfirm } from '../middlewares';

// 주문 생성
orderRouter.post('/', adminConfirm, async (req, res, next) => {
	const userId = req.currentUserId;
	const { receiver, phone, address, orderRequest, orderList } = req.body;

	const createOrder = orderModel.create({
		userId,
		receiver,
		phone,
		address,
		orderRequest,
	});

	let newOrder;
	for (let i = 0; i < orderList.length; i++) {
		let orderLists = req.body.orderList;
		let data = orderLists[i];
		let orderList = await orderedProductModel.create(data);

		newOrder = await orderModel
			.findOneAndUpdate(
				{ userId },
				{ $push: { orderList: orderList } },
				{ new: true },
			)
			.populate('orderList')
			.populate({
				path: 'orderList',
				populate: 'productId',
			});
	}
	res.status(201).json(newOrder);
});

// 주문 내역 조회
// req.query로 실험 먼저 해보기
orderRouter.get('/ownList', adminConfirm, async (req, res, next) => {
	const userId = req.currentUserId;
	const findOrder = await orderModel
		.find({ userId, deleteFlag: 0 })
		.populate('orderList');

	res.status(200).json(findOrder);
});

// 관리자용 주문 내역 조회
orderRouter.get('/list', adminConfirm, async (req, res, next) => {
	const findAllOrder = await orderModel
		.find({ deleteFlag: 0 })
		.populate('orderList');
	res.status(200).json(findAllOrder);
});

// 주문 관리
orderRouter.patch('/delivery', adminConfirm, async (req, res, next) => {
	// api/order/change/?orderId=as2s2asd
	const { orderId } = req.query;
	const { status } = req.body;

	const changeStatus = await orderModel
		.findByIdAndUpdate({ _id: orderId }, { status: status }, { new: true })
		.populate('orderList');

	res.status(200).json(changeStatus);
});

// 주문 삭제
orderRouter.patch('/deleteFlag', adminConfirm, async (req, res, next) => {
	const { _id, deleteFlag } = req.body;
	const changedeleteFlag = await orderModel
		.findOneAndUpdate({ _id: _id }, { deleteFlag }, { new: true })
		.populate('orderList');
	res.status(200).json(changedeleteFlag);
});

export { orderRouter };
