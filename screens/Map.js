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
  YellowBox,
  Platform,
} from "react-native";
import store from "../store";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
// import { Animated} from "react-native-reanimated"
import RBSheet from "react-native-raw-bottom-sheet";

import DestinationButton from "../components/destinationButton";

import Driver from "../components/driver";
import CurrentLocationButton from "../components/currentLocationButton";

import { Ionicons } from "@expo/vector-icons";
import SearchInput from "../components/SearchInput";
import Geocoder from "react-native-geocoding";
import google_api from "../keys/google_map";
import { connect } from "react-redux";
import Pusher from "pusher-js/react-native";
import { regionFrom, getLatLonDiffInMeters } from "../helpers/helper";

import MapViewDirections from "react-native-maps-directions";

import { LogBox } from "react-native";

import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Button, Content, Header, Icon, Image } from "native-base";
import MaterialButtonPink from "./material/MaterialButtonPink";
import MaterialButtonPink1 from "./material/MaterialButtonPink1";
import * as Animatable from "react-native-animatable";
import { BackHandler } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.3358723958820065; //Very high zoom level
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
class Map extends Component {
  constructor(props) {
    super(props);
    this.map = [];
    this.marker = React.createRef();
    // this.props.auth.user.phoneNumber = null;

    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;

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
  };

  componentDidMount() {
    console.log("initial region ", this.props.order.region);

    // if(this.map){
    //   this.centerMap();
    // }

    // this._getLocationAsync();

    // this.pusher_actions()

    // console.log("Mounted with props, ", this.props.navigation)
  }

  pusher_actions = () => {
    const {token} = this.props.auth
    let pusher = new Pusher("eead8d5075773e7aca0a", {
      authEndpoint: "http://8922a4216fe3.ngrok.io/api/pusher/auth",
      cluster: "eu",
      auth: {
        headers: { "x-auth-token": `${token}` },
      },
      encrypted: true,
    });

    // this.props.auth.user.phoneNumber = this.props.auth.user.phoneNumber
    Pusher.logToConsole = true;
    const { user } = this.props.auth;
    if (!this.available_drivers_channel && user) {
      this.available_drivers_channel = pusher.subscribe(
        `private-available-drivers-${this.props.route.params.logistics}`,
        function () {
          console.log("Subscribed succesfully");
        }
      );

      // available_drivers_channel.bind("Driver_Accepted", function (data) {
      //   alert("New Driver Alerted")

      //     })
      if (!this.user_ride_channel) {
        this.user_ride_channel = pusher.subscribe(
          "private-ride-" + this.props.auth.user.phoneNumber
        );
        this.user_ride_channel.bind("pusher:subscription_succeeded", () => {
          this.user_ride_channel.bind("client-driver-response", (data) => {
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

            const found_driver = {
              has_ride: true,
              is_searching: false,
              location: driverLocation,
              driver: {
                latitude: data.location.latitude,
                longitude: data.location.longitude,
                accuracy: data.location.accuracy,
              },

              driverName: data.driver.name,
            };

            store.dispatch({
              type: "FOUND_DRIVER",
              payload: found_driver,
            });

            // this.setState({

            // });

            Vibration.vibrate();

            console.log(
              "Driver accepted and animating to driver location ",
              data
            );

            this.map.animateToRegion(
              {
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                longitude: data.location.longitude,
                latitude: data.location.latitude,
              },
              2000
            );
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
              // this.setState({

              // });

              // if (Platform.OS === "android") {
              //   if (this.marker && newCoordinate) {
              //     console.log({ newCoordinate });
              //     console.log("ANIMATING TO NEW POSITION ", newCoordinate);

              //     this.marker &&
              //       this.marker.animateMarkerToCoordinate(newCoordinate, 500); // 500 is the duration to animate the marker
              //   }
              // } else {
              //   coordinate.timing(newCoordinate).start();
              // }
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

            if (data.type == "near_dropoff") {
              this._getLocationAsync();
            }

            Alert.alert(
              data.title,
              data.msg,
              [
                {
                  text: "Aye sir!",
                },
              ],
              { cancelable: false }
            );
          });
        });
      }
    }
  };

  centerMap = () => {
    const {
      latitudeDelta,
      longitudeDelta,
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
      2000
    );

    console.log("animation should be complete");
  };

