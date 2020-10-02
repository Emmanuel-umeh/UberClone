import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from 'lottie-react-native';

function Car(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.cardBody}>
        <View style={styles.bodyContent}>
          <Text style={styles.car2}>Car</Text>
          <Text style={styles.subtitleStyle}>7 min</Text>
        </View>
      </View>
      <View style={styles.actionBody}>
        <TouchableOpacity style={styles.actionButton1}>
          <Text style={styles.n1700}>₦ 1700</Text>
        </TouchableOpacity>
      </View>
      <LottieView
          // style = {styles.image}
          style ={{
            marginLeft : "28%",
            // width : 100,
            // height: 100
          }}
          imageAssetsFolder={'lottie/animation_1'}
          source={require("../../assets/lottie/animation_1/Car.json")}
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
  car2: {
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
  n1700: {
    fontSize: 22,
    color: "#000",
    opacity: 0.9
  },
  image: {
    width: 100,
    height: 100,
    position: "absolute",
    left: 218,
    top: 21
  }
});

export default Car;
