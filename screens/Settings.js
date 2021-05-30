import React, { Component,  } from "react";
import { StyleSheet, View,SafeAreaView, Image, Platform,TouchableOpacity } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import PaystackWebView from "react-native-paystack-webview";
import CupertinoButtonWarning6 from "./material/CupertinoButtonWarning6";
import {connect} from "react-redux"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, Left, Body, Title, Button,Picker, Switch } from 'native-base';
import LottieLoader from "react-native-lottie-loader";
import {notifications_allowed} from "../redux/action/authAction"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';
import colors from "./colors/colors";
import {firebase} from "../firebase/firebase"
import {HelpCircle, Bell, DollarSign, Monitor, Briefcase, BookOpen, Book} from "react-native-feather"
// import { nanoid } from 'nanoid'
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
   console.log(this.getRandomString(7))
    const notification= await AsyncStorage.getItem("notification")
    if(notification){
      this.setState({
        notification : true
      })
    }
  }

   getRandomString=(length)=> {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

    render(){
   
        const {user} = this.props.auth
        return (
            <SafeAreaView style={styles.container}> 
 
<StatusBar style="dark" hidden = {Platform.OS === "ios" ? false : true} />
       
                <ScrollView>
             

<TouchableOpacity onPress={()=>{
    this.props.navigation.navigate("profileScreen")
}}>
<View style={styles.materialCardWithImageAndTitle8StackStackRow}>
                <View style={styles.materialCardWithImageAndTitle8StackStack}>
                 

            
                
            

                  <View style={styles.rect}>
                        
                <Image
                          source={require("../assets/avatar.png")}
                      resizeMode="contain"
                      style={styles.image}
                    ></Image>
                      
                    <View style={styles.chineduChideraRow}>

                           
                      <Text style={styles.chineduChidera}>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}</Text>
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
          <Card >
         

      
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}>
            <Bell fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Notifications</Text>
              <Right style={{
                  left : 20
              }}>
                {/* <Icon name="arrow-forward" /> */}
                <Switch style = {{
                  color : "red"
                }}  value={user.allow_notifications ? true : false} onValueChange ={async()=>{
                  // const {token} = this.props.auth
                  if(user.allow_notifications){
                   
                    
                    firebase.database().ref("users/"+firebase.auth().currentUser.uid).update({
                      notifications_allowed : false
                    })
                  }else{
                    
                    firebase.database().ref("users/"+firebase.auth().currentUser.uid).update({
                      notifications_allowed : true
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
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}> 
            <DollarSign fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Payment Method</Text>
              <Right style={{
                  left : -6
              }}> 
                <Icon name="arrow-forward"  style ={{
                  color : "black"
                }}/>
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
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}>
            <Monitor fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Clear Cache</Text>
              <Right style={{
                  left : 0
              }}>
                <Icon name="arrow-forward" style ={{
                  color : "black"
                }} />
              </Right>
             </CardItem>
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}>
            <Briefcase fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Terms & Agreement</Text>
              <Right
              style={{
                  left : -6
              }}>
                <Icon name="arrow-forward"  style ={{
                  color : "black"
                }}/>
              </Right>
             </CardItem>
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}>
            <BookOpen fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Privacy Policy</Text>
              <Right
              style={{
                  left : -6
              }}>
                <Icon name="arrow-forward"  style ={{
                  color : "black"
                }}/>
              </Right>
             </CardItem>
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               this.props.navigation.navigate("Contact Us")
             }}>

           
            <CardItem style ={{
            backgroundColor : "#ebebeb"
          }}>
              <HelpCircle fill = "white" stroke = "black" width = {30} height = {30} />
              <Text style ={{
                 fontFamily : "Quicksand-Bold",
                 paddingLeft : 10
              }}>Contact Us</Text>
              <Right style={{
                  left : 1
              }}>
                <Icon name="arrow-forward" style ={{
                  color : "black"
                }} />
              </Right>
             </CardItem>
             </TouchableOpacity>
           </Card>
        </Content>

          
        
              <CupertinoButtonWarning6
            
                style={styles.cupertinoButtonWarning6}
              ></CupertinoButtonWarning6>
                    </ScrollView>
            </SafeAreaView>
          );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)"
  },


  image: {
    marginTop: 5,
    left: 0,
    width: wp(30),
    borderRadius : 100,
    height: wp(20),
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
    fontFamily : "Quicksand-Bold",
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
    
      backgroundColor : "#ebebeb",
   
    // backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    flexDirection: "row"
  },
  chineduChidera: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    marginTop: -2,
    // fontWeight : "bold",
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
    height: hp("40%"),
    
  },
  settings1: {
    fontFamily : "Quicksand-Bold",
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
    height: hp(7),
    width: wp(80),
    borderRadius: 100,
    marginTop: hp("10%"),
    alignSelf : "center",
    backgroundColor : colors.safron
    // marginLeft: wp("30%")
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
  