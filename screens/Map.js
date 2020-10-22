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
import { Button, Content, Header, Image } from "native-base";
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
// import {
//   SharedElement,
//   SharedElementTransition,
//   nodeFromRef,
//   createSharedElementStackNavigator
// } from 'react-native-shared-element';
// import { withTimingTransition } from "react-native-redash";
// import { cond, eq, set, useCode } from "react-native-reanimated";

// 9.0765,
// "longitude": 7.3986,

// const coming = {latitude:  9.0756154, longitude: 7.4880122};
// const going = {latitude: 9.0756154, longitude: 7.3886};
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
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
this.map =[]
    this.marker = React.createRef();
    this.phoneNumber = "09021990562";

    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;
    this.state = {

      // clients initial region
      region: {
        latitude: 9.0765,
        longitude: 7.3986,
        latitudeDelta: 0.992,
        longitudeDelta: 0.0421,

        // destination the user is going to
      },

      coming: null,
      going: null,
      // determines if the user has selected the destination
      destinationRequested: false,
      // destination : ""

      address: null,

      addressShortName: null,

      location: null,
      error: null,
      has_ride: false,
      destination: null,
      driver: null,
      origin: null,
      is_searching: false,
      has_ridden: false,
      totalPriceVisible: false,

      // price of ride
      price: 0,

      // name of the accepted driver
      driverName: null,
    };
  }

  componentDidMount() {
    var pusher = new Pusher("eead8d5075773e7aca0a", {
      authEndpoint: "http://5ce2b3d6af3a.ngrok.io/api/pusher/auth",
      cluster: "eu",
      auth: {
        headers : { 'Authorization':'bb692c03c2d8402ca3a5' }
      },
      encrypted: true,
    });
    Pusher.logToConsole = true;

    this.available_drivers_channel = pusher.subscribe(
      "private-available-drivers",
      function () {
        console.log("Subscribed succesfully");
      }
    );

    // available_drivers_channel.bind("Driver_Accepted", function (data) {
    //   alert("New Driver Alerted")
    //     })

    this.user_ride_channel = pusher.subscribe(
      "private-ride-" + this.phoneNumber
    );
    this.user_ride_channel.bind("pusher:subscription_succeeded", () => {
      this.user_ride_channel.bind("client-driver-response", (data) => {
        let passenger_response = "no";
        if (!this.state.has_ride) {
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
          has_ride: true,
          is_searching: false,
          location: driverLocation,
          driver: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            accuracy: data.location.accuracy,
          },

          driverName: data.driver.name,
        });

   
        Vibration.vibrate();


        console.log("Driver accepted and animating to driver location ", data);

        const WIDTH = Dimensions.get("window").width;
        const HEIGHT = Dimensions.get("window").height;
        const ASPECT_RATIO = WIDTH / HEIGHT;
        const LATITUDE_DELTA = 0.02358723958820065; //Very high zoom level
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
          const { longitude, latitude, accuracy } = data


          console.log("client driver location updated!! ? ", latitude,longitude,accuracy);

          const newCoordinate = {
            latitude,
            longitude,
          };

          // driver location received
          let driverLocation = regionFrom(latitude, longitude, accuracy);
console.log("the drivers new location ", driverLocation)
          this.setState({
            location: driverLocation,//the drivers location
            driver: {
              latitude: latitude,
              longitude: longitude,
            },
          });

          if (Platform.OS === "android") {
            if (this.marker && newCoordinate) {
              console.log({ newCoordinate });
              console.log("ANIMATING TO NEW POSITION ", newCoordinate);

              this.marker &&
              this.marker.animateMarkerToCoordinate(
                newCoordinate,
                500
              ); // 500 is the duration to animate the marker
            }
          } else {
            coordinate.timing(newCoordinate).start();
          }
        }
      });

      this.user_ride_channel.bind("client-driver-message", (data) => {
        if (data.type == "near_pickup") {
          //remove passenger marker
          this.setState({
            has_ridden: true,
          });
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

    this._getLocationAsync();

    // console.log("Mounted with props, ", this.props.navigation)
  }
  _getLocationAsync = async () => {
    Geocoder.init("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("Permission to access denied!!!.");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const WIDTH = Dimensions.get("window").width;
    const HEIGHT = Dimensions.get("window").height;
    const ASPECT_RATIO = WIDTH / HEIGHT;
    const LATITUDE_DELTA = 0.02358723958820065; //Very high zoom level
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    // console.log("region ", region);

    // console.log("latitude,longitude ", location.coords.latitude,location.coords.latitude,)
    this.setState({
      region: region,
    });

    Geocoder.from({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
      .then((json) => {
        var addressComponent = json.results[0].address_components[0].long_name;
        // console.log(json.results[0].formatted_address);

        this.setState({
          address: json.results[0].formatted_address,
          addressShortName: addressComponent,
        });
        // y address  Object {
        //   "long_name": "9",
        //   "short_name": "9",
        //   "types": Array [
        //     "street_number",
        //   ],
        // }
      })
      .catch((error) => console.warn(error));
    this.watchId = location;

    this.centerMap();
  };

  centerMap = () => {
    const {
      latitudeDelta,
      longitudeDelta,
      latitude,
      longitude,
    } = this.state.region;

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

  selectDestination = async (going) => {
    // console.log("performing the select destination ");
    this.setState({
      going: going,
      destinationRequested: true,
      latitudeDelta: 0.3,
    });

    const WIDTH = Dimensions.get("window").width;
    const HEIGHT = Dimensions.get("window").height;
    const ASPECT_RATIO = WIDTH / HEIGHT;
    const latitudeDelta = 0.3358723958820065; //Very high zoom level
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    const latitude = going.latitude;
    const longitude = going.longitude;

    var diff_in_meter_pickup = getLatLonDiffInMeters(
      this.state.region.latitude,
      this.state.region.longitude,
      going.latitude,
      going.longitude
    );

    console.log({diff_in_meter_pickup})

    this.setState({
      price : diff_in_meter_pickup *0.2
    })

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
    // RNGooglePlacePicker.show((response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled GooglePlacePicker');
    //   } else if (response.error) {
    //     console.log('GooglePlacePicker Error: ', response.error);
    //   } else {
    this.setState({
      is_searching: true,
      // destination: response,
    });

    const { user } = this.props.auth;
    let pickup_data = {
      name: user.firstName,
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    };

    let dropoff_data = {
      name: "Area",
      latitude: this.state.going.latitude,
      longitude: this.state.going.longitude,
    };

    this.available_drivers_channel.trigger("client-driver-request", {
      phoneNumber: this.phoneNumber,
      pickup: pickup_data,
      dropoff: dropoff_data,
      // triggered : "Yes!"
    });
  };

  
  cancelOrder =()=>{
    this.setState({
      is_searching: false,
    })
//  this.user_ride_channel.unbind_all()
this.user_ride_channel.unbind("client-driver-response")

this.user_ride_channel.unbind("client-found-driver")

this.user_ride_channel.unbind("client-driver-location")

this.user_ride_channel.unbind("client-driver-message")
    // this.user_ride_channel.unbind_all()
  }

  componentWillUnmount() {
    console.log("Unmounting COmponents!!!!!!!");
    
    navigator.geolocation.clearWatch(this.watchId);

    this.user_ride_channel.unbind("client-driver-response")

    this.user_ride_channel.unbind("client-found-driver")

    this.user_ride_channel.unbind("client-driver-location")

    this.user_ride_channel.unbind("client-driver-message")
    // this.user_ride_channel && this.user_ride_channel.unbind_all()

    // this.user_ride_channel.unbind_all()
    // this.pusher &&
      // this.pusher.unsubscribe(
      //   "private-ride-" + this.state.passenger.phoneNumber
      // );
  }




  renderContent = () => (
    
    <Animatable.View animation="slideInUp" delay={1300} style={styles.rect}>
      <Text style={styles.totalAmount}>Total Amount</Text>
      <Text style={styles.n3500}> ₦{Math.ceil(this.state.price/100)*100}</Text>

      <Text
        style={{
          // marginLeft: WIDTH / 6,
          alignSelf :"center"

          // flex : 1,
          // flexDirection : "row",
          // justifyContent : "center"
        }}
      >
        How Would You Like To Pay for Your {this.props.route.params.logistics}?
      </Text>
      <View style={styles.materialButtonPinkRow}>
        {/* <MaterialButtonPink
          style={styles.materialButtonPink}

          onPress ={()=>
            this.props.navigation.navigate("creditCardScreen", {
              bookRide : this.bookRide()
            })
          }
        ></MaterialButtonPink> */}
        <Button rounded success style = {styles.materialButtonPink1}
        onPress ={()=>{
          
this.bookRide()
         
        
                }        }
        >
            <Text style = {{fontSize : 22, color : "white", alignSelf : "center", paddingLeft : wp("12%")}}>Cash</Text>
          </Button>
        {/* <MaterialButtonPink1
          style={styles.materialButtonPink1}
          onPress ={()=>this.props.navigation.navigate("creditCardScreen")}
        ></MaterialButtonPink1> */}

<Button rounded warning  style = {styles.materialButtonPink1}

onPress ={()=>{

  this.props.navigation.navigate("creditCardScreen", {
    bookRide : this.bookRide
  })
  this.setState({
    is_searching : false
  })

}
  }


>
            <Text style = {{fontSize : 22, color : "white", paddingLeft : wp("12%")}}>Card</Text>
          </Button>
      </View>
      <TouchableOpacity>
        <Animatable.View
          animation="bounceIn"
          onPress={() => {
            this.setState({
              destinationRequested: false,
            });
            this.centerMap;
          }}
          delay={1500}
          style={{
            width: WIDTH,
          }}
        >
          <Text
            onPress={() => {
              this.setState({
                destinationRequested: false,
              });
              this._getLocationAsync();
            }}
            style={{
              // marginLeft: WIDTH / 3,
              alignSelf :"center",
              fontWeight: "bold",
              fontSize: 20,
              color: "#c90c02",
            }}
          >
            Cancel Order
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
    console.log("has driver ? ", this.state.has_ride);

    return (
      <View style={styles.container}>



        {this.state.is_searching  &&
        <CustomModal  cancelOrder = {this.cancelOrder}/>
           } 
        {!this.state.destinationRequested && !this.state.has_ride ? (
          <DestinationButton
            navigation={this.props.navigation}
            state={this.state}
            logistics={this.props.route.params.logistics}
            selectDestination={this.selectDestination}
          />
        ) : null}

        {/* if the user has a driver, show the driver details */}

        {this.state.has_ride ? 
        <DriverDetailsPopUp /> : null}

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
          {!this.state.destinationRequested ? (
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

                this.setState({
                  destinationRequested: false,
                });
                this.centerMap;
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

        {!this.state.destinationRequested && !this.state.has_ride ? (
          <CurrentLocationButton
            cb={() => {
              this.centerMap();
            }}
            onPress={() => {
              this.refs.BottomSheet.current.snapTo(9);
            }}
          />
        ) : null}

        <MapView
          followUserLocation={true}
          initialRegion={this.state.region}
          rotateEnabled={false}
          showsUserLocation={true}
          showsBuildings={true}
          zoomEnabled={true}
          showsCompass={false}
          loadingEnabled
          // followUserLocation={true}
          // showsTraffic={true}
          style={{
            flex: 1,
            zIndex: 0,
          }}
          ref={(map) => {
            this.map = map;
          }}
        >
          {this.state.destinationRequested ? (
            <>
              <MapViewDirections
                origin={this.state.region}
                destination={this.state.going}
                apikey={google_api}
                strokeWidth={3}
                strokeColor="blue"
                showsCompass={false}
              ></MapViewDirections>

              <Marker coordinate={this.state.going} pinColor="#ffffff" />
              <Marker coordinate={this.state.region} pinColor="#000000" />
            </>
          ) : null}

          {this.state.driver && (
        

            <Driver
              driver={{
                uid: null,
                location: {
                  latitude: this.state.driver.latitude,
                  longitude: this.state.driver.longitude,
                  // latitudeDelta :0.3,
                  // longitudeDelta : 0.3,
                },
              }}
            
              innerRef = {this.marker}
            />
          )}
        </MapView>
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

        {this.state.destinationRequested && !this.state.is_searching ? (
          <BottomSheet
            ref={this.sheetRef}
            snapPoints={["40%", "10%"]}
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
});

// export default ProjectForm
export default connect(mapStateToProps, {})(Map);

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
    alignSelf :"center"
  },
  n3500: {
    fontFamily: "roboto-900",
    color: "#121212",
    fontSize: 40,
    marginTop: 10,
    // marginLeft: WIDTH / 3,
    alignSelf :"center"
  },
  materialButtonPink: {
    height: hp("13%"),
    width: wp("35%"),
    // borderRadius: 100,
    marginTop: 1,
  },
  materialButtonPink1: {
    height: hp("13%"),
    width: wp("35%"),
    // borderRadius: 100,
    marginLeft: 28,
  },
  materialButtonPinkRow: {
    flex : 1,
    flexDirection : "row",
    alignContent : "center",
    height: hp("30%"),
    justifyContent : "center",
    marginTop: 20,
    marginRight: 4,
  },
});
