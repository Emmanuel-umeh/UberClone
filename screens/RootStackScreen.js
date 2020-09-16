import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import Splash1 from './Intro/Intro1';
import Map from './Map';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        {/* <RootStack.Screen name="SplashScreen" component={SplashScreen}/> */}
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        {/* <RootStack.Screen name="Splash1" component={Splash1}/> */}
        <RootStack.Screen name="Map" component={Map}/>

    </RootStack.Navigator>
);

export default RootStackScreen;