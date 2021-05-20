import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import {connect} from "react-redux"
import {textMessageAuth, setLoading} from "../redux/action/authAction"
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import {firebase} from "../firebase/firebase"
import Otp from "./Otp";
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { Notifier, Easing,NotifierComponents  } from 'react-native-notifier';
import ErrorModal from "./components/ErrorModal";

const firebaseConfig = {
  apiKey: "AIzaSyAWKTvm6h-saC3837h8yTif-XO_wJlO-9Y",
  authDomain: "whiteaxis.firebaseapp.com",
  databaseURL: "https://whiteaxis-default-rtdb.firebaseio.com",
  projectId: "whiteaxis",
  storageBucket: "whiteaxis.appspot.com",
  messagingSenderId: "619115521529",
  appId: "1:619115521529:web:01fdcf04955967383bc928",
  measurementId: "G-39MZDRL8G6"
};
let rootRef = firebase.database().ref();

class PhoneNumber extends Component {
  constructor(props) {
    super(props);

    this.recaptchaVerifier = React.createRef(null);
  }

  state = {
    number: null,
    confirmation : null,
    modal_visible: false,
    error_msg : null
  };

// componentDidMount() {
//     LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
// }

  _onPressHandler() {
    this.loadingButton && this.loadingButton.showLoading(true);

    // mock
    // setTimeout(() => {
    //   this.loadingButton.showLoading(false);
    // }, 2000);
    this.mobileNumber()
  }


  hideLoader =()=>{
    this.loadingButton && this.loadingButton.showLoading(false);
  }

