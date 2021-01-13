import React, { Component } from 'react'
import MapView, {Marker} from 'react-native-maps'
import {day_styles, night_styles} from "./map_styles/styles"

import { connect } from 'react-redux'
import { StyleSheet,Image } from 'react-native'

class Confirm_Location extends Component{



    constructor(props){
        super(props)

        this.marker= null
        this.map = null
    }

    state = {
        scrollEnabled : true
    }
    setDestination(coords) {
        // const { destination } = this.props;
        // const lat = coords.lat();
        // const long = coords.lng();
        // console.log('seperate:', lat, long);
        console.log('destina:', coords);
        // this.props
        //   .dispatch($setDestination(coords.lat(), coords.lng()))
        //   .catch((error) => this.props.dispatch(Activity.$toast('failure', error.message)));
    
        // this.setState((prevState) => ({
        //   isVisible: !prevState.isVisible,
        //   destination: destination[0].fullAddress,
        // }));
        
    }
    setMarkerPosition =()=>{
        this.setState({
scrollEnabled : false
        })
    }

    centerCamera =()=>{

        const {latitude, longitude} = this.props.order.region
        this.map &&
        this.map.animateCamera(
          {
            center: {
              latitude,
              longitude,
            },
            pitch: 20,
            heading: 30,
            altitude: 100,
            zoom: 19,
          },
          800
        );
    }

    componentDidMount(){
        this.centerCamera()
    }
    render(){

        return (


            <MapView 
            

            style={{
                // flex: 1,
                ...StyleSheet.absoluteFillObject,
                // zIndex: 0,
              }}

              scrollEnabled ={this.state.scrollEnabled}
            followUserLocation={false}
            initialRegion={this.props.order.region}
            rotateEnabled={false}
            onMapReady ={this.centerCamera}
            customMapStyle = {day_styles}
            showsUserLocation={false}
            showsBuildings={false}
            zoomEnabled={true}
            ref={(map) => {
                this.map = map;
              }}
  
            showsCompass={false}>


<Marker
        ref={(ref) => { this.marker = ref; }}
        draggable
        onDragEnd={(t, map, coords) => this.setDestination(coords)}
        coordinate={{
            latitude : this.props.order.region.latitude,
            longitude:this.props.order.region.longitude
        }}
        // position={destination}
        centerOffset={{ x: -18, y: -60 }}
        anchor={{ x: 0.69, y: 1 }}
        // pinColor={COLOR.marker}

   
        // style={{ width: 200, height: 80 }}
        onDragStart={() => this.setMarkerPosition()}
      >

<Image
            source={require('../assets/markers/marker1.png')}
            style={{width: 60, height: 70 }}
            resizeMode="contain"
          />
      </Marker>

            </MapView>
        )
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    order: state.order,
  });
  
export default connect(mapStateToProps, {} )(Confirm_Location)