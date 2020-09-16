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
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
function Splash1({ navigation }) {
  return (
    <View style={styles.container}>
      


    <View  style={styles.line}>
    <Image
         
          source={require("../assets/LineVector.png")}
        //    resizeMode="center"
        />

    </View>
  
        <Image
          style={styles.dot1}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          resizeMode="center"
        />
        <Image
          style={styles.dot2}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />
        <Image
          style={styles.dot3}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />
        <Image
          style={styles.dot4}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />
        <Image
          style={styles.dot5}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />
        <Image
          style={styles.dot6}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />

        <Image
          style={styles.dot7}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />

        <Image
          style={styles.dot8}
          source={require("../assets/dot.png")}
          //  style={styles.line}
          //  resizeMode="center"
        />

        {/* dot */}
        <Image
          style={styles.dot}
          source={require("../assets/dot.png")}
          style={styles.line}
          resizeMode="center"
        />



<View>
    <Text  style= {styles.text}>
        Welcome To White Axis
    </Text>
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
export default connect(mapStateToProps, {})(Splash1);

const { height, width } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  line: {
    position: "absolute",
    left: "21.74%",
    right: "21.8%",
    top: 310,
    bottom: "54.11%",

    // top : height_logo
    // left: 20,
    // top: 50,
    // border: "3px solid #FFFFFF"
  },

  dot1: {
    position: "absolute",
    width: 6,
    height: 5,
    left: 102,
    top: 307,
  },

  dot2: {
    position: "absolute",
    width: 6,
    height: 6,
    left: 174,
    top: 303,
  },

  dot3: {
    position: "absolute",
    width: 7,
    height: 6,
    left: 207,
    top: 301,
  },

  dot4: {
    position: "absolute",
    width: 6,
    height: 5,
    left: 279,
    top: 299,
  },

  dot5: {
    position: "absolute",
    width: 6,
    height: 6,
    left: 137,
    top: 332,
  },

  dot6: {
    position: "absolute",
    width: 7,
    height: 6,
    left: 180,
    top: 340,
  },

  dot7: {
    position: "absolute",
    width: 6,
    height: 6,
    left: 221,
    top: 346,
  },

  dot8: {
    position: "absolute",
    width: 6,
    height: 5,
    left: 273,
    top: 340,
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

fontFamily: "charm-bold",

fontStyle: "normal",
fontWeight: "bold",
fontSize: 36,
lineHeight: 56
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
