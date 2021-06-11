import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../colors/colors"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {firebase} from "../../firebase/firebase"
function CupertinoButtonPurple(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress = {() => {
      firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out!"));
    }}>
      <Text style={styles.connectToFacebook}>Logout</Text>
      <Icon name="power" style={styles.icon}></Icon>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.safron,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 50,
    paddingLeft: 0,
    paddingRight: 16
  },
  connectToFacebook: {
    color: "#fff",
    fontSize: 17,

fontFamily : "Quicksand-Bold",
  },
  icon: {
    top: hp(2),
    left: wp(8),
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 21
  }
});

export default CupertinoButtonPurple;
