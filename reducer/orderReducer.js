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
  SET_USER_TOKEN,
  SET_LOADING,
  END_LOADING,
  PUSHER_AUTH,
  RIDE_UPDATED,
  DESTINATION,
  LOGISTIC_TYPE,
  COORDINATE_DRIVER_LOCATION,
  PURGE
} from "../action/types";
import AsyncStorage from "@react-native-community/async-storage";

import { Dimensions } from "react-native";
import { AnimatedRegion } from "react-native-maps";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const LATITUDE_DELTA =  0.005858723958820065;
const LONGITUDE_DELTA =  0.005858723958820065;


var token;

getToken = async () => {
  var value = await AsyncStorage.getItem("token");
  console.log("test value  !!!!!!!!!! ", value);
  token = value;
  return value;
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
    //   token  = await AsyncStorage.getItem("token")
    // alert(token)
    //   console.log(token)
  } catch (e) {
    // alert('Failed to save the data to the storage')
    console.log(e);
  }
};

const removeToken = async (token) => {
  try {
    await AsyncStorage.removeItem("token", token);
    //   token  = await AsyncStorage.getItem("token")
    // alert(token)
    //   console.log(token)
  } catch (e) {
    // alert('Failed to save the data to the storage')
    console.log(e);
  }
};

const saveOrder = async (id) => {
  try {
    await AsyncStorage.setItem("order_id", id);
    //   token  = await AsyncStorage.getItem("token")
    // alert(token)
    //   console.log(token)
  } catch (e) {
    // alert('Failed to save the data to the storage')
    console.log(e);
  }
};
// getToken();

const initialState = {
  token: token,
  order: null,
  type: "",

  region: {
    latitude  : 9.0765,
    longitude : 7.3986,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  },

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
  // price of ride
  price: 0,

  // name of the accepted driver
  driver_details: null,
  logistic_type : null,
  //  auth_msg_details : null


// state details
my_location: null,
coordinate: new AnimatedRegion({
  latitude: 9.0765,
  longitude: 7.3986,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
}),

driver_location: {
  latitude: 9.0765,
  longitude: 7.3986,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
},
distance: null,











};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }
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
        console.log("PAYLOAD FOR ORDER MADE ", action.payload);
        saveOrder(action.payload._id)
      return {
        ...state,
        is_searching: true,
        order: action.payload,
        type: "MAKE_ORDER",
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
          initialState
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

      console.log("driver found!!!!!!!!!!!!!!!!!!!! ", action.payload)
      const {
        has_ride,
        is_searching,
        location,
        driver,
        driver_details,
      } = action.payload
      return {
        ...state,
        //   is_searching: false,
        has_ride: has_ride,
        is_searching: is_searching,
        location: location,
        driver: driver,
        driver_details: driver_details,
        type: "FOUND_DRIVER",
      };
    }
     

    case GET_LOCATION:
      {
        const { region, address, addressShortName } = action.payload;
        return {
          ...state,
          region: region,
          address: address,
          addressShortName: addressShortName,
        };
      }


    case DRIVER_LOCATION:
      console.log("Driver location updatinmg!!!!!!!!!!")
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
          destinationRequested,
          latitudeDelta,
        } = action.payload;
        console.log("redux goimg!!!!!!!!!!!!!!!!!!!", going)
        return {
          ...state,
          going: going,
          destinationRequested: destinationRequested,
          latitudeDelta: latitudeDelta,
          type: "SELECT_DESTINATION",
        };
      }
     
    case DESTINATION_CANCELLED:
      {
        return {
          ...state,
          destinationRequested: false,
      
          type: "DESTINATION_CANCELLED",
        };
      }
    
    
    case PRICE_UPDATED:{
      const price = action.payload
      console.log("redux price !!!", price)
      return {
        ...state,
       price: price,
    
        type: "PRICE_UPDATED",
      };
    }
    
    case RIDE_UPDATED:{
      return {
        ...state,
       order: action.payload,
    
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
       coordinate: action.payload.coordinate,
       driver_location : action.payload.driver_location,
       distance : action.payload.distance,
    
        type: action.type,
      };
    }


    
case PURGE:
  // console.log("updating payload for user loaded ", action.payload);
  
  return {
    initialState
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
