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
import { useFonts } from '@use-expo/font';
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function Intro2({ navigation }) {
 
  return (
    <View style={styles.container}>



<Animatable.View
       animation = {"slideInLeft"}
      
      >
        <Text style={styles.text}>24 Hour</Text>
      </Animatable.View>


      
<Animatable.View
       animation = {"slideInRight"}
      
      >
        <Text style={styles.text2}>Support Available</Text>
      </Animatable.View>

        

        {/* Clock1 */}
      <View>
        <Animatable.Image
         style={styles.clock1}
          source={require("../../assets/clock1.png")}
             resizeMode="center"
          animation = {"bounceIn"}
        />
      </View>

      {/* Clock2 */}
      <View>
        <Animatable.Image
         style={styles.clock2}
          source={require("../../assets/clock2.png")}
             resizeMode="center"
          animation = {"bounceInRight"}
        />
      </View>


      {/* Clock3 */}
      <View>
        <Animatable.Image
         style={styles.clock3}
          source={require("../../assets/clock3.png")}
             resizeMode="center"
          animation = {"bounceInLeft"}
        />
      </View>


      {/* Clock4 */}
      <View>
        <Animatable.Image
         style={styles.clock4}
          source={require("../../assets/clock4.png")}
             resizeMode="center"
          animation = {"bounceInUp"}
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
export default connect(mapStateToProps, {})(Intro2);

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#000000",
  },
  

  text: {
    position: "absolute",
    width: 116,
    height: 56,
    left: 97,
    top: 124,
    color: "#fff",

    fontFamily: "charm-bold",

    fontStyle: "normal",
    // fontWeight: "bold",
    fontSize: 30,
    lineHeight: 56,
    /* identical to box height */
  },



//   text 2


text2: {
    position: "absolute",
    width: 241,
    height: 56,
    left: 35,
    top: 164,
    
    color: "#fff",

    fontFamily: "charm-bold",

    fontStyle: "normal",
    // fontWeight: "bold",
    fontSize: 30,
    lineHeight: 56,
    /* identical to box height */
  },

  clock1 : {
    position: "absolute",
    width: 91.2,
    height: 88.11,
    left: 66,
    top: 371.09,
  },
  clock2 : {
    position: "absolute",
    width: 91.2,
    height: 88.11,
    left: 202.8,
    top: 368,
  },
  clock3 : {
    position: "absolute",
    width: 91.2,
    height: 88.11,
    left: 107.74,
    top: 490.89,
  },
  clock4 : {
    position: "absolute",
    width: 91.2,
    height: 88.11,
    left: 264.63,
    top: 468.48,
    
  }



});
