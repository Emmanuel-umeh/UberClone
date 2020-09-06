// In App.js in a new project

import * as React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabScreen, { HomeStackScreen, DetailsStackScreen } from "./screens/MainTabScreen";
import {DrawerContent} from "./screens/DrawerContent"
const Drawer = createDrawerNavigator();



function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent ={
        props=><DrawerContent {...props} />
      
      } initialRouteName="Home">
        {/* <Drawer.Screen name="Home" component={HomeStackScreen} /> */}
        <Drawer.Screen name="Home" component={MainTabScreen} />
        {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
        {/* <Drawer.Screen name="Details" component={DetailsStackScreen} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
