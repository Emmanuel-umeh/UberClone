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
import { CardItem, Icon, Right, Button,Spinner } from 'native-base';

import { Platform } from 'react-native';
import CurrentLocationButton from '../components/currentLocationButton'
import store from '../store'

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
          loading :false,
          address_name : location[0].street ?  location[0].street :  location[0].name
        })
      } catch (error) {
        console.warn(error)
      }
   
    }

    book_ride =async()=>{
      try {


        const {region, address_name} = this.state


        const data = {
          region, address_name
        }
        await store.dispatch({
          type : "CONFIRM_LOCATION",
          payload : data
        })
        

        this.props.book_ride()
        this.close_modal()
  
     
      } catch (error) {
        console.warn(error)
        alert("Failed to book ride. Please kindly restart the ordering process")
      }
  
    }


      async componentDidMount(){

        this.setState({
          address_name : this.props.order.my_address
        })

        // try {
           
        // var {latitude, longitude} = this.props.order.region

        // const location = await Location.reverseGeocodeAsync({
        //   latitude, longitude
        // })
        // console.log(location[0])

        // // location? 
        // this.setState({

        //   address_name : location[0].street ? location[0].street : location[0].name
        // })

        // // : alert("Could not not get your location. Please make sure you are connected to the internet and your location is switched on")

        // } catch (error) {

        //   console.warn(error)

        //   alert("Could not not get your location. Please make sure you are connected to the internet and your location is switched on")
        // }
       

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
     this.props.close_modal()
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
          <View
        style={{
          width: wp("10%"),
          marginTop : -hp(1.5),
          
          padding: 3,

          alignSelf: "flex-end",
      

        }}
      >
{/* <TouchableOpacity onPress ={()=>{
    try {
    
      this.props.route.params.cancelOrder()
      this.props.navigation.replace("Map")
    } catch (error) {
      console.warn(error)
      alert("Failed to cancel order. Please restart your app")
    }
}}>
<Icon name= "md-close" style = {{
  color:"#C68E17"
}}></Icon>

</TouchableOpacity>
        */}


      </View>

            {/* <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text> */}

            <View>
              <Text style = {styles.bold}> Confirm Pickup Location</Text>
              <Text style = {styles.price}>Drivers are around you <Text style ={{
                fontSize : 50
              }}>.</Text> ₦{ Math.round(this.props.order.price / 100) * 100}</Text>
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
                color : "#C68E17"
              }} />


              
             

{this.state.loading ?

<View style={{
  marginLeft : wp(20),
  marginTop : -hp(4)
}}>
<Spinner color='red' />
</View>

:
 <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 fontSize : 18
              }}>{this.state.address_name == "Nigeria" || this.state.address_name == "Abuja" ? "Unnamed Road" : this.state.address_name  }</Text> 

      }
          

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

              {!this.state.loading && 
              
              <View style ={{
                marginTop : hp(5)
            }}>

          
            <Button onPress ={()=>{
              this.book_ride()
            }}  full  style ={{
              borderRadius : 25,
              backgroundColor : "#C68E17"
            }}>
            <Text style = {styles.buttonText}>Confirm Location</Text>
        </Button>
              </View>  }
           
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
      marginTop: hp(4),
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