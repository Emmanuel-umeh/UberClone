import React, { Component } from "react";

import * as Animatable from "react-native-animatable";
import { Container, Header, Content, Button, Text } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
export default function NoInternetScreen(props) {
  // console.log({props})
  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation="slideInUp">
        <Text style ={styles.text}>Can't Connect to internet.</Text>
        <Text style ={styles.text}>Please check your network </Text>
        <Text style ={styles.text}>settings! </Text>


<View style ={{
    marginTop : hp("30%"),
    left  : wp("25%")
}}>

    {/* <TouchableOpacity> */}

    <Button  rounded large dark onPress={()=>{

console.log("clicked!!!!!!!!!!")
// Restart();
props.loadApp()
    }}>
          <Text style ={{
               fontFamily: "Quicksand-Bold"}}>Try Again</Text>
        </Button>
    {/* </TouchableOpacity> */}

    

</View>
    
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontFamily: "Quicksand-Bold",
    color: "#000",
    fontSize: 26,
    // marginLeft: 53,
    marginTop: 10,
  },
});
