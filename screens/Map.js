import React, { Component } from "react";

import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
// import { Animated} from "react-native-reanimated"

import DestinationButton from "../components/destinationButton";

import Driver from "../components/driver";
import CurrentLocationButton from "../components/currentLocationButton";

import { Ionicons } from "@expo/vector-icons";
import SearchInput from "../components/SearchInput";
import Geocoder from "react-native-geocoding";
import google_api from "../keys/google_map";

import Pusher from 'pusher-js/react-native';
import { regionFrom, getLatLonDiffInMeters } from '../helpers/helper';

import MapViewDirections from "react-native-maps-directions";

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
export default class Map extends Component {

 constructor(props) {
    super(props);

    this.username = 'wernancheta';
  	this.available_drivers_channel = null;
  	this.bookRide = this.bookRide.bind(this);
  	this.user_ride_channel = null;
    this.state = {
      region: {
        latitude: 9.0765,
        longitude: 7.3986,
        latitudeDelta: 0.992,
        longitudeDelta: 0.0421,


        // destination the user is going to
      },

      coming: null,
      going:null,
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
      has_ridden: false
    };
  }


  componentDidMount() {
    this._getLocationAsync();

    var pusher = new Pusher('1077455', {
      authEndpoint: ' http://63083334861a.ngrok.io/api/pusher/auth',
      cluster: 'eu',
      encrypted: true
    }); 

    
    this.available_drivers_channel = pusher.subscribe('private-available-drivers');

    this.user_ride_channel = pusher.subscribe('private-ride-' + this.username);

    this.user_ride_channel.bind('client-driver-response', (data) => {
    	
      let passenger_response = 'no';
      if(!this.state.has_ride){
        passenger_response = 'yes';
      }

      // passenger responds to driver's response
  		this.user_ride_channel.trigger('client-driver-response', {
  			response: passenger_response
  		});
    });

    this.user_ride_channel.bind('client-found-driver', (data) => {
  		// found driver, the passenger has no say about this.
  		// once a driver is found, this will be the driver that's going to drive the user
  		// to their destination
  		let region = regionFrom(
  			data.location.latitude,
  			data.location.longitude,
  			data.location.accuracy 
  		);

  		this.setState({
  			has_ride: true,
  			is_searching: false,
  			location: region,
  			driver: {
  			  latitude: data.location.latitude,
  			  longitude: data.location.longitude,
  			  accuracy: data.location.accuracy
  			}
  		});

  		Alert.alert(
  			"Orayt!",
  			"We found you a driver. \nName: " + data.driver.name + "\nCurrent location: " + data.location.name,
  			[
  			  {
  			    text: 'Sweet!'
  			  },
  			],
  			{ cancelable: false }
  		);      

    });

    this.user_ride_channel.bind('client-driver-location', (data) => {
      console.log("did it bind ? ", data)
      // driver location received
      let region = regionFrom(
        data.latitude,
        data.longitude,
        data.accuracy
      );

      this.setState({
        location: region,
        driver: {
          latitude: data.latitude,
          longitude: data.longitude
        }
      });

    });

    this.user_ride_channel.bind('client-driver-message', (data) => {
    	if(data.type == 'near_pickup'){
    		//remove passenger marker
    		this.setState({
    			has_ridden: true
    		});
    	}

    	if(data.type == 'near_dropoff'){
    		this._setCurrentLocation();
    	}
    	
    	Alert.alert(
	        data.title,
	        data.msg,
	        [
	          {
	            text: 'Aye sir!'
	          },
	        ],
	        { cancelable: false }
      	);	
    });

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

    console.log("region ", region);

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
        console.log(json.results[0].formatted_address);

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

  selectDestination = (going) => {
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
    console.log("latitude animate to ", latitude);
    console.log("longitude animate to ", longitude);
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
  
  
  bookRide() {

    // RNGooglePlacePicker.show((response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled GooglePlacePicker');
    //   } else if (response.error) {
    //     console.log('GooglePlacePicker Error: ', response.error);
    //   } else {
        this.setState({
        	is_searching: true,
        	destination: response
        });

        let pickup_data = {
          name: this.state.origin.name,
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude
        };

        let dropoff_data = {
          name: response.name,
          latitude: response.latitude,
          longitude: response.longitude
        };

        this.available_drivers_channel.trigger('client-driver-request', {
          username: this.username,
          pickup: pickup_data,
          dropoff: dropoff_data
        });

      }
    // });
  // }
  render() {
    console.log("State updated!!!!!", this.state.latitudeDelta);
    
  // const scale = useRef(new Animated.Value(0))

  // const scaleAnimation = withTimingTransition(scale.current)

//  useCode(()=>cond(eq(scale.current,0),set(scale.current,1)),[])
    // this.props.route.params
    //   ? this.setState({
    //       going: this.props.route.params.destination,
    //       destinationRequested: true,
    //     })
    //   : null;
    // console.log("this is it !!!! ",this.props.navigation)
    return (
      <View style={styles.container}>
        {/* <Text>Home Screen</Text> */}

        <DestinationButton
          navigation={this.props.navigation}
          state={this.state}
          selectDestination={this.selectDestination}
        />

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
          <Ionicons
            name="md-menu"
            size={32}
            color="black"
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          />
        </View>

        {/* <View style = {styles.destination}>  */}
        {/* <SearchInput /> */}

        {/* </View> */}

        {/* <CurrentLocationButton
          cb={() => {
            this.centerMap();
          }}
        /> */}

        <CurrentLocationButton
          cb={() => {
            this.centerMap();
          }}
        />

        <MapView
          followUserLocation={true}
          initialRegion={this.state.region}
          rotateEnabled={false}
          showsUserLocation={true}
          showsBuildings={true}
          zoomEnabled={true}
          showsCompass={true}
          followUserLocation={true}
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
              ></MapViewDirections>

              <Marker coordinate={this.state.going} pinColor="#ffffff" />
              <Marker coordinate={this.state.region} pinColor="#000000" />
            
            </>
          ) : null}


{
              this.state.driver &&
              <MapView.Marker
                coordinate={{
                latitude: this.state.driver.latitude, 
                longitude: this.state.driver.longitude}}
                title={"Your driver is here"}
                pinColor={"#4CDB00"}
              />
            }


          {/* <Driver
            driver={{
              uid: null,
              location: {
                latitude: 9.0765,
                longitude: 7.3986,
                // latitudeDelta :0.3,
                // longitudeDelta : 0.3,
              },
            }}
          /> */}
        </MapView>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
