import React, { Component } from 'react'
import MapView, {
    Marker,
    AnimatedRegion,
    Callout,
    Overlay,
  } from "react-native-maps";
import colors from "./colors/colors"
  import google_api from "../keys/google_map";
  import * as Animatable from "react-native-animatable";

  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { Button, Content, Header, Icon, Item, Input } from "native-base";
  import {
    StyleSheet,
    Text,
    View,
    AppState,
    Dimensions,
    Alert,
    Vibration,
    ImageBackground,
    TouchableOpacity,
    Linking,
    YellowBox,
    Image,
    BackHandler,
    Modal,
    Platform,

  } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import Request_ride from './material/Request_ride';
import CurrentLocationButton from '../components/currentLocationButton';


const { width, height } = Dimensions.get('window');

export default class MapRoute extends Component{


    constructor(props){
        super(props)

        this.map = null;
        this.destinationMarker = null;
        this.state = {
            from_location : this.props.route.params.from_location,
            destination_location :  this.props.route.params.destination_location,
            distance : null,
            duration: null,
            result_coordinates : null,
            price : 500,


            payment_method: "Cash",

        }
    }


    payment_method = (e) => {
        this.setState({
          payment_method: e,
        });
      };

      
    destination_marker = () => {
        // if (this.isDay) {

        var {destination_location, from_location} = this.state
          return (
            <>
              <MapViewDirections
                origin={from_location}
                destination={destination_location}
                apikey={google_api}
                strokeWidth={5}
                strokeColor="#C68E17"
                showsCompass={false}
                onError={() => {
                  alert("Could not find a path to your destination");
                }}

                onReady={result => {

                    this.setState({
                        direction_ready :true,
                        distance : result.distance,
                        duration : result.duration,
                        result_coordinates : result.coordinates,
                        price : result.distance * 67
                    })
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`)
       
                    this.map.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: (width / 20),
                        bottom: (height / 3),
                        left: (width / 20),
                        top: (height / 10),
                      }
                    });
                  }}
              ></MapViewDirections>
    
              {/* the destination marker */}
              <Marker
                title={
         
                     "Your Destination"
                }
                ref={(marker) => {
                  this.destinationMarker = marker;
                }}
                image={require("../assets/markers/marker6.png")}
                key={`${destination_location.latitude}_${destination_location.longitude}`}
                coordinate={{
                  latitude: destination_location
                    ? destination_location.latitude
                    : 9.0765,
                  longitude: destination_location
                    ? destination_location.longitude
                    : 7.3986,
                }}
                pinColor="green"
              >
                <Callout tooltip={false}>
                  <Content style={{ width: undefined, backgroundColor: "white" }}>
                    <Item
                      style={{
                        padding: 10,
                      }}
                    >
                      <Icon
                        active
                        name="pin"
                        style={{
                          color: "#C68E17",
    
                          fontSize: 20,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Quicksand-Medium",
                        }}
                      >
                        {
                           "Your Destination"}
                      </Text>
                    </Item>
                  </Content>
                </Callout>
              </Marker>
    
              {/* the user marker */}
    
              <Marker
                title={
                //   this.props.order.my_address
                //     ? this.props.order.my_address
                    "You are here"
                }
                ref={(marker) => {
                  this.from_marker = marker;
                }}
                image={require("../assets/markers/marker7.png")}
                key={`${from_location.latitude}_${from_location.longitude}`}
                coordinate={{
                  latitude: from_location
                    ? from_location.latitude
                    : 9.0765,
                  longitude: from_location
                    ? from_location.longitude
                    : 7.3986,
                }}
                pinColor="green"
              >
                <Callout tooltip={false}>
                  <Content style={{ width: undefined, backgroundColor: "white" }}>
                    <Item
                      style={{
                        padding: 10,
                      }}
                    >
                      {/* <Pulse color='orange' numPulses={3} diameter={400} speed={20} duration={2000} > */}
                      <Icon
                        active
                        name="pin"
                        style={{
                          color: "#C68E17",
    
                          fontSize: 20,
                        }}
                      />
    
                      {/* </Pulse> */}
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Quicksand-Medium",
                        }}
                      >
                        {
                           "Your are here"}
                      </Text>
                    </Item>
                  </Content>
                </Callout>
              </Marker>
            </>
          );
        // } else {
        //   return (
        //     <>
        //       <MapViewDirections
        //         origin={this.props.order.region}
        //         destination={this.props.order.going}
        //         apikey={google_api}
        //         strokeWidth={5}
        //         mode="DRIVING"
        //         strokeColor="white"
        //         showsCompass={false}
        //         onError={() => {
        //           alert("Could not find a path to your destination");
        //         }}
        //       ></MapViewDirections>
        //       <Marker
        //         title={
        //           this.props.order.going.name
        //             ? this.props.order.going.name
        //             : "Your Destination"
        //         }
        //         ref={(marker) => {
        //           this.destinationMarker = marker;
        //         }}
        //         key={`${this.props.order.going.latitude}_${this.props.order.going.longitude}`}
        //         coordinate={{
        //           latitude: this.props.order.going
        //             ? this.props.order.going.latitude
        //             : 9.0765,
        //           longitude: this.props.order.going
        //             ? this.props.order.going.longitude
        //             : 7.3986,
        //         }}
        //         pinColor="green"
        //       >
        //         <Callout tooltip={false}>
        //           <Content
        //             style={{
        //               width: undefined,
        //               height: 20,
        //               backgroundColor: "white",
        //             }}
        //           >
        //             <Item
        //               style={{
        //                 padding: 10,
        //               }}
        //             >
        //               <Icon
        //                 active
        //                 name="pin"
        //                 style={{
        //                   color: "blue",
    
        //                   fontSize: 18,
        //                 }}
        //               />
        //               <Text
        //                 style={{
        //                   fontSize: 15,
        //                   fontFamily: "Quicksand-Bold",
        //                 }}
        //               >
        //                 {this.props.order.going.name
        //                   ? this.props.order.going.name
        //                   : "Your Destination"}
        //               </Text>
        //             </Item>
        //           </Content>
        //         </Callout>
        //       </Marker>
        //     </>
        //   );
        // }
      };
    


      

      isDay = () => {
        const hours = new Date().getHours();
        return hours >= 6 && hours < 18;
      };
    render(){

        console.log(this.state)

        return(


            <>
        
            <MapView
            // followUserLocation={show_user_location}
            initialRegion={this.state.from_location}
            rotateEnabled={false}
            // customMapStyle={this.getMapStyles()}
            showsUserLocation={true}
            showsBuildings={true}
            zoomEnabled={true}
            showsCompass={false}
            // provider="google"
            tintColor={colors.safron}
            minZoomLevel={5} // default => 0l
            maxZoomLevel={20} // default => 20
            // onUserLocationChange = {(e)=>{
            //   // console.log("user location changed !!!!!!!!!!!!!!!!!!!!!!", e.nativeEvent.coordinate)

            //   var {latitude, longitude} = this.props.order.region
            //   var latitude_changed = e.nativeEvent.coordinate.latitude
            //   var longitude_changed = e.nativeEvent.coordinate.longitude
            //   var distance = getLatLonDiffInMeters(latitude,longitude,latitude_changed,longitude_changed)

            //   if(!this.props.order.destinationRequested || !this.props.order.driver || !this.props.order.order){

            //     if(distance > 200){

            //       console.log("no order or driver, safe to update state")

            //     var address = Location.reverseGeocodeAsync({
            //       latitude : latitude_changed,
            //       longitude : longitude_changed
            //     })

            //     var region = {
            //       latitude : latitude_changed,
            //       longitude : longitude_changed,
            //       latitudeDelta : LATITUDE_DELTA,
            //       longitudeDelta : LONGITUDE_DELTA
            //     }

            //     var data = {
            //       region: region,
            //       my_address:address[0]?  address[0].street ? address[0].street : address[0].name : this.props.order.my_address,
            //       // addressShortName: addressComponent,
            //     };
            //       store.dispatch({
            //         type : "GET_LOCATION",
            //         payload : data
            //       })

            //       console.log("region updated due to user location hanged", data)
            //     }

            //   }

            // }}

            // cacheEnabled
            // pitchEnabled = {true}

    
            provider = "google"
            showsAnnotationCallouts={true}
            paddingAdjustmentBehavior="automatic"
            // onMapReady={() => {
            //   // setTimeout(() => {
            //   this.setState(
            //     {
            //       map_is_ready: true,
            //     },
            //     () => {
            //       this.centerCamera();
            //     }
            //   );

            //   // this._getLocationAsync();

            //   // }, 2000);
            // }}
            ref={(map) => {
              this.map = map;
            }}
            style={{
              // flex: 1,
              ...StyleSheet.absoluteFillObject,
              // zIndex: 0,
            }}
            // ref={(map) => {
            //   this.map = map;
            // }}
          >
            {/* show marker and destination when driver has not yet accepted. after accept hide them and relocate to the driver position */}

            {/* {this.props.order.destinationRequested && !this.props.order.driver
              ? this.destination_marker()
              : null} */}



{this.destination_marker()}
            {/* {this.props.order.driver && (
              <>
                {this.props.order.order &&
                  this.props.order.order.state == "Started" &&
                  this.map_view_directions()}

                {this.show_driver_marker()}
              </>
              // this.driverLocation()
            )} */}




            {/* {!this.props.order.order  && this.state.available_presence_drivers.length >0 &&
            // this.state.available_presence_drivers.map((driver,key)=>(
              this.available_presence_drivers()

            // ))

              
            } */}
          </MapView>


          <CurrentLocationButton
        cb={() => {
            this.map.fitToCoordinates(this.state.result_coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 3),
                  left: (width / 20),
                  top: (height / 10),
                }
              });
        }}
        order={false}
        destination={true}
        onPress={() => {
          this.refs.BottomSheet.current.snapTo(9);
        }}
      /> 



          {this.state.duration && (
            <>
              <Animatable.View
                animation="slideInUp"
                delay={400}
                style={styles.rect}
              >
                {/* will be renamed to request ride  */}
                <Request_ride
                  payment_method={this.payment_method}
                  state={this.state}
                  price = {this.state.price}
                //   style={
                //     (styles.Bike,
                //     {
                //       backgroundColor: this.state.isBikeSelected
                //         ? "gold"
                //         : null,
                //     })
                //   }
                //   bookRide={this.bookRide}
                //   open_modal={this.open_modal}
                //   cancelOrder={this.cancelOrder}
                ></Request_ride>
              </Animatable.View>
            </>
          )}

</>
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    rect: {
      height: hp(30),
      marginTop: hp(70),
      // backgroundColor: 'transparent'
  
      // backgroundColor: "transparent",
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
  
    preloader: {
      position: "absolute",
      marginTop: 500,
    },
    Bike: {
      height: hp("50%"),
      width: wp("100%"),
      marginTop: 10,
      // backgroundColor : this.state.isTruckSelected
    },
  
    //
  
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
  });