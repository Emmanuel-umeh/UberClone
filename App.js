// In App.js in a new project

import * as React from "react";
import { useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NotifierWrapper } from "react-native-notifier";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AnimatedSplash from "react-native-animated-splash-screen";
import store from "./redux/store";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import _ from "lodash";

import { firebase } from "./firebase/firebase";

import * as Location from "expo-location";

import DrawerContent from "./screens/DrawerContent";
import RootStackScreen from "./screens/RootStackScreen";

// handles all my navigation for redux
import { navigationRef } from "./rootNavigation";

import * as Font from "expo-font";

import { connect } from "react-redux";

import AuthenticatedStack from "./screens/AuthenticatedStack";
import * as Permissions from "expo-permissions";
import NetInfo from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";

import NoInternetScreen from "./screens/NoInternet";
import { regionFrom, getLatLonDiffInMeters } from "./helpers/helper";
import Config from "react-native-config";
import { Platform } from "react-native";

import google_api from "./keys/google_map";
import { LogBox } from "react-native";
import Geocoder from "react-native-geocoding";

// Initialize the module (needs to be done only once)
Geocoder.init(google_api); // use a valid API key
const Drawer = createDrawerNavigator();

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const rootRef = firebase.database().ref();

SplashScreen.preventAutoHideAsync().catch((error) => {});
class App extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;

    // user location constuructor
    this.location = null;
    this.connectivity = true;
    this.watch_user = null
  }
  state = {
    loading: true,
    completed: false,

    reduxLoading: this.props.auth.isLoading,
  };

  async componentDidMount() {
    this.loadApp();
  }

  loadApp = async () => {
    try {
      this.prepareResources();
    } catch (e) {
      console.warn(e);
    }
  };

  prepareResources = async () => {
    try {
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
      });


      await Permissions.askAsync(Permissions.LOCATION);

      // await this.getToken();

      console.log("preparing resources!!!!!!!!!!!!!,... ");
      this.unsubscribe = NetInfo.addEventListener((state) => {
        this.connectivity = state.isConnected;
      });

      await this._getLocationAsync();

      // setTimeout(async() => {

      //   await this.setState({ loading: false });

      //     }, 100);

      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          console.log("user isnt logged in");

          await store.dispatch({
            type: "AUTH_ERROR",
          });
          await this.setState({ loading: false });
          await SplashScreen.hideAsync();
        } else {
          try {
            store.dispatch({ type: "USER_LOADING" }); // dispatch user loading

            // Assuming user is logged in
            const userId = firebase.auth().currentUser.uid;

            const reference = firebase.database().ref(`users/${userId}`);

            reference.once("value", function (snapshot) {
              if (snapshot.exists()) {
                let user = snapshot.val();

                // let user = firebase.database().ref("drivers/"+firebase.auth().currentUser.uid)
                if (!user.first_name || !user.last_name || !user.email) {
                  console.log(
                    "some user properties are missing!!!!!!!!!!!!!!!!!!!!!"
                  );

                  store.dispatch({
                    type: "AUTH_ERROR",
                  });
                  // this.props.navigation.replace("nameScreen")
                } else {
                  console.log("user has previously logged")
                  store.dispatch({
                    type: "USER_LOADED",
                    payload: user,
                  });
                }
              } else {
                console.log("not found");
              }
            });

           this.watch_user =  reference.on("value", function (snapshot) {
              if (snapshot.exists()) {
                let user = snapshot.val();
                console.log("user location updated", user);

                // let user = firebase.database().ref("users/"+firebase.auth().currentUser.uid)

                store.dispatch({
                  type: "UPDATED_USER",
                  payload: user,
                });
              }
            });

            firebase
              .database()
              .ref(`users/price`)
              .on("value", function (snapshot) {
                if (snapshot.exists()) {
                  const price = snapshot.val();
                  store.dispatch({
                    type: "SET_PRICE",
                    payload: price,
                  });
                }
              });
          } catch (e) {
            if (e) {
              // console.clear()
              store.dispatch({
                type: "AUTH_ERROR",
              });
              console.log("error in app.js", e);

              alert("Something went wrong. Please restart");
            }
          } finally {
            await this.setState({ loading: false });

            await SplashScreen.hideAsync();
          }
        }
      });

      // console.log("Redux props ", this.props)
    } catch (error) {
      console.log({ error });
    }
  };

  get_initial_location = async () => {
    const initial_location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    Geocoder.from(
      initial_location.coords.latitude,
      initial_location.coords.longitude
    ).then((json) => {
      var address =
        json.results[0].address_components[0].long_name +
        " " +
        json.results[0].address_components[1].long_name;

      let region = {
        latitude: initial_location.coords.latitude,
        longitude: initial_location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.06,
      };

      var data = {
        region: region,
        my_address: address,
        accuracy: initial_location.coords.accuracy,
      };

      // console.log("dataaaaa!!! ", data)

      console.log("dispatching address!!!!!!!!", address);
      store.dispatch({
        type: "GET_LOCATION",
        payload: data,
      });

      if(firebase.auth().currentUser){
        firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .update({
          location: {
            latitude: initial_location.coords.latitude,
            longitude: initial_location.coords.longitude,
          },
        });
      }
     

      return true;
    });
  };

  _getLocationAsync = async () => {
    try {
      Location.setGoogleApiKey("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");

      // Geocoder.init("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access denied!!!.");
        return Alert.alert(
          "Access Denied",
          "You need to grant access to location to continue using White Axis",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
              style: "cancel",
            },
            { text: "ignore", onPress: () => navigation.goback() },
            // { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }

      let location_on = await Location.getProviderStatusAsync();

      // let is_background_available = await Location.isBackgroundLocationAvailableAsync()
      // console.log({is_background_available})

      if (
        !location_on.locationServicesEnabled ||
        !location_on.backgroundModeEnabled
      ) {
        await Location.enableNetworkProviderAsync();
      }

   await   this.get_initial_location();

      var location_accuracy = 1000;

      this.location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          maximumAge: 20000,
          enableHighAccuracy: true,
          timeInterval: 5000,
          distanceInterval: 10,
          timeout: 20000,
        },
        async (location) => {
          var my_location = regionFrom(
            location.coords.latitude,
            location.coords.longitude,
            location.coords.accuracy
          );

          location_accuracy = location.coords.accuracy;

          this.setState({
            my_location: my_location,
          });

          // var address
          // =  await Location.reverseGeocodeAsync({
          //   latitude :location.coords.latitude , longitude:  location.coords.longitude
          // })
          console.log({ location_accuracy });
          if (location_accuracy < 500) {
            Geocoder.from(location.coords.latitude, location.coords.longitude)
              .then((json) => {
                var address =
                  json.results[0].address_components[0].long_name +
                  " " +
                  json.results[0].address_components[1].long_name;
                // console.log( json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name )
                var addressComponent = json.results[0].address_components[0];
                // console.log({addressComponent});

                let region = {
                  latitude: my_location.latitude,
                  longitude: my_location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.06,
                };

                var data = {
                  region: region,
                  // my_address:address[0]?  address[0].street ? address[0].street : address[0].name : null,
                  // addressShortName: addressComponent,
                  my_address: address,
                  accuracy: location_accuracy,
                };

                // console.log("dataaaaa!!! ", data)

                console.log("dispatching address!!!!!!!!", address);
                store.dispatch({
                  type: "GET_LOCATION",
                  payload: data,
                });

                if (location.coords.accuracy < 100) {
                  firebase
                    .database()
                    .ref("users/" + firebase.auth().currentUser.uid)
                    .update({
                      location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                      },
                    });
                }

                if (location_accuracy < 10) {
                  console.log(
                    "location accuracy is less than 10!!!!!!!!!!!!!!!"
                  );
                  return this.location.remove();
                }
              })
              .catch((error) => console.warn(error));
          }

          // console.log({address})
        }
      );

      // }
    } catch (error) {
      console.log("!!!!!!!!!!!error in getlocationasyc", error);
    }
  };

  componentWillUnmount() {
    if( firebase.auth().currentUser){
      firebase
      .database()
      // -MaydpgjezdWCmXKpFuC
      .ref("users/" + firebase.auth().currentUser.uid)
      .off("value", this.watch_user);
    }
   
    this.location &&  this.location.remove();
    return this.unsubscribe && this.unsubscribe();
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
    const { isAuthenticated, type, isLoading } = this.props.auth;

    //     if (this.state.loading) {
    // return(
    //   <AnimatedSplash
    //   translucent={true}
    //   isLoaded={!this.state.loading}
    //   logoImage={require("./assets/images/logo.png")}
    //   backgroundColor={"#fff"}
    //   logoHeight={hp(90)}
    //   logoWidth={wp(90)}
    // ></AnimatedSplash>
    // )

    //     }

    //     else if (!this.connectivity){
    //  return(

    //    <NoInternetScreen loadApp = {this.loadApp}/>

    //    // <NoInternet
    //    // heading={"Oops! There is no Internet Connection"}
    //    // content={"We're having a little difficulty in connecting to the Internet. Please check your connection and try again."}
    //    // buttonLabel={"Try Again"}
    //    // errorText={"We still can't connect - please try again."}
    //    // // MainComponent={<NoInternetScreen/>}
    //    // containerStyle={{backgroundColor: "white"}}
    //    // textStyle={{color: "black"}}
    //    // />
    //  )

    //      }
    // else {
    // console.log("second!!!");

    if (this.state.loading) {
      return null;
    }
    return (
      //   <AnimatedSplash
      //   translucent={true}
      //   isLoaded={true}
      //   logoImage={require("./assets/images/logo.png")}
      //   backgroundColor={"#fff"}
      //   logoHeight={hp(40)}
      //   logoWidth={wp(80)}
      // >

      <NotifierWrapper>
        <NavigationContainer ref={navigationRef}>
          {isAuthenticated ? (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              screenOptions={{
                swipeEnabled: false,
              }}
              initialRouteName="Home"
              hideStatusBar={Platform.OS == "ios" ? true : false}
              drawerType="slide"
            >
              <Drawer.Screen name="HomeDrawer" component={AuthenticatedStack} />
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

      // </AnimatedSplash>
    );
    // }
  }

  // const [dataLoaded, setDataLoaded] = useState(false)
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(App);
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
