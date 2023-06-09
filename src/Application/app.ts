import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import session from 'express-session';
import { RegisterRoutes } from "../../build/routes";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../build/swagger.json";
import { setupMiddlewares } from "./setup.middlewares";



const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET||'',
  resave: false,
  saveUninitialized: false
}));

 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

setupMiddlewares(app);
RegisterRoutes(app);



export default app;








