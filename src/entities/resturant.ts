/*import { IResturant } from "../models/resturant.model";
export class Resturant implements IResturant{
    name: string;
    rating: number;
    views: number;
    description: string;
    address: string;
    timings:string[];
    phoneNo:number;
    latitude:number;
    longitude:number;
    radius:number;
    

    constructor(jsonObject:IResturant){
        this.name=jsonObject.name ?? '';
        this.rating=jsonObject.rating ?? 0;
        this.views=jsonObject.views ?? 0;
        this.description=jsonObject.description ?? '';
        this.address=jsonObject.address ?? '';
        this.timings=jsonObject.timings ?? [];
        this.phoneNo=jsonObject.phoneNo ?? 0;
        this.longitude=jsonObject.longitude ?? 0;
        this.latitude=jsonObject.latitude ?? 0;
        this.radius=jsonObject.radius ?? 0;
    }
    
    
}*/
import { IResturant } from "../models/resturant.model";

export class Resturant implements IResturant {
  name: string;
  rating: number;
  views: number;
  description: string;
  address: string;
  timings: string[];
  phoneNo: number;
  location: {
    type: string;
    coordinates: number[];
  };
  radius: number;

  constructor(jsonObject: IResturant) {
    this.name = jsonObject.name ?? '';
    this.rating = jsonObject.rating ?? 0;
    this.views = jsonObject.views ?? 0;
    this.description = jsonObject.description ?? '';
    this.address = jsonObject.address ?? '';
    this.timings = jsonObject.timings ?? [];
    this.phoneNo = jsonObject.phoneNo ?? 0;
    this.location = jsonObject.location ?? { type: 'Point', coordinates: [] };
    this.radius = jsonObject.radius ?? 0;
  }
}



