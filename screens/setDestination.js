import React, { Component } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import google_api from "../keys/google_map";
import _ from "lodash";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import * as Location from "expo-location";

 import { connect } from 'react-redux'
 import { Container, Header, Content, Card, CardItem, Icon, Right, Left, Body, Title, Button,Picker, Switch } from 'native-base';


import { Spinner as Loading } from "native-base";
import Spinner  from 'react-native-loading-spinner-overlay';
import { Divider } from "react-native-paper";
import { persistStore } from "redux-persist";
import { SafeAreaView } from "react-native";
import { getLatLonDiffInMeters } from "../helpers/helper";


const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const ASPECT_RATIO = WIDTH / HEIGHT;
const latitudeDelta = 0.3358723958820065; //Very high zoom level
const longitudeDelta = latitudeDelta * ASPECT_RATIO;

const LATITUDE_DELTA = latitudeDelta
const LONGITUDE_DELTA = longitudeDelta




 
class setDestination extends Component {
  constructor(props) {
    super(props);

    this.onChangeDestinationDebounced = _.debounce(
      this.destinationChange,
      500
    );
    this.onChangeFromDebounced = _.debounce(
      this.fromChange,
      500
    );
  }
  state = {
    // incase user changes pickup location
    // fromName : null,
    from : null,
    fromLoading : false,
    destination: null,
    predictions: [],
    // predictions for the from location
    fromPredictions : [],
    visible : false,
    my_address : null,
    loading : false
  };

 

 async componentDidMount(){

  // persistStore(store).purge();

  try {
    // let location = await  Geocoder.from({
    //   latitude: this.props.order.region.latitude,
    //   longitude:  this.props.order.region.longitude,
    // })

   const location = await Location.reverseGeocodeAsync({

      latitude: this.props.order.region.latitude,
      longitude:  this.props.order.region.longitude,
    })


   
    this.setState({
      my_address : location[0].street
    })
    //   .then((json) => {
    //     var addressComponent = json.results[0].address_components[0].long_name;
  } catch (error) {
    console.warn(error)
  }
    
  }

  destinationChange = async (destination) => {
    // console.log("longitude ", this.props.route.params.longitude);
    if(destination){
      try {
        
this.setState({
  visible : true
})
    const api_url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&region=locality&language=en&key=${google_api}&location=${this.props.route.params.latitude},${this.props.route.params.longitude}&radius=500`;
    const nearby_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.props.route.params.latitude},${this.props.route.params.longitude}&radius=${1000}&key=${google_api}`
        
    const result = await fetch(api_url);
    const json = await result.json();
    
    this.setState({
      destination,
      predictions: json.predictions,
      visible : false
    });


      } catch (error) {
        console.warn(error)
      }
    }
  };
  fromChange = async (fromName) => {
    // console.log("longitude ", this.props.route.params.longitude);

    if(fromName){
      try {
        this.setState({
          fromLoading : true
        })
            const api_url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${fromName}&region=locality&language=en&key=${google_api}&location=${this.props.route.params.latitude},${this.props.route.params.longitude}&radius=500`;
            const nearby_url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.props.route.params.latitude},${this.props.route.params.longitude}&radius=${1000}&key=${google_api}`
                
            const result = await fetch(api_url);
            const json = await result.json();
            
            this.setState({
              fromName : fromName,
              fromPredictions: json.predictions,
              fromLoading : false
            });
        
        
      } catch (error) {
        console.warn(error)
      }
    }

  };

  render() {
    // const predictions = this.state.predictions.map((prediction) => (
    //   <TouchableOpacity key={prediction.id} style={styles.button2}>
    //     <View style={styles.icon7Row}>
    //       <EntypoIcon name="home" style={styles.icon7}></EntypoIcon>
    //       <Text style={styles.addHome}>{prediction.description}</Text>
    //     </View>
    //   </TouchableOpacity>
    // ));
    // var v = Object.values(this.state.predictions);

    // const predictions = this.state.predictions.map((prediction,key) => (


    


    // ));
    // console.log("predictions", predictions)
    return (

    

      <SafeAreaView style={styles.container}>

<StatusBar style="dark" hidden = {true} />

          <Header style={{
                          backgroundColor : "white",
                          // top : hp("2%")
                        }} 
                        androidStatusBarColor = "dark"
                        iosBarStyle	= "dark-content"
                        >
        <Left>
          <TouchableOpacity onPress={() => {
                this.props.navigation.pop();
              }}> 
          <Button transparent>
            <Icon
              name="arrow-back"
              style ={{
                color : "black"
              }}        
            />
          </Button>

          </TouchableOpacity>
         
        </Left>
        <Body>
                    <Title style ={{
                     fontFamily : "Quicksand-Bold",
                      color : "black",
                      marginLeft : wp("2%"),
                      fontSize: 17
                    }}>Destination</Title>
                  </Body>
                  <Right></Right>   
      </Header>
    
<Spinner
visible={this.state.loading}
textContent="Loading..."
textStyle={{ color: '#fff',fontFamily : "Quicksand-Bold", }}
animation="fade"
/>




        {/* <View style = {styles.container}> */}
          <Animatable.View animation="bounceIn" style={styles.header}>
            <View style={styles.icon3StackStackRow}>
              <View style={styles.icon3StackStack}>
                <View style={styles.icon3Stack}>
                  <EntypoIcon
                    name="dot-single"
                    style={styles.icon3}
                  ></EntypoIcon>
                  <View style={styles.rect2}></View>
                </View>
                <EntypoIcon
                  name="location-pin"
                  style={styles.icon5}
                ></EntypoIcon>


              </View>

       

              <View style={styles.textInputColumn}>
                <TextInput
                 editable={true} 
                 onChangeText={this.onChangeFromDebounced}
                 returnKeyType="next"
                 onSubmitEditing={() => { this.destinationInput.focus(); }}
                  defaultValue={
                    this.state.my_address
                      ?    this.state.my_address
                      : "Unknown Road"
                  }

                  blurOnSubmit={false}
                  style={styles.textInput}
                ></TextInput>

                
                <TextInput
                  placeholder="Add Destination"
                  ref={(input) => { this.destinationInput = input; }}
                  onChangeText={this.onChangeDestinationDebounced}
                  style={styles.textInput1}
                ></TextInput>
              </View>

              {this.state.fromLoading &&
     <Loading
     visible={this.state.visible}
     style={styles.icon2}
    
     color = "#d1ab21"
     animation="fade"
   />

}

{this.state.visible &&
     <Loading
     visible={this.state.visible}
     style={styles.icon}
    
     color = "#d1ab21"
     animation="fade"
   />

}
       

  
    
            </View>
          </Animatable.View>


          

          <Animatable.View animation="fadeInDownBig" style={styles.footer}>
            

            {/* <ScrollView> */}
            {/* <ScrollView> */}

            {this.state.predictions.length ==0 && 
            <>
            
            <TouchableOpacity style={styles.button2}>
            <View style={styles.icon7Row}>
              <EntypoIcon name="home" style={styles.icon7}></EntypoIcon>
              <Text style={styles.addHome}>Add Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}>
            <View style={styles.icon7Row}>
              <EntypoIcon name="briefcase" style={styles.icon7}></EntypoIcon>
              <Text style={styles.addHome}>Add Work</Text>
            </View>
          </TouchableOpacity>
          </>

}
         
            <Card style ={{width : wp("100%"), elevation : 0, borderColor : "white"}}> 

            {this.state.destination &&
            <FlatList
              keyboardShouldPersistTaps={'handled'}
data={this.state.predictions}
initialNumToRender={4}
keyExtractor={(item, index) => index.toString()}
renderItem={({ item }) => 
<TouchableOpacity
// key={item.place_id}

   onPress={async () => {

     this.setState({
       loading : true
     })
     // console.log("id , ",prediction.place_id)

     const place_url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&key=${google_api}`;
    const result = await fetch(place_url);
     const json = await result.json();

    // the name of the destination to display on callout
    // using this to return formatted street name
  //   const going_address_name =  await  Location.reverseGeocodeAsync({
  //     latitude: json.result.geometry.location.lat,
  //  longitude:   json.result.geometry.location.lng
  //   })

// going address passed to map
     const destination = {
       latitude: json.result.geometry.location.lat,
       longitude: json.result.geometry.location.lng,
       name : item.structured_formatting.main_text
     };

     console.log({destination})


   const  distance =   getLatLonDiffInMeters(
       this.props.order.region.latitude,
       this.props.order.region.longitude,
       json.result.geometry.location.lat,
       json.result.geometry.location.lng
     );
     console.log("distance",  distance);

     if(distance > 200000){
       this.setState({
         loading : false
       })
       return alert("Distance is too great. Please select another location")
     }
   
     // this.props.navigation.navigate("Map", {
     //   destination :{
     //     latitude : json.result.geometry.location.lat,
     //     longitude : json.result.geometry.location.lng
     //   }
     // })

     // console.log("passing these logistics selected from set destination screen ", this.props.route.params.logistics)

     this.props.navigation.navigate("Map", {
       destination,
       logistics : this.props.route.params.logistics,
       from : this.state.from
     });
      const going = destination


     this.props.route.params.selectDestination(going, this.state.from)
     this.setState({
       loading : false
     })
     // returns
     // Object {
     //   "lat": 8.969173699999999,
     //   "lng": 7.440240199999998,
     // }
   }}
   // style={styles.button2}
 >
   {/* <View style={styles.icon7Row}>
     <EntypoIcon name="location" style={styles.icon7}></EntypoIcon>
     <Text style={styles.addHome}>{prediction.description}</Text>
     
   </View> */}


      

      
       <CardItem style ={{top : 10}} >
       <EntypoIcon name="location" style={styles.icon7}></EntypoIcon>

         <Body style ={{
           left : wp("10%"),
           width : "70%"
         }}>
         <Text style ={{fontFamily : "Quicksand-Bold", fontSize : 15}}>{item.structured_formatting.main_text}</Text>
         <Text style ={{fontFamily : "Quicksand-Bold", fontSize : 15}}>{item.structured_formatting.secondary_text}</Text>
         </Body>
  
         <Right style={{
             right : wp("10%")
         }}>
           <Icon name="arrow-forward"  style ={{
             color : "black"
           }}/>
         </Right>
        </CardItem>
       <Divider
       
       
       
       style={{

         marginTop: 20,
         height : 1
       }}/>
       
        </TouchableOpacity>

}
keyExtractor={item => item.id}
/>

}

{this.state.fromName && 

<FlatList
keyboardShouldPersistTaps={'handled'}
data={this.state.fromPredictions}
initialNumToRender={4}

keyExtractor={(item, index) => index.toString()}
renderItem={({ item }) => 
<TouchableOpacity
// key={item.place_id}
onPress={async () => {


const place_url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${item.place_id}&key=${google_api}`;
const result = await fetch(place_url);
const json = await result.json();



const from = {
latitude: json.result.geometry.location.lat,
longitude: json.result.geometry.location.lng,
fromName : item.structured_formatting.main_text,
};
this.setState({
from,

my_address : item.structured_formatting.main_text,
fromPredictions :[],

})

this.destinationInput.focus(); 



// this.setState({
// loading : false
// })
// returns
// Object {
//   "lat": 8.969173699999999,
//   "lng": 7.440240199999998,
// }
}}
// style={styles.button2}
>
{/* <View style={styles.icon7Row}>
<EntypoIcon name="location" style={styles.icon7}></EntypoIcon>
<Text style={styles.addHome}>{prediction.description}</Text>

</View> */}





<CardItem style ={{top : 10}} >
<EntypoIcon name="location" style={styles.icon7}></EntypoIcon>

<Body style ={{
left : wp("10%"),
width : "70%"
}}>
<Text style ={{fontFamily : "Quicksand-Bold", fontSize : 15}}>{item.structured_formatting.main_text}</Text>
<Text style ={{fontFamily : "Quicksand-Bold", fontSize : 15}}>{item.structured_formatting.secondary_text}</Text>
</Body>

<Right style={{
right : wp("10%")
}}>
<Icon name="arrow-forward"  style ={{
color : "black"
}}/>
</Right>
</CardItem>
<Divider



style={{

marginTop: 20,
height : 1
}}/>

</TouchableOpacity>

}
keyExtractor={item => item.id}
/>}

      
</Card>





            {/* </ScrollView> */}
          </Animatable.View>


        {/* </View> */}
     
      </SafeAreaView>
 );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  rect: {
    top: 0,
    left: 0,
    height: hp("20%"),
    width: wp("100%"),
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.21)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.21)",
    borderStyle: "solid",
    overflow: "visible",
    shadowColor: "rgba(197,181,181,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.35,
    shadowRadius: 0,
    borderRadius: 9,
    borderBottomRightRadius: 23,
    borderBottomLeftRadius: 23,
    right: 1,
  },
  icon3: {
    top: 23,
    left: 0,
    position: "absolute",
    color: "rgba(105,174,26,1)",
    fontSize: 40,
    height: 44,
    width: 40,
  },
  rect2: {
    top: 0,
    left: 20,
    width: 1,
    height: 39,
    position: "absolute",
    backgroundColor: "#E6E6E6",
  },
  icon3Stack: {
    top: 25,
    left: 0,
    width: 40,
    height: 67,
    position: "absolute",
  },
  icon5: {
    top: 0,
    left: 8,
    position: "absolute",
    color: "#d1ab21",
    fontSize: 25,
    height: 27,
    width: 25,
  },
  icon3StackStack: {
    width: 40,
    // height: 92,
    marginTop: 8,
  },
  textInput: {
          fontFamily : "Quicksand-Bold",
    color: "black",
    height: hp("6.5%"),
    width: wp("70%"),
    fontSize: 15,
    fontWeight : "600",
    opacity: 0.94,
    paddingLeft: 10,
    backgroundColor: "whitesmoke",
  },
  textInput1: {
          fontFamily : "Quicksand-Bold",
    color: "#121212",
    height: hp("6.5%"),
    width: wp("70%"),
    fontSize: 15,
    opacity: 0.94,
    fontWeight : "600",
    backgroundColor: "whitesmoke",
    paddingLeft: 10,
    marginTop: 12,
  },
  textInputColumn: {
    width: wp("75%"),
    marginLeft: 6,
  },
  icon: {
    color: "gold",
    fontSize: 25,
    height: 44,
    width: 5,
    left : 0,
    marginTop: hp("8%"),
  },
  icon2: {
    color: "gold",
    fontSize: 25,
    height: 44,
    width: 5,
    left : 0,
    marginTop: hp("0.5%"),
  },
  icon3StackStackRow: {
    height: hp("17%"),
    flexDirection: "row",
    marginTop: 0,
    marginLeft: 1,
    marginRight: 19,
  },
  button: {
    top: hp("70%"),
    left: 0,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    right: 1,
    bottom: 0,
    flexDirection: "row",
  },
  icon6: {
    color: "rgba(0,0,0,1)",
    fontSize: 27,
    opacity: 0.79,
    height: 29,
    width: 27,
  },
  chooseOnMap: {
          fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 20,
    opacity: 0.92,
    marginLeft: 4,
    marginTop: 5,
  },
  icon6Row: {
    height: 29,
    flexDirection: "row",
    flex: 1,
    marginRight: wp("10%"),
    marginLeft: 79,
    marginTop: 11,
  },
  button2: {
    // top: 181,
    left: 0,
    width: wp("100%"),
    height: hp("8%"),
    borderBottomColor: "whitesmoke",
    borderBottomWidth: 1,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    right: 1,
    // flexDirection: "row"
  },
  icon7: {
    color: "black",
    fontSize: 20,
    height: 29,
    width: 27,
  },
  addHome: {
          fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 15,
    marginLeft: 32,
    fontWeight : "600",
    marginTop: 3,
  },
  icon7Row: {
    height: hp("30%"),
    flexDirection: "row",
    flex: 1,
    width: wp("100%"),
    marginRight: wp("50%"),

    marginLeft: 20,
    marginTop: 16,
  },
 

  header: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(197,181,181,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.35,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 20,
    // paddingVertical: 30,
  },
});


const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(setDestination);