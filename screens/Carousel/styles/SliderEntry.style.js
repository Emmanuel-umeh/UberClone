import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';
import {

    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        alignSelf : "center"
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    rect1: {
        top: 0,
        left: 0,
        width: wp("100%"),
        height: hp("25%"),
        position: "absolute",
        backgroundColor: "black"
      },
      paymentMethod: {
        fontFamily: "roboto-regular",
        color: "rgba(255,255,255,1)",
        fontSize: 26,
        marginTop: 72,
        marginLeft: 28
      },
      done: {
        fontFamily: "roboto-regular",
        color: "rgba(255,255,255,1)",
        fontSize: 18,
        marginTop: -88,
        marginLeft: wp("90%")
      },
      rect2: {
        top: 131,
        width: wp("90%"),
        height: 72,
        position: "absolute",
        backgroundColor: "rgba(255,255,255,1)",
        left: 28,
        borderRadius: 15
      },
      ellipse: {
        top: 0,
        left: 0,
        width: 60,
        height: 60,
        position: "absolute"
      },
      icon: {
        top: 3,
        left: 9,
        position: "absolute",
        color: "rgba(255,255,255,1)",
        fontSize: 40,
        height: 45,
        width: 40
      },
      ellipseStack: {
        width: 60,
        height: 60
      },
      cash: {
        fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 18
      },
      cash1: {
        fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 14,
        opacity: 0.44,
        marginTop: 4
      },
      cashColumn: {
        width: 154,
        marginLeft: 10,
        marginTop: 8,
        marginBottom: 9
      },
      ellipseStackRow: {
        height: 60,
        flexDirection: "row",
        marginTop: 6,
        marginLeft: 15,
        marginRight: 71
      },
      rect1Stack: {
        width : wp("100%"),
        height: hp("25%"),
        marginTop: hp("3%"),
        marginLeft: 0
      },
      rect3: {
        width: wp("90%"),
        height: hp("50%"),
        backgroundColor: "rgba(255,255,255,1)",
        borderRadius: 15,
        marginTop: 61,
        marginLeft: 26
      },
      card: {
        fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 18,
        marginTop: 27,
        marginLeft: 35
      },
      icon2: {
        color: "rgba(0,0,0,1)",
        fontSize: 32,
        height: 35,
        width: 16
      },
      addCard: {
        fontFamily: "roboto-regular",
        color: "#121212",
        marginLeft: 13,
        marginTop: 9
      },
      icon2Row: {
        height: 35,
        flexDirection: "row",
        marginTop: 16,
        marginLeft: 44,
        marginRight: wp("40%")
      },
    
    
    
    
      rect: {
        width: wp("90%"),
        height: hp("30%"),
        backgroundColor: "rgba(244,180,61,1)",
        borderRadius: 200,
        marginTop: 10,
        alignSelf: "center",
      }, eWallet: {
        fontFamily: "roboto-700",
        color: "rgba(255,255,255,1)",
        fontSize: 25,
        letterSpacing: 3,
        marginTop: 29,
        marginLeft: 24,
      },
      currentAccount: {
        fontFamily: "roboto-regular",
        color: "rgba(255,255,255,1)",
        marginTop: 28,
        fontSize : 20,
        marginLeft: 24,
      },
      n70000: {
        fontFamily: "roboto-700",
        color: "rgba(253,253,253,1)",
        fontSize: 20,
        letterSpacing: 1,
        marginTop: 30,
        marginLeft: wp("65%"),
      },
});