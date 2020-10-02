// In App.js in a new project

import * as React from "react";
import { useState } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { NotifierWrapper } from "react-native-notifier";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabScreen, {
  HomeStackScreen,
  DetailsStackScreen,
} from "./screens/MainTabScreen";
import DrawerContent from "./screens/DrawerContent";
import RootStackScreen from "./screens/RootStackScreen";

// handles all my navigation for redux
import { navigationRef } from "./rootNavigation";

import * as Font from "expo-font";
import { AppLoading } from "expo";

import { connect } from "react-redux";
import { loadUser, setUserToken } from "./action/authAction";

import AuthenticatedStack from "./screens/AuthenticatedStack";
import AsyncStorage from "@react-native-community/async-storage";
const Drawer = createDrawerNavigator();
import LoadingView from "react-native-loading-view";
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    loading: true,
    completed: false,

    reduxLoading: this.props.auth.isLoading,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      "charm-bold": require("./assets/fonts/Charm-Bold.ttf"),
      //   // 'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
      "charm-regular": require("./assets/fonts/Charm-Regular.ttf"),

      "roboto-700": require("./assets/fonts/roboto-700.ttf"),
      "roboto-regular": require("./assets/fonts/roboto-regular.ttf"),
    });

    await this.getToken();
    await this.props.loadUser();
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
   

    // console.log("Redux props ", this.props)
  };

  // componentDidUpdate(prevProps) {
  //   console.log("prevprops ", prevProps.auth.isLoading);
  //   const { isLoading } = this.props.auth;
  //   console.log("currentprops", isLoading);
  //   if (prevProps.auth.isLoading !== isLoading) {
  //     this.setState({
  //       reduxLoading: isLoading,
  //     });
  //   }
  // }

  getToken = async () => {
    var token = await AsyncStorage.getItem("token");
    console.log("app js ", token);

    this.props.setUserToken(token);
    // token = token
    return token;
  };

  // _renderNextButton = () => {
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.buttonCircle}>
  //         <Icon
  //           name="md-arrow-round-forward"
  //           color="rgba(255, 255, 255, .9)"
  //           size={24}
  //         />
  //       </View>
  //       <View style={{ paddingTop: 10 }}>
  //         <Text style={styles.text}>Next</Text>
  //       </View>
  //     </View>
  //   );
  // };
  // _renderDoneButton = () => {
  //   return (
  //     <View style={styles.row}>
  //       <View style={styles.buttonCircle}>
  //         <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
  //       </View>

  //       <View style={{ paddingTop: 10 }}>
  //         <Text style={styles.text}>Done</Text>
  //       </View>
  //     </View>
  //   );
  // };
  // _renderItem = ({ item }) => {
  //   return item.design;
  // };

  _onDone = () => {
    // navigation.navigate("SignUpScreen")
    // when user is done with intro screens
    this.setState({
      completed: true,
    });
  };

  render() {
    const { isAuthenticated, type, token, isLoading } = this.props.auth;

    // console.log("last type dispatched ",type)

    //   console.log("is loading??!! ", isLoading);
    //   console.log("redux loading " , this.state.reduxLoading)
    if (this.state.loading) {
      return <AppLoading />;
    } else {
      // console.log("second!!!");
      return (

          <NotifierWrapper>
            <NavigationContainer ref={navigationRef}>
              <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                initialRouteName="Home"
              >
                {isAuthenticated ? (
                    <Drawer.Screen name="HomeDrawer" component={AuthenticatedStack} />
                    // <Drawer.Screen name="Home" component={RootStackScreen} />
                    ) : (
                  // <Drawer.Screen name="HomeDrawer" component={AuthenticatedStack} />
                  <Drawer.Screen name="Home" component={RootStackScreen} />
                )}

                {/* <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Details" component={DetailsStackScreen} /> */}
              </Drawer.Navigator>

              {/* <AppIntroSlider  renderItem={this._renderItem}   renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton} data={slides} onDone={this._onDone}/> */}
              {/* <RootStackScreen /> */}
            </NavigationContainer>
          </NotifierWrapper>
      
      );
    }
  }

  // const [dataLoaded, setDataLoaded] = useState(false)
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, { loadUser, setUserToken })(App);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingBottom: 5,
  },

  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0, 0, 0, .2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  slide: {
    flex: 1,
    backgroundColor: "#000000",
  },
  image: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontWeight: "bold",

    fontFamily: "charm-regular",

    fontStyle: "normal",
    // fontWeight: "bold",
    // lineHeight : 45,
    fontSize: 15,
  },
});
