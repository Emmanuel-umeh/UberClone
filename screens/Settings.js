import React, { Component, useState } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import {
  Briefcase,
  Trash2,
  DollarSign,
  Bell,
  BookOpen,
  HelpCircle,
  LogOut,
  Lock,
  CreditCard,
} from "react-native-feather";

import { FontAwesome5, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Right,
  Left,
  Body,
  Title,
  Button,
  Picker,
  Switch,
} from "native-base";

// import {notifications_allowed} from "../redux/action/authAction"
import * as Linking from "expo-linking";

import { StatusBar } from "expo-status-bar";
import { firebase } from "../firebase/firebase";
import colors from "./colors/colors";

import { useTheme, Avatar, Divider } from "react-native-paper";

export default function Settings(props) {
  const { user } = useSelector((state) => state.auth);

  const [notification, setnotification] = useState(
    user.notification_allowed ? true : false
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            padding: hp(2),

            paddingLeft: hp(3),
          }}
        >
          <Text
            style={{
              color: "black",
              fontFamily: "Quicksand-Bold",

              fontSize: 40,
            }}
          >
            Settings
          </Text>
        </View>
        <View style={styles.card1}>
          <Avatar.Image
            source={require("../assets/avatar.png")}
            size={wp(23)}
            resizeMode="cover"
            style={styles.imageUser}
          />

          <TouchableOpacity
            onPress={() => {
              props.navigation.replace("Account");
            }}
            style={{
              flex: 1,
            }}
          >
            <Text style={styles.name}>
              {user.first_name.toUpperCase()} {user.last_name.toUpperCase()}{" "}
              <FontAwesomeIcon
                name="chevron-right"
                style={styles.icon5}
              ></FontAwesomeIcon>
            </Text>
            {/* <Text style={[styles.name, {
              fontSize : 15
            }]}>{user.logistic_type} Driver</Text> */}
          </TouchableOpacity>
        </View>

        {/* <Header /> */}

        <Content>
          <View style={styles.component}>
            <Bell height={30} width={30} fill="white" stroke={colors.safron} />
            <Text style={styles.label}>Notifications</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <Switch
                thumbColor={notification ? colors.safron : "grey"}
                trackColor={{ true: "whitesmoke", false: "grey" }}
                value={notification}
                onValueChange={async () => {
                  setnotification((notification) => !notification);

                  //  console.log({user})
                  firebase
                    .database()
                    .ref("users/" + firebase.auth().currentUser.uid)
                    .update({
                      notification: notification ? true : false,
                    });
                }}
              />
            </Right>
          </View>
          {/* <TouchableOpacity style = {styles.component}>

  <Mail   height = {30} width = {30}
    fill = "white" stroke = {colors.safron} />
    <Text style ={styles.label}>Email</Text>
    <Right style={{
        left : 20
    }}>
      <FontAwesomeIcon
              name="chevron-right"
              style={{
                color : colors.white,
                fontSize : wp(4),
                paddingEnd : wp(5)
              }}
            ></FontAwesomeIcon>
    </Right>


</TouchableOpacity> */}

          <Divider
            style={{
              backgroundColor: colors.black,
              height: 1,
              width: wp(90),
              alignSelf: "center",
            }}
          />

          <TouchableOpacity
            style={styles.component}
            onPress={() => {
              props.navigation.navigate("profileScreen");
            }}
          >
            <Lock height={30} width={30} fill="white" stroke={colors.safron} />
            <Text style={styles.label}>Profile</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <FontAwesomeIcon
                name="chevron-right"
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  paddingEnd: wp(5),
                }}
              ></FontAwesomeIcon>
            </Right>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.component}
            onPress={() => {
              // alert("Coming soon...")
              props.navigation.navigate("add_card");
            }}
          >
            <CreditCard
              height={30}
              width={30}
              fill="white"
              stroke={colors.safron}
            />
            {/* <FontAwesome5 name = "credit-card" siz /> */}
            <Text style={styles.label}>My Cards</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <FontAwesomeIcon
                name="chevron-right"
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  paddingEnd: wp(5),
                }}
              ></FontAwesomeIcon>
            </Right>
          </TouchableOpacity>

          <Divider
            style={{
              backgroundColor: colors.black,
              height: 1,
              width: wp(90),
              alignSelf: "center",
            }}
          />

          <TouchableOpacity
            style={styles.component}
            onPress={() => {
              //  this.props.navigation.navigate("Contact Us")
              Linking.openURL("http://whiteaxis.ng");
            }}
          >
            <Bell height={30} width={30} fill="white" stroke={colors.safron} />
            <Text style={styles.label}>Privacy</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <FontAwesomeIcon
                name="chevron-right"
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  paddingEnd: wp(5),
                }}
              ></FontAwesomeIcon>
            </Right>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.component}
            onPress={() => {
              //  this.props.navigation.navigate("Contact Us")
              Linking.openURL("http://whiteaxis.ng");
            }}
          >
            <Briefcase
              height={30}
              width={30}
              fill="white"
              stroke={colors.safron}
            />
            <Text style={styles.label}>Terms & Agreement</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <FontAwesomeIcon
                name="chevron-right"
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  paddingEnd: wp(5),
                }}
              ></FontAwesomeIcon>
            </Right>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              //  this.props.navigation.navigate("Contact Us")
              Linking.openURL("http://whiteaxis.ng");
            }}
            style={styles.component}
          >
            <HelpCircle
              height={30}
              width={30}
              fill="white"
              stroke={colors.safron}
            />
            <Text style={styles.label}>Contact Us</Text>
            <Right
              style={{
                left: 20,
              }}
            >
              {/* <Icon name="arrow-forward" /> */}
              <FontAwesomeIcon
                name="chevron-right"
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  paddingEnd: wp(5),
                }}
              ></FontAwesomeIcon>
            </Right>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.logoutContainer}
            onPress={() => {
              // alert("Logging out")
              // props.logout()
              firebase
                .auth()
                .signOut()
                .then(() => console.log("User signed out!"));
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LogOut width={20} height={20} stroke="white" />
              <Text style={styles.logOut}> Log out</Text>
            </View>
          </TouchableOpacity> */}
        </Content>
        {/* </Container> */}

        {/* <View style={styles.materialCardWithImageAndTitle8Stack}>
          <MaterialCardWithImageAndTitle8
            style={styles.materialCardWithImageAndTitle8}
          ></MaterialCardWithImageAndTitle8>
          <MaterialSwitch style={styles.materialSwitch}></MaterialSwitch>
          <FontAwesomeIcon
            name="chevron-right"
            style={styles.icon}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            name="chevron-right"
            style={styles.icon1}
          ></FontAwesomeIcon>
       
       
        </View> */}

        {/* <View style={styles.materialCardWithImageAndTitle9Stack}>
      <MaterialCardWithImageAndTitle9
        style={styles.materialCardWithImageAndTitle9}
      ></MaterialCardWithImageAndTitle9>
      <FontAwesomeIcon
        name="chevron-right"
        style={styles.icon2}
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        name="chevron-right"
        style={styles.icon3}
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        name="chevron-right"
        style={styles.icon4}
      ></FontAwesomeIcon>
    </View> */}
        {/* <CupertinoButtonWarning6
  
      style={styles.cupertinoButtonWarning6}
    ></CupertinoButtonWarning6> */}
      </ScrollView>

      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#1e1e1e",
  },
  component: {
    flex: 1,
    flexDirection: "row",
    padding: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 35,
  },
  label: {
    paddingLeft: 10,
    paddingTop: 3,
    fontFamily: "Quicksand-Bold",
    color: "black",
  },
  materialCardWithImageAndTitle9: {
    height: hp(30),
    width: wp(100),
    position: "relative",
    left: 0,
    top: 0,
  },
  icon2: {
    top: 23,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23,
  },
  icon3: {
    top: 58,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23,
  },
  icon4: {
    top: 95,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23,
  },
  materialCardWithImageAndTitle9Stack: {
    width: wp("100%"),
    height: hp("20%"),
    marginTop: 20,
    marginLeft: 1,
  },
  materialCardWithImageAndTitle8: {
    height: hp("20%"),
    width: wp("100%"),
    position: "relative",
    left: 22,
    top: 10,
  },
  materialSwitch: {
    width: 45,
    height: 23,
    position: "absolute",
    left: wp("95%"),
    top: 286,
    backgroundColor: "rgba(255,255,255,1)",
  },
  icon: {
    top: hp("40%"),
    left: wp("99%"),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23,
  },
  icon1: {
    top: 360,
    left: wp("100%"),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23,
  },
  image: {
    top: -30,
    left: 0,
    width: wp("30%"),
    height: wp("30%"),
    position: "absolute",
  },

  imageUser: {
    width: wp(22),
    height: hp(12),
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    backgroundColor: "black",
  },
  rect2: {
    top: Platform.OS === "ios" ? 20 : StatusBar.HEIGHT,
    left: 0,
    width: wp("100%"),
    height: hp("20%"),
    position: "relative",
    backgroundColor: "rgba(47,46,46,1)",
    flexDirection: "row",
  },
  icon6: {
    color: "rgba(238,221,19,1)",
    fontSize: 29,
    height: 29,
    width: 21,
    marginTop: 1,
  },
  settings: {
    fontFamily: "Quicksand-Bold",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginLeft: 10,
  },
  icon6Row: {
    height: 31,
    flexDirection: "row",
    flex: 1,
    marginRight: wp("60%"),
    marginLeft: 13,
    marginTop: 60,
  },
  materialCardWithImageAndTitle8Stack: {
    top: 0,
    left: 0,
    width: wp("100%"),
    height: hp("30%"),
    // position: "relative"
  },
  rect: {
    top: 20,
    left: 0,
    width: wp("100%"),
    height: hp("15%"),
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    flexDirection: "row",
  },
  name: {
    fontFamily: "Quicksand-Bold",
    color: "black",
    marginTop: hp(4),
    fontSize: 20,
    marginLeft: wp(6),
  },
  icon5: {
    color: colors.black,
    fontSize: 15,
    marginTop: 20,
  },
  chineduChideraRow: {
    height: 24,
    flexDirection: "row",
    flex: 1,
    marginRight: 6,
    marginLeft: 105,
    marginTop: 35,
  },
  materialCardWithImageAndTitle8StackStack: {
    width: wp(50),
    height: hp("40%"),
  },
  settings1: {
    fontFamily: "Quicksand-Bold",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginLeft: 53,
    marginTop: 60,
  },
  card1: {
    height: hp(20),
    flexDirection: "row",
    marginTop: hp(1),
    marginLeft: 0,
    marginRight: 0,
    padding: hp(2),
    paddingLeft: hp(3),
  },
  cupertinoButtonWarning6: {
    height: hp(7),
    width: wp("80%"),
    borderRadius: 100,
    marginTop: hp("10%"),
    // marginLeft: wp("30%")
    alignSelf: "center",
  },
  logoutContainer: {
    backgroundColor: colors.safron,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 30,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 10,
    width: wp(60),
    height: hp(6),
  },
  logOut: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    // marginTop : -2,
    fontSize: 17,
  },
});
