import React, { Component } from "react";

import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-community/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Vibration,
  TouchableOpacity,
  Linking,
  YellowBox,
  Image,
  Platform,
} from "react-native";

import * as Permissions from "expo-permissions";
import store from "../store";
import MapView, { Marker, AnimatedRegion, Callout } from "react-native-maps";

import * as Location from "expo-location";
import DestinationButton from "../components/destinationButton";

import CurrentLocationButton from "../components/currentLocationButton";

import { Ionicons } from "@expo/vector-icons";
import Geocoder from "react-native-geocoding";
import google_api from "../keys/google_map";
import { connect } from "react-redux";
import Pusher from "pusher-js/react-native";
import { regionFrom, getLatLonDiffInMeters } from "../helpers/helper";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";

import BottomSheet from "reanimated-bottom-sheet";
import { Button, Content, Header, Icon, Item , Input} from "native-base";
import * as Animatable from "react-native-animatable";
import { BackHandler } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import DriverDetailsPopUp from "./components/DriverDetailsPopUp";
import _ from "lodash";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomModal from "./components/Modal";
import LottieLoader from "react-native-lottie-loader";

// redux imports
import { makeOrder, cancelOrder } from "../action/orderActions";
import { Divider } from "react-native-paper";

import { Audio } from "expo-av";
import { persistStore } from "redux-persist";
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.02858723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta;
const LONGITUDE_DELTA = longitudeDelta;
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

Geocoder.init("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");
class Map extends Component {
  constructor(props) {
    super(props);

    // sound object
    this.soundObject = null;
    this.map =  null;
    this.marker = React.createRef();
    this.destinationMarker = React.createRef()
    this.driver_marker = React.createRef();
    // this.props.auth.user.phoneNumber = null;
    // this.client_driver_paid = null;
    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;

    this.pusher = null;

    this.state ={
      available_drivers_channel : null,
      user_ride_channel : null,
      pusher : null
    }
   

    // this.props.order = {

    //   // clients initial region
    //   region: {
    //     latitude: 9.0765,
    //     longitude: 7.3986,
    //     latitudeDelta: 0.992,
    //     longitudeDelta: 0.0421,

    //     // destination the user is going to
    //   },

    //   coming: null,
    //   going: null,
    //   // determines if the user has selected the destination
    //   destinationRequested: false,
    //   // destination : ""

    //   address: null,

    //   addressShortName: null,

    //   location: null,
    //   error: null,
    //   has_ride: false,
    //   destination: null,
    //   driver: null,
    //   origin: null,
    //   is_searching: false,
    //   has_ridden: false,
    //   totalPriceVisible: false,

    //   // price of ride
    //   price: 0,

    //   // name of the accepted driver
    //   driverName: null,
    // };

    // this.state = {
    //   my_location: null,
    //   coordinate: new AnimatedRegion({
    //     latitude: 9.0765,
    //     longitude: 7.3986,
    //     latitudeDelta: 0.3,
    //     longitudeDelta: 0.3,
    //   }),

    //   driver_location: {
    //     latitude: 9.0765,
    //     longitude: 7.3986,
    //     latitudeDelta: 0.3,
    //     longitudeDelta: 0.3,
    //   },
    //   distance: null,
    // };
    // this.get_state_data();
  }

