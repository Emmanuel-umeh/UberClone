import React, { Component } from 'react'
import MapView, {Marker, Overlay} from 'react-native-maps'
import {day_styles, night_styles} from "./map_styles/styles"

import { connect } from 'react-redux'
import { StyleSheet,Image, View,Text, SafeAreaView } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import * as Location from "expo-location";
  import marker from '../assets/markers/marker5.png'
import { Divider } from 'react-native-paper'
  
  const latitudeDelta = 0.025
  const longitudeDelta = 0.025
  
class Confirm_Location extends Component {


    constructor(props){
        super(props)

        this.marker = null
        this.map = null
    }
    state = {
      region: {
        latitudeDelta,
        longitudeDelta,
        latitude: 25.1948475,
        longitude: 55.2682899
      }
    }
  
    onRegionChange = region => {
      this.setState({
        region
      })
    }

    centerCamera= ()=>{
var {latitude, longitude} = this.props.order.region
        this.map &&
        this.map.animateCamera(
          {
            center: {
              latitude,
              longitude,
            },
            pitch: 20,
            heading: 30,
            altitude: 100,
            zoom: 16,
          },
          800
        );
    }
  
    render() {
      const { region } = this.state
  
      return (
        <View style={styles.map}>
          <MapView
            style={styles.map}
            customMapStyle = {day_styles}
            ref={(map) => {
                this.map = map;
              }}

              onMapReady ={this.centerCamera}
            initialRegion={this.props.order.region}
            onRegionChangeComplete={this.onRegionChange}
            showsUserLocation = {true}
            showsCompass = {false}
          />
          <View style={styles.markerFixed}>
            <Image style={styles.marker} style={{
                width : 60
            }} source={marker} />
          </View>
          <SafeAreaView style={styles.footer}>
            {/* <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text> */}

            <View>
              <Text style = {styles.bold}> Confirm Pickup Location</Text>
              <Text>700</Text>
            </View>

            <Divider />            
          </SafeAreaView>
        </View>
      )
    }
  }
  
  const styles = StyleSheet.create({
    map: {
      flex: 3,

    },
    markerFixed: {
      left: wp(50),
      marginLeft: -24,
      marginTop: -48,
      position: 'absolute',
      top: hp(50)
    },
    marker: {
      height: 48,
      width: 48
    },
    footer: {
      backgroundColor: "white",
      borderTopLeftRadius : 20,
      borderTopRightRadius : 20,
      bottom: 0,
      flex : 1,
      // position: 'absolute',
      width: '100%'
    },
    region: {
      color: '#fff',
      lineHeight: 20,
      margin: 20
    },

    bold: {
      fontFamily: "Quicksand-Bold",
      color: "#121212",
      fontSize: 20,
      marginTop: 10,
      // marginLeft: WIDTH / 3,
      alignSelf: "center",
    },
      })


const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    order: state.order,
  });
  
export default connect(mapStateToProps, {} )(Confirm_Location)