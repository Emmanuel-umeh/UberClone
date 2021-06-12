import React, { Component } from "react";

import colors from "./colors/colors";
import {
  StyleSheet,
  Text,
  View,
  AppState,
  Dimensions,
  Alert,
  Vibration,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Image,
  BackHandler,
  Modal,
  Platform,
} from "react-native";
import { firebase } from "../firebase/firebase";

import uuid from "react-native-uuid";
import * as Permissions from "expo-permissions";
import store from "../redux/store";
import MapView, {
  Marker,
  AnimatedRegion,
  Callout,
  Overlay,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import DestinationButton from "../components/destinationButton";

import CurrentLocationButton from "../components/currentLocationButton";
import Back_to_select_screen_button from "../components/back_to_select_screen_button";

import { Ionicons } from "@expo/vector-icons";

import google_api from "../keys/google_map";
import { connect } from "react-redux";
import {
  regionFrom,
  getLatLonDiffInMeters,
  getTimeDiffInMinutes,
} from "../helpers/helper";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";

import BottomSheet from "reanimated-bottom-sheet";
import { Button, Content, Header, Icon, Item, Input } from "native-base";
import * as Animatable from "react-native-animatable";

// import { TouchableOpacity } from "react-native-gesture-handler";
import DriverDetailsPopUp from "./components/DriverDetailsPopUp";
import _ from "lodash";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomModal from "./components/Modal";
import LottieLoader from "react-native-lottie-loader";
import LottieView from "lottie-react-native";
// redux imports
import {
  makeOrder,
  cancelOrder,
  getOrder,
  test_redux_promisify,
} from "../redux/action/orderActions";
import { Audio } from "expo-av";
import { day_styles, night_styles } from "./map_styles/styles";
import { PureComponent } from "react";
import SetDestination from "./setDestination";

import Geocoder from "react-native-geocoding";
import ErrorModal from "./components/ErrorModal";
// Initialize the module (needs to be done only once)
Geocoder.init(google_api); // use a valid API key
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.02858723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta;
const LONGITUDE_DELTA = longitudeDelta;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}! 📬`,
      body: `${body}`,
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  // if (Constants.isDevice) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;

  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

class Map extends PureComponent {
  constructor(props) {
    super(props);

    // tracking the current order "on" function from firebase
    this.watching_current_order = null;
    this.watch_driver = null;

    // sound object
    this.soundObject = null;
    this.map = null;
    this.marker = React.createRef();
    this.destinationMarker = React.createRef();
    this.from_marker = React.createRef();
    this.driver_marker = React.createRef();
    this.bookRide = this.bookRide.bind(this);

    const { token } = this.props.auth;

    this.state = {
      map_is_ready: false,
      follow_user_location: true,
      show_user_location: true,

      // comfirm location modal toggler
      modal_visible: false,

      // set destination location toggler

      set_destination_modal: false,

      payment_method: "Cash",

      // if the app is in the foreground or background
      appstate: AppState.currentState,

      // driver marker coordinates

      coordinate: new AnimatedRegion({
        latitude: 9.8,
        longitude: 9.6,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      heading: 0,
      // array of available drivers
      available_presence_drivers: [],

      searching_for_driver: false,
      error_msg: null,
      driver: null,

      recent_orders: [],
    };
  }

  backAction = () => {
    if (this.props.order.destinationRequested) {
      // Alert.alert('Hold on!', 'Are you sure you want to cancel?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   { text: 'YES', onPress: () => BackHandler.exitApp() },
      // ]);

      this.cancelOrder();
      return true;
    } else {
      // Alert.alert('Hold on!', 'Are you sure you want to close White Axis?', [
      //   {
      //     text: 'Cancel',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   { text: 'YES', onPress: () => BackHandler.exitApp() },
      // ]);
      this.props.navigation.pop();
      return true;
    }
  };

  notifications_settings = () => {
    registerForPushNotificationsAsync().then((token) =>
      this.setState({
        token: token,
      })
    );

    this.notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log({ notification });
        this.setState({
          notification: notification,
        });
      });

    this.responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });
  };

  payment_method = (e) => {
    this.setState({
      payment_method: e,
    });
  };

  drawer_button = () => {
    return (
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          backgroundColor: "#fff",
          borderRadius: 50,
          position: "absolute",
          // display: inline-block;

          top: 40,
          left: 30,
          zIndex: 999,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          this.props.navigation.openDrawer();
          // this.bookRide();
        }}
      >
        <View>
          <Ionicons name="md-menu" size={32} color="black" />
        </View>
      </TouchableOpacity>
    );
  };
  back_button = () => {
    return (
      <TouchableOpacity
        style={{
          height: 55,
          width: 55,
          backgroundColor: "white",
          borderRadius: 50,
          position: "absolute",
          // display: inline-block;

          top: 40,
          left: 30,
          zIndex: 999,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          // this.props.navigation.openDrawer();

          // this.setState({

          // store.dispatch({
          //   type: "DESTINATION_CANCELLED",
          // });

          this.cancelOrder();
          // destinationRequested: false,
          // });
          // this.centerCamera();
        }}
      >
        <View>
          <Icon
            active
            style={{
              fontSize: 50,
              fontWeight: "bold",
              // color: "red",
            }}
            name="ios-close"
          />
        </View>
      </TouchableOpacity>
    );
  };

  destination_button = () => {
    return (
      <DestinationButton
        navigation={this.props.navigation}
        state={this.props.order}
        logistics={
          this.props.route.params
            ? this.props.route.params.logistics
            : this.props.order.logistic_type
        }
        selectDestination={this.selectDestination}
        show_set_destination={this.show_set_destination}
      />
    );
  };

  show_driver_marker = () => {
    const { logistic_type } = this.props.order;
    const { coordinate } = this.state;
    const { driver, heading } = this.state;


    if (coordinate) {
      return (
        <Marker.Animated
          // coordinate={{
          //   latitude: driver ? driver.latitude : 9.0765,
          //   longitude: driver ? driver.longitude : 7.3986,
          // }}
          coordinate={coordinate}
          anchor={{ x: 0.5, y: 0.5 }}
          centerOffset={{ x: 0.5, y: 0.5 }}
          title="Your Ride Is Here"
          ref={(marker) => {
            this.driver_marker = marker;
          }}
          style={{ width: 50, height: 50 }}
        >
          {logistic_type == "bike" ? (
            <Image
              source={require("../assets/images/bike.png")}
              resizeMode="contain"
              style={{
                width: 40,
                height: 40,
                transform: [
                  {
                    rotate: heading === undefined ? "0deg" : `${heading}deg`,
                  },
                ],
              }}
            />
          ) : logistic_type == "car" ? (
            <Image
              source={require("../assets/images/car.png")}
              resizeMode="contain"
              style={{
                width: 40,
                height: 40,
                transform: [
                  {
                    rotate: heading === undefined ? "0deg" : `${heading}deg`,
                  },
                ],
              }}
            />
          ) : logistic_type == "truck" ? (
            <Image
              source={require("../assets/images/truck.png")}
              resizeMode="contain"
              style={{
                width: 40,
                height: 40,
                transform: [
                  {
                    rotate: heading === undefined ? "0deg" : `${heading}deg`,
                  },
                ],
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/tanker.png")}
              resizeMode="contain"
              style={{
                width: 50,
                height: 50,
                transform: [
                  {
                    rotate: heading === undefined ? "0deg" : `${heading}deg`,
                  },
                ],
              }}
            />
          )}
        </Marker.Animated>
      );
    }
  };

  client_driver_location = async ({ longitude, latitude, heading }) => {
    try {
      if (longitude && latitude && heading) {
        console.log(
          "client driver location updated!! ? ",
          latitude,
          longitude,
          heading
        );

        var diff_in_minute_pickup = getTimeDiffInMinutes(
          this.props.order.region.latitude,
          this.props.order.region.longitude,
          latitude,
          longitude
        );

        console.log({ diff_in_minute_pickup });

        var COORDINATE_DRIVER_LOCATION = {
          coordinate: new AnimatedRegion({
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: longitude,
            latitude: latitude,
          }),

          diff_in_minute_pickup: diff_in_minute_pickup,
        };
        this.setState({
          coordinate: new AnimatedRegion({
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: longitude,
            latitude: latitude,
          }),
        });

        await this.animate(latitude, longitude);

        store.dispatch({
          type: "COORDINATE_DRIVER_LOCATION",
          payload: COORDINATE_DRIVER_LOCATION,
        });

        console.log("should center cameraA ooooo!!!!!!!!!!!!!!!!!!!");
        this.centerCamera();

        // if (diff_in_meter_pickup <= 100) {
        //   this.map.animateCamera(
        //     {
        //       center: {
        //         latitude,
        //         longitude,
        //       },
        //       pitch: 20,
        //       heading: 30,
        //       altitude: 100,
        //       zoom: 18,
        //     },
        //     800
        //   );
        // } else {
        //   this.centerCamera();
        // }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  client_found_driver = async () => {
    // found driver, the passenger has no say about this.
    // once a driver is found, this will be the driver that's going to drive the user
    // to their destination
    // Vibration.vibrate({pattern:500});

    try {
      const { current_order } = this.props.order;
      this.watch_driver = firebase
        .database()
        .ref("drivers/" + current_order.driver)
        .on("value", async (snapshot) => {
          if (snapshot.exists()) {
            const driver = snapshot.val();
            // consle.log("driver loaction updated!!!!!!!!!!!!!!!!!")
            //  this.setState({
            //    driver
            //  })

            //  console.log({driver})
            //  await this.state.coordinate.setValue({

            //   latitude: driver.location.latitude,
            //   longitude: driver.location.longitude,
            //   latitudeDelta: LATITUDE_DELTA,
            //   longitudeDelta: LONGITUDE_DELTA,
            // });

            const diff_in_minute_pickup = current_order.diff_in_minute_pickup;

            console.log({ diff_in_minute_pickup });
            var COORDINATE_DRIVER_LOCATION = {
              coordinate: new AnimatedRegion({
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
                latitude: driver.location.latitude,
                longitude: driver.location.longitude,
                heading: driver.location.heading,
              }),
              diff_in_minute_pickup: diff_in_minute_pickup,
            };

            console.log({ COORDINATE_DRIVER_LOCATION });
            this.setState({
              coordinate: new AnimatedRegion({
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
                longitude: driver.location.longitude,
                latitude: driver.location.latitude,
              }),
              heading: driver.location.heading,
            });

            await store.dispatch({
              type: "COORDINATE_DRIVER_LOCATION",
              payload: COORDINATE_DRIVER_LOCATION,
            });

            // this.setState({
            //   coordinate: new AnimatedRegion({
            //     latitudeDelta: 0.3,
            //     longitudeDelta: 0.3,
            //     latitude: driver.location.latitude,
            //   longitude: driver.location.longitude,
            //   heading : driver.location.heading
            //   })
            // })
            await store.dispatch({
              type: "FOUND_DRIVER",
            });
          }
        });

      schedulePushNotification(
        "Order Accepted",
        `Your driver is on his way to your pickup location`,
        null
      );
    } catch (error) {
      console.log(
        "error on found driver functionality!!!!!!!!!!!!!!!!!!!!1 ",
        error
      );
    } finally {
      return true;
    }
  };

  client_driver_message = async (data) => {
    try {
      if (data.type == "near_pickup") {
        //remove passenger marker

        await store.dispatch({
          type: "HAS_RIDDEN",
          // payload: data,
        });

        schedulePushNotification(
          "Driver Has Arrived",
          "Your driver is around your pickup location.",
          null
        );
        // this.setState({
        //   has_ridden: true,
        // });
      }

      // when the driver starts the ride
      if (data.type == "ride_started") {
        console.log("ride started by driver triggered ", data.order);

        this.loadSounds();
        await store.dispatch({
          type: "RIDE_UPDATED",
          payload: data.order,
        });

        this.centerCamera();

        schedulePushNotification(
          "Ride Started",
          "Your driver has started the ride",
          null
        );
      }
      if (data.type == "ride_ended") {
        console.log("ride ended by driver triggered ", data.order);

        this.loadSounds();
        await store.dispatch({
          type: "RIDE_UPDATED",
          payload: data.order,
        });

        this.centerCamera();

        schedulePushNotification(
          "Ride Ended",
          "Your driver has ended the ride",
          null
        );
      }
      if (data.type == "ride_completed") {
        console.log("ride completed by driver triggered ", data.order);

        const driver_id = data.order.driver;

        this.loadSounds();

        //  this.centerCamera();

        // passing the id of the driver as params to the rating page
        this.reset_navigation("driver_rating", driver_id);

        return await store.dispatch({
          type: "RIDE_COMPLETED",
        });
        // this.props.navigation.navigate("Driver_Rating")
      }

      if (data.type == "near_dropoff") {
        this.centerCamera();
      }

      Alert.alert(
        data.title,
        data.msg,
        [
          {
            text: "Okay!",
          },
        ],
        { cancelable: false }
      );

      schedulePushNotification(data.title, data.msg, null);
    } catch (error) {
      console.log("error in line 791!!!!!! ", error);
    }
  };

  isDay = () => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18;
  };

  driver_details_popup = () => {
    const { current_order } = this.props.order;
    if (current_order) {
      if (current_order.state !== "Pending" && current_order.driver) {
        return (
          <DriverDetailsPopUp
            driver={
              this.props.order.current_order
                ? this.props.order.current_order.driver
                : null
            }
            current_order={this.props.order.current_order}
          />
        );
      }
    }
  };

  map_view_directions = () => {
    // console.log("os day!!!!", this.isDay());

    try {
      const { current_order } = this.props.order;
      const { coordinate } = this.props.order;

      if (current_order && coordinate) {
        if (current_order.state !== "Pending") {
          // if (is_day) {

          return (
            <>
              {/* <MapViewDirections
                  origin={{
                    latitude : coordinate.latitude,
                    longitude : coordinate.longitude,
                  }}
                    strokeColor="#C68E17"
       
          lineDashPattern={[6, 6]}
                  destination={current_order.dropoff}
                  apikey={google_api}
                  strokeWidth={5}
                  strokeColor="#C68E17"
                  showsCompass={false}
                ></MapViewDirections> */}
              <Marker
                title="Your Destination"
                coordinate={{
                  latitude: current_order.dropoff.latitude,
                  longitude: current_order.dropoff.longitude,
                }}
                image={require("../assets/markers/marker7.png")}
                pinColor="#ffffff"
              />
            </>
          );
          // } else {
          // return (
          //   <>
          //     <MapViewDirections
          //         origin={{
          //           latitude : coordinate.latitude,
          //           longitude : coordinate.longitude,
          //         }}
          //        destination={current_order.dropoff}
          //        apikey={google_api}
          //        strokeWidth={5}
          //        strokeColor="whitesmoke"
          //        showsCompass={false}
          //     ></MapViewDirections>
          //     <MapView.Marker
          //       title="Your Destination"
          //       coordinate={current_order.dropoff}
          //       pinColor="#ffffff"
          //     />
          //   </>
          // );
          // }
        }
      }
    } catch (error) {
      console.log("error from mapview directions");
      console.log({ error });
    }
  };

  getMapStyles = () => {
    // console.log("time of the day !!!!!!!!" ,this.isDay())
    if (this.isDay()) {
      return day_styles;
    } else {
      return day_styles;
    }
  };

  bottom_sheet = () => {
    return (
      <BottomSheet
        ref={this.sheetRef}
        snapPoints={["65%", "30%", "10%"]}
        borderRadius={20}
        renderContent={this.renderContent}
        renderHeader={this.renderHeader}
        isBackDrop={true}
        isBackDropDismisByPress={true}
        isRoundBorderWithTipHeader={true}
        ref="BottomSheet"
        // isModal
        // containerStyle={{backgroundCol or:"red"}}
        tipStyle={{ backgroundColor: "black" }}
        headerStyle={{ backgroundColor: "red" }}
        // bodyStyle={{backgroundColor:"red",flex:1}}
        header={
          <View>
            <Text style={styles.text}>Header</Text>
          </View>
        }
      />
    );
  };

  // avalable presence drivers

  available_presence_drivers = () => {
    const { logistic_type } = this.props.order;

    firebase
      .database()
      .ref("drivers")
      .limitToFirst(10)
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          const drivers = snapshot.val();
          if (drivers) {
            return drivers.map((driver) => (
              <Marker.Animated
                coordinate={{
                  latitude: driver.location.latitude,
                  longitude: driver.location.longitude,

                  // latitude : 9.8966795,
                  // longitude : 8.8993336,
                }}
                key={driver.lisence_number}
                // coordinate={this.state.available_presence_drivers[0].info}
                anchor={{ x: 0.5, y: 0.5 }}
                centerOffset={{ x: 0.5, y: 0.5 }}
                // ref={(marker) => {
                //   this.driver_marker = marker;
                // }}
                style={{ width: 50, height: 50 }}
              >
                {logistic_type == "bike" ? (
                  <Image
                    source={require("../assets/images/bike.png")}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      transform: [
                        {
                          rotate: !driver.location.heading
                            ? "0deg"
                            : `${driver.location.heading}deg`,
                        },
                      ],
                    }}
                  />
                ) : logistic_type == "car" ? (
                  <Image
                    source={require("../assets/images/car.png")}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      transform: [
                        {
                          rotate: !driver.location.heading
                            ? "0deg"
                            : `${driver.location.heading}deg`,
                        },
                      ],
                    }}
                  />
                ) : logistic_type == "truck" ? (
                  <Image
                    source={require("../assets/images/truck.png")}
                    resizeMode="contain"
                    style={{
                      width: 40,
                      height: 40,
                      transform: [
                        {
                          rotate: !driver.location.heading
                            ? "0deg"
                            : `${driver.location.heading}deg`,
                        },
                      ],
                    }}
                  />
                ) : (
                  <Image
                    source={require("../assets/images/tanker.png")}
                    resizeMode="contain"
                    style={{
                      width: 50,
                      height: 50,
                      transform: [
                        {
                          rotate: !driver.location.heading
                            ? "0deg"
                            : `${driver.location.heading}deg`,
                        },
                      ],
                    }}
                  />
                )}
              </Marker.Animated>
            ));
          }
        }
      });
  };

  // this will check if the user order has started so as to hide user location

  loadSounds = async () => {
    this.soundObject = new Audio.Sound();
    try {
      console.log("Loading sounds!!!!!!!!!!!!!!!!!!!!!!");
      Vibration.vibrate(500);
      await this.soundObject.loadAsync(
        require("../assets/sounds/notification.mp3")
      );
      await this.soundObject.playAsync();
      // Your sound is playing!
      console.log("played sound");

      // Don't forget to unload the sound from memory
      // when you are done using the Sound object
    } catch (error) {
      console.log({ error });
      // An error occurred!
    }
  };

  toggleModal = () => {
    this.setState({
      error_msg: null,
    });
  };
  current_location_button = () => {
    return (
      <CurrentLocationButton
        cb={() => {
          this.centerCamera();
        }}
        order={this.props.order.current_order}
        destination={this.props.order.destinationRequested}
        onPress={() => {
          this.refs.BottomSheet.current.snapTo(9);
        }}
      />
    );
  };

  // destination_marker = () => {
  //   const {current_order} = this.props.order
  //   if (this.isDay) {
  //     return (
  //       <>
  //         <MapViewDirections
  //           origin={this.props.order.region}
  //           destination={current_order.dropoff}
  //           apikey={google_api}
  //           strokeWidth={5}
  //           strokeColor="#C68E17"
  //           showsCompass={false}
  //           onError={() => {
  //             alert("Could not find a path to your destination");
  //           }}
  //         ></MapViewDirections>

  //         {/* the destination marker */}
  //         <Marker
  //           title={
  //             current_order.dropoff
  //               ? current_order.dropoff.going_address
  //               : "Your Destination"
  //           }
  //           ref={(marker) => {
  //             this.destinationMarker = marker;
  //           }}
  //           image={require("../assets/markers/marker6.png")}
  //           key={`${current_order.dropoff.latitude}_${current_order.dropoff.longitude}`}
  //           coordinate={{
  //             latitude: current_order.dropoff
  //               ? current_order.dropoff.latitude
  //               : 9.0765,
  //             longitude: current_order.dropoff
  //               ? current_order.dropoff.longitude
  //               : 7.3986,
  //           }}
  //           pinColor="green"
  //         >
  //           <Callout tooltip={false}>
  //             <Content style={{ width: undefined, backgroundColor: "white" }}>
  //               <Item
  //                 style={{
  //                   padding: 10,
  //                 }}
  //               >
  //                 <Icon
  //                   active
  //                   name="pin"
  //                   style={{
  //                     color: "#C68E17",

  //                     fontSize: 20,
  //                   }}
  //                 />
  //                 <Text
  //                   style={{
  //                     fontSize: 12,
  //                     fontFamily: "Quicksand-Medium",
  //                   }}
  //                 >
  //                   {this.props.order.dropoff.going_address
  //                     ? this.props.order.dropoff.going_address
  //                     : "Your Destination"}
  //                 </Text>
  //               </Item>
  //             </Content>
  //           </Callout>
  //         </Marker>

  //         {/* the user marker */}

  //         <Marker
  //           title={
  //             this.props.order.my_address
  //               ? this.props.order.my_address
  //               : "You are here"
  //           }
  //           ref={(marker) => {
  //             this.from_marker = marker;
  //           }}
  //           image={require("../assets/markers/marker7.png")}
  //           key={`${this.props.order.region.latitude}_${this.props.order.region.longitude}`}
  //           coordinate={{
  //             latitude: this.props.order.region
  //               ? this.props.order.region.latitude
  //               : 9.0765,
  //             longitude: this.props.order.region
  //               ? this.props.order.region.longitude
  //               : 7.3986,
  //           }}
  //           pinColor="green"
  //         >
  //           <Callout tooltip={false}>
  //             <Content style={{ width: undefined, backgroundColor: "white" }}>
  //               <Item
  //                 style={{
  //                   padding: 10,
  //                 }}
  //               >
  //                 {/* <Pulse color='orange' numPulses={3} diameter={400} speed={20} duration={2000} > */}
  //                 <Icon
  //                   active
  //                   name="pin"
  //                   style={{
  //                     color: "#C68E17",

  //                     fontSize: 20,
  //                   }}
  //                 />

  //                 {/* </Pulse> */}
  //                 <Text
  //                   style={{
  //                     fontSize: 12,
  //                     fontFamily: "Quicksand-Medium",
  //                   }}
  //                 >
  //                   {this.props.order.my_address
  //                     ? this.props.order.my_address
  //                     : "Your are here"}
  //                 </Text>
  //               </Item>
  //             </Content>
  //           </Callout>
  //         </Marker>
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <MapViewDirections
  //           origin={this.props.order.region}
  //           destination={this.props.order.going}
  //           apikey={google_api}
  //           strokeWidth={5}
  //           mode="DRIVING"
  //           strokeColor="white"
  //           showsCompass={false}
  //           onError={() => {
  //             alert("Could not find a path to your destination");
  //           }}
  //         ></MapViewDirections>
  //         <Marker
  //           title={
  //             this.props.order.going.name
  //               ? this.props.order.going.name
  //               : "Your Destination"
  //           }
  //           ref={(marker) => {
  //             this.destinationMarker = marker;
  //           }}
  //           key={`${this.props.order.going.latitude}_${this.props.order.going.longitude}`}
  //           coordinate={{
  //             latitude: this.props.order.going
  //               ? this.props.order.going.latitude
  //               : 9.0765,
  //             longitude: this.props.order.going
  //               ? this.props.order.going.longitude
  //               : 7.3986,
  //           }}
  //           pinColor="green"
  //         >
  //           <Callout tooltip={false}>
  //             <Content
  //               style={{
  //                 width: undefined,
  //                 height: 20,
  //                 backgroundColor: "white",
  //               }}
  //             >
  //               <Item
  //                 style={{
  //                   padding: 10,
  //                 }}
  //               >
  //                 <Icon
  //                   active
  //                   name="pin"
  //                   style={{
  //                     color: "blue",

  //                     fontSize: 18,
  //                   }}
  //                 />
  //                 <Text
  //                   style={{
  //                     fontSize: 15,
  //                     fontFamily: "Quicksand-Bold",
  //                   }}
  //                 >
  //                   {this.props.order.going.name
  //                     ? this.props.order.going.name
  //                     : "Your Destination"}
  //                 </Text>
  //               </Item>
  //             </Content>
  //           </Callout>
  //         </Marker>
  //       </>
  //     );
  //   }
  // };

  // chech_ride_state = async () => {
  //   const { user, token } = this.props.auth;

  //   console.log("reconnecting me!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  //   if (this.props.order.order) {
  //     const data = await this.props.getOrder(token, this.props.order.order._id);
  //     console.log({ data });
  //     if (data.state == "Completed") {
  //       // return
  //       this.loadSounds();

  //       //  this.centerCamera();

  //       // passing the id of the driver as params to the rating page
  //       this.reset_navigation("driver_rating", data.driver);

  //       return await store.dispatch({
  //         type: "RIDE_COMPLETED",
  //       });
  //     }
  //     else if(data.cancelled){

  //   await store.dispatch({
  //     type: "CANCEL_ORDER",
  //   });
  //     }
  //   }
  // };

  // reconnect a user to previous ride
  reconnect_client = async () => {
    const { user } = this.props.auth;

    // console.log("reconnecting me!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // if (this.props.order.order) {
    //   const data = await this.props.getOrder(token, this.props.order.order._id);
    //   console.log({ data });
    //   if (data.state == "Completed") {
    //     // return
    //     this.loadSounds();

    //     //  this.centerCamera();

    //     // passing the id of the driver as params to the rating page
    //     this.reset_navigation("driver_rating", data.driver);

    //     return await store.dispatch({
    //       type: "RIDE_COMPLETED",
    //     });
    //   }
    // }

    this.chech_ride_state();

    // this.user_ride_channel.bind("client-driver-available", (data) => {
    //   console.log("clients driver response!!!!!");
    //   console.log("driver has ride  ??? ", this.props.order.has_ride);
    //   let passenger_response = "no";
    //   if (!this.props.order.has_ride) {
    //     passenger_response = "yes";
    //   }

    //   // passenger responds to driver's response
    //   this.user_ride_channel.trigger("client-driver-response", {
    //     response: passenger_response,
    //   });
    // });

    // this.user_ride_channel.bind("client-found-driver", (data) => {
    //   this.client_found_driver(data);
    // });

    // this.user_ride_channel.bind("client-driver-location", (data) => {
    //   // console.log("Reveiced location on the reconnect client channel!!!!!!!!!!!!!!!!!!!!!")
    //   this.client_driver_location(data);
    // });

    // // get the heading for the driver
    // // this.user_ride_channel.bind("client-driver-heading", (data) => {
    // //  store.dispatch({
    // //    type : "DRIVER_HEADING",
    // //    payload : data.trigger_heading ? data.trigger_heading : 0
    // //  })

    // // });

    // this.user_ride_channel.bind("client-driver-message", (data) => {
    //   this.client_driver_message(data);
    // });

    // }
  };

  driver_arrived = () => {
    schedulePushNotification(
      "Driver Arrived",
      "Your driver has arrived at your location.",
      null
    );
    this.loadSounds();
    return this.centerCamera();
  };
  ride_started = () => {
    schedulePushNotification(
      "Ride Started",
      "Your driver has started the trip.",
      null
    );
    this.loadSounds();
    return this.centerCamera();
  };
  ride_ended = () => {
    schedulePushNotification(
      "Ride Ended",
      "Your driver has ended the trip. Please pay the driver",
      null
    );
    this.loadSounds();
    return this.centerCamera();
  };
  ride_completed = () => {
    this.loadSounds();

    const uid = firebase.auth().currentUser.uid;
    //  this.centerCamera();

    // passing the id of the driver as params to the rating page
    if (this.props.order.current_order) {
      this.reset_navigation("driver_rating", {
        driver: this.props.order.current_order.driver,
      });
      // cleanup
      firebase
        .database()
        .ref("orders/" + this.props.auth.user.current_order)
        .off("value", this.watching_current_order);
      firebase
        .database()
        .ref("users/" + uid)
        .update({
          current_order: null,
        });
      store.dispatch({
        type: "RIDE_COMPLETED",
      });
    }
  };
  ride_cancelled = () => {
    this.loadSounds();
    schedulePushNotification("Ride Cancelled", "Your ride was cancelled", null);
    //  this.centerCamera();

    // passing the id of the driver as params to the rating page
    if (this.props.order.current_order) {
      firebase
        .database()
        .ref("orders/" + this.props.auth.user.current_order)
        .off("value", this.watching_current_order);
      firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .update({
          current_order: null,
        });
      store.dispatch({
        type: "ORDER_CANCELLED",
      });

      return this.centerCamera();
    }
  };
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);

    console.log("error from component did catch ", { error, errorInfo });
  }
  async componentDidMount() {
    store.dispatch({
      type: "PERFORMING_TASK_ENDED",
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    this.fetch_recent_orders();
  }

  fetch_recent_orders = () => {
    const uid = firebase.auth().currentUser.uid;

    firebase
      .database()
      .ref("orders/")
      .orderByChild("owner")
      .equalTo(uid)
      .limitToLast(5)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const orders = snapshot.val();
          Object.entries(orders).forEach(([key, value]) => {
            this.setState({
              recent_orders: [...this.state.recent_orders, value],
            });
          });
        }
      });
  };

  async componentDidUpdate(prevProps) {
    if (this.props.auth.user.location !== prevProps.auth.user.location) {
      this.centerCamera();
    }

    if (
      prevProps.order.current_order &&
      prevProps.auth.user.current_order &&
      this.props.order.current_order
    ) {
      if (
        prevProps.order.current_order.state !==
        this.props.order.current_order.state
      ) {
        if (this.props.order.current_order.state === "Accepted") {
          console.log("driver accepted");
          await this.client_found_driver();
          this.loadSounds();

          return this.centerCamera();
        }
        if (this.props.order.current_order.state === "Arrived") {
          console.log("driver arrived");
          return this.driver_arrived();
        }
        if (this.props.order.current_order.state === "Started") {
          console.log("ride started");
          return this.ride_started();
        }
        if (this.props.order.current_order.state === "Ended") {
          console.log("ride ended");
          return this.ride_ended();
        }
        if (this.props.order.current_order.state === "Completed") {
          console.log("ride completed");
          return this.ride_completed();
        }

        if (this.props.order.current_order.state === "Canclled") {
          // console.log("ride completed")
          return this.ride_cancelled();
        }

        /**
   *     if (data.type == "ride_started") {
          console.log("ride started by driver triggered ", data.order);
  
          this.loadSounds();
          await store.dispatch({
            type: "RIDE_UPDATED",
            payload: data.order,
          });
  
          this.centerCamera();
  
          schedulePushNotification(
            "Ride Started",
            "Your driver has started the ride",
            null
          );
        }
        if (data.type == "ride_ended") {
          console.log("ride ended by driver triggered ", data.order);
  
          this.loadSounds();
          await store.dispatch({
            type: "RIDE_UPDATED",
            payload: data.order,
          });
  
          this.centerCamera();
  
          schedulePushNotification(
            "Ride Ended",
            "Your driver has ended the ride",
            null
          );
        }
        if (data.type == "ride_completed") {
          console.log("ride completed by driver triggered ", data.order);
  
          const driver_id = data.order.driver;
  
          this.loadSounds();
  
          //  this.centerCamera();
  
          // passing the id of the driver as params to the rating page
          this.reset_navigation("driver_rating", driver_id);
  
          return await store.dispatch({
            type: "RIDE_COMPLETED",
          });
          // this.props.navigation.navigate("Driver_Rating")
        }
  
   */
      }
    }
  }

  mounting_functions = async () => {
    try {
      console.log("mounting function!!!!!!!!!!!!!!!!!!!");
      if (this.props.auth.user.current_order) {
        console.log("reconnecting driver!!!!!!!!!!!");
      
        this.watching_current_order =  firebase
          .database()
          .ref("orders/" + this.props.auth.user.current_order)
          .on("value", function (snapshot) {
            const updated_order = snapshot.val();
            console.log("gotten the order!!!!!!")
            store.dispatch({
              type: "ORDER_UPDATED",
              payload: updated_order,
            });
          });


          firebase
          .database()
          .ref("orders/" + this.props.auth.user.current_order)
          .once("value",  (snapshot) =>  {
            if(snapshot.exists()){

              const updated_order   = snapshot.val()

         

              if (updated_order) {
                firebase
                  .database()
                  .ref("drivers/" + updated_order.driver)
                  .once("value", (snapshot) => {
                   
                    if (snapshot.exists()) {

                      console.log('found the driver responsible ',    snapshot.val())
                      const driver = snapshot.val();
      
                      const diff_in_minute_pickup =
                        updated_order.diff_in_minute_pickup;
      
                      console.log({ diff_in_minute_pickup });
                      var COORDINATE_DRIVER_LOCATION = {
                        coordinate: new AnimatedRegion({
                          latitudeDelta: 0.3,
                          longitudeDelta: 0.3,
                          latitude: driver.location.latitude,
                          longitude: driver.location.longitude,
                          heading: driver.location.headingg,
                        }),
                        diff_in_minute_pickup: diff_in_minute_pickup ? diff_in_minute_pickup : 1,
                      };
      
                      console.log({ COORDINATE_DRIVER_LOCATION });
      
                      this.setState({
                        coordinate: new AnimatedRegion({
                          latitudeDelta: 0.3,
                          longitudeDelta: 0.3,
                          longitude: driver.location.longitude,
                          latitude: driver.location.latitude,
                        }),
                      });
                      store.dispatch({
                        type: "COORDINATE_DRIVER_LOCATION",
                        payload: COORDINATE_DRIVER_LOCATION,
                      });
                    }
                  });
      
                // create an onchange handler to handle the driver locations update
                this.watch_driver = firebase
                  .database()
                  .ref("drivers/" + updated_order.driver)
                  .on("child_changed", (snapshot) => {
                    console.log(
                      "finding driver from current_order triggered!!!!!!!!!!!!!!!!!!!!!!",
                      snapshot.val()
                    );
                    if (snapshot.exists()) {
                      const driver = snapshot.val();
      
                      if (driver.longitude && driver.latitude) {
                        const diff_in_minute_pickup =
                          updated_order.diff_in_minute_pickup;
      
                        console.log({ diff_in_minute_pickup });
                        var COORDINATE_DRIVER_LOCATION = {
                          coordinate: new AnimatedRegion({
                            latitudeDelta: 0.3,
                            longitudeDelta: 0.3,
                            latitude: driver.location.latitude,
                            longitude: driver.location.longitude,
                            heading: driver.location.headingg,
                          }),
                          diff_in_minute_pickup: diff_in_minute_pickup ? diff_in_minute_pickup : 1 ,
                        };
      
                        console.log({ COORDINATE_DRIVER_LOCATION });
      
                        // this.setState({
                        //   coordinate : new AnimatedRegion({
                        //     latitudeDelta: 0.3,
                        //     longitudeDelta: 0.3,
                        //     longitude: driver.location.longitude,
                        //     latitude: driver.location.latitude,
                        //   }),
                        // })
      
                        this.animate(driver.latitude, driver.longitude);
                        store.dispatch({
                          type: "COORDINATE_DRIVER_LOCATION",
                          payload: COORDINATE_DRIVER_LOCATION,
                        });
                      }
                    }
                  });
      
                setTimeout(() => {
                  return this.setState(
                    {
                      map_is_ready: true,
                    },
                    () => {
                      this.centerCamera();
                    }
                  );
                }, 1000);
      
                // this.centerCamera();
              }
            }
          

           })


       
      } else {
        await store.dispatch({
          type: "CANCEL_ORDER",
        });

        setTimeout(() => {
          return this.setState(
            {
              map_is_ready: true,
            },
            () => {
              console.log("done!!!!");
              this.centerCamera();
            }
          );
        }, 1000);
      }

      this.setState({
        map_is_ready: true,
      });
    } catch (error) {
      console.log("error in mounting functions ", error);
      return this.setState(
        {
          map_is_ready: true,
        },
        () => {
          setTimeout(() => {
            this.centerCamera();
          }, 1000);
        }
      );
    }
  };

  navigate = (name) => {
    return this.props.navigation.navigate(name);
  };

  fit_markers_to_map = (latitude, longitude) => {
    if (Platform.OS === "ios") {
      this.map &&
        this.map.fitToCoordinates(
          [
            {
              latitude,
              longitude,
            },

            {
              latitude: this.props.order.region.latitude,
              longitude: this.props.order.region.longitude,
            },
          ],
          {
            edgePadding: {
              // bottom: hp("70%"),
              // right: wp("40%"),
              // top: hp("40%"),
              // left: wp("10%"),

              bottom: 10,
              right: 10,
              top: 10,
              left: 10,
            },
            animated: true,
          }
        );
    } else {
      this.map &&
        this.map.fitToCoordinates(
          [
            {
              latitude,
              longitude,
            },

            {
              latitude: this.props.order.region.latitude,
              longitude: this.props.order.region.longitude,
            },
          ],
          {
            edgePadding: {
              bottom: hp("70%"),
              right: wp("40%"),
              top: hp("40%"),
              left: wp("10%"),
            },
            animated: true,
          }
        );
    }
  };

  centerCamera = () => {
    try {
      if (this.props.order.current_order) {
        if (
          this.props.order.current_order.state === "Accepted" &&
          this.props.order.coordinate
        ) {
          // var { latitude, longitude } = this.props.order.coordinate;
          const latitude = this.props.order.coordinate.latitude;
          const longitude = this.props.order.coordinate.longitude;

          console.log(
            " fitting to coordinates latitude and longitude from center camera ",
            {
              latitude,
              longitude,
            }
          );
          this.map &&
            this.map.fitToCoordinates(
              [
                {
                  latitude,
                  longitude,
                },

                {
                  latitude: this.props.order.region.latitude,
                  longitude: this.props.order.region.longitude,
                  // latitude: this.props.order.current_order.dropoff.latitude,
                  // longitude: this.props.order.current_order.dropoff.longitude,
                },
              ],
              {
                edgePadding: {
                  bottom: hp(100),
                  right: wp(40),
                  top: hp(30),
                  left: wp(20),
                },
                animated: true,
              }
            );
        } else if (
          this.props.order.coordinate &&
          this.props.order.current_order.state === "Started"
        ) {
          var { latitude, longitude } = this.props.order.coordinate;

          // const latitude = this.props.order.going.latitude
          // const longitude = this.props.order.going.longitude

          this.map &&
            this.map.fitToCoordinates(
              [
                {
                  latitude,
                  longitude,
                },

                {
                  latitude: this.props.order.current_order.dropoff.latitude,
                  longitude: this.props.order.current_order.dropoff.longitude,
                },
              ],
              {
                edgePadding: {
                  bottom: hp("60%"),
                  right: wp("40%"),
                  top: hp("20%"),
                  left: wp("10%"),
                },
                animated: true,
              }
            );
        } else if (
          this.props.order.coordinate &&
          this.props.order.current_order.state === "Arrived"
        ) {
          var { latitude, longitude } = this.props.order.coordinate;

          // const latitude = this.props.order.going.latitude
          // const longitude = this.props.order.going.longitude

          this.map &&
            this.map.fitToCoordinates(
              [
                {
                  latitude,
                  longitude,
                },

                {
                  latitude: this.props.order.region.latitude,
                  longitude: this.props.order.region.longitude,
                },
              ],
              {
                edgePadding: {
                  bottom: hp("60%"),
                  right: wp("40%"),
                  top: hp("20%"),
                  left: wp("10%"),
                },
                animated: true,
              }
            );
        } else {
          console.log(
            "no orders drivers location was passed....!!!!!!!!!!!!11",
            this.props.order.coordinate
          );

          this.map &&
            this.map.animateCamera(
              {
                center: {
                  latitude: this.props.order.region.latitude,
                  longitude: this.props.order.region.longitude,
                },
                pitch: 20,
                heading: 30,
                altitude: 100,
                zoom: 16,
              },
              800
            );
        }
      } else if (this.props.order.current_order) {
        console.log("centering ,map Destination requested!!!!!!!!!!!");
        const latitude = this.props.order.current_order.dropoff.latitude;
        const longitude = this.props.order.current_order.dropoff.longitude;

        this.fit_markers_to_map(latitude, longitude);

        try {
          this.destinationMarker.showCallout();
        } catch (error) {
          console.warn("Could not callotu destination marker");
        }
      } else {
        console.log("all the above failed");
        const { latitude, longitude } = this.props.order.region;

        console.log(typeof latitude);
        this.map &&
          this.map.animateCamera(
            {
              center: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
              pitch: 20,
              heading: 30,
              altitude: 2000,
              zoom: 16,
            },
            800
          );
      }
    } catch (error) {
      console.log("error from centercamera ", { error });
    }
  };

  // used to replace screens so user cant go back
  reset_navigation = (screenName, param) => {
    // reset navigation!!,
    this.props.navigation.dispatch(
      StackActions.replace(screenName, { param: param })
    );
  };

  animate = async (latitude, longitude) => {
    try {
      const newCoordinate = {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      // if (Platform.OS == "android") {
      //   if (this.marker.current) {
      //     this.marker.current.animateMarkerToCoordinate(newCoordinate, 7000);
      //   }
      // } else {
      this.state.coordinate.timing(newCoordinate).start();
      // }
    } catch (error) {
      console.log({ error });
      return false;
    }
  };

  centerMap = () => {
    try {
      const { latitudeDelta, longitudeDelta, latitude, longitude } =
        this.props.order.region;

      this.map &&
        this.map.animateCamera(
          {
            center: {
              latitude,
              longitude,
            },
            pitch: 0,
            heading: 30,
            altitude: 100,
            zoom: 15,
          },
          1500
        );
    } catch (error) {
      console.warn(error);
    }
  };

  selectDestination = async (going, from) => {
    try {
      console.log("performing the select destination ", going);
      var data = {
        from: from ? from : null,
        going: going,
        destinationRequested: true,
        latitudeDelta: 0.1,
      };

      var { user } = this.props.auth;

      console.log("data passed to the selet destination , ", data);

      // if their is a from data, the user  region will be updated to the from data
      await store.dispatch({
        type: "SELECT_DESTINATION",
        payload: data,
      });
      // this.setState({

      // });

      this.setState({
        show_user_location: false,
      });

      const latitude = going.latitude;
      const longitude = going.longitude;

      // i modified this to return km not meters
      var diff_in_meter_pickup = getLatLonDiffInMeters(
        this.props.order.region.latitude,
        this.props.order.region.longitude,
        going.latitude,
        going.longitude
      );

      console.log({ diff_in_meter_pickup });
      // const database_price = this.props.order.price ? this.props.order.price : 67

      // var price = diff_in_meter_pickup * database_price + parseInt(user.debt, 10);

      // console.log("price of database!!!!!!!!!!!!!!! ", this.props.order.price);

      // await store.dispatch({
      //   type: "PRICE_UPDATED",
      //   payload: price,
      // });
      // this.setState({

      // });

      await this.close_set_destination();

      //  this._getLocationAsync

      setTimeout(() => {
        try {
          this.fit_markers_to_map(latitude, longitude);

          this.destinationMarker.showCallout();
        } catch (error) {
          console.warn("Could not callotu destination marker 2");
        }
      }, 500);
    } catch (error) {
      console.warn(error);
      alert("Oops, an error occured. Please try again");
    }
  };

  bookRide = async (
    payment_method,
    updated_location_from,
    destination_location,
    price
    // map_snapshot
  ) => {
    try {
      console.log(
        "props route !!!!!!!!!!!!!!!!!!!!!!!!!!!",
        this.props.route.params.from_location
      );
      console.log(
        "updated_location !!!!!!!!!!!!!!!!!!!!!!!!!!!",
        updated_location_from
      );
      console.log(
        "region !!!!!!!!!!!!!!!!!!!!!!!!!!!",
        this.props.order.my_address
      );

      // store.dispatch({
      //   type : "SET_LOADING"
      // })

      let pickup_data = {
        latitude:
          updated_location_from && updated_location_from.latitude
            ? updated_location_from.latitude
            : this.props.route.params.from_location
            ? this.props.route.params.from_location.latitude
            : this.props.order.region.latitude,
        from_address:
          updated_location_from && updated_location_from.address_name
            ? updated_location_from.address_name
            : this.props.route.params.from_location &&
              this.props.route.params.from_location.fromName
            ? this.props.route.params.from_location.fromName
            : this.props.order.my_address,
        longitude:
          updated_location_from && updated_location_from.longitude
            ? updated_location_from.longitude
            : this.props.route.params.from_location
            ? this.props.route.params.from_location.longitude
            : this.props.order.region.longitude,
      };

      let dropoff_data = {
        going_address: destination_location.name,
        latitude: destination_location.latitude,
        longitude: destination_location.longitude,
      };

      const data = {
        price: price,
        pickup: pickup_data,
        dropoff: dropoff_data,
        payment_method,
        state: "Pending",
        owner: firebase.auth().currentUser.uid,
        ref: uuid.v4(),
        logistic_type: this.props.order.logistic_type,
      };

      console.log({ data });

      var new_order = firebase
        .database()
        .ref("orders/")
        .push({
          price: price,
          pickup: pickup_data,
          dropoff: dropoff_data,
          payment_method,
          state: "Pending",
          owner: firebase.auth().currentUser.uid,
          ref: data.ref,
          logistic_type: this.props.order.logistic_type,
          createdAt: Date.now(),
          // map_snapshot : map_snapshot
        })
        .getKey();

      firebase
        .database()
        .ref("orders/" + new_order)
        .update({
          key: new_order,
        });

      console.log("new order key!!!! ", new_order);

      firebase
        .database()
        .ref("orders/" + new_order)
        .once("value", function (snapshot) {
          if (snapshot.exists()) {
            store.dispatch({
              type: "MAKE_ORDER",
              payload: snapshot.val(),
            });
          }
        });

      firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .update({
          current_order: new_order,
        });

      this.watching_current_order = firebase
        .database()
        .ref("orders/" + new_order)
        .on("value", function (snapshot) {
          const updated_order = snapshot.val();
          console.log({ updated_order });
          store.dispatch({
            type: "ORDER_UPDATED",
            payload: updated_order,
          });
        });

      this.setState({
        show_user_location: true,
        searching_for_driver: true,
      });
    } catch (error) {
      store.dispatch({
        type: "END_LOADING",
      });
      console.log("error!!!!!!!!!! ", error);
      // alert("Could not request your order. Please try again.")
      this.setState({
        error_msg: "Could not request your order. Please try again.",
      });
    }
  };

  driver_cancelled = async () => {
    await store.dispatch({
      type: "PERFORMING_TASK",
    });

    await store.dispatch({
      type: "CANCEL_ORDER",
    });
    await store.dispatch({
      type: "END_LOADING",
    });

    // persistStore(store).purge();

    this.setState({
      show_user_location: true,
    });
    this.close_modal();
    this._getLocationAsync();
    await this.centerCamera();

    store.dispatch({
      type: "PERFORMING_TASK_ENDED",
    });
  };

  cancelOrder = async () => {
    // this.setState({
    //   is_searching: false,
    // });

    try {
      const { user } = this.props.auth;
      if (user.current_order) {
        const { state } = this.props.order.current_order;
        // console.log({state})
        if (state == "Ended" || state == "Completed") {
          console.log("Please complete the payment for your current ride");
          return this.setState({
            error_msg: "Please complete the payment for your current ride",
          });
        }

        Alert.alert(
          "Cancel Order",
          "Are you sure you want to cancel this order?",
          [
            {
              text: "Yes",
              onPress: async () => {
                firebase
                  .database()
                  .ref("orders/" + user.current_order)
                  .update({
                    state: "Cancelled",
                  });

                firebase
                  .database()
                  .ref("users/" + firebase.auth().currentUser.uid)
                  .update({
                    current_order: null,
                  });

                await store.dispatch({
                  type: "CANCEL_ORDER",
                });

                this.setState({
                  show_user_location: true,
                });
                this.close_modal();
                this._getLocationAsync();
                this.fetch_recent_orders();
                // await this.centerCamera();

                // store.dispatch({
                //   type: "PERFORMING_TASK_ENDED",
                // });
              },
            },
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            // { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      } else {
        console.log("failed to cancel order");
        this.setState({
          error_msg: "Failed to cancel this order",
        });
      }
    } catch (error) {
      // this.close_modal();

      // this.setState({
      //   show_user_location: true,
      // });
      // this.centerCamera();
      console.log({ error });
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
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
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      maximumAge: 20000,
      enableHighAccuracy: true,
      timeInterval: 8000,
      distanceInterval: 10,
      timeout: 20000,
    });

    var my_location = regionFrom(
      location.coords.latitude,
      location.coords.longitude,
      location.coords.accuracy
    );

    this.map &&
      this.map.animateCamera(
        {
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          pitch: 20,
          heading: 30,
          altitude: 100,
          zoom: 16,
        },
        800
      );

    this.setState({
      my_location: my_location,
    });

    // const address = await Location.reverseGeocodeAsync({
    //   latitude: location.coords.latitude,
    //   longitude: location.coords.longitude,
    // });

    Geocoder.from(location.coords.latitude, location.coords.longitude)
      .then((json) => {
        var address =
          json.results[0].address_components[0].long_name +
          " " +
          json.results[0].address_components[1].long_name;
        // console.log( json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name )
        // var addressComponent = json.results[0].address_components[0];
        // console.log({addressComponent});

        let region = {
          latitude: my_location.latitude,
          longitude: my_location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.06,
        };

        var data = {
          region: region,
          my_address: address,
          accuracy: location.coords.accuracy,
          // addressShortName: addressComponent,
        };

        store.dispatch({
          type: "GET_LOCATION",
          payload: data,
        });

        this.watchId = location;
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  componentWillUnmount() {
    // this.persist_state_data();
    navigator.geolocation.clearWatch(this.watchId);

    this.soundObject && this.soundObject.unloadAsync();
  }

  renderContent = () => (
    <Animatable.View animation="slideInUp" delay={1300} style={styles.rect}>
      <SelectLogistics
        navigation={this.props.navigation}
        style={
          (styles.Bike,
          { backgroundColor: this.state.isBikeSelected ? "gold" : null })
        }
      ></SelectLogistics>
    </Animatable.View>
  );

  renderHeader = () => {
    // <Header />
    <View>
      <Text>Header</Text>
    </View>;
  };

  // close the confirm sreen modal
  close_modal = () => {
    // this.cancelOrder()
    this.setState({
      searching_for_driver: false,
    });
  };
  show_set_destination = () => {
    this.setState({
      set_destination_modal: true,
    });
  };
  close_set_destination = async () => {
    await this.setState({
      set_destination_modal: false,
    });
  };

  // open confirm location modal

  open_modal = () => {
    this.setState({
      modal_visible: true,
    });
  };

  sheetRef = React.createRef(null);

  render() {
    var show_user_location = this.state.show_user_location;

    if (this.props.order.current_order) {
      show_user_location = this.props.order.current_order.state !== "Started";
      // this.chech_ride_state();
    }

    return (
      <View style={styles.container}>
        <MapView
          followUserLocation={show_user_location}
          initialRegion={this.props.order.region}
          rotateEnabled={false}
          provider="google"
          showsUserLocation={show_user_location}
          showsBuildings={true}
          zoomEnabled={true}
          showsCompass={false}
          // mapPadding ={{
          //   top :300,
          //   left : 0,
          //   right : 0,
          //   bottom : 0
          // }}
          // provider="google"
          tintColor={colors.safron}
          minZoomLevel={5} // default => 0l
          maxZoomLevel={20} // default => 20
          showsAnnotationCallouts={true}
          // paddingAdjustmentBehavior="automatic"
          onMapReady={async () => {
            // setTimeout(() => {

            await this.mounting_functions();
            // this.setState(
            //   {
            //     map_is_ready: true,
            //   },
            //   () => {
            //     this.centerCamera();
            //   }
            // );

            // this._getLocationAsync();

            // }, 2000);
          }}
          ref={(map) => {
            this.map = map;
          }}
          style={styles.map}

          // ref={(map) => {
          //   this.map = map;
          // }}
        >
          {/* show marker and destination when driver has not yet accepted. after accept hide them and relocate to the driver position */}

          {/* {this.props.order.destinationRequested && !this.props.order.driver
              ? this.destination_marker()
              : null} */}

          {this.show_driver_marker()}
          {this.map_view_directions()}

          {/* {!this.props.order.current_order &&
            
              this.available_presence_drivers()

          
              
            } */}
        </MapView>

        <ErrorModal
          modal_visible={this.state.error_msg}
          error_msg={this.state.error_msg}
          toggleModal={this.toggleModal}
        />

        {this.props.order.current_order &&
          this.props.order.current_order.state === "Pending" && (
            <CustomModal cancelOrder={this.cancelOrder} />
          )}
        {!this.props.order.current_order ? this.destination_button() : null}

        {/* if the user has a driver, show the driver details */}

        {this.driver_details_popup()}

        {!this.props.order.current_order
          ? this.drawer_button()
          : this.back_button()}

        {this.current_location_button()}

        <>
          {!this.state.map_is_ready && (
            <View
              style={[
                styles.container,
                {
                  position: "absolute",
                  zIndex: 777,
                  backgroundColor: colors.white,
                },
              ]}
            >
              <ImageBackground
                source={require("../assets/images/preloader.png")}
                resizeMethod="resize"
                style={{ width: wp(100), height: hp(140), top: -hp(18) }}
              />
            </View>
          )}

          {/* {this.back_to_select_vehicle_button()} */}

          {/* back button at bottom left */}
          {!this.props.order.current_order && (
            <Back_to_select_screen_button
              cb={() => {
                this.backAction();
              }}
              order={this.props.order.current_order}
              destination={this.props.order.destinationRequested}
            />
          )}

          {/* {this.props.order.destinationRequested &&
          !this.props.order.driver &&
          !this.props.order.is_searching ? (
            <>
              <Animatable.View
                animation="slideInUp"
                delay={1000}
                style={styles.rect}
              >
              
                <Request_ride
                  payment_method={this.payment_method}
                  state={this.state}
                  style={
                    (styles.Bike,
                    {
                      backgroundColor: this.state.isBikeSelected
                        ? "gold"
                        : null,
                    })
                  }
                  bookRide={this.bookRide}
                  open_modal={this.open_modal}
                  cancelOrder={this.cancelOrder}
                ></Request_ride>
              </Animatable.View>
            </>
          ) : null} */}
          {/* over lay image */}
        </>

        {/* set destination modal */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            // transparent={true}
            onRequestClose={() => {
              this.close_set_destination();
            }}
            visible={this.state.set_destination_modal}
            presentationStyle="fullScreen"
          >
            {/* <Confirm_Location close_modal = {this.close_modal} book_ride={this.bookRide}  /> */}
            <SetDestination
              // selectDestination={this.selectDestination}
              show_set_destination={this.show_set_destination}
              close_set_destination={this.close_set_destination}
              navigate={this.props.navigation.navigate}
              book_ride={this.bookRide}
              recent_orders={this.state.recent_orders}
            />
          </Modal>
        </View>

        {/* <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            // transparent={true}
            onRequestClose={() => {
              this.close_modal();
              // this.setState({
              //   modal_visible : false
              // })
            }}
            visible={this.state.modal_visible}
            presentationStyle="fullScreen"
          >
            <Confirm_Location
              state={this.state}
              close_modal={this.close_modal}
              book_ride={this.bookRide}
            />
          </Modal>
        </View> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(Map);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    ...StyleSheet.absoluteFillObject,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  map: {
    // flex: 1,
    // backgroundColor: "#fff",
    ...StyleSheet.absoluteFillObject,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  rect: {
    height: hp(30),
    marginTop: hp(70),
    // backgroundColor: 'transparent'

    // backgroundColor: "transparent",
    // top: "10%",
    // borderTopLeftRadius: 63,
    // borderTopRightRadius: 63,
    // marginTop: 476
  },
  totalAmount: {
    fontFamily: "Quicksand-Bold",
    color: "#121212",
    fontSize: 22,
    marginTop: 10,
    // marginLeft: WIDTH / 3,
    alignSelf: "center",
  },
  n3500: {
    fontFamily: "Quicksand-Bold",
    color: "#121212",
    fontSize: 40,
    marginTop: 10,
    // marginLeft: WIDTH / 3,
    alignSelf: "center",
  },
  materialButtonPink: {
    height: hp("13%"),
    width: wp("35%"),
    // borderRadius: 100,
    marginTop: 1,
  },
  materialButtonPink1: {
    height: hp("8%"),
    width: wp("35%"),
    // borderRadius: 100,
    marginLeft: 28,
  },
  materialButtonPinkRow: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    height: hp("30%"),
    justifyContent: "center",
    marginTop: hp("1%"),
    marginRight: 4,
  },

  preloader: {
    position: "absolute",
    marginTop: 500,
  },
  Bike: {
    height: hp("50%"),
    width: wp("100%"),
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },

  //

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
