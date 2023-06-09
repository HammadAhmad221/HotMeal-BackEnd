/*import ResponseBuilder from "../common/response.builder";
import { IAddResturentResponse } from "../models/responses/addrestorent.response";
import {ResturantRepository} from "../repositories/resturant.repository";
import { Inject } from "typescript-ioc";
import { IAddResturantRequest } from "../models/requests/addresturant.request";

export class ResturantService {


    constructor(@Inject private resturantRepository: ResturantRepository, @Inject private responseBuilder: ResponseBuilder) {}

   async addResturant(request:IAddResturantRequest):Promise<any>{


        try{

        let addResturantResponse:any=await this.resturantRepository.addResturant(request.longitude,request.latitude,request.radius);


                let addRestorentResponse:IAddResturentResponse={
                    name: addResturantResponse.name,
                    rating: addResturantResponse.rating,
                    views: addResturantResponse.views,
                    description: addResturantResponse.description,
                    address: addResturantResponse.address,
                    timings:addResturantResponse.timings,
                    phoneNo:addResturantResponse.phoneNo,
                    longitude:addResturantResponse.longitude,
                    latitude:addResturantResponse.latitude,
                    radius:addResturantResponse.radius
                };

                return this.responseBuilder.successResponse(addRestorentResponse);
        }catch(error){
            return this.responseBuilder.errorResponse(error);
        }


    }

}*/
import ResponseBuilder from "../common/response.builder";
import { IAddResturantResponse } from "../models/responses/addresturant.response";
import { ResturantRepository } from "../repositories/resturant.repository";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";

export class ResturantService {

  constructor(
    @Inject private resturantRepository: ResturantRepository,
    @Inject private responseBuilder: ResponseBuilder
  ) {}

  async addResturant(request: IResturantRequest): Promise<any> {
    try {
      const resturant = await this.resturantRepository.addResturant(
        request.latitude,
        request.longitude,
        request.radius,
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

  async getPlacesWithinRadius(request:IResturantRequest): Promise<any> {
    try {
      const places = await this.resturantRepository.getPlacesWithinRadius(request);
      return this.responseBuilder.successResponse(places);
    } catch (error) {
      return this.responseBuilder.errorResponse(error);
    }
  }
}
