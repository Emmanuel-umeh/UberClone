import {
  MAKE_ORDER,
  RIDE_ACCEPTED,
  RIDE_STARTED,
  RIDE_COMPLETED,
  RIDE_ENDED,
  RIDE_CANCELLED,
  FOUND_DRIVER,

  GET_LOCATION,
  DRIVER_LOCATION,
  HAS_RIDDEN,
  DESTINATION_CANCELLED,
  PRICE_UPDATED,
  SELECT_DESTINATION,
  SET_FETCHING,
  END_FETCHING,
 
  CLEAR_TYPE,
  SET_LOADING,
  END_LOADING,
  PUSHER_AUTH,
  RIDE_UPDATED,
  DESTINATION,
  LOGISTIC_TYPE,
  COORDINATE_DRIVER_LOCATION,
  CANCEL_ORDER,
  GET_ORDER,
  DRIVER_HEADING,
  CONFIRM_LOCATION,
  PURGE,
  SET_PRICE,
  ORDER_UPDATED,
  ORDER_CANCELLED
} from "../action/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Dimensions } from "react-native";
import { AnimatedRegion } from "react-native-maps";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const LATITUDE_DELTA =  0.005858723958820065;
const LONGITUDE_DELTA =  0.005858723958820065;


const initialState = {
  current_order: null,
  type: "",

  region: {
    latitude  : 9.0765,
    longitude : 7.3986,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  },
  
  // destination : ""
  address: null,
  addressShortName: null,
  location: null,
  error: null,
  has_ride: false,
  destination: null,
  driver: null,
  origin: null,
  // loader when the user is searching for a ride
  is_searching: false,
  is_fetching : false,
  // price of ride
  price: 67,

  logistic_type : null,
  //  auth_msg_details : null


// state details
my_location: null,
// location accuracy
accuracy : null,

// drivers coordinate
coordinate: null ,


driver_location: null,

my_address : null










};

