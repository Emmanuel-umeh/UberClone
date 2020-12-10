import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import {Button} from "native-base"

import OTPInputView from '@twotalltotems/react-native-otp-input'
 import {connect} from "react-redux"
 import CountDown from 'react-native-countdown-component';
 

 import AnimateLoadingButton from 'react-native-animate-loading-button';
 import {textMessageVerify, setLoading, textMessageAuth} from "../action/authAction"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class Otp extends Component{

     constructor(props){
       super(props)
     }

   clearText = () => {
    otpInput.clear();
}



state = {
  resendcode : false,
  code : null
}

_onPressHandler=(code)=> {
  const {request_id, phoneNumber}  = this.props.route.params
  this.loadingButton.showLoading(true);

   this.props.textMessageVerify(request_id, code, phoneNumber)
// console.log("value", this.otpInput)
  // mock
  // setTimeout(() => {
  //   this.loadingButton.showLoading(false);
  // }, 2000);
  // this.mobileNumber()
}

resendcode = async()=>{
 await this.props.textMessageAuth(this.props.route.params.phoneNumber)
 alert("OTP has been resent successfully")
}


componentDidUpdate(prevProps){

  console.log("error ", this.props.error.id.length)
  if(this.props.error.id.length > 0){
    this.loadingButton.showLoading(false);
  }
}

  render(){
    

    const {request_id, phoneNumber}  = this.props.route.params

  
    // console.log("params ", this.props.route.params)
    return (
      <View style={styles.container}>

        <ScrollView>
     
        <View style={styles.loremIpsumStack}>
          <Text style={styles.loremIpsum}>
            Enter the 4-digit otp code{"\n"}sent to you
          </Text>
  {/* <Text style={styles.loremIpsum2}>{phoneNumber}</Text> */}
        </View>



<OTPInputView
    style={{width: wp("80%"), height: hp("30%") , color : "black"}}
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
        // this.setState({
        //   code
        // })
        this._onPressHandler(code)
       
    })}
/>
  
 
      

{!this.state.resendcode? 
<>

<Text style={styles.resendCodeIn0015}>Resend code in </Text>
        <CountDown
        until={600}
        timeToShow={['H', 'M', 'S']}
        onFinish={() =>{
          this.setState({
            resendcode : true
          })
        }}
        onPress={() => alert('Please wait for the time to request for a new OTP')}
        size={20}
      />



</> : 
<TouchableOpacity style={{
  marginLeft : wp("35%"),
  width : wp("30%")
}}  onPress ={()=>{
  this.resendcode()
}}>
<Button rounded warning style={{
  width : "100%"
}}>
<Text style={{
  fontSize : 15,
  paddingLeft : 12
}}>Resend OTP</Text>
</Button>

</TouchableOpacity>


}
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
           
      </ScrollView>
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
    marginTop: hp("30%"),
    marginLeft: 24,
    marginRight: 19
  },
  loremIpsum: {
    top: 0,
    left: 0,
    position: "absolute",
     fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 22
  },
  loremIpsum2: {
    top: 27,
    left: 115,
    position: "absolute",
     fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 22
  },
  loremIpsumStack: {
    width: wp("90%"),
    height: 54,
    marginTop: hp("10%"),
    marginLeft: 24
  },
  resendCodeIn0015: {
     fontFamily : "Quicksand-Bold",
    color: "black",
    lineHeight: 30,
    fontSize: 22,
    opacity: 0.6,
    marginTop: 20,
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
    color : "black",
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
    marginTop: hp("20&"),
    marginLeft: 24,
    marginRight: 37,
  },
 
  underlineStyleHighLighted: {
    borderColor: "coral",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {textMessageVerify,setLoading, textMessageAuth })(
  Otp
);
