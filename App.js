// In App.js in a new project

import * as React from "react";
import { useState } from "react";
import { View, Text, Button, StyleSheet, Image, YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NotifierWrapper } from "react-native-notifier";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AnimatedSplash from "react-native-animated-splash-screen";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import _ from "lodash";

import DrawerContent from "./screens/DrawerContent";
import RootStackScreen from "./screens/RootStackScreen";

// handles all my navigation for redux
import { navigationRef } from "./rootNavigation";

import * as Font from "expo-font";

import { connect } from "react-redux";
import { loadUser, setUserToken } from "./action/authAction";

import AuthenticatedStack from "./screens/AuthenticatedStack";
import AsyncStorage from "@react-native-community/async-storage";
import * as Permissions from "expo-permissions";
import NetInfo from '@react-native-community/netinfo';
import * as SplashScreen from 'expo-splash-screen';

import NoInternetScreen from "./screens/NoInternet"

import Config from "react-native-config";


const Drawer = createDrawerNavigator();

YellowBox.ignoreWarnings(["Setting a timer"]);
// const _console = _.clone(console);
// console.warn = (message) => {
//   if (message.indexOf("Setting a timer") <= -1) {
//     _console.warn(message);
//   }
// };
class App extends React.Component {
  constructor(props) {
    super(props);
    console.ignoredYellowBox = ["Setting a timer"];
    console.ignoredYellowBox = ['Animated: `useNativeDriver`'];
    this.unsubscribe = null

    this.connectivity = true
  }
  state = {
    loading: true,
    completed: false,

    reduxLoading: this.props.auth.isLoading,
  };

  async componentDidMount() {
  

this.loadApp()
  
 
    
  };


  loadApp = async()=>{
  
    try {
      // await SplashScreen.preventAutoHideAsync();

      this.prepareResources()
    } catch (e) {
      console.warn(e);
    }

  }


  prepareResources = async()=>{
try {

  const {token} = this.props.auth
  
    
    // await AsyncStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTg1NzI1MGM4NjNjM2E3Y2ZiMWI1NiIsImlhdCI6MTYwNDg3MDI0MywiZXhwIjoxMDAwMDAxNjA0ODcwMjQyfQ.1yMf5nhSj3U4rrOHGyw8yEJ138sFp7c60zp2qOBEBPI")
// await AsyncStorage.removeItem("token")
await Font.loadAsync({
  "charm-bold": require("./assets/fonts/Charm-Bold.ttf"),
  //   // 'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
  "charm-regular": require("./assets/fonts/Charm-Regular.ttf"),
  "Righteous-Regular": require("./assets/fonts/Righteous-Regular.ttf"),

  "roboto-700": require("./assets/fonts/roboto-700.ttf"),
  "roboto-900": require("./assets/fonts/roboto-900.ttf"),
  "roboto-regular": require("./assets/fonts/roboto-regular.ttf"),
  "Quicksand-Bold": require("./assets/fonts/Quicksand-Bold.ttf"),
  
  "Quicksand-Light": require("./assets/fonts/Quicksand-Light.ttf"),
  
  "Quicksand-Medium": require("./assets/fonts/Quicksand-Medium.ttf"),
  
  "Quicksand-Regular": require("./assets/fonts/Quicksand-Regular.ttf"),
  
  "Quicksand-SemiBold": require("./assets/fonts/Quicksand-SemiBold.ttf"),
  


  Roboto: require("native-base/Fonts/Roboto.ttf"),
  Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  // ...Ionicons.font,
}); await Permissions.askAsync(Permissions.LOCATION);

// await this.getToken();
await this.props.loadUser(token);

  
this.unsubscribe = NetInfo.addEventListener(state => {

  this.connectivity = state.isConnected
});

// console.log("Redux props ", this.props)
} catch (error) {
  console.warn(error)
}finally{

    setTimeout(async() => {
      
  this.setState({ loading: false });
    }, 2000);
   


}
  }

  componentWillUnmount(){
    this.unsubscribe()

  }
  // _renderNextButton = () => {
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.buttonCircle}>
  //         <Icon
  //           name="md-arrow-round-forward"
  //           color="rgba(255, 255, 255, .9)"
  //           size={24}
  //         />
  //       </View>
  //       <View style={{ paddingTop: 10 }}>
  //         <Text style={styles.text}>Next</Text>
  //       </View>
  //     </View>
  //   );
  // };
  // _renderDoneButton = () => {
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.buttonCircle}>
  //         <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
  //       </View>

  //       <View style={{ paddingTop: 10 }}>
  //         <Text style={styles.text}>Done</Text>
  //       </View>
  //     </View>
  //   );
  // };
  // _renderItem = ({ item }) => {
  //   return item.design;
  // };

  _onDone = () => {
    // navigation.navigate("SignUpScreen")
    // when user is done with intro screens
    this.setState({
      completed: true,
    });
  };

  render() {
    const { isAuthenticated, type, token, isLoading } = this.props.auth;


    if (this.state.loading) {
return(
  <AnimatedSplash
  translucent={true}
  isLoaded={!this.state.loading}
  logoImage={require("./assets/images/logo.png")}
  backgroundColor={"#fff"}
  logoHeight={hp(90)}
  logoWidth={wp(90)}
></AnimatedSplash>
)
    
    } 
    
    else if (!this.connectivity){
 return(
 
   <NoInternetScreen loadApp = {this.loadApp}/>
 
   // <NoInternet 
   // heading={"Oops! There is no Internet Connection"}
   // content={"We're having a little difficulty in connecting to the Internet. Please check your connection and try again."}
   // buttonLabel={"Try Again"}
   // errorText={"We still can't connect - please try again."}
   // // MainComponent={<NoInternetScreen/>}
   // containerStyle={{backgroundColor: "white"}}
   // textStyle={{color: "black"}}
   // />
 )
 
     }
    else {
      // console.log("second!!!");
      return (


        <AnimatedSplash
        translucent={true}
        isLoaded={!this.state.loading}
        logoImage={require("./assets/logo.png")}
        backgroundColor={"#000000"}
        logoHeight={hp(40)}
        logoWidth={wp(80)}
      >
      
        <NotifierWrapper>
          <NavigationContainer ref={navigationRef}>
            {isAuthenticated ? (
              <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions ={{
                  swipeEnabled : false
                }}
                initialRouteName="Home"
              >
                <Drawer.Screen
                  name="HomeDrawer"
                  component={AuthenticatedStack}
                />
              </Drawer.Navigator>
            ) : (
              // <Drawer.Screen name="Home" component={RootStackScreen} />
              <RootStackScreen />
            )}

            {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Details" component={DetailsStackScreen} /> */}

            {/* <AppIntroSlider  renderItem={this._renderItem}   renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton} data={slides} onDone={this._onDone}/> */}
            {/* <RootStackScreen /> */}
          </NavigationContainer>
        </NotifierWrapper>

        </AnimatedSplash>
      );
    }
  }

  // const [dataLoaded, setDataLoaded] = useState(false)
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { loadUser, setUserToken })(App);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingBottom: 5,
  },

  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  slide: {
    flex: 1,
    backgroundColor: "#000000",
  },
  image: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontWeight: "bold",

    fontFamily: "charm-regular",

    fontStyle: "normal",
    // fontWeight: "bold",
    // lineHeight : 45,
    fontSize: 15,
  },
});
