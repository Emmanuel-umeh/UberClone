import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { ParallaxImage } from "react-native-snap-carousel";
import styles from "../styles/SliderEntry.style";
import store from "../../../redux/store";
import { selectLogistic } from "../../../redux/action/authAction";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";
class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
  };

  get image() {
    const {
      data: { illustration },
      parallax,
      parallaxProps,
      even,
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{ uri: illustration }}
        containerStyle={[
          styles.imageContainer,
          even ? styles.imageContainerEven : {},
        ]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.25)"}
        {...parallaxProps}
      />
    ) : (
      <Image source={{ uri: illustration }} style={styles.image} />
    );
  }

  render() {
    const {
      data
    } = this.props;
    console.log("props passed to slider ", this.props.data)

  

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {}}
      >
        <View style={styles.shadow} />

        <View
          style={{
            width: wp("90%"),
            height: hp("30%"),
            backgroundColor: "rgba(244,180,61,1)",
            borderRadius: 200,
            marginTop: 10,
            alignSelf: "center",
          }}
        >
          <LinearGradient
            // Button Linear Gradient
            colors={["#485461", "#485461", "#28313b"]}
            style={{ height: "100%", width: "100%" }}
          >
            <Text
              style={{
                fontSize: 30,
              }}
              style={{
                fontFamily: "roboto-700",
                color: "rgba(255,255,255,1)",
                fontSize: 25,
                letterSpacing: 3,
                marginTop: 29,
                marginLeft: 24,
              }}
            >
              My Card
            </Text>
            <Text
              style={{
                fontFamily: "roboto-regular",
                color: "rgba(255,255,255,1)",
                marginTop: 28,
                fontSize: 20,
                marginLeft: 24,
              }}
            >
              {data.number}
            </Text>
            <Text
              style={{
                fontFamily: "roboto-700",
                color: "rgba(253,253,253,1)",
                fontSize: 20,
                letterSpacing: 1,
                marginTop: 30,
                marginLeft: wp("65%"),
              }}
            >
              {" "}
              {data.expiry}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  error: state.error,
});

// export default ProjectForm
export default connect(mapStateToProps, {})(SliderEntry);
