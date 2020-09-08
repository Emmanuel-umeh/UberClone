import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
 
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable"

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text> Header</Text>
         */}

        <Animatable.Image
        animation = "fadeInDown"
        delay = {2}
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}> Welcome to Axis</Text>
        <Text style={styles.text}>Get Started</Text>

        <View style={styles.button}>
          <TouchableOpacity>
            <LinearGradient
              colors={["#08d4c44", "#01ab9d"]}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Get Started</Text>

              <MaterialIcons 
              
              name ="navigate-next"
              color = "#fff"
              size = {20}

              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
});
