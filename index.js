import { registerRootComponent } from "expo";
import React, { Component } from "react";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default registerRootComponent(Index);
