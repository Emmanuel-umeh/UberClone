import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView, FlatList } from "react-native";
import {connect} from "react-redux"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Divider } from "react-native-paper";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Right,
  Left,
  Body,
  Title,
  Button,
  Switch,
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
  import moment from "moment"

function Item({ order }) {
  return (
    <>
    <Divider style={{
      marginTop: 20,
    }}/>
  <View>
   
    <Text style={styles.loremIpsum}>{order.endLocationName}</Text>
    <Text style ={styles.price} >₦{order.price}</Text>
  <Text style={styles.loremIpsum2} numberOfLines ={1} ellipsizeMode = {'tail'} >{moment(order.date_created).format(`dddd, MMMM Do YYYY, h:mm:ss a`)}</Text>

  {order.state == "Completed" &&   <Text style={styles.finished}>FINISHED</Text>
 }
  {order.state == "Ended" &&   <Text style={styles.finished}>FINISHED</Text>
 }


 {order.state == "Cancelled" &&  <Text style={styles.youCancelled}>YOU CANCELLED</Text>}

 {order.state == "Accepted" &&  <Text style={styles.youCancelled}>PENDING</Text>}
 {order.state == "Pending" &&  <Text style={styles.youCancelled}>PENDING</Text>}


  </View>
</>
  );
}

function Ride_History(props) {

  const {user} = props.auth
  // console.log({user})
  return (
    <SafeAreaView style={styles.container}>
        <Header style={{
                          backgroundColor : "black",
                          top : hp("2%")
                        }} 
                        androidStatusBarColor = "black"
                        iosBarStyle	= "dark-content"
                        >
        <Left>
          <TouchableOpacity onPress={() => {
                props.navigation.pop();
              }}> 
          <Button transparent>
            <Icon
              name="arrow-back"
        
            />
          </Button>

          </TouchableOpacity>
         
        </Left>
        <Body>
                    <Title style ={{
                     fontFamily : "Quicksand-Bold",
                      
                      marginLeft : wp("2%")
                    }}>Ride History</Title>
                  </Body>
                  <Right></Right>   
      </Header>
    
      <Text style={styles.history}>History</Text>
      {/* <ScrollView> */}

 
{user.orders ? 
<FlatList
data={user.orders.reverse()}
renderItem={({ item }) => <Item order={item} />}
initialNumToRender={5}
ListEmptyComponent ={()=>{
  return <>
  <View style ={{
    marginTop : hp(20)
  }}>
    <Text style={{
      fontFamily : "Quicksand-Bold",
      alignSelf : "center"
    }}> No Ride History</Text>
  </View>
  </>
}}
keyExtractor={item => item._id}
/>
: <View>
  <Text  style ={{
                     fontFamily : "Quicksand-Bold",
                      
                      marginLeft : wp("2%")
                    }} >No History To Show</Text>
</View>
}


{/* </ScrollView> */}
  
      {/* <Divider style={{
          marginTop: 20,
        }}/>
     
      <Text style={styles.loremIpsum3}>
        Kwame Nkrumah Cresent, Abuja,{"\n"}Nigeria
      </Text>
      <Text style={styles.youCancelled}>YOU CANCELLED</Text>
      <Text style={styles.loremIpsum4}>Nov 5 , 2020 15:20:30</Text>

      <Divider style={{
          marginTop: 30,
        }}/> */}
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  history: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 26,
    marginTop: 49,
    // marginLeft: wp("35%")
    alignSelf: "center"
  },
  loremIpsum: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginTop: 38,
    marginLeft: 21
  },
  price: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginLeft: 21
  },
  loremIpsum2: {
    fontFamily : "Quicksand-Bold",
    color: "#121212",
    marginTop: 6,
    marginLeft: 21
  },
  finished: {
    fontFamily : "Quicksand-Bold",
    color: "rgba(76,187,47,1)",
    marginTop: 5,
    marginLeft: 21
  },
  loremIpsum3: {
   fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 18,
    marginTop: 39,
    marginLeft: 21
  },
  youCancelled: {
   fontFamily : "Quicksand-Bold",
    color: "rgba(181,50,34,1)",
    marginTop: 26,
    marginLeft: 21
  },
  loremIpsum4: {
   fontFamily : "Quicksand-Bold",
    color: "#121212",
    marginTop: -39,
    marginLeft: 21
  }
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, { })(
  Ride_History
);
