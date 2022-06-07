import { Schema } from 'mongoose';

const CategorySchema = new Schema(
	{
		name: { type: String, required: true },
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'products',
			},
		],
		// 0 : 사용중인 데이터 , 1 : 사용하지 않는 데이터
		deleteFlag: {
			type: Number,
			default: 0,
		},
	},
	{
		collection: 'categories',
		timestamps: true,
	},
);

export { CategorySchema };
