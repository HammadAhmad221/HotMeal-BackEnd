import { DatabaseService } from "../common/services/database.service";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";
const { MongoClient } = require('mongodb');


export class ResturantRepository{

    
    constructor(@Inject private databaseService:DatabaseService){}


    addResturant(latitude:number,longitude:number,radius:number):Promise<any>{
        return new Promise(async (resolve,reject)=>{

            let resturantModel={
                
                name: 'Lounge 37',
                rating: 4.4,
                views: 310,
                description: 'A fine dining with royal ambience in unmatchable prices. Where quality…',
                address: ' PIA Main Boulevard, Block B3 Block B 3 Phase 1 Johar Town, Lahore, Pun…',
                timings:['12pm-12am by 7'],
                phoneNo:3224678664,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                  },
                radius:radius
                
            }
            try{
            let createdResturant=await this.databaseService.createResturant(resturantModel);

                resolve(createdResturant);

            }catch(error){
                console.log("Create model error:",error);
                if(error.hasOwnProperty("code") && error.code==11000){
                    reject("User already exists with this email");
                }else{
                    reject("Could not create user");
                }
            }

        });
    }



async  getPlacesWithinRadius(request:IResturantRequest) {
  const uri = 'mongodb://0.0.0.0:27017'; // Update with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('CheckingResturants'); // Replace with your database name
    const collection = db.collection('resturants'); // Replace with your collection name

    // Perform the geospatial query
    const result = await collection.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [request.longitude,request. latitude] // Note the order: [longitude, latitude]
          },
          $maxDistance: request.radius
        }
      }
    }).toArray();
    return result;
  } catch (error) {
    console.error('Error occurred while retrieving data:', error);
  } finally {
    await client.close();
  }
}

}