  concatNumber= (phoneNumber)=>{

    var number 
  if(phoneNumber[0] == 0){

    var edited_number = phoneNumber.replace(phoneNumber[0], '');

    number = "+234" + edited_number

  }else{
    number = "+234" + phoneNumber
  }

     
    console.log("concat number ", number)
    // this.props.setLoading()
    //  this.props.textMessageAuth(number, this.hideLoader)
    try {
      
    rootRef
    .child("users")
    .orderByChild("phone_number")
    .equalTo(number)
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
         Notifier.showNotification({
          title: "Signup Error",
       
          description:'oops!, someone already signed up with this number',
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          componentProps: {
            alertType: 'error',
          },
          // onHidden: () => console.log("Hidden"),
          // onPress: () => console.log("Press"),
          hideOnPress: true,
        });
        // alert("");
        return this.hideLoader();
      } else {
        console.log("not found");
        this.signUpFirebase(number)
      }
    });
    } catch (error) {
      console.log({error})
      // Notifier.showNotification({
      //   title: "Error",
     
      //   description:'oops!, something went wrong.',
      //   duration: 3000,
      //   showAnimationDuration: 800,
      //   showEasing: Easing.bounce,
      //   // onHidden: () => console.log("Hidden"),
      //   // onPress: () => console.log("Press"),
      //   hideOnPress: true,
      //   componentProps: {
      //     alertType: 'error',
      //   }
      // });

      this.setState({
        error_msg : "oops!, something went wrong"
      })

      return this.hideLoader();
    }

    // console.log({result})
    // this.props.navigation.navigate("otp")

  }


  signUpFirebase = async (number) => {
    try {
      // const phoneProvider = new firebase.auth.PhoneAuthProvider();
      // const verificationId = await phoneProvider.verifyPhoneNumber(
      //   number,
      //   this.recaptchaVerifier.current
      // );
  
      // this.setState({verificationId})
      console.log({number})

      const confirmation = await firebase.auth().signInWithPhoneNumber(number, this.recaptchaVerifier.current);
  
      this.setState({confirmation})

      this.setState({number})

      Notifier.showNotification({
        title: "Success",
     
        description:'Verification code has been sent to your phone.',
        Component: NotifierComponents.Alert,
        duration: 3000,
        showAnimationDuration: 800,
        showEasing: Easing.bounce,
        // onHidden: () => console.log("Hidden"),
        // onPress: () => console.log("Press"),
        hideOnPress: true,
        componentProps: {
          alertType: 'success',
        }
        
      });
      return this.hideLoader();
    } catch (error) {
      console.log({error})
      // Notifier.showNotification({
      //   title: "Error",
     
      //   description:'oops!, something went wrong.',
      //   duration: 3000,
      //   showAnimationDuration: 800,
      //   showEasing: Easing.bounce,
      //   // onHidden: () => console.log("Hidden"),
      //   // onPress: () => console.log("Press"),
      //   hideOnPress: true,
      //   componentProps: {
      //     alertType: 'error',
      //   },
      //   componentProps: {
      //     alertType: 'error',
      //   }
      // });

      this.setState({
        error_msg : "oops!, something went wrong"
      })
      return this.hideLoader();

    }
  
 
  }

  mobileNumber = () => {
    try {
      
    const number = this.state.number ? this.state.number.replace(/\s+/g, '') : null

    if(!number ||  number.length < 10||  number.length > 11){
      this.loadingButton && this.loadingButton.showLoading(false);

    return  this.setState({
        error_msg : "Please enter a valid phone number"
      })
    
     }
 

    "all zeros ? !",/^\d+$/.test(number.toString() ? 
    
    this.concatNumber(number)
    : () => {
      // Notifier.showNotification({
      //   title: "Error",
     
      //   description:'Please enter just numbers',
      //   duration: 3000,
      //   showAnimationDuration: 800,
      //   showEasing: Easing.bounce,
      //   // onHidden: () => console.log("Hidden"),
      //   // onPress: () => console.log("Press"),
      //   hideOnPress: true,
      //   componentProps: {
      //     alertType: 'error',
      //   }
      // })
      this.setState({
        error_msg : "Please enter just numbers"
      })
      this.hideLoader()
    }
 
    ) 
    } catch (error) {
    
      this.setState({
        error_msg : "oops!, something went wrong."
      })
      return this.hideLoader();
    }

  };

  componentWillUnmount(){
    this.loadingButton && this.loadingButton.showLoading(false);
  }

  toggleModal = () => {
    this.setState({
      modal_visible : false,
      error_msg : null
    })
  }


  componentDidUpdate(prevProps){

    // console.log("error ", this.props.error.id.length)
    if(this.props.error.id.length > 0){
      this.loadingButton && this.loadingButton.showLoading(false);
    }
  }
  render() {
    // console.log("number", this.state.number);
    // console.log("endpoint details ", this.props.auth)
   if(!this.state.confirmation){
    return (
      

      
      
      <Animatable.View animation="slideInUp" style={styles.container}>

{this.state.error_msg && <ErrorModal modal_visible = {this.state.modal_visible} error_msg = {this.state.error_msg} toggleModal = {this.toggleModal} />}

<FirebaseRecaptchaVerifierModal
        ref={this.recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <ScrollView>
      <Text style={styles.loremIpsum}>Enter your mobile number</Text>
        <View style={styles.rect}></View>
        <View style={styles.loremIpsum2Row}>
          <Text style={styles.loremIpsum2}>+234</Text>
          <TextInput
            onChangeText={(e) => {
              this.setState({
                number: e,
              });

             
              // console.log("value ", e)
            }}
             placeholderTextColor = "black"
            keyboardType="number-pad"
            maxLength={11}
            placeholder="phone number"
            style={styles.loremIpsum3}
          ></TextInput>
        </View>

      <View style={styles.group}>
          <View style={styles.loremIpsum4Row}>
            {/* <Text style={styles.loremIpsum4}>or connect with social</Text> */}
            {/* <IoniconsIcon
              name="md-arrow-round-forward"
              style={styles.icon2}
            ></IoniconsIcon> */}
          </View>
        </View>
        <View style={styles.loremIpsum5Row}>
          <Text style={styles.loremIpsum5}>
            By continuing you may receive an{"\n"}SMS for verification. Message
            and{"\n"}data rates may apply.
          </Text>
          {/* <EntypoIcon
            onPress={() => {
            
              this.mobileNumber();
              
            }}
            name="chevron-with-circle-right"
            style={styles.icon3}
          ></EntypoIcon> */}
        <View  style = {styles.icon3}>
        <AnimateLoadingButton
          ref={c => (this.loadingButton = c)}
          width={70}
          height={50}
          title="Verify"
         
          titleFontSize={16}
          titleWeight={'100'}
          titleColor="rgb(255,255,255)"
          backgroundColor="#000000"
          borderRadius={30}
          onPress={this._onPressHandler.bind(this)}
          useNativeDriver = {true}
        />

        </View>

        </View>
          </ScrollView>
        

       
      </Animatable.View>
    );
   }
   else {
     return <Otp user = {this.props.route.params} state = {this.state} setState = {this.setState} toggleModal = {this.toggleModal} />
   }
   
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent : "space-evenly"
  },
  loremIpsum: {
  fontFamily : "Quicksand-Bold",
    color: "black",
    fontSize: 22,
    marginTop: hp("20%"),
    marginLeft: 24,
  },
  rect: {
    width: wp("50%"),
    height: 1,
    backgroundColor: "rgba(0,0,0,1)",
    fontWeight : "bold",
    marginTop: hp(10),
    marginLeft: wp("35%"),
  },
  loremIpsum2: {
  fontFamily : "Quicksand-Bold",
    color: "#121212",
    lineHeight: 22,
    fontSize: 22,
    marginTop: hp("1%"),
  },
  loremIpsum3: {
  fontFamily : "Quicksand-Bold",
    color: "black",
    fontSize: 22,
    opacity: 0.6,
    width : wp(60),
    marginLeft: wp(10),
    marginTop : -wp(1),
    paddingLeft : wp(1)
  },
  loremIpsum2Row: {
    height: hp("5%"),
    flexDirection: "row",
    marginTop: -hp("5%"),
    marginLeft: wp(15),
    // marginRight: wp(40),
  },
  icon: {
    color: "rgba(0,0,0,1)",
    fontSize: 30,
    top: hp("5%")
  },
  back: {
  fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize: 22,
    marginLeft: 13,
    marginTop: hp("5%"),
  },

  group: {
    width: wp(100),
    height: 44,
    flexDirection: "row",
    marginTop: hp("20%"),
    marginLeft: wp(5),
  },
  loremIpsum4: {
  fontFamily : "Quicksand-Bold",
    color: "lightblue",
    fontSize: 22,
    marginTop: 9,
  },
  icon2: {
    color: "lightblue",
    fontSize: 40,
    marginLeft: 24,
  },
  loremIpsum4Row: {
    height: 44,
    flexDirection: "row",
    flex: 1,
  },
  loremIpsum5: {
  fontFamily : "Quicksand-Bold",
    color: "#121212",
    fontSize : 15,
    marginTop: 3,
  },
  icon3: {
    color: "rgba(1,1,1,1)",
    fontSize: 50,
    marginLeft: wp(4),
    marginTop : 10
  },
  loremIpsum5Row: {
    height: hp("20%"),
    top : hp("10%"),
    flexDirection: "row",
    width : wp("100%"),
    marginBottom: hp("1%"),
    
    marginLeft: wp("5%"),
    marginRight: wp("5%"),
  },
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {textMessageAuth, setLoading })(
  PhoneNumber
);
