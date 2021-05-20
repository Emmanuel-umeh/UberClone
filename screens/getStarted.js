import React, { Component } from "react";
import { StyleSheet, View, Text,Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import {connect} from "react-redux"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import LottieView from 'lottie-react-native';
import { TouchableOpacity } from "react-native";
// import {  } from "react-native-gesture-handler";

function getStarted({navigation}) {
  return (
    <Animatable.View 
    animation = "bounceIn"
    style={styles.container}>

      <ScrollView>


      
        <View style = {styles.line}>
            <LottieView
          style = {{
            height : 200,
            width : 200
          }}
           source={require("../assets/lottie/get_started.json")}
         
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


      <Text style={styles.moveSafely}>The Better Way</Text>

      
      <TouchableOpacity  onPress ={()=>{
            navigation.navigate("nameScreen")
          }}>

      <View style={styles.rect}>
 
  
        <Animatable.View 
        animation = "fadeInUp"
        style={styles.getStartedRow}>
          <Text style={styles.getStarted}>Get Started</Text>
          <Icon onPress ={()=>{
            navigation.navigate("nameScreen")
          }} name="md-arrow-forward" style={styles.icon}></Icon>
        </Animatable.View>
     
      </View>

                 
      </TouchableOpacity>
       
      </ScrollView>
   </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  moveSafely: {
   fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 40,
    marginTop: hp(55),
    alignSelf: "center"
  },
  rect: {
    width: wp("70%"),
    height: 61,
    backgroundColor: "rgba(0,0,0,1)",
    flexDirection: "row",
    marginTop: 155,
    marginLeft: wp("15%")
  },
  getStarted: {
   fontFamily : "Quicksand-Bold",
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
    marginLeft: wp("10%"),
    marginTop: 4
  },
  line: {
    position: "absolute",
    // left: wp(10),
    // right: "13.54%",
    top: hp(20),
    // bottom: " 58.17%",
  },

});


const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(getStarted);