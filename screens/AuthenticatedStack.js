import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Map from "./Map";
import { loadUser } from "../action/authAction";
import { connect } from "react-redux";
import AuthSplashScreen from "./AuthSplashScreen";
import setDestination from "./SetDestination";
import MapDestination from "./MapDestination";
import ProfileScreen from "./ProfileScreen";
import SetLogistics from "./selectLogistics";
import CreditCard from "./CreditCard";
import Settings from "./Settings";
import Add_Card from "./Add_Card";
import Ride_History from "./Ride_History";
import Driver_Rating from "./Driver_Rating";
import Confirm_Location from "./Confirm_Location";

const AuthStack = createStackNavigator();

const AuthenticatedStack = ({ navigation }) => (
  <AuthStack.Navigator
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}
    mode= "modal"
  >




    <AuthStack.Screen name="setLogisticsScreen" component={SetLogistics} />

    <AuthStack.Screen  name="Map" component={Map} />
    {/* <AuthStack.Screen name="SplashScreen" component={AuthSplashScreen}/> */}

    {/* <AuthStack.Screen name="setDestination" component={setDestination} /> */}
    {/* <AuthStack.Screen  name="confirm_location" component={Confirm_Location} /> */}
    <AuthStack.Screen name="creditCardScreen" component={CreditCard} />

    <AuthStack.Screen name="profileScreen" component={ProfileScreen} />

    <AuthStack.Screen name="settings" component={Settings} />
    <AuthStack.Screen name="add_card" component={Add_Card} />

  
    <AuthStack.Screen name="ride_history" component={Ride_History} />

    <AuthStack.Screen name="driver_rating" component={Driver_Rating} />
    {/* rating your ride */}

  
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
export default connect(mapStateToProps, { loadUser })(AuthenticatedStack);
