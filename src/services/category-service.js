import { categoryModel } from '../db';

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }
  // 카테고리 추가
  async addCategory(name) {
    if (name == '') {
      throw new Error('추가하실 카테고리 이름을 입력해주세요.');
    }
    if (await this.categoryModel.findOne(name)) {
      throw new Error('이미 존재하는 카테고리입니다.');
    }
    const addCategory = await this.categoryModel.create(name);
    return addCategory;
  }

  // 카테고리 수정
  async changeCategory(name, newName) {
    if (newName == '') {
      throw new Error('수정하실 카테고리 이름을 입력해주세요.');
    }
    const changeCategory = await this.categoryModel.update(name, newName);
    return changeCategory;
  }

  // 카테고리 삭제
  async deleteCategory(name) {
    if (name == '') {
      throw new Error('삭제하실 카테고리 이름을 입력해주세요.');
    }

    if (!(await categoryModel.findOne(name))) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    const deleteCategory = await this.categoryModel.delete(name);
    return deleteCategory;
  }

  // 카테고리 전체 받기
  async getAllCategories() {
    const getAllCategories = await this.categoryModel.findAll();
    return getAllCategories;
  }

  // 카테고리 이름 받기
  async getCategoryName(id) {
    const getCategoryName = await this.categoryModel.findName(id);
    return getCategoryName;
  }
}

const categoryService = new CategoryService(categoryModel);
export { categoryService };
