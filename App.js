import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {MapView} from "expo";

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      region : {
        latitude : 8.6753,
        longitude : 9.0920,
        latitudeDelta : 0.992,
        longitudeDelta : 0.0421
      }
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>Home Screen</Text>
  
  
        <MapView
        initialRegion = {this.state.region}
        rotateEnabled = {false}
        style ={{
  
          flex :1
        }}
  
  
  
        
        />
        <StatusBar style="auto" />
      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
