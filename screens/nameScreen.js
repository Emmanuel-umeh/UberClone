import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, Alert, Button } from "react-native";
import Modal from 'react-native-modal';


import {connect} from "react-redux"
import { registerDetails, setLoading,endLoading} from "../redux/action/authAction"
import * as EmailValidator from 'email-validator';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana, Fumi  } from 'react-native-textinput-effects';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Container, Header, Content, Item,
 } from 'native-base';
  
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ErrorModal from "./components/ErrorModal";
class NameScreen extends Component{

  constructor(props){
    super(props)

 }



  state ={
    firstName : null,
    lastName : null,
    modal_visible: false,

    email : null,
    error : null
  }

  componentDidMount(){
    this.loadingButton.showLoading(false);
  }
  toggleModal = () => {
    this.setState({
      modal_visible : false,
      error_msg : null
    })
  }

  
_onPressHandler=()=> {
  this.loadingButton.showLoading(true);
this.submit()
}
  submit = async()=>{

    var {firstName,lastName,email} = this.state
    var token
    if(!firstName ||
      !lastName ||
      !email 
      
      ){
        this.loadingButton.showLoading(false);

        return this.setState({
          error_msg : "Please enter all fields"
        })
      }

      


     
      
      const isValid = EmailValidator.validate(email); // false
      if(isValid){
    
       const  user = {
         
    first_name : this.state.firstName,
    last_name : this.state.lastName,
    email : this.state.email
       }
       
  // await this.props.registerDetails(firstName,lastName,email,id,tokens)
  this.props.navigation.navigate("phoneNumberScreen", {
    user
  })
  // await this.props.endLoading()

      }else{ 
        this.loadingButton.showLoading(false);
        // alert("Enter a valid email")
  return this.setState({
    error_msg : "Enter a valid email"
  })
      }


    
  }

  render(){
    // console.log("firstname ", this.state.email)
    return (
      <Container style ={styles.container}>

{this.state.error_msg && <ErrorModal modal_visible = {this.state.modal_visible} error_msg = {this.state.error_msg} toggleModal = {this.toggleModal} />}


        <View style = {styles.upper}>
          <View style ={{
            alignSelf : "center"
          }}>
          <LottieView
          style = {{
            height : "100%",
            width : "100%"
          }}
           source={require("../assets/lottie/info.json")}
         
          autoPlay

          loop
        />
          </View>
   
        </View>


<View style = {styles.lower}>


<ScrollView>
<View style ={{
    alignItems : "center",
    paddingTop : 10,
    paddingBottom : 10
  }}>
    <Text style = {styles.text}>Lets get started !!</Text>
  </View>

<Item rounded  style={{ backgroundColor: 'transparent', marginTop : "1%"  }}>
          {/* <Input placeholder='Rounded Textbox'/> */}
          <Kohana
   
    label={'First Name'}
    // style={styles.firstName}
    onChangeText ={(firstName)=>{
      this.setState({
        firstName 
      })
    }} 
    iconClass={MaterialsIcon}
    iconName={'person'}
    iconColor={'#000000'}
    inputPadding={5}
    labelStyle={{ color: '#969692' }}
    inputStyle={{ color: '#969692' }}
    labelContainerStyle={{ padding : 15 }}
    iconContainerStyle={{ padding : 15 }}
    useNativeDriver
  />
        </Item>


        <Item rounded style={{ backgroundColor: 'transparent', marginTop : "1%"  }}>
          {/* <Input placeholder='Rounded Textbox'/> */}
          <Kohana
    
    label={'Last Name'}
    // style={styles.firstName}
    onChangeText ={(lastName)=>{
      this.setState({
        lastName 
      })
    }} 
 
    iconClass={MaterialsIcon}
    iconName={'person'}
    iconColor={'#000000'}
    inputPadding={5}
    labelStyle={{ color: '#969692' }}
    inputStyle={{ color: '#969692' }}
    labelContainerStyle={{ padding : 15 }}
    iconContainerStyle={{ padding : 15 }}
    useNativeDriver
  />
        </Item>

        <Item rounded   style={{ backgroundColor: 'transparent', marginTop : "1%" }}>
          {/* <Input placeholder='Rounded Textbox'/> */}
          <Kohana
  
    label={'Email Name'}
    // style={styles.firstName}
    onChangeText ={(email)=>{
      this.setState({
        email 
      })
    }} 
    iconClass={MaterialsIcon}
    iconName={'email'}
    iconColor={'#000000'}
    inputPadding={5}
    labelStyle={{ color: '#969692' }}
    inputStyle={{ color: '#969692' }}
    labelContainerStyle={{ padding : 15 }}
    iconContainerStyle={{ padding : 15 }}
    useNativeDriver
  />
        </Item>



        <View style={styles.loremIpsum5Row}>
          <Text style={styles.loremIpsum5}>
            By continuing your data provided{"\n"} to us will be safeguarded {"\n"}and used to address you.
          </Text>
          {/* <EntypoIcon
            onPress={() => {
            
              this.mobileNumber();
              
            }}
            name="chevron-with-circle-right"
            style={styles.icon3}
          ></EntypoIcon> */}
        <View  style = {styles.icon3}>
        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={80}
          height={50}
          title="Verify"
         
          titleFontSize={16}
          titleWeight={'100'}
          titleColor="rgb(255,255,255)"
          backgroundColor="#000000"
          borderRadius={30}
          onPress={()=>this._onPressHandler()}
          useNativeDriver = {true}
        />

        </View>
     
      </View>
     
 </ScrollView>


</View>

    </Container>
   );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "center"
  },

