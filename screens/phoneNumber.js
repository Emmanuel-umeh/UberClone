import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import {connect} from "react-redux"
import {textMessageAuth, setLoading} from "../action/authAction"
import AnimateLoadingButton from 'react-native-animate-loading-button';
class PhoneNumber extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    number: null,
  };

  _onPressHandler() {
    this.loadingButton.showLoading(true);

    // mock
    // setTimeout(() => {
    //   this.loadingButton.showLoading(false);
    // }, 2000);
    this.mobileNumber()
  }

  concatNumber=async(phoneNumber)=>{
  
    var number = "+234" + phoneNumber

    // console.log("concat number ", number)
    // this.props.setLoading()
    const result = await this.props.textMessageAuth(number)

    // console.log({result})
    // this.props.navigation.navigate("otp")

  }

  mobileNumber = () => {

    if(!this.state.number ||  this.state.number.length < 10||  this.state.number.length > 11){
      this.loadingButton.showLoading(false);
      return alert("Please enter a valid phone number")
     
     }
 

    "all zeros ? !",/^\d+$/.test(this.state.number.toString() ? 
    
    this.concatNumber(this.state.number)
    : 
    alert("Please Enter Just Numbers")
    ) 
  };
  render() {
    // console.log("number", this.state.number);
    // console.log("endpoint details ", this.props.auth)
   
    return (
      <Animatable.View animation="slideInUp" style={styles.container}>
        <Text style={styles.loremIpsum}>Enter your mobile number</Text>
        <View style={styles.rect}></View>
        <View style={styles.loremIpsum2Row}>
          <Text style={styles.loremIpsum2}>+234</Text>
          <TextInput
            onChangeText={(e) => {
              this.setState({
                number: e,
              });

             
              // console.log("value ", e)
            }}
             placeholderTextColor = "#000000"
            keyboardType="number-pad"
            maxLength={11}
            placeholder="phone number"
            style={styles.loremIpsum3}
          ></TextInput>
        </View>
        <View style={styles.iconRow}>
          <IoniconsIcon
            name="ios-arrow-back"
            style={styles.icon}
          ></IoniconsIcon>
          <Text
            style={styles.back}
            onPress={() => {
              this.props.navigation.pop();
            }}
          >
            Back
          </Text>
        </View>
        <View style={styles.group}>
          <View style={styles.loremIpsum4Row}>
            {/* <Text style={styles.loremIpsum4}>or connect with social</Text> */}
            {/* <IoniconsIcon
              name="md-arrow-round-forward"
              style={styles.icon2}
            ></IoniconsIcon> */}
          </View>
        </View>
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
          onPress={this._onPressHandler.bind(this)}
          useNativeDriver = {true}
        />

        </View>

        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginTop: 123,
    marginLeft: 24,
  },
  rect: {
    width: 199,
    height: 1,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 62,
    marginLeft: 123,
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    lineHeight: 22,
    fontSize: 22,
    marginTop: 4,
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    opacity: 0.19,
    marginLeft: 13,
  },
  loremIpsum2Row: {
    height: 27,
    flexDirection: "row",
    marginTop: -28,
    marginLeft: 61,
    marginRight: 113,
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 40,
  },
  back: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginLeft: 13,
    marginTop: 9,
  },
  iconRow: {
    height: 44,
    flexDirection: "row",
    marginTop: -190,
    marginLeft: 9,
    marginRight: 274,
  },
  group: {
    width: 266,
    height: 44,
    flexDirection: "row",
    marginTop: 139,
    marginLeft: 24,
  },
  loremIpsum4: {
    fontFamily: "roboto-regular",
    color: "lightblue",
    fontSize: 22,
    marginTop: 9,
  },
  icon2: {
    color: "lightblue",
    fontSize: 40,
    marginLeft: 24,
  },
  loremIpsum4Row: {
    height: 44,
    flexDirection: "row",
    flex: 1,
  },
  loremIpsum5: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 3,
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
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {textMessageAuth, setLoading })(
  PhoneNumber
);
