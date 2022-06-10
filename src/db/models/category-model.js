import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const category = model('category', CategorySchema);

export class CategoryModel {
  // Category model의 products에 항목 추가 (product router 상품 추가 쪽)
  async addProduct(category_id, newProductModel) {
    const updateCategory = await category
      .findOneAndUpdate(
        { _id: category_id },
        { $push: { products: newProductModel } },
        { new: true },
      )
      .populate('products');
    return updateCategory;
  }

  // category에서 product 항목의 요소 삭제
  async deleteProduct(id, oldModel) {
    const updateProduct = await category.updateOne(
      { _id: id },
      { $pull: { products: oldModel._id } },
    );
    return updateProduct;
  }

  // 카테고리 이름으로 찾기
  async findOne(name) {
    const OneCategory = await category.findOne({ name });
    return OneCategory;
  }

  // 카테고리 추가
  async create(name) {
    const newCategory = await category.create({ name: name });
    return newCategory;
  }

  // 카테고리 수정
  async update(name, newName) {
    const updateCategory = await category
      .findOneAndUpdate({ name: name }, { name: newName }, { new: true })
      .populate('products');
    return updateCategory;
  }

  // 카테고리 삭제
  async delete(name) {
    const deleteCategory = await category.deleteOne({ name });
    return deleteCategory;
  }

  // 카테고리 전체 찾기
  async findAll() {
    const findAllCategory = await category.find({}).populate('products');
    return findAllCategory;
  }

  // 카테고리 id 로 이름 찾기
  async findName(id) {
    const findNameById = await category.findById(id);
    const name = findNameById.name;
    return name;
  }
}

const categoryModel = new CategoryModel();
export { categoryModel };
