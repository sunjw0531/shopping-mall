import { categoryModel } from '../db';

class CategoryService {
	constructor(categoryModel) {
		this.categoryModel = categoryModel;
	}
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

	async changeCategory(name, newName) {
		if (newName == '') {
			throw new Error('수정하실 카테고리 이름을 입력해주세요.');
		}
		const changeCategory = await this.categoryModel.update(name, newName);
		return changeCategory;
	}

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

	async getAllCategories() {
		const getAllCategories = await this.categoryModel.findAll();
		return getAllCategories;
	}
}

const categoryService = new CategoryService(categoryModel);
export { categoryService };
