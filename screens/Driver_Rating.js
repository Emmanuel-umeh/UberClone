import React, { Component } from 'react'
import {StyleSheet, View, Text, Image} from "react-native"
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';
 import { connect } from 'react-redux'
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Textarea } from 'native-base';
import {rate_driver} from "../action/orderActions"
import { NavigationContainer, StackActions } from '@react-navigation/native';
class Driver_Rating extends Component{

    state = {

        rating : 3,
        review_message : ""

    }


    reset_navigation =()=>{
                // reset navigation!!
                this.props.navigation.dispatch(
                    StackActions.replace('setLogisticsScreen')
                  )
                this.props.navigation.pop() 
                // && this.props.navigation.navigate('setLogisticsScreen');
                
    }

    submit_review = ()=>{



        const {user} = this.props.auth

      
          const  rating = this.state.rating
          const  review_message = this.state.review_message
          const passenger_id = user? user._id : null
          const driver = this.props.route.params.param ? this.props.route.params.param : null
          const tokens = this.props.auth.token
          const      reset_navigation = this.reset_navigation
      
        this.props.rate_driver(rating,review_message,passenger_id,driver,tokens, this.reset_navigation)
    }
    render(){



        return(


<View style={styles.container}>
<ScrollView>
  <View style={{alignItems:'center', marginHorizontal:30}}>
    <Image style={styles.productImg} source={{uri:"https://image.freepik.com/free-photo/man-driving-car-from-rear-view_1359-494.jpg"}}/>
    <Text style={styles.name}>Please Rate Your White Axis </Text>
    <Text style={styles.name}>Experience</Text>
   
  </View>
  <View style={styles.starContainer}>

  <AirbnbRating
  count={5}
  reviews={["Terrible", "Bad", "Okay", "Good", "Awesome",]}
  defaultRating={3}
  size={wp("13%")}
  onFinishRating ={(e)=>{
   
    this.setState({
        rating : e
    })
  }}
/>
{/* 
  <Rating
  showRating
  type = "custom"
  ratingBackgroundColor = "transparent"
  onFinishRating={this.ratingCompleted}
  
  style={{ paddingVertical: 10,
    
  backgroundColor : "transparent" }}
  imageSize = {wp("15%")}
  minValue = {1}
/> */}
     </View>
     
     <View style = {{ top : 20}}>

         <Textarea rowSpan={5} bordered  placeholder ="Please write a short review (Optional)... " style ={{
             fontSize : 13,
             fontFamily : "Quicksand-Bold",
             backgroundColor : "whitesmoke"
         }}
         onChangeText={(review_message) => {this.setState({review_message}); }}
         value={this.state.review_message}

         
         /> 

     </View>
  <View style={styles.separator}></View>
  <View style={styles.addToCarContainer}>
    <TouchableOpacity style={styles.shareButton} onPress={()=> this.submit_review()}>
      <Text style={styles.shareButtonText}>Sumbit</Text>  
    </TouchableOpacity>
  </View> 
</ScrollView>
</View>

        )
    }
}


const styles = StyleSheet.create({
    container:{
      flex:1,
      marginTop:20,
    },
    productImg:{
      width:wp("100%"),
      height:hp("40%"),
    },
    name:{
      fontSize:20,
      color:"black",
      fontFamily : "Quicksand-Bold",
      alignSelf : "center"
    },
    price:{
      marginTop:10,
      fontSize:18,
      color:"green",
      fontWeight:'bold'
    },
    description:{
      textAlign:'center',
      marginTop:10,
      color:"#696969",
    },
    star:{
      width:40,
      height:40,
    },
    btnColor: {
      height:30,
      width:30,
      borderRadius:30,
      marginHorizontal:3
    },
    btnSize: {
      height:40,
      width:40,
      borderRadius:40,
      borderColor:'#778899',
      borderWidth:1,
      marginHorizontal:3,
      backgroundColor:'white',
  
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    starContainer:{
      justifyContent:'center', 
      marginHorizontal:30, 
      flexDirection:'row', 
      marginTop:20
    },
    contentColors:{ 
      justifyContent:'center', 
      marginHorizontal:30, 
      flexDirection:'row', 
      marginTop:20
    },
    contentSize:{ 
      justifyContent:'center', 
      marginHorizontal:30, 
      flexDirection:'row', 
      marginTop:20
    },
    separator:{
      height:2,
      backgroundColor:"#eeeeee",
      marginTop:20,
      marginHorizontal:30
    },
    shareButton: {
      marginTop:10,
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius:30,
      backgroundColor: "black",
    },
    shareButtonText:{
      color: "#FFFFFF",
      fontSize:20,
    },
    addToCarContainer:{
      marginHorizontal:30
    }
})

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    order: state.order,
    pusher: state.pusher,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, {rate_driver })(Driver_Rating);