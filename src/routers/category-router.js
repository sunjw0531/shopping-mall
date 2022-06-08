import express from 'express';
import path from 'path';
const categoryRouter = express.Router();
import { loginRequired, adminConfirm } from '../middlewares';
import { categoryModel } from '../db/models/category-model.js';

// 카테고리 추가
categoryRouter.post('/', adminConfirm, async (req, res, next) => {
	try {
		const { name } = req.body;

		if (await categoryModel.findOne({ name })) {
			throw new Error('이미 존재하는 카테고리입니다.');
		}
		const addCategory = await categoryModel.create({ name });
		res.status(200).json(addCategory);
	} catch (err) {
		next(err);
	}
});

// 카테고리 수정
categoryRouter.patch('/:name', adminConfirm, async (req, res, next) => {
	const name = req.params.name;
	const newName = req.body;
	const changeCategory = await categoryModel
		.findOneAndUpdate({ name: name }, { name: newName })
		.populate('products');
	res.status(200).json(changeCategory);
});

// 카테고리 삭제
categoryRouter.delete('/', adminConfirm, async (req, res, next) => {
	try {
		const { name } = req.body;
		if (!(await categoryModel.findOne({ name }))) {
			throw new Error('존재하지 않는 카테고리입니다.');
		}

		const deleteCategory = await categoryModel.deleteOne({ name });

		res.status(200).json(deleteCategory);
	} catch (err) {
		next(err);
	}
});

// 카테고리 전체받기
categoryRouter.get('/list', adminConfirm, async (req, res, next) => {
	try {
		const list = await categoryModel.find({}).populate('products');
		res.status(200).json(list);
	} catch (err) {
		next(err);
	}
});

export { categoryRouter };
