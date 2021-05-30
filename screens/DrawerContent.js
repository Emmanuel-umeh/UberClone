import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  Switch,
} from "react-native-paper";
import { Button } from "native-base";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Divider, TouchableRipple } from "react-native-paper";

import { connect } from "react-redux";
import { StackActions, NavigationActions } from "react-navigation";
import colors from "./colors/colors";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Linking } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Settings,
  Home,
  User,
  UserCheck,
  Truck,
  DollarSign,
  CreditCard
} from "react-native-feather";

// import{ AuthContext } from '../components/context';

class DrawerContent extends Component {
  render() {
    //   const paperTheme = useTheme();
    const { user } = this.props.auth;
    // console.log("drawer,", user)

    return (
      <View style={{ flex: 1, backgroundColor: colors.black }}>
        <DrawerContentScrollView {...this.props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("profileScreen");
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Avatar.Image
                    source={require("../assets/avatar.png")}
                    style={{
                      backgroundColor: colors.black,
                    }}
                    size={60}
                  />
                  <View style={{ marginLeft: 15, flexDirection: "column" }}>
                    <Title style={styles.title}>
                      {user
                        ? user.first_name.charAt(0).toUpperCase() +
                          user.first_name.slice(1)
                        : "John"}{" "}
                    </Title>
                    <Caption style={styles.caption}>View Profile</Caption>
                  </View>
                </View>
              </TouchableOpacity>

              {/* <View style={styles.row}>
                                <View style={styles.section}>
                                    <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                    <Caption style={styles.caption}>Following</Caption>
                                </View>
                                <View style={styles.section}>
                                    <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                    <Caption style={styles.caption}>Followers</Caption>
                                </View>
                            </View> */}
            </View>

            <Divider
              style={{
                marginTop: 20,
              }}
            />

            <Drawer.Section style={styles.drawerSection}>
              <Animatable.View animation="slideInLeft">
                <DrawerItem
                  icon={({ color, size }) => (
                    <Home
                      fill={colors.black}
                      stroke={colors.white}
                      height={25}
                      width={25}
                    />
                  )}
                  labelStyle={{
                    color: colors.white,
                    fontWeight: "300",
                    fontSize: 17,
                    fontFamily: "Quicksand-Bold",
                  }}
                  label="Home"
                  onPress={() => {
                    this.props.navigation.navigate("Map");
                  }}
                />
              </Animatable.View>
              <DrawerItem
                icon={({ color, size }) => (
                  <User
                    fill={colors.black}
                    stroke={colors.white}
                    height={25}
                    width={25}
                  />
                )}
                labelStyle={{
                  color: colors.white,
                  fontWeight: "300",
                  fontSize: 17,
                  fontFamily: "Quicksand-Bold",
                }}
                label="Profile"
                onPress={() => {
                  this.props.navigation.navigate("profileScreen");
                }}
              />

              <DrawerItem
                icon={({ color, size }) => (
                  <CreditCard height={25} width={25} stroke="white" />
                )}
                labelStyle={{
                  color: colors.white,
                  fontWeight: "300",
                  fontSize: 17,
                  fontFamily: "Quicksand-Bold",
                }}
                label="Payment"
                onPress={() => {
                  this.props.navigation.navigate("add_card");
                }}
              />

              <DrawerItem
                icon={({ color, size }) => (
                  <Truck
                    fill={colors.black}
                    stroke={colors.white}
                    height={25}
                    width={25}
                  />
                )}
                labelStyle={{
                  color: colors.white,

                  fontWeight: "300",
                  fontSize: 17,
                  fontFamily: "Quicksand-Bold",
                }}
                label="Ride History"
                onPress={() => {
                  this.props.navigation.navigate("ride_history");
                }}
              />

              {/* <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="cash" 
                                 color = {colors.white}
                                     size={30}
                                    />
                                )}
                                labelStyle ={{
                                  color: colors.white,
                                    fontWeight : "300",
                          fontSize : 17,
                                    fontFamily : "Quicksand-Bold"
                                }}
                                label="Payment Method"
                                onPress={() => {this.props.navigation.navigate('add_card')}}
                            /> */}

              {/* <DrawerItem 
                            
                                icon={({color, size}) => (
                                    <Icon 
                                    name="bookmark-outline" 
                                 color = {colors.white}
                                     size={30}
                                    />
                                )}
                                label="Bookmarks"
                                onPress={() => {this.props.navigation.navigate('BookmarkScreen')}}
                            /> */}
              <DrawerItem
                icon={({ color, size }) => (
                  <Settings
                    fill={colors.black}
                    stroke={colors.white}
                    height={25}
                    width={25}
                  />
                )}
                labelStyle={{
                  color: colors.white,
                  fontWeight: "300",
                  color: colors.white,
                  fontSize: 17,

                  fontFamily: "Quicksand-Bold",
                }}
                label="Settings"
                onPress={() => {
                  this.props.navigation.navigate("settings");
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <UserCheck
                    fill={colors.black}
                    stroke={colors.white}
                    height={25}
                    width={25}
                  />
                )}
                labelStyle={{
                  color: colors.white,
                  fontWeight: "300",
                  fontSize: 17,
                  color: colors.white,
                  fontFamily: "Quicksand-Bold",
                }}
                label="Support"
                onPress={() => {
                  Linking.openURL("https://www.whiteaxis.ng");
                }}
              />
            </Drawer.Section>
          </View>
        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
          <Button
            onPress={() => {
              Linking.openURL("https://www.whiteaxis.ng");
            }}
            block
            style={{
              backgroundColor: colors.safron,
              borderRadius: 30,
              height: hp(8),
            }}
          >
            <Text
              style={{
                fontFamily: "Quicksand-Bold",
                fontSize: 20,
                color: colors.white,
              }}
            >
              DRIVE & EARN
            </Text>
          </Button>
        </Drawer.Section>
      </View>
    );
  }

  // const { signOut, toggleTheme } = React.useContext(AuthContext);
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(DrawerContent);
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: "bold",
    color: colors.white,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: colors.white,

    fontFamily: "Quicksand-Bold",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: hp(20),
    width: wp(65),
    alignSelf: "center",
    // borderTopColor: '#f4f4f4',
    // borderTopWidth: 1
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
