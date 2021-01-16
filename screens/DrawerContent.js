import React, {Component} from 'react';
import { View, StyleSheet } from 'react-native';
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { Divider, TouchableRipple } from "react-native-paper";

import {connect} from "react-redux"
import { StackActions, NavigationActions } from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from "react-native-animatable"
import {logout, setLoading} from "../action/authAction"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Linking } from 'react-native';
// import{ AuthContext } from '../components/context';

 class  DrawerContent extends Component {

    render(){
        //   const paperTheme = useTheme();
        const{user} = this.props.auth
        // console.log("drawer,", user)

          return(
            <View style={{flex:1}}>
                <DrawerContentScrollView {...this.props}>
                    <View style={styles.drawerContent}>
                        <View style={styles.userInfoSection}>

                            <TouchableOpacity onPress={
                                ()=>{
                                    this.props.navigation.navigate("profileScreen")
                                }
                            }>
                            <View style={{flexDirection:'row',marginTop: 15}}>
                                <Avatar.Image 
                                    source={{
                                        uri :"https://lh3.googleusercontent.com/proxy/eFWuCq_eyuJWBx4VS5vzdqUy7VQTjQBkMdJUGbzpJVJLsqB-npD1baX2s3jhiFe7YJRSvij9LObYm5eP4opV5Yfu2vTDtDZpVTzqUwEFYgL4dQxUGsu3ako"   
                                    }}
                                    style ={{
                                        backgroundColor : "white"
                                    }}
                                    size={50}
                                />
                                <View style={{marginLeft:15, flexDirection:'column'}}>
                                    <Title style={styles.title}>{user ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : "John"} </Title>
                                    <Caption style={styles.caption}>View Profile</Caption>
                                </View>
                            </View>
                            </TouchableOpacity>
    
                            {/* <View style={styles.row}>
                                <View style={styles.section}>
                                    <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                    <Caption style={styles.caption}>Following</Caption>
                                </View>
                                <View style={styles.section}>
                                    <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                                    <Caption style={styles.caption}>Followers</Caption>
                                </View>
                            </View> */}
                        </View>

                        
        <Divider
        style={{
          marginTop: 20,
        }}
      />

                            
                        <Drawer.Section style={styles.drawerSection}>

                            <Animatable.View
                            
                            animation = "slideInLeft">
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="home-outline" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17
                                    ,
  fontFamily : "Quicksand-Bold"
                                }}
                                label="Home"
                                onPress={() => {this.props.navigation.navigate('Map')}}
                            />
                            </Animatable.View>
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="account-outline" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17
                                    ,
  fontFamily : "Quicksand-Bold"
                                }}
                                label="Profile"
                                onPress={() => {this.props.navigation.navigate('profileScreen')}}
                            />



<DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="car" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17,
                                    fontFamily : "Quicksand-Bold"
                                }}
                                label="Ride History"
                                onPress={() => {this.props.navigation.navigate('ride_history')}}
                            />




{/* <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="cash" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17,
                                    fontFamily : "Quicksand-Bold"
                                }}
                                label="Payment Method"
                                onPress={() => {this.props.navigation.navigate('add_card')}}
                            /> */}

                            
                            {/* <DrawerItem 
                            
                                icon={({color, size}) => (
                                    <Icon 
                                    name="bookmark-outline" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                label="Bookmarks"
                                onPress={() => {this.props.navigation.navigate('BookmarkScreen')}}
                            /> */}
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="settings-outline" 
                                    color="black"
                                    size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17,
                                    
  fontFamily : "Quicksand-Bold"
                                }}
                                label="Settings"
                                onPress={() => {this.props.navigation.navigate('settings')}}
                            />
                            <DrawerItem 
                                icon={({color, size}) => (
                                    <Icon 
                                    name="account-check-outline" 
                                   color="black"
                                     size={40}
                                    />
                                )}
                                labelStyle ={{
                                    color : "black",
                                    fontWeight : "300",
                          fontSize : 17
                                    ,
  fontFamily : "Quicksand-Bold"
                                }}
                                label="Support"
                                onPress={() => {
                                    
                                    Linking.openURL("https://www.whiteaxis.ng")
                                }}
                            />
                        </Drawer.Section>
                     
                    </View>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem 
                        icon={({color, size}) => (
                            <Icon 
                            name="exit-to-app" 
                           color="black"
                             size={40}
                            />
                            
                        )}
                        labelStyle ={{
                            color : "black",
                            fontWeight : "300",
                  fontSize : 17
                            ,
  fontFamily : "Quicksand-Bold"
                        }}
                        label="Sign Out"
                        
                        onPress={() => {
                           
                            this.props.navigation.closeDrawer()
                            // this.props.setLoading()
                            this.props.logout()

                            // const resetAction = StackActions.reset({
                            //     index: 0,
                            //     actions: [NavigationActions.navigate({ routeName: 'getStarted' })],
                            //   });
                            //   this.props.navigation.dispatch(resetAction);
                        
                        
                        }}
                            
                    />
                </Drawer.Section>
            </View>
        );

    }

  

    // const { signOut, toggleTheme } = React.useContext(AuthContext);

   
}



const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
  });
  
  // export default ProjectForm
  export default connect(mapStateToProps, { logout,setLoading })(DrawerContent);
const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 20,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    
  fontFamily : "Quicksand-Bold"
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });