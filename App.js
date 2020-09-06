import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import DestinationButton from "./components/destinationButton";
import CurrentLocationButton from "./components/currentLocationButton";
import Driver from "./components/driver";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 9.0765,
        longitude: 7.3986,
        latitudeDelta: 0.992,
        longitudeDelta: 0.0421,
      },
    };

    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
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
    this.setState({
      region: region,
    });

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

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>Home Screen</Text> */}

        <DestinationButton />

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
          showsTraffic={true}
          style={{
            flex: 1,
            zIndex : 0
          }}
          ref={(map) => {
            this.map = map;
          }}
        >

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
