import axios from "axios";
import { returnErrors } from "./errorActions";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions } from "react-navigation";
import {MAKE_ORDER,RIDE_ACCEPTED,RIDE_STARTED,RIDE_COMPLETED,RIDE_ENDED,RIDE_CANCELLED,DESTINATION } from "./types";

import * as RootNavigation from "../rootNavigation";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";
// import AWN from "awesome-notifications"
import Pusher from "pusher-js/react-native";
// https://elesarrdevelopment.herokuapp.com/api/signupuser/all

// let notifier = new AWN
// var location = window.location.href
// if(location.slice(0,17)== 'http://localhost:' || "https://elesarr.he" || "http://elesarr.her"){
// axios.defaults.baseURL = 'https://whiteaxisapi.herokuapp.com';
axios.defaults.baseURL = "https://whiteaxisapi.herokuapp.com";
// }
// else if(location.slice(0,17)==  "http://127.0.0.1:"){
//   axios.defaults.baseURL = 'https://elesarrdevelopment.herokuapp.com';
// }
// else{
//   axios.defaults.baseURL = 'https://eles-api.herokuapp.com'
// }
//

var token;
// var orderID

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
    // token  = await AsyncStorage.getItem("token")
    // alert(token)
    console.log(token);
  } catch (e) {
    // alert('Failed to save the data to the storage')
    console.log(e);
  }
};

getToken = async () => {
  token = await AsyncStorage.getItem("token");
  console.log("redux action js ", token);

  // this.props.setUserToken(token)
  // token = token
  return token;
};



// save the orders ID
saveOrder = async (id) => {

  console.log("redux action js saving order id ", id);
 await AsyncStorage.saveItem("order_id", id);
 


};

// Get the orders ID
// getOrder = async () => {
//   orderID = await AsyncStorage.getItem("order_id");
//   console.log("redux action js ", orderID);

//   // this.props.setUserToken(token)
//   // token = token
//   return orderID;
// };


// Clear the orders ID
clearOrder = async () => {
   await AsyncStorage.removeItem("order_id");
  console.log("Cleared order successfully");

 
};


getToken();
// getOrder()
export const setUserToken = (token) => (dispatch) => {
  dispatch({
    type: SET_USER_TOKEN,
    payload: token,
  });
};

export const test_redux_promisify =()=>(dispatch)=>{

  // new Promise(function(resolve,reject){

    try {
  

      dispatch({
        type: "SET_FETCHING"
      })

      setTimeout(() => {

         
      dispatch({
        type: "END_FETCHING"
      })

        
      }, 4000);
      return Promise.resolve(true);
      
      // } else { // Otherwise display an error to the user
      //     await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
      //     dispatch(loginFailed("Incorrect email or password"))
      //     return Promise.resolve(false);
      // }
  } catch (err) { // When something goes wrong
      console.log(err)
      // dispatch(loginFailed("Something went wrong"));
      return Promise.reject()
  }
    

  // })
}

// BEGIN LOADING ANIMATON
export const setLoading = () => (dispatch, getState) => {
  dispatch({ type: SET_LOADING }); // dispatch user loading
};

// END LOADING ANIMATION
export const endLoading = () => (dispatch, getState) => {
  dispatch({ type: END_LOADING }); // dispatch user loading
};

// Make a request to be pikcked up
export const makeOrder = ({
  startLatitude,
  startLongitude,
//   startLocationName,

  endLongitude,
  endLatitude,
  trigger,
  userID,
  pickup,
  dropoff,

  payment_method,
  available_drivers_channel,

//   endLocationName,
  price,
}, tokens) => (dispatch) => {

    // trigger Loader
    dispatch({
      type : "SET_FETCHING"
    })
  console.log("token received ", tokens)
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token" : tokens
    },
  };

  // console.log("available drivers channel !!!!!!!!!!!!!!!!!!!!!!!!!!!", available_drivers_channel)


  const startLocationName = pickup.from_address
  const endLocationName = dropoff.going_address
  // REQUEST BODY
  const body = JSON.stringify({
       startLatitude,
    startLongitude,
    startLocationName,
  
    endLongitude,
    endLatitude,
  
    endLocationName,
    payment_method,
    price });

  // console.log("body recieved ", body);



console.log("making order!!!!!!!!!!!!!!!!!!!!!")
  axios
    .post(`/api/order/makeOrder`, body, config)
    .then(
      (res) => {
        //
        // endLoading()

        // sends the pusher trigger to available driver
      

        
        dispatch({
          type : MAKE_ORDER,
          payload : res.data
        })



        // console.log("response received for make order ", userID,pickup,dropoff, available_drivers_channel)
  // trigger()
  // save the users drop  off and pickup location to redux
  dispatch({
    type : DESTINATION,
    payload : dropoff.going_address
  })

  available_drivers_channel.trigger("client-driver-request", {
    userID,
    pickup: pickup,
    dropoff: dropoff,
    orderID : res.data._id
    // triggered : "Yes!"
  });


        // trigger pusher js
 
        dispatch({
          type : "END_FETCHING"
        })
      

      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      console.log("error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ", err);
      dispatch({
        type : "END_FETCHING"
      })
    
     return Notifier.showNotification({
        title: 'Create Order Error',
        description: err.response.data.msg ? err.response.data.msg : `Their was an error creating an order. Please try again`,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress : true
      });
    });
};


