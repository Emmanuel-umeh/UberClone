import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
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

import { LinearGradient } from "expo-linear-gradient";
import LottieLoader from "react-native-lottie-loader";
import Example from "./Carousel/index";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { loadUser } from "../action/authAction";
import { Divider } from "react-native-paper";
class Add_Card extends Component {
  // componentDidMount(){
  //   this.props.loadUser()
  // }
  render() {
    const { user } = this.props.auth;

    console.log("user", user);
    return (
      <View style={styles.container}>
        <LottieLoader
          visible={this.props.order.is_fetching}
          source={require("../assets/lottie/car.json")}
        />
     <Header style={{
                          backgroundColor : "black",
                          top : hp("2%")
                        }} 
                        androidStatusBarColor = "black"
                        iosBarStyle	= "dark-content"
                        >
          <Left>
            <TouchableOpacity  onPress={() => {
                  this.props.navigation.pop();
                }}>
              <Button
                transparent
               
              >
                <Icon name="arrow-back" />
              </Button>
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{
                fontWeight: "bold",
                marginLeft: wp("1%"),
              }}
            >
              Payment Method
            </Title>
          </Body>
        </Header>
        <View style={styles.rect1Stack}>
          <View style={styles.rect2}>
            <View style={styles.ellipseStackRow}>
              <View style={styles.ellipseStack}>
                <Svg viewBox="0 0 60 60" style={styles.ellipse}>
                  <Ellipse
                    stroke="rgba(230, 230, 230,1)"
                    strokeWidth={0}
                    fill="rgba(238,221,19,1)"
                    cx={30}
                    cy={30}
                    rx={30}
                    ry={30}
                  ></Ellipse>
                </Svg>
                <MaterialCommunityIconsIcon
                  name="cash-multiple"
                  style={styles.icon}
                ></MaterialCommunityIconsIcon>
              </View>
              <TouchableOpacity>
                <View style={styles.cashColumn}>
                  <Text style={styles.cash}>Cash</Text>
                  <Text style={styles.cash1}>Default payment method</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.rect3}>
          {/* <Text style={styles.card}>Card</Text> */}

          {user.card.length > 0 && (
            <>
              {user.card.length > 1 && (
                <View style={{ alignSelf: "center", top :hp("0.3%") }}>
                  <Text style ={{
                    fontWeight : "700"
                  }}>Swipe To Select Card</Text>
                </View>
              )}

              <Example navigation={this.props.navigation} cards={user.card} />
            </>
          )}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("creditCardScreen", {
                from: "add_card",
              });
            }}
          >
            <Card>
              <CardItem>
                {/* <View style={styles.icon2Row}> */}

                <Left>
                  <IoniconsIcon
                    name="ios-add"
                    style={styles.icon2}
                  ></IoniconsIcon>
                </Left>

                <Body>
                  <Text style={styles.addCard}>Add card</Text>
                </Body>

                {/* </View> */}
              </CardItem>
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(243,240,240,1)",
  },
  rect1: {
    top: 0,
    left: 0,
    width: wp("100%"),
    height: hp("5%"),
    position: "absolute",
    backgroundColor: "black",
  },
  paymentMethod: {
                 fontFamily : "Righteous-Regular",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginTop: hp("1%"),
    marginLeft: 28,
  },
  done: {
                 fontFamily : "Righteous-Regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginTop: -88,
    marginLeft: wp("90%"),
  },
  rect2: {
    top: hp("5%"),
    width: wp("90%"),
    height: 72,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    left: 28,
    borderRadius: 15,
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    position: "absolute",
  },
  icon: {
    top: 3,
    left: 9,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 45,
    width: 40,
  },
  ellipseStack: {
    width: 60,
    height: 60,
  },
  cash: {
                 fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize: 18,
  },
  cash1: {
                 fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize: 14,
    opacity: 0.44,
    marginTop: 4,
  },
  cashColumn: {
    width: wp("50%"),
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 9,
  },
  ellipseStackRow: {
    height: 60,
    flexDirection: "row",
    marginTop: 6,
    marginLeft: 15,
    marginRight: 71,
  },
  rect1Stack: {
    width: wp("100%"),
    height: hp("25%"),
    marginLeft: -10,
  },
  rect3: {
    width: wp("90%"),
    height: hp("60%"),
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 15,
    marginTop: 0,
    marginLeft: wp("5%"),
  },
  card: {
                 fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize: 18,
    marginTop: 27,
    marginLeft: 35,
  },
  icon2: {
    color: "rgba(0,0,0,1)",
    fontSize: 32,
    height: 35,
    width: 16,
  },
  addCard: {
                 fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize: 17,
    marginLeft: -wp("10%"),
    marginTop: 9,
  },
  icon2Row: {
    height: 35,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 44,
    marginRight: wp("40%"),
  },

  rect: {
    width: wp("90%"),
    height: hp("30%"),
    backgroundColor: "rgba(244,180,61,1)",
    borderRadius: 200,
    marginTop: 10,
    alignSelf: "center",
  },
  eWallet: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    letterSpacing: 3,
    marginTop: 29,
    marginLeft: 24,
  },
  currentAccount: {
                 fontFamily : "Righteous-Regular",
    color: "rgba(255,255,255,1)",
    marginTop: 28,
    fontSize: 20,
    marginLeft: 24,
  },
  n70000: {
    fontFamily: "roboto-700",
    color: "rgba(253,253,253,1)",
    fontSize: 20,
    letterSpacing: 1,
    marginTop: 30,
    marginLeft: wp("65%"),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, { loadUser })(Add_Card);
