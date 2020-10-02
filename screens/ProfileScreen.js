import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ImageBackground, Dimensions, ScrollView, Alert } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Svg, { Ellipse } from "react-native-svg";
import EvilIconsIcon from "react-native-vector-icons/EvilIcons";
import MaterialFixedLabelTextbox from "./material/MaterialFixedLabelTextbox";
import MaterialIconTextbox from "./material/MaterialIconTextbox";
import MaterialIconTextbox1 from "./material/MaterialIconTextbox1";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { Content, Item, Label,DatePicker, Picker , Form, Input, Button, Spinner} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Kohana } from 'react-native-textinput-effects';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import {connect} from "react-redux"
import { Ionicons } from "@expo/vector-icons";
const {width,height} = Dimensions.get("window")


class ProfileScreen extends Component {


  constructor(props){
    super(props)
  }


  state = {
    dob : this.props.auth.user.dob? this.props.auth.user.dob : null,
    gender :  this.props.auth.user.gender? this.props.auth.user.gender : "Male",
    firstName : this.props.auth.user.firstName? this.props.auth.user.firstName : null,
    lastName : this.props.auth.user.gender? this.props.auth.user.lastName : null,
    loading : false

  }

  setDate =(e)=>{
    console.log("date", e)
    this.setState({
      dob : e
    })


  }


  onValueChange=(e)=>{
    console.log("value ",e)
    this.setState({
      gender : e
    })
  }


  save =async()=>{
    this.setState({
      loading:true
    })

    await
     setTimeout(() => {
      this.setState({
        loading:false
      })

      Alert.alert(
        "Successful!",
        "Your Profile Has Been Updated"
  			
  		
      )
    }, 3000); 

    // console.log("timeout completed")

   
  }
  

