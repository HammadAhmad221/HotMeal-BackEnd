import { OrderService } from "../services/order.service";
import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { Types } from "mongoose";
import { Inject } from "typescript-ioc";

@Route("/order")
export class OrderController extends Controller {
  @Inject private orderService?: OrderService;

  @Post("/addorder")
  public async addOrder(@Body() request: { resturantId: Types.ObjectId }): Promise<any> {
    return this.orderService?.addOrder(request.resturantId);
  }



  @Get("/allOrders")
  public async getAllOrders(@Query() page: number): Promise<any> {
    
    return this.orderService?.getAllOrders(page);
  }

}
