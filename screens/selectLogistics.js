import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";


import { StatusBar } from "expo-status-bar";

import Car from "./material/Car";
import Bike from "./material/Bike";
import Truck from "./material/Truck";
// import CupertinoButtonWarning from "./material/CupertinoButtonWarning";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Button, Header } from "native-base";
import plane from "./material/plane";
import Plane from "./material/plane";
import * as Animatable from "react-native-animatable";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { regionFrom, getLatLonDiffInMeters } from "../helpers/helper";
import Tanker from "./material/Tanker";
import SearchInput from "../components/SearchInput";
import Geocoder from "react-native-geocoding";

import store from "../store"
import google_api from "../keys/google_map";
import { connect } from 'react-redux'

import { persistStore } from "redux-persist";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.3358723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta
const LONGITUDE_DELTA = longitudeDelta
class SetLogistics extends Component {
  state = {
    isTruckSelected: null,
    isBikeSelected: null,
    isCarSelected: null,
    isTankerSelected: null,
    logistics : null
  };

  componentDidMount(){


              // persistStore(store).purge();
              // store.dispatch({
              //   type : "PURGE"
              // })

    if(this.props.order.has_ride){
      // if(!this.props.order.fromChanged){
        this._getLocationAsync()
      // }
    
      return this.props.navigation.replace("Map")
      
    }
    
    this._getLocationAsync()
  }
  

  _getLocationAsync = async () => {
    console.log("getting location ")
    Geocoder.init("AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("Permission to access denied!!!.");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

   
    var my_location = regionFrom(
      location.coords.latitude,
      location.coords.longitude,
      location.coords.accuracy
    );


    console.log("my location!!!!!!!!!!!!", my_location)
    this.setState({
      my_location : my_location
    });

    let region = {
      latitude: my_location.latitude,
      longitude: my_location.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    // console.log("region ", region);

    // console.log("latitude,longitude ", location.coords.latitude,location.coords.latitude,)
    // this.setState({

    // });
    

    // Geocoder.from({
    //   latitude: location.coords.latitude,
    //   longitude: location.coords.longitude,
    // })
    //   .then((json) => {
    //     var addressComponent = json.results[0].address_components[0].long_name;
    //     // console.log(json.results[0].formatted_address);

    //     // this.setState({

       var data = {
          region: region,
          // address: json.results[0].formatted_address,
          // addressShortName: addressComponent,
        };
        store.dispatch({
          type: "GET_LOCATION",
          payload: data,
        });

        this.watchId = location;

    

        // });
        // y address  Object {
        //   "long_name": "9",
        //   "short_name": "9",
        //   "types": Array [
        //     "street_number",
        //   ],
        // }
      // })
      // .catch((error) => console.warn(error));
   
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

  _next =(logistic)=>{
    console.log("props passed!!!!!!!!!!!!!!!! ", this.props.navigation)

    store.dispatch({
      type : "LOGISTIC_TYPE",
      payload : logistic
    })

   
    this.props.navigation.navigate("Map", {
      logistics : logistic
    })
    // this.props.route.params.selectDestination(this.props.route.params.destination)
  }
  render() {

    // console.log("state changed,", this.state)
    return (
      <SafeAreaView style={styles.container}>
        {/* <Header />  */}
        <StatusBar style="light" hidden = {true} />

        {/* <SafeAreaView> */}
          <Animatable.Text animation = "bounceIn" style={styles.selectAVechicle}>Select Your Vehicle</Animatable.Text>
        {/* </SafeAreaView> */}

        <ScrollView>

        <TouchableOpacity onPress ={()=>{
         this._next("bike")
          }}>

<Animatable.View 
            animation = "slideInRight"
            >
            <Bike
              style={
                (styles.Bike,
                { backgroundColor: this.state.isBikeSelected ? "gold" : null })
              }
            ></Bike>

</Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress ={()=>{
             this._next("car")
          }}>
            <Animatable.View 
            animation = "slideInLeft"
            >
            <Car
              style={
                (styles.Car,
                { backgroundColor: this.state.isCarSelected ? "gold" : null })
              }
            ></Car>
            </Animatable.View>
          </TouchableOpacity>
        
          <TouchableOpacity 
          onPress ={()=>{
            this._next("truck")
          }}>
            <Animatable.View 
            animation = "slideInUp"
            >
            <Truck
              style={
                (styles.Truck,
                { backgroundColor: this.state.isTruckSelected ? "gold" : null })
              }
            ></Truck>
            </Animatable.View>
            {/* <Plane/> */}
          </TouchableOpacity>


          
          <TouchableOpacity 
          onPress ={()=>{
            this._next("tanker")
          }}>
            <Animatable.View 
            animation = "slideInUp"
            >
            <Tanker
              style={
                (styles.Truck,
                { backgroundColor: this.state.isTankerSelected ? "gold" : null })
              }
            ></Tanker>
            </Animatable.View>
            {/* <Plane/> */}
          </TouchableOpacity>
        </ScrollView>

        {/* <CupertinoButtonWarning
          style={styles.cupertinoButtonWarning}
        ></CupertinoButtonWarning> */}
        {/* <TouchableOpacity>
          <Button full warning style={{ height: 70, top: 10, bottom: 10, backgroundColor:"gold" }} onPress ={
            ()=>{
              if(!this.state.logistics){
                return alert("Please Select a Vehicle")
              }
              this._next()
            }
           }>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>
              Select {this.state.logistics}
            </Text>
          </Button>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  Car: {
    height: hp("50%"),
    width: wp("100%"),
    marginTop: 10,
    marginLeft: 1,
  },
  Bike: {
    height: hp("50%"),
    width: wp("100%"),
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },
  Truck: {
    height: hp("50%"),
    width: wp("100%"),
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },

  selectAVechicle: {
    // fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    fontFamily : "Quicksand-Bold",
    // position : "relative",
    marginTop: hp("5%"),
    alignSelf: "center",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(SetLogistics);