  text: {
    fontFamily: "Quicksand-Bold",
    // color: "#121212",
    fontSize: 22,
  },
  whatsYourName: {
    fontFamily: "Quicksand-Bold",
    color: "#121212",
    fontSize: 22,
    marginTop: hp("20%"),
    marginLeft: 24
  },
  rect: {
    width: wp("90$"),
    height: 4,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 61,
    marginLeft: 24
  },
  rect4: {
    width: wp("90$"),
    height: 4,
    backgroundColor: "rgba(0,0,0,1)"
  },
  rect5: {
    width: wp("90$"),
    height: 4,
    backgroundColor: "rgba(0,0,0,1)"
  },
  firstName: {
    top: 0,
    left: 0,
    color: "blue",
    position: "absolute",
    fontFamily: "Quicksand-Bold",
    // color: "#121212",
    fontSize: 22,
    opacity: 0.19
  },

  
  firstNameStack: {
    width: "100%",
    height: 27,
    marginTop: -38,
    marginLeft: 24,
    color: "blue",
  },
  icon1: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginTop: hp("70%"),
    marginLeft: wp("80%")
  },
  rect3: {
    width: wp("90$"),
    height: 3,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: -283,
    marginLeft: 24
  },
  lastName: {
    fontFamily: "Quicksand-Bold",
    color: "#121212",
    color: "blue",
    fontSize: 22,
    opacity: 0.19,
    marginTop: -140,
    marginLeft: 24
  },
  rect6: {
    width: wp("100%"),
    height: 4,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 10,
    alignSelf: "center"
  },
  email: {
    fontFamily: "Quicksand-Bold",
    color: "blue",
    fontSize: 22,
    opacity: 0.19,
    marginTop: 59,
    marginLeft: 26
  },  
  icon3: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginLeft: 36,
  },
  loremIpsum5Row: {
    height: 54,
    flexDirection: "row",
    marginTop: hp(3),
    marginLeft: 24,
    marginRight: 37,
  },

  upper : {
flex : 1.8,
backgroundColor : "black",
borderBottomLeftRadius : 50,
// borderBottomRightRadius : 50
  },
  lower : {
flex : 2.2
  }
 
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {registerDetails, setLoading,endLoading })(
  NameScreen
);
