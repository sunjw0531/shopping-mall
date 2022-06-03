import { Schema } from 'mongoose';
import { CategorySchema } from './category-schema';

const ProductSchema = new Schema(
  {
    product_id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      // 상품명
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    //  picture: { // 상품이미지
    //    type: String,
    //    required: true,
    //  },
    inform: {
      // 상품정보
      type: String,
      required: true,
    },
    price: {
      // 가격
      type: Number,
      required: true,
    },
    storage: {
      // 재고
      type: Number,
      required: true,
    },
    date: {
      // 출시날짜
      type: Date,
      required: true,
    },
    thumbs: {
      // 추천수
      type: Number,
      default: 0,
    },
    views: {
      // 조회수
      type: Number,
      default: 0,
    },
    company: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

// product_id 자동으로 1씩 카운트해서 증가
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

ProductSchema.plugin(autoIncrement.plugin, {
  model: 'products',
  field: 'product_id',
  startAt: 1,
  increment: 1,
});

export { ProductSchema };
