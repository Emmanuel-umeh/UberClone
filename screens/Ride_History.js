import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Platform, FlatList } from "react-native";
import {connect} from "react-redux"

import { StatusBar } from 'expo-status-bar';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Divider } from "react-native-paper";
import {firebase} from "../firebase/firebase"

import LottieView from 'lottie-react-native';
import {

  Text,
  
} from "native-base";
  import moment from "moment"
import { ImageBackground } from "react-native";
import colors from "./colors/colors"
import lottie_loader from "./loaders/lottie_loader";
function Item({ order }) {
  return (
    <>
    <Divider style={{
      marginTop: 20,
    }}/>
  <View>
   
    <Text style={styles.loremIpsum}>{order.dropoff.going_address}</Text>
    <Text style ={styles.price} >₦{order.price}</Text>
  <Text style={styles.loremIpsum2} numberOfLines ={1} ellipsizeMode = {'tail'} >{moment(order.createdAt).format(`dddd, MMMM Do YYYY, h:mm:ss a`)}</Text>

  {order.state == "Completed" &&   <Text style={styles.finished}>FINISHED</Text>
 }
  {order.state == "Started" &&   <Text style={styles.finished}>IN PROGRESS</Text>
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
 const Ride_History = (props) =>{
   const [loading, setloading] = useState(true)
   const [history, sethistory] = useState(null)

  useEffect(() => {
    
    try {
      const uid = firebase.auth().currentUser.uid
      const _orders = []
      firebase.database().ref("orders/").orderByChild("owner").equalTo(uid).once("value", function(snapshot){
        const orders = snapshot.val()

        // console.log(orders)
        // const sorted_orders = orders[uid]
        // // console.log({sorted_orders})
        if(orders){
       
          Object.entries(orders).forEach(([key, value]) => _orders.push(value));
        }
        

     

      
      }).then(()=>{
        sethistory(_orders.reverse())
        setloading(false)
      })
    } catch (error) {
      setloading(false)
    }
   
 
  }, [firebase.auth().currentUser.uid])

  const {user} = props.auth
  return (
    <SafeAreaView style={styles.container}>

     {lottie_loader({loading})}

      
      <Text style={styles.history}>History</Text>
      {/* <ScrollView> */}

      <ImageBackground style={{
        width :wp(100),
        height : hp(100),
        // opacity : 0.6
      }} source = {require("../assets/images/background.jpg")}>


 
{!loading && <FlatList
data={history}
renderItem={({ item }) => <Item order={item} />}
initialNumToRender={5}
ListEmptyComponent ={()=>{
  return <>
  <View style = {{
  flex : 1,
  alignContent : "center",
  alignSelf : "center",
  justifyContent : "flex-start",
  marginTop : hp(10)
}}>
  <Text  style ={{
                     fontFamily : "Quicksand-Bold",
                     alignSelf : "center"
                    }} >No History To Show</Text>

<LottieView
                  style = {{
                    height : 200,
                    width : 200
                  }}
                   source={require("../assets/lottie/empty.json")}
                 
                  autoPlay
        
                  loop = {true}
                />
</View>

  </>
}}
keyExtractor={item => item._id}
/> }




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
     

     </ImageBackground>
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
    marginTop: hp(2),
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
