import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating, AirbnbRating } from "react-native-ratings";
import { connect } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Textarea } from "native-base";
import { rate_driver } from "../redux/action/orderActions";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import colors from "./colors/colors";

import { firebase } from "../firebase/firebase";
import { Users } from "react-native-feather";
import { Avatar, Divider } from "react-native-paper";

export default function Driver_Rating(props) {
  const questions = [
    { id: 0, question: "Kindly rate your driver's attidude" },
    { id: 1, question: "Kindly rate your driver's dressing" },
    { id: 2, question: "Kindly rate your driver's tone" },
    { id: 3, question: "Kindly rate your driver's neatness" },
    { id: 4, question: "Kindly rate your driver's driving ability" },
    { id: 5, question: "Kindly rate your ride experience" },
    { id: 6, question: "Kindly rate your driver's car neatness" },
    { id: 7, question: "Kindly rate your comfortability" },
  ];

  const [rating, setrating] = useState(3);
  const [review_message, setreview_message] = useState("");
  const [question, setquestion] = useState("");
  const [driver, setdriver] = useState(null);

  const reset_navigation = () => {
    // reset navigation!!
    props.navigation.replace("setLogisticsScreen");
  };

  useEffect(() => {
    const { driver } = props.route.params.param;
    console.log(props.route.params.param)
    firebase.database().ref("drivers/" + driver).once("value", function (snapshot) {
      if (snapshot.exists()) {
        const driver_details = snapshot.val();
        setdriver(driver_details);
      }
    });

    let randomItem = questions[Math.floor(Math.random() * questions.length)];

    setquestion(randomItem.question);
  }, [props.route.params.driver]);

  const submit_review = async() => {

    // firebase
    //   .database()
    //   .ref("reviews/" + props.route.params.param.driver)
    //   .push({
    //     question: question,
    //     review_message: review_message,
    //     rating: rating,
    //     owner: uid,
    //   })
      // .then(() => {
        // reset_navigation();
      // });
      try {
        const api_call =  await firebase.functions().httpsCallable('rateDriver')({
          question: question,
              review_message: review_message,
              rating: rating,
              driver_id : props.route.params.driver
          });
        return  reset_navigation();
      } catch (error) {
        console.log({error})
        reset_navigation();
      }
      
    
  
  };

  const display_driver_details = () => {
  
    if (driver) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {/* <Avatar.Image
            source={{
              uri : driver.profile_picture
            }}
            style={{
              width: 40,
              height: 40,
            }}
          /> */}
          <Image source = {{
            uri : driver.profile_picture
          }}             style={{
            width: 100,
            height: 100,
            borderRadius : 50
          }} />


          <Text style={styles.driver_name}>
            {driver.firstname + " " + driver.lastname}{" "}
          </Text>

        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView centerContent>
        {display_driver_details()}

        
        <Divider style ={{
            height : 1,
            color : "black",
            marginTop : 20
          }} />

        <View
          style={{
            alignItems: "center",
            width: wp(90),
            alignContent: "center",
            alignSelf: "center",
            marginTop : 30
          }}
        >
          {/* <Image style={styles.productImg} source={{uri:"https://image.freepik.com/free-photo/man-driving-car-from-rear-view_1359-494.jpg"}}/> */}
          <Text style={styles.name}>{question}</Text>
          {/* <Text style={styles.name}>Experience</Text> */}
        </View>
        <View style={styles.starContainer}>
          <AirbnbRating
            count={5}
            reviewColor={colors.safron}
            // ratingColor='#3498db'
            selectedColor={colors.safron}
            reviews={["Terrible", "Bad", "Okay", "Good", "Awesome"]}
            defaultRating={3}
            size={wp(10)}
            onFinishRating={(e) => {
              setrating(e);
            }}
          />
          {/* 
    <Rating
    showRating
    type = "custom"
    ratingBackgroundColor = "transparent"
    onFinishRating={this.ratingCompleted}
    
    style={{ paddingVertical: 10,
      
    backgroundColor : "transparent" }}
    imageSize = {wp("15%")}
    minValue = {1}
  /> */}
        </View>

        <View style={{ top: 20 }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: wp(4),
              fontFamily: "Quicksand-Medium",
              alignSelf  : "center",
              paddingLeft : wp(6)
            }}
          >
            Write your comments or complaints below (Optional)
          </Text>

          <Textarea
            rowSpan={5}
            bordered
            style={{
              fontSize: 13,
              fontFamily: "Quicksand-Bold",
              backgroundColor: "whitesmoke",
              width: wp(80),
              alignSelf: "center",
              marginTop: hp(4),
            }}
            onChangeText={(review_message) => {
              setreview_message(review_message);
            }}
            value={review_message}
          />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => submit_review()}
          >
            <Text style={styles.shareButtonText}>Sumbit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  productImg: {
    width: wp("100%"),
    height: hp("40%"),
  },
  name: {
    fontSize: wp(6),
    flexWrap: "wrap",
    color: "black",
    fontFamily: "Quicksand-Bold",
    alignSelf: "center",
  
    marginLeft : 20
  },
  driver_name: {
    fontSize: wp(4),
    flexWrap: "nowrap",
    color: "black",
    fontFamily: "Quicksand-Bold",
    alignSelf: "center",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    color: "#696969",
  },
  star: {
    width: wp(8),
    height: wp(8),
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },

  starContainer: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  contentColors: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  contentSize: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: 20,
    marginHorizontal: 30,
  },
  shareButton: {
    marginTop: 10,
    marginBottom : 30,
    height: hp(8),
    width: wp(80),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    backgroundColor: colors.safron,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: wp(6),
  },
  addToCarContainer: {
    marginHorizontal: 30,
  },
});
