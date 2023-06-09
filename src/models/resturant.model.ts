  export interface IResturant {
    name: string;
    rating: number;
    views: number;
    description: string;
    address: string;
    timings: string[];
    phoneNo: number;
    location: {
      type: string;
      coordinates: number[];
    };
    radius: number;
  }
  
  