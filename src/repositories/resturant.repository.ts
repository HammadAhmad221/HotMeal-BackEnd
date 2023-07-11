import { DatabaseService } from "../common/services/database.service";
import { Inject } from "typescript-ioc";
import { IResturantRequest } from "../models/requests/resturant.request";
import axios from "axios";
import AWS from "aws-sdk";
import path from "path";
 // Update the path if necessary

const { MongoClient } = require("mongodb");

export class ResturantRepository {
  //////Add a resturant in db
  constructor(@Inject private databaseService: DatabaseService) {}

  addResturant(latitude: number, longitude: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let resturantModel = {
        name: "Lounge 37",
        rating: 4.4,
        views: 310,
        address:
          " PIA Main Boulevard, Block B3 Block B 3 Phase 1 Johar Town, Lahore, Pun…",
        phoneNo: "3224678664",
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        status: "",
        timing: [""],
        photos: [''],
        limitReached: true,
        maxOrdersPerMonth: 10,
        featured: true,
        plan: 100,
      };
      try {
        let createdResturant = await this.databaseService.createResturant(
          resturantModel
        );

        resolve(createdResturant);
      } catch (error) {
        console.log("Create model error:", error);
        if (error.hasOwnProperty("code") && error.code == 11000) {
          reject("User already exists with this email");
        } else {
          reject("Could not create user");
        }
      }
    });
  }

  ////////finding nearby resturants from db on the basis of lat and lng old and working version
  //"mongodb://127.0.0.1:27017"
  async getNearbyResturantsfromDB(request: IResturantRequest) {
    //const uri = process.env.MONGODB_URI_STAGE; // Update with your MongoDB connection string
    //const client = new MongoClient(uri);

    const uri = process.env.NODE_ENV=='production'?process.env.MONGODB_URI_PROD:process.env.MONGODB_URI_STAGE;
  const certificate = path.resolve("security/rds-combined-ca-bundle.pem");
  const client = new MongoClient(uri, {
    sslCA: certificate
  });

    try {
      await client.connect();
      const db = client.db("hotmeal"); // Replace with your database name
      const collection = db.collection("resturants"); // Replace with your collection name

      // Perform the geospatial query
      const result = await collection
        .find({
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [request.longitude, request.latitude], // Note the order: [longitude, latitude]
              },
              $maxDistance: 2000,
            },
          },
        })
        .toArray();
      return result;
    } catch (error) {
      console.error("Error occurred while retrieving data:", error);
    } finally {
      await client.close();
    }
  }
  
  
  /////////////upload imagewithlinktoS3
  async uploadImageWithLinkToS3(imageLink: string): Promise<any> {
    // Configure AWS SDK with your credentials and region
    AWS.config.update({
      accessKeyId: process.env.S3accessKeyId,
      secretAccessKey: process.env.S3secretAccessKey,
      region: 'us-west-2'
    });
  
    const s3 = new AWS.S3();
  
    try {
      // Fetch the image from the provided link
      const response = await axios.get(imageLink, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
  
   // Generate a timestamp
   const timestamp = Date.now();
  
      const uploadParams = {
        Bucket: 'hotmeal',
        Key: `image_${timestamp}.jpg`, // Set the desired key or use the original filename from the link
        Body: imageBuffer,
        ACL: 'private'
      };
  
      await s3.upload(uploadParams).promise();
      return uploadParams.Key;
    } catch (error) {
      return error;
    }
  }
  /////////////get resturants from google places
  async getNearbyRestaurantsFromGoogle(
    request: IResturantRequest
  ): Promise<any[]> {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const radius = 2000; // Specify the radius in meters

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${request.latitude},${request.longitude}&radius=${radius}&type=restaurant&key=${apiKey}`;

      const response = await axios.get(url);
      const restaurants = response.data.results;

      const placeId = restaurants.map(
        (restaurantData) => restaurantData.place_id
      );
      const restaurantInfo = await this.getRestaurantInfoFromGoogle(placeId);
      
      for (const restaurantData of restaurantInfo) {
        try {
          const mappedData = {
            name: restaurantData.name,
            rating: restaurantData.rating,
            views: restaurantData.user_ratings_total,
            address: restaurantData.formatted_address,
            phoneNo: restaurantData.formatted_phone_number,
            location: {
              type: "Point",
              coordinates: [
                restaurantData.geometry.location.lng,
                restaurantData.geometry.location.lat,
              ],
            },
            status: restaurantData.business_status,
            //timing: restaurantData.current_opening_hours.weekday_text,
            timing: restaurantData.current_opening_hours ? restaurantData.current_opening_hours.weekday_text : [],
            //photos: restaurantData.photos[0].photo_reference,
           // photos: restaurantData.photos.map((photo) => photo.photo_reference),
           photos: restaurantData.photos ? restaurantData.photos.map((photo) => photo.photo_reference) : [],
            featured:request.featured,
            plan:request.plan,
            limitReached:false,
            maxOrdersPerMonth:request.maxOrdersPerMonth
            
          };
          /*for(let url of mappedData.photos){
          try {
          const Link =`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${url}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
          //console.log(Link);
        await this.uploadImageWithLinkToS3(Link);

          //console.log("photo is saved:",Link);
          } catch (error) {
            console.error("Error occured while uploading to S3:",error);
          }
        }*/
        const uploadPromises = mappedData.photos.map((photo) => {
          const link = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
          return this.uploadImageWithLinkToS3(link);
        });

        const uploadedKeys =await Promise.all(uploadPromises);
        mappedData.photos = uploadedKeys;
        //console.log(mappedData);
       this.databaseService.createResturant(mappedData);
        } catch (error) {
          console.error("Error occurred while saving a restaurant:", error);
        }
      }
      //console.log(restaurantInfo);
      return restaurantInfo;
    } catch (error) {
      console.error("Error occurred while fetching nearby restaurants:", error);
      return [];
    }
  }
  /////getting resturants info from place ids
  async getRestaurantInfoFromGoogle(placeIds: string[]): Promise<any[]> {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const restaurantPromises = placeIds.map(async (placeId) => {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
        const response = await axios.get(url);
        return response.data.result;
      });

      const restaurantInfo = await Promise.all(restaurantPromises);
      return restaurantInfo;
    } catch (error) {
      console.error(
        "Error occurred while fetching restaurant information:",
        error
      );
      return [];
    }
  }
}