  render(){
    console.log("props profile ", this.props)

    const {user} = this.props.auth
  
    const phoneNumber = user.phoneNumber ? user.phoneNumber.toString() : null
    

    return (
      


      
      <View style={styles.container}>

{this.state.loading ?<Spinner style ={{position : "absolute", top : "50%", left : "40%"}} color='gold' />
    : null }
           <Content>
     
                 <ScrollView>
     
                 <View
          style={{
            height: 55,
            width: 55,
            backgroundColor: "white",
            borderRadius: 50,
            position: "absolute",
            // display: inline-block;

            top: 40,
            left: 30,
            zIndex: 999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="md-menu"
            size={32}
            color="black"
            onPress={() => {
              this.props.navigation.openDrawer();
            }}
          />
        </View>
           <View style={styles.rect3StackStack}>
             <View style={styles.rect3Stack}>
               <View style={styles.rect3}>
                 <View style={styles.icon4Row}
                  onPress={()=>{
                    // props.navigation.goBack()
                    console.log("clicked")
                  }} >
                   
                   {/* <IoniconsIcon
                     name="md-arrow-back"
                     style={styles.icon4}
                     onPress={()=>{
                       // props.navigation.goBack()
                       console.log("clicked")
                     }}
                   ></IoniconsIcon> */}
                   <View  style={styles.icon4}></View>
                   <Text style={styles.editProfile} onPress={()=>{
                     console.log("clicked")
                   }}>EDIT PROFILE</Text>
                 </View>
                 <Svg viewBox="0 0 223.39 221.89" style={styles.ellipse}>
                   <Ellipse
                     stroke="rgba(230, 230, 230,1)"
                     strokeWidth={0}
                     fill="rgba(255,255,255,1)"
                     cx={112}
                     cy={111}
                     rx={112}
                     ry={111}
                   ></Ellipse>
                 </Svg>
               </View>
               <Image
                 source={require("../assets/images/4k-shraddha-kapoor-po-3840x2400.jpg")}
                 resizeMode="contain"
                 style={styles.image}
               ></Image>
     
           
               <ImageBackground
                 source={require("../assets/images/iuyyioik0i9.png")}
                 resizeMode="contain"
                 style={styles.image3}
                 imageStyle={styles.image3_imageStyle}
               >
                 <View style={styles.ellipse2Stack}>
                   <Svg viewBox="0 0 60 60" style={styles.ellipse2}>
                     <Ellipse
                       stroke="rgba(230, 230, 230,1)"
                       strokeWidth={0}
                       fill="rgba(255,204,0,1)"
                       cx={30}
                       cy={30}
                       rx={30}
                       ry={30}
                     ></Ellipse>
                   </Svg>
                   {/* <TouchableOpacity></TouchableOpacity> */}
                   <EvilIconsIcon onPress={()=>{
                     alert("Coming Soon")
                   }} name="camera" style={styles.icon3}></EvilIconsIcon>
                 </View>
               </ImageBackground>
             </View>
             {/* <MaterialFixedLabelTextbox
               style={styles.materialFixedLabelTextbox}
             ></MaterialFixedLabelTextbox> */}
     
     
     
             
           </View>
           
           <View style ={{flex : 3}}> 
     
           <Content>
     
           <Form>
                 <Item stackedLabel>
                   <Label style = {{fontSize : 20, fontWeight : "bold"}}>First Name</Label>
                   <Input textContentType = "name"  placeholder = {user.firstName ? user.firstName : ""} />
                 </Item>
     
                 <Item stackedLabel>
                   <Label style = {{fontSize : 20, fontWeight : "bold"}}>Last Name</Label>
                   <Input textContentType = "familyName"  placeholder = {user.lastName ? user.lastName : ""} />
                 </Item>
     
                 <Item stackedLabel>
                   <Label style = {{fontSize : 20, fontWeight : "bold"}}>Phone Number</Label>
                   <Input disabled textContentType = "telephoneNumber" keyboardType = "number-pad"  placeholder = {user.phoneNumber? phoneNumber.slice(3)  : "Enter Phone Number"} />
                 </Item>
     
                 <View style ={{
                   flex : 1,
                   flexDirection : "row"
                 }}>
     
                   <Item style ={{width : "50%"}}>
                   <DatePicker
                 defaultDate={new Date(1999, 4, 4)}
                 minimumDate={new Date(1920, 1, 1)}
                 maximumDate={new Date(2010, 12, 31)}
                 locale={"en"}
                 timeZoneOffsetInMinutes={undefined}
                 modalTransparent={false}
                 animationType={"slide"}
                 androidMode={"default"}
                 placeHolderText="Date of Birth"
                 textStyle={{ color: "gold" }}
                 placeHolderTextStyle={{ color: "#d3d3d3" }}
                 onDateChange={this.setDate}
                 style={{width : "50%"}}
                 disabled={false}
                 />
                     
                   </Item>
                  
     
                 <Item picker stackedLabel style ={{width : "50%"}}>
                 {/* <Label>First Name</Label> */}
                   <Picker
                     mode="dropdown"
                     iosIcon={<MaterialsIcon name="arrow-down" />}
                     style={{ height: 50, width: 150 }}
                     placeholder="Gender"
                     placeholderStyle={{ color: "#bfc6ea" }}
                     placeholderIconColor="#007aff"
                     selectedValue={this.state.gender}
                     onValueChange={this.onValueChange}
                   >
                     <Picker.Item label="Male" value="Male" />
                     <Picker.Item label="Female" value="Female" />
                     {/* <Picker.Item label="Debit Card" value="key2" />
                     <Picker.Item label="Credit Card" value="key3" />
                     <Picker.Item label="Net Banking" value="key4" /> */}
                   </Picker>
                 </Item>
     
     
                 
     
            
     
                 </View>
     
     
     
                 <Button onPress={this.save} full warning style = {{height:70, top : 10, bottom : 10}}>
                 <Text style ={{fontWeight : "bold", fontSize : 20, color : "white"}} >Save</Text>
               </Button>
               
               
                
                </Form>
          
           </Content>
     
         
             
           </View>
           </ScrollView>
           </Content>
         </View>
        
       );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect3: {
    top: 45,
    left: 70,
    width: 360,
    height: 279,
    position: "relative",
    backgroundColor: "#E6E6E6"
  },
  icon4: {
    color: "rgba(7,7,7,1)",
    fontSize: 38,
    height: 41,
    width: 25
  },
  editProfile: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 24,
    marginLeft: 61,
    marginTop: 6
  },
  icon4Row: {
    height: 41,
    flexDirection: "row",
    marginTop: 18,
    marginLeft: 22,
    marginRight: 104
  },
  ellipse: {
    width: "50%",
    height: "50%",
    marginTop: 4,
    marginLeft: 82
  },
  image: {
    top: 0,
    left: 0,
    width: "100%",
    height: 348,
    position: "absolute",
    opacity: 0.09
  },
  image3: {
    top: 56,
    left: 85,
    width: 304,
    height: 304,
    position: "absolute"
  },
  image3_imageStyle: {},
  ellipse2: {
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    position: "absolute"
  },
  icon3: {
    top: "15%",
    left: 4,
    position: "absolute",
    color: "rgba(128,128,128,1)",
    fontSize: 52,
    height: 58,
    width: 52
  },
  ellipse2Stack: {
    width: 60,
    height: 60,
    marginTop: 194,
    marginLeft: 205
  },
  rect3Stack: {
    top: 0,
    left: 0,
    width: "100%",
    height: 360,
    position: "relative"
  },
  materialFixedLabelTextbox: {
    height: 43,
    width: 310,
    position: "relative",
    left: 104,
    // top: 324
  },
  rect3StackStack: {
    width: 474,
    // height: 367,
    flex : 1,
    marginTop: -21,
    marginLeft: -72
  },
  materialIconTextbox: {
    height: 43,
    width: 327,
    marginTop: 314,
    marginLeft: 17,
    alignSelf: "center"
  },
  materialIconTextbox1: {
    height: 43,
    width: 318,
    marginTop: -309,
    marginLeft: 21,
    alignSelf: "center"
  },
  rect: {
    width: 163,
    height: 68,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
    flexDirection: "row"
  },
  nov131897: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginTop: 2
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 25,
    height: 27,
    width: 25,
    marginLeft: 8
  },
  nov131897Row: {
    height: 27,
    flexDirection: "row",
    flex: 1,
    marginRight: 5,
    marginLeft: 9,
    marginTop: 24
  },
  rect2: {
    width: 124,
    height: 68,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
    flexDirection: "row",
    marginLeft: 23
  },
  female: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginTop: 2
  },
  icon2: {
    color: "rgba(1,1,1,1)",
    fontSize: 25,
    height: 27,
    width: 25,
    marginLeft: 19
  },
  femaleRow: {
    height: 27,
    flexDirection: "row",
    flex: 1,
    marginRight: 6,
    marginLeft: 9,
    marginTop: 24
  },
  rectRow: {
    height: 68,
    flexDirection: "row",
    marginTop: 79,
    marginLeft: 32,
    marginRight: 18
  },
  birthDate: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20
  },
  gender: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 92
  },
  birthDateRow: {
    height: 24,
    flexDirection: "row",
    marginTop: -96,
    marginLeft: 40,
    marginRight: 76
  }
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(
  ProfileScreen
);
