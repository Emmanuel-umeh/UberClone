import axios from "axios";
import { returnErrors } from "./errorActions";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions } from "react-navigation";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  GET_USERS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  AUTH_MESSAGE_SENT,
  GET_ERRORS,
  AUTH_MESSAGE_FAILED,
  CLEAR_TYPE,
  SET_USER_TOKEN
} from "./types";




import * as RootNavigation from "../rootNavigation";
// import AWN from "awesome-notifications"

// https://elesarrdevelopment.herokuapp.com/api/signupuser/all

// let notifier = new AWN
// var location = window.location.href
// if(location.slice(0,17)== 'http://localhost:' || "https://elesarr.he" || "http://elesarr.her"){
// axios.defaults.baseURL = 'https://whiteaxisapi.herokuapp.com';
axios.defaults.baseURL = "http://b6c238a735ab.ngrok.io";
// }
// else if(location.slice(0,17)==  "http://127.0.0.1:"){
//   axios.defaults.baseURL = 'https://elesarrdevelopment.herokuapp.com';
// }
// else{
//   axios.defaults.baseURL = 'https://eles-api.herokuapp.com'
// }
//

var token
export const saveToken = async (token) => {
  try {

    token =  await AsyncStorage.setItem("token", token)
    // token  = await AsyncStorage.getItem("token")
    // alert(token)
    console.log(token)
  } catch (e) {
    // alert('Failed to save the data to the storage')
    console.log(e)
  }
}

export const setUserToken = (token) => (dispatch) => {

  dispatch({
    type: SET_USER_TOKEN,
    payload : token
  });

   

  
       
       

};

export const loadUser = () => (dispatch, getState) => {
  console.log("getting user");
  // dispatch({type:USER_LOADING}) // dispatch user loading

  // user loading
  dispatch({ type: USER_LOADING }); // dispatch user loading

  // console.log("token config ", tokenConfig(getState))
  try {
    axios
      .get(`/api/auth/oneUser`, tokenConfig(getState))
      .then((res) => {
        console.log("response ", res.data);
        if (res.data.message === "error") {
          // AsyncStorage.removeItem("token");
          // return dispatch({
          //   type: AUTH_ERROR,
          // });
          
          console.log("login failed")
        }
        // console.log("user data ", res)
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        });
        //  console
      })

      .catch((err) => {
        dispatch({
          type: AUTH_ERROR,
        });
        console.log("err", err);
        // console.log("Eroor" , err.response.data)
        // console.clear()
      });
  } catch (e) {
    if (e) {
      // console.clear()
      console.log("error ", e);
    }
  }
};

// export const register =

// send OTP code to the user
export const textMessageAuth = (phoneNumber) => (dispatch) => {
  // console.log("data received ", email, password)
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({ phoneNumber });

  console.log("body recieved ", body);
  axios
    .post(`/api/users/phone`, body, config)
    .then(
      (res) => {
        console.log("data ", res.data);
        // dispatch({
        //   type: AUTH_MESSAGE_SENT,
        //   payload: res.data,
        // })
        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        return RootNavigation.navigate("otp", {
          request_id: res.data.request_id,
          status: res.data.status,
          phoneNumber: phoneNumber,
        });

        // console.log("MESSAGE res ", res)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      // return dispatch(
      //  returnErrors(
      //     err.response.data,
      //     err.response.status,
      //     "AUTH_MESSAGE_FAILED"
      //   ),
      //   {
      //     type: AUTH_MESSAGE_FAILED,
      //   }

      // );
      console.log("error ", err);
    });
};

// Verify the OTP
export const textMessageVerify = (request_id, code, phoneNumber) => (
  dispatch
) => {
  // console.log("data received ", email, password)
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({ request_id, code, phoneNumber });

  // console.log("body recieved ", body)
  axios
    .post(`/api/users/phone/verify`, body, config)
    .then(
      (res) => {
        console.log("data ", res.data);
        // dispatch({
        //   type: REGISTER_SUCCESS,
        //   payload: res.data,
        // });

        saveToken(res.data.token)

        return RootNavigation.navigate("nameScreen", { token: res.data.token });

        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        // return RootNavigation.navigate('otp', { request_id: res.data.request_id,status : res.data.status, phoneNumber : phoneNumber  });

        // console.log("MESSAGE res ", res)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      // return dispatch(
      //  returnErrors(
      //     err.response.data,
      //     err.response.status,
      //     "AUTH_MESSAGE_FAILED"
      //   ),
      //   {
      //     type: AUTH_MESSAGE_FAILED,
      //   }

      // );
      console.log("error ", err);
    });
};


export const registerDetails = (firstName, lastName, email) => (
  dispatch, getState
) => {
  // console.log("data received ", email, password)
  const config = {
    headers: {
  // 'Accept': 'application/json',
  "x-auth-token" : token,
  'Content-Type': 'application/json'
},
};

  // REQUEST BODY
  const body = JSON.stringify({ firstName, lastName, email });

  // console.log("body recieved ", body)
  axios
    .post(`/api/users/updateDetails`,body,config)
    .then(
      (res) => {
        console.log("data ", res);
    

        return RootNavigation.navigate("TermsAndCondition", { token: res.data.token });

        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        // return RootNavigation.navigate('otp', { request_id: res.data.request_id,status : res.data.status, phoneNumber : phoneNumber  });

        // console.log("MESSAGE res ", res)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      // return dispatch(
      //  returnErrors(
      //     err.response.data,
      //     err.response.status,
      //     "AUTH_MESSAGE_FAILED"
      //   ),
      //   {
      //     type: AUTH_MESSAGE_FAILED,
      //   }

      // );
      console.log("error ", err);
    });
};

export const clearType = () => (dispatch) => {
  dispatch({
    type: CLEAR_TYPE,
  });
};

// logout
export const logout = () => {
  // AsyncStorage.removeItem('referral')
  return {
    type: LOGOUT_SUCCESS,
  };
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
