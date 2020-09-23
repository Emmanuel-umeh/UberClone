import React, { Component } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import OTPTextInput from "react-native-otp-textinput"

class Otp extends Component{

     
   clearText = () => {
    otpInput.clear();
}

  render(){
    
  
    return (
      <View style={styles.container}>
        <View style={styles.rectRow}>
       
              <OTPTextInput ref={e => (otpInput = e)} />
              {/* <Button title="clear" onPress={()=>this.clearText()} /> */}
      
        </View>
  
 
        <View style={styles.loremIpsumStack}>
          <Text style={styles.loremIpsum}>
            Enter the 4-digit otp code{"\n"}sent to you
          </Text>
          <Text style={styles.loremIpsum2}>+2349035342677</Text>
        </View>
        {/* <Text style={styles.resendCodeIn0015}>Resend code in 00:15</Text> */}
      </View>
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect: {
    width: 67,
    height: 67,
    backgroundColor: "#E6E6E6"
  },
  rect1: {
    width: 67,
    height: 67,
    backgroundColor: "#E6E6E6",
    marginLeft: 12
  },
  rect2: {
    width: 67,
    height: 67,
    backgroundColor: "#E6E6E6",
    marginLeft: 17
  },
  rect3: {
    width: 67,
    height: 67,
    backgroundColor: "#E6E6E6",
    marginLeft: 20
  },
  rectRow: {
    height: 67,
    flexDirection: "row",
    marginTop: 260,
    marginLeft: 24,
    marginRight: 19
  },
  loremIpsum: {
    top: 0,
    left: 0,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22
  },
  loremIpsum2: {
    top: 27,
    left: 115,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22
  },
  loremIpsumStack: {
    width: 288,
    height: 54,
    marginTop: -186,
    marginLeft: 24
  },
  resendCodeIn0015: {
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 18,
    fontSize: 22,
    opacity: 0.6,
    marginTop: 175,
    marginLeft: 24
  }
});

export default Otp;
