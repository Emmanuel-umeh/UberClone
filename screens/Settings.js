import React, { Component,  } from "react";
import { StyleSheet, View, Image, StatusBar, Platform,TouchableOpacity } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import CupertinoButtonWarning6 from "./material/CupertinoButtonWarning6";
import {connect} from "react-redux"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, Left, Body, Title, Button,Picker, Switch } from 'native-base';
import LottieLoader from "react-native-lottie-loader";
import {notifications_allowed} from "../action/authAction"
import AsyncStorage from "@react-native-community/async-storage";

class  Settings extends Component{

  state = {
    selected : null,
    notification : false

  }


  onValueChange =(e)=>{
    this.setState({
      selected : e
    })
  }

 async componentDidMount (){
    const notification= await AsyncStorage.getItem("notification")
    if(notification){
      this.setState({
        notification : true
      })
    }
  }
    render(){
   
        const {user} = this.props.auth
        return (
            <View style={styles.container}> 

<Header style={{
                  backgroundColor : "black",
                  top : hp("3%")
                }}>
            <Left>
          <TouchableOpacity onPress={() => {
                this.props.navigation.pop();
              }}> 
          <Button transparent > 
            <Icon
              name="arrow-back"
           
            />
          </Button>

          </TouchableOpacity>
         
        </Left>
          <Body>
            <Title style ={{
              fontWeight : "bold",
              marginLeft : wp("10%")
            }}>Settings</Title>
          </Body>
        
        </Header>  
                   {/* <LottieLoader
          visible={this.props.auth.performing_task}
          source={require("../assets/lottie/car.json")}
        /> */}
                <ScrollView>
             

<TouchableOpacity onPress={()=>{
    this.props.navigation.navigate("profileScreen")
}}>
<View style={styles.materialCardWithImageAndTitle8StackStackRow}>
                <View style={styles.materialCardWithImageAndTitle8StackStack}>
                 

            
                
            

                  <View style={styles.rect}>
                        
                <Image
                           source={{
                               uri :"https://lh3.googleusercontent.com/proxy/guhC4W9VIYA-q0W9YGcDcIGO0TS82eh-mJPRd7VA1Myhx7rGyS-R_g4mN4dqitHAmCDL5rJRt_MwAAsWq3KSi4dr23ZvUdmygA"    }}
                      resizeMode="contain"
                      style={styles.image}
                    ></Image>
                      
                    <View style={styles.chineduChideraRow}>

                           
                      <Text style={styles.chineduChidera}>{user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} {user.lastName.charAt(0).toUpperCase() + user.firstName.slice(1)}</Text>
                      <FontAwesomeIcon
                        name="chevron-right"
                        style={styles.icon5}
                      ></FontAwesomeIcon>
                    </View>
                  </View>




              
                </View>
                {/* <Text style={styles.settings1}>Settings</Text> */}
              </View>
              {/* <Container> */}
</TouchableOpacity>

               
        {/* <Header /> */}
        <Content>
          <Card>
         

      
            <CardItem>
              <Icon active name="ios-notifications" />
              <Text>Notifications</Text>
              <Right style={{
                  left : 20
              }}>
                {/* <Icon name="arrow-forward" /> */}
                <Switch value={this.state.notification ? true : false} onValueChange ={async()=>{
                  // const {token} = this.props.auth
                  if(this.state.notification){
                    await AsyncStorage.removeItem("notification")
                    this.setState({
                      notification: false
                    })
                    
                  }else{
                    await AsyncStorage.setItem("notification", "yes")
this.setState({
  notification: true
})

                  }

                  // const tokens = token
                  // console.log({token})
                  // this.props.notifications_allowed(tokens)
                }} />
              </Right>
             </CardItem>
      
             <TouchableOpacity onPress ={()=>{
               this.props.navigation.navigate("add_card")
             }} >
            <CardItem>
              <Icon active name="ios-cash" />
              <Text>Payment Method</Text>
              <Right style={{
                  left : -6
              }}>
                <Icon name="arrow-forward" />
              </Right >
             </CardItem>
             </TouchableOpacity>
          
           </Card>
        </Content>

        <Content>
          <Card>
            <TouchableOpacity  onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem>
              <Icon active name="md-trash" />
              <Text>Clear Cache</Text>
              <Right style={{
                  left : 0
              }}>
                <Icon name="arrow-forward" />
              </Right>
             </CardItem>
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem>
              <Icon active name="ios-briefcase" />
              <Text>Terms & Privacy</Text>
              <Right
              style={{
                  left : -6
              }}>
                <Icon name="arrow-forward" />
              </Right>
             </CardItem>
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               this.props.navigation.navigate("Contact Us")
             }}>

           
            <CardItem>
              <Icon active name="md-contact" />
              <Text>Contact Us</Text>
              <Right style={{
                  left : 1
              }}>
                <Icon name="arrow-forward" />
              </Right>
             </CardItem>
             </TouchableOpacity>
           </Card>
        </Content>
      {/* </Container> */}

              {/* <View style={styles.materialCardWithImageAndTitle8Stack}>
                    <MaterialCardWithImageAndTitle8
                      style={styles.materialCardWithImageAndTitle8}
                    ></MaterialCardWithImageAndTitle8>
                    <MaterialSwitch style={styles.materialSwitch}></MaterialSwitch>
                    <FontAwesomeIcon
                      name="chevron-right"
                      style={styles.icon}
                    ></FontAwesomeIcon>
                    <FontAwesomeIcon
                      name="chevron-right"
                      style={styles.icon1}
                    ></FontAwesomeIcon>
                 
                 
                  </View> */}
          
              {/* <View style={styles.materialCardWithImageAndTitle9Stack}>
                <MaterialCardWithImageAndTitle9
                  style={styles.materialCardWithImageAndTitle9}
                ></MaterialCardWithImageAndTitle9>
                <FontAwesomeIcon
                  name="chevron-right"
                  style={styles.icon2}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  name="chevron-right"
                  style={styles.icon3}
                ></FontAwesomeIcon>
                <FontAwesomeIcon
                  name="chevron-right"
                  style={styles.icon4}
                ></FontAwesomeIcon>
              </View> */}
              <CupertinoButtonWarning6
            
                style={styles.cupertinoButtonWarning6}
              ></CupertinoButtonWarning6>
                    </ScrollView>
            </View>
          );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)"
  },
  materialCardWithImageAndTitle9: {
    height: hp(30),
    width: wp(100),
    position: "relative",
    left: 0,
    top: 0
  },
  icon2: {
    top: 23,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23
  },
  icon3: {
    top: 58,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23
  },
  icon4: {
    top: 95,
    left: wp(90),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23
  },
  materialCardWithImageAndTitle9Stack: {
    width: wp("100%"),
    height: hp("20%"),
    marginTop: 20,
    marginLeft: 1
  },
  materialCardWithImageAndTitle8: {
    height: hp("20%"),
    width: wp("100%"),
    position: "relative",
    left: 22,
    top: 10
  },
  materialSwitch: {
    width: 45,
    height: 23,
    position: "absolute",
    left: wp("95%"),
    top: 286,
    backgroundColor: "rgba(255,255,255,1)"
  },
  icon: {
    top: hp("40%"),
    left: wp("99%"),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23
  },
  icon1: {
    top: 360,
    left: wp("100%"),
    position: "absolute",
    color: "rgba(238,221,19,1)",
    fontSize: 23
  },
  image: {
    top: 5,
    left: 0,
    width: wp("30%"),
    height: wp("20%"),
    position: "absolute"
  },

  imageUser: {
    marginTop: hp("20%"),
    left: 0,
    width: wp("30%"),
    height: hp("20%"),
    marginLeft : wp("2%"),
 borderRadius: 200,
    position: "absolute"
  },
  rect2: {
    // top: Platform.OS === 'ios' ? 20 : StatusBar.HEIGHT,
    left: 0,
    width: wp("100%"),
    height: hp("20%"),
    position: "relative",
    backgroundColor: "rgba(47,46,46,1)",
    flexDirection: "row"
  },
  icon6: {
    color: "rgba(238,221,19,1)",
    fontSize: 29,
    height: 29,
    width: 21,
    marginTop: 1
  },
  settings: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginLeft: 10
  },
  icon6Row: {
    height: 31,
    flexDirection: "row",
    flex: 1,
    marginRight: wp("60%"),
    marginLeft: 13,
    marginTop: 60
  },
  materialCardWithImageAndTitle8Stack: {
    top: 0,
    left: 0,
    width: wp("100%"),
    height: hp("30%"),
    // position: "relative"
  },
  rect: {
    top: 20,
    left: 0,
    width: wp("100%"),
    height: 89,
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    flexDirection: "row"
  },
  chineduChidera: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: -2,
    fontWeight : "bold",
    fontSize : 20,
    marginLeft : 30
  },
  icon5: {
    color: "rgba(238,221,19,1)",
    fontSize: 23,
    height: 24,
    width: 16,
    marginLeft: 132
  },
  chineduChideraRow: {
    height: 24,
    flexDirection: "row",
    flex: 1,
    marginRight: 6,
    marginLeft: 105,
    marginTop: 35
  },
  materialCardWithImageAndTitle8StackStack: {
    width: wp("100%"),
    height: hp("40%")
  },
  settings1: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 26,
    marginLeft: 53,
    marginTop: 60
  },
  materialCardWithImageAndTitle8StackStackRow: {
    height: hp("20%"),
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 0,
    marginRight: 0
  },
  cupertinoButtonWarning6: {
    height: 53,
    width: wp("40%"),
    borderRadius: 100,
    marginTop: hp("10%"),
    marginLeft: wp("30%")
  }
});

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    order: state.order,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { })(
    Settings
  );
  