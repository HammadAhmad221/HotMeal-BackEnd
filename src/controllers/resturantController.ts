import { ResturantService } from "../services/resturant.service";
import { Body, Controller, Path, Post, Get,  Route, UploadedFile, Query} from "tsoa";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";
import { Resturant } from "../entities/resturant";
import { IGetAddress } from "../models/requests/getaddress.request";



@Route("/resturants")
export class RestorentController extends Controller {
  @Inject
  private resturentService?: ResturantService;

  @Post("/addresturant")
  public async addResturant(@Body() request: IResturantRequest): Promise<any> {
    return this.resturentService?.addResturant(request);
  }

  @Post("/getnearbyresturants")
  public async getPlacesWithinRadius(
    @Body() request: IResturantRequest
  ): Promise<any> {
    return this.resturentService?.getPlaces(request);
  }
  @Post("/upload")
  public async uploadImage(
   @UploadedFile("image") file: Express.Multer.File
  ): Promise<string> {
    if (!file) {
      throw new Error("No image provided");
    }
    return await this.resturentService?.uploadImageToS3(file);
  }
  /*@Post('/uploadImage')
  public async uploadImageFromLink(
    @Query() imgLink: string
  ): Promise<any> {
    if (!imgLink) {
      throw new Error('No image link provided');
    }
  
    return await this.resturentService?.uploadImageWithLinkToS3(imgLink);
  }*/
  @Post('/address')
  public async getAdress(@Body() request:IGetAddress):Promise<any>{
return this.resturentService?.getAddressFromCoordinates(request);
  }
  @Post("/{id}/update")
  public async updateResturant(
    @Path() id: string,
    @Body() updates: Partial<Resturant>
  ): Promise<any> {
    return this.resturentService?.updateResturant(id, updates);
  }
  
  @Post("/search")
  public async searchResturants(
    @Body() filters: { limitReached?: boolean, featured?: boolean, start?: number, end?: number ,maxOrders?:boolean}
  ): Promise<any> {
    return this.resturentService?.searchRestaurants(filters);
  }

  @Get("/allResturants")
  public async getAllRestaurants(@Query() page: number,@Query() pageSize: number): Promise<any> {
    
    return this.resturentService?.getAllRestaurants(page,pageSize);
  }
  @Get("/stats")
  public async getRestaurantStatistics(): Promise<any> {
    return this.resturentService?.getRestaurantStatistics();
  }
}


