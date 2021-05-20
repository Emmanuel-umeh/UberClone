import { AppLoading, registerRootComponent } from "expo";
import React, { Component } from "react";
import App from "./App";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react"
import store, { persistedStore } from "./redux/store";
import NetworkChecker from 'react-native-network-checker';
import { NoInternet } from "react-native-no-internet-screen";
 
class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        {/* <PersistGate loading={
        <AppLoading />
        // console.log
        } persistor={persistedStore}> */}

<NetworkChecker
      position="bottom"
      duration={2000} // In milliseconds
      notConnectedMessage="Not connected to Internet!"
      notConnectedTextColor="white"
      notConnectedBackgroundColor="grey"
      connectedMessage="Connected to Internet!"
      connectedTextColor="white"
      connectedBackgroundColor="green"
    >
        <App />
        
    </NetworkChecker>
      
        {/* </PersistGate> */}
      </Provider>
    );
  }
}

export default registerRootComponent(Index);
