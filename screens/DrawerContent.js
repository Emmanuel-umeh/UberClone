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
                                        uri: 'data:image/png;base64,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'
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




<DrawerItem 
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
                            />

                            
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
                                    alert("Coming Soon")
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