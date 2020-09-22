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
import { connect } from "react-redux";
import {LinearGradient} from 'expo-linear-gradient'
import * as Animatable from "react-native-animatable"

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function SplashScreen({ navigation }) {
  useEffect(()=>{
    // console.log("stuff")
    
    setTimeout(() => {
      // console.log("timeout done")
      navigation.navigate("getStarted")
    }, 2000);
  })



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text> Header</Text>
         */}

        <Animatable.Image
        animation = "fadeInUpBig"
        delay = {2}
          source={require("../assets/logo5.png")}
          style={styles.logo}
          resizeMode="stretch"
        />


      </View>

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
export default connect(mapStateToProps, { })(
  SplashScreen
);



const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.15;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
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
    width: width ,
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
