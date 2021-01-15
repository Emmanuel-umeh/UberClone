import React, { Component } from 'react'
import {

    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from "react-native"

import SearchInput from "../components/SearchInput"
import {Ionicons} from '@expo/vector-icons'
// gets width of window
const WIDTH = Dimensions.get('window').width
export default class DestinantionButton extends Component{

    constructor(props){
        super(props)
    }
    state = {
        onLocationSelected : false
    }
    render(){
        // console.log("set destination function !!!!!!!", this.props.selectDestination)
        
       
        // console.log("props ", this.props)
        return(


            <TouchableOpacity  onPress ={()=>{
    
                // console.log("where to clicked!!")
                // console.log("props", this.props)

                console.log("logistics ", this.props.logistics)
                this.props.navigation.navigate("setDestination",{
                    address : this.props.state.addressShortName,
                    longitude : this.props.state.region.longitude,
                    latitude : this.props.state.region.latitude,
                    selectDestination :this.props.selectDestination,
                    logistics : this.props.logistics
                  })
            }}  style = {styles.container}>
    
    
    
    
    <View style = {styles.leftCol}>
            <Text  style ={{fontSize :8, color : "#C68E17"}}>{'\u25A0'}</Text>
    </View>
    
    <View style = {styles.centerCol}>
    <Text  style ={{ fontSize : 21, color : '#545454',
  fontFamily : "Quicksand-Bold" }}>Where To? </Text>
    </View>
    
    <View style = {styles.rightCol}>

        {this.props.logistics == "bike" &&   <Ionicons name = 'md-bicycle' color = "black" size ={24} style ={{alignSelf:'center'}} /> }
        {this.props.logistics != "bike" &&   <Ionicons name = 'md-car' color = "black" size ={24} style ={{alignSelf:'center'}} /> }
          {/* <Ionicons name = 'md-car' color = "black" size ={24} style ={{alignSelf:'center'}} /> */}
          
    </View>


            </TouchableOpacity>
    
    // <SearchInput onLocationSelected={this.state.onLocationSelected} />
    
        )

    }
    
}



const styles = StyleSheet.create({
container : {
    zIndex : 9,
    position : 'absolute',
    flexDirection : 'row',
    width : WIDTH - 40,
    height : 60,
    top : 110,
    left:20,
    borderRadius  :2,
    backgroundColor : 'white',
    alignItems : 'center',
    shadowColor : "#000000",
    elevation : 7,
    shadowRadius : 3,
    shadowOpacity: 1.0



},


leftCol : {

    flex : 1,
    alignItems : 'center'
},

rightCol : {

    flex : 1,
    borderLeftWidth : 1,
    borderColor : '#ededed'
},

centerCol : {

    flex : 4
}

})