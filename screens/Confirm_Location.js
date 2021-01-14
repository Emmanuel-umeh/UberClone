import React, { Component } from 'react'
import MapView, {Marker, Overlay} from 'react-native-maps'
import {day_styles, night_styles} from "./map_styles/styles"

import { connect } from 'react-redux'
import { StyleSheet,Image, View,Text, SafeAreaView, TouchableOpacity } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import * as Location from "expo-location";
  import marker from '../assets/markers/marker5.png'
import { Divider } from 'react-native-paper'
import { Container, Header, Content, Card, CardItem, Icon, Right, Left, Body, Title, Button,Picker, Switch } from 'native-base';

import { Platform } from 'react-native';
import CurrentLocationButton from '../components/currentLocationButton'

// let TouchableHighlight,TouchableOpacity;
// if (Platform.OS === 'ios') {
//     ({ TouchableHighlight,TouchableOpacity } = require('react-native-gesture-handler'));
// } else {
//     ({ TouchableHighlight,TouchableOpacity } = require('react-native'));
// }

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
      , loading : false,
      address_name  : null
    }
  
    onRegionChange =async (region) => {

      try {
        this.setState({
          loading:true,
          region
        })
  
       var location = await Location.reverseGeocodeAsync({
       latitude:   region.latitude, 
      longitude  :  region.longitude
        })
  
        console.log({location})
  
        this.setState({
          location :false
        })
      } catch (error) {
        console.warn(error)
      }
   
    }


      async componentDidMount(){

        try {
           
        var {latitude, longitude} = this.props.order.region

        const location = await Location.reverseGeocodeAsync({
          latitude, longitude
        })
        // console.log({location})

        location? 
        this.setState({

          address_name : location[0].street ? location[0].street : location[0].name
        })

        : alert("Could not not get your location. Please make sure you are connected to the internet and your location is switched on")

        } catch (error) {

          alert("Could not not get your location. Please make sure you are connected to the internet and your location is switched on")
        }
       

    }


    
  current_location_button =()=>{
    return(
      <CurrentLocationButton
      cb={() => {
        this.centerCamera();
      }}
      order = { this.props.order.driver}
      destination = {this.props.order.destinationRequested }
      onPress={() => {
        this.refs.BottomSheet.current.snapTo(9);
      }}
    />

    )
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

          {this.current_location_button()}
          <View style={styles.markerFixed}>
            <Image style={styles.marker}  source={marker} />
          </View>
          <SafeAreaView style={styles.footer}>

          <View
        style={{
          width: wp("10%"),
          backgroundColor: "#515357",
          padding: 3,
          // left  : wp("40%"),
          alignSelf: "center",
          top: 8,
          // height : 2,
          borderRadius: 50,

        }}
      ></View>

            {/* <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text> */}

            <View>
              <Text style = {styles.bold}> Confirm Pickup Location</Text>
              <Text style = {styles.price}>500 meters away <Text style ={{
                fontSize : 50
              }}>.</Text> ₦800</Text>
            </View>

            <Divider style ={{
              height :1,
              top : 5
            }} />     


            <View style ={{
              marginTop : hp(5)
            }}>

            {/* <Card> */}
        
            <CardItem>
              <Icon active name="md-locate" style={{
                color : "coral"
              }} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 fontSize : 18
              }}>{this.state.address_name}</Text>
              <Right style={{
                  left : 0
              }}>
                <Icon name="arrow-forward" style ={{
                  color : "black"
                }} />
              </Right>
             </CardItem>

             <TouchableOpacity onPress ={()=>{
               alert("Coming Soon!!")
             }}>
                        </TouchableOpacity>
               {/* </Card>             */}
              </View>     


              <View style ={{
                  marginTop : hp(5)
              }}>
              <Button full  style ={{
                borderRadius : 25,
                backgroundColor : "coral"
              }}>
              <Text style = {styles.buttonText}>Confirm Location</Text>
          </Button>
                </View>  
          </SafeAreaView>
        </View>
      )
    }
  }
  
  const styles = StyleSheet.create({
    map: {
      flex: 2.98,

    },
    markerFixed: {
      left: wp(50),
      marginLeft: -24,
      marginTop: -48,
      position: 'absolute',
      top: hp(30)
    },
    marker: {
      height: 60,
      width: 60,
    
    },
    footer: {
      backgroundColor: "white",
      borderTopLeftRadius : 20,
      borderTopRightRadius : 20,
      bottom: 0,
      flex : 2.02,
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
      marginLeft: wp(4),
      alignSelf: "flex-start",

    },
    buttonText: {
      fontFamily: "Quicksand-Bold",
      color: "white",
      fontSize: 20,
 
      alignSelf: "flex-start",

    },
    price: {
      fontFamily: "Quicksand-Medium",
      color: "#121212",
      fontSize: 17,
      marginTop: -wp(10),
      marginLeft: wp(6),
      alignSelf: "flex-start",
    },
      })


const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    order: state.order,
  });
  
export default connect(mapStateToProps, {} )(Confirm_Location)