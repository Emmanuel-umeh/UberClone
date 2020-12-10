import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

import {connect} from "react-redux"
import { registerDetails, setLoading,endLoading} from "../action/authAction"
import * as EmailValidator from 'email-validator';
import AsyncStorage from "@react-native-community/async-storage";
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Container, Header, Content, Item,
  
  Card,
  CardItem,
Button,
  Right,
  Icon,
  Left,
  Body,
  Title, } from 'native-base';
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
class NameScreen extends Component{

  constructor(props){
    super(props)

    console.ignoredYellowBox = ["Animated: `useNativeDriver` was not specified."];
  }



  state ={
    firstName : null,
    lastName : null,
    email : null
  }

  componentDidMount(){
    this.loadingButton.showLoading(false);
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
        return alert("Please enter all fields")
      }

      

      const getToken = async () => {
        try {

          // await AsyncStorage.setItem("token", "34567890ertyui")
          token  = await AsyncStorage.getItem("token")
          // alert(token)
          console.log(token)
        } catch (e) {
          // alert('Failed to save the data to the storage')
          this.loadingButton.showLoading(false);
          console.log(e)
        }
      }

     
      
      const isValid = EmailValidator.validate(email); // false
      if(isValid){
        getToken()
        // console.log("token ", async () => {
        
        //     const value = await AsyncStorage.getItem('token')
           
        //       // value previously stored
        //       console.log("value ", value)
            
        
        // }
        // )

        const {user} = this.props.auth
        // console.log("user id ", user._id)
        const id = this.props.route.params.id
        const tokens = this.props.route.params.token
        // console.log("id params name screen ", id)
        // console.log("token params name screen ", tokens)
      //  await this.props.setLoading()

  await this.props.registerDetails(firstName,lastName,email,id,tokens)
  // await this.props.endLoading()

      }else{
        this.loadingButton.showLoading(false);
        alert("Enter a valid email")
      }


    
  }

  render(){
    // console.log("firstname ", this.state.email)
    return (
      <Container style ={styles.container}>

<Header
        style={{
          backgroundColor: "whitesmoke",
        }}
      >
        <Left>
          <TouchableOpacity onPress={() => {
                this.props.navigation.pop();
              }}> 
          {/* <Button transparent>
            <Icon
              name="arrow-back"
              style={{color : "black"}}
            />
          </Button> */}

          </TouchableOpacity>
         
        </Left>
        <Body>
                    <Title style ={{
                      fontWeight : "bold",
                      color : "black",
                      marginLeft : wp("3%")
                    }}>Personal Details</Title>
                  </Body>
                
      </Header>
      {/* <Header /> */}
      <Content>
        <Item rounded  style={{ backgroundColor: 'transparent', marginTop : "10%"  }}>
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
    labelStyle={{ color: '#000000' }}
    inputStyle={{ color: '#000000' }}
    labelContainerStyle={{ padding: 20 }}
    iconContainerStyle={{ padding: 20 }}
    useNativeDriver
  />
        </Item>


        <Item rounded style={{ backgroundColor: 'transparent', marginTop : "10%"  }}>
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
    labelStyle={{ color: '#000000' }}
    inputStyle={{ color: '#000000' }}
    labelContainerStyle={{ padding: 20 }}
    iconContainerStyle={{ padding: 20 }}
    useNativeDriver
  />
        </Item>

        <Item rounded   style={{ backgroundColor: 'transparent', marginTop : "10%" }}>
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
    labelStyle={{ color: '#000000' }}
    inputStyle={{ color: '#000000' }}
    labelContainerStyle={{ padding: 20 }}
    iconContainerStyle={{ padding: 20 }}
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
     
      </Content>
    </Container>
   );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "center"
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
    marginTop: hp("30%"),
    marginLeft: 24,
    marginRight: 37,
  },
 
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {registerDetails, setLoading,endLoading })(
  NameScreen
);
