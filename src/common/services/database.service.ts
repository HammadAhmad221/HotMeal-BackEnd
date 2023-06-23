
import {Inject, Singleton} from 'typescript-ioc';
import { MongodbService } from '../../database/mongodb/mongodb.service';
import { ResturantModel } from '../../database/mongodb/schema/resturant';
import { Resturant } from '../../entities/resturant';
import { Order } from '../../entities/order';
import { OrderModel } from '../../database/mongodb/schema/order';

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

    createOrder(order:Order):Promise<any>{
      return new Promise(async(resolve,reject)=>{
        try{
        let response=await OrderModel.create(order);
        resolve(response);
        }catch(error){
          reject(error);
        }
      })
    }

    async countOrdersByRestaurantId(resturantId: string): Promise<number> {
      try {
        const orderCount = await OrderModel.countDocuments({ resturantId:resturantId });
        console.log(orderCount);
        return orderCount;
    
      } catch (error) {
        throw new Error('Internal server error');
      }
    }

}
