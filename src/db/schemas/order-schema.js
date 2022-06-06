import { Schema } from 'mongoose';

const orderSchema = new Schema(
	{
		// 회원 id
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		// 받는 사람
		receiver: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		address: {
			type: new Schema(
				{
					postalCode: String,
					address1: String,
					address2: String,
				},
				{
					_id: false,
				},
			),
		},
		// 요청사항
		orderRequest: {
			type: String,
			default: '',
		},
		orderList: [
			{
				type: Schema.Types.ObjectId,
				ref: 'orderedProduct',
			},
			{
				_id: false,
			},
		],
		orderDate: {
			type: String,
		},
		// 0 : 상품 준비중, 1 : 상품 배송중, 2: 배송 완료
		status: {
			type: Number,
			default: 0,
		},
		// 0 : 사용중인 데이터 , 1 : 사용하지 않는 데이터
		deleteFlag: {
			type: Number,
			default: 0,
		},
	},
	{
		collection: 'orders',
		timestamps: true,
	},
);

const orderedProductSchema = new Schema(
	{
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'products',
			required: true,
		},
		volume: {
			type: Number,
			required: true,
		},
	},
	{
		collection: 'orderedProduct',
	},
);

orderSchema.pre('save', function (next) {
	if (!this.orderDate) {
		this.orderDate = new Date();
	}
	next();
});

export { orderSchema, orderedProductSchema };
