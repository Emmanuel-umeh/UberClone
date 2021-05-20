import { combineReducers } from 'redux';

// import errorReducer from './errorReducer';
import authReducer from './authReducer';
import orderReducer from './orderReducer';

import errorReducer from "./errorReducer"
import pusherReducer from './pusherReducer';


export default combineReducers({
  // error: errorReducer,
  auth: authReducer,
  error:errorReducer,
  order : orderReducer,
  pusher : pusherReducer

  // blockchain:blockchainReducer
});
