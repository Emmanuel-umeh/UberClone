import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import BottomSheet from "reanimated-bottom-sheet";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Body, Button, Icon, Left, Right } from "native-base";
import { Divider } from "react-native-paper";

import { connect } from 'react-redux'


 class DriverDetailsPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    
  
    };
    this.sheetRef = React.createRef();
  }


  makeCall = () => {

    const {driver, distance} = this.props
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${driver.phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${driver.phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  };



   renderContent = (driver, distance, order) => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: hp("50%"),
      }}
    >

      <View style = {{
        width : wp("10%"),
        backgroundColor : "#515357",
        padding: 3,
        // left  : wp("40%"),
        alignSelf : "center",
        // height : 2,
        borderRadius : 50
      }}>

      </View>
      <Text style = {styles.on_the_way}>{
        

order.state === "Started" ?
"The Ride Has Begun" :
order.state === "Accepted" || "Pending" ? "Your Ride Is On Its Way" : 
 order.state === "Ended" ? "This Ride Has Ended" : order.state === "Completed" ? "Ride Has Been Completed" : null}</Text>


      <Divider />

<View style ={{flex : 1, flexDirection : "row", justifyContent : "flex-start"}}>


<View>
<Image style={styles.image} source={{ uri: (driver ? driver.profile_picture : "https://www.kindpng.com/picc/m/78-785975_icon-profile-bio-avatar-person-symbol-chat-icon.png") }} />


<View style ={{flex :1, flexDirection : "row",top : 5, justifyContent : "center"}}>
<EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                 <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                  <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
</View>

</View>

<View style ={{flex : 1}}>
<Text style = {styles.plate_number}> {driver ? driver.lisence_number : "635-2GS-RB36"}</Text>
    <Text style = {styles.car_color}>{driver ? driver.vehicle_color : "Red"} {driver ? driver.logistic_type : "Car"}</Text>
<Text style = {styles.rider_name}>Your Rider Is {driver.firstname}</Text>

{order.state === "Accepted" || order.state === "Pending" ? 
<Text style = {styles.meters_away}>{distance ? Math.ceil(distance) : 100} Meters Away</Text>:null }
</View>


</View>


<Divider style ={{ top :hp("4%")}}/>

<View style = {{margin : 20, alignSelf  :"center"}}>
  <Text style = {styles.rider_name}>Destination</Text>
</View>

<Divider/>

<View style = {{flex : 1, flexDirection : "row"}}>
  <Left>
  <EntypoIcon name="location-pin" style={styles.icon1}></EntypoIcon>
  </Left>
  <Body style ={{marginLeft : wp("-70%")}}><View>
  <Text style = {styles.location} numberOfLines ={1} ellipsizeMode='tail'>Same Global Housing Estate</Text>
    </View></Body>
  {/* <Right>
  <EntypoIcon name="arrow-right" style={styles.icon1}></EntypoIcon>
  </Right> */}

</View>

    </View>
  );

  render() {

   


    const {driver, distance} = this.props
    const {order} = this.props.order

    console.log("props recieved to driver details popup ", order)
    return (
<BottomSheet
  ref={this.sheetRef}
  snapPoints={[hp("50%"), hp("30%")]}
  borderRadius={50}

  renderContent={()=>this.renderContent(driver, distance, order)}
/>

   );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 9,
    marginTop: hp("70%"),
    width: wp("100%"),
    backgroundColor: "transparent",
    position: "absolute",
  },



  on_the_way: {
  padding : 20,
  fontFamily : "Righteous-Regular",
  fontSize : 20,
  alignSelf : "center"
  },

  plate_number: {
  paddingLeft : wp("10%"),
  // alignSelf : "flex-end",
  top : 15,
  fontFamily : "Righteous-Regular",
  fontSize : 20,
  alignSelf : "center"
  },



  car_color : {
    // paddingLeft : wp("26%"),
    alignSelf : "center",
    top : 10
  },
  rider_name : {
    // paddingLeft : wp("11%"),
    top : 10,
    fontSize : 15,
    alignSelf : "center",
    fontFamily : "Righteous-Regular",
  },
  meters_away : {
    // paddingLeft : wp("20%"),
    top : 10,
    alignSelf : "center"
    // fontSize : 13,
    // fontFamily : "Righteous-Regular",
  },

  icon1 : {
    fontSize : 30,
    color : "#ed922b"
    // fontSize : 13,
    // fontFamily : "Righteous-Regular",
  },
  icon2 : {
    fontSize : 30,
    color : "#ed922b"
    // fontSize : 13,
    // fontFamily : "Righteous-Regular",
  },
  location : {
    // fontSize : 20,
    // color : "#ed922b",
    fontSize : 17,
    fontFamily : "Righteous-Regular",
  },




  
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: wp("10%"),
    marginTop: 10,
  },
  image: {
    width: wp("25%"),
    height: hp("13%"),
    borderRadius: 45,
    borderWidth: 2,
    top :hp("1%"),
    borderColor: "#ebf0f7",
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginLeft: 20,
    marginRight: 20,
    marginTop: 0,
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    borderRadius: 30,
  },

  name: {
    fontSize: 18,
    flex: 1,
    alignSelf: "center",
    color: "black",
    fontWeight: "bold",
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: "center",
    color: "black",
  },
  followButton: {
    marginTop: 10,
    height: hp("5%"),
    width: wp("35%"),
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  followButtonText: {
    color: "black",
    fontSize: 12,
  },

  cancelButton: {
    marginTop: 10,
    height: hp("4%"),
    width: wp("35%"),
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#db2748",
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
 cancelButtonText: {
    color: "white",
    fontSize: 12,
  },
  
  icon3: {
    color: "gold",
    fontSize: 14,
    height: 15,
    width: 14,
  },

  icon3Row: {
    height: 17,
    flexDirection: "row",
    flex: 1,
    marginRight: 12,
    // marginLeft: wp("90%"),
    marginTop: 4,
    // position : "absolute"
  },
  loremIpsum1: {
    fontFamily: "roboto-regular",
    color: "black",
    marginLeft: 7,
  },
});


const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
  pusher: state.pusher,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(DriverDetailsPopUp);
