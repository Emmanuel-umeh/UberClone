import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";
import {connect} from "react-redux"
import {textMessageAuth, setLoading} from "../action/authAction"
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Right,
  Left,
  Body,
  Title,
  Button,
  Switch,
} from "native-base";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import { LogBox } from 'react-native';

class PhoneNumber extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    number: null,
  };

// componentDidMount() {
//     LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
// }

  _onPressHandler() {
    this.loadingButton.showLoading(true);

    // mock
    // setTimeout(() => {
    //   this.loadingButton.showLoading(false);
    // }, 2000);
    this.mobileNumber()
  }

  concatNumber= (phoneNumber)=>{

    var number 
  if(phoneNumber[0] == 0){

    var edited_number = phoneNumber.replace(phoneNumber[0], '');

    number = "+234" + edited_number

  }else{
    number = "+234" + phoneNumber
  }

     
    console.log("concat number ", number)
    // this.props.setLoading()
     this.props.textMessageAuth(number)

    // console.log({result})
    // this.props.navigation.navigate("otp")

  }

  mobileNumber = () => {

    const number = this.state.number ? this.state.number.replace(/\s+/g, '') : null

    if(!number ||  number.length < 10||  number.length > 11){
      this.loadingButton.showLoading(false);
      return alert("Please enter a valid phone number")
     
     }
 

    "all zeros ? !",/^\d+$/.test(number.toString() ? 
    
    this.concatNumber(number)
    : 
    alert("Please Enter Just Numbers")
    ) 
  };


  componentDidUpdate(prevProps){

    // console.log("error ", this.props.error.id.length)
    if(this.props.error.id.length > 0){
      this.loadingButton.showLoading(false);
    }
  }
  render() {
    // console.log("number", this.state.number);
    // console.log("endpoint details ", this.props.auth)
   
    return (
      <Animatable.View animation="slideInUp" style={styles.container}>

       
<Header
        style={{
          backgroundColor: "whitesmoke",
        }}
      >
        <Left>
          <TouchableOpacity onPress={() => {
                this.props.navigation.pop();
              }}> 
          <Button transparent>
            <Icon
              name="arrow-back"
              style={{color : "black"}}
            />
          </Button>

          </TouchableOpacity>
         
        </Left>
        <Body>
                    <Title style ={{
                      fontWeight : "bold",
                      color : "black",
                      marginLeft : wp("4%")
                    }}>Phone Number</Title>
                  </Body>
                
      </Header>


      <ScrollView>
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
             placeholderTextColor = "black"
            keyboardType="number-pad"
            maxLength={11}
            placeholder="phone number"
            style={styles.loremIpsum3}
          ></TextInput>
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
          </ScrollView>
        

       
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "space-evenly"
  },
  loremIpsum: {
  fontFamily : "Righteous-Regular",
    color: "black",
    fontSize: 22,
    marginTop: hp("20%"),
    marginLeft: 24,
  },
  rect: {
    width: wp("50%"),
    height: 1,
    backgroundColor: "rgba(0,0,0,1)",
    fontWeight : "bold",
    marginTop: 62,
    marginLeft: wp("35%"),
  },
  loremIpsum2: {
  fontFamily : "Righteous-Regular",
    color: "#121212",
    lineHeight: 22,
    fontSize: 22,
    marginTop: hp("1%"),
  },
  loremIpsum3: {
  fontFamily : "Righteous-Regular",
    color: "black",
    fontSize: 22,
    opacity: 0.6,
    marginLeft: 13,
  },
  loremIpsum2Row: {
    height: hp("5%"),
    flexDirection: "row",
    marginTop: -hp("5%"),
    marginLeft: 61,
    marginRight: 113,
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 30,
    top: hp("5%")
  },
  back: {
  fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize: 22,
    marginLeft: 13,
    marginTop: hp("5%"),
  },
  iconRow: {
    height: 44,
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 9,
    marginRight: wp("80%"),
  },
  group: {
    width: wp("80%"),
    height: 44,
    flexDirection: "row",
    marginTop: hp("20%"),
    marginLeft: 24,
  },
  loremIpsum4: {
  fontFamily : "Righteous-Regular",
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
  fontFamily : "Righteous-Regular",
    color: "#121212",
    fontSize : 15,
    marginTop: 3,
  },
  icon3: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginLeft: wp("2%"),
  },
  loremIpsum5Row: {
    height: hp("20%"),
    top : hp("10%"),
    flexDirection: "row",
    width : wp("100%"),
    marginBottom: hp("1%"),
    
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
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
