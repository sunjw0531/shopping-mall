import express from 'express';
import path from 'path';
const categoryRouter = express.Router();
import { loginRequired, adminConfirm } from '../middlewares';
import { categoryService } from '../services/category-service';

// 카테고리 추가
categoryRouter.post('/', adminConfirm, async (req, res, next) => {
  try {
    const { name } = req.body;

    const addCategory = await categoryService.addCategory(name);

    res.status(201).json(addCategory);
  } catch (err) {
    next(err);
  }
});

// 카테고리 수정
categoryRouter.patch('/:name', adminConfirm, async (req, res, next) => {
  const name = req.params.name;
  const { newName } = req.body;

  const changeCategory = await categoryService.changeCategory(name, newName);

  res.status(200).json(changeCategory);
});

// 카테고리 삭제
categoryRouter.delete('/', adminConfirm, async (req, res, next) => {
  try {
    const { name } = req.body;

    const deleteCategory = await categoryService.deleteCategory(name);

    res.status(200).json(deleteCategory);
  } catch (err) {
    next(err);
  }
});

// 카테고리 전체받기
categoryRouter.get('/list', async (req, res, next) => {
  try {
    const list = await categoryService.getAllCategories();

    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
});

// 카테고리 이름 반환
categoryRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const categoryName = await categoryService.getCategoryName(id);
    res.status(200).json(categoryName);
  } catch (err) {
    next(err);
  }
});

export { categoryRouter };