export default function (state = initialState, action) {
  switch (action.type) {
    
// when user is searching for driver loader
    case SET_LOADING: {
      return {
        ...state,
        is_searching: true,
      };
    }
    case END_LOADING: {
      return {
        ...state,
        is_searching: false,
      };
    }

    // end


    case SET_PRICE: {
      
      console.log("price!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", Number(action.payload));
      return {
        ...state,
        price: Number(action.payload),
      };
    }

    case ORDER_UPDATED: {
      return {
        ...state,
        current_order : action.payload,
      };
    }
    case ORDER_CANCELLED: {
      return {
        ...state,
        current_order : null,
      };
    }

    // loader when making requuests to endpoints
    case SET_FETCHING: {
      return {
        ...state,
        is_fetching: true,
      };
    }
    case END_FETCHING: {
      return {
        ...state,
        is_fetching: false,
      };
    }

    

    case CLEAR_TYPE: {
      return {
        // ...state,
        type: "",
      };
    }

    case MAKE_ORDER:
      {
      
      return {
        ...state,
        current_order: action.payload,
        type: action.type,
      };

      }
      
    case RIDE_ACCEPTED:{
      return {
        ...state,
        is_searching: false,
        order: action.payload,
        type: "RIDE_ACCEPTED",
      };
    }
     

    case RIDE_STARTED:
      {
        return {
          ...state,
          //   is_searching: false,
          order: action.payload,
          type: "RIDE_STARTED",
        };
  
      }
      
    case RIDE_COMPLETED:
      {
        return {
          ...state,
          current_order: null,
          
          // destination : ""
          address: null,
          addressShortName: null,
          location: null,
          error: null,
          has_ride: false,
          destination: null,
          driver: null,
          origin: null,
          // loader when the user is searching for a ride
          is_searching: false,
          is_fetching : false,
         
        
          logistic_type : null,
          //  auth_msg_details : null
        
        // drivers coordinate
        coordinate: null ,
        
        
        driver_location: null,
        
        
        
          type: action.type,
        };
      }


    case RIDE_ENDED:{
      return {
        ...state,
        //   is_searching: false,
        order: action.payload,
        type: "RIDE_ENDED",
      };
    }
  

    case FOUND_DRIVER:{

      return {
        ...state,
        type: "FOUND_DRIVER",
      };
    }
     
    case DRIVER_HEADING:{

  
      return {
       
      ...state, 
          driver : {
          ...state.driver,
          heading : action.payload}
        
      
      };
    }
     

    case GET_LOCATION:
      {
        const { region, address, addressShortName,accuracy,
          // this is the logged in users address gptyten with expo location
        my_address 
        } = action.payload;

        return {
          ...state,
          accuracy : accuracy ? accuracy : state.accuracy,
          region: region ? region : state.region,
          address: address ? address : state.address,
          addressShortName: addressShortName ? addressShortName : state.addressShortName ,

          my_address : my_address
        };
      }


    case DRIVER_LOCATION:

      {
        const { location, driver } = action.payload;
        return {
          ...state,
          location: location,
          driver: driver,
          type: "DRIVER_LOCATION",
        };
      }
   

    case HAS_RIDDEN:{
      return {
        ...state,
        has_ridden: true,
        type: "HAS_RIDDEN",
      };
    }
      
    case SELECT_DESTINATION:
      {
        const {
          going,
          from,
          destinationRequested,
          latitudeDelta,
        } = action.payload;
        console.log("redux from!!!!!!!!!!!!!!!!!!!", from)

        if(from){

          return {
            ...state,
            going: going,
            // value to show that user is making a pickup order from a different location and not present location
            fromChanged : true,
            region : {
              // ...region,
              latitude : from.latitude,
              longitude : from.longitude,
           
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
  
  
            },
            destinationRequested: destinationRequested,
            latitudeDelta: latitudeDelta,
            type: action.type,
          };
        }else{
          return {
            ...state,
            going: going,
            fromChanged : false,
          
            destinationRequested: destinationRequested,
            latitudeDelta: latitudeDelta,
            type: action.type,
          };
          }
        
      
      }
     
    case DESTINATION_CANCELLED:
      {
        return {
          ...state,
          destinationRequested: false,
          fromChanged  :false,
          going : null,
      
          type: "DESTINATION_CANCELLED",
        };
      }
    
    case GET_ORDER:
      {
        return {
          ...state,
          current_order : action.payload,
      
          type: action.type,
        };
      }
    
    
    // case PRICE_UPDATED:{
    //   const price = action.payload
    //   console.log("redux price !!!", price)
    //   return {
    //     ...state,
    //    price: price,
    
    //     type: "PRICE_UPDATED",
    //   };
    // }
    
    case RIDE_UPDATED:{
      return {
        ...state,
        current_order: action.payload,
    
        type: action.type,
      };
    }
    case DESTINATION:{
      return {
        ...state,
       destination: action.payload,
    
        type: action.type,
      };
    }
    case LOGISTIC_TYPE:{
      return {
        ...state,
       logistic_type: action.payload,
    
        type: action.type,
      };
    }
    case COORDINATE_DRIVER_LOCATION:{

   
      return {
        ...state,
       coordinate: action.payload,
        type: action.type,
      };
    }
    case CONFIRM_LOCATION:{
      return {
        ...state,
       region: action.payload.region,
       my_address : action.payload.address_name,
     
        type: action.type,
      };
    }
    case CANCEL_ORDER:{
      return {
        ...state,
        current_order: null,
    
      
        coming: null,
        going: null,
      
        // name of the destination / going
        // determines if the user has selected the destination
        destinationRequested: false,
        
        // destination : ""
        address: null,
        addressShortName: null,
        location: null,
        error: null,
        has_ride: false,
        destination: null,
        driver: null,
   
        is_searching: false,
        has_ridden: false,
        totalPriceVisible: false,
        is_fetching : false,
          
      
        // name of the accepted driver
        driver_details: null,
        // logistic_type : null,
        //  auth_msg_details : null
      
      
      // state details
      my_location: null,
     
      distance: null,
      time_distance : null,
      
      fromChanged : false,
          
      // my_address : null

      
      
        type: action.type,
      };
    }


    
case PURGE:

  
  return {
    current_order: null,
    type: "",
  
    region: state.region,
  
    coming: null,
    going: null,
  
    // name of the destination / going
    // determines if the user has selected the destination
    destinationRequested: false,
    
    // destination : ""
    address: null,
    addressShortName: null,
    location: null,
    error: null,
    has_ride: false,
    destination: null,
    driver: null,
    origin: null,
    // loader when the user is searching for a ride
    is_searching: false,
    has_ridden: false,
    totalPriceVisible: false,
    is_fetching : false,

  
    // name of the accepted driver
    driver_details: null,
    logistic_type : null,
    //  auth_msg_details : null
  
  
  // state details
  my_location: null,
  
  driver_location: null,
  distance: null,
  // difference in time
  time_distance: null,
  
  
  
  fromChanged : false,
  
  
  my_address : state.my_address
  
  
  
  
  };



 


    default:
      return state;
  }
}
//  {

//     id:
//     "5e8af6ffacf76a00175c3228",
//     username: "goodness account",
//     email: "python@gmail.com", date: "2020-04-06T09:31:43.999Z"}
//  }

// user.username
// user.email
