import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

function Untitled2(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.whatsYourName}>What&#39;s your name?</Text>
      <View style={styles.rectRow}>
        <View style={styles.rect}></View>
        <View style={styles.rect2}></View>
      </View>
      <View style={styles.firstRow}>
        <Text style={styles.first}>First</Text>
        <Text style={styles.last}>Last</Text>
      </View>
      <Icon name="chevron-with-circle-right" style={styles.icon1}></Icon>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  whatsYourName: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginTop: 123,
    marginLeft: 24
  },
  rect: {
    width: 122,
    height: 2,
    backgroundColor: "rgba(0,0,0,1)"
  },
  rect2: {
    width: 122,
    height: 2,
    backgroundColor: "rgba(0,0,0,1)",
    marginLeft: 62
  },
  rectRow: {
    height: 2,
    flexDirection: "row",
    marginTop: 63,
    marginLeft: 24,
    marginRight: 30
  },
  first: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    opacity: 0.19
  },
  last: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    opacity: 0.19,
    marginLeft: 140
  },
  firstRow: {
    height: 27,
    flexDirection: "row",
    marginTop: -38,
    marginLeft: 24,
    marginRight: 109
  },
  icon1: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginTop: 439,
    marginLeft: 281
  }
});

export default Untitled2;
