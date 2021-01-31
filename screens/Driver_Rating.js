import React, { Component } from 'react'
import {StyleSheet, View, Text, ScrollView} from "react-native"
import {TouchableOpacity } from 'react-native-gesture-handler';
import { Rating, AirbnbRating } from 'react-native-ratings';
 import { connect } from 'react-redux'
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Textarea } from 'native-base';
import {rate_driver} from "../action/orderActions"
import { NavigationContainer, StackActions } from '@react-navigation/native';
import colors from "./colors/colors"




    const questions = [
      {id : 0, question : "Kindly rate your driver's attidude"},
      {id : 1, question : "Kindly rate your driver's dressing"},
      {id : 2, question : "Kindly rate your driver's tone"},
      {id : 3, question : "Kindly rate your driver's neatness"},
      {id : 4, question : "Kindly rate your driver's driving ability"},
      {id : 5, question : "Kindly rate your ride experience"},
      {id : 6, question : "Kindly rate your driver's car neatness"},
      {id : 7, question : "Kindly rate your comfortability"}
    ]
class Driver_Rating extends Component{

    state = {

        rating : 3,
        review_message : "",
        question : ""

    }



    reset_navigation =()=>{
                // reset navigation!!
                this.props.navigation.replace("setLogisticsScreen")
                // this.props.navigation.pop() 
                // && this.props.navigation.navigate('setLogisticsScreen');
                
    }

    componentDidMount(){


      let  randomItem = questions[Math.floor(Math.random() * questions.length)];

      this.setState({
question : randomItem.question
      })
    }

    submit_review = ()=>{



        const {user} = this.props.auth

          const question = this.state.question
          const  rating = this.state.rating
          const  review_message = this.state.review_message
          const passenger_id = user? user._id : null
          const driver = this.props.route.params.param ? this.props.route.params.param : null
          const tokens = this.props.auth.token
          const      reset_navigation = this.reset_navigation
      
        this.props.rate_driver(question,rating,review_message,passenger_id,driver,tokens, this.reset_navigation)
    }
    render(){
 
        return(


<View style={styles.container}>
  

<ScrollView centerContent>


  <View style={{alignItems:'center'}}>
    {/* <Image style={styles.productImg} source={{uri:"https://image.freepik.com/free-photo/man-driving-car-from-rear-view_1359-494.jpg"}}/> */}
    <Text style={styles.name}>{this.state.question}</Text>
    {/* <Text style={styles.name}>Experience</Text> */}
   
  </View>
  <View style={styles.starContainer}>

  <AirbnbRating
  count={5}
  reviewColor = {colors.safron}
  // ratingColor='#3498db'
  selectedColor = {colors.safron}
  reviews={["Terrible", "Bad", "Okay", "Good", "Awesome",]}
  defaultRating={3}
  size={wp(10)}
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

       <Text style={{
         alignSelf : "center",
         fontSize : wp(4),
         fontFamily : "Quicksand-Medium"
       }}>Leave your comments (Optional)</Text>

         <Textarea rowSpan={5} bordered  style ={{
             fontSize : 13,
             fontFamily : "Quicksand-Bold",
             backgroundColor : "whitesmoke",
             width : wp(80),
             alignSelf  : "center",
             marginTop : hp(4)
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
      alignContent : "center",
      justifyContent : "center"
    },
    productImg:{
      width:wp("100%"),
      height:hp("40%"),
    },
    name:{
      fontSize:wp(8),
      flexWrap : "nowrap",
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
      width:wp(8),
      height:wp(8),
    },
    btnColor: {
      height:30,
      width:30,
      borderRadius:30,
      marginHorizontal:3
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
      height:hp(8),
      width : wp(80),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf : "center",
      borderRadius:30,
      backgroundColor: colors.safron,
    },
    shareButtonText:{
      color: colors.white,
      fontSize:wp(6),
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