import React, { Component } from 'react'
import MapView from 'react-native-maps'

class Confirm_Location extends Component{


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


            </MapView>
        )
    }
}

export default Confirm_Location