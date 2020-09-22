import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
function getStarted({navigation}) {
  return (
    <Animatable.View 
    animation = "bounceIn"
    style={styles.container}>
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
  }
});

export default getStarted;
