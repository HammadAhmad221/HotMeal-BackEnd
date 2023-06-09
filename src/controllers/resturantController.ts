
import { ResturantService } from "../services/resturant.service";
import {Body,Controller,Post,Route} from "tsoa";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";



   
  
  @Route("/resturants")
  export class RestorentController extends Controller {
    
    @Inject 
    private resturentService?:ResturantService;
    

    @Post('/addresturant')
    public async addResturant(@Body() request: IResturantRequest): Promise<any> {
      return this.resturentService?.addResturant(request);
    }

    @Post('/getnearbyresturants')
    public async getPlacesWithinRadius(@Body() request:IResturantRequest): Promise<any> {
      return this.resturentService?.getPlacesWithinRadius(request);
    }

    
  }

  
