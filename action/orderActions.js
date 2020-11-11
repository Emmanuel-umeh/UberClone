import axios from "axios";
import { returnErrors } from "./errorActions";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions } from "react-navigation";
import {MAKE_ORDER,RIDE_ACCEPTED,RIDE_STARTED,RIDE_COMPLETED,RIDE_ENDED,RIDE_CANCELLED } from "./types";

import * as RootNavigation from "../rootNavigation";
import { Notifier, Easing, NotifierComponents } from "react-native-notifier";
// import AWN from "awesome-notifications"
import Pusher from "pusher-js/react-native";
// https://elesarrdevelopment.herokuapp.com/api/signupuser/all

// let notifier = new AWN
// var location = window.location.href
// if(location.slice(0,17)== 'http://localhost:' || "https://elesarr.he" || "http://elesarr.her"){
// axios.defaults.baseURL = 'https://whiteaxisapi.herokuapp.com';
axios.defaults.baseURL = "http://dee6666e76be.ngrok.io";
// }
// else if(location.slice(0,17)==  "http://127.0.0.1:"){
//   axios.defaults.baseURL = 'https://elesarrdevelopment.herokuapp.com';
// }
// else{
//   axios.defaults.baseURL = 'https://eles-api.herokuapp.com'
// }
//

var token;
var orderID
var pusher = new Pusher("eead8d5075773e7aca0a", {
    authEndpoint: "http://dee6666e76be.ngrok.io/api/pusher/auth",
    cluster: "eu",
    auth: {
      headers : { 'x-auth-token':token }
    },
    encrypted: true,
  });
  Pusher.logToConsole = true


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


// Get the orders ID
getOrder = async () => {
  orderID = await AsyncStorage.getItem("order_id");
  console.log("redux action js ", orderID);

  // this.props.setUserToken(token)
  // token = token
  return orderID;
};


// Clear the orders ID
clearOrder = async () => {
   await AsyncStorage.removeItem("order_id");
  console.log("Cleared order successfully");

 
};


getToken();
getOrder()
export const setUserToken = (token) => (dispatch) => {
  dispatch({
    type: SET_USER_TOKEN,
    payload: token,
  });
};

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

//   endLocationName,
  price,
}) => (dispatch) => {
  console.log("trigger received ", trigger)
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token" : token
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({
       startLatitude,
    startLongitude,
    // startLocationName,
  
    endLongitude,
    endLatitude,
  
    // endLocationName,
    price });

  // console.log("body recieved ", body);


  // trigger Loader
  dispatch({
    type : "SET_FETCHING"
  })

  axios
    .post(`/api/order/makeOrder`, body, config)
    .then(
      (res) => {
        //
        // endLoading()
        trigger()
        dispatch({
          type : MAKE_ORDER,
          payload : res.data
        })


        // trigger pusher js
 
        dispatch({
          type : "END_FETCHING"
        })
      

        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        // return RootNavigation.navigate("otp", {
        //   request_id: res.data.request_id,
        //   status: res.data.status,
        //   phoneNumber: phoneNumber,
        // });

        console.log("MESSAGE res ", res.data)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      console.log("error ", err);
      dispatch({
        type : "END_FETCHING"
      })
    
      Notifier.showNotification({
        title: 'Create Order Error',
        description: `Their was an error creating an order. Please try again`,
        duration: 0,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log('Hidden'),
        onPress: () => console.log('Press'),
        hideOnPress : true
      });
    });
};


// cancel an order  and clkear from asyncstorage
export const cancelOrder = () => (dispatch) => {
  
  const config = {
    headers: {
      "Content-Type": "application/json",
  
      "x-auth-token" : token
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
        description: `Could not cancel your order. Please check your internet connection`,
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
