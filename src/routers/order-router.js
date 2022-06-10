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
