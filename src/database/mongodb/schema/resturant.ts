import { Schema,model } from "mongoose";
import { Resturant } from "../../../entities/resturant";


const resturantSchema = new Schema<Resturant>({
    name: { type: String ,required:true },
    rating: {type: Number},
    views: {type: Number},
    description: {type: String},
    address: {type: String, required:true},
    timings:{type: []},
    phoneNo:{type:Number},
    location: {
        type: {
          type: String,
          enum: ['Point'], // Only allow 'Point' as the type
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    radius:{type:Number},
    });
    
    export const ResturantModel = model<Resturant>('Resturant', resturantSchema);