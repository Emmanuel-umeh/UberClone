import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

function MaterialIconTextbox(props) {
  return (
    <View style={[styles.container, props.style]}>
      <TextInput placeholder="Number" style={styles.inputStyle}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center"
  },
  inputStyle: {
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
    paddingBottom: 8
  }
});

export default MaterialIconTextbox;
