import React, { Component } from "react";

import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Vibration,
  ImageBackground,
  TouchableOpacity,
  Linking,
  YellowBox,
  Image,
  Platform,
} from "react-native";

import * as Permissions from "expo-permissions";
import store from "../store";
import MapView, { Marker, AnimatedRegion, Callout, Overlay } from "react-native-maps";
import * as Notifications from 'expo-notifications';
import * as Location from "expo-location";
import DestinationButton from "../components/destinationButton";

import CurrentLocationButton from "../components/currentLocationButton";

import { Ionicons } from "@expo/vector-icons";

import google_api from "../keys/google_map";
import { connect } from "react-redux";
import Pusher from "pusher-js/react-native";
import { regionFrom, getLatLonDiffInMeters } from "../helpers/helper";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";

import BottomSheet from "reanimated-bottom-sheet";
import { Button, Content, Header, Icon, Item , Input} from "native-base";
import * as Animatable from "react-native-animatable";
import { BackHandler } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import DriverDetailsPopUp from "./components/DriverDetailsPopUp";
import _ from "lodash";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomModal from "./components/Modal";
import LottieLoader from "react-native-lottie-loader";

// redux imports
import { makeOrder, cancelOrder,getOrder,test_redux_promisify } from "../action/orderActions";
import { Divider } from "react-native-paper";

