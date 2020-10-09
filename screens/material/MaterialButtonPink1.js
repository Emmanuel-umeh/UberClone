import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function MaterialButtonPink1(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.cash}>CASH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(233,183,30,1)",
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
  },
  cash: {
    color: "#fff",
    fontSize: 22
  }
});

export default MaterialButtonPink1;
