import { Inject } from "typescript-ioc";
import { OrderRepository } from "../repositories/order.repository";
import ResponseBuilder from "../common/response.builder";
import { Types } from "mongoose";


export class OrderService {
    constructor(
      @Inject private orderRepository: OrderRepository,
      @Inject private responseBuilder: ResponseBuilder
    ) {}
  
    async addOrder(request: Types.ObjectId): Promise<any> {
      try {
        let addOrderResponse: any = await this.orderRepository.addOrder(request);
        return this.responseBuilder.successResponse(addOrderResponse);
      } catch (error) {
        return this.responseBuilder.errorResponse(error);
      }
    }

    async getAllOrders(page: number, pageSize: number): Promise<any> {
      try {
        const allOrders =await this.orderRepository.getAllOrders(page,pageSize);
        return this.responseBuilder.successResponse(allOrders);
      } catch (error) {
    return this.responseBuilder.errorResponse(error);
      }
    }
}