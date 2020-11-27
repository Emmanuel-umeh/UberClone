import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import {logout} from "../../action/authAction"
import {connect} from "react-redux"
function CupertinoButtonWarning6(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]
    
    }
    
    onPress ={()=>{
      // alert("Logging out")
      props.logout()
    }}>
      <Text style={styles.logOut}>Log out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  logOut: {
    color: "#fff",


      fontFamily : "Righteous-Regular",

    fontSize: 17
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
  order: state.order,
});

// export default ProjectForm
export default connect(mapStateToProps, { logout })(
  CupertinoButtonWarning6
);
