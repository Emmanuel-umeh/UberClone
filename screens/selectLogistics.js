import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Car from "./material/Car";
import Bike from "./material/Bike";
import Truck from "./material/Truck";
// import CupertinoButtonWarning from "./material/CupertinoButtonWarning";
import { Button, Header } from "native-base";
import plane from "./material/plane";
import Plane from "./material/plane";
import * as Animatable from "react-native-animatable";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Tanker from "./material/Tanker";
 
class SetLogistics extends Component {
  state = {
    isTruckSelected: null,
    isBikeSelected: null,
    isCarSelected: null,
    isTankerSelected: null,
    logistics : null
  };


  _next =()=>{
    console.log("props passed!!!!!!!!!!!!!!!! ", this.props.navigation)

   
    this.props.navigation.navigate("Map", {
      logistics : this.state.logistics
    })
    // this.props.route.params.selectDestination(this.props.route.params.destination)
  }
  render() {

    // console.log("state changed,", this.state)
    return (
      <View style={styles.container}>
        {/* <Header />  */}

        <SafeAreaView>
          <Animatable.Text animation = "bounceIn" style={styles.selectAVechicle}>Select Your Vehicle</Animatable.Text>
        </SafeAreaView>

        <ScrollView>
          <TouchableOpacity onPress ={()=>{
            this.setState({
              isCarSelected : true,
              isTruckSelected:null,
              isBikeSelected : null,
              isTruckSelected:null,
              logistics : "Car"
            })
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
          <TouchableOpacity onPress ={()=>{
            this.setState({
              isCarSelected : null,
              isTruckSelected:null,
              
              isBikeSelected : true,
              logistics : "Bike"
            })
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

          <TouchableOpacity 
          onPress ={()=>{
            this.setState({
              isCarSelected : null,
              isTruckSelected:true,
              isTankerSelected:null,
              isBikeSelected : null,
              logistics : "Truck"
              
            })
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
            this.setState({
              isCarSelected : null,
              isTruckSelected:null,
              isTankerSelected:true,
              isBikeSelected : null,
              logistics : "Tanker"
              
            })
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
        <TouchableOpacity>
          <Button full warning style={{ height: 70, top: 10, bottom: 10, backgroundColor:"gold" }} onPress ={this._next}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>
              Select {this.state.logistics}
            </Text>
          </Button>
        </TouchableOpacity>
      </View>
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
    width: 359,
    marginTop: 10,
    marginLeft: 1,
  },
  Bike: {
    height: hp("50%"),
    width: 360,
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },
  Truck: {
    height: hp("50%"),
    width: 360,
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },
  cupertinoButtonWarning: {
    height: 99,
    width: 299,
    borderRadius: 100,
    marginTop: 24,
    marginLeft: 26,
  },
  selectAVechicle: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    // position : "relative",
    marginTop: hp("5%"),
    alignSelf: "center",
  },
});

export default SetLogistics;