import { Audio } from "expo-av";
import { persistStore } from "redux-persist";
import {day_styles, night_styles} from "./map_styles/styles"
import { PureComponent } from "react";
import Bike from "./material/SelectLogistics";
import SelectLogistics from "./material/SelectLogistics";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.02858723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta;
const LONGITUDE_DELTA = longitudeDelta;
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(title, body, data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${title}! 📬`,
      body: `${body}`,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  // if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

class Map extends PureComponent {
  constructor(props) {
    super(props);

    // sound object
    this.soundObject = null;
    this.map =  null;
    this.marker = React.createRef();
    this.destinationMarker = React.createRef()
    this.driver_marker = React.createRef();
    // this.props.auth.user.phoneNumber = null;
    // this.client_driver_paid = null;
    this.available_drivers_channel = null;
    this.bookRide = this.bookRide.bind(this);
    this.user_ride_channel = null;

    this.pusher = null;

    const {token} = this.props.auth
    

    if(!this.pusher){
      this.pusher = new Pusher("408c824d8bed77ca6684", {
        // authEndpoint: "http://cf70166cf633.ngrok.io/api/pusher/auth",
        authEndpoint: "https://whiteaxisapi.herokuapp.com/api/pusher/auth",
        cluster: "eu",
        auth: {
          headers: { "x-auth-token": `${token}` },
        },
        encrypted: true,
      });
  
  
      Pusher.logToConsole = true;
  
    }

    this.state ={
      available_drivers_channel : null,
      user_ride_channel : null,
      map_is_ready : false,
      pusher : null,
      follow_user_location : true,
      show_user_location : true
    }
   

  }


  notifications_settings = ()=>{
    registerForPushNotificationsAsync().then(token => this.setState({
      token:token
    }));

    this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log({notification})
      this.setState({
        notification : notification
      });
    });

   this. responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
  }



  drawer_button=()=>{
    return(
      <TouchableOpacity
      style={{
        height: 55,
        width: 55,
        backgroundColor: "#fff",
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
        this.props.navigation.openDrawer();
        // this.bookRide();
      }}
    >
      <View>
        <Ionicons name="md-menu" size={32} color="black" />
      </View>
    </TouchableOpacity>
  
    )
  }
  back_button=()=>{
    return(
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
        // this.props.navigation.openDrawer();

        // this.setState({

        // store.dispatch({
        //   type: "DESTINATION_CANCELLED",
        // });

        this.cancelOrder();
        // destinationRequested: false,
        // });
         this.centerCamera();;
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

    )
  }

  destination_button = ()=>{
    return(
      <DestinationButton
      navigation={this.props.navigation}
      state={this.props.order}
      logistics={
        this.props.route.params
          ? this.props.route.params.logistics
          : this.props.order.logistic_type
      }
      selectDestination={this.selectDestination}
    />
    )
  }

  show_driver_marker=()=>{

    const {driver, coordinate, logistic_type} = this.props.order

    console.log("driver heading!!!!!!!!!!!!!!!!!!!!!!", driver)
    return(
      
      <Marker.Animated
      coordinate={{
        latitude: coordinate
        ? coordinate.latitude
        : 9.0765,
      longitude: coordinate
        ? coordinate.longitude
        : 7.3986,
        
      }}
      anchor={{ x: 0.35, y: 0.32 }}
      title="Your Ride Is Here"
      ref={(marker) => {
        this.driver_marker = marker;
      }}
      style={{ width: 50, height: 50 }}
    >
    {logistic_type == "Bike" ?
    
    <Image
    source={require("../assets/images/bike.png")}
    style={{
      width: 40,
      height: 40,
      transform: [{
        rotate: driver.heading === undefined ? '40deg' : `${driver.heading}deg`
      }]
    }}
  /> : 

  logistic_type == "Car"? 

  <Image
  source={require("../assets/images/car.png")}
  style={{
    width: 40,
    height: 40,
    transform: [{
      rotate: driver.heading === undefined ? '0deg' : `${driver.heading}deg`
    }]
  }}
/> :  logistic_type =="Truck" ?

<Image
source={require("../assets/images/truck.png")}
style={{
  width: 40,
  height: 40,
  transform: [{
    rotate: driver.heading === undefined ? '0deg' : `${driver.heading}deg`
  }]
}}
/> :   <Image
        source={require("../assets/images/tanker.png")}
        resizeMode = "contain"
        style={{
          width: 50,
          height: 50,
          transform: [{
            rotate: driver.heading === undefined ? '40deg' : `${driver.heading}deg`
          }]
        }}
      />
    }
    </Marker.Animated>

    )
  }

  client_driver_location =async(data)=>{
    try {
      if (data) {
        const { longitude, latitude, accuracy, heading } = data;

        const {state} =  this.props.order.order
        console.log(
          "client driver location updated!! ? ",
          latitude,
          longitude,
          accuracy,
          heading
        );

        const newCoordinate = {
          latitude,
          longitude,
        };

        // driver location received
        let driverLocation = regionFrom(latitude, longitude, accuracy);
        console.log("the drivers new location ", driverLocation);

        var data = {
          location: driverLocation, //the drivers location
          driver: {
            latitude: latitude,
            longitude: longitude,
            heading : heading? heading : 0
          },
        };

        console.log({data})

       await store.dispatch({
          type: "DRIVER_LOCATION",
          payload: data,
        });

        var diff_in_meter_pickup = getLatLonDiffInMeters(
          this.props.order.region.latitude,
          this.props.order.region.longitude,
          latitude,
          longitude
        );

        console.log({diff_in_meter_pickup})
        
        // this.setState({
        //   distance: diff_in_meter_pickup,
        // });

        this.animate(latitude, longitude);
        // this.setState({
        //   coordinate: {
        //     ...this.state.coordinate,
        //     longitude: longitude,
        //     latitude: latitude,
        //   },
        //   driver_location: {
        //     ...this.state.driver_location,
        //     longitude: longitude,
        //     latitude: latitude,
        //   },
        // });

        var COORDINATE_DRIVER_LOCATION = {
          coordinate: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          driver_location: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          distance: diff_in_meter_pickup,
        };

        // this.setState({
        //   distance: diff_in_meter_pickup,
        // });



      await  store.dispatch({
          type: "COORDINATE_DRIVER_LOCATION",
          payload: COORDINATE_DRIVER_LOCATION,
        });

        // console.log("maops", this.map)
        console.log("should center cameraA ooooo!!!!!!!!!!!!!!!!!!!")


        if(diff_in_meter_pickup <=100){
          this.map.animateCamera(
            {
              center: {
                latitude,
                longitude,
              },
              pitch: 20,
              heading: 30,
              altitude: 100,
              zoom: 18,
            },
            800
          );
        }else{
          this.centerCamera()
        }
    
       
      }
    } catch (error) {
      console.warn(error)
    }
  }


  client_found_driver =async(data)=>{
           // found driver, the passenger has no say about this.
        // once a driver is found, this will be the driver that's going to drive the user
        // to their destination
        // Vibration.vibrate({pattern:500});

        try {
          // console.log("Found driver!!!!!!!!!!!!!!!!!!", data)
        let driverLocation = await regionFrom(
          data.location.latitude,
          data.location.longitude,
          data.location.accuracy
        );

    

        // update coordinate and drivers location in redux



        const found_driver = {
          has_ride: true,
          is_searching: false,
          location: driverLocation,
          driver: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            accuracy: data.location.accuracy,
          },

          driver_details: data.driver,
        };

        // console.log({found_driver})

       await store.dispatch({
          type: "FOUND_DRIVER",
          payload: found_driver,
        });

        // GET THE DISTANCE BETWEEN THE CLIENT AND THE DRIVER

        console.log("getting lat long meters")
        var diff_in_meter_pickup = await getLatLonDiffInMeters(
          this.props.order.region.latitude,
          this.props.order.region.longitude,
          data.location.latitude,
          data.location.longitude
        );


        console.log({diff_in_meter_pickup})
        var COORDINATE_DRIVER_LOCATION = {
          coordinate: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          driver_location: {
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
            longitude: driverLocation.longitude,
            latitude: driverLocation.latitude,
          },
          distance: diff_in_meter_pickup,
        };
      

        console.log({COORDINATE_DRIVER_LOCATION})

        // this.setState({
        //   distance: diff_in_meter_pickup,
        // });

        await store.dispatch({
          type: "COORDINATE_DRIVER_LOCATION",
          payload: COORDINATE_DRIVER_LOCATION,
        });

        this.loadSounds();

        // console.log("Driver accepted and animating to driver location ", data);
        // this.props.order.region;

     

          this.map &&    this.map.fitToCoordinates(
            [
              {
                latitude : data.location.latitude,
                longitude : data.location.longitude,
              },
  
              {
                latitude: this.props.order.region.latitude,
                longitude: this.props.order.region.longitude,
              },
            ],
            {
              edgePadding: {
                  bottom: hp("90%"),
                right: wp("40%"),
                top: hp("20%"),
                left: wp("10%"),
              },
              animated: true,
            }
          )

        // this.map.animateToRegion(
        //   {
        //     latitudeDelta: LATITUDE_DELTA,
        //     longitudeDelta: LONGITUDE_DELTA,
        //     longitude: data.location.longitude,
        //     latitude: data.location.latitude,
        //   },
        //   1500
        // );
        // this.driver_marker && this.driver_marker.showCallout();
        } catch (error) {
          console.warn(error)
        }
  }


  client_driver_message =async(data)=>{

    try {
      if (data.type == "near_pickup") {
        //remove passenger marker

       await  store.dispatch({
          type: "HAS_RIDDEN",
          // payload: data,
        });
        // this.setState({
        //   has_ridden: true,
        // });
      }

      // when the driver starts the ride
      if (data.type == "ride_started") {
        console.log("ride started by driver triggered ", data.order);

        this.loadSounds();
       await store.dispatch({
          type: "RIDE_UPDATED",
          payload: data.order,
        });

        this.centerCamera()
      }
      if (data.type == "ride_ended") {
        console.log("ride ended by driver triggered ", data.order);

        this.loadSounds();
      await  store.dispatch({
          type: "RIDE_UPDATED",
          payload: data.order,
        });
        
        this.centerCamera()
      }
      if (data.type == "ride_completed") {
        console.log("ride completed by driver triggered ", data.order);

        const driver_id = data.order.driver;

        this.loadSounds();
        
       
        //  this.centerCamera();

        // passing the id of the driver as params to the rating page
         this.reset_navigation("driver_rating", driver_id);

      return  await store.dispatch({
          type: "RIDE_COMPLETED",
        });
        // this.props.navigation.navigate("Driver_Rating")
      }

      if (data.type == "near_dropoff") {
         this.centerCamera();
      }

      Alert.alert(
        data.title,
        data.msg,
        [
          {
            text: "Okay!",
          },
        ],
        { cancelable: false }
      );

        await schedulePushNotification(data.title, data.msg, null);
      // this.setState({
      //   pusher : this.pusher,
      //   available_drivers_channel : this.available_drivers_channel,
      //   user_ride_channel : this.user_ride_channel
      // })
    } catch (error) {
      console.warn(error)
    }
  }

  isDay=()=> {
    const hours = (new Date()).getHours();
    return (hours >= 6 && hours < 18);
  }

  driver_details_popup =()=>{
    return(
      <DriverDetailsPopUp
      driver={this.props.order.driver_details}
      distance={this.props.order.distance}
      user_ride_channel={this.user_ride_channel}
    />
    )
  }
  

  map_view_directions =()=>{


    console.log("os day!!!!", this.isDay())
    if(this.isDay){
      return <>
          <MapViewDirections
        origin={this.props.order.driver_location}
        destination={this.props.order.going}
        apikey={google_api}
        strokeWidth={5}
        strokeColor="black"
        showsCompass={false}
      ></MapViewDirections>
      <Marker.Animated
        title="Your Destination"
        coordinate={this.props.order.going}
        pinColor="#ffffff"
      /></>
    }else{
      return(
        <>
        <MapViewDirections
          origin={this.props.order.driver_location}
          destination={this.props.order.going}
          apikey={google_api}
          strokeWidth={5}
          strokeColor="whitesmoke"
          showsCompass={false}
        ></MapViewDirections>
        <Marker.Animated
          title="Your Destination"
          coordinate={this.props.order.going}
          pinColor="#ffffff"
        />
      </>
      )
    }
  
  }
  
  getMapStyles = ()=>{
    // console.log("time of the day !!!!!!!!" ,this.isDay())
    if(this.isDay()){
      return day_styles
    }else{
      return day_styles
    }
    }

    bottom_sheet =()=>{
      return(
        <BottomSheet
        ref={this.sheetRef}
        snapPoints={["65%", "30%", "10%"]}
        borderRadius={20}
        renderContent={this.renderContent}
        renderHeader={this.renderHeader}
      
        isBackDrop={true}
        isBackDropDismisByPress={true}
        isRoundBorderWithTipHeader={true}
        ref="BottomSheet"
        // isModal
        // containerStyle={{backgroundCol or:"red"}}
        tipStyle={{ backgroundColor: "black" }}
        headerStyle={{ backgroundColor: "red" }}
        // bodyStyle={{backgroundColor:"red",flex:1}}
        header={
          <View>
            <Text style={styles.text}>Header</Text>
          </View>
        }
      />
      )
    }

    // this will check if the user order has started so as to hide user location

    check_order_state =()=>{
      if(this.props.order.order){

        if(this.props.order.order.state =="Accepted"){

return true
        }else{
          return false
        }
      }else{
        return true 
      }
    }

  loadSounds = async () => {
    this.soundObject = new Audio.Sound();
    try {
      console.log("Loading sounds!!!!!!!!!!!!!!!!!!!!!!");
      Vibration.vibrate(500)
      await this.soundObject.loadAsync(
        require("../assets/sounds/notification.mp3")
      );
      await this.soundObject.playAsync();
      // Your sound is playing!
      console.log("played sound");

      // Don't forget to unload the sound from memory
      // when you are done using the Sound object
    } catch (error) {
      console.log({ error });
      // An error occurred!
    }
  };

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


  destination_marker =()=>{

    if(this.isDay){
      return(

      
        <>
  
  <MapViewDirections
                    origin={this.props.order.region}
                    destination={this.props.order.going}
                    apikey={google_api}
                    strokeWidth={5}
                    strokeColor="black"
                    showsCompass={false}
                    onError ={()=>{
                      alert ("Could not find a path to your destination")
                    }}
                  ></MapViewDirections>
        <Marker
        title={this.props.order.going.name ? this.props.order.going.name : "Your Destination"}
        ref={(marker) => {
          this.destinationMarker = marker;
        }}

        key={`${this.props.order.going.latitude}_${this.props.order.going.longitude}`}
        coordinate={{
        
          latitude:  this.props.order.going
          ?   this.props.order.going.latitude
          : 9.0765,
        longitude:   this.props.order.going
          ?   this.props.order.going.longitude
          : 7.3986,
        }}
        pinColor="green"
      >
  
  <Callout
  
  tooltip ={false}
  >
  
  <Content style ={{width : undefined , backgroundColor : "white"}}>
  <Item style ={{
  padding : 10
  }}>
  <Icon active name='pin' style={{
    color : "blue",
    
    fontSize : 20,
  }} />
  <Text style ={{
    fontSize : 12,
    fontFamily : "Quicksand-Medium"
  }}>{this.props.order.going.name ? this.props.order.going.name : "Your Destination"}</Text>      
  
      </Item>
  </Content>
  </Callout>
  
  
      </Marker>
  </>
      )
    }else{
      return(

      
        <>
  
  <MapViewDirections
                    origin={this.props.order.region}
                    destination={this.props.order.going}
                    apikey={google_api}
                    strokeWidth={5}
                    strokeColor="white"
                    showsCompass={false}
                    onError ={()=>{
                      alert ("Could not find a path to your destination")
                    }}
                  ></MapViewDirections>
        <Marker
        title={this.props.order.going.name ? this.props.order.going.name : "Your Destination"}
        ref={(marker) => {
          this.destinationMarker = marker;
        }}

                key={`${this.props.order.going.latitude}_${this.props.order.going.longitude}`}
        coordinate={{
        
          latitude:  this.props.order.going
          ?   this.props.order.going.latitude
          : 9.0765,
        longitude:   this.props.order.going
          ?   this.props.order.going.longitude
          : 7.3986,
        }}
        pinColor="green"
      >
  
  <Callout
  
  tooltip ={false}
  >
  
  <Content style ={{width : undefined , height : 20, backgroundColor : "white"}}>
  <Item style ={{
  padding : 10
  }}>
  <Icon active name='pin' style={{
    color : "blue",
    
    fontSize : 18,
  }} />
  <Text style ={{
    fontSize : 15,
    fontFamily : "Quicksand-Bold"
  }}>{this.props.order.going.name ? this.props.order.going.name : "Your Destination"}</Text>      
  
      </Item>
  </Content>
  </Callout>
  
  
      </Marker>
  </>
      )
    }

  }


// reconnect a user to previous ride
  reconnect_client = async()=>{
    
    const {user, token} = this.props.auth
 
   console.log("reconnecting me!!!!!!!!!!!!!!!!!!!!!!!!!!!")
if(this.props.order.order){
const data =  await this.props.getOrder(token, this.props.order.order._id )
console.log({data})
if(data.state == "Completed"){
  // return 
  this.loadSounds();
        
       
  //  this.centerCamera();

  // passing the id of the driver as params to the rating page
   this.reset_navigation("driver_rating", data.driver);

return  await store.dispatch({
    type: "RIDE_COMPLETED",
  });
}
}

    this.available_drivers_channel = this.pusher.subscribe(
      `private-available-drivers-${
   
         this.props.order.logistic_type? this.props.order.logistic_type.toLowerCase() : "car"
      }`
    );

    this.user_ride_channel = this.pusher.subscribe(
      "private-ride-" + this.props.auth.user._id
    );


    this.user_ride_channel.bind("client-driver-available", (data) => {
      console.log("clients driver response!!!!!");
      console.log("driver has ride  ??? ", this.props.order.has_ride);
      let passenger_response = "no";
      if (!this.props.order.has_ride) {
        passenger_response = "yes";
      }

      // passenger responds to driver's response
      this.user_ride_channel.trigger("client-driver-response", {
        response: passenger_response,
      });
    });

    this.user_ride_channel.bind("client-found-driver", (data) => {

      this.client_found_driver(data)
  
    });

    this.user_ride_channel.bind("client-driver-location", (data) => {
     
      // console.log("Reveiced location on the reconnect client channel!!!!!!!!!!!!!!!!!!!!!")
      this.client_driver_location(data)
    });

    // get the heading for the driver
    // this.user_ride_channel.bind("client-driver-heading", (data) => {
    //  store.dispatch({
    //    type : "DRIVER_HEADING",
    //    payload : data.trigger_heading ? data.trigger_heading : 0
    //  })
 
    // });

    this.user_ride_channel.bind("client-driver-message", (data) => {

      this.client_driver_message(data)
  });

  // }

  this.setState({
    pusher : this.pusher,
    available_drivers_channel : this.available_drivers_channel,
    user_ride_channel : this.user_ride_channel
  })



  }
 async componentDidMount() {
    // persistStore(store).purge();
    // persistStore(store).purge();
    // store.dispatch({
    //   type : "PURGE"
    // })

this.props.navigation.navigate("confirm_location")



    store.dispatch({
      type :"PERFORMING_TASK_ENDED"
    })



    if(this.props.order.has_ride){
this.reconnect_client()

    }
    
  

   
  }

 



  centerCamera = () => {



 
 if(this.props.order.order){
if(this.props.order.order.state=="Started" ){

  var {latitude, longitude} = this.props.order.driver_location
  console.log("centering ,map Destination requested with order!!!!!!!!!!!", this.props.order.order)
  // const latitude = this.props.order.going.latitude
  // const longitude = this.props.order.going.longitude

    this.map
    && this.map.fitToCoordinates(
        [
          {
            latitude,
            longitude,
          },

          {
            latitude: this.props.order.going.latitude,
            longitude: this.props.order.going.longitude,
          },
        ],
        {
          edgePadding: {
              bottom: hp("90%"),
            right: wp("40%"),
            top: hp("20%"),
            left: wp("10%"),
          },
          animated: true,
        }
      )

  
}
else{

  var {latitude, longitude} = this.props.order.driver_location
  console.log("centering ,driver locatin and user location")
  // const latitude = this.props.order.going.latitude
  // const longitude = this.props.order.going.longitude

    this.map
    && this.map.fitToCoordinates(
        [
          {
            latitude,
            longitude,
          },

          {
            latitude: this.props.order.region.latitude,
            longitude: this.props.order.region.longitude,
          },
        ],
        {
          edgePadding: {
              bottom: hp("90%"),
            right: wp("40%"),
            top: hp("20%"),
            left: wp("10%"),
          },
          animated: true,
        }
      )

}

}else    if(this.props.order.destinationRequested ){

  console.log("centering ,map Destination requested!!!!!!!!!!!")
  const latitude = this.props.order.going.latitude
const longitude = this.props.order.going.longitude

  this.map
  && this.map.fitToCoordinates(
      [
        {
          latitude,
          longitude,
        },

        {
          latitude: this.props.order.region.latitude,
          longitude: this.props.order.region.longitude,
        },
      ],
      {
        edgePadding: {
            bottom: hp("90%"),
          right: wp("40%"),
          top: hp("40%"),
          left: wp("10%"),
        },
        animated: true,
      }
    )


    try {
      this.destinationMarker.showCallout()
    } catch (error) {
      console.warn("Could not callotu destination marker")
    }
   
}
    
    
    else{

      console.log("all the above failed")
      const {
     
        latitude,
        longitude,
      } = this.props.order.region;
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

  };

  pusher_actions = async () => {
    const { token, user } = this.props.auth;




      // store.dispatch({
      //   type: "PUSHER_AUTH",
      //   payload: this.pusher,
      // });<D


    // this.props.auth.user.phoneNumber = this.props.auth.user.phoneNumber
 

    //  if(!this.props.pusher.available_drivers_channel){
// if(!this.available_drivers_channel){
  console.log("perfomring pusher actions!!!!!!!!!!!!!!!!!!!!!!!!!!!1, ", this.props.order.logistic_type)
  this.available_drivers_channel = this.pusher.subscribe(
    `private-available-drivers-${
     
        this.props.order.logistic_type? this.props.order.logistic_type.toLowerCase() : "car"
    }`
  );

  console.log("connected to private available drivers!!")
// }


      // store.dispatch({
      //   type: "AVAILABLE_DRIVERS",
      //   payload: this.available_drivers_channel,
      // });

      // console.log("binding to available drivers channgel!!!!!!!!!!!!!!!!!!!!!! ", this.props.pusher)
      // available_drivers_channel.bind(
      //   "pusher:subscription_failed",
      //   (data) => {
      //     console.log("failed to subscribe ");
      //   }
      // );

      this.available_drivers_channel.bind(
        "pusher:subscription_succeeded",
         (data) => {
          console.log("Subscribed succesfully to available_drivers_cahannel ");
  
         });

      //  }

      // available_drivers_channel.bind("Driver_Accepted", function (data) {
      //   alert("New Driver Alerted")

      //     })
      // if (!this.props.pusher.user_ride_channel) {

      // if(!this.user_ride_channel){

      //   console.log("subscribing ujser ride channel!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

      this.user_ride_channel = this.pusher.subscribe(
        "private-ride-" + this.props.auth.user._id
      );
      // this.user_ride_channel = user_ride_channel

      this.user_ride_channel.bind(
        "pusher:subscription_succeeded",
         (data) => {
          console.log("Subscribed succesfully to user_ride_cahnnel ");
  


    
      
          this.user_ride_channel.bind("client-driver-available", (data) => {
            console.log("clients driver response!!!!!");
            console.log("driver has ride  ??? ", this.props.order.has_ride);
            let passenger_response = "no";
            if (!this.props.order.has_ride) {
              passenger_response = "yes";
            }
    
            // passenger responds to driver's response
            this.user_ride_channel.trigger("client-driver-response", {
              response: passenger_response,
            });
          });
    
          this.user_ride_channel.bind("client-found-driver", async (data) => {
     this.client_found_driver(data)
    
            
          });
    
          this.user_ride_channel.bind("client-driver-location", async(data) => {
    
    
        this.client_driver_location(data) 
          });
    
          this.user_ride_channel.bind("client-driver-message", async(data) => {
    
           
           
          this.client_driver_message(data)
          });
    
    
          // this.user_ride_channel.bind("client-driver-heading", (data) => {
          //    store.dispatch({
          //      type : "DRIVER_HEADING",
          //      payload : data.trigger_heading ? data.trigger_heading : 0
          //    })
         
          //   });
         });

  
      // }
  
    // }

    
  };

  // used to replace screens so user cant go back
  reset_navigation = (screenName, param) => {
    // reset navigation!!,
    this.props.navigation.dispatch(
      StackActions.replace(screenName, { param: param })
    );
  };

  animate = (latitude, longitude) => {

    try {
   

      console.log("supposed to be animating by now!!!")
      const newCoordinate = new AnimatedRegion ({
        latitude: parseFloat(latitude) ,
        longitude: parseFloat(longitude),
      });
  
      if (Platform.OS === "android") {
        if (this.driver_marker && newCoordinate) {
        
          console.log("ANIMATING TO NEW POSITION ", newCoordinate);
          this.driver_marker._component &&
            this.driver_marker._component.animateMarkerToCoordinate(
              newCoordinate,
              1500
            ); // 500 is the duration to animate the marker
        }
      } else {
        this.props.order.coordinate.timing(newCoordinate).start();
      }
    } catch (error) {
      console.warn(error)
    }
  
  };

  centerMap = () => {

    try {
      const {
        latitudeDelta,
        longitudeDelta,
        latitude,
        longitude,
      } = this.props.order.region;
  
      this.map &&
        this.map.animateCamera(
          {
            center: {
              latitude,
              longitude,
            },
            pitch: 0,
            heading: 30,
            altitude: 100,
            zoom: 15,
          },
          1500
        );
    
    } catch (error) {
      console.warn(error)
    }
   
  };

  selectDestination = async (going , from) => {

    try {
      console.log("performing the select destination ", going);
      var data = {
        from : from ? from : null,
        going: going,
        destinationRequested: true,
        latitudeDelta: 0.1,
      };
  
      console.log("data passed to the selet destination , ", data);
  
  
      // if their is a from data, the user  region will be updated to the from data
     await store.dispatch({
        type: "SELECT_DESTINATION",
        payload: data,
      });
      // this.setState({
  
      // });
  
      const latitude = going.latitude;
      const longitude = going.longitude;
  
      var diff_in_meter_pickup = getLatLonDiffInMeters(
        this.props.order.region.latitude,
        this.props.order.region.longitude,
        going.latitude,
        going.longitude
      );
  
      console.log({ diff_in_meter_pickup });
  
      var price = diff_in_meter_pickup * 0.15;
  
      console.log("price of transportation ", price);
  
    await  store.dispatch({
        type: "PRICE_UPDATED",
        payload: price,
      });
      // this.setState({
  
      // });
  
      //  this._getLocationAsync
  
      this.map
        ? this.map.fitToCoordinates(
            [
              {
                latitude,
                longitude,
              },
  
              {
                latitude: this.props.order.region.latitude,
                longitude: this.props.order.region.longitude,
              },
            ],
            {
              edgePadding: {
                  bottom: hp("70%"),
          right: wp("40%"),
          top: hp("40%"),
          left: wp("10%"),
              },
              animated: true,
            }
          )
        : this.map.animateToRegion(
            {
              latitudeDelta,
              longitudeDelta,
              latitude,
              longitude,
            },
            500
          );

     

          setTimeout(() => {
            try {
              this.destinationMarker.showCallout()
            } catch (error) {
              console.warn("Could not callotu destination marker 2")
            }
          }, 2000);

    } catch (error) {
      console.warn(error)
    }
   

     
  
  };

  bookRide = async (payment_method) => {

    try {

      
    const {token} = this.props.auth
    


      // connect to pushe rwhen booking ride
      await this.pusher_actions()
      console.log("booking ride");

    let from_address ;
    let going_address= this.props.order.going.name;

   const from_address_full =  await  Location.reverseGeocodeAsync({
      latitude:  this.props.order.region.latitude,
   longitude:   this.props.order.region.longitude
    })

 
  //   const going_address_full =    await  Location.reverseGeocodeAsync({
  //     latitude: this.props.order.going.latitude,
  //  longitude:  this.props.order.going.longitude
  //   })

    from_address =  from_address_full[0].street ?from_address_full[0].street  : from_address_full[0].name
    // going_address = going_address_full.street


    console.log({from_address_full})

    const { user } = this.props.auth;
    let pickup_data = {
      name: user.firstName,
      latitude: this.props.order.region.latitude,
      from_address:  from_address_full[0].street ?from_address_full[0].street  : from_address_full[0].name ,
      longitude: this.props.order.region.longitude,
    };

    let dropoff_data = {
      name: "Area",
      going_address: going_address,
      latitude: this.props.order.going.latitude,
      longitude: this.props.order.going.longitude,
    };


    console.log("pickup data !!!!!!!!!!!!!!!!!!!!!!!!!!",  pickup_data)
    let userID = this.props.auth.user._id;

    const data = {
      startLatitude: this.props.order.region.latitude,
      startLongitude: this.props.order.region.longitude,
      endLatitude: this.props.order.going.latitude,
      endLongitude: this.props.order.going.longitude,
      price: Math.ceil(this.props.order.price / 100) * 100,

      // trigger: trigger,

      // pusher actions variables

      userID: userID,
      pickup: pickup_data,
      dropoff: dropoff_data,
      payment_method,
      available_drivers_channel: this.available_drivers_channel,
    };

    const tokens = this.props.auth.token;
    // console.log("sening redux action for book ride", data);
    this.props.makeOrder(data, tokens);
    } catch (error) {
      console.warn(error)
    }
    
  };

  cancelOrder = async() => {
    // this.setState({
    //   is_searching: false,
    // });

    try {   if(this.props.order.order){


      const {state} =  this.props.order.order
      // console.log({state})
      if(state =="Ended" || state == "Completed"){
        return alert("Please complete the payment for your current ride")
      }
  
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order?",
        [
          {
            text: "Yes",
            onPress: async() => {
            await  store.dispatch({
                type: "PERFORMING_TASK",
              });
  
              const orderID = this.props.order.order
                ? this.props.order.order._id
                : null;
              const tokens = this.props.auth.token;
  
              if (orderID) {
                console.log("orderID!!!!!!!!!!!!!!!!!!!!!!", orderID);
                this.props.cancelOrder(tokens, orderID);
              }
  
             

              // RBSheet.close()
  
              this.user_ride_channel &&
                this.user_ride_channel.trigger("client-driver-cancelled", {});

              await  store.dispatch({
                  type: "CANCEL_ORDER",
                });
            await  store.dispatch({
                type: "END_LOADING",
              });
  
              // persistStore(store).purge();
  
             
  

              await this._getLocationAsync()
              await this.centerCamera();
              store.dispatch({
                type: "PERFORMING_TASK_ENDED",
              });
  
              // this.props.pusher&& this.props.pusher.pusher.disconnect()yyyyyy
            },
          },
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          // { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );

    }else{

        await  store.dispatch({
                type: "DESTINATION_CANCELLED",
              });
              this._getLocationAsync()
              this.centerCamera();
    }

      
    } catch (error) {
      console.warn(error)
    }
 
  };



  _getLocationAsync = async () => {


    try {
      console.log("getting location ")
   
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        console.log("Permission to access denied!!!.");
       return   Alert.alert(
        "Access Denied",
        "You need to grant access to location to continue using White Axis",
        [
          {
            text: 'Open Settings',
            onPress: () =>   Linking.openSettings(),
            style: 'cancel',
          },
          { text: 'ignore', onPress: () => navigation.goback()},
          // { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      }
      let location = await Location.getCurrentPositionAsync({
    accuracy  :Accuracy.BestForNavigation
      });
  

     
      var my_location = regionFrom(
        location.coords.latitude,
        location.coords.longitude,
        location.coords.accuracy
      );
  


      console.log("my location!!!!!!!!!!!!!!!!!!!!" , my_location)
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
       await   store.dispatch({
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
     
    } catch (error) {
      console.warn(error)
    }
   
  };



  componentWillUnmount() {
    console.log("Unmounting COmponents!!!!!!!");
    // this.persist_state_data();
    navigator.geolocation.clearWatch(this.watchId);

    this.soundObject && this.soundObject.unloadAsync();


  }

  renderContent = () => (




<Animatable.View animation="slideInUp" delay={1300} style={styles.rect}>
            <SelectLogistics
              style={
                (styles.Bike,
                { backgroundColor: this.state.isBikeSelected ? "gold" : null })
              }
            ></SelectLogistics>

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

    var show_user_location = true 

    if(this.props.order.order){
      show_user_location = this.props.order.order.state!=="Started"
    }

    return (
      <View style={styles.container}>
        {/* Loading Animation */}

        <LottieLoader
          visible={this.props.order.is_fetching}
          source={require("../assets/lottie/car.json")}
        />
        {/* End Loading animation */}

        {this.props.order.is_searching && (
          <CustomModal cancelOrder={this.cancelOrder} />
        )}
        {!this.props.order.destinationRequested &&
        !this.props.order.has_ride ? (
        

          this.destination_button()
        ) : null}

        {/* if the user has a driver, show the driver details */}

        {this.props.order.has_ride  && (
       this.driver_details_popup()
        ) }

        {!this.props.order.destinationRequested ? (
this.drawer_button()
   
   
   ) : (

    this.back_button()
   )}

        {/* <View style = {styles.destination}>  */}
        {/* <SearchInput /> */}

        {/* </View> */}

        {/* <CurrentLocationButton
          cb={() => {
             this.centerCamera();;
          }}
        /> */}


      {this.current_location_button()}


        <>


        {/* <View
  pointerEvents="none"
  style={{position: 'absolute', top: 200, left: 200}}>
  <Image source={require("../assets/images/preloader.png")} />
</View> */}
{/* 
          <View style = {styles.preloader}>
          <Image source = {require("../assets/images/preloader.png")}></Image>

          <Text style ={{top : 100}} > I am here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</Text>
        </View> */}


{!this.state.map_is_ready && <View style = {[styles.container, {position : "absolute", zIndex: 777


}]}>
        <ImageBackground source = {require("../assets/images/preloader.png")} resizeMethod = "resize" style={{width: wp(100), height: hp(140), top : -hp(18)}} />

      </View> }


    
          <MapView
            followUserLocation={show_user_location}
            initialRegion={this.props.order.region}
            rotateEnabled={false}
            
            customMapStyle = {this.getMapStyles()}
            showsUserLocation={show_user_location}
            showsBuildings={true}
            zoomEnabled={true}
            showsCompass={false}

            // pitchEnabled = {true}
            showsAnnotationCallouts = {true}
            onMapReady={() => {

              // setTimeout(() => {
                this.setState({
                  map_is_ready : true
                }, ()=>{
                  this.centerCamera()
                } )


                
              // this._getLocationAsync();
               
      
              // }, 2000);


         
            }}
     
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

            {this.props.order.destinationRequested &&
            !this.props.order.driver ? (
            
             



this.destination_marker()
   
            ) : null}

            {this.props.order.driver && (


              <>

                {this.props.order.order && this.props.order.order.state == "Started" && (
               this.map_view_directions()
                )}

                {this.show_driver_marker()}
   </>
              // this.driverLocation()
            )}
          </MapView>

        {/* over lay image */}



</>
        <StatusBar style="auto" hidden = {true} />

        {/* <View
        style={{
          flex: 1,
          // backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <f
          title="Open Bottom Sheet"
          onPress={() => sheetRef.current.snapTo(0)}
        />
      </View> */}

        {this.props.order.destinationRequested &&
        !this.props.order.driver &&
        !this.props.order.is_searching ? (



<Animatable.View animation="slideInUp" delay={1000} style={styles.rect}>
<SelectLogistics
  style={
    (styles.Bike,
    { backgroundColor: this.state.isBikeSelected ? "gold" : null })
  }

  bookRide = {this.bookRide}
></SelectLogistics>

</Animatable.View>

        ) : null}







        
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { makeOrder, cancelOrder,getOrder,test_redux_promisify })(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  rect: {
    height: hp(30),
    top : hp(70),
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

  preloader : {
    position : "absolute",
   marginTop : 500
   
    
  },
  Bike: {
    height: hp("50%"),
    width: wp("100%"),
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },
});
