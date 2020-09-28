import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import PhoneNumber from './phoneNumber';
import Splash1 from './Intro/Intro1';
import Map from './Map';
import MainTabScreen from './MainTabScreen';
import { loadUser } from "../action/authAction";
import {connect} from "react-redux"
import getStarted from './getStarted';
import NameScreen from './nameScreen';
import TermsAndCondition from './termsAndCondition';
import Otp from './Otp';
import setDestination from './setDestination';
const RootStack = createStackNavigator();



const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator   screenOptions={{
        headerShown: true
      }}>
        {/* <RootStack.Screen name="SplashScreen" component={SplashScreen}/> */}
         {/* <RootStack.Screen name="getStarted" component={getStarted}/>
        <RootStack.Screen name="phoneNumberScreen" component={PhoneNumber}/>
        <RootStack.Screen name="otp" component={Otp}/>
        <RootStack.Screen name="nameScreen" component={NameScreen}/>
        <RootStack.Screen name="TermsAndCondition" component={TermsAndCondition}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>  */}
   
        <RootStack.Screen headerMode ="none" name="Map" component={Map}/>
        <RootStack.Screen   name="setDestination" component={setDestination}/>



    </RootStack.Navigator>
);
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { loadUser })(RootStackScreen);
  