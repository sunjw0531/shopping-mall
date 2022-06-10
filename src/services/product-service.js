import { productModel } from '../db';
import { categoryModel } from '../db';

import { model } from 'mongoose';

class ProductService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel, categoryModel) {
    this.productModel = productModel;
    this.categoryModel = categoryModel;
  }
  // 상품 추가
  async addProduct(productInfo, imageFile) {
    const { name, category, information, price, storage, date, company } =
      productInfo;
    const image = imageFile;
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
    const newProduct = await this.productModel.create({
      name,
      category,
      image,
      information,
      price,
      storage,
      date,
      company,
    });

    // 카테고리 모델에 해당 상품 추가
    const updateCategoryProduct = await this.categoryModel.addProduct(
      category,
      newProduct,
    );

    return newProduct;
  }

  // 상품 삭제
  async deleteProduct(product_id) {
    // const product_id = product_id;
    // 기존 category에서 product 항목 하나 삭제
    const oldModel = await this.productModel.findDetailById(product_id);
    const oldModelCategoryId = oldModel.category;
    const deleteProductFromCategory = await this.categoryModel.deleteProduct(
      oldModelCategoryId,
      oldModel,
    );

    // 상품 데이터 삭제
    const deleteProduct = await this.productModel.delete(product_id);

    return deleteProduct;
  }

  // 상품 정보 수정
  async updateProduct(product_id, productInfo, imageFile) {
    const { name, category, information, price, storage, date, company } =
      productInfo;
    const image = imageFile;
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

    // 기존 카테고리에서 상품 항목 하나 제거
    const oldModel = await this.productModel.findOne(product_id);
    const oldModelCategoryId = oldModel.category;
    const deleteProductAtCategory = await this.categoryModel.deleteProduct(
      oldModelCategoryId,
      oldModel,
    );

    // body 값들을 받아와 상품 정보 수정
    const updateProduct = await this.productModel.update(product_id, {
      name,
      category,
      image,
      information,
      price,
      storage,
      date,
      company,
    });

    // 다른 카테고리에 새로운 상품 항목 하나 추가
    const newModel = await this.productModel.findOne(product_id);
    const newModelCategoryId = newModel.category;
    const addProductAtCategory = await this.categoryModel.addProduct(
      newModelCategoryId,
      newModel._id,
    );

    return updateProduct;
  }

  // 상품 전체 보기 (카테고리별)
  async findAllByCategory(category) {
    const products = await this.productModel.findAllByCategory(category);

    return products;
  }

  // 상품 pagination하여 보기 (카테고리별)
  async findPaginationProducts(category, page, perPage) {
    const products = await this.productModel.pagination(
      category,
      page,
      perPage,
    );

    return products;
  }

  // pagination 총 페이지 수 확인
  async totalPage(category, perPage) {
    const totalProductCount = await this.productModel.count(category);
    const totalPageCount = Math.ceil(totalProductCount / perPage);
    return totalPageCount;
  }

  // 상품 상세 보기
  async getProductDetail(product_id) {
    // const product_id = product_id;
    const product = await this.productModel.findDetailById(product_id);

    return product;
  }
}

const productService = new ProductService(productModel, categoryModel);

export { productService };