  selectDestination = async (going) => {
    console.log("performing the select destination ", going);
    var data = {
      going: going,
      destinationRequested: true,
      latitudeDelta: 0.3,
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

    // console.log("latitude animate to ", latitude);
    // console.log("longitude animate to ", longitude);

    // await this._getLocationAsync
    this.map.animateToRegion(
      {
        latitudeDelta,
        longitudeDelta,
        latitude,
        longitude,
      },
      2000
    );
  };

  bookRide = () => {
    console.log("booking ride");
    this.pusher_actions();
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

    const { user } = this.props.auth;
    let pickup_data = {
      name: user.firstName,
      latitude: this.props.order.region.latitude,
      longitude: this.props.order.region.longitude,
    };

    let dropoff_data = {
      name: "Area",
      latitude: this.props.order.going.latitude,
      longitude: this.props.order.going.longitude,
    };

    let phoneNumber = this.props.auth.user.phoneNumber;
    let avaiable_drivers_channel = this.available_drivers_channel;

    const trigger = function () {
      console.log(
        "Trigger functionality reached",
        phoneNumber,
        pickup_data,
        dropoff_data
      );
      avaiable_drivers_channel.trigger("client-driver-request", {
        phoneNumber: phoneNumber,
        pickup: pickup_data,
        dropoff: dropoff_data,
        // triggered : "Yes!"
      });
    };

    const data = {
      startLatitude: this.props.order.region.latitude,
      startLongitude: this.props.order.region.longitude,
      endLatitude: this.props.order.going.latitude,
      endLongitude: this.props.order.going.longitude,
      price: Math.ceil(this.props.order.price / 100) * 100,
      trigger: trigger,
    };

    this.props.makeOrder(data);
  };

  cancelOrder = () => {
    // this.setState({
    //   is_searching: false,
    // });

    store.dispatch({
      type: "DESTINATION_CANCELLED",
    });

    store.dispatch({
      type : "END_FETCHING"
    })
    this.centerMap();

    this.props.cancelOrder();
    //  this.user_ride_channel.unbind_all()
    this.user_ride_channel.unbind("client-driver-response");

    this.user_ride_channel.unbind("client-found-driver");

    this.user_ride_channel.unbind("client-driver-location");

    this.user_ride_channel.unbind("client-driver-message");
    // this.user_ride_channel.unbind_all()

    
  };

  componentWillUnmount() {
    console.log("Unmounting COmponents!!!!!!!");

    navigator.geolocation.clearWatch(this.watchId);

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
        {/* <MaterialButtonPink
          style={styles.materialButtonPink}

          onPress ={()=>
            this.props.navigation.navigate("creditCardScreen", {
              bookRide : this.bookRide()
            })
          }
        ></MaterialButtonPink> */}
        <Button
          rounded
          dark
          style={styles.materialButtonPink1}
          onPress={() => {
            this.bookRide();
          }}
        >
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
        {/* <MaterialButtonPink1
          style={styles.materialButtonPink1}
          onPress ={()=>this.props.navigation.navigate("creditCardScreen")}
        ></MaterialButtonPink1> */}

        <Button
          rounded
          warning
          style={styles.materialButtonPink1}
          onPress={() => {
            const { user } = this.props.auth;

            {
              user.card.length == 0
                ? this.props.navigation.navigate("creditCardScreen", {
                    bookRide: this.bookRide,
                  })
                : this.bookRide();
              // store.dispatch({
              //   type : "END_LOADING"
              // })
            }

            // this.setState({
            //   is_searching: false,
            // });
          }}
        >
          <Text
            style={{ fontSize: 22, color: "white", paddingLeft: wp("10%") }}
          >
            Card
          </Text>
        </Button>
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
                color: "red  ",
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

        {this.props.order.has_ride ? <DriverDetailsPopUp /> : null}

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
            showsBuildings={true}
            zoomEnabled={true}
            showsCompass={false}
            onMapReady={() => {
              this.centerMap();
            }}
            onRegionChangeComplete={() =>
              this.marker && this.marker.showCallout()
            }
            // region={{
            //   latitude: this.props.order.region.latitude ?this.props.order.region.latitude : 9.04,

            //   longitude: this.props.order.region.longitude ?  this.props.order.region.longitude : 7.04,

            //   latitudeDelta: LATITUDE_DELTA,
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

            {!this.props.order.destinationRequested && this.props.order.region && (
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
                title={`Hello ${
                  user.firstName.charAt(0).toUpperCase() +
                  user.firstName.slice(1)
                }`}
              ></Marker.Animated>
            )}

            {this.props.order.destinationRequested ? (
              <>
                <MapViewDirections
                  origin={this.props.order.region}
                  destination={this.props.order.going}
                  apikey={google_api}
                  strokeWidth={3}
                  strokeColor="blue"
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
              <Driver
                driver={{
                  uid: null,
                  location: {
                    latitude: this.props.order.driver.latitude,
                    longitude: this.props.order.driver.longitude,
                    // latitudeDelta :0.3,
                    // longitudeDelta : 0.3,
                  },
                }}
                innerRef={this.marker}
              />
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
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    marginTop: 10,
    // marginLeft: WIDTH / 3,
    alignSelf: "center",
  },
  n3500: {
    fontFamily: "roboto-900",
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
