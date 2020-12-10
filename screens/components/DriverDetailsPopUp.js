import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  Platform,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import BottomSheet from "reanimated-bottom-sheet";
import { Rating, AirbnbRating } from "react-native-ratings";
import PaystackWebView from "react-native-paystack-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Body, Button, Icon, Left, Right } from "native-base";
import { Divider } from "react-native-paper";

import { connect } from "react-redux";
import { cashless_payment } from "../../action/orderActions";
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;
class DriverDetailsPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.sheetRef = React.createRef();
    this.paystackbutton = React.createRef(null);
  }

  makeCall = () => {
    const { driver, distance } = this.props;

    console.log("making call function!!!!!!!!!!!!!!", driver);
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${driver.phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${driver.phoneNumber}`;
    }
    console.log({ phoneNumber });
    Linking.openURL(phoneNumber);
  };

  getRandomString = (length) => {
    var randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  };

  renderContent = (
    driver,
    distance,
    order,
    makeCall,
    user,
    getRandomString,
    cashless_payment,
    user_ride_channel
  ) => (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        height: hp("60%"),
      }}
    >
      <View
        style={{
          width: wp("10%"),
          backgroundColor: "#515357",
          padding: 3,
          // left  : wp("40%"),
          alignSelf: "center",
          // height : 2,
          borderRadius: 50,
        }}
      ></View>

      {order.state == "Pending" && (
        <Text style={styles.on_the_way}>Your Ride Is On Its Way</Text>
      )}
      {order.state == "Accepted" && (
        <Text style={styles.on_the_way}>Your Ride Is On Its Way</Text>
      )}

      {order && order.state == "Started" && (
        <Text style={styles.on_the_way}>The Ride Has Begun</Text>
      )}

      {order && order.state == "Ended" && (
        <Text style={styles.on_the_way}>This Ride Has Ended</Text>
      )}

      {/* // "The Ride Has Begun" :
// order && order.state == "Accepted" || "Pending" ? "Your Ride Is On Its Way" : 
//  order && order.state == "Ended" ? "This Ride Has Ended" : order && order.state === "Completed" ? "Ride Has Been Completed" : null}
 */}

      {order && order.state == "Ended" && (
        <>
          <Text style={[styles.on_the_way, {color : "coral"}]}>
            Total Price : ₦
            {this.props.order
              ? Math.round(order.price / 100) * 100
              : "Calculating..."}
          </Text>

          {order.payment_method == "Cashless" && (
            <>
              <PaystackWebView
                buttonText="Pay With Card"
                showPayButton={false}
                paystackKey="pk_test_083d152747bcfd9dfebd3c284dc4d9f63e947863"
                amount={order.price}
                billingEmail={user.email}
                billingMobile={user.phoneNumber}
                billingName={user.firstName + " " + user.lastName}
                ActivityIndicatorColor="yellow"
                SafeAreaViewContainer={{ marginTop: 5 }}
                SafeAreaViewContainerModal={{ marginTop: 5 }}
                handleWebViewMessage={(e) => {
                  // handle the message
                }}
                onCancel={(e) => {
                  // handle response here

                  alert(
                    "Payment Was Cancelled Successfully. Please Ensure to pay the driver"
                  );
                }}
                onSuccess={(res) => {
                  // handle response here
                  const tokens = this.props.auth.token;
                  cashless_payment(tokens, order._id, user_ride_channel);

                  //  console.log("success", res)
                }}
                autoStart={false}
                refNumber={getRandomString(7)} // this is only for cases where you have a reference number generated
                btnStyles={{
                  top: 500,
                  color: "black",
                }}
                //  renderButton={(onPress) => {

                //   <View style={{
                //     top : "50%"
                //   }}>
                //     <Button warning>
                //      Pay Now
                //    </Button>
                //   </View>

                //  }}
                ref={this.paystackbutton}
              />
              <Button
                block
                warning
                onPress={() => this.paystackbutton.current.StartTransaction()}
              >
                <Text
                  style={{
                    fontFamily: "Quicksand-Bold",
                  }}
                >
                  Pay With Card/USSD
                </Text>
              </Button>
            </>
          )}
        </>
      )}

      <Divider />

      {order && order.state != "Ended" && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <View>
            <Image
              style={styles.image}
              source={{
                uri: driver
                  ? driver.profile_picture
                  : "https://www.kindpng.com/picc/m/78-785975_icon-profile-bio-avatar-person-symbol-chat-icon.png",
              }}
            />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                top: 5,
                justifyContent: "center",
              }}
            >
              {/* <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
            <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
            <EntypoIcon name="star" style={styles.icon3}></EntypoIcon> */}

              <AirbnbRating
                count={5}
                reviews={["Terrible", "Bad", "Okay", "Good", "Awesome"]}
                defaultRating={driver.rating ? driver.rating : 3}
                size={14}
                showRating={false}
                isDisabled={true}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.plate_number}>
              {" "}
              {driver ? driver.lisence_number.toUpperCase() : "635-2GS-RB36"}
            </Text>


            {!driver.company && (

            <Text style={styles.rider_name}>
           {driver && driver.firstname.charAt(0).toUpperCase() +
                  driver.firstname.substring(1)} Is On The Way
            </Text>
            )}

            {driver.company && driver.company.company_name &&  (

              <>
            <Text style={styles.rider_name}>
            {driver && driver.firstname.charAt(0).toUpperCase() +
                  driver.firstname.substring(1)} from {driver.company.company_name.charAt(0).toUpperCase() +
                  driver.company.company_name.substring(1)}
          </Text>
              <Text style={styles.rider_name}>
                Is on the way..
             
              </Text>
              </>
            )}

            <Text style={styles.car_color}>
              {driver
                ? driver.vehicle_color.charAt(0).toUpperCase() +
                  driver.vehicle_color.substring(1)
                : "Red"}{" "}
              {driver ? driver.logistic_type : "Car"}
            </Text>

            {(order && order.state == "Accepted") ||
            order.state == "Pending" ? (
              <Text style={styles.meters_away}>
                {distance ? Math.ceil(distance) : "Calculating"} Meters Away
              </Text>
            ) : null}
          </View>
        </View>
      )}
      <Divider style={{ top: hp("4%") }} />

      <View style={{ margin: 20, alignSelf: "center" }}>
        <Text style={styles.rider_name}>Destination</Text>
      </View>

      <Divider />

      <View style={{ flex: 1, flexDirection: "row" }}>
        <Left>
          <EntypoIcon name="location-pin" style={styles.icon1}></EntypoIcon>
        </Left>
        <Body >
          <View >
            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {this.props.order.destination
                ? this.props.order.destination
                : "Fetching Destination..."}
            </Text>
          </View>
        </Body>
        <Right style ={{
          width : 10
        }}>
  {/* <EntypoIcon name="arrow-right" style={styles.icon1}></EntypoIcon> */}
  </Right>
      </View>

      <Divider
        style={{
          top: -10,
        }}
      />
      

      <TouchableOpacity
        onPress={() => {
          // alert("Making call!!!")
          makeCall();
        }}
      >
        <Button
          style={{
            borderRadius: 50,
            width: wp("35%"),
            alignSelf: "center",
            alignItems: "center",
          }}
          iconLeft
          dark
        >
          <Icon style={{ left: -5 }} name="md-call" />
          <Text style={{ color: "white", left: -wp("5") }}>Call Driver</Text>
        </Button>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { driver, distance, user_ride_channel } = this.props;
    const { order } = this.props.order;
    const { user } = this.props.auth;

    // console.log("props recieved to driver details popup ", order)
    return (
      <BottomSheet
        ref={this.sheetRef}
        enabledContentTapInteraction={false}
        enabledBottomInitialAnimation={true}
        snapPoints={[hp("60%"), hp("30%")]}
        borderRadius={50}
        renderContent={() =>
          this.renderContent(
            driver,
            distance,
            order,
            this.makeCall,
            user,
            this.getRandomString,
            this.props.cashless_payment,
            user_ride_channel
          )
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 9,
    marginTop: hp("70%"),
    width: wp("100%"),
    backgroundColor: "transparent",
    position: "absolute",
  },

  on_the_way: {
    padding: 20,
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    alignSelf: "center",
  },

  plate_number: {
    // paddingLeft: wp("10%"),

    alignSelf: "center",
    top: 15,
    fontFamily: "Quicksand-Bold",
    fontSize: 20,
    alignSelf: "center",
  },

  car_color: {
    // paddingLeft : wp("26%"),
    alignSelf: "center",
    top: 10,
  },
  rider_name: {
    // paddingLeft : wp("11%"),
    top: 10,
    fontSize: 15,
    alignSelf: "center",
    fontFamily: "Quicksand-Bold",
  },
  meters_away: {
    // paddingLeft : wp("20%"),
    top: 10,
    alignSelf: "center",
    // fontSize : 13,
    // fontFamily : "Quicksand-Bold",
  },

  icon1: {
    fontSize: 30,
    color: "#ed922b",
    // fontSize : 13,
    // fontFamily : "Quicksand-Bold",
  },
  icon2: {
    fontSize: 30,
    color: "#ed922b",
    // fontSize : 13,
    // fontFamily : "Quicksand-Bold",
  },
  location: {
    // fontSize : 20,
    // color : "#ed922b",
    fontSize: 17,
    fontFamily: "Quicksand-Bold",
  },

  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: wp("10%"),
    marginTop: 10,
  },
  image: {
    width: wp("25%"),
    height: hp("13%"),
    borderRadius: 45,
    borderWidth: 2,
    top: hp("1%"),
    borderColor: "#ebf0f7",
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    borderRadius: 30,
  },

  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "black",
    fontWeight: "bold",
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: "center",
    color: "black",
  },
  followButton: {
    marginTop: 10,
    height: hp("5%"),
    width: wp("35%"),
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  followButtonText: {
    color: "black",
    fontSize: 12,
  },

  cancelButton: {
    marginTop: 10,
    height: hp("4%"),
    width: wp("35%"),
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#db2748",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 12,
  },

  icon3: {
    color: "gold",
    fontSize: 14,
    height: 15,
    width: 14,
  },

  icon3Row: {
    height: 17,
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
    // marginLeft: wp("90%"),
    marginTop: 4,
    // position : "absolute"
  },
  loremIpsum1: {
    fontFamily: "roboto-regular",
    color: "black",
    marginLeft: 7,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { cashless_payment })(
  DriverDetailsPopUp
);
