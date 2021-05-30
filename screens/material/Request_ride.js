import React, { Component } from "react";

import {StyleSheet, View, Image} from "react-native"
import {Container,  Text, Icon, Button, Picker } from "native-base";
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { connect } from 'react-redux'

import { LinearGradient } from 'expo-linear-gradient';
import store from "../../redux/store"
import { Divider } from "react-native-paper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import colors from "../colors/colors"


class Request_ride extends Component {

  constructor(props){
    super(props)
  }

  // state = {
  //   payment_method : "Cash",
  //   selected : "Bike"
  // }

  payment_method=(e)=>{


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

    console.log("acuracry!!!!!!!!!!!! ", this.props.order.accuracy)
    if(this.props.order.accuracy < 100){
      console.log("request ride state ", this.props.state.from_location)
      return this.props.book_ride(this.props.state.from_location)
    }

    this.props.open_modal()
  
    }


   
    

  render(){


    const {order} = this.props
    console.log(order.accuracy)
    return (
    <View style ={{
      flex : 1,
      alignContent : "center", 
      justifyContent : "center"
    }}>
 
 <Text style = {styles.bold}> Confirm Payment Method</Text>

<Divider style ={{
              height :1,
              top : 5
            }} />   



  <View > 

  

<Text style = {{
  fontSize : 25,
  fontFamily : "Quicksand-Bold",
  alignSelf : "center"
}}> ₦{Math.round((this.props.price) / 100) * 100}</Text>
          </View>
     


  {/* <View style ={{
    padding : 20
  }}> */}
  {/* <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: wp(70), alignSelf : "center", height : 40 }}
                placeholder="Select payment method"
                placeholderStyle={{ color: "#bfc6ea", fontFamily : "Quicksand-Medium"}}
                placeholderIconColor="#007aff"
                // selectedValue={this.props.state.payment_method}
            
                onValueChange={this.payment_method}
              >
                    <Picker.Item label="Select Payment Method"  value={null} />
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Card" value="Cashless" />

              </Picker> */}
  {/* </View> */}

<View style ={{
  padding : 10
}}>
<BouncyCheckbox
  size={25}

  unfillColor="#FFFFFF"
  fillColor="green"
  text="Pay with cash"
  disableBuiltInState  ={true}
  isChecked = {this.props.state.payment_method === "Cash" ? true : false}
  iconStyle={{ borderColor: "green" }}
  textStyle={{ fontFamily: "Quicksand-Bold" }}
  onPress={(isChecked) => {
    // console.log("checked", isChecked)
    this.payment_method("Cash")
  }}
/>
</View>
 
<View style ={{
  padding : 10
}}>
  <BouncyCheckbox
  size={25}
  fillColor={colors.safron}
  unfillColor="#FFFFFF"
  disableBuiltInState = {true}
  text="Pay with card"
  isChecked = {this.props.state.payment_method === "Card" ? true : false}
  iconStyle={{ borderColor: "red" }}
  textStyle={{ fontFamily: "Quicksand-Bold" }}
  onPress={(isChecked) => {
    // console.log("checked", isChecked)
    this.payment_method("Card")
  }}
/>
</View>




<View style ={{
  alignSelf : "center",
  alignItems  : "center"
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

  
    bold: {
      fontFamily: "Quicksand-Bold",
      color: "#121212",
      fontSize: 20,
      marginTop : -hp(5),
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