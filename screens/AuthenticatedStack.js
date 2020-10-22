import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Map from "./Map";
import { loadUser } from "../action/authAction";
import { connect } from "react-redux";
import AuthSplashScreen from "./AuthSplashScreen";
import setDestination from "./setDestination";
import MapDestination from "./MapDestination";
import ProfileScreen from "./ProfileScreen";
import SetLogistics from "./selectLogistics";
import CreditCard from "./CreditCard";

const AuthStack = createStackNavigator();

const AuthenticatedStack = ({ navigation }) => (
  <AuthStack.Navigator
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="setLogisticsScreen" component={SetLogistics} />

    <AuthStack.Screen  name="Map" component={Map} />
    {/* <AuthStack.Screen name="SplashScreen" component={AuthSplashScreen}/> */}

    <AuthStack.Screen name="setDestination" component={setDestination} />
    <AuthStack.Screen name="creditCardScreen" component={CreditCard} />

    <AuthStack.Screen name="profileScreen" component={ProfileScreen} />

  
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
