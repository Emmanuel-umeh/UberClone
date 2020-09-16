// In App.js in a new project

import * as React from "react";
import {useState} from 'react'
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabScreen, { HomeStackScreen, DetailsStackScreen } from "./screens/MainTabScreen";
import {DrawerContent} from "./screens/DrawerContent"
import RootStackScreen from "./screens/RootStackScreen";
import store from './store'
import {Provider} from 'react-redux'

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const Drawer = createDrawerNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
  'charm-bold': require('./assets/fonts/Charm-Bold.ttf'),
  // 'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
  'charm-regular': require('./assets/fonts/Charm-Regular.ttf')
  });
  };

function App() {

  const [dataLoaded, setDataLoaded] = useState(false)
  return (

    <Provider store={store}>
    <NavigationContainer>
      {/* <Drawer.Navigator drawerContent ={
        props=><DrawerContent {...props} />
      
      } initialRouteName="Home">
        
        <Drawer.Screen name="Home" component={HomeStackScreen} />
        <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Details" component={DetailsStackScreen} />
      </Drawer.Navigator> */}

      <RootStackScreen />
    </NavigationContainer>

    </Provider>
  );
}

export default App;
