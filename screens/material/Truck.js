import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from 'lottie-react-native';

function Truck(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.cardBody}>
        <View style={styles.bodyContent}>
          <Text style={styles.truck}>Truck</Text>
          <Text style={styles.subtitleStyle}>3 min</Text>
        </View>
      </View>
      <View style={styles.actionBody}>
        <TouchableOpacity style={styles.actionButton1}>
          <Text style={styles.n400}>₦ 5000</Text>
        </TouchableOpacity>
      </View>
      {/* <Image
        source={require("../../assets/images/truck.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image> */}

        <LottieView
          // style = {{
          //   height : 200,
          //   width : 200
          // }}
          style ={{
            marginLeft : "28%",
            // width : 100,
            // height: 100
          }}
          source={require("../../assets/lottie/test9.json")}
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
  truck: {
    fontFamily: "roboto-700",
    fontSize: 22,
    color: "#000",
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
  n400: {
    fontSize: 22,
    color: "#000",
    opacity: 0.9
  },
  image: {
    top: 21,
    left: 217,
    width: 100,
    height: 100,
    position: "absolute"
  }
});

export default Truck;
