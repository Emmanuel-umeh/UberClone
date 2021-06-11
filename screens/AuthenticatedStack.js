import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Map from "./Map";
import { connect } from "react-redux";
import ProfileScreen from "./ProfileScreen";
import SetLogistics from "./selectLogistics";
import CreditCard from "./CreditCard";
import Settings from "./Settings";
import Add_Card from "./Add_Card";
import Ride_History from "./Ride_History";
import Driver_Rating from "./Driver_Rating";
import Confirm_Location from "./Confirm_Location";
import MapRoute from "./Map_Route";
import { Platform } from "react-native";

const AuthStack = createStackNavigator();

const AuthenticatedStack = ({ navigation }) => (
  <AuthStack.Navigator

  
    mode= "modal"
  >



    <AuthStack.Screen name="setLogisticsScreen" options ={{
            headerStyle : {
              backgroundColor : "black"
              
            },
             headerTitleAlign : Platform.OS === "android" ?  "left" : "center",
            title : "Select Your Vehicle",
           
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={SetLogistics} />

    <AuthStack.Screen  name="Map" options ={{
      headerShown : false
    }} component={Map} />

    <AuthStack.Screen   options ={{
      headerShown : false
    }} name="MapRoute" component={MapRoute} />
    {/* <AuthStack.Screen name="SplashScreen" component={AuthSplashScreen}/> */}

    {/* <AuthStack.Screen name="setDestination" component={setDestination} /> */}
    {/* <AuthStack.Screen  name="confirm_location" component={Confirm_Location} /> */}
    <AuthStack.Screen name="creditCardScreen" options ={{
         headerStyle : {
          backgroundColor : "black"
          
        },
         headerTitleAlign : Platform.OS === "android" ?  "left" : "center",
        title : "Add Card",
       
        headerTintColor: '#fff',
        headerTitleStyle : {
          color : "#fff",
          fontFamily : "Quicksand-Bold"
        }
    }} component={CreditCard} />

    <AuthStack.Screen name="profileScreen" options ={{
            headerStyle : {
              backgroundColor : "black"
              
            },
            title : "My Profile",
           
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }}  component={ProfileScreen} />

    <AuthStack.Screen name="settings" options ={{
            headerStyle : {
              backgroundColor : "black"
              
            },
            title : "Settings",
            //
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={Settings} />
    <AuthStack.Screen name="add_card"   options ={{
            headerStyle : {
              backgroundColor : "black"
              
            },
            title : "Add Card",
           
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={Add_Card} />

  
    <AuthStack.Screen  options ={{
            headerStyle : {
              backgroundColor : "black",
              
            },
            title : "Ride History",
            headerTitleAlign : Platform.OS === "android" ?  "left" : "center",
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }}  name="ride_history" component={Ride_History} />

    {/* rating your ride */}

    <AuthStack.Screen name="driver_rating" options ={{
            headerStyle : {
              backgroundColor : "black",
              
            },
            title : "Rate Your Driver",
             headerTitleAlign : Platform.OS === "android" ?  "left" : "center",
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={Driver_Rating} />


    {/* 
        <AuthStack.Screen name="setDestination" component={setDestination}/>

        <AuthStack.Screen name="setDestination" component={setDestination}/> */}

    {/* <AuthStack.Screen   name="mapDestination" component={MapDestination}/> */}
  </AuthStack.Navigator>
);
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {  })(AuthenticatedStack);
