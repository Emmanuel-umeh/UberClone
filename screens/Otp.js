import React, { Component } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

import OTPInputView from '@twotalltotems/react-native-otp-input'
 import {connect} from "react-redux"

 import AnimateLoadingButton from 'react-native-animate-loading-button';
 import {textMessageVerify, setLoading} from "../action/authAction"
class Otp extends Component{

     constructor(props){
       super(props)
     }

   clearText = () => {
    otpInput.clear();
}


_onPressHandler=()=> {
  this.loadingButton.showLoading(true);

  // mock
  // setTimeout(() => {
  //   this.loadingButton.showLoading(false);
  // }, 2000);
  // this.mobileNumber()
}

  render(){
    

    const {request_id, phoneNumber}  = this.props.route.params
  
    console.log("params ", this.props.route.params)
    return (
      <View style={styles.container}>
        
<OTPInputView
    style={{width: '80%', height: 200}}
    pinCount={4}
    placeholderTextColor = "#000000"
    // ref={e => (otpInput = e)} 
    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
    // onCodeChanged = {code => { this.setState({code})}}
    autoFocusOnLoad
    codeInputFieldStyle={styles.underlineStyleBase}
    codeInputHighlightStyle={styles.underlineStyleHighLighted}
    onCodeFilled = {(code => {
        console.log(`Code is ${code}, you are good to go!`)
        // this.props.setLoading()
        this._onPressHandler()
        this.props.textMessageVerify(request_id, code, phoneNumber)
    })}
/>
  
 
        <View style={styles.loremIpsumStack}>
          <Text style={styles.loremIpsum}>
            Enter the 4-digit otp code{"\n"}sent to you
          </Text>
  <Text style={styles.loremIpsum2}>{phoneNumber}</Text>
        </View>
        {/* <Text style={styles.resendCodeIn0015}>Resend code in 00:15</Text> */}

        <View style={styles.loremIpsum5Row}>
          <Text style={styles.loremIpsum5}>
            By continuing you may receive an{"\n"}SMS for verification. Message
            and{"\n"}data rates may apply.
          </Text>
          {/* <EntypoIcon
            onPress={() => {
            
              this.mobileNumber();
              
            }}
            name="chevron-with-circle-right"
            style={styles.icon3}
          ></EntypoIcon> */}
        <View  style = {styles.icon3}>
        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={80}
          height={50}
          title="Verify"
         
          titleFontSize={16}
          titleWeight={'100'}
          titleColor="rgb(255,255,255)"
          backgroundColor="#000000"
          borderRadius={30}
          onPress={()=>this._onPressHandler()}
          useNativeDriver = {true}
        />

        </View>
     
      </View>
      </View>
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "center"
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
    borderColor: "#000000",
  },
 
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  icon3: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginLeft: 36,
  },
  loremIpsum5Row: {
    height: 54,
    flexDirection: "row",
    marginTop: 373,
    marginLeft: 24,
    marginRight: 37,
  },
 
  underlineStyleHighLighted: {
    borderColor: "#000000",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {textMessageVerify,setLoading })(
  Otp
);
