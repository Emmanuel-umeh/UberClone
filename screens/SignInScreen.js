import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";

import { loadUser } from "../action/authAction";
class SignInScreen extends Component {
  componentDidMount() {
    console.log("props ", this.props.navigation);
    this.props.loadUser();
  }

  state = {
    email: "",
    password: "",
    secureTextEntry: true,
    check_text_input_change: false,
  };

  textInputChange = (val) => {
    if (val.length != 0) {
      this.setState({
        ...this.state,
        email: val,
        check_text_input_change: true,
      });
    } else {
      this.setState({
        ...this.state,
        email: val,
        check_text_input_change: false,
      });
    }
  };

  handlePasswordChange = (val) => {
    if (val.length != 0) {
      this.setState({
        ...this.state,
        password: val,
        // check_text_input_change: true,
      });
    } else {
      this.setState({
        ...this.state,
        email: val,
        // check_text_input_change: false,
      });
    }
  };

  security = () => {
    this.setState({
      ...this.state,
      secureTextEntry: !this.state.secureTextEntry,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Login </Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <Text style={styles.text_footer}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />

            <TextInput
              placeholder="Your Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {
                this.textInputChange(val);
              }}
            />
            {this.state.check_text_input_change ? (
              <Animatable.View animation="bounceIn">
                <FontAwesome name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          {/* Paassword */}
          <Text
            style={
              (styles.text_footer, { marginTop: 35, fontFamily: "charm-bold" })
            }
          >
            Password
          </Text>
          <View style={styles.action}>
            <FontAwesome name="lock" color="#05375a" size={20} />

            <TextInput
              placeholder="Your Password"
              secureTextEntry={this.state.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => {
                this.handlePasswordChange(val);
              }}
            />

            {this.state.secureTextEntry ? (
              <TouchableOpacity
                onPress={() => {
                  this.security();
                }}
              >
                <FontAwesome name="eye-slash" color="black" size={20} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.security();
                }}
              >
                <FontAwesome name="eye" color="green" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.button} >
            <LinearGradient
              colors={["#08d4c44", "#01ab9d"]}
              style={styles.signIn}
            >
              <TouchableOpacity style={styles.signIn} onPress ={()=>{

this.props.navigation.navigate("Map")
}}>
                <Text
                  style={
                    (styles.textSign,
                    {
                      color: "#fff",
  
                      fontFamily: "charm-bold",
                    })
                  }
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={[
                styles.signIn,
                {
                  borderColor: "#000000",
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}
            >
              <Text
                style={{ fontFamily: "charm-bold" }}
                onPress={() => {
                  this.props.navigation.navigate("SignUpScreen");
                }}
              >
                Sign Up
              </Text> 
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { loadUser })(SignInScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    // fontWeight: "bold",
    fontSize: 30,
    fontFamily: "charm-bold",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,

    fontFamily: "charm-bold",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",

    fontFamily: "charm-bold",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",

    fontFamily: "charm-bold",
  },
});
