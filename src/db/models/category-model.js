import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';





const categoryModel = model('category', CategorySchema);

export { categoryModel };