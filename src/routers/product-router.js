import express from 'express';
import path from 'path';
const productRouter = express.Router();

import { loginRequired, adminConfirm } from '../middlewares';

import { productService } from '../services/product-service';

import multer from 'multer';

//multer 의 diskStorage를 정의
const storage = multer.diskStorage({
  //경로 설정
  destination: function (req, file, cb) {
    cb(null, 'src/views/uploads/');
  },

  //실제 저장되는 파일명 설정
  filename: function (req, file, cb) {
    // 파일 이름을 그대로 저장 (확장자 까지 포함)
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 상품 추가
productRouter.post(
  '/',
  adminConfirm,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { name, category, information, price, storage, date, company } =
        req.body;
      const image = `uploads/${req.file.filename}`;

      const newProduct = await productService.addProduct(
        { name, category, information, price, storage, date, company },
        image,
      );

      res.status(201).json(newProduct);
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

      const deleteProduct = await productService.deleteProduct(product_id);

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
      // console.log(product_id);
      // console.log(name, category, information, price, storage, date, company);
      const image = req.file.path;

      console.log(image);
      const updateProduct = await productService.updateProduct(
        product_id,
        { name, category, information, price, storage, date, company },
        image,
      );

      res.status(200).json(updateProduct);
    } catch (err) {
      next(err);
    }
  },
);

// 상품 전체 보기 (카테고리별)

productRouter.get('/list', async (req, res, next) => {
  try {
    // api/product/list/?category=1238asdsad7612983
    const { category } = req.query;
    // 상품 전체 검색
    const products = await productService.findAllByCategory(category);

    // 상품들 정보를 프론트에 전달
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// 상품 pagination (카테고리별)
productRouter.get('/pageList', async (req, res, next) => {
  try {
    // api/product/pageList/?category=1238asdsad7612983&page=1&perPage=7
    const { category } = req.query;
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 12);

    // 총 페이지 수 확인
    const totalPage = await productService.totalPage(category, perPage);

    // 상품 검색
    const products = await productService.findPaginationProducts(
      category,
      page,
      perPage,
    );

    const data = [totalPage, products];
    // 상품들 정보를 프론트에 전달
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

// 상품 상세 보기 (_id)
productRouter.get('/detail/:_id', async (req, res, next) => {
  try {
    // product/detail/asdasdfasdf
    const product_id = req.params._id;
    // product_id로 상품 하나 찾기
    const product = await productService.getProductDetail(product_id);
    // 상품 데이터 프론트에 전달
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

export { productRouter };
