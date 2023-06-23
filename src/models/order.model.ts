import { Types } from "mongoose";

export interface IOrder {
    resturantId: Types.ObjectId | null;
    created: Date;
  }
  
  