import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function SelectCar(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}>
      <Text style={styles.selectCar}>select car</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFCC00",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  selectCar: {
    color: "rgba(10,10,10,1)",
    fontSize: 22
  }
});

export default SelectCar;
