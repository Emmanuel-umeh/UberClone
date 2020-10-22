import React, { Component } from 'react'

import {View, Text} from "native-base"
import { CreditCardInput, LiteCreditCardInput } from "react-native-input-credit-card";

import  FloatingActionButton  from "react-native-floating-action-button";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";


export default class CreditCard extends Component{

    _onChange =(form) =>{
        console.log(form.valid)
        // this.props.route.params.bookRide()
        if(form.valid){
            this.props.navigation.pop()
            this.props.route.params.bookRide()
        }
        //
    }
    render(){
        return(

            <View style ={{flex : 1, justifyContent : "center", alignContent : "center" }}>
                <Text style={{fontWeight : "bold", alignSelf : "center"}}>Please Add A Valid ATM Card</Text>
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