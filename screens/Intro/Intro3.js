import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
// import Dots from 'react-carousel-dots';
import { connect } from "react-redux";
import { useFonts } from "@use-expo/font";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

import LottieView from "lottie-react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function Intro3({ navigation }) {
  return (
    <View style={styles.container}>

      
<View style = {styles.vector}>
    <Image
    source = {require("../../assets/circleVector.png")}
    
    
    />

      </View>
      
      <View style={styles.line}>
        {/* <Animatable.Image
          source={require("../../assets/carVector.png")}
             resizeMode="center"
          animation = {"bounceIn"}
        /> */}

        <LottieView
          style={{
            width: "100%",
          }}
          source={require("../../assets/lottie/car.json")}
          autoPlay
          loop
        />
      </View>

      <Animatable.View animation={"bounceIn"} duration={2000}>
        <Text style={styles.text}>Quick Delivery...</Text>
        <Text style={styles.subText}>
          Delivering your product quickly and efficiently...
        </Text>
      </Animatable.View>

      {/* <Animatable.View style={styles.footer}
       animation = "fadeInUpBig"
       >
        <Text style={styles.title}> Welcome to Axis</Text>
        <Text style={styles.text}>Get Started</Text>

        <View style={styles.button}>
          <TouchableOpacity onPress = {()=>{
              navigation.navigate("SignInScreen")
          }}>
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
      </Animatable.View>
     */}
    </View>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(Intro3);

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#000000",
  },
  line: {
    position: "absolute",
    left: "13.77%",
    right: "13.54%",
    top: "25.51%",
    bottom: " 58.17%",
  },

  vector: {
    position: "absolute",
    width: 387.96,
    height: 257.64,
    left: "1.77%",
    // top: "0.51%",
    zIndex: 1,
    // backgroundColor: "#998415",
    // transform: matrix(-0.8, 0.6, 0.6, 0.8, 0, 0)
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
    width: width,
    height: height_logo,
  },
  title: {
    color: "#05375a",
    fontSize: 30,
    fontWeight: "bold",
  },

  text: {
    position: "absolute",
    width: 300,
    height: 56,
    left: 34,
    top: 420,
    color: "#fff",

    fontFamily: "charm-bold",

    fontStyle: "normal",
    // fontWeight: "bold",
    fontSize: 30,
    lineHeight: 56,
    /* identical to box height */
  },

  subText: {
    position: "absolute",
    width: 345,
    height: 38,
    left: 34,
    top: height * 0.65,
    color: "#fff",

    fontFamily: "charm-bold",
    // fontStyle: normal,
    // fontWeight: normal,
    fontSize: 20,
    lineHeight: 22,
    /* identical to box height */
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
