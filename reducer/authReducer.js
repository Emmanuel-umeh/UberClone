import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USERS_LOADING,
  USERS_LOADED,
  UPDATED_USER,
  UPDATING_USER,
  AUTH_MESSAGE_FAILED,
  AUTH_MESSAGE_SENT,
  PROFILE_LOADED,
  CLEAR_TYPE,
  SET_USER_TOKEN,
  IS_AUTHENTICATED,
  SET_LOADING,
  END_LOADING,
  ADD_CARD,
  ADD_CARD_FAILED
} from "../action/types";
import AsyncStorage from "@react-native-community/async-storage";
import { isLoaded, isLoading } from "expo-font";
var token 



getToken = async () =>{
    var value = await AsyncStorage.getItem('token')
    console.log("test value  !!!!!!!!!! ", value)
    token = value
    return value
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

// getToken();

const initialState = {
  token: token,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  profile: null,
  type: "",
  //  auth_msg_details : null
};

export default function (state = initialState, action) {
  switch (action.type) {

    

    case SET_USER_TOKEN: {
        return {
            ...state,
            token : action.payload
        };
      }

      
    case SET_LOADING: {
      return {
          ...state,
          isLoading : true
      };
    }

    case END_LOADING: {
      return {
          ...state,
          isLoading : false
      };
    }


    

      
    case CLEAR_TYPE: {
      return {
        // ...state,
        type: "",
      };
    }

    case USER_LOADED:
 
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user? action.oayload.user : action.payload,
        token :action.payload.token? action.payload.token : state.token,
        type: action.type,
      };

    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };

    // case AUTH_MESSAGE_SENT:
    //     return {
    //         ...state,
    //         isLoading:false,
    //         type:'AUTH_MESSAGE_SENT',
    //         auth_msg_details : action.payload

    //     };

    // case AUTH_MESSAGE_FAILED:
    //     return {
    //         ...state,
    //         isLoading:false,
    //         type:'AUTH_MESSAGE_FAILED',
    //         auth_msg_details : null

    //     };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      // AsyncStorage.setItem("token", action.payload.token)
      saveToken(action.payload.token);
      console.log("logged in successfully");

      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        type: "LOGIN_SUCCESS",
      };

    case LOGOUT_SUCCESS:
      // AsyncStorage.removeItem("token")
      removeToken()
      console.log("logged OUT successfully");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        type: "LOGOUT_SUCCESS",
      };

    case REGISTER_FAIL:
    case LOGOUT_SUCCESS:
    case LOGIN_FAIL:
      // AsyncStorage.removeItem("token")
      removeToken()
      return {
        ...state,
        token: token,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        type: "LOGIN_FAIL",
      };

    case USERS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USERS_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };

    case UPDATING_USER:
      return {
        ...state,
        isLoading: true,
      };

    case UPDATED_USER:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated : true
      };

    case AUTH_ERROR:
      return {
        token: token,
        isAuthenticated: null,
        isLoading: false,
        user: null,
        profile: null,
        type: "",
        type: "AUTH_ERROR",
      };
    case ADD_CARD:
      return {
       ...state,
       type : action.type,
       user : action.payload
      };
    case ADD_CARD_FAILED:
      return {
        ...state,
        type: action.type,
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
