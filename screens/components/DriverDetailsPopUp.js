import React, { useRef, useState, useEffect } from "react";
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
import { Body, Button, Icon, Left, Right, ListItem, List, Switch } from "native-base";
import { Divider } from "react-native-paper";

import LottieView from 'lottie-react-native';
import { connect } from "react-redux";
import { cashless_payment } from "../../redux/action/orderActions";
import uuid from 'react-native-uuid';
import {firebase} from "../../firebase/firebase"
import { useSelector} from "react-redux" 
const TouchableOpacity =
  Platform.OS === "ios"
    ? require("react-native").TouchableOpacity
    : require("react-native-gesture-handler").TouchableOpacity;

    
   const DriverDetailsPopUp = (props) => {

      const sheetRef = useRef();
      const paystackbutton = useRef();

      const {user} = useSelector(state => state.auth)
      

      // details of the driver
      const [driver_details, set_driver_driver_details] = useState(null)
      const [payment_successful, setpayment_successful] = useState(false)
      useEffect(() => {
        firebase.database().ref("drivers/"+props.driver).once("value", function(snapshot){
          if(snapshot.exists()){

            console.log("driver details  from popup!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ", driver_details )

            set_driver_driver_details(snapshot.val())
          }else{
            console.log("snapshot did not ezist!!!!!!!!!!!!!")
          }
        })
        
     
      }, [props.driver])

      
      const makeCall = () => {
    
        console.log("making call function!!!!!!!!!!!!!!", driver_details);
        let phoneNumber = "";
    
        if (Platform.OS === "android") {
          phoneNumber = `tel:${driver_details.phone_number}`;
        } else {
          phoneNumber = `telprompt:${driver_details.phone_number}`;
        }
        console.log({ phoneNumber });
        Linking.openURL(phoneNumber);
      };


      
  const getRandomString = (length) => {
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

 const renderContent = (
    driver,
    current_order
  ) => (
    <View
      style={{
        backgroundColor: "white",
        padding: 16,
        height: hp("60%"),
      }}
    >

      {current_order ? 
      <>
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

      {current_order.state == "Pending" && (
        <Text style={styles.on_the_way}>Your Ride Is On Its Way</Text>
      )}
  
      {current_order.state == "Accepted" && (
        <Text style={styles.on_the_way}>Your Ride Is On Its Way</Text>
      )}
          {current_order.state == "Arrived" && (
        <Text style={styles.on_the_way}>Your Ride Has Arrived</Text>
      )}

      {current_order && current_order.state == "Started" && (
        <Text style={styles.on_the_way}>The Ride Has Begun</Text>
      )}

      {current_order && current_order.state == "Ended" && !payment_successful && (
        <Text style={styles.on_the_way}>This Ride Has Ended</Text>
      )}

      {/* // "The Ride Has Begun" :
// order && order.state == "Accepted" || "Pending" ? "Your Ride Is On Its Way" : 
//  order && order.state == "Ended" ? "This Ride Has Ended" : order && order.state === "Completed" ? "Ride Has Been Completed" : null}
 */}

      {current_order && current_order.state == "Ended" && !payment_successful &&(
        <>
          <Text style={[styles.on_the_way, {color : "coral"}]}>
            Total Price : ₦
            {current_order.price ? current_order.price : 1000 }
          </Text>

          {current_order.payment_method === "Card" && (
            <>
              <PaystackWebView
                buttonText="Pay With Card"
                showPayButton={false}
                paystackKey="pk_test_083d152747bcfd9dfebd3c284dc4d9f63e947863"
                amount={current_order.price}
                billingEmail={user.email}
                billingMobile={user.phone_number}
                billingName={user.first_name + " " + user.last_name}
                ActivityIndicatorColor="yellow"
                SafeAreaViewContainer={{ marginTop: 5 }}
                SafeAreaViewContainerModal={{ marginTop: 5 }}
                handleWebViewMessage={(e) => {
                  // handle the message
                }}
                onCancel={(e) => {
                  // handle response here

                  alert(
                    "Payment was cancelled. Please ensure to pay the driver"
                  );
                }}
                onSuccess={(res) => {
                  // handle response here
                  
                  firebase.database().ref("orders/"+  current_order.key).update({
                    payment_status : true
                  })
                setpayment_successful(true)
                 
                  //  console.log("success", res)
                }}
                autoStart={false}
                refNumber={uuid.v4()} // this is only for cases where you have a reference number generated
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
                ref={paystackbutton}
              />
              <Button
                block
                warning
                style ={{
                  top : -hp("17%")
                }}
                onPress={() => paystackbutton.current.StartTransaction()}
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

      
{ payment_successful &&  ( 
  <>
        <Text style={styles.on_the_way}>Paid Successfully!</Text>
        <Divider />

        
  <LottieView
          // style = {styles.image}
          // height = {600}
          
        
          // imageAssetsFolder={'lottie/animation_1'}
          source={require("../../assets/lottie/tick.json")}
          autoPlay 
          loop = {false}
        /> 
        </>



      )}

        


      <Divider style ={{
        height : 1,
        top : -5
      }} />

      {current_order && current_order.state !== "Ended" && (
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
                uri: driver_details
                  ? driver_details.profile_picture
                  : "https://www.kindpng.com/picc/m/78-785975_icon-profile-bio-avatar-person-symbol-chat-icon.png",
              }}
            />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                top: hp("1.5"),
                justifyContent: "center",
              }}
            >
              {/* <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
            <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
            <EntypoIcon name="star" style={styles.icon3}></EntypoIcon> */}

              <AirbnbRating
                count={5}
                reviews={["Terrible", "Bad", "Okay", "Good", "Awesome"]}
                defaultRating={driver_details.rating ? driver_details.rating : 3}
                size={14}
                showRating={false}
                isDisabled={true}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.plate_number}>
              {" "}
              {driver_details ? driver_details.lisence_number.toUpperCase() : "No Plate Number"}
            </Text>


            {!driver_details.company && (

            <Text style={styles.rider_name}>
           {driver_details && driver_details.firstname.charAt(0).toUpperCase() +
                  driver_details.firstname.substring(1)} Is On The Way
            </Text>
            )}

            {driver_details.company && driver_details.company.company_name &&  (

              <>
            <Text style={styles.rider_name}>
            {driver_details && driver_details.firstname.charAt(0).toUpperCase() +
                  driver_details.firstname.substring(1)} from {driver_details.company.company_name.charAt(0).toUpperCase() +
                  driver_details.company.company_name.substring(1)}
          </Text>
              <Text style={styles.rider_name}>
                Is on the way..
             
              </Text>
              </>
            )}

            <Text style={styles.car_color}>
              {driver_details
                ? driver_details.vehicle_color.charAt(0).toUpperCase() +
                  driver_details.vehicle_color.substring(1)
                : "Red"}{" "}
              {driver_details ? driver_details.logistic_type : "Car"}
            </Text>

            {(current_order && current_order.state === "Accepted") ||
            current_order.state === "Pending" ? (
              <Text style={styles.meters_away}>
                {Number(current_order.diff_in_minute_pickup)>0 ? `${current_order.diff_in_minute_pickup} minutes away` : "Driver is around you "} 
              </Text>
            ) : null}
          </View>
          {/* <Divider /> */}
        </View>
      )}
 


{ current_order.state !== "Ended" &&
<>

      <View style={{ margin: hp("4"), alignSelf: "center" }}>
      
        <Text style={styles.rider_name}>Destination</Text>
        <Divider />
      </View>

      <Divider />

       <ListItem icon >
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
              {current_order.dropoff
                ? current_order.dropoff.going_address
                : "Fetching Destination..."}
            </Text>
          </View>
        </Body>
     
      </ListItem>

      </>
}



      <TouchableOpacity

      style ={{
        marginTop : hp("4")
      }}
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
  
  
  </> :
  <View style ={{flex : 1}}>
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


        <View style ={{top : hp("35%")}}>


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

        
        </View>}
  
    </View>
  );



  const { driver, current_order } = props;


      return (
        <BottomSheet
        ref={sheetRef}
        enabledContentTapInteraction={false}
        enabledBottomInitialAnimation={true}
        snapPoints={[hp("60%"), hp("20%")]}
        initialSnap ={0}
        borderRadius={50}
        renderContent={() =>{

          if(driver_details){
          return  renderContent(
              driver,
              current_order
            )
          }else{
            return null
          }
        }

       
        
        }
      />
      )
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
export default DriverDetailsPopUp
