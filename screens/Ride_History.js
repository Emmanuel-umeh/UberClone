import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
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

function Ride_History(props) {

  const {user} = props.auth
  return (
    <SafeAreaView style={styles.container}>
           <Header
        style={{
          backgroundColor: "black",
          marginTop : hp("5%")
        }}
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
                      fontWeight : "bold",
                      marginLeft : wp("2%")
                    }}>Ride History</Title>
                  </Body>
                
      </Header>
    
      <Text style={styles.history}>History</Text>
      <Divider style={{
          marginTop: 20,
        }}/>
      <View>
       
        <Text style={styles.loremIpsum}>Same Global Housing Estate, Abuja</Text>
      <Text style={styles.loremIpsum2}>Nov 5 , 2020 15:20:30</Text>
      <Text style={styles.finished}>FINISHED</Text>
     
    
      </View>
      <Divider style={{
          marginTop: 20,
        }}/>
     
      <Text style={styles.loremIpsum3}>
        Kwame Nkrumah Cresent, Abuja,{"\n"}Nigeria
      </Text>
      <Text style={styles.youCancelled}>YOU CANCELLED</Text>
      <Text style={styles.loremIpsum4}>Nov 5 , 2020 15:20:30</Text>

      <Divider style={{
          marginTop: 30,
        }}/>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  history: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 26,
    marginTop: 49,
    marginLeft: wp("35%")
  },
  loremIpsum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginTop: 38,
    marginLeft: 21
  },
  loremIpsum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 6,
    marginLeft: 21
  },
  finished: {
    fontFamily: "roboto-regular",
    color: "rgba(76,187,47,1)",
    marginTop: 5,
    marginLeft: 21
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginTop: 39,
    marginLeft: 21
  },
  youCancelled: {
    fontFamily: "roboto-regular",
    color: "rgba(181,50,34,1)",
    marginTop: 26,
    marginLeft: 21
  },
  loremIpsum4: {
    fontFamily: "roboto-regular",
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