  loadSounds = async () => {
    this.soundObject = new Audio.Sound();
    try {
      console.log("Loading sounds!!!!!!!!!!!!!!!!!!!!!!");
      Vibration.vibrate(500)
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


// reconnect a user to previous ride
  reconnect_client =()=>{
    
    const {user, token} = this.props.auth
    if (!this.pusher && user) {
      console.log("creating a new pusher connection");
      this.pusher = new Pusher("eead8d5075773e7aca0a", {
        // authEndpoint: "http://cf70166cf633.ngrok.io/api/pusher/auth",
        authEndpoint: "https://whiteaxisapi.herokuapp.com/api/pusher/auth",
        cluster: "eu",
        auth: {
          headers: { "x-auth-token": `${token}` },
        },
        encrypted: true,
      });

      // store.dispatch({
      //   type: "PUSHER_AUTH",
      //   payload: this.pusher,
      // });<D
    }
    // this.props.auth.user.phoneNumber = this.props.auth.user.phoneNumber
    Pusher.logToConsole = true;

    //  if(!this.props.pusher.available_drivers_channel){


    this.available_drivers_channel = this.pusher.subscribe(
      `private-available-drivers-${
        this.props.route.params
          ? this.props.route.params.logistics
          : this.props.order.logistic_type
      }`
    );


    this.user_ride_channel = this.pusher.subscribe(
      "private-ride-" + this.props.auth.user._id
    );

    this.user_ride_channel.bind("client-driver-response", (data) => {
      console.log("clients driver response!!!!!");
      console.log("driver has ride  ??? ", this.props.order.has_ride);
      let passenger_response = "no";
      if (!this.props.order.has_ride) {
        passenger_response = "yes";
      }

      // passenger responds to driver's response
      this.user_ride_channel.trigger("client-driver-response", {
        response: passenger_response,
      });
    });

    this.user_ride_channel.bind("client-found-driver", (data) => {
  
    });

    this.user_ride_channel.bind("client-driver-location", (data) => {
     
    });

    this.user_ride_channel.bind("client-driver-message", (data) => {
  });

  // }

  this.setState({
    pusher : this.pusher,
    available_drivers_channel : this.available_drivers_channel,
    user_ride_channel : this.user_ride_channel
  })



  }
  componentDidMount() {
    // persistStore(store).purge();
    // persistStore(store).purge();
    // store.dispatch({
    //   type : "PURGE"
    // })

    store.dispatch({
      type :"PERFORMING_TASK_ENDED"
    })

    if(this.props.order.has_ride){
this.reconnect_client()

    }else{
      this.pusher_actions();
   

    }
  

    // console.log("initial region ", this.props.order.region);\
    // if(this.map){
    //    this.centerCamera();;
    // }
    // this._getLocationAsync();
    // this.pusher_actions()
    // console.log("Mounted with props, ", this.props.navigation)
  }

 



  centerCamera = () => {
    const {
      latitudeDelta,
      longitudeDelta,
      latitude,
      longitude,
    } = this.props.order.region;

    this.map &&
      this.map.animateCamera(
        {
          center: {
            latitude,
            longitude,
          },
          pitch: 2,
          heading: 60,
          altitude: 18,
          zoom:wp(4.6),
        },
        1500
      );
  };

  pusher_actions = async () => {
    const { token, user } = this.props.auth;
    // let pusher

    if (!this.pusher && user) {
      console.log("creating a new pusher connection");
      this.pusher = new Pusher("eead8d5075773e7aca0a", {
        // authEndpoint: "http://cf70166cf633.ngrok.io/api/pusher/auth",
        authEndpoint: "https://whiteaxisapi.herokuapp.com/api/pusher/auth",
        cluster: "eu",
        auth: {
          headers: { "x-auth-token": `${token}` },
        },
        encrypted: true,
      });

      // store.dispatch({
      //   type: "PUSHER_AUTH",
      //   payload: this.pusher,
      // });<D
    }
    // this.props.auth.user.phoneNumber = this.props.auth.user.phoneNumber
    Pusher.logToConsole = false;

    //  if(!this.props.pusher.available_drivers_channel){


    this.available_drivers_channel = this.pusher.subscribe(
      `private-available-drivers-${
        this.props.route.params
          ? this.props.route.params.logistics
          : this.props.order.logistic_type
      }`
    );

      // store.dispatch({
      //   type: "AVAILABLE_DRIVERS",
      //   payload: this.available_drivers_channel,
      // });

      // console.log("binding to available drivers channgel!!!!!!!!!!!!!!!!!!!!!! ", this.props.pusher)
      // available_drivers_channel.bind(
      //   "pusher:subscription_failed",
      //   (data) => {
      //     console.log("failed to subscribe ");
      //   }
      // );

      // available_drivers_channel.bind(
      //   "pusher:subscription_succeeded",
      //    (data) => {
      //     console.log("Subscribed succesfully , ", available_drivers_channel);
      //      store.dispatch({
      //       type : "AVAILABLE_DRIVERS",
      //       payload : available_drivers_channel
      //     })
      //   }
      // );

      //  }

      // available_drivers_channel.bind("Driver_Accepted", function (data) {
      //   alert("New Driver Alerted")

      //     })
      // if (!this.props.pusher.user_ride_channel) {
        console.log("subscribing ujser ride channel!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      this.user_ride_channel = this.pusher.subscribe(
        "private-ride-" + this.props.auth.user._id
      );
      // this.user_ride_channel = user_ride_channel

  
      this.user_ride_channel.bind("client-driver-response", (data) => {
        console.log("clients driver response!!!!!");
        console.log("driver has ride  ??? ", this.props.order.has_ride);
        let passenger_response = "no";
        if (!this.props.order.has_ride) {
          passenger_response = "yes";
        }

        // passenger responds to driver's response
        this.user_ride_channel.trigger("client-driver-response", {
          response: passenger_response,
        });
      });

      this.user_ride_channel.bind("client-found-driver", async (data) => {
        // found driver, the passenger has no say about this.
        // once a driver is found, this will be the driver that's going to drive the user
        // to their destination
        // Vibration.vibrate({pattern:500});

        try {
          console.log("Found driver!!!!!!!!!!!!!!!!!!")
        let driverLocation = regionFrom(
          data.location.latitude,
          data.location.longitude,
          data.location.accuracy
        );

        // this.setState({
        //   coordinate: {
        //     ...this.state.coordinate,
        //     longitude: driverLocation.longitude,
        //     latitude: driverLocation.latitude,
        //   },

        //   // the drivers locatio to be passed to the mapviewdirections
        //   driver_location: {
        //     ...this.state.driver_location,
        //     longitude: driverLocation.longitude,
        //     latitude: driverLocation.latitude,
        //   },
        // });

        // update coordinate and drivers location in redux

        const found_driver = {
          has_ride: true,
          is_searching: false,
          location: driverLocation,
          driver: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            accuracy: data.location.accuracy,
          },

          driver_details: data.driver,
        };

       await store.dispatch({
          type: "FOUND_DRIVER",
          payload: found_driver,
        });

        // GET THE DISTANCE BETWEEN THE CLIENT AND THE DRIVER

        var diff_in_meter_pickup = getLatLonDiffInMeters(
          this.props.order.region.latitude,
          this.props.order.region.longitude,
          data.location.latitude,
          data.location.longitude
        );

        var COORDINATE_DRIVER_LOCATION = {
          coordinate: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          driver_location: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          distance: diff_in_meter_pickup,
        };

        // this.setState({
        //   distance: diff_in_meter_pickup,
        // });

        await store.dispatch({
          type: "COORDINATE_DRIVER_LOCATION",
          payload: COORDINATE_DRIVER_LOCATION,
        });

        this.loadSounds();

        // console.log("Driver accepted and animating to driver location ", data);
        // this.props.order.region;

        this.map &&
          // this.map.animateCamera(
          //   {
          //     center: {
          //       longitude: data.location.longitude,
          //       latitude: data.location.latitude,
          //     },
          //     pitch: 2,
          //     heading: 60,
          //     altitude: 18,
          //     zoom: 10,
          //   },
          //   500
          // );

          this.map &&    this.map.fitToCoordinates(
            [
              {
                latitude : data.location.latitude,
                longitude : data.location.longitude,
              },
  
              {
                latitude: this.props.order.region.latitude,
                longitude: this.props.order.region.longitude,
              },
            ],
            {
              edgePadding: {
                bottom: hp("60%"),
                right: wp("10%"),
                top: hp("20%"),
                left: wp("10%"),
              },
              animated: true,
            }
          )

        // this.map.animateToRegion(
        //   {
        //     latitudeDelta: LATITUDE_DELTA,
        //     longitudeDelta: LONGITUDE_DELTA,
        //     longitude: data.location.longitude,
        //     latitude: data.location.latitude,
        //   },
        //   1500
        // );
        this.driver_marker && this.driver_marker.showCallout();
        } catch (error) {
          console.warn(error)
        }

        
      });

      this.user_ride_channel.bind("client-driver-location", async(data) => {


        try {
          if (data) {
            const { longitude, latitude, accuracy } = data;
  
            const {state} =  this.props.order.order
            console.log(
              "client driver location updated!! ? ",
              latitude,
              longitude,
              accuracy
            );
  
            const newCoordinate = {
              latitude,
              longitude,
            };
  
            // driver location received
            let driverLocation = regionFrom(latitude, longitude, accuracy);
            console.log("the drivers new location ", driverLocation);
  
            var data = {
              location: driverLocation, //the drivers location
              driver: {
                latitude: latitude,
                longitude: longitude,
              },
            };
  
           await store.dispatch({
              type: "DRIVER_LOCATION",
              payload: data,
            });
  
            var diff_in_meter_pickup = getLatLonDiffInMeters(
              this.props.order.region.latitude,
              this.props.order.region.longitude,
              latitude,
              longitude
            );
  
            // this.setState({
            //   distance: diff_in_meter_pickup,
            // });
  
            this.animate(latitude, longitude);
            // this.setState({
            //   coordinate: {
            //     ...this.state.coordinate,
            //     longitude: longitude,
            //     latitude: latitude,
            //   },
            //   driver_location: {
            //     ...this.state.driver_location,
            //     longitude: longitude,
            //     latitude: latitude,
            //   },
            // });
  
            var COORDINATE_DRIVER_LOCATION = {
              coordinate: {
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
                longitude: driverLocation.longitude,
                latitude: driverLocation.latitude,
              },
              driver_location: {
                latitudeDelta: 0.3,
                longitudeDelta: 0.3,
                longitude: driverLocation.longitude,
                latitude: driverLocation.latitude,
              },
              distance: diff_in_meter_pickup,
            };
  
            // this.setState({
            //   distance: diff_in_meter_pickup,
            // });
  
          await  store.dispatch({
              type: "COORDINATE_DRIVER_LOCATION",
              payload: COORDINATE_DRIVER_LOCATION,
            });
  
            // console.log("maops", this.map)
            
           
            // this.map.animateCamera(
            //   {
            //     center: {
            //       longitude: longitude,
            //       latitude: latitude,
            //     },
            //     pitch: 2,
            //     heading: 60,
            //     altitude: 18,
            //     zoom: 18,
            //   },
            //   500
            // ); 
            // this.props.order.going
  
            var destination_latitude = this.props.order.going.latitude
            var destination_longitude = this.props.order.going.longitude
  
            console.log({state})
            if(state == "Started"){
  
              this.map &&    this.map.fitToCoordinates(
                [
                  {
                    latitude : destination_latitude,
                   longitude:  destination_longitude,
                  },
      
                  {
                    latitude: this.props.order.region.latitude,
                    longitude: this.props.order.region.longitude,
                  },
                ],
                {
                  edgePadding: {
                    bottom: hp("60%"),
                    right: wp("10%"),
                    top: hp("20%"),
                    left: wp("10%"),
                  },
                  animated: true,
                }
              )
            }else{
              this.map &&    this.map.fitToCoordinates(
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
                    right: wp("10%"),
                    top: hp("20%"),
                    left: wp("10%"),
                  },
                  animated: true,
                }
              )
           
            }
  
       
            // this.map.animateToRegion(
            //   {
            //     latitudeDelta: LATITUDE_DELTA,
            //     longitudeDelta: LONGITUDE_DELTA,
            //     longitude: longitude,
            //     latitude: latitude,
            //   },
            //   500
            // );
          }
        } catch (error) {
          console.warn(error)
        }
    
      });

