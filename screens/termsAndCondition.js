import React, { Component } from "react";
import { StyleSheet, View, Text, CheckBox,Image } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable"
// import { NavigationContainer } from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import { ScrollView } from "react-native-gesture-handler";
import store from "../redux/store";
function TermsAndCondition({navigation}) {
    // console.log(navigation)
  return (
 
    <Animatable.View 
    animation = "fadeInUpBig"
    style={styles.container}>

      <ScrollView>

     
      <Svg viewBox="0 0 146.37 144.76" style={styles.ellipse}>
        {/* <Ellipse
          stroke="rgba(230, 230, 230,1)"
          strokeWidth={0}
          fill="rgba(230, 230, 230,1)"
          cx={73}
          cy={72}
          rx={73}
          ry={72}
        >






        </Ellipse> */}

        
<Image
  style={styles.image}
  source={{
    uri:
     "https://image.freepik.com/free-vector/business-people-signed-contract-concept-character-with-agreement-checking-corporate-document-data-protection-terms-conditions-privacy-policy_269730-59.jpg",
  }} resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
/>
      </Svg>

      <View style={styles.loremIpsumRow}>
        <Text style={styles.loremIpsum}>
          Check the box to indicate you{"\n"}are at least 18 years of age,{"\n"}
          agree to the Terms &amp;{"\n"}Conditions and acknowledge{"\n"}the
          Privacy Policy
        </Text>
        <CheckBox style={styles.rect}></CheckBox>
      </View>
      <Icon onPress ={()=>{
          
        //   navigation.pop()
          // navigation.navigate("setLogisticsScreen")
          store.dispatch({
            type : "IS_AUTHENTICATED"
          })
      }} name="chevron-with-circle-right" style={styles.icon1}></Icon>
       </ScrollView>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ellipse: {
    width: 146,
    height: 145,
    marginTop: 147,
    alignSelf: "center"
  },
  loremIpsum: {
    fontFamily : "Quicksand-Bold",
    color: "rgba(0,0,0,1)",
    fontSize: 20
  },
  rect: {
    width: 27,
    height: 29,
    // backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 5,
    marginLeft: 32,
    marginTop: 31
  },
  loremIpsumRow: {
    height: 120,
    flexDirection: "row",
    marginTop: 78,
    marginLeft: 21,
    marginRight: 20
  },
  icon1: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginTop: "20%",
    marginLeft: 281
  },
  image: {
      width: 150,
      height: 150,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 75,
    },

});

export default TermsAndCondition;
