import { Schema,model } from "mongoose";
import { Resturant } from "../../../entities/resturant";


const resturantSchema = new Schema<Resturant>({
    name: { type: String},
    rating: {type: Number},
    views: {type: Number},
    address: {type: String},
    phoneNo:{type:String},
    location: {
        type: {
          type: String,
          enum: ['Point'], // Only allow 'Point' as the type
        },
        coordinates: {
          type: [Number]
        },
      },
      status:{type:String},
      timing:{type:[String]},
      photos:{type:[String]},
      limitReached:{type:Boolean},
      maxOrdersPerMonth:{type:Number},
      featured:{type:Boolean},
      plan:{type:Number}
    
    });
    
    export const ResturantModel = model<Resturant>('Resturant', resturantSchema);