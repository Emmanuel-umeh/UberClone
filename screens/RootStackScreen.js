import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import phoneNumber from './phoneNumber';
import Splash1 from './Intro/Intro1';
import Map from './Map';
import MainTabScreen from './MainTabScreen';
import { loadUser } from "../action/authAction";
import {connect} from "react-redux"
import getStarted from './getStarted';
import nameScreen from './nameScreen';
import TermsAndCondition from './termsAndCondition';
const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none '  screenOptions={{
        headerShown: false
      }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="getStarted" component={getStarted}/>
        <RootStack.Screen name="phoneNumberScreen" component={phoneNumber}/>
        <RootStack.Screen name="nameScreen" component={nameScreen}/>
        <RootStack.Screen name="TermsAndCondition" component={TermsAndCondition}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        {/* <RootStack.Screen name="Splash1" component={Splash1}/> */}
        <RootStack.Screen headerMode ="none" name="Map" component={Map}/>


    </RootStack.Navigator>
);
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { loadUser })(RootStackScreen);
  