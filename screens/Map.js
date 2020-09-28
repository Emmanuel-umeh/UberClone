import React, { Component } from "react";

import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import DestinationButton from "../components/destinationButton";

import Driver from "../components/driver";
import CurrentLocationButton from "../components/currentLocationButton";

import { Ionicons } from "@expo/vector-icons";
import SearchInput from "../components/SearchInput";
import Geocoder from "react-native-geocoding";
import google_api from "../keys/google_map";

import MapViewDirections from "react-native-maps-directions";

// 9.0765,
// "longitude": 7.3986,

// const coming = {latitude:  9.0756154, longitude: 7.4880122};
// const going = {latitude: 9.0756154, longitude: 7.3886};
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 9.0765,
        longitude: 7.3986,
        latitudeDelta: 0.992,
        longitudeDelta: 0.0421,

        // destination the user is going to

      },
      
      coming: { latitude: 9.0756154, longitude: 7.4880122 },
      going: { latitude: 9.0756154, longitude: 7.3886 },
      // determines if the user has selected the destination
      destinationRequested: false,
      // destination : ""

      address: null,
      addressShortName: null,
    };
  }

  componentDidMount() {
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

  selectDestination =(going)=>{
    this.setState({
      going : going,
      destinationRequested : true
    })


    const WIDTH = Dimensions.get("window").width;
    const HEIGHT = Dimensions.get("window").height;
    const ASPECT_RATIO = WIDTH / HEIGHT;
    const LATITUDE_DELTA = 0.02358723958820065; //Very high zoom level
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


    const latitude = going.latitude
    const longitude = going.longitude
    console.log("latitude animate to ", latitude)
    console.log("longitude animate to ", longitude)
    this.map.animateToRegion(
      {
        // LATITUDE_DELTA,
        // LONGITUDE_DELTA,
        latitude,
        longitude,
      },
      2000
    );

  }

  render() {
    console.log(
      "State updated!!!!!" , this.state.going, this.state.destinationRequested
    );
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

          selectDestination ={this.selectDestination}
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
            <MapViewDirections
              origin={this.state.coming}
              destination={this.state.going}
              apikey={google_api}
              strokeWidth={3}
              strokeColor="blue"
            />
          ) : null}

          <Driver
            driver={{
              uid: null,
              location: {
                latitude: 9.0765,
                longitude: 7.3986,
                // latitudeDelta :0.3,
                // longitudeDelta : 0.3,
              },
            }}
          />
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