// cancel an order  and clkear from asyncstorage
export const cancelOrder = (tokens,orderID) => (dispatch) => {
  
  const config = {
    headers: {
      "Content-Type": "application/json",
  
      "x-auth-token" : tokens
    },
  };

  const body = {}

  dispatch({
    type : "SET_FETCHING"
  })
// dispatch({
//     type : "SET_LOADING"
//   })


  // REQUEST BODY
console.log("token linme 201!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", token)
  axios
    .post(`/api/order/cancel-order/${orderID}`, body, config)
    .then(
      (res) => {
        console.log("Cancelled order successfully")
    
        dispatch({
          type : "END_FETCHING"
        })
      // dispatch({
      //     type : "END_LOADING"
      //   })
      

        console.log("MESSAGE res ", res.data)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      console.log("error ", err);
      dispatch({
        type : "END_FETCHING"
      })
      // dispatch({
      //   type : "END_LOADING"
      // })
    
      Notifier.showNotification({
        title: 'Error',
        description: err.response.data.msg ? err.response.data.msg : `Could not cancel your order. Please check your internet connection`,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress : true
      });
    });
};
// get an order  and clkear from database
export const getOrder = (tokens,orderID) => async(dispatch) => {
  
  const config = {
    headers: {
      "Content-Type": "application/json",
  
      "x-auth-token" : tokens
    },
  };

  try {
    

    
  const response = await    axios
        .get(`/api/order/single_order/${orderID}`, config)

    
            dispatch({
              type: "GET_ORDER",
              payload: response.data
            })

            return response.data

  
      
  } catch (error) {
    return false
  }

 
};
export const cashless_payment = (tokens,orderID,user_ride_channel) => (dispatch) => {


  user_ride_channel.trigger("client-driver-paid",{
    paid:true
  })
        
  dispatch({
    type : "SET_FETCHING"
  })
  const config = {
    headers: {
      "Content-Type": "application/json",
  
      "x-auth-token" : tokens
    },
  };

  const body = {}


// dispatch({
//     type : "SET_LOADING"
//   })


  // REQUEST BODY
console.log("token linme 201!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", token)
  axios
    .post(`/api/order/cashless-payment/${orderID}`, body, config)
    .then(
      (res) => {
        console.log("Paid successfully")
      
        alert("Payment Successfull!")
        dispatch({
          type : "END_FETCHING"
        })
      // dispatch({
      //     type : "END_LOADING"
      //   })
      

        console.log("MESSAGE res ", res.data)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      console.log("error ", err);
      dispatch({
        type : "END_FETCHING"
      })
      // dispatch({
      //   type : "END_LOADING"
      // })
    
      Notifier.showNotification({
        title: 'Error',
        description: err.response.data.msg ? err.response.data.msg : `Could not pay your driver. Please check your internet connection or contact customer care`,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress : true
      });
    });
};

// rate an order  
export const rate_driver = (rating,review_message,passenger_id, driver,tokens, reset_navigation) => (dispatch) => {
  
  const config = {
    headers: {
      "Content-Type": "application/json",
  
      "x-auth-token" : tokens
    },
  };

  const body = JSON.stringify({rating,review_message,passenger_id})

  dispatch({
    type : "SET_FETCHING"
  })
// dispatch({
//     type : "SET_LOADING"
//   })


  // REQUEST BODY
console.log("token linme 201!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", tokens, rating, review_message,passenger_id)
  axios
    .post(`/api/order/rate-driver/${driver}`, body, config)
    .then(
      (res) => {
        console.log("Rated driver successfully")

        reset_navigation()
    
        dispatch({
          type : "END_FETCHING"
        })
      // dispatch({
      //     type : "END_LOADING"
      //   })
      

        console.log("MESSAGE res ", res.data)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      console.log("error ", err);
      dispatch({
        type : "END_FETCHING"
      })
      // dispatch({
      //   type : "END_LOADING"
      // })
    
      Notifier.showNotification({
        title: 'Error',
        description: `Could not rate your order. Please check your internet connection`,
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress : true
      });
    });
};



// Setup config/headers and token

export const tokenConfig = (getState) => {
  // Get token from AsyncStorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // If token, add to headers
  if (token) {
    config.headers["x-auth-token"] = token;
    // console.log("token ", token)
  }

  return config;
};
