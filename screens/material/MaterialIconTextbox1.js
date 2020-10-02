import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function MaterialIconTextbox1(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TextInput placeholder="Email" style={styles.inputStyle1}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
  },
  inputStyle1: {
    color: "#000",
    marginLeft: 16,
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    paddingTop: 14,
    paddingBottom: 8,
    left: 48,
    width: 359,
    top: 0,
    height: 43
  }
});

export default MaterialIconTextbox1;
