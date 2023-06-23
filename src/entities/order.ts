
import { Types } from "mongoose";
import moment from 'moment';
import { IOrder } from "../models/order.model";

export class Order implements IOrder {
  
  resturantId: Types.ObjectId | null;
  created: Date;


  constructor(jsonObject: IOrder) {
    this.resturantId = jsonObject.resturantId ?? null;
    this.created = jsonObject.created ?? moment().utc().toDate();

  }
}



