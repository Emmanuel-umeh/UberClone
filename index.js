import { AppLoading, registerRootComponent } from "expo";
import React, { Component } from "react";
import App from "./App";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react"
import store, { persistedStore } from "./store";


class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={
        <AppLoading />
        // console.log
        } persistor={persistedStore}>
        <App />
        </PersistGate>
      </Provider>
    );
  }
}

export default registerRootComponent(Index);
