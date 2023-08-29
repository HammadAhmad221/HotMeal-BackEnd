
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
/////////////////////////////Count Orders with resturant Id///////////////////////////
    // async countOrdersByRestaurantId(resturantId: string): Promise<number> {
    //   try {
    //     const orderCount = await OrderModel.countDocuments({ resturantId:resturantId });
    //     console.log(orderCount);
    //     return orderCount;
    
    //   } catch (error) {
    //     throw new Error('Internal server error');
    //   }
    // }

//////////////////get all resturants from db///////////////////////
    // async getAllResturantsFromDb(): Promise<any> {
    //   try {
    //     const allRestaurants = await ResturantModel.find();
    //     return allRestaurants;
    //   } catch (error) {
    //     console.log(error);
    //     throw new Error('Internal server error');
    //   }
    // }
/////////////get all resturants from db with pagination///////////////////
    async getAllRestaurantsFromDb(page: number): Promise<any> {
      try {
        const pageSize=10;
        const skip = (page - 1) * pageSize;
        const allRestaurants = await ResturantModel.find()
          .skip(skip)
          .limit(pageSize);
        return allRestaurants;
      } catch (error) {
        throw new Error('Internal server error');
      }
    }
//////////////get all orders from db with pagination//////////////////////

async getAllOrdersFromDb(page: number): Promise<any> {
  const pageSize=10;
  try {
    const skip = (page - 1) * pageSize;
    const allOrders = await OrderModel.find()
      .populate('resturantId', 'name')
      .skip(skip)
      .limit(pageSize);
    return allOrders;
  } catch (error) {
    throw new Error('Internal server error');
  }
}
//////////////////////total resturants count//////////////////////////
public async getTotalRestaurantCount(): Promise<number> {
  try {
    const totalCount = await ResturantModel.countDocuments();
    // console.log('total resturants',totalCount);
    return totalCount;
  } catch (error) {
    throw new Error('Internal server error');
  }
}
////////////////////total order count//////////////////////////////
    async countTotalOrders(): Promise<number> {
      try {
        const orderCount = await OrderModel.countDocuments();
        // console.log('total orders',orderCount);
        return orderCount;
    
      } catch (error) {
        throw new Error('Internal server error');
      }
    }
/////////////////get todays order count//////////////////////
async getTodaysOrderCount(): Promise<number> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderCount = await OrderModel.countDocuments({
      created: { $gte: today },
    });
      // console.log('today order count',orderCount);
    return orderCount;
  } catch (error) {
    throw new Error("Internal server error");
  }
}
/////////////count of restaurants reached orders limit//////////////////////
async getRestaurantsReachedOrdersLimit(): Promise<number> {
  try {
    const restaurantsReachedLimit = await ResturantModel.countDocuments({
      limitReached: true,
    });
// console.log('resturants with limit reached',restaurantsReachedLimit);
    return restaurantsReachedLimit;
  } catch (error) {
    throw new Error("Internal server error");
  }
}
///////////////////order count of resturants with highest orders//////////////////////
async getRestaurantWithHighestOrders(): Promise<number> {
  try {
    const restaurantsWithOrders = await OrderModel.aggregate([
      { $group: { _id: "$resturantId", orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
    ]);

    const maxOrderCount = restaurantsWithOrders.length > 0 ? restaurantsWithOrders[0].orderCount : 0;
// console.log('Resturants Max Order Count',maxOrderCount);
    return maxOrderCount;
  } catch (error) {
    throw new Error("Internal server error");
  }
}
/////////////////Most Orders location area///////////////////
  async getAreaWithMostOrders(): Promise<number[] | null> {
    try {
      const areasWithOrders = await OrderModel.aggregate([
        {
          $lookup: {
            from: 'resturants',
            localField: 'resturantId',
            foreignField: '_id',
            as: 'restaurant',
          },
        },
        { $unwind: '$restaurant' },
        { $group: { _id: '$restaurant.location', orderCount: { $sum: 1 } } },
        { $sort: { orderCount: -1 } },
      ]);

      if (areasWithOrders.length > 0) {
        // console.log('Location of maximum orders',areasWithOrders[0]._id);
        return areasWithOrders[0]._id.coordinates;
      
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

}
