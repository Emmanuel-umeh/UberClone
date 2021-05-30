import React, { Component } from "react";

import { View, Text, Button } from "native-base";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-input-credit-card";

import FloatingActionButton from "react-native-floating-action-button";
import { add_card } from "../redux/action/authAction";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { ScrollView } from "react-native";
import colors from "./colors/colors";

import RNPaystack from 'react-native-paystack';
import lottie_loader from "./loaders/lottie_loader";

class CreditCard extends Component {

  state = {
    loading : false
  }
  _onChange = (form) => {
    const { token } = this.props.auth;
    // const tokens = token
    console.log(form);
    // this.props.route.params.bookRide()
    if (form.valid) {
    
        /**
 * 
 *   "values": Object {
    "cvc": "",
    "expiry": "",
    "number": "",
    "type": undefined,
  },
 */
        const data = {
          number: form.values.number,
          expiry: form.values.expiry,
          type: form.values.type,
          tokens: token,
        };
        console.log({data})
        // this.props.add_card()
      
      // this.props.navigation.pop()
      // this.props.route.params.bookRide()
    }
    //
  };

  chargeCard = ()=> {

    this.setState({
      loading : true
    })

    RNPaystack.chargeCard({
        cardNumber: '4123450131001381', 
        expiryMonth: '10', 
        expiryYear: '17', 
        cvc: '883',
        email: 'Emmanuelsumeh@gmail.com',
        amountInKobo: 150000
      })
    .then(response => {
      
    this.setState({
      loading : false
    })

      console.log({response}); // card charged successfully, get reference here
    })
    .catch(error => {
      console.log(error); // error is a javascript Error object
      console.log(error.message);
      console.log(error.code);
    })
    
  }
  render() {
    return (
      // <View style ={{flex : 1, justifyContent : "center", alignContent : "center" }}>
      <ScrollView>
        {lottie_loader({loading:this.state.loading})}
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "space-evenly",
            marginTop: hp(6),
          }}
        >
          <Text style={{ fontFamily: "Quicksand-Bold", alignSelf: "center" }}>
            Please Add A Valid ATM Card
          </Text>
          <CreditCardInput onChange={this._onChange} />

          <View
            style={{
              marginTop: hp(10),
              width : wp(85),
              alignItems : "center",
              alignSelf : "center",
              alignContent : 'center'
            }}
          >
            <Text
              style={{
                fontFamily: "Quicksand-Medium",
                fontSize: 16,
              }}
            >
              White Axis may charge a small amount to verify your card details.
              This is immediately refunded.
            </Text>
          </View>

          <Button
            onPress={this.chargeCard}
            block
            style={{
              backgroundColor: colors.black,
              borderRadius: 30,
              width: wp(80),
              alignSelf: "center",
              marginBottom : 50,
              marginTop: hp(3)
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Quicksand-Bold",
                marginTop: -3,
                color: colors.white,
              }}
             
            >
              Add Card
            </Text>
          </Button>
        </View>
      </ScrollView>
      // </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { add_card })(CreditCard);
