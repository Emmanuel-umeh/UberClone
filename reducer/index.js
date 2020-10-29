import { combineReducers } from 'redux';

// import errorReducer from './errorReducer';
import authReducer from './authReducer';
import orderReducer from './orderReducer';

import errorReducer from "./errorReducer"


export default combineReducers({
  // error: errorReducer,
  auth: authReducer,
  error:errorReducer,
  order : orderReducer

  // blockchain:blockchainReducer
});
