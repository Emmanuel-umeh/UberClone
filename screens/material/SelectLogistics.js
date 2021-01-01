import React, { Component } from "react";

import {StyleSheet, View, Image} from "react-native"
import {Container, Header, Content, Card, CardItem, Text, Icon, Right, Picker, Button } from "native-base";
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { connect } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient';
import store from "../../store"


class SelectLogistics extends Component {

  constructor(props){
    super(props)
  }

  state = {
    payment_method : "Cash",
    selected : "Bike"
  }

  payment_method=(e)=>{
    console.log({e})
    this.setState({
      payment_method : e
    })
    }


    request_ride = async()=>{


      if(!this.state.payment_method){
        return alert("Please select a payment method")
      }

      if(!this.state.selected  ){
        return alert("Please select a vehicle")
      }


    await store.dispatch({
      type : "LOGISTIC_TYPE",
      payload : this.state.selected
    })

  
    this.props.bookRide(this.state.payment_method)
    }
    

  render(){


    console.log(this.state)
    const {order} = this.props
    return (
    
  
      <Container style ={{
        paddingTop : 10
      }} >

{/*        d
                   <View
          style={{
            width: wp("15%"),
            backgroundColor: "#c9c7c7",
            padding: 3,
            // left  : wp("40%"),
            alignSelf: "center",
            marginTop : 1,
            marginBottom : 10,
            // height : 2,
            borderRadius: 50,
          }}
        ></View>
         */}
        {/* <View style ={{ flex : 1, flexDirection : "row"}}> */}

        <LinearGradient
  // Button Linear Gradient

  style ={{
    flex : 1, flexDirection : "row"
  }}
  colors={["white", "#ffffff00"]}
  >
  
  <ScrollView 
  horizontal = {true}
  showsHorizontalScrollIndicator = {false}
  alwaysBounceHorizontal = {true}>
  
  
  <TouchableOpacity  onPress={()=>{
    this.setState({
      selected : "Bike"
    })
  }} style = {[styles.box, {
    borderColor : this.state.selected=="Bike" ? "gold" : "#c9c7c7"
  }]}>

<Image resizeMode ="contain" style={{
        width: 60,
         height: 70,
         
      }} source = {require("../../assets/logistics/bikee.png")}></Image>
         <Text style = {styles.price}>Bike</Text>
  </TouchableOpacity >
  <TouchableOpacity onPress={()=>{
    this.setState({
      selected : "Car"
    })
  }}   style = {[styles.box,{
    borderColor : this.state.selected=="Car" ? "gold" : "#c9c7c7"
  }]}>
      {/* <Icon name = "car" style ={{
        fontSize :50,
        paddingTop : 20
      }} /> */}

      <Image resizeMode ="contain" style={{
        width: 60,
         height: 70,
         
      }} source = {require("../../assets/logistics/car_icon.png")}></Image>
         <Text style = {styles.price}>Car</Text>
  </TouchableOpacity >
  
  <TouchableOpacity 
  onPress={()=>{
    this.setState({
      selected : "Truck"
    })
  }}  style = {[styles.box,{
    borderColor : this.state.selected=="Truck" ? "gold" : "#c9c7c7"
  }]}>
 
 <Image resizeMode ="contain" style={{
        width: 60,
         height: 70,
         
      }} source = {require("../../assets/logistics/truck.png")}></Image>
         <Text style = {styles.price}>Truck</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>{
    this.setState({
      selected : "Tanker"
    })
  }}  style = {[styles.box,
  {
    borderColor : this.state.selected=="Tanker" ? "gold" : "#c9c7c7"
  }]}>

<Image resizeMode ="contain" style={{
        width: 60,
         height: 70,
         
      }} source = {require("../../assets/logistics/tanker.png")}></Image>
         <Text style = {styles.price}>Tanker</Text>
  </TouchableOpacity>
  
  
  
  </ScrollView>
    
  </LinearGradient>
   

   
  <View style= {{ top : -wp(2), left : wp(70)}}> 

{/* <Text>Total : </Text> */}

<Text style = {{
  fontSize : 25,
  fontFamily : "Quicksand-Bold",
  marginRight : wp(10)
}}> ₦{Math.round((order ? order.price: 2000) / 100) * 100}</Text>
          </View>
        <View>


  
  <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: wp(30), alignSelf : "flex-start", top : -hp(7), marginLeft : wp(10) }}
                // placeholder="Cash"
                placeholderStyle={{ color: "#bfc6ea", fontFamily : "Quicksand-Medium" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.payment_method}
            
                onValueChange={this.payment_method}
              >
                    <Picker.Item label="Select Payment Method"  value={null} />
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Card" value="Cashless" />
          
                {/* <Picker.Item label="#c9c7c7" value="Gray" /> */}
              </Picker>



<View style ={{
  alignSelf : "center",
  alignItems  : "center",
  top : -hp(5)
  // width : wp(80)
}}>

  <TouchableOpacity onPress ={this.request_ride}>

<Button  onPress ={this.request_ride} dark rounded large  style ={{
  width : wp(80)
}}><View style ={{alignSelf :"center"}}>
  
  <Text style = {{left : wp(15),  fontFamily : "Quicksand-Medium" }}> Request Ride </Text></View></Button>
      
  </TouchableOpacity>
</View>
        
  </View>


    </Container>
    
    );
  }
 
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#CCC",
    flexWrap: "nowrap",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden"
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  box : {
borderRadius : 20,
borderWidth : 1,
// borderColor :"gold",
width : wp(27),
height : hp(13),
marginLeft : wp(5),
flex : 1,
alignContent :"center",
alignItems : "center",
justifyContent : "center"
  },
  bodyContent: {
    padding: 16,
    paddingTop: 24,
    flex: 1
  },
  bike: {
    fontFamily : "Quicksand-Bold",
    fontSize: 20,
    color: "#000",
    left :wp("10%"),
    paddingBottom: 12
  },
  price: {
    fontFamily : "Quicksand-Medium",
    fontSize: 18,
    color: "#000",
    // left :wp("10%"),
    paddingBottom: 12,
    marginTop : -10
  },
  subtitleStyle: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    opacity: 0.5
  },
  actionBody: {
    padding: 8,
    flexDirection: "row"
  },
  actionButton1: {
    padding: 8,
    height: hp("3%")
  },
  n900: {
    fontSize: 22,
    color: "#000",
    opacity: 0.9,
    lineHeight: 22
  },
  image: {
    // top: 21,
    // left: 217,
    // width: 100,
    // height: 200,
    position: "absolute"
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(SelectLogistics);