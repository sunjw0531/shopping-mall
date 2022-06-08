// import { model } from 'mongoose';
// import { ProductSchema } from '../schemas/product-schema';

// const productModel = model('products', ProductSchema);

// export { productModel };
// /////////////////////////////////////////////////////////////
import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
	// 상품 전체 검색 (카테고리 기준)
	async findAllByCategory(category) {
		const products = await Product.find({ category: category }).populate(
			'category',
		);
		return products;
	}
	// 상품 하나 찾기 (product_id로 상세)
	async findDetailById(product_id) {
		const product = await Product.findOne({ _id: product_id }).populate(
			'category',
		);
		return product;
	}
	// 상품 하나 찾기 (product_id로 )
	async findOne(product_id) {
		const product = await Product.findOne({ product_id: product_id });
		return product;
	}

	// 상품 추가 (객체로 받기)
	async create(dataObject) {
		const newProduct = await Product.create(dataObject);
		return newProduct;
	}
	// 상품 삭제
	async delete(product_id) {
		const deleteProduct = await Product.deleteOne({
			product_id: product_id,
		}).populate('category');
		return deleteProduct;
	}
	// 상품 수정
	async update(product_id, dataObject) {
		const updateProduct = await Product.findOneAndUpdate(
			{ product_id: product_id },
			dataObject,
		).populate('category');
		return updateProduct;
	}

	// order model 생성 시 product의 재고 차감 (주문 상품의 id, volume을 받음)
	async updateStorage(productData) {
		const productStorage = await Product.findById(productData.productId);
		const newStorage = productStorage.storage - productData.volume;
		await Product.findByIdAndUpdate(productData.productId, {
			storage: newStorage,
		});
		return;
	}
}

const productModel = new ProductModel();
export { productModel };
