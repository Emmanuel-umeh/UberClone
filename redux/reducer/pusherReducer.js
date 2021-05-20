import {
    
    PUSHER_AUTH,
    USER_RIDE_CHANNEL,
    AVAILABLE_DRIVERS
  } from "../action/types";
  
  import { Dimensions } from "react-native";
  import { AnimatedRegion } from "react-native-maps";
  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;
  const ASPECT_RATIO = WIDTH / HEIGHT;
  const LATITUDE_DELTA =    0.005858723958820065//Very high zoom level
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
 
  
  const initialState = {

  
  // redux details
  
  
    available_drivers_channel : null,
    user_ride_channel : null,
    pusher: null

  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
    
      
      case PUSHER_AUTH:{
       
        // console.log("pusher authenticated !!!",  action.payload)
        return {
          ...state,
         pusher:  action.payload,
      
          type:  action.type,
        };
      }
  
      case AVAILABLE_DRIVERS:{
       
        // console.log("pusher drivers !!!",  action.payload)
        return {
          ...state,
          available_drivers_channel:  action.payload,
      
          type:  action.type,
        };
      }
  
      case USER_RIDE_CHANNEL:{
       
        // console.log("pusher user ride channel !!!",  action.payload)
        return {
          ...state,
          user_ride_channel:  action.payload,
      
          type:  action.type,
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
  