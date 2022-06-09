// import express from 'express';
// const orderRouter = express.Router();
// import { orderModel, orderedProductModel } from '../db/models/order-model';
// import { productModel } from '../db';
// import { loginRequired, adminConfirm } from '../middlewares';

// // 주문 생성
// orderRouter.post('/', loginRequired, async (req, res, next) => {
// 	const userId = req.currentUserId;
// 	const { receiver, phone, address, orderRequest, orderList, totalPrice } =
// 		req.body;

// 	const createOrder = await orderModel.create({
// 		userId,
// 		receiver,
// 		phone,
// 		address,
// 		orderRequest,
// 		totalPrice,
// 	});

// 	// 생성된 order모델의 orderList를 채워주는 코드
// 	let newOrder;
// 	for (let i = 0; i < orderList.length; i++) {
// 		let data = orderList[i];
// 		let orderedProduct = await orderedProductModel.create(data);

// 		newOrder = await orderModel
// 			.findByIdAndUpdate(
// 				createOrder._id,
// 				{ $push: { orderList: orderedProduct } },
// 				{ new: true },
// 			)
// 			.populate({
// 				path: 'orderList',
// 				populate: 'productId',
// 			});
// 		// product 모델에서 storage 값을 주문량만큼 차감
// 		const productStorage = await productModel.findById(data.productId);
// 		const newStorage = productStorage.storage - data.volume;
// 		await productModel.findByIdAndUpdate(data.productId, {
// 			storage: newStorage,
// 		});
// 	}
// 	res.status(201).json(newOrder);
// });

// // 주문 내역 조회
// orderRouter.get('/ownList', loginRequired, async (req, res, next) => {
// 	const userId = req.currentUserId;
// 	const findOrder = await orderModel
// 		.find({ $and: [{ userId }, { deleteFlag: 0 }] })
// 		.populate({
// 			path: 'orderList',
// 			populate: 'productId',
// 		});

// 	res.status(200).json(findOrder);
// });

// // 관리자용 주문 내역 조회
// orderRouter.get('/list', adminConfirm, async (req, res, next) => {
// 	const findAllOrder = await orderModel.find({ deleteFlag: 0 }).populate({
// 		path: 'orderList',
// 		populate: 'productId',
// 	});
// 	res.status(200).json(findAllOrder);
// });

// // 주문 관리
// orderRouter.patch('/delivery', adminConfirm, async (req, res, next) => {
// 	// api/order/delivery/?orderId=as2s2asd
// 	const { orderId } = req.query;
// 	const { status } = req.body;

// 	const changeStatus = await orderModel
// 		.findByIdAndUpdate({ _id: orderId }, { status: status }, { new: true })
// 		.populate('orderList');

// 	res.status(200).json(changeStatus);
// });

// // 주문 삭제
// orderRouter.patch('/deleteFlag/:_id', loginRequired, async (req, res, next) => {
// 	const _id = req.params._id;
// 	const changedeleteFlag = await orderModel
// 		.findOneAndUpdate({ _id: _id }, { deleteFlag: 1 }, { new: true })
// 		.populate('orderList');
// 	res.status(200).json(changedeleteFlag);
// });

// export { orderRouter };

import express from 'express';
const orderRouter = express.Router();
import { orderService } from '../services';
import { loginRequired, adminConfirm } from '../middlewares';

// 주문 생성
orderRouter.post('/', loginRequired, async (req, res, next) => {
  const userId = req.currentUserId;
  const { receiver, phone, address, orderRequest, orderList, totalPrice } =
    req.body;

  const newOrder = await orderService.addOrder({
    userId,
    receiver,
    phone,
    address,
    orderRequest,
    totalPrice,
    orderList,
  });

  res.status(201).json(newOrder);
});

// 주문 내역 조회
orderRouter.get('/ownList', loginRequired, async (req, res, next) => {
  const userId = req.currentUserId;
  const findOrder = await orderService.getOwnList(userId);

  res.status(200).json(findOrder);
});

// 관리자용 주문 내역 조회
orderRouter.get('/list', adminConfirm, async (req, res, next) => {
  const findAllOrder = await orderService.getAllList();

  res.status(200).json(findAllOrder);
});

// 주문 관리
orderRouter.patch('/delivery', adminConfirm, async (req, res, next) => {
  // api/order/change/?orderId=as2s2asd
  const { orderId } = req.query;
  const { status } = req.body;

  const changeStatus = await orderService.changeStatus(orderId, status);
  res.status(200).json(changeStatus);
});

// 주문 삭제
orderRouter.patch('/deleteFlag/:_id', loginRequired, async (req, res, next) => {
  const _id = req.params._id;

  const changedeleteFlag = await orderService.deleteOrder(_id);

  res.status(200).json(changedeleteFlag);
});

export { orderRouter };
