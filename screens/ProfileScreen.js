import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import CupertinoButtonPurple from "./material/CupertinoButtonPurple";
import MaterialUnderlineTextbox1 from "./material/MaterialUnderlineTextbox1";
import MaterialUnderlineTextbox2 from "./material/MaterialUnderlineTextbox2";
import MaterialUnderlineTextbox3 from "./material/MaterialUnderlineTextbox3";
import MaterialUnderlineTextbox4 from "./material/MaterialUnderlineTextbox4";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialStackedLabelTextbox8 from "./material/MaterialStackedLabelTextbox8";
import { Container, Header, Content, Card, CardItem, Text, Icon, Right, Left, Body, Input,  List, ListItem, Title, Button,Picker, Switch } from 'native-base';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
import {connect} from "react-redux"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";

class ProfileScreen extends Component{

    render(){
      const {user} = this.props.auth
        return (
            <SafeAreaView  style={styles.container}>
             

<Header style={{
                          backgroundColor : "black",
                          top : hp("2%")
                        }} 
                        androidStatusBarColor = "black"
                        iosBarStyle	= "dark-content"
                        >
                    <Left>
                  <TouchableOpacity  onPress={() => {
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
                        fontFamily : "Quicksand-Bold",
                      marginLeft : wp("10%")
                    }}>Profile</Title>
                  </Body>
                

                
                </Header>  
              {/* <View style={styles.icon4Row}>
                <MaterialCommunityIconsIcon
                  name="arrow-left"
                  style={styles.icon4}
                ></MaterialCommunityIconsIcon>
                <Text style={styles.profile}>Profile</Text>
                <Text style={styles.logOut}>Log out</Text>
              </View> */}
<ScrollView>



<List style ={{marginTop : hp("5%") , backgroundColor : "white"}}>
            <ListItem style={{
              alignContent : "center"
            }}>
              <Text style ={{
                fontSize : 18,
                fontFamily : "Quicksand-Bold",
                 paddingLeft :wp("25%")
              }}>{user && user.phoneNumber}</Text>
            </ListItem>
            <ListItem style ={{
              flex : 1,
              flexDirection : "row",
              height : hp("8%"),
              justifyContent:'flex-start'
            }}>
               <Input disabled placeholder="First name" value = {user && user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} style={{
                 borderColor : "green",
                 fontSize : 18,
                 
                 fontFamily : "Quicksand-Bold",
               }} />
               <View
        style = {{
          height: hp("8%"),
          width: 1,
          backgroundColor: '#cccccc'
        }}
      />
               <Input style ={{fontFamily : "Quicksand-Bold",}} disabled placeholder="Last name" value = { user && user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)} />
            </ListItem>
          

            <ListItem>
            <Input style ={{fontFamily : "Quicksand-Bold",}} disabled placeholder="Email" value = { user &&user.email.charAt(0).toUpperCase() + user.email.slice(1)} />
            </ListItem>
          </List>
          
          <View  style={styles.loremIpsum}>
          <Text style ={{
            paddingTop : 20,
            fontWeight : "300",
            fontFamily : "Quicksand-Bold",
          }}>
                Ride recipts will be sent to your email.
              </Text>
        

          </View>
         
        


              <Card>
            <TouchableOpacity  onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem style={{
              height : hp("8%")
            }}>
              
              <Icon active name="md-home" />
              <Text style ={{   fontFamily : "Quicksand-Bold"}}>Add Home Location</Text>
              <Right style={{
                  left : -5
              }}>
                <Icon name="arrow-forward" style ={{color : "black"}} />
              </Right>
             </CardItem>

             <Divider />
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               alert("Coming Soon!!")
             }}>
            <CardItem  style={{
              height : hp("8%")
            }}>
              <Icon active name="ios-briefcase" />
              <Text  style ={{   fontFamily : "Quicksand-Bold",}} >Add Work Location</Text>
              <Right
              style={{
                  left : -6
              }}>
                <Icon name="arrow-forward"  style ={{color : "black"}}  />
              </Right>
            
             </CardItem>
             <Divider />
             </TouchableOpacity>
             <TouchableOpacity onPress ={()=>{
               this.props.navigation.navigate("Contact Us")
             }}>

           

             </TouchableOpacity>
           </Card>




