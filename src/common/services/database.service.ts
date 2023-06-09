
import {Inject, Singleton} from 'typescript-ioc';
import { MongodbService } from '../../database/mongodb/mongodb.service';
import { ResturantModel } from '../../database/mongodb/schema/resturant';
import { Resturant } from '../../entities/resturant';

@Singleton
export class DatabaseService{

  constructor(@Inject private mongodbService:MongodbService){}

   async connectToDB():Promise<void>{
        await this.mongodbService?.connect();
    } 

   async disconnectDB():Promise<void>{
    await this.mongodbService?.disconnect();
    
    }



    createResturant(resturant:Resturant):Promise<any>{
      return new Promise(async(resolve,reject)=>{
        try{
        let response=await ResturantModel.create(resturant);
        resolve(response);
        }catch(error){
          reject(error);
        }
      })
    }


    
}
