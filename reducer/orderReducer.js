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
  END_LOADING
} from "../action/types";
import AsyncStorage from "@react-native-community/async-storage";
import { isLoaded, isLoading } from "expo-font";
import { add } from "react-native-reanimated";
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
    latitude: 9.0765,
    longitude: 7.3986,
    latitudeDelta: 0.992,
    longitudeDelta: 0.0421,

    // destination the user is going to
  },

  coming: null,
  going: null,
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
  is_searching: false,
  has_ridden: false,
  totalPriceVisible: false,
  is_fetching : false,
  // price of ride
  price: 0,

  // name of the accepted driver
  driverName: null,
  //  auth_msg_details : null
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
          ...state,
          //   is_searching: false,
          order: action.payload,
          type: "RIDE_COMPLETED",
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
      const {
        has_ride,
        is_searching,
        location,
        driver,
        driverName,
      } = action.payload
      return {
        ...state,
        //   is_searching: false,
        has_ride: has_ride,
        is_searching: is_searching,
        location: location,
        driver: driver,
        driverName: driverName,
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