<View style ={{
  marginTop : "8%"
}}>

  <Card>

    
  <CardItem  style={{
              height : hp("8%")
            }}>
              <Icon active name="md-flag" />
              <Text  style ={{   fontFamily : "Quicksand-Bold",}}>English - US</Text>
              <Right style={{
                  left : 1
              }}>
                <Icon name="arrow-down"  style ={{color : "black"}}  />
              </Right>
              
             </CardItem>

             <Divider />
  <CardItem  style={{
              height : hp("8%")
            }}>
              <Icon active name="md-flag" />
              <Text  style ={{   fontFamily : "Quicksand-Bold",}}>Communication Preference</Text>
              <Right style={{
                  left : -21
              }}>
                <Icon name="arrow-forward" style ={{color : "black"}} />
              </Right>
              
             </CardItem>
             <Divider />
  </Card>
</View>





      
<CupertinoButtonPurple
                style={styles.cupertinoButtonPurple}
              ></CupertinoButtonPurple>
        
              </ScrollView>

            </SafeAreaView >
          );
    }
  
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1, 
    backgroundColor : "#ededed"
  },
  icon4: {
    color: "rgba(0,0,0,1)",
    fontSize: 38
  },
  profile: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 26,
    marginLeft: 3,
    marginTop: 5
  },
  logOut: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginLeft: 156,
    marginTop: 10
  },
  icon4Row: {
    height: 42,
    flexDirection: "row",
    marginTop: 42,
    marginLeft: 5,
    marginRight: 21
  },
  cupertinoButtonPurple: {
    height: 44,
    width: wp("90%"),
    borderRadius: 11,
    marginTop: hp("2%"),
    marginLeft: 21,
    alignSelf: "center"
  },
  materialUnderlineTextbox1: {
    height: 43,
    width: wp("80%"),
    marginTop: hp("7%"),
    marginLeft: 32
  },
  materialUnderlineTextbox2: {
    height: 43,
    width: wp("80%"),
    marginTop: 11,
    marginLeft: 35,
    alignSelf: "center"
  },
  materialUnderlineTextbox3: {
    height: 43,
    width: wp("80%"),
    marginTop: 19,
    marginLeft: 36,
    alignSelf: "center"
  },
  materialUnderlineTextbox4: {
    height: 43,
    width: wp("80%"),
    marginTop: 12,
    marginLeft: 38,
    alignSelf: "center"
  },
  loremIpsum: {
     fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 16,
    fontWeight : "300",
    marginTop: hp("2%"),
    height : hp("10%"),
    marginLeft: 39
  },
  icon2: {
    color: "rgba(0,0,0,1)",
    fontSize: 38
  },
  loremIpsum2: {
     fontFamily : "Quicksand-Bold",
    color: "#121212",
    marginLeft: 86
  },
  addAddress: {
     fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginTop: 1
  },
  loremIpsum2Column: {
    width: 103,
    marginLeft: 13,
    marginTop: 9,
    marginBottom: 10
  },
  icon2Row: {
    height: 42,
    flexDirection: "row",
    marginTop: 89,
    marginLeft: 31,
    marginRight: 175
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 38,
    marginTop: 14
  },
  materialStackedLabelTextbox8: {
    height: 60,
    width: 233,
    marginLeft: 12
  },
  iconRow: {
    height: 60,
    flexDirection: "row",
    marginTop: -112,
    marginLeft: 31,
    marginRight: 46
  },
  englishUs: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginTop: 11
  },
  icon3: {
    color: "rgba(0,0,0,1)",
    fontSize: 40,
    marginLeft: 145
  },
  englishUsRow: {
    height: 45,
    flexDirection: "row",
    marginTop: 85,
    marginLeft: 31,
    marginRight: 49
  }
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(
  ProfileScreen
);
