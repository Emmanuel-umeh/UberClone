import React, { Component } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import MaterialCardWithImageAndTitle1 from "./material/MaterialCardWithImageAndTitle1";
import MaterialCardWithImageAndTitle2 from "./material/MaterialCardWithImageAndTitle2";
import MaterialCardWithImageAndTitle3 from "./material/MaterialCardWithImageAndTitle3";
import CupertinoButtonWarning from "./material/CupertinoButtonWarning";
import { Button, Header } from "native-base";
import plane from "./material/plane";
import Plane from "./material/plane";

function SetLogistics(props) {
  return (
    <View style={styles.container}>
          {/* <Header />  */}

<SafeAreaView>
 <Text style={styles.selectAVechicle}>Select a vechicle</Text>
      
      </SafeAreaView>


     <ScrollView>
      <MaterialCardWithImageAndTitle1
        style={styles.materialCardWithImageAndTitle1}
      ></MaterialCardWithImageAndTitle1>
      <MaterialCardWithImageAndTitle2
        style={styles.materialCardWithImageAndTitle2}
      ></MaterialCardWithImageAndTitle2>
      
      <MaterialCardWithImageAndTitle3
        style={styles.materialCardWithImageAndTitle3}
      ></MaterialCardWithImageAndTitle3>
       {/* <Plane/> */}
      </ScrollView>

      {/* <CupertinoButtonWarning
        style={styles.cupertinoButtonWarning}
      ></CupertinoButtonWarning> */}

<Button full warning style = {{height:70, top : 10, bottom : 10}}>
                 <Text style ={{fontWeight : "bold", fontSize : 20, color : "white"}} >Select Car</Text>
               </Button>
    
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  materialCardWithImageAndTitle1: {
    height: 151,
    width: 359,
    marginTop: 10,
    marginLeft: 1
  },
  materialCardWithImageAndTitle2: {
    height: 151,
    width: 360,
    marginTop: 10
  },
  materialCardWithImageAndTitle3: {
    height: 151,
    width: 360,
    marginTop: 10
  },
  cupertinoButtonWarning: {
    height: 99,
    width: 299,
    borderRadius: 100,
    marginTop: 24,
    marginLeft: 26
  },
  selectAVechicle: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 22,
    textAlign: "center",
    // position : "relative",
    marginTop: "20%",
    alignSelf: "center"
  }

});

export default SetLogistics;
