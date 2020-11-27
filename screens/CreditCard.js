import React, { Component } from 'react'

import {View, Text} from "native-base"
import { CreditCardInput, LiteCreditCardInput } from "react-native-input-credit-card";

import  FloatingActionButton  from "react-native-floating-action-button";
import {add_card} from "../action/authAction"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import {connect} from "react-redux"

 class CreditCard extends Component{

    _onChange =(form) =>{

      const {token} = this.props.auth
      // const tokens = token
        console.log(form)
        // this.props.route.params.bookRide()
        if(form.valid){
console.log(this.props.route.params)
          if(this.props.route.params){
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
            number : form.values.number,
            expiry: form.values.expiry,
            type : form.values.type,
            tokens : token
          }
            return this.props.add_card(data)
            // this.props.add_card()
          }
            // this.props.navigation.pop()
            // this.props.route.params.bookRide()
        }
        //
    }
    render(){
        return(

            <View style ={{flex : 1, justifyContent : "center", alignContent : "center" }}>
                <Text style={{ fontFamily : "Righteous-Regular", alignSelf : "center"}}>Please Add A Valid ATM Card</Text>
<CreditCardInput onChange={this._onChange} />






<View   style={{
      position : "absolute",
      zIndex : 9,
      top :hp("90%"),
      left : wp("80%")
    }}>


         <FloatingActionButton
    // text="Back"
    iconName="md-arrow-round-back"
    iconType="Ionicons"
    iconColor="black"
  onPress ={()=>{
    this.props.navigation.pop()
  }}
    textColor="black"
    shadowColor="gold"
    
    rippleColor="gold"
/>
            </View>
            </View>

        )
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { add_card})(
  CreditCard
);
