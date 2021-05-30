import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
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
  CheckBox,
  Icon,
  Right,
  Left,
  Body,
  Title,
  Button,
  Picker,
  Switch,
} from "native-base";

import LottieView from "lottie-react-native";

import { LinearGradient } from "expo-linear-gradient";
import LottieLoader from "react-native-lottie-loader";
import Example from "./Carousel/index";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { loadUser } from "../redux/action/authAction";
import { Divider } from "react-native-paper";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CreditCard, Plus } from "react-native-feather";
class Add_Card extends Component {
  // componentDidMount(){
  //   this.props.loadUser()
  // }
  render() {
    const { user } = this.props.auth;

    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1.5,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            style={{
              height: hp(40),
              width: wp(100),
              alignSelf: "center",
              // marginTop : -hp(7)
            }}
            source={require("../assets/lottie/cards.json")}
            autoPlay
            loop={false}
          />
        </View>

        <View
          style={{
            flex: 2.5,
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontFamily: "Quicksand-Bold",
            }}
          >
            Payment Methods
          </Text>
          <Card
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 20,
              }}
            >
              <View
                style={{
                  paddingLeft: 30,
                }}
              >
                <CreditCard height={25} width={25} stroke="black" />
              </View>
              <Text
                style={{ marginLeft: -wp(50), fontFamily: "Quicksand-Medium" }}
              >
                Cash
              </Text>
              <BouncyCheckbox
                size={25}
                unfillColor="#FFFFFF"
                fillColor="green"
                disableBuiltInState={true}
                isChecked={true}
                iconStyle={{ borderColor: "green" }}
                textStyle={{ fontFamily: "Quicksand-Bold" }}
              />
            </View>

            <Divider
              style={{
                height: 1,
                color: "gray",
                marginTop: 15,
              }}
            />

<TouchableOpacity onPress ={()=>{
  this.props.navigation.navigate("creditCardScreen")
}}>
<View
              style={{
                flexDirection: "row",
                // justifyContent : "space-around",
                paddingTop: 20,
              }}
            >
              <View
                style={{
                  paddingLeft: 30,
                }}
              >
                <Plus height={25} width={25} stroke="black" />
              </View>
              <Text style={{ paddingLeft: 22, fontFamily: "Quicksand-Bold" }}>
                Add payment card
              </Text>
            </View>
</TouchableOpacity>
          
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
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
    fontFamily: "Righteous-Regular",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginTop: hp("1%"),
    marginLeft: 28,
  },
  done: {
    fontFamily: "Righteous-Regular",
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
    fontFamily: "Righteous-Regular",
    color: "#121212",
    fontSize: 18,
  },
  cash1: {
    fontFamily: "Righteous-Regular",
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
    fontFamily: "Righteous-Regular",
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
    fontFamily: "Righteous-Regular",
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
    fontFamily: "Righteous-Regular",
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
