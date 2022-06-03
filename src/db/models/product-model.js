import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';





const productModel = model('products', ProductSchema);

export { productModel};