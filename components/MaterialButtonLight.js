import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

function MaterialButtonLight(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
    ></TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16
  }
});

export default MaterialButtonLight;
