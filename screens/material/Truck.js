import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Truck(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.cardBody}>
        <View style={styles.bodyContent}>
          <Text style={styles.car2}>Car</Text>
          {/* <Text style={styles.subtitleStyle}>7 min</Text> */}

          <View style ={{
            marginTop : -hp(9)
          }}>
          <Image style={{
          width : wp(50)
        }} resizeMode ="contain" source ={require("../../assets/logistics/truck.png")}>


        </Image>
          </View>
        
        </View>
      </View>

      {/* <LottieView
          // style = {styles.image}
          style ={{
            marginLeft : wp("10%"),
            // width : 100,
            // height: 100
          }}
          imageAssetsFolder={'lottie/animation_1'}
          source={require("../../assets/lottie/animation_1/Car.json")}
          autoPlay 
          loop
        /> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#CCC",
    flexWrap: "nowrap",
    backgroundColor: "#FFF",
    shadowColor: "#B5B5B8",
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    height : hp(30),
    overflow: "hidden"
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bodyContent: {
    padding: 16,
    paddingTop: 24,
    flex: 1,
    flexDirection : "row",
     justifyContent : "space-between"
  },
  car2: {
    fontFamily : "Quicksand-Bold",
    fontSize: 30,
    
    color: "#000",
    top :wp("10%"),
    paddingBottom: 12
  },
  subtitleStyle: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    opacity: 0.5
  },
  actionBody: {
    padding: 8,
    flexDirection: "row"
  },
  actionButton1: {
    padding: 8,
    height: 36
  },
  n1700: {
    fontSize: 22,
    color: "#000",
    opacity: 0.9
  }
});

export default Truck;
