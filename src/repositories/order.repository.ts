import { Order } from "../entities/order";
import { DatabaseService } from "../common/services/database.service";
import { Inject } from "typescript-ioc";
import { Types } from "mongoose";

export class OrderRepository {
  constructor(@Inject private databaseService: DatabaseService) {}

  addOrder(resturantId: Types.ObjectId): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const orderModel = {
        resturantId,
        created: new Date()
      };
      const order = new Order(orderModel);

      try {        
        const createdOrder = await this.databaseService.createOrder(order);
        resolve(createdOrder);
      } catch (error) {
        console.log("Create model error:", error);
        reject("Could not place order");
      }
    });
  }
}
