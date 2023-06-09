import { Singleton } from "typescript-ioc";

@Singleton
export default class ResponseBuilder{

    successResponse(data?:any):any{
        if(data){
            return {success:true,data:data};
        } 
        return {success:true}; 
    }
    errorResponse(message:string):any{
        return {success:false,message:message};
    }
    invalidInputResponse():any{
        return {success:false,message:"Invalid input parameters"};
    }
    internalServerErrorResponse():any{
        return {success:false,message:"Internal server error"};
    }
}