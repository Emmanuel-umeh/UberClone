import axios from "axios";
import { returnErrors } from "./errorActions";
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
  SET_USER_TOKEN,
  SET_LOADING,
  END_LOADING,

  ADD_CARD_FAILED,
  ADD_CARD
} from "./types";




import * as RootNavigation from "../../rootNavigation";
import { Notifier, Easing,NotifierComponents  } from 'react-native-notifier';



// BEGIN LOADING ANIMATON
export const setLoading = () => (dispatch, getState) => {
 
  dispatch({ type: SET_LOADING }); // dispatch user loading


};

// END LOADING ANIMATION
export const endLoading = () => (dispatch, getState) => {
 
  dispatch({ type: END_LOADING }); // dispatch user loading


};



// send OTP code to the user
export const textMessageAuth = (phoneNumber, hideLoader) => (dispatch) => {
  // console.log("data received ", email, password)
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({ phoneNumber });

  console.log("body recieved ", phoneNumber);

  axios
    .post(`/api/users/phone`, body, config)
    .then(
      (res) => {
        // 
        // endLoading()
        // dispatch({
        //   type : END_LOADING
        // })

        console.log(res.data)

        if(res.data.error_text){
          hideLoader()
        
          return Notifier.showNotification({
            title: "Signup Error",
         
            description:'Something went wrong. Please use a different number or check your internet connection and try again',
            duration: 5000,
            showAnimationDuration: 800,
            showEasing: Easing.bounce,
            onHidden: () => console.log("Hidden"),
            onPress: () => console.log("Press"),
            hideOnPress: true,
          });
        }
     
        
        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        hideLoader()
        
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

      console.log(err.response.data)
      Notifier.showNotification({
        title: "Signup Error",
     
        description: err.response.data ? err.response.data.msg : 'Something went wrong. Please check your internet connection and try again',
        duration: 5000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        onHidden: () => console.log("Hidden"),
        onPress: () => console.log("Press"),
        hideOnPress: true,
      });
      console.log("error ", err);

      return dispatch(
        returnErrors(err.response.data, err.response.status, "AUTH_MESSAGE_FAILED"),
        {
          type: AUTH_MESSAGE_FAILED,
        }
      );
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

  axios
    .post(`/api/users/phone/verify`, body, config)
    .then(
      (res) => {

        try {
                  // dispatch({
        //   type: REGISTER_SUCCESS,
        //   payload: res.data,
        // });

      


        if(res.data.exists){

          
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
          return  dispatch({
            type : "IS_AUTHENTICATED"
          })
        }
        // endLoading()
        // dispatch({
        //   type : END_LOADING
        // })

        return RootNavigation.navigate("nameScreen", { token: res.data.token, id : res.data.user._id });

        // status code 10 means otp has already been sent
        // status code 6 means the otp has timed out or more of it has been completed
        // return RootNavigation.navigate('otp', { request_id: res.data.request_id,status : res.data.status, phoneNumber : phoneNumber  });

        // console.log("MESSAGE res ", res)
        } catch (error) {
          console.warn(error)
        }
        

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

    
      Notifier.showNotification({
        title: 'The request was failed',
        description: err.response ? err.response.data.msg : 'Something went wrong. Please check your internet connection and try again',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
      console.warn("error !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err.response );

      return dispatch(
        returnErrors(err.response, err.response.status, "AUTH_MESSAGE_FAILED"),
        {
          type: AUTH_MESSAGE_FAILED,
        }
      );
    });
};




export const registerDetails = (firstName, lastName, email, id,tokens) => (
  dispatch, getState
) => {
  console.log("toekn received in register details ", tokens)
  const config = {
    headers: {
  // 'Accept': 'application/json',
  "x-auth-token" : tokens,
  'Content-Type': 'application/json'
},
};

  // REQUEST BODY
  const body = JSON.stringify({ firstName, lastName, email,id });

  // console.log("body recieved registered details ", body)

  // setLoading()
  axios
    .post(`/api/users/updateDetails/${id}`,body,config)
    .then(
      (res) => {
        console.log("data from u[pdation gdetails", res.data);

        var payload  =  {
          user : res.data,
          token : tokens
        }
    // endLoading()

    // dispatch({
    //   type : END_LOADING
    // })
    RootNavigation.navigate("TermsAndCondition", { token: tokens });


    dispatch({
      type: USER_LOADED,
      payload: payload,
    });

        // return 
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
      //     "AUTH_MESSAGE _FAILED"
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



// Verify the OTP
export const add_card = ({number, expiry,type , tokens}) => (
  dispatch
) => {
  // console.log("data received ", email, password)

  dispatch({
    type : "SET_FETCHING"
  })
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token" : tokens
    },
  };

  // REQUEST BODY
  const body = JSON.stringify({ number, expiry,type });
  console.log({body})

  axios
    .post(`/api/users/add_card`, body, config)
    .then(
      (res) => {
        

        dispatch({
          type : "END_FETCHING"
        })
   dispatch({
     type : ADD_CARD,
     payload : res.data
   })

         RootNavigation.navigate("add_card");
        return         Notifier.showNotification({
          title: "Updated Successfully",
          description: `Your ATM card details were stored successfully. You can now make orders with your card. `,
          duration: 5000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          onHidden: () => console.log("Hidden"),
          onPress: () => console.log("Press"),
          hideOnPress: true,
        });
      }
     
    )
    .catch((err) => {

      dispatch({
        type : "END_FETCHING"
      })
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

    
      Notifier.showNotification({
        title: 'The request was failed',
        description: 'Check your internet connection, please',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'error',
        },
      });
      console.log("error ", err);

      return dispatch(
        returnErrors(err.response.data, err.response.status, "ADD_CARD_FAILED"),
        {
          type: ADD_CARD_FAILED,
        }
      );
    });
};



// logout
export const logout = () =>(dispatch)=> {
  // AsyncStorage.removeItem('referral')
  // setLoading()

  
    // setTimeout(() => {

      dispatch({
        type : "SET_FETCHING"
      })
      
      dispatch({
        type: LOGOUT_SUCCESS
      })


      dispatch({
        type : "END_FETCHING"
      })
      // RootNavigation.reset({
      //   key: null,
      //   index: 0,
      //   actions: [RootNavigation.navigate({ routeName: 'getStarted' })],
      // })
      // dispatch({
      //   type : END_LOADING
      // })
  
  
    // }, 1000);
   
  
 
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
