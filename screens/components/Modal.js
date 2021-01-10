import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

import {Button, Text} from "native-base"

const CustomModal = props => {
  const {
    loading,
    cancelOrder,
    ...attributes
 
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={loading}
      onRequestClose={() => {console.log('close modal')}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size="large" color="#d1ab21"  animating ={loading}/>
        
        </View>

        <Text style = {{fontSize  : 30, fontWeight : "bold", color : "whitesmoke"}}>Searching for a ride...</Text>
        <Button rounded warning style ={{alignSelf : "center"}}
        
        
        onPress ={cancelOrder}
        
        
        >
            <Text>Cancel Order</Text>
          </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default CustomModal;