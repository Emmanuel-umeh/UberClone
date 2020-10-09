import React, { Component } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import google_api from "../keys/google_map";
import _ from "lodash";

class setDestination extends Component {
  constructor(props) {
    super(props);

    this.onChangeDestinationDebounced = _.debounce(
      this.destinationChange,
      1000
    );
  }
  state = {
    destination: null,
    predictions: [],
  };

  destinationChange = async (destination) => {
    // console.log("longitude ", this.props.route.params.longitude);

    const api_url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&region=locality&language=en&key=${google_api}&location=${this.props.route.params.latitude},${this.props.route.params.longitude}&radius=500`;
    const result = await fetch(api_url);
    const json = await result.json();
    this.setState({
      destination,
      predictions: json.predictions,
    });
  };

  locationPressed = (e) => {
    // console.log("latitude and longitude ",
    // e
    // )
  };
  render() {
    // const predictions = this.state.predictions.map((prediction) => (
    //   <TouchableOpacity key={prediction.id} style={styles.button2}>
    //     <View style={styles.icon7Row}>
    //       <EntypoIcon name="home" style={styles.icon7}></EntypoIcon>
    //       <Text style={styles.addHome}>{prediction.description}</Text>
    //     </View>
    //   </TouchableOpacity>
    // ));
    // var v = Object.values(this.state.predictions);

    const predictions = this.state.predictions.map((prediction,key) => (
      <TouchableOpacity
        key={key}
        onPress={async () => {
          // console.log("id , ",prediction.place_id)

          const place_url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${prediction.place_id}&key=${google_api}`;
          const result = await fetch(place_url);
          const json = await result.json();

          console.log("latitude, longitude ", json.result.geometry.location);

          const destination = {
            latitude: json.result.geometry.location.lat,
            longitude: json.result.geometry.location.lng,
          };

        
          // this.props.navigation.navigate("Map", {
          //   destination :{
          //     latitude : json.result.geometry.location.lat,
          //     longitude : json.result.geometry.location.lng
          //   }
          // })
          console.log("passing these logistics selected from set destination screen ", this.props.route.params.logistics)

          this.props.navigation.navigate("Map", {
            destination,
            logistics : this.props.route.params.logistics
          });



          this.props.route.params.selectDestination(destination)
          // returns
          // Object {
          //   "lat": 8.969173699999999,
          //   "lng": 7.440240199999998,
          // }
        }}
        style={styles.button2}
      >
        <View style={styles.icon7Row}>
          <EntypoIcon name="location" style={styles.icon7}></EntypoIcon>
          <Text style={styles.addHome}>{prediction.description}</Text>
        </View>
      </TouchableOpacity>
    ));
    // console.log("predictions", predictions)
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <Animatable.View animation="bounceIn" style={styles.header}>
            <View style={styles.icon3StackStackRow}>
              <View style={styles.icon3StackStack}>
                <View style={styles.icon3Stack}>
                  <EntypoIcon
                    name="dot-single"
                    style={styles.icon3}
                  ></EntypoIcon>
                  <View style={styles.rect2}></View>
                </View>
                <EntypoIcon
                  name="location-pin"
                  style={styles.icon5}
                ></EntypoIcon>
              </View>

              <View style={styles.textInputColumn}>
                <TextInput
                  defaultValue={
                    this.props.route.params
                      ? this.props.route.params.address
                      : "Unknown Road"
                  }
                  style={styles.textInput}
                ></TextInput>
                <TextInput
                  placeholder="Add Destination"
                  onChangeText={this.onChangeDestinationDebounced}
                  style={styles.textInput1}
                ></TextInput>
              </View>

              <EntypoIcon name="plus" style={styles.icon}></EntypoIcon>
            </View>
          </Animatable.View>


          

          <Animatable.View animation="fadeInDownBig" style={styles.footer}>
            {/* <ScrollView> */}
            <TouchableOpacity style={styles.button2}>
              <View style={styles.icon7Row}>
                <EntypoIcon name="home" style={styles.icon7}></EntypoIcon>
                <Text style={styles.addHome}>Add Home</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
              <View style={styles.icon7Row}>
                <EntypoIcon name="briefcase" style={styles.icon7}></EntypoIcon>
                <Text style={styles.addHome}>Add Work</Text>
              </View>
            </TouchableOpacity>

            {predictions}

            {/* </ScrollView> */}
          </Animatable.View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon4: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginLeft: 702,
    marginTop: 209,
  },
  scrollArea: {
    top: 180,
    left: 1,
    position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 0,
    right: 0,
    bottom: 0,
  },
  scrollArea_contentContainerStyle: {
    height: 559,
  },
  rect: {
    top: 0,
    left: 0,
    height: 181,
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.21)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.21)",
    borderStyle: "solid",
    overflow: "visible",
    shadowColor: "rgba(197,181,181,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.35,
    shadowRadius: 0,
    borderRadius: 9,
    borderBottomRightRadius: 23,
    borderBottomLeftRadius: 23,
    right: 1,
  },
  icon3: {
    top: 23,
    left: 0,
    position: "absolute",
    color: "rgba(35,46,182,1)",
    fontSize: 40,
    height: 44,
    width: 40,
  },
  rect2: {
    top: 0,
    left: 20,
    width: 1,
    height: 39,
    position: "absolute",
    backgroundColor: "#E6E6E6",
  },
  icon3Stack: {
    top: 25,
    left: 0,
    width: 40,
    height: 67,
    position: "absolute",
  },
  icon5: {
    top: 0,
    left: 8,
    position: "absolute",
    color: "rgba(105,174,26,1)",
    fontSize: 25,
    height: 27,
    width: 25,
  },
  icon3StackStack: {
    width: 40,
    height: 92,
    marginTop: 8,
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "black",
    height: 44,
    width: 254,
    fontSize: 15,
    opacity: 0.94,
    paddingLeft: 10,
    backgroundColor: "whitesmoke",
  },
  textInput1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 44,
    width: 254,
    fontSize: 15,
    opacity: 0.94,
    backgroundColor: "whitesmoke",
    paddingLeft: 10,
    marginTop: 12,
  },
  textInputColumn: {
    width: 254,
    marginLeft: 6,
  },
  icon: {
    color: "rgba(32,30,14,1)",
    fontSize: 30,
    height: 44,
    width: 40,
    marginTop: 60,
  },
  icon3StackStackRow: {
    height: 100,
    flexDirection: "row",
    marginTop: 57,
    marginLeft: 1,
    marginRight: 19,
  },
  button: {
    top: 684,
    left: 0,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    right: 1,
    bottom: 0,
    flexDirection: "row",
  },
  icon6: {
    color: "rgba(0,0,0,1)",
    fontSize: 27,
    opacity: 0.79,
    height: 29,
    width: 27,
  },
  chooseOnMap: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    opacity: 0.92,
    marginLeft: 4,
    marginTop: 5,
  },
  icon6Row: {
    height: 29,
    flexDirection: "row",
    flex: 1,
    marginRight: 108,
    marginLeft: 79,
    marginTop: 11,
  },
  button2: {
    // top: 181,
    left: 0,
    width: "100%",
    height: 54,
    borderBottomColor: "whitesmoke",
    borderBottomWidth: 1,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    right: 1,
    // flexDirection: "row"
  },
  icon7: {
    color: "rgba(155,145,145,1)",
    fontSize: 27,
    height: 29,
    width: 27,
  },
  addHome: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 15,
    marginLeft: 32,
    marginTop: 3,
  },
  icon7Row: {
    height: 329,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    marginRight: 187,

    marginLeft: 20,
    marginTop: 16,
  },
  scrollAreaStack: {
    flex: 1,
    marginRight: -1,
    marginLeft: -742,
    marginTop: 1,
  },

  header: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "rgba(197,181,181,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 5,
    shadowOpacity: 0.35,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 20,
    // paddingVertical: 30,
  },
});

export default setDestination;
