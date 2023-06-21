
import { IResturant } from "../models/resturant.model";

export class Resturant implements IResturant {
  
  name: string;
  rating: number;
  views: number;
  address: string;
  phoneNo: string;
  location: {
    type: string;
    coordinates: number[];
  };
  status:string;
  timing:string[];
  photos:string[];
  limitReached:boolean;
  maxOrdersPerMonth:number;
  featured:boolean;
  plan:number;

  constructor(jsonObject: IResturant) {
    this.status = jsonObject.status ?? '';
    this.name = jsonObject.name ?? '';
    this.rating = jsonObject.rating ?? 0;
    this.views = jsonObject.views ?? 0;
    this.address = jsonObject.address ?? '';
    this.phoneNo = jsonObject.phoneNo ?? 0;
    this.location = jsonObject.location ?? { type: 'Point' , coordinates: [] };
    this.timing=jsonObject.timing ?? [];
    this.photos=jsonObject.photos ?? [];
    this.limitReached=jsonObject.limitReached??true;
    this.maxOrdersPerMonth=jsonObject.maxOrdersPerMonth??null;
    this.featured=jsonObject.featured??false;
    this.plan=jsonObject.plan??null;

  }
}



