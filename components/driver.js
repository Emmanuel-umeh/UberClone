import React, { Component } from 'react'
import {

    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    ColorPropType,
    YellowBox
   
} from "react-native"
import _ from 'lodash';

import MapView ,{AnimatedRegion} from "react-native-maps"



YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default class Driver extends Component{
    constructor(props){
        super(props)
    const driver = this.props.driver ? this.props.driver : {

        uid : "NoDriverPassed", 
        location : {latitude : 0, longitude : 0}
    }


    const coordinate = new AnimatedRegion ({
        latitude  : driver.location.latitude,
        longitude : driver.location.longitude,
        latitudeDelta : 0.3,
        longitudeDelta :0.3
    })

    this.state = {
        driver : driver,
        coordinate : coordinate
    }
    
    }
    render(){
        console.log("ref, " , this.props.innerRef)
        return(
            <MapView.Marker.Animated 
            
            coordinate = {this.state.coordinate} 
            anchor = {{x : 0.35, y:0.32}}
            ref = {this.props.innerRef}
            style = {{width : 50, height   :50 }}
        


>
            <Image source = {require("../assets/bike.png")}

            style ={{
                width : 40,
                 height : 40
            }}

            />

            </MapView.Marker.Animated>
        )
    }
}