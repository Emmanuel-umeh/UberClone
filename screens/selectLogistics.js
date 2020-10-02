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

class SetLogistics extends Component {
  state = {
    isTruckSelected: null,
    isBikeSelected: null,
    isCarSelected: null,
    selected : null
  };
  render() {

    // console.log("state changed,", this.state)
    return (
      <View style={styles.container}>
        {/* <Header />  */}

        <SafeAreaView>
          <Animatable.Text animation = "bounceIn" style={styles.selectAVechicle}>Select a vechicle</Animatable.Text>
        </SafeAreaView>

        <ScrollView>
          <TouchableOpacity onPress ={()=>{
            this.setState({
              isCarSelected : true,
              isTruckSelected:null,
              isBikeSelected : null,
              selected : "Car"
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
              selected : "Bike"
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
              isBikeSelected : null,
              selected : "Truck"
              
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
        </ScrollView>

        {/* <CupertinoButtonWarning
          style={styles.cupertinoButtonWarning}
        ></CupertinoButtonWarning> */}
        <TouchableOpacity>
          <Button full warning style={{ height: 70, top: 10, bottom: 10, backgroundColor:"gold" }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
              Select {this.state.selected}
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
    height: 151,
    width: 359,
    marginTop: 10,
    marginLeft: 1,
  },
  Bike: {
    height: 151,
    width: 360,
    marginTop: 10,
    // backgroundColor : this.state.isTruckSelected
  },
  Truck: {
    height: 151,
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
    marginTop: "20%",
    alignSelf: "center",
  },
});

export default SetLogistics;
