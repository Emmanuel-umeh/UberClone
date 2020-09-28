import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import { loadUser } from "../action/authAction";
import {connect} from "react-redux"
import AuthSplashScreen from './AuthSplashScreen';
import setDestination from './setDestination';

const AuthStack = createStackNavigator();

const AuthenticatedStack = ({navigation}) => (
    <AuthStack.Navigator headerMode='none '  screenOptions={{
        headerShown: true
      }}>
        <AuthStack.Screen name="SplashScreen" component={AuthSplashScreen}/>
       
        <AuthStack.Screen headerMode ="none" name="Map" component={Map}/>
        <AuthStack.Screen name="setDestination" component={setDestination}/>


    </AuthStack.Navigator>
);
const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { loadUser })(AuthenticatedStack);
  