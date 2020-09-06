
import React, { Component } from 'react'
import Icon from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen"

import DetailsScreen from "./DetailsScreen"
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const DetailStack = createStackNavigator();
const HomeStack = createStackNavigator();


const MainTabScreen =()=>{

    return (

    <Tab.Navigator
    initialRouteName="Home"
    activeColor="#fff"
    style={{ backgroundColor: 'tomato' }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: "#009387",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={DetailsStackScreen}
      options={{
        tabBarLabel: 'Updates',
        tabBarColor: "#1f65ff",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreScreen}
      
      options={{
        tabBarLabel: 'Explore',
        tabBarColor: "#d02860",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />

<Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarColor: "#694fad",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>

    )
}


export default MainTabScreen;


function HomeStackScreen({navigation}) {
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#009387",
          },
  
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            alignSelf: "center",
          },
        }}
      >
        <HomeStack.Screen
        name = "Home"
          options={{
            title: "Home",
            headerLeft: () => (
              <Icon.Button
                name="ios-menu"
                size={25}
                backgroundColor="#009387"
                onPress={() => 
                  navigation.openDrawer()
                }
              ></Icon.Button>
            )
          }}
          name="Home"
          component={HomeScreen}
        />
      </HomeStack.Navigator>
    );
  }
  
  function DetailsStackScreen({navigation}) {
    return (
      <DetailStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1f65ff",
          },
  
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
            alignSelf: "center",
          },
        }}
      >
        <DetailStack.Screen name="Details" 
        options ={{
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={25}
              backgroundColor="#1f65ff"
              onPress={() => 
                navigation.openDrawer()
              }
            ></Icon.Button>
          )
        }}
        
        component={DetailsScreen} />
      </DetailStack.Navigator>
    );
  }