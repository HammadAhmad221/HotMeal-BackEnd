import  app  from "./Application/app";
import {Container} from 'typescript-ioc';
import { DatabaseService } from "./common/services/database.service";


const port = process.env.PORT || 3000;

const databaseService:DatabaseService=Container.get(DatabaseService);

databaseService.connectToDB();

/*const { MongoClient } = require('mongodb');

async function createGeospatialIndex() {
  const uri = 'mongodb://127.0.0.1:27017'; // Update with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('hotmeal'); // Replace with your database name
    const collection = db.collection('resturants'); // Replace with your collection name

    // Create the geospatial index on the 'location' field
    await collection.createIndex({ location: '2dsphere' });

    console.log('Geospatial index created successfully.');
  } catch (error) {
    console.error('Error occurred while creating the geospatial index:', error);
  } finally {
    await client.close();
  }
}

createGeospatialIndex();*/




/*const path = require('path');
// const fs = require('fs');
const { MongoClient } = require('mongodb');

async function createGeospatialIndex() {
  const uri = process.env.NODE_ENV=='production'?process.env.MONGODB_URI_PROD:process.env.MONGODB_URI_STAGE;
  const certificate = path.resolve("security/rds-combined-ca-bundle.pem");
  const client = new MongoClient(uri, {
    sslCA: certificate
  });

  try {
    await client.connect();
    const db = client.db('hotmeal');
    const collection = db.collection('resturants');

    await collection.createIndex({ location: '2dsphere' });

    console.log('Geospatial index created successfully.');
  } catch (error) {
    console.error('Error occurred while creating the geospatial index:', error);
  } finally {
    await client.close();
  }
}

createGeospatialIndex();*/




app.listen(port, () =>
  console.log(`CodeRefs listening at http://localhost:${port}`)
);
