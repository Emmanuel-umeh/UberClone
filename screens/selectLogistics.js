import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from "react-native";


import { StatusBar } from "expo-status-bar";

import Car from "./material/Car";
import Bike from "./material/Bike";
import Truck from "./material/Truck";
// import CupertinoButtonWarning from "./material/CupertinoButtonWarning";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Button, Header, Icon } from "native-base";

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
import colors from "./colors/colors"

const select_car = require("../assets/logistics/newcar.png")
const select_bike = require("../assets/logistics/bike.png")
const select_truck = require("../assets/logistics/new_truck.png")
const select_tanker = require("../assets/logistics/new_tanker.png")

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.3358723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta
const LONGITUDE_DELTA = longitudeDelta
class SetLogistics extends PureComponent {

  constructor(props){
    super(props)


    this.state = {
      isTruckSelected: null,
      isBikeSelected: null,
      isCarSelected: null,
      isTankerSelected: null,
      logistics : "bike",
      data: [
        {id:0, title: "bike", name : "Delivery Bike",  image:select_bike},
        {id:1, title: "car", name : "Taxi",  image:select_car},
     
        {id:2, title: "truck", name : "Pickup Truck",  image:select_truck} ,
        {id:3, title: "tanker", name : "Trailer",   image:select_tanker} ,
        // {id:4, title: "Option 5", image:"https://img.icons8.com/color/70/000000/shutdown.png"} ,
        // {id:5, title: "Option 6", image:"https://img.icons8.com/color/70/000000/traffic-jam.png"} ,
        // {id:6, title: "Option 7", image:"https://img.icons8.com/dusk/70/000000/visual-game-boy.png"} ,
        // {id:8, title: "Option 8", image:"https://img.icons8.com/flat_round/70/000000/cow.png"} ,
        // {id:9, title: "Option 9", image:"https://img.icons8.com/color/70/000000/coworking.png"} ,
        // {id:9, title: "Option 10",image:"https://img.icons8.com/nolan/70/000000/job.png"} ,
      ]
    };
  }


  clickEventListener =(item)=>{
    console.log({item})

    this.setState({
      logistics : item.title
    })
  }

  componentDidMount(){


              // persistStore(store).purge();
              // store.dispatch({
              //   type : "PURGE"
              // })

        

    if(this.props.order.has_ride){
      // if(!this.props.order.fromChanged){
        // this._getLocationAsync()
      // }
    
      return this.props.navigation.replace("Map")
      
    }
    
    // this._getLocationAsync()
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
      accuracy : Location.Accuracy.BestForNavigation
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

    const address =  await Location.reverseGeocodeAsync({
      latitude :location.coords.latitude , longitude:  location.coords.longitude 
    })
    console.log(address[0])

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
          my_address: address[0].street ? address[0].street : address[0].name,
          // addressShortName: addressComponent,
        };

        // console.log("dataaaaa!!! ", data)
      await  store.dispatch({
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

  _next =()=>{


    store.dispatch({
      type : "LOGISTIC_TYPE",
      payload : this.state.logistics
    })

   
    this.props.navigation.navigate("Map", {
      logistics :  this.state.logistics
    })
    // this.props.route.params.selectDestination(this.props.route.params.destination)
  }
  render() {

    // console.log("state changed,", this.state)
    return (
      <SafeAreaView style={styles.container}>

<Text animation = "bounceIn" style={styles.selectAVechicle}>Select Your Service</Text>
        {/* <View style={styles.container}> */}

        {/* <ScrollView> */}

       
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={this.state.data}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <Animatable.View animation = "bounceIn"  >
                <TouchableOpacity style={[styles.card, {



// width:wp(46),
// height:hp(36),
marginTop : item.title == this.state.logistics ? -hp(0.5) : null,
    borderWidth : item.title == this.state.logistics ? 1 : 0,
    borderColor : item.title == this.state.logistics ? colors.safron : "#e2e2e2"
                }]} onPress={() => {this.clickEventListener(item)}}>
{

item.title == this.state.logistics && 

                  <Icon style={{
                    color : colors.safron,
                    alignSelf : "flex-end",
                    paddingRight : wp(1.5),
                    marginTop :-hp(1)
                  }} name = "checkmark-circle"></Icon>
                }
                  <Image resizeMode = "contain" style={[styles.cardImage, {
                    width : wp(48),
                    height : wp(47),
                  }]} source={item.image}/>


                  <View style = {styles.tag}>

                    <Text style = {styles.tag_text}>{item.name}</Text>

                  </View>
                </TouchableOpacity>

            
              </Animatable.View>
            )
          }}/>
      {/* </View> */}

      <Button onPress ={this._next} block style ={{
        backgroundColor :colors.safron,
        borderRadius : 30,
        width : wp(80),
        alignSelf : 'center',
        top : -hp(3)
      }}><Text style={{
        fontSize: 20,
        fontFamily : "Quicksand-Bold",
        marginTop : -3,
        color : colors.white
      }}>Select {this.state.logistics}</Text></Button>
         
         {/* </ScrollView> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:40,
    backgroundColor:'#f6f6f6',
  },
  selectAVechicle :{
    fontFamily : "Quicksand-Bold",
    fontSize : 20,
     alignSelf  :"center"
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#f6f6f6",
  },
  listContainer:{
    alignItems:'center'
  },
  /******** card **************/
  card:{
    // shadowColor: '#474747',
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.37,
    // shadowRadius: 7.49,

    // // elevation: 12

    marginVertical: hp(2),
    marginHorizontal: wp(
      1
    ),
    backgroundColor:"#e2e2e2",
    //flexBasis: '42%',
    width:wp(46),
    height:hp(36),
    borderRadius:28,
    alignItems:'center',
    justifyContent:'center'
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage:{
    height: wp(40),
    width: hp(60),
    alignSelf:'center'
  },
  title:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },

  tag : {
    justifyContent : "flex-end"
  },
  tag_text : {
    fontFamily : "Quicksand-Bold",
    fontSize : 20
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(SetLogistics);