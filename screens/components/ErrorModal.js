import React, { Component } from 'react'
import LottieView from 'lottie-react-native';
import { StyleSheet, View, Text, ScrollView, Alert, Button } from "react-native";
import Modal from 'react-native-modal';

export default function ErrorModal(props) {
    return (
        <Modal isVisible={!props.modal_visible}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> 
                  <View style ={{
                    backgroundColor : "white",
                    alignItems : "center"
                  }} >
                  <LottieView
                  style = {{
                    height : 200,
                    width : 200
                  }}
                   source={require("../../assets/lottie/error.json")}
                 
                  autoPlay
        
                  loop = {false}
                />
                <View style ={{
               flexDirection: 'row'
                }}>
                <Text style = {{
                    fontSize : 15,
                    flexShrink:1,
                    // flex : 1,
                    fontFamily : "Quicksand-Medium"
                  }}>{props.error_msg}</Text>
                </View>
          
        <View style = {{
          marginTop : 20,
          marginBottom : 20
        }} >
          
        <Button title="Close"   color="red"  onPress={props.toggleModal} />
        </View>
                  </View>
                  
                </View>
              </Modal>
        
    )
}
