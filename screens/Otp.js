import React, { Component } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import OTPInputView from '@twotalltotems/react-native-otp-input'
 
class Otp extends Component{

     
   clearText = () => {
    otpInput.clear();
}

  render(){
    
  
    return (
      <View style={styles.container}>
        
<OTPInputView
    style={{width: '80%', height: 200}}
    pinCount={4}
    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
    // onCodeChanged = {code => { this.setState({code})}}
    autoFocusOnLoad
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeFilled = {(code => {
        console.log(`Code is ${code}, you are good to go!`)
    })}
/>
  
 
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
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },
 
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
 
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
 
  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default Otp;
