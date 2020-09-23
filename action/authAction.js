import axios from "axios";
import { returnErrors } from "./errorActions";
import AsyncStorage from "@react-native-community/async-storage";

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
} from "./types";

// import AWN from "awesome-notifications"

// https://elesarrdevelopment.herokuapp.com/api/signupuser/all

// let notifier = new AWN
// var location = window.location.href
// if(location.slice(0,17)== 'http://localhost:' || "https://elesarr.he" || "http://elesarr.her"){
// axios.defaults.baseURL = 'https://whiteaxisapi.herokuapp.com';
axios.defaults.baseURL = "http://192.168.0.100:5200";
// }
// else if(location.slice(0,17)==  "http://127.0.0.1:"){
//   axios.defaults.baseURL = 'https://elesarrdevelopment.herokuapp.com';
// }
// else{
//   axios.defaults.baseURL = 'https://eles-api.herokuapp.com'
// }
//

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
          AsyncStorage.removeItem("token");
          return dispatch({
            type: AUTH_ERROR,
          });
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

export const textMessageAuth = ( phoneNumber ) => (dispatch) => {
  // console.log("data received ", email, password)
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({ phoneNumber });

  console.log("body recieved ", body)
  axios
    .post(`/api/users/phone`, body, config)
    .then(
      (res) => {
        dispatch({
          type: AUTH_MESSAGE_SENT,
          payload: res.data,
        });

        console.log("MESSAGE res ", res)
      }
      // console.log("this is the res ", res)
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          "AUTH_MESSAGE_FAILED"
        )
      );
      dispatch({
        type: AUTH_MESSAGE_FAILED,
      });

      dispatch({
        type: AUTH_MESSAGE_FAILED,
      });

      notifier.warning("Login Failed");
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

// Register Organizatiion

export const registerOrg = ({
  name_of_organisation,
  email,
  telephone_no,
  office_address,
  rc_no,
  location_of_company,
  country,
  state,
  postal_code,
  password,
  confirmPassword,
}) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      // 'Accept': 'application/json',
      "Content-Type": "application/json",
    },
  };

  // console.log(config)

  // Request body
  const body = JSON.stringify({
    name_of_organisation,
    email,
    telephone_no,
    office_address,
    rc_no,
    location_of_company,
    country,
    state,
    postal_code,
    password,
    confirmPassword,
  });

  // console.log("consoling the body from register action ",body)

  axios
    .post("/api/organisationuser", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      window.location.href = "/organisation/dashboard";
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      // console.log(err.response.data)
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// Register User
export const registerind = (
  { username, email, password, confirmPassword },
  history
) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      // 'Accept': 'application/json',
      "Content-Type": "application/json",
    },
  };

  // console.log(config)

  // Request body
  const body = JSON.stringify({ username, email, password, confirmPassword });
  // console.log("registering individual")
  // console.log("consoling the body from register action ",body)
  axios
    .post("/api/signupuser", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      // history.push('/dashboard')
      window.location.href = "/dashboard";
    })
    .catch((err) => {
      notifier.warning("Registration failed");
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      // console.log(err)
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// regiseter individual modal
export const registerindModal = (
  { username, email, password, confirmPassword },
  history
) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      // 'Accept': 'application/json',
      "Content-Type": "application/json",
    },
  };

  // console.log(config)

  // Request body
  const body = JSON.stringify({ username, email, password, confirmPassword });
  // console.log("registering individual")
  // console.log("consoling the body from register action ",body)
  axios
    .post("/api/signupuser", body, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      // history.push('/dashboard')
    })
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      // console.log(err)
      dispatch({
        type: REGISTER_FAIL,
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
