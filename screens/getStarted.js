import React, { Component } from "react";
import { StyleSheet, View, Text,Image, } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import { loadUser } from "../action/authAction";
import {connect} from "react-redux"

import LottieView from 'lottie-react-native';

function getStarted({navigation}) {
  return (
    <Animatable.View 
    animation = "bounceIn"
    style={styles.container}>

{/* 
<Image
          style={{width: 50, height: 50}}
          source={{uri: 'https://reactjs.org/logo-og.png'}}
        /> */}

      
{/* <View style={styles.line}> */}
        {/* <Animatable.Image
          source={require("../../assets/carVector.png")}
             resizeMode="center"
          animation = {"bounceIn"}
        /> */}

      
        <View style = {styles.line}>
            <LottieView
          style = {{
            height : 200,
            width : 200
          }}
          source={require("../assets/lottie/test9.json")}
          autoPlay
          loop
        />
{/* 
        <Image
          source={{uri: "../assets/lottie/axiscar4.gif"}}
          style={{height : 300, width : 300}} 
          /> */}
        </View>

      {/* </View> */}


      <Text style={styles.moveSafely}>Move Safely</Text>

      

      <View style={styles.rect}>
        <Animatable.View 
        animation = "fadeInUp"
        style={styles.getStartedRow}>
          <Text style={styles.getStarted} onPress ={()=>{
            navigation.navigate("phoneNumberScreen")
          }}>Get Started</Text>
          <Icon onPress ={()=>{
            navigation.navigate("phoneNumberScreen")
          }} name="md-arrow-forward" style={styles.icon}></Icon>
        </Animatable.View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  moveSafely: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 40,
    marginTop: "100%",
    alignSelf: "center"
  },
  rect: {
    width: 306,
    height: 61,
    backgroundColor: "rgba(0,0,0,1)",
    flexDirection: "row",
    marginTop: 155,
    marginLeft: 27
  },
  getStarted: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    marginTop: 15
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 50,
    height: 54,
    width: 33,
    marginLeft: 53
  },
  getStartedRow: {
    height: 54,
    flexDirection: "row",
    flex: 1,
    marginRight: 19,
    marginLeft: 101,
    marginTop: 4
  },
  line: {
    position: "absolute",
    left: "25.77%",
    right: "13.54%",
    top: "25.51%",
    bottom: " 58.17%",
  },

});


const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { loadUser })(getStarted);