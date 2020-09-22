import React, { Component } from "react";
import { StyleSheet, View, StatusBar, Text, Image } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import FeatherIcon from "react-native-vector-icons/Feather";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import MaterialIconsIcon from "react-native-vector-icons/MaterialIcons";
import MaterialButtonDark from "../components/MaterialButtonDark";
import MaterialButtonLight from "../components/MaterialButtonLight";

function ProfileScreen(props) {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.ellipseStackStack}>
        <View style={styles.ellipseStack}>
          <Svg viewBox="0 0 316.43 293.78" style={styles.ellipse}>
            <Ellipse
              stroke="rgba(230, 230, 230,1)"
              strokeWidth={0}
              fill="rgba(4,4,4,1)"
              cx={158}
              cy={147}
              rx={158}
              ry={147}
            ></Ellipse>
          </Svg>
          <Svg viewBox="0 0 397.08 316.38" style={styles.ellipse2}>
            <Ellipse
              stroke="rgba(230, 230, 230,1)"
              strokeWidth={0}
              fill="rgba(0,0,0,1)"
              cx={199}
              cy={158}
              rx={199}
              ry={158}
            ></Ellipse>
          </Svg>
          <View gradientImage="Gradient_snvbaMf.png" style={styles.rect}>
            <View style={styles.iconRow}>
              <FeatherIcon name="settings" style={styles.icon}></FeatherIcon>
              <EntypoIcon name="edit" style={styles.icon2}></EntypoIcon>
            </View>
            <Text style={styles.emmanuelUmeh}>Emmanuel Umeh</Text>
            <Text style={styles.loremIpsum}>Emmanuelsumeh@gmail.com</Text>
            <View style={styles.icon4Row}>
              <MaterialCommunityIconsIcon
                name="calendar-multiple-check"
                style={styles.icon4}
              ></MaterialCommunityIconsIcon>
              <Text style={styles.myProjects}>My Projects</Text>
              <IoniconsIcon
                name="md-arrow-forward"
                style={styles.icon8}
              ></IoniconsIcon>
            </View>
            <View style={styles.icon5Row}>
              <EntypoIcon name="bell" style={styles.icon5}></EntypoIcon>
              <Text style={styles.account}>Account</Text>
              <IoniconsIcon
                name="md-arrow-forward"
                style={styles.icon9}
              ></IoniconsIcon>
            </View>
            <View style={styles.icon6Row}>
              <MaterialIconsIcon
                name="help-outline"
                style={styles.icon6}
              ></MaterialIconsIcon>
              <Text style={styles.help}>Help</Text>
              <IoniconsIcon
                name="md-arrow-forward"
                style={styles.icon10}
              ></IoniconsIcon>
            </View>
            <View style={styles.icon7Row}>
              <EntypoIcon name="info" style={styles.icon7}></EntypoIcon>
              <Text style={styles.info}>Info</Text>
              <IoniconsIcon
                name="md-arrow-forward"
                style={styles.icon11}
              ></IoniconsIcon>
            </View>
          </View>
          <Image
            source={require("../assets/images/profileVector3.png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
          <IoniconsIcon
            name="ios-arrow-round-back"
            style={styles.icon12}
          ></IoniconsIcon>
          <Image
            source={require("../assets/images/avatar.png")}
            resizeMode="contain"
            style={styles.image2}
          ></Image>
        </View>
        <MaterialButtonDark
          style={styles.materialButtonDark}
        ></MaterialButtonDark>
        <MaterialButtonLight
          style={styles.materialButtonLight}
        ></MaterialButtonLight>
      </View>
      <EntypoIcon name="arrow-long-left" style={styles.icon3}></EntypoIcon>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)"
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 316,
    height: 294,
    position: "absolute"
  },
  ellipse2: {
    top: 34,
    left: 251,
    width: 397,
    height: 316,
    position: "absolute"
  },
  rect: {
    top: 211,
    width: 349,
    height: 358,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 27,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 0,
    left: 100
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 32,
    height: 32,
    width: 40
  },
  icon2: {
    color: "rgba(0,0,0,1)",
    fontSize: 34,
    height: 37,
    width: 34,
    marginLeft: 235
  },
  iconRow: {
    height: 37,
    flexDirection: "row",
    marginTop: 18,
    marginLeft: 13,
    marginRight: 27
  },
  emmanuelUmeh: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 25,
    marginTop: 41,
    marginLeft: 87
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginLeft: 94
  },
  icon4: {
    color: "rgba(11,11,11,1)",
    fontSize: 25,
    height: 28,
    width: 25
  },
  myProjects: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    marginLeft: 56
  },
  icon8: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 16,
    marginLeft: 84
  },
  icon4Row: {
    height: 28,
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 13,
    marginRight: 37
  },
  icon5: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 25
  },
  account: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    marginLeft: 54
  },
  icon9: {
    color: "rgba(7,7,7,1)",
    fontSize: 25,
    height: 27,
    width: 16,
    marginLeft: 122
  },
  icon5Row: {
    height: 27,
    flexDirection: "row",
    marginTop: 17,
    marginLeft: 13,
    marginRight: 37
  },
  icon6: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 25,
    width: 25,
    marginTop: 2
  },
  help: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    marginLeft: 56,
    marginTop: 2
  },
  icon10: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 17,
    marginLeft: 157
  },
  icon6Row: {
    height: 29,
    flexDirection: "row",
    marginTop: 21,
    marginLeft: 13,
    marginRight: 35
  },
  icon7: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 25
  },
  info: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    marginLeft: 56
  },
  icon11: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 17,
    marginLeft: 164
  },
  icon7Row: {
    height: 27,
    flexDirection: "row",
    marginTop: 26,
    marginLeft: 13,
    marginRight: 35
  },
  image: {
    top: 0,
    left: 276,
    width: 200,
    height: 200,
    position: "absolute"
  },
  icon12: {
    top: 567,
    left: 147,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 70
  },
  image2: {
    top: 147,
    left: 192,
    width: 157,
    height: 134,
    position: "absolute",
    borderRadius: 100
  },
  ellipseStack: {
    top: 0,
    left: 0,
    width: 648,
    height: 643,
    position: "absolute"
  },
  materialButtonDark: {
    height: 49,
    width: 164,
    position: "absolute",
    left: 258,
    top: 577,
    borderRadius: 18
  },
  materialButtonLight: {
    height: 44,
    width: 100,
    position: "absolute",
    left: 120,
    top: 582,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000"
  },
  ellipseStackStack: {
    width: 648,
    height: 643,
    marginTop: -58,
    marginLeft: -94
  },
  icon3: {
    color: "rgba(0,0,0,1)",
    fontSize: 40,
    marginTop: 48,
    marginLeft: -179
  }
});

export default ProfileScreen;
