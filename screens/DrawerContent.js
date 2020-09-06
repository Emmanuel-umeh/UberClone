import React, { Component } from 'react'
import {View, StyleSheet} from "react-native"
import {
    DrawerContentScrollView,
    DrawerItem
} from "@react-navigation/drawer"

import {

    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from "react-native-paper"


import Icon from "react-native-vector-icons/MaterialCommunityIcons"
export function DrawerContent(props){
    return(
<View style ={{flex :1}}>
 
<DrawerContentScrollView {...props}>
 
    <View style = {styles.drawerContent} >
     <View style = {styles.userInfoSection}>

         <Avatar.Image 
         
         
         source = {
             {
                 uri : 
                 "https://cdn2.vectorstock.com/i/1000x1000/20/76/man-avatar-profile-vector-21372076.jpg"

             }
         }

         size = {50}
         
         />

         <View style = {{marginLeft : 15, flexDirection : 'column'}}>


             <Title style = {styles.title}>Emmanuel Nduka</Title>
             <Caption style= {styles.caption}>Emmanuelsumeh@gmail.com</Caption>
         </View>
     </View>
    </View>
</DrawerContentScrollView>


<Drawer.Section style = {styles.bottomDrawerSection}>
<DrawerItem 


label = "Sign Out"
icon ={
({color,size})=>{
    <Icon
    
    name = "exit-to-app"
    color = {color}
    size = {size}

    />


}}></DrawerItem>

</Drawer.Section>

</View>
    )
}


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
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