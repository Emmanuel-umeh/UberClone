import React, { Component } from 'react'
import MapView from 'react-native-maps'
import {day_styles, night_styles} from "./map_styles/styles"
class Confirm_Location extends Component{



      
  getMapStyles = ()=>{
    // console.log("time of the day !!!!!!!!" ,this.isDay())
    if(this.isDay()){
      return day_styles
    }else{
      return day_styles
    }
    }
    render(){

        return (


            <MapView 
            
            followUserLocation={show_user_location}
            initialRegion={this.props.order.region}
            rotateEnabled={false}
            
            customMapStyle = {this.getMapStyles()}
            showsUserLocation={show_user_location}
            showsBuildings={false}
            zoomEnabled={true}
            showsCompass={false}>


<Marker
        ref={(ref) => { this.marker = ref; }}
        draggable
        onDragEnd={(t, map, coords) => this.setDestination(coords)}
        coordinate={destination}
        position={destination}
        centerOffset={{ x: -18, y: -60 }}
        anchor={{ x: 0.69, y: 1 }}
        pinColor={COLOR.marker}
        onDragStart={() => this.setMarkerPosition()}
      />

            </MapView>
        )
    }
}

export default Confirm_Location