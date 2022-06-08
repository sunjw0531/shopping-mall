import express from 'express';
const orderRouter = express.Router();
import { orderModel, orderedProductModel } from '../db/models/order-model';
import { productModel } from '../db';
import { loginRequired, adminConfirm } from '../middlewares';

// 주문 생성
orderRouter.post('/', adminConfirm, async (req, res, next) => {
	const userId = req.currentUserId;
	const { receiver, phone, address, orderRequest, orderList, totalPrice } =
		req.body;

	const createOrder = await orderModel.create({
		userId,
		receiver,
		phone,
		address,
		orderRequest,
		totalPrice,
	});

	// 생성된 order모델의 orderList를 채워주는 코드
	let newOrder;
	for (let i = 0; i < orderList.length; i++) {
		let orderLists = req.body.orderList;
		let data = orderLists[i];
		let orderList = await orderedProductModel.create(data);

		newOrder = await orderModel
			.findByIdAndUpdate(
				createOrder._id,
				{ $push: { orderList: orderList } },
				{ new: true },
			)
			.populate({
				path: 'orderList',
				populate: 'productId',
			});
		// product 모델에서 storage 값을 주문량만큼 차감
		const productStorage = await productModel.findById(data.productId);
		const newStorage = productStorage.storage - data.volume;
		await productModel.findByIdAndUpdate(data.productId, {
			storage: newStorage,
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
	const findAllOrder = await orderModel.find({ deleteFlag: 0 }).populate({
		path: 'orderList',
		populate: 'productId',
	});
	res.status(200).json(findAllOrder);
});

// 주문 관리
orderRouter.patch('/delivery', adminConfirm, async (req, res, next) => {
	// api/order/delivery/?orderId=as2s2asd
	const { orderId } = req.query;
	const { status } = req.body;

	const changeStatus = await orderModel
		.findByIdAndUpdate({ _id: orderId }, { status: status }, { new: true })
		.populate('orderList');

	res.status(200).json(changeStatus);
});

// 주문 삭제
orderRouter.patch('/deleteFlag/:_id', adminConfirm, async (req, res, next) => {
	const _id = req.params._id;
	const changedeleteFlag = await orderModel
		.findOneAndUpdate({ _id: _id }, { deleteFlag: 1 }, { new: true })
		.populate('orderList');
	res.status(200).json(changedeleteFlag);
});

export { orderRouter };
