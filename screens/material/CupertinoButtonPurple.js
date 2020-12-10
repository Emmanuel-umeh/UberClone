import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function CupertinoButtonPurple(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.connectToFacebook}>Logout</Text>
      <Icon name="power" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 0,
    paddingRight: 16
  },
  connectToFacebook: {
    color: "#fff",
    fontSize: 17,

fontFamily : "Quicksand-Bold",
  },
  icon: {
    top: 10,
    left: 29,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 21
  }
});

export default CupertinoButtonPurple;
