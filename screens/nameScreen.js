import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import {connect} from "react-redux"
import { registerDetails} from "../action/authAction"
import * as EmailValidator from 'email-validator';
import AsyncStorage from "@react-native-community/async-storage";
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Kohana } from 'react-native-textinput-effects';
class NameScreen extends Component{



  state ={
    firstName : null,
    lastName : null,
    email : null
  }
  submit = async()=>{

    var {firstName,lastName,email} = this.state
    var token
    if(!firstName ||
      !lastName ||
      !email 
      
      ){
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
          console.log(e)
        }
      }

     
      
      const isValid = EmailValidator.validate(email); // true
      if(isValid){
        getToken()
        // console.log("token ", async () => {
        
        //     const value = await AsyncStorage.getItem('token')
           
        //       // value previously stored
        //       console.log("value ", value)
            
        
        // }
        // )
  this.props.registerDetails(firstName,lastName,email,token)

      }else{
        alert("Enter a valid email")
      }


    
  }

  render(){
    console.log("firstname ", this.state.email)
    return (
      <View style={styles.container}>
        <Text style={styles.whatsYourName}>Some Information About You...</Text>
        <View style={styles.rect}>
          <View style={styles.rect4}>
            <View style={styles.rect5}></View>
          </View>
        </View>
        <View style={styles.firstNameStack}>
          {/* <TextInput onChangeText ={(firstName)=>{
            this.setState({
              firstName 
            })
          }} style={styles.firstName} placeholderTextColor = "gray" placeholder = "First Name"></TextInput> */}
         

         <Kohana
    style={{ backgroundColor: 'whitesmoke' }}
    label={'First Name'}
    // style={styles.firstName}
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
        </View>
        <Icon name="chevron-with-circle-right" onPress ={()=>{
          this.submit()
        }} style={styles.icon1}></Icon>
        <View style={styles.rect3}></View>
        <TextInput style={styles.lastName} onChangeText ={(lastName)=>{
            this.setState({
              lastName 
            })
          }}  placeholderTextColor = "gray"  placeholder = "Last Name"></TextInput>
        <View style={styles.rect6}></View>
        <TextInput style={styles.email} onChangeText ={(email)=>{
            this.setState({
              email 
            })
          }} placeholderTextColor = "gray"  placeholder = "Email"></TextInput>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  whatsYourName: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginTop: 123,
    marginLeft: 24
  },
  rect: {
    width: 306,
    height: 4,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 61,
    marginLeft: 24
  },
  rect4: {
    width: 306,
    height: 4,
    backgroundColor: "rgba(0,0,0,1)"
  },
  rect5: {
    width: 306,
    height: 4,
    backgroundColor: "rgba(0,0,0,1)"
  },
  firstName: {
    top: 0,
    left: 0,
    color: "blue",
    position: "absolute",
    fontFamily: "roboto-regular",
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
    marginTop: 439,
    marginLeft: 281
  },
  rect3: {
    width: 306,
    height: 3,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: -283,
    marginLeft: 24
  },
  lastName: {
    fontFamily: "roboto-regular",
    color: "#121212",
    color: "blue",
    fontSize: 22,
    opacity: 0.19,
    marginTop: -140,
    marginLeft: 24
  },
  rect6: {
    width: 306,
    height: 4,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 10,
    alignSelf: "center"
  },
  email: {
    fontFamily: "roboto-regular",
    color: "blue",
    fontSize: 22,
    opacity: 0.19,
    marginTop: 59,
    marginLeft: 26
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {registerDetails })(
  NameScreen
);
