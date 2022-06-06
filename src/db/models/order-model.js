import { model } from 'mongoose';
import { orderedProductSchema, orderSchema } from '../schemas/order-schema';

const orderModel = model('order', orderSchema);
const orderedProductModel = model('orderedProduct', orderedProductSchema);

export { orderModel, orderedProductModel };
