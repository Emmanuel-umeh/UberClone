// import React from 'react';

// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';

// import Icon from 'react-native-vector-icons/Ionicons';

// import HomeScreen from './HomeScreen';
// import DetailsScreen from './DetailsScreen';
// import ExploreScreen from './ExploreScreen';
// import ProfileScreen from './ProfileScreen';
// import Map from './Map';
// import RootStackScreen from './RootStackScreen';

// const HomeStack = createStackNavigator();
// const DetailsStack = createStackNavigator();

// const Tab = createStackNavigator();

// function MainTabScreen (){


//   return(
//     <Tab.Navigator
//     initialRouteName="Home"
//     activeColor="#fff"
//     screenOptions={{ headerShown: false }}>
  
//     <Tab.Screen
//       name="Home"
//       component={RootStackScreen}
//       options={{
//         tabBarLabel: 'Home',
//         tabBarColor: '#000000',
//         tabBarIcon: ({ color }) => (
//           <Icon name="ios-home" color={color} size={26} />
//         ),
//       }}
//     />
//     <Tab.Screen
//       name="Notifications"
//       component={DetailsStackScreen}
//       options={{
//         tabBarLabel: 'Updates',
//         tabBarColor: '#998415',
//         tabBarIcon: ({ color }) => (
//           <Icon name="ios-notifications" color={color} size={26} />
//         ),
//       }}
//     />
//     <Tab.Screen
//       name="Profile"
//       component={ProfileScreen}
//       options={{
//         tabBarLabel: 'Profile',
//         tabBarColor: '#443D3D',
//         tabBarIcon: ({ color }) => (
//           <Icon name="ios-person" color={color} size={26} />
//         ),
//       }}
//     />
//     <Tab.Screen
//       name="Explore"
//       component={ExploreScreen}
//       options={{
//         tabBarLabel: 'Explore',
//         tabBarColor: '#515151',
//         tabBarIcon: ({ color }) => (
//           <Icon name="ios-aperture" color={color} size={26} />
//         ),
//       }}
//     />
//   </Tab.Navigator>
 
 
//  )
  
// };

// export default MainTabScreen;

// const HomeStackScreen = ({navigation}) => (
// <HomeStack.Navigator screenOptions={{
  
//       headerShown : false
//     }}>
//         <HomeStack.Screen name="Map" navigation = {navigation} component={Map} 
//           />
        
// </HomeStack.Navigator>
// );

// const DetailsStackScreen = ({navigation}) => (
// <DetailsStack.Navigator screenOptions={{
//         // headerStyle: {
//         // backgroundColor: '#1f65ff',
//         // },
//         // headerTintColor: '#fff',
//         // headerTitleStyle: {
//         // fontWeight: 'bold'
//         // }
//     }}>
//         <DetailsStack.Screen name="Details" component={DetailsScreen} options={{
//         headerLeft: () => (
//             <Icon.Button name="ios-menu" size={25} backgroundColor="#1f65ff" onPress={() => navigation.openDrawer()}></Icon.Button>
//         )
//         }} />
// </DetailsStack.Navigator>
// );