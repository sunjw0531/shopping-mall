import express from 'express';
import path from 'path';
const productRouter = express.Router();

import { loginRequired, adminConfirm } from '../middlewares';

import { productModel } from '../db/models/product-model.js';
import { categoryModel } from '../db/models/category-model.js';

import multer from 'multer';
//multer 의 diskStorage를 정의
const storage = multer.diskStorage({
	//경로 설정
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},

	//실제 저장되는 파일명 설정
	filename: function (req, file, cb) {
		// 파일 이름을 그대로 저장 (확장자 까지 포함)
		cb(null, Date.now() + '_' + file.originalname);
	},
});

const upload = multer({ storage: storage });

// 상품 전체 보기 (카테고리별)

productRouter.get('/list', async (req, res, next) => {
	try {
		// /product/list/?category=1238asdsad7612983
		const { category } = req.query;
		// 상품 전체 검색
		const products = await productModel
			.find({ category, deleteFlag: 0 })
			.populate('category');

		// 상품들 정보를 프론트에 전달
		res.status(200).json(products);
	} catch (err) {
		next(err);
	}
});

// 상품 상세 보기
productRouter.get('/detail/:product_id', async (req, res, next) => {
	try {
		// product/detail/6
		const product_id = req.params.product_id;
		// product_id로 상품 하나 찾기
		const product = await productModel
			.findOne({ product_id })
			.populate('category');

		// 상품 데이터 프론트에 전달
		res.status(200).json(product);
	} catch (err) {
		next(err);
	}
});

// 여러 상품 정보 전달
productRouter.get('/information', async (req, res, next) => {
	try {
		// 주문할 상품들의 ID를 배열로 body에서 가져옴
		const { orderProducts } = req.body;

		const productsInfo = await productModel.find(
			{ product_id: { $in: orderProducts } },
			{ name: true, price: true, storage: true },
		);
		res.status(200).json(productsInfo);
	} catch (err) {
		next(err);
	}
});

// 상품 추가
productRouter.post(
	'/',
	adminConfirm,
	upload.single('image'),
	async (req, res, next) => {
		try {
			const { name, category, information, price, storage, date, company } =
				req.body;
			const image = req.file.path;
			//////////////////// 입력값 빠졌는지 검사 //////////////////////////
			if (name == '') {
				throw new Error('상품 이름을 입력해주세요!');
			}
			if (image == '') {
				throw new Error('상품 이미지를 업로드해주세요!');
			}
			if (category == '') {
				throw new Error('상품 카테고리를 입력해주세요!');
			}
			if (information == '') {
				throw new Error('상품 설명을 입력해주세요!');
			}
			if (price == '') {
				throw new Error('상품 가격을 입력해주세요!');
			}
			if (storage == '') {
				throw new Error('상품 재고를 입력해주세요!');
			}
			if (date == '') {
				throw new Error('상품 출시 날짜를 입력해주세요!');
			}
			if (company == '') {
				throw new Error('상품 제조사를 입력해주세요!');
			}

			const newProductCategory = await productModel.create({
				name,
				category,
				image,
				information,
				price,
				storage,
				date,
				company,
			});

			// 카테고리 모델에 상품 모델 추가
			const thisCategory = await categoryModel
				.findOneAndUpdate(
					{ _id: category },
					{ $push: { products: newProductCategory } },
					{ new: true },
				)
				.populate('products');

			// 상품 모델이 생성되었음을 알리고 데이터를 프론트에 전달
			res.status(201).json(newProductCategory);
		} catch (err) {
			next(err);
		}
	},
);

// 상품 삭제
productRouter.delete(
	'/detail/:product_id',
	adminConfirm,
	async (req, res, next) => {
		try {
			// product/detail/26
			const product_id = req.params.product_id;

			// 실제 데이터를 삭제하는 코드
			const oldModel = await productModel.findOne({ product_id });
			const oldModelCategoryId = oldModel.category;
			await categoryModel.updateOne(
				{ _id: oldModelCategoryId },
				{ $pull: { products: oldModel._id } },
			);

			// 해당 상품 name을 가진 상품 데이터를 삭제
			const deleteProduct = await productModel
				.deleteOne({ product_id })
				.populate('category');

			// // deleteFlag 를 1으로 해서 사용하지 않는 데이터로 처리
			// const deleteProduct = await productModel.findOneAndUpdate(
			// 	{ product_id },
			// 	{ deleteFlag: 1 },
			// );

			res.status(200).json(deleteProduct);
		} catch (err) {
			next(err);
		}
	},
);

// 상품 정보 수정

productRouter.patch(
	'/update_product/:product_id',
	adminConfirm,
	upload.single('image'),
	async (req, res, next) => {
		try {
			// product/update_product/6
			const product_id = req.params.product_id;

			//  상품 정보 수정하기 위해 값을 받아오기
			const { name, category, information, price, storage, date, company } =
				req.body;
			const image = req.file.path;
			// 입력값 빠졌는지 검사
			if (name == '') {
				throw new Error('상품 이름을 입력해주세요!');
			}
			if (category == '') {
				throw new Error('상품 카테고리를 입력해주세요!');
			}
			if (image == '') {
				throw new Error('상품 이미지를 업로드해주세요!');
			}
			if (information == '') {
				throw new Error('상품 설명을 입력해주세요!');
			}
			if (price == '') {
				throw new Error('상품 가격을 입력해주세요!');
			}
			if (storage == '') {
				throw new Error('상품 재고를 입력해주세요!');
			}
			if (date == '') {
				throw new Error('상품 출시 날짜를 입력해주세요!');
			}
			if (company == '') {
				throw new Error('상품 제조사를 입력해주세요!');
			}

			// // 기존 카테고리에서 상품 제거
			const oldModel = await productModel.findOne({ product_id });
			const oldModelCategoryId = oldModel.category;
			await categoryModel.updateOne(
				{ _id: oldModelCategoryId },
				{ $pull: { products: oldModel._id } },
			);

			// body 값들을 받아와 상품 정보 수정
			const updateProduct = await productModel
				.findOneAndUpdate(
					{ product_id },
					{ name, category, image, information, price, storage, date, company },
				)
				.populate('category');

			// 카테고리에 상품 추가
			const newModel = await productModel.findOne({ product_id });
			const newModelCategoryId = newModel.category;
			await categoryModel
				.updateOne(
					{ _id: newModelCategoryId },
					{ $push: { products: newModel._id } },
				)
				.populate('products');

			res.status(200).json(updateProduct);
		} catch (err) {
			next(err);
		}
	},
);

export { productRouter };
