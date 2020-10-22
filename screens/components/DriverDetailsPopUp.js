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
  ScrollView,
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default class DriverDetailsPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      userSelected: [],
      data: [
        {
          id: 1,
          name: "John Doe",
          image: "https://www.driverg.com/work/images/driverimage.jpg",
          count: 1211,
        },
        // {id:2,  name: "Housing",    image:"https://img.icons8.com/color/100/000000/real-estate.png",       count:234.722},
        // {id:3,  name: "Jobs",       image:"https://img.icons8.com/color/100/000000/find-matching-job.png", count:324.723} ,
        // {id:4,  name: "Personal",   image:"https://img.icons8.com/clouds/100/000000/employee-card.png",    count:154.573} ,
        // {id:5,  name: "For sale",   image:"https://img.icons8.com/color/100/000000/land-sales.png",        count:124.678} ,
      ],
    };
  }

  clickEventListener = (item) => {
    Alert.alert("Message", "Item clicked. " + item.name);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.contentList}
          columnWrapperStyle={styles.listContainer}
          data={this.state.data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  this.clickEventListener(item);
                }}
              >
                <Image style={styles.image} source={{ uri: item.image }} />

                <View style={styles.cardContent}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.count}>{item.count} Rides</Text>

                  <View style={{ flex: 4, flexDirection: "row" , marginLeft : 12}}>
                    <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                    <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                    <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                    <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
                    <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>

                    <View style={{position : "absolute", marginLeft : wp("30%")}}>
                    {/* <Text>Time till Arrival</Text> */}
              <Text style ={{ fontSize : 30, fontWeight : "bold", marginTop : -10}}>2:00</Text>

                    </View>
                   
                  </View>

                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={() => this.clickEventListener(item)}
                  >
                    <Text style={styles.followButtonText}>View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => this.clickEventListener(item)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                  <View>

               
            
            </View>
                </View>
                {/* <View style={styles.icon3Row}>
              <Text> Rating</Text>
              <Text style={styles.loremIpsum1}> 4.5</Text>
              <EntypoIcon name="star" style={styles.icon3}></EntypoIcon>
            </View> */}

           
              </TouchableOpacity>
            );
          }}
        />
      </View>
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
  contentList: {
    flex: 1,
  },
  cardContent: {
    marginLeft: wp("10%"),
    marginTop: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    top :hp("4%"),
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
    marginTop: 20,
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
    height: hp("4%"),
    width: wp("25%"),
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
    width: wp("25%"),
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
