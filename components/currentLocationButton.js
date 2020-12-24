import React, { Component } from 'react'
import {View, StyleSheet, TouchableOpacity} from "react-native"
import {MaterialIcons} from "@expo/vector-icons"

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";


export default function CurrentLocationButton (props){
// render(){


const bottom = props.bottom ? props.bottom : 80


const cb = props.cb ? props.cb : ()=> console.log("callback function not passed")
const order = props.order ? props.order : false
console.log({order})
    return(

        <TouchableOpacity onPress ={ ()=>{
            cb()
        }} style = {[styles.container, {top : order ? hp(30) : hp(80)}]}>

        <MaterialIcons name = "my-location"
        size = {25}  />
        </TouchableOpacity>
    )
// }


}


const styles = StyleSheet.create({
    container : {
        zIndex : 9,
        position : "absolute",
        width : 43,
        height  :45,
        backgroundColor : 'white',
        left : wp(80),
        borderRadius : 50,
        shadowColor : "#000000",
        elevation : 7,
        shadowRadius : 5,
        shadowOpacity : 1.0,
        justifyContent : 'space-around',
        alignItems : 'center'
    }
})