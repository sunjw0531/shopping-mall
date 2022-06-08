import { Schema } from 'mongoose';

const CategorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: 'products',
			},
		],
	},
	{
		collection: 'categories',
		timestamps: true,
	},
);

export { CategorySchema };
