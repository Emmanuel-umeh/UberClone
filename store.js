// import { createStore, applyMiddleware } from 'redux';
// import { persistStore, persistReducer } from 'redux-persist';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk';
// import reducer from './reducer';
// import AsyncStorage from '@react-native-community/async-storage';

// const persistConfig = {
//     key: 'reducer',
//     storage: AsyncStorage,
//     // whitelist: ['orderReducer'] // or blacklist to exclude specific reducers
//  };
// const presistedReducer = persistReducer(persistConfig, reducer );
// const store = createStore(presistedReducer, 
// composeWithDevTools(applyMiddleware(thunk)));
// const persistor = persistStore(store);
// export { persistor, store };

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware  from 'redux-thunk';
import rootReducer from './reducer';

const initialState = {};

const middleWare = [thunkMiddleware ];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleWare))
);

export default store;