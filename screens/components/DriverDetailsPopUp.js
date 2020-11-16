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



export default class DriverDetailsPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    
  
    };
    this.sheetRef = React.createRef();
  }


  makeCall = () => {

    const {driver} = this.props
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${driver.phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${driver.phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  };



   renderContent = (driver) => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: hp("80%"),
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
      <Text style = {styles.on_the_way}>Your Ride Is On Its Way</Text>

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

<View>
<Text style = {styles.plate_number}>635-2GS-RB36</Text>
<Text style = {styles.car_color}>Red Car</Text>
<Text style = {styles.rider_name}>Your Rider Is Emmanuel</Text>
<Text style = {styles.meters_away}>100 Meters Away</Text>
</View>


</View>


<Divider/>

<View style = {{flex : 1, flexDirection : "row"}}>
  <Left>
  <EntypoIcon name="location-pin" style={styles.icon1}></EntypoIcon>
  </Left>
  <Body><View>
  <Text style = {styles.location}>Same Global Housing Estate</Text>
    </View></Body>
  <Right>
  <EntypoIcon name="arrow-right" style={styles.icon1}></EntypoIcon>
  </Right>

</View>

    </View>
  );

  render() {

   


    const {driver} = this.props

    console.log("props recieved to driver details popup ", this.props)
    return (
//       <View style={styles.container}>


//         {/* <FlatList
//           style={styles.contentList}
//           columnWrapperStyle={styles.listContainer}
//           data={this.state.data}
//           keyExtractor={(item) => {
//             return item.id;
//           }}
//           renderItem={({ item }) => { */}

          
// {/*                 
// <Divider
//         style={{
//           // marginTop: 10,
//           color : "black"
//         }}
//       /> */}
//              <View style ={{
//                marginTop : hp("2%")
//              }}>

//              <Text>Your Ride is on its way</Text>

//              </View>

//             {/* return ( */}
//               <TouchableOpacity
//                 style={styles.card}
//                 onPress={() => {
//                   // this.clickEventListener(item);
//                   null
//                 }}
//               >

         
//    <Image style={styles.image} source={{ uri: (driver ? driver.profile_picture : "https://www.kindpng.com/picc/m/78-785975_icon-profile-bio-avatar-person-symbol-chat-icon.png") }} />

//                 <View style={styles.cardContent}>
//               <Text style={styles.name}> { driver ? driver.firstname.charAt(0).toUpperCase() + driver.firstname.slice(1) : "John"} {driver ? driver.lastname.charAt(0).toUpperCase() + driver.lastname.slice(1) : "Doe"} </Text>
//                   <Text style={styles.count}>{driver? driver.rides : 0} Rides</Text>

//                   <View style={{ flex: 4, flexDirection: "row" , marginLeft : wp("10%")}}>
                    
//                     {/* To do !!! */}
//                     {/* {driver.rating} */}
//                     <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
//                     <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
//                     <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
//                     {/* <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
//                     <EntypoIcon name="star" style={styles.icon3}></EntypoIcon> */}

//                     <View style={{position : "absolute", marginLeft : wp("30%")}}>
//                     {/* <Text>Time till Arrival</Text> */}
//               {/* <Text style ={{ fontSize : 30, fontWeight : "bold", marginTop : -10}}>2:00</Text> */}

//                     </View>
                   
//                   </View>


//                   <View></View>

//                   <TouchableOpacity
//                     style={styles.followButton}
//                     onPress={this.makeCall} 
//                   >
//                     <Icon name = "ios-call"></Icon>
//                     <Text style={styles.followButtonText}>  Call Driver</Text>
//                   </TouchableOpacity>

//                   {/* <TouchableOpacity
//                     style={styles.cancelButton}
//                     onPress={() => this.clickEventListener(item)}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel Order</Text>
//                   </TouchableOpacity> */}
//                   <View>

               
            
//             </View>
//                 </View>
//                 {/* <View style={styles.icon3Row}>
//               <Text> Rating</Text>
//               <Text style={styles.loremIpsum1}> 4.5</Text>
//               <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
//             </View> */}

           
//               </TouchableOpacity>
//             {/* ); */}
//           {/* }} */}
//         {/* /> */}
//       </View>
   
<>
{/* <View
  style={styles.container}
>
  <Button
    title="Open Bottom Sheet"
    onPress={() => sheetRef.current.snapTo(1)}
  />
</View> */}
<BottomSheet
  ref={this.sheetRef}
  snapPoints={[hp("50%"), hp("30%")]}
  borderRadius={50}
  renderContent={()=>this.renderContent(this.props.driver)}
/>
</>


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
    paddingLeft : wp("26%"),
    top : 10
  },
  rider_name : {
    paddingLeft : wp("11%"),
    top : 10,
    fontSize : 15,
    fontFamily : "Righteous-Regular",
  },
  meters_away : {
    paddingLeft : wp("20%"),
    top : 10,
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
