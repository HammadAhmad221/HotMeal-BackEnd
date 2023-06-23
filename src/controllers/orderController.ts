import { OrderService } from "../services/order.service";
import { Body, Controller, Post, Route } from "tsoa";
import { Types } from "mongoose";
import { Inject } from "typescript-ioc";

@Route("/order")
export class OrderController extends Controller {
  @Inject private orderService?: OrderService;

  @Post("/addorder")
  public async addResturant(@Body() request: { resturantId: Types.ObjectId }): Promise<any> {
    return this.orderService?.addOrder(request.resturantId);
  }
}
