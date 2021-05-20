import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import PhoneNumber from './phoneNumber';
import Splash1 from './Intro/Intro1';
import Map from './Map';
// import MainTabScreen from './MainTabScreen';
import {connect} from "react-redux"
import getStarted from './getStarted';
import NameScreen from './nameScreen';
import TermsAndCondition from './termsAndCondition';
import Otp from './Otp';
import setDestination from './setDestination';
import MapDestination from './MapDestination';
const RootStack = createStackNavigator();



const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator >
        {/* <RootStack.Screen name="SplashScreen" component={SplashScreen}/> */}
         <RootStack.Screen name="getStarted" options ={{
           headerShown  : false
         }} component={getStarted}/>

<RootStack.Screen name="nameScreen"options ={{
            headerStyle : {
              backgroundColor : "black",
              
            },
            title : "Your Details",
            headerTitleAlign : "left",
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={NameScreen}/>
        <RootStack.Screen name="phoneNumberScreen" options ={{
           headerStyle : {
            backgroundColor : "black",
            
          },
          title : "Phone number",
          headerTitleAlign : "left",
          headerTintColor: '#fff',
          headerTitleStyle : {
            color : "#fff",
            fontFamily : "Quicksand-Bold"
          }
         }}
          component={PhoneNumber}/>
        <RootStack.Screen name="otp" options ={{
            headerStyle : {
              backgroundColor : "black",
              
            },
            title : "OTP",
            headerTitleAlign : "left",
            headerTintColor: '#fff',
            headerTitleStyle : {
              color : "#fff",
              fontFamily : "Quicksand-Bold"
            }
        }} component={Otp}/>
      
        <RootStack.Screen name="TermsAndCondition" component={TermsAndCondition}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/> 
   
        <RootStack.Screen headerMode ="none" name="Map" component={Map}/>
        <RootStack.Screen   name="setDestination" component={setDestination}/>

        {/* <RootStack.Screen   name="mapDestination" component={MapDestination}/> */}



    </RootStack.Navigator>
);
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { })(RootStackScreen);
  