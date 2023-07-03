import ResponseBuilder from "../common/response.builder";
//import { IAddResturantResponse } from "../models/responses/addresturant.response";
import { ResturantRepository } from "../repositories/resturant.repository";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";
import AWS from 'aws-sdk';
import axios from 'axios';
import { Resturant } from "../entities/resturant";
import { ResturantModel } from "../database/mongodb/schema/resturant";
import { OrderModel } from "../database/mongodb/schema/order";
import { IGetAddressRequest } from "../models/requests/getAddress.request";
//import { OrderModel } from "../database/mongodb/schema/order";



export class ResturantService {
  constructor(
    @Inject private resturantRepository: ResturantRepository,
    @Inject private responseBuilder: ResponseBuilder
  ) {
   
  }

  /*async addResturant(request: IResturantRequest): Promise<any> {
    try {
      const resturant = await this.resturantRepository.addResturant(
        request.latitude,
        request.longitude
      );

      const addResturantResponse: IAddResturantResponse = {
          name: resturant.name,
          rating: resturant.rating,
          views: resturant.views,
          description: resturant.description,
          address: resturant.address,
          timings: resturant.timings,
          phoneNo: resturant.phoneNo,
          location: resturant.location,
          radius: resturant.radius,
          
      };

      return this.responseBuilder.successResponse(addResturantResponse);
    } catch (error) {
      return this.responseBuilder.errorResponse(error);
    }
  }*/

  async getPlaces(request:IResturantRequest): Promise<any> {
    try {
      const places = await this.resturantRepository.getNearbyResturantsfromDB(request);
      if(places.length===0){
        const places=await this.resturantRepository.getNearbyRestaurantsFromGoogle(request);
        return this.responseBuilder.successResponse(places);
      }else{  
      return this.responseBuilder.successResponse(places);}
    } catch (error) {
      return this.responseBuilder.errorResponse(error);
    }  
  }

  async uploadImageToS3(file: Express.Multer.File): Promise<any> {
    // Configure AWS SDK with your credentials and region
    AWS.config.update({
      accessKeyId: process.env.S3accessKeyId,
      secretAccessKey: process.env.S3secretAccessKey,
      region: 'us-west-2'
    });
  
    const s3 = new AWS.S3();
  
    const uploadParams = {
      Bucket: 'hotmeal',
      Key: file.originalname,
      Body: file.buffer,
      ACL: 'private'
    };
  
    try {
      const uploadResult = await s3.upload(uploadParams).promise();
      const imageUrl = uploadResult.Location;
      return this.responseBuilder.successResponse(imageUrl);
    } catch (error) {
      return this.responseBuilder.errorResponse(error);
    }
}




async getAddressFromCoordinates(coordinates:IGetAddressRequest): Promise<string> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const results = response.data.results;

    if (results.length > 0) {
      const address = results[0].formatted_address;
      return this.responseBuilder.successResponse(address);
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
return this.responseBuilder.errorResponse(error);
  }
}

async updateResturant(id: string, updates: Partial<Resturant>): Promise<any> {
  try {
    const updatedResturant = await ResturantModel.findByIdAndUpdate(id, updates, { new: true });
    return this.responseBuilder.successResponse(updatedResturant);
  } catch (error) {
    return this.responseBuilder.errorResponse(error);
  }
}

/*public async searchRestaurants(filters: { limitReached?: boolean, featured?: boolean, start?: number, end?: number }): Promise<any> {
  try {
    let query = ResturantModel.find({});

    if (filters.limitReached !== undefined) {
      query = query.where('limitReached').equals(filters.limitReached);
    }

    if (filters.featured !== undefined) {
      query = query.where('featured').equals(filters.featured);
    }

    if (filters.start !== undefined && filters.end !== undefined) {
      query = query.skip(filters.start).limit(filters.end - filters.start + 1);
    }

    const records = await query.exec();
    return records;
  } catch (error) {
    throw new Error('Internal server error');
  } 
}*/
async searchRestaurants(filters: { limitReached?: boolean, featured?: boolean, start?: number, end?: number, maxOrders?: boolean }): Promise<any> {
  try {
    if (filters.maxOrders) {
      const restaurantsWithOrders = await OrderModel.aggregate([
        { $group: { _id: "$resturantId", orderCount: { $sum: 1 } } },
        { $sort: { orderCount: -1 } }
      ]);
//console.log(restaurantsWithOrders);
      const maxOrderCount = restaurantsWithOrders.length > 0 ? restaurantsWithOrders[0].orderCount : 0;
      //console.log(maxOrderCount);
      const restaurantIdsWithMaxOrders = restaurantsWithOrders
        .filter((restaurant: any) => restaurant.orderCount === maxOrderCount)
        .map((restaurant: any) => restaurant._id);
//console.log(restaurantIdsWithMaxOrders);
      const records = await ResturantModel.find({
       // ...filters,
        _id: { $in: restaurantIdsWithMaxOrders }
      });
//console.log(records);
      return records;
    } else {
      let query = ResturantModel.find({});

    if (filters.limitReached !== undefined) {
      query = query.where('limitReached').equals(filters.limitReached);
    }

    if (filters.featured !== undefined) {
      query = query.where('featured').equals(filters.featured);
    }

    if (filters.start !== undefined && filters.end !== undefined) {
      query = query.skip(filters.start).limit(filters.end - filters.start + 1);
    }

    const records = await query.exec();
    return records;
    }
  } catch (error) {
    throw new Error('Internal server error');
  }
}

/*async searchResturants(filters: { limitReached?: boolean, featured?: boolean }): Promise<any> {
  try {
    const restaurantsWithOrders = await OrderModel.aggregate([
      { $group: { _id: "$resturantId", orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } }
    ]);

    const restaurantIdsWithMaxOrders = restaurantsWithOrders.map((restaurant: any) => restaurant._id);

    const records = await ResturantModel.find({
      ...filters,
      _id: { $in: restaurantIdsWithMaxOrders }
    });

    return records;
  } catch (error) {
    throw new Error('Internal server error');
  } 
}*/



 




/*async countOrdersByRestaurantId(restaurantId: string): Promise<number> {
  try {
    const orderCount = await OrderModel.countDocuments({ restaurantId });
    return orderCount;
  } catch (error) {
    throw new Error('Internal server error');
  }
}*/

}
  



