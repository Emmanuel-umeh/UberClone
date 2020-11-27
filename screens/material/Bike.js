import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

function Bike(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.cardBody}>
        <View style={styles.bodyContent}>
          <Text style={styles.bike}>Bike</Text>
          <Text style={styles.subtitleStyle}></Text>
        </View>
      </View>
      <View style={styles.actionBody}>
        <TouchableOpacity style={styles.actionButton1}>
          {/* <Text style={styles.n900}>₦ 900</Text> */}
        </TouchableOpacity>
      </View>
      <LottieView
          // style = {styles.image}
          style ={{
            marginLeft : wp("10%"),
            // width : 100,
            // height: 100
          }}
          source={require("../../assets/lottie/5056-delivery-latest.json")}
          autoPlay 
          loop
        />

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
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden"
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bodyContent: {
    padding: 16,
    paddingTop: 24,
    flex: 1
  },
  bike: {
    fontFamily : "Righteous-Regular",
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
    height: hp("3%")
  },
  n900: {
    fontSize: 22,
    color: "#000",
    opacity: 0.9,
    lineHeight: 22
  },
  image: {
    // top: 21,
    // left: 217,
    // width: 100,
    // height: 200,
    position: "absolute"
  }
});

export default Bike;
