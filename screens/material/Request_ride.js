import React, { Component } from "react";

import {StyleSheet, View, Image} from "react-native"
import {Container,  Text, Icon,  Picker, Button } from "native-base";
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { connect } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient';
import store from "../../store"
import { Divider } from "react-native-paper";


class Request_ride extends Component {

  constructor(props){
    super(props)
  }

  // state = {
  //   payment_method : "Cash",
  //   selected : "Bike"
  // }

  payment_method=(e)=>{
    console.log({e})

    // updates parent state in mapview with payment method
    this.props.payment_method(e)
    
    
    // setState({
    //   payment_method : e
    // })
    }


    request_ride = async()=>{


      if(!this.props.state.payment_method){
        return alert("Please select a payment method")
      }

      // if(!this.props.state.selected  ){
      //   return alert("Please select a vehicle")
      // }


    // await store.dispatch({
    //   type : "LOGISTIC_TYPE",
    //   payload : this.state.selected
    // })
    


    // this.props.navigation.navigate("confirm_location", {
    //   book_ride : this.props.bookRide,
    //   payment_method : this.state.payment_method,
    //   cancelOrder : this.props.cancelOrder
    // })

    this.props.open_modal()
  
    }


   
    

  render(){


    console.log(this.state)
    const {order} = this.props
    return (
    
  
      <Container>



        <LinearGradient
  // Button Linear Gradient

  style ={{
    flex : 1, flexDirection : "row"
  }}
  colors={["white", "#ffffff00"]}
  >

  </LinearGradient>
   

   
  <View style= {{ top : -wp(2), alignItems : "flex-end"}}> 

  <View
        style={{
          width: wp("10%"),
          backgroundColor: "#515357",
          padding: 3,
          // left  : wp("40%"),
          alignSelf: "center",
          top: -hp(2),
          // height : 2,
          borderRadius: 50,

        }}
      ></View>

{/* <Text>Total : </Text> */}
<Text style = {styles.bold}> Confirm Payment Method</Text>

<Divider style ={{
              height :1,
              top : 5
            }} />     


<View>
  
</View>

<Text style = {{
  fontSize : 25,
  fontFamily : "Quicksand-Bold",
  marginRight : wp(10),
  top : hp(3)
}}> ₦{Math.round((order ? order.price: 2000) / 100) * 100}</Text>
          </View>
        <View>


  
  <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: wp(30), alignSelf : "flex-start", top : -hp(4), marginLeft : wp(10) }}
                // placeholder="Cash"
                placeholderStyle={{ color: "#bfc6ea", fontFamily : "Quicksand-Medium" }}
                placeholderIconColor="#007aff"
                selectedValue={this.props.state.payment_method}
            
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
  top : -hp(3)
  // width : wp(80)
}}>

  {/* <TouchableOpacity onPress ={this.request_ride}> */}

<Button  onPress ={this.request_ride} dark block large  style ={{
  width : wp(80),
  borderRadius : 25
}}><View style ={{alignSelf :"center"}}>
  
  <Text style = {{ fontFamily : "Quicksand-Bold",  fontSize: 20, }}> Request Ride </Text></View></Button>
      
  {/* </TouchableOpacity> */}
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
  },
  
    bold: {
      fontFamily: "Quicksand-Bold",
      color: "#121212",
      fontSize: 20,
      // marginTop: hp(1),
      // marginLeft: wp(4),
      alignSelf: "center",

    },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(Request_ride);