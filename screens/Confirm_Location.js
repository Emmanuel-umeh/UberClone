import React, { Component } from 'react'
import MapView, {Marker, Overlay, PROVIDER_GOOGLE} from 'react-native-maps'
import {day_styles, night_styles} from "./map_styles/styles"

import { connect } from 'react-redux'
import { StyleSheet,Image, View,Text, SafeAreaView, TouchableOpacity } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import * as Location from "expo-location";
  import marker from '../assets/markers/marker5.png'
  import icon_marker from '../assets/markers/icon_marker.png'
import { Divider } from 'react-native-paper'
import { CardItem, Icon, Right, Button,Spinner } from 'native-base';

import { Platform } from 'react-native';
import CurrentLocationButton from '../components/currentLocationButton'
import store from '../redux/store'

import colors from './colors/colors'


import Geocoder from 'react-native-geocoding';
// Initialize the module (needs to be done only once)
Geocoder.init(google_api); // use a valid API key
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
      region:this.props.region
      , loading : false,
      address_name  : null
    }
  
    onRegionChange =async (region) => {

      console.log({region})

      try {
        this.setState({
          loading:true,
          region
        })
  
        Geocoder.from(region.latitude, region.longitude)
        .then(json => {
    
          var location = json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name
          // console.log( json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name )
                // var addressComponent = json.results[0].address_components[0];
          // console.log({addressComponent});
    

      //  var location = await Location.reverseGeocodeAsync({
      //  latitude:   region.latitude, 
      // longitude  :  region.longitude
      //   })
        console.log("location from reverse geocoding ", location)
  
        this.setState({
          loading :false,
          address_name :location ? location : this.props.order.my_address
        })


      }).catch(error =>{
        console.log({error})
      })
      } catch (error) {

        
        this.setState({
          loading :false,
          // address_name : location[0].street ?  location[0].street :  location[0].name
        })
        console.log("error from getching confirm location " ,error)
      }
   
    }

    book_ride =async()=>{
      try {


        const {region, address_name} = this.state

const {state} = this.props
        const data = {
          region, address_name
        }
        await store.dispatch({
          type : "CONFIRM_LOCATION",
          payload : data
        })
        
        const payment_method = state.payment_method

        this.props.book_ride(payment_method)
        this.props.close_modal()
  
     
      } catch (error) {
        console.warn(error)
        alert("Failed to book ride. Please kindly restart the ordering process")
      }
  
    }


      async componentDidMount(){

this.setState({
  loading : true
})
        const {latitude,longitude} = this.props.region

        Geocoder.from(latitude, longitude)
        .then(json => {
    
          var location = json.results[0].address_components[0].long_name + " " + json.results[0].address_components[1].long_name
       

        this.setState({
          address_name : location  ? location : this.props.order.my_address
        })

        this.setState({
          loading : false
        })

      })
.catch(error =>{
  console.warn(error)
  
  this.setState({
    loading : false
  })

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
      order = {true}
      destination = {this.props.order.destinationRequested }
      onPress={() => {
        this.refs.BottomSheet.current.snapTo(9);
      }}
    />

    )
  }


    centerCamera= ()=>{
var {latitude, longitude} = this.props.region
        this.map &&
        this.map.animateCamera(
          {
            center: {
              latitude,
              longitude,
            },
            pitch: 0,
            heading: 0,
            altitude: 300,
            zoom: 18,
          },
          800
        );
    }
  
    render() {
      const { region } = this.state
  

      // console.log({region})
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

          marginTop: 40,
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
            tintColor = {colors.safron}
            provider = {PROVIDER_GOOGLE}
            ref={(map) => {
                this.map = map;
              }}

              

              onMapReady ={this.centerCamera}
            initialRegion={this.props.region}
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
          marginTop: 8,
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
              }}>.</Text> ₦{ Math.round(this.props.price / 100) * 100}</Text>
            </View>

            <Divider style ={{
              height :1,
              marginTop : 5
            }} />     


            <View style ={{
              marginTop : hp(5)
            }}>

            {/* <Card> */}
        
            <CardItem>
            <Image style ={{
            marginRight : 20,
            width : wp(6),
            marginTop : 1
            }} source = {icon_marker}></Image>


              
             

{this.state.loading ?

<View style={{
  marginLeft : wp(20),
  marginTop : -hp(4)
}}>
<Spinner color='#000' />
</View>

:
 <Text numberOfLines = {1} ellipsizeMode = "tail" style ={{
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
                {/* <Image source = {icon_marker}></Image> */}
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
              backgroundColor : colors.safron,
              width : wp(80),
              alignSelf : "center"
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
      height : hp(70)

    },
    markerFixed: {
      left: wp(50),
      marginLeft: -24,
      // marginTop: -hp(9),
      position: 'absolute',
      marginTop: hp(35)
    },
    marker: {
      height: 60,
      width: 60,
      marginTop : -hp(10)
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
      marginTop: Platform.OS == "ios" ? -wp(7) : -wp(10),
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