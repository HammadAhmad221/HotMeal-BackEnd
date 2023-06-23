import { Schema,model } from "mongoose";
import { Order } from "../../../entities/order";


const orderSchema = new Schema<Order>({
resturantId: {type: Schema.Types.ObjectId,ref:"Resturant"},
created:{type:Date,default:new Date()}
});

export const OrderModel = model<Order>('Order', orderSchema);