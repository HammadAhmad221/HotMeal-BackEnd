import ResponseBuilder from "../common/response.builder";
import { IAddResturantResponse } from "../models/responses/addresturant.response";
import { ResturantRepository } from "../repositories/resturant.repository";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";
import AWS from 'aws-sdk';
import axios from 'axios';
import { Resturant } from "../entities/resturant";
import { ResturantModel } from "../database/mongodb/schema/resturant";



export class ResturantService {
  constructor(
    @Inject private resturantRepository: ResturantRepository,
    @Inject private responseBuilder: ResponseBuilder
  ) {
   
  }

  async addResturant(request: IResturantRequest): Promise<any> {
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
  }

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




async getAddressFromCoordinates(coordinates:IResturantRequest): Promise<string> {
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
  }
  