      this.user_ride_channel.bind("client-driver-message", async(data) => {

        try {
          if (data.type == "near_pickup") {
            //remove passenger marker
  
           await  store.dispatch({
              type: "HAS_RIDDEN",
              // payload: data,
            });
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
          }
          if (data.type == "ride_ended") {
            console.log("ride ended by driver triggered ", data.order);
  
            this.loadSounds();
          await  store.dispatch({
              type: "RIDE_UPDATED",
              payload: data.order,
            });
          }
          if (data.type == "ride_completed") {
            console.log("ride completed by driver triggered ", data.order);
  
            const driver_id = data.order.driver;
  
            this.loadSounds();
           
            //  this.centerCamera();
  
            // passing the id of the driver as params to the rating page
             this.reset_navigation("driver_rating", driver_id);
  
          return  await store.dispatch({
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
          this.setState({
            pusher : this.pusher,
            available_drivers_channel : this.available_drivers_channel,
            user_ride_channel : this.user_ride_channel
          })
        } catch (error) {
          console.warn(error)
        }
       
      });

    // }

    
  };

  // used to replace screens so user cant go back
  reset_navigation = (screenName, param) => {
    // reset navigation!!,
    this.props.navigation.dispatch(
      StackActions.replace(screenName, { param: param })
    );
  };

  animate = (latitude, longitude) => {

    try {
      const { coordinate } = this.props.order;
      const newCoordinate = {
        latitude: latitude,
        longitude: longitude,
      };
  
      if (Platform.OS === "android") {
        if (this.driver_marker && newCoordinate) {
          console.log({ newCoordinate });
          console.log("ANIMATING TO NEW POSITION ", newCoordinate);
          this.driver_marker._component &&
            this.driver_marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            ); // 500 is the duration to animate the marker
        }
      } else {
        this.props.order.coordinate.timing(newCoordinate).start();
      }
    } catch (error) {
      console.warn(error)
    }
  
  };

  centerMap = () => {

    try {
      const {
        latitudeDelta,
        longitudeDelta,
        latitude,
        longitude,
      } = this.props.order.region;
  
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
      console.warn(error)
    }
   
  };

  selectDestination = async (going , from) => {

    try {
      console.log("performing the select destination ", going);
      var data = {
        from : from ? from : null,
        going: going,
        destinationRequested: true,
        latitudeDelta: 0.1,
      };
  
      console.log("data passed to the selet destination , ", data);
  
  
      // if their is a from data, the user  region will be updated to the from data
     await store.dispatch({
        type: "SELECT_DESTINATION",
        payload: data,
      });
      // this.setState({
  
      // });
  
      const latitude = going.latitude;
      const longitude = going.longitude;
  
      var diff_in_meter_pickup = getLatLonDiffInMeters(
        this.props.order.region.latitude,
        this.props.order.region.longitude,
        going.latitude,
        going.longitude
      );
  
      console.log({ diff_in_meter_pickup });
  
      var price = diff_in_meter_pickup * 0.2;
  
      console.log("price of transportation ", price);
  
    await  store.dispatch({
        type: "PRICE_UPDATED",
        payload: price,
      });
      // this.setState({
  
      // });
  
      //  this._getLocationAsync
  
      this.destinationMarker.showCallout()
      this.map
        ? this.map.fitToCoordinates(
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
                right: wp("10%"),
                top: hp("20%"),
                left: wp("10%"),
              },
              animated: true,
            }
          )
        : this.map.animateToRegion(
            {
              latitudeDelta,
              longitudeDelta,
              latitude,
              longitude,
            },
            500
          );

     
    } catch (error) {
      console.warn(error)
    }
   

     
  
  };

  bookRide = async (payment_method) => {

    try {
      console.log("booking ride");

    let from_address ;
    let going_address= this.props.order.going.name;

   const from_address_full =  await  Location.reverseGeocodeAsync({
      latitude:  this.props.order.region.latitude,
   longitude:   this.props.order.region.longitude
    })
 
  //   const going_address_full =    await  Location.reverseGeocodeAsync({
  //     latitude: this.props.order.going.latitude,
  //  longitude:  this.props.order.going.longitude
  //   })

    from_address = from_address_full.street
    // going_address = going_address_full.street


    console.log(from_address , going_address)

    const { user } = this.props.auth;
    let pickup_data = {
      name: user.firstName,
      latitude: this.props.order.region.latitude,
      from_address: from_address,
      longitude: this.props.order.region.longitude,
    };

    let dropoff_data = {
      name: "Area",
      going_address: going_address,
      latitude: this.props.order.going.latitude,
      longitude: this.props.order.going.longitude,
    };

    let userID = this.props.auth.user._id;

    const data = {
      startLatitude: this.props.order.region.latitude,
      startLongitude: this.props.order.region.longitude,
      endLatitude: this.props.order.going.latitude,
      endLongitude: this.props.order.going.longitude,
      price: Math.ceil(this.props.order.price / 100) * 100,

      // trigger: trigger,

      // pusher actions variables

      userID: userID,
      pickup: pickup_data,
      dropoff: dropoff_data,
      payment_method,
      available_drivers_channel: this.available_drivers_channel,
    };

    const tokens = this.props.auth.token;
    // console.log("sening redux action for book ride", data);
    this.props.makeOrder(data, tokens);
    } catch (error) {
      console.warn(error)
    }
    
  };

  cancelOrder = async() => {
    // this.setState({
    //   is_searching: false,
    // });

    try {   if(this.props.order.order){


      const {state} =  this.props.order.order
      // console.log({state})
      if(state =="Ended" || state == "Completed"){
        return alert("Please complete the payment for your current ride")
      }
  
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order?",
        [
          {
            text: "Yes",
            onPress: async() => {
            await  store.dispatch({
                type: "PERFORMING_TASK",
              });
  
              const orderID = this.props.order.order
                ? this.props.order.order._id
                : null;
              const tokens = this.props.auth.token;
  
              if (orderID) {
                console.log("orderID!!!!!!!!!!!!!!!!!!!!!!", orderID);
                this.props.cancelOrder(tokens, orderID);
              }
  
             

              // RBSheet.close()
  
              this.user_ride_channel &&
                this.user_ride_channel.trigger("client-driver-cancelled", {});

              await  store.dispatch({
                  type: "CANCEL_ORDER",
                });
            await  store.dispatch({
                type: "END_LOADING",
              });
  
              // persistStore(store).purge();
  
             
  

              await this._getLocationAsync()
              await this.centerCamera();
              store.dispatch({
                type: "PERFORMING_TASK_ENDED",
              });
  
              // this.props.pusher&& this.props.pusher.pusher.disconnect()yyyyyy
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

    }else{

        await  store.dispatch({
                type: "DESTINATION_CANCELLED",
              });
              this._getLocationAsync()
              this.centerCamera();
    }

      
    } catch (error) {
      console.warn(error)
    }
 
  };



  disconnect_client = () => {
    // this.this.user_ride_channel.unbind();
    // this.pusher.unsubscribe(
    //   "private-ride-" + this.props.order.passenger.userID
    // );

     this.centerCamera();;
  };
  
  _getLocationAsync = async () => {


    try {
      console.log("getting location ")
      Geocoder.init("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        console.log("Permission to access denied!!!.");
       return   Alert.alert(
        "Access Denied",
        "You need to grant access to location to continue using White Axis",
        [
          {
            text: 'Open Settings',
            onPress: () =>   Linking.openSettings(),
            style: 'cancel',
          },
          { text: 'ignore', onPress: () => navigation.goback()},
          // { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
  
     
      var my_location = regionFrom(
        location.coords.latitude,
        location.coords.longitude,
        location.coords.accuracy
      );
  
  
      console.log("my location!!!!!!!!!!!!", my_location)
      this.setState({
        my_location : my_location
      });
  
      let region = {
        latitude: my_location.latitude,
        longitude: my_location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
  
      // console.log("region ", region);
  
      // console.log("latitude,longitude ", location.coords.latitude,location.coords.latitude,)
      // this.setState({
  
      // });
      
  
      // Geocoder.from({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      // })
      //   .then((json) => {
      //     var addressComponent = json.results[0].address_components[0].long_name;
      //     // console.log(json.results[0].formatted_address);
  
      //     // this.setState({
  
         var data = {
            region: region,
            // address: json.results[0].formatted_address,
            // addressShortName: addressComponent,
          };
       await   store.dispatch({
            type: "GET_LOCATION",
            payload: data,
          });
  
          this.watchId = location;
  
      
  
          // });
          // y address  Object {
          //   "long_name": "9",
          //   "short_name": "9",
          //   "types": Array [
          //     "street_number",
          //   ],
          // }
        // })
        // .catch((error) => console.warn(error));
     
    } catch (error) {
      console.warn(error)
    }
   
  };



  componentWillUnmount() {
    console.log("Unmounting COmponents!!!!!!!");
    // this.persist_state_data();
    navigator.geolocation.clearWatch(this.watchId);

    this.soundObject && this.soundObject.unloadAsync();

    // this.user_ride_channel.unbind("client-driver-response");

    // this.user_ride_channel.unbind("client-found-driver");

    // this.user_ride_channel.unbind("client-driver-location");

    // this.user_ride_channel.unbind("client-driver-message");
    // this.user_ride_channel && this.user_ride_channel.unbind_all()

    // this.user_ride_channel.unbind_all()
    // this.pusher &&
    // this.pusher.unsubscribe(
    //   "private-ride-" + this.props.order.passenger.phoneNumber
    // );
  }

  renderContent = () => (
    <Animatable.View animation="slideInUp" delay={1300} style={styles.rect}>
      {/* <Text style={styles.totalAmount}>Total Amount</Text> */}
      <Text style={styles.n3500}>
        {" "}
        ₦{Math.ceil(this.props.order.price / 100) * 100}
      </Text>

      <Divider
        style={{
          margin: 10,
        }}
      />
      <View style={styles.materialButtonPinkRow}>
        <TouchableOpacity
          onPress={() => {
            this.bookRide("Cash");
          }}
        >
          <Button disabled rounded dark style={styles.materialButtonPink1}>
            <Text
              style={{
                fontSize: 22,
                color: "white",
                alignSelf: "center",
                paddingLeft: wp("10%"),
              }}
            >
              Cash
            </Text>
          </Button>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.bookRide("Cashless");
          }}
        >
          <Button disabled rounded warning style={styles.materialButtonPink1}>
            <Text
              style={{ fontSize: 22, color: "white", paddingLeft: wp("10%") }}
            >
              Card
            </Text>
          </Button>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          // this.setState({
          //   destinationRequested: false,
          // });
          // store.dispatch({
          //   type: "DESTINATION_CANCELLED",
          // });
          //  this.centerCamera();;

          this.cancelOrder();
        }}
      >
        <Animatable.View
          animation="bounceIn"
          delay={1500}
          style={{
            width: WIDTH,
          }}
        >
          <Text
            style={{
              // marginLeft: WIDTH / 3,
              alignSelf: "center",
              fontWeight: "bold",
              fontSize: 20,
              // top: 20,
              color: "#c90c02",
            }}
          >
            <Icon
              active
              style={{
                fontSize: 50,
                color: "red",
              }}
              name="ios-close"
            />
          </Text>
        </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
  );

  renderHeader = () => {
    // <Header />
    <View>
      <Text>Header</Text>
    </View>;
  };
  sheetRef = React.createRef(null);

  render() {


    return (
      <View style={styles.container}>
        {/* Loading Animation */}

        <LottieLoader
          visible={this.props.order.is_fetching}
          source={require("../assets/lottie/car.json")}
        />
        {/* End Loading animation */}

        {this.props.order.is_searching && (
          <CustomModal cancelOrder={this.cancelOrder} />
        )}
        {!this.props.order.destinationRequested &&
        !this.props.order.has_ride ? (
          <DestinationButton
            navigation={this.props.navigation}
            state={this.props.order}
            logistics={
              this.props.route.params
                ? this.props.route.params.logistics
                : this.props.order.logistic_type
            }
            selectDestination={this.selectDestination}
          />
        ) : null}

        {/* if the user has a driver, show the driver details */}

        {this.props.order.has_ride  && (
          <DriverDetailsPopUp
            driver={this.props.order.driver_details}
            distance={this.props.order.distance}
            user_ride_channel={this.state.user_ride_channel}
          />
        ) }

        {!this.props.order.destinationRequested ? (
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
              this.props.navigation.openDrawer();
              // this.bookRide();
            }}
          >
            <View>
              <Ionicons name="md-menu" size={32} color="black" />
            </View>
          </TouchableOpacity>
        ) : (
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
               this.centerCamera();;
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
        )}

        {/* <View style = {styles.destination}>  */}
        {/* <SearchInput /> */}

        {/* </View> */}

        {/* <CurrentLocationButton
          cb={() => {
             this.centerCamera();;
          }}
        /> */}


          <CurrentLocationButton
            cb={() => {
              this.centerCamera();
            }}
            order = {this.props.order.destinationRequested || this.props.order.driver}
            onPress={() => {
              this.refs.BottomSheet.current.snapTo(9);
            }}
          />
   

        {this.props.order.region && (
          <MapView
            followUserLocation={true}
            // initialRegion={this.props.order.region}
            rotateEnabled={false}
            showsUserLocation={true}
            showsBuildings={false}
            zoomEnabled={true}
            showsCompass={false}
            onMapReady={() => {

              if(this.props.order.has_ride){
                console.log("first function called")

                var {latitude, longitude} = this.props.order.driver_location
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
                      right: wp("10%"),
                      top: hp("20%"),
                      left: wp("10%"),
                    },
                    animated: true,
                  }
                )
             
              }else{
                console.log("second function called")
                this.centerCamera();
                // this.marker && this.marker.showCallout();
              }
            
            }}
            // onRegionChangeComplete={() => {
            //   this.marker && this.marker.showCallout();
            // }}
            ref={(map) => {
              this.map = map;
            }}
            //comment this if any error
            // region={{
            //   latitude: this.props.order.region.latitude ?this.props.order.region.latitude : 9.04,

            //   longitude: this.props.order.region.longitude ?  this.props.order.region.longitude : 7.04,

            //   latitudeDelta: 0.5,
            //   longitudeDelta: LONGITUDE_DELTA,
            // }}

            style={{
              // flex: 1,
              ...StyleSheet.absoluteFillObject,
              // zIndex: 0,
            }}
            // ref={(map) => {
            //   this.map = map;
            // }}
          >
            {/* {this.state.my_location &&  */}

            {/* {!this.props.order.destinationRequested &&
              this.props.order.region &&
              !this.props.order.driver && (
                <Marker.Animated
                  ref={(marker) => {
                    this.marker = marker;
                  }}
                  image={require("../assets/images/marker.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  coordinate={{
                    latitude: this.props.order.region
                      ? this.props.order.region.latitude
                      : 9.0765,
                    longitude: this.props.order.region
                      ? this.props.order.region.longitude
                      : 7.3986,
                  }}
                  titleStyle={{
                    fontFamily: "Quicksand-Bold",
                  }}
                  title={`Hello ${
                    user && !this.props.order.fromChanged
                      ? user.firstName ?  user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1) : " There!"
                      : "Pick Up Location"
                  }`}
                ></Marker.Animated>
              )} */}

            {/* show marker and destination when driver has not yet accepted. after accept hide them and relocate to the driver position */}

            {this.props.order.destinationRequested &&
            !this.props.order.driver ? (
              <>
                <MapViewDirections
                  origin={this.props.order.region}
                  destination={this.props.order.going}
                  apikey={google_api}
                  strokeWidth={3}
                  strokeColor="black"
                  showsCompass={false}
                  onError ={()=>{
                    alert ("Could not find a path to your destination")
                  }}
                ></MapViewDirections>

                <Marker
                  title={this.props.order.going.name ? this.props.order.going.name : "Your Destination"}
                  ref={(marker) => {
                    this.destinationMarker = marker;
                  }}
                  coordinate={{
                  
                    latitude:  this.props.order.going
                    ?   this.props.order.going.latitude
                    : 9.0765,
                  longitude:   this.props.order.going
                    ?   this.props.order.going.longitude
                    : 7.3986,
                  }}
                  pinColor="green"
                >

<Callout

tooltip ={false}
>

  <Content style ={{width : undefined , backgroundColor : "white"}}>
<Item style ={{
  padding : 10
}}>
            <Icon active name='pin' style={{
              color : "blue",
              
              fontSize : 25,
            }} />
            <Text style ={{
              fontSize : 18,
              fontFamily : "Quicksand-Bold"
            }}>{this.props.order.going.name ? this.props.order.going.name : "Your Destination"}</Text>      
            
                </Item>
          </Content>
</Callout>


                </Marker>
       
              </>
            ) : null}

            {this.props.order.driver && (
              // <Driver
              //   driver={{
              //     uid: null,
              //     location: {
              //       latitude: this.props.order.driver.latitude,
              //       longitude: this.props.order.driver.longitude,
              //       // latitudeDelta :0.3,
              //       // longitudeDelta : 0.3,
              //     },
              //   }}
              //   innerRef={(driver_marker) => {
              //     this.driver_marker = driver_marker;
              //   }}
              // />

              <>
                {/* <Marker.Animated
                  ref={(marker) => {
                    this.marker = marker;
                  }}
                  image={require("../assets/images/marker.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  coordinate={{
                    latitude: this.props.order.region
                      ? this.props.order.region.latitude
                      : 9.0765,
                    longitude: this.props.order.region
                      ? this.props.order.region.longitude
                      : 7.3986,
                  }}
                  title={"You're here"}
                ></Marker.Animated> */}
                {this.props.order.order && this.props.order.order.state == "Started" && (
                  <>
                    <MapViewDirections
                      origin={this.props.order.driver_location}
                      destination={this.props.order.going}
                      apikey={google_api}
                      strokeWidth={3}
                      strokeColor="black"
                      showsCompass={false}
                    ></MapViewDirections>
                    <Marker.Animated
                      title="Your Destination"
                      coordinate={this.props.order.going}
                      pinColor="#ffffff"
                    />
                  </>
                )}

                <Marker.Animated
                  coordinate={{
                    latitude: this.props.order.coordinate
                    ? this.props.order.coordinate.latitude
                    : 9.0765,
                  longitude: this.props.order.coordinate
                    ? this.props.order.coordinate.longitude
                    : 7.3986,
                    
                  }}
                  anchor={{ x: 0.35, y: 0.32 }}
                  title="Your Ride Is Here"
                  ref={(marker) => {
                    this.driver_marker = marker;
                  }}
                  style={{ width: 50, height: 50 }}
                >
                  <Image
                    source={require("../assets/bike.png")}
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  />
                </Marker.Animated>
              </>
              // this.driverLocation()
            )}
          </MapView>
        )}
        <StatusBar style="auto" hidden = {true} />

        {/* <View
        style={{
          flex: 1,
          // backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <f
          title="Open Bottom Sheet"
          onPress={() => sheetRef.current.snapTo(0)}
        />
      </View> */}

        {this.props.order.destinationRequested &&
        !this.props.order.driver &&
        !this.props.order.is_searching ? (
          <BottomSheet
            ref={this.sheetRef}
            snapPoints={["30%", "5%"]}
            borderRadius={20}
            renderContent={this.renderContent}
            renderHeader={this.renderHeader}
            enabledContentTapInteraction={false}
            isBackDrop={true}
            isBackDropDismisByPress={true}
            isRoundBorderWithTipHeader={true}
            ref="BottomSheet"
            // isModal
            // containerStyle={{backgroundCol or:"red"}}
            tipStyle={{ backgroundColor: "red" }}
            headerStyle={{ backgroundColor: "red" }}
            // bodyStyle={{backgroundColor:"red",flex:1}}
            header={
              <View>
                <Text style={styles.text}>Header</Text>
              </View>
            }
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { makeOrder, cancelOrder })(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  rect: {
    height: "100%",
    backgroundColor: "whitesmoke",
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
});
