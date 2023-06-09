import bodyParser from 'body-parser';
import cors from 'cors';
// import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
 


export function setupMiddlewares(app:any){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use(cors());
    
    // app.use(helmet());
    
    app.use(morgan('combined'));
    
    app.use(compression());
    
  //  app.use(expressAuthentication);

  
    
    
}
