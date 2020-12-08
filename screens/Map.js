import React, { Component } from "react";

import { StatusBar } from "expo-status-bar";
import PubNubReact from "pubnub-react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Vibration,
  TouchableOpacity,
  YellowBox,
  Image,
  Platform,
} from "react-native";
import store from "../store";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";

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
import { Button, Content, Header, Icon } from "native-base";
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
    this.map = [];
    this.marker = React.createRef();
    this.driver_marker = React.createRef();
    // this.props.auth.user.phoneNumber = null;
    // this.client_driver_paid = null;
    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;

    this.pusher = null;

    const { token } = this.props.auth;

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
  }

  state = {
    my_location: null,
    coordinate: new AnimatedRegion({
      latitude: 9.0765,
      longitude: 7.3986,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    }),

    driver_location: {
      latitude: 9.0765,
      longitude: 7.3986,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    },
    distance: null,
  };

  loadSounds = async () => {
    this.soundObject = new Audio.Sound();
    try {
      console.log("Loading sounds!!!!!!!!!!!!!!!!!!!!!!");
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
  componentDidMount() {
    this.pusher_actions();

    // console.log("users details!!!!!!!!!!!1", this.props.auth)
    // console.log("initial region ", this.props.order.region);\
    // if(this.map){
    //   this.centerMap();
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
          heading: 30,
          altitude: 200,
          zoom: 40,
        },
        1500
      );
  };

  pusher_actions = async () => {
    const { token, user } = this.props.auth;
    // let pusher

    if (!this.pusher && user) {
      console.log("creating a new pusher connection");
      this.pusher = new Pusher("41e0bb8609122b8b5c71", {
        // authEndpoint: "http://cf70166cf633.ngrok.io/api/pusher/auth",
        authEndpoint: "https://whiteaxisapi.herokuapp.com/api/pusher/auth",
        cluster: "eu",
        auth: {
          headers: { "x-auth-token": `${token}` },
        },
        encrypted: true,
      });

      store.dispatch({
        type: "PUSHER_AUTH",
        payload: this.pusher,
      });
    }
    // this.props.auth.user.phoneNumber = this.props.auth.user.phoneNumber
    Pusher.logToConsole = true;

    //  if(!this.props.pusher.available_drivers_channel){

    this.available_drivers_channel = this.pusher.subscribe(
      `private-available-drivers-${this.props.route.params.logistics}`
    );

    this.available_drivers_channel.bind("pusher:subscription_succeeded", () => {
      store.dispatch({
        type: "AVAILABLE_DRIVERS",
        payload: this.available_drivers_channel,
      });

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
      this.user_ride_channel = this.pusher.subscribe(
        "private-ride-" + this.props.auth.user._id
      );
      // this.user_ride_channel = user_ride_channel

      console.log("subscribed to the user part!!!!!!!!!!!1");

      // update the store
      //   store.dispatch({
      //   type : "USER_RIDE_CHANNEL",
      //   payload  : user_ride_channel
      // })

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
        // found driver, the passenger has no say about this.
        // once a driver is found, this will be the driver that's going to drive the user
        // to their destination
        // Vibration.vibrate({pattern:500});

        let driverLocation = regionFrom(
          data.location.latitude,
          data.location.longitude,
          data.location.accuracy
        );

        this.setState({
          coordinate: {
            ...this.state.coordinate,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },

          // the drivers locatio to be passed to the mapviewdirections
          driver_location: {
            ...this.state.driver_location,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
        });

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

        store.dispatch({
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

        this.setState({
          distance: diff_in_meter_pickup,
        });

       
    this.loadSounds();

        // console.log("Driver accepted and animating to driver location ", data);
        // this.props.order.region;

        this.map &&
          this.map.animateCamera(
            {
              center: {
                longitude: data.location.longitude,
                latitude: data.location.latitude,
              },
              pitch: 2,
              heading: 30,
              altitude: 200,
              zoom: 40,
            },
            500
          );

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
      });

      this.user_ride_channel.bind("client-driver-location", (data) => {
        if (data) {
          const { longitude, latitude, accuracy } = data;

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

          store.dispatch({
            type: "DRIVER_LOCATION",
            payload: data,
          });

          var diff_in_meter_pickup = getLatLonDiffInMeters(
            this.props.order.region.latitude,
            this.props.order.region.longitude,
            latitude,
            longitude
          );

          this.setState({
            distance: diff_in_meter_pickup,
          });

          // console.log("old region ", this.props.order.region)

          // this.props.order.region.timing(newCoordinate).start();

          // this.setState({

          // });

          // if (Platform.OS === "android") {
          //   if (this.driver_marker && newCoordinate) {
          //     // console.log( this.driver_marker );
          //     console.log("ANIMATING TO NEW POSITION ", newCoordinate);

          //     // this.driver_marker &&
          //       // this.driver_marker.animateMarkerToCoordinate(newCoordinate, 500); // 500 is the duration to animate the marker
          //       this.state.coordinate.timing(newCoordinate).start();
          //   }
          // } else {
          //   this.state.coordinate.timing(newCoordinate).start();
          // }
          // // this.driverLocation()

          this.animate(latitude, longitude);
          this.setState({
            coordinate: {
              ...this.state.coordinate,
              longitude: longitude,
              latitude: latitude,
            },
            driver_location: {
              ...this.state.driver_location,
              longitude: longitude,
              latitude: latitude,
            },
          });

          this.map.animateToRegion(
            {
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
              longitude: longitude,
              latitude: latitude,
            },
            500
          );
        }
      });

      this.user_ride_channel.bind("client-driver-message", (data) => {
        if (data.type == "near_pickup") {
          //remove passenger marker

          store.dispatch({
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
          store.dispatch({
            type: "RIDE_UPDATED",
            payload: data.order,
          });
        }
        if (data.type == "ride_ended") {
          console.log("ride ended by driver triggered ", data.order);
         
    this.loadSounds();
          store.dispatch({
            type: "RIDE_UPDATED",
            payload: data.order,
          });
        }
        if (data.type == "ride_completed") {
          console.log("ride completed by driver triggered ", data.order);

          const driver_id = this.props.order.order.driver;
         
    this.loadSounds();
          store.dispatch({
            type: "RIDE_COMPLETED",
          });
          // this.centerMap()

          // passing the id of the driver as params to the rating page
          return this.reset_navigation("driver_rating", driver_id);
          // this.props.navigation.navigate("Driver_Rating")
        }

        if (data.type == "near_dropoff") {
          this.centerMap();
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
      });
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
    const { coordinate } = this.state;
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
      this.state.coordinate.timing(newCoordinate).start();
    }
  };

  centerMap = () => {
    const {
      // latitudeDelta,
      // longitudeDelta,
      latitude,
      longitude,
    } = this.props.order.region;

    this.map.animateToRegion(
      {
        latitudeDelta,
        longitudeDelta,
        latitude,
        longitude,
      },
      1500
    );

    console.log("animation should be complete");
  };

  selectDestination = async (going) => {
    console.log("performing the select destination ", going);
    var data = {
      going: going,
      destinationRequested: true,
      latitudeDelta: 0.1,
    };

    console.log("data passed to the selet destination , ", going);

    store.dispatch({
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

    store.dispatch({
      type: "PRICE_UPDATED",
      payload: price,
    });
    // this.setState({

    // });

    //  this._getLocationAsync

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
              bottom: 150,
              right: 40,
              top: 150,
              left: 40,
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
  };

  bookRide = async (payment_method) => {
    console.log("booking ride");
    // await this.this.pusher_actions();
    // RNGooglePlacePicker.show((response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled GooglePlacePicker');
    //   } else if (response.error) {
    //     console.log('GooglePlacePicker Error: ', response.error);
    //   } else {
    // this.setState({
    //   is_searching: true,
    //   // destination: response,
    // });

    let from_address;
    let going_address;

    await Geocoder.from(
      this.props.order.region.latitude,
      this.props.order.region.longitude
    ).then(
      (json) => {
        // console.log("coming from ",json.results[0].address_components)
        return (from_address =
          json.results[0].address_components[0].long_name +
          " " +
          json.results[0].address_components[1].long_name);
      },
      (error) => {
        console.log("err geocoding: ", error);
      }
    );
    await Geocoder.from(
      this.props.order.going.latitude,
      this.props.order.going.longitude
    ).then(
      (json) => {
        //  console.log("going to ",json.results[0].address_components)
        return (going_address =
          json.results[0].address_components[0].long_name +
          " " +
          json.results[0].address_components[1].long_name);
      },
      (error) => {
        console.log("err geocoding: ", error);
      }
    );

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
    let available_drivers_channel = this.available_drivers_channel;

    //  function trigger() {
    // console.log("Trigger functionality reached", pickup_data, dropoff_data);

    // this.props.order.trigger_driver(userID, pickup_data, dropoff_data)

    // this.available_drivers_channel.trigger("client-driver-request", {
    //   userID: userID,
    //   pickup: pickup_data,
    //   dropoff: dropoff_data,
    //   // triggered : "Yes!"
    // });
    // };

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
  };

  cancelOrder = () => {
    // this.setState({
    //   is_searching: false,
    // });

    store.dispatch({
      type: "DESTINATION_CANCELLED",
    });

    store.dispatch({
      type: "END_LOADING",
    });
    const orderID = this.props.order.order._id;
    const tokens = this.props.auth.token;
    console.log("orderID!!!!!!!!!!!!!!!!!!!!!!", orderID);
    this.props.cancelOrder(tokens, orderID);
    this.centerMap();

    // this.props.pusher&& this.props.pusher.pusher.disconnect()yyyyyy
  };

  disconnect_client = () => {
    // this.this.user_ride_channel.unbind();
    // this.pusher.unsubscribe(
    //   "private-ride-" + this.props.order.passenger.userID
    // );

    this.centerMap();
  };

  componentWillUnmount() {
    console.log("Unmounting COmponents!!!!!!!");

    navigator.geolocation.clearWatch(this.watchId);
    this.soundObject.unloadAsync();

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
          <Button rounded dark style={styles.materialButtonPink1}>
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
          <Button rounded warning style={styles.materialButtonPink1}>
            <Text
              style={{ fontSize: 22, color: "white", paddingLeft: wp("10%") }}
            >
              Card
            </Text>
          </Button>
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Animatable.View
          animation="bounceIn"
          onPress={() => {
            // this.setState({
            //   destinationRequested: false,
            // });
            store.dispatch({
              type: "DESTINATION_CANCELLED",
            });
            this.centerMap();
          }}
          delay={1500}
          style={{
            width: WIDTH,
          }}
        >
          <Text
            onPress={() => {
              // this.setState({
              //   destinationRequested: false,
              // });
              store.dispatch({
                type: "DESTINATION_CANCELLED",
              });
              this.centerMap();
            }}
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
    // console.log("region!!!!! ? ", this.props.order);
    const { user } = this.props.auth;

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
            logistics={this.props.route.params.logistics}
            selectDestination={this.selectDestination}
          />
        ) : null}

        {/* if the user has a driver, show the driver details */}

        {this.props.order.has_ride ? (
          <DriverDetailsPopUp
            driver={this.props.order.driver_details}
            distance={this.state.distance}
            user_ride_channel={this.user_ride_channel}
          />
        ) : null}

        <View
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
        >
          {!this.props.order.destinationRequested ? (
            <Ionicons
              name="md-menu"
              size={32}
              color="black"
              onPress={() => {
                this.props.navigation.openDrawer();
                // this.bookRide();
              }}
            />
          ) : (
            <Ionicons
              name="md-arrow-round-back"
              size={32}
              color="black"
              onPress={() => {
                // this.props.navigation.openDrawer();

                // this.setState({

                store.dispatch({
                  type: "DESTINATION_CANCELLED",
                });
                // destinationRequested: false,
                // });
                this.centerMap();
              }}
            />
          )}
        </View>

        {/* <View style = {styles.destination}>  */}
        {/* <SearchInput /> */}

        {/* </View> */}

        {/* <CurrentLocationButton
          cb={() => {
            this.centerMap();
          }}
        /> */}

        {!this.props.order.destinationRequested &&
        !this.props.order.has_ride ? (
          <CurrentLocationButton
            cb={() => {
              this.centerMap();
            }}
            onPress={() => {
              this.refs.BottomSheet.current.snapTo(9);
            }}
          />
        ) : null}

        {this.props.order.region && (
          <MapView
            followUserLocation={true}
            // initialRegion={this.props.order.region}
            rotateEnabled={false}
            showsUserLocation={false}
            showsBuildings={false}
            zoomEnabled={true}
            showsCompass={false}
            onMapReady={() => {
              this.centerMap();
            }}
            onRegionChangeComplete={() => {
              this.marker && this.marker.showCallout();
            }}
            //comment this if any error
            // region={{
            //   latitude: this.props.order.region.latitude ?this.props.order.region.latitude : 9.04,

            //   longitude: this.props.order.region.longitude ?  this.props.order.region.longitude : 7.04,

            //   latitudeDelta: 0.5,
            //   longitudeDelta: LONGITUDE_DELTA,
            // }}

            style={{
              flex: 1,
              zIndex: 0,
            }}
            ref={(map) => {
              this.map = map;
            }}
          >
            {/* {this.state.my_location &&  */}

            {!this.props.order.destinationRequested &&
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
                    // latitude: this.state.location.latitude
                    //   ?parseFloat(this.state.location.latitude
                    //    ) : 7.3986,
                    // longitude: this.state.location.longitude
                    //   ?parseFloat(this.state.location.longitude
                    //   ): 9.0765,

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
                    user
                      ? user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1)
                      : " There!"
                  }`}
                ></Marker.Animated>
              )}

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
                ></MapViewDirections>

                <Marker.Animated
                  title="Your Destination"
                  coordinate={this.props.order.going}
                  pinColor="#ffffff"
                />
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
                    // latitude: this.state.location.latitude
                    //   ?parseFloat(this.state.location.latitude
                    //    ) : 7.3986,
                    // longitude: this.state.location.longitude
                    //   ?parseFloat(this.state.location.longitude
                    //   ): 9.0765,

                    latitude: this.props.order.region
                      ? this.props.order.region.latitude
                      : 9.0765,
                    longitude: this.props.order.region
                      ? this.props.order.region.longitude
                      : 7.3986,
                  }}
                  title={"You're here"}
                ></Marker.Animated>
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
                    // latitude: this.state.location.latitude
                    //   ?parseFloat(this.state.location.latitude
                    //    ) : 7.3986,
                    // longitude: this.state.location.longitude
                    //   ?parseFloat(this.state.location.longitude
                    //   ): 9.0765,

                    latitude: this.props.order.region
                      ? this.props.order.region.latitude
                      : 9.0765,
                    longitude: this.props.order.region
                      ? this.props.order.region.longitude
                      : 7.3986,
                  }}
                  title={"You're here"}
                ></Marker.Animated>
                {this.props.order.order.state == "Started" && (
                  <>
                    <MapViewDirections
                      origin={this.state.driver_location}
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
                  coordinate={this.state.coordinate}
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
        <StatusBar style="auto" />

        {/* <View
        style={{
          flex: 1,
          // backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
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
