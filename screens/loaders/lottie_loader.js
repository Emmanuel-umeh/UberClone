import React from "react";

import LottieLoader from "react-native-lottie-loader";
export default function lottie_loader({ loading }) {

  return (
    <LottieLoader
      visible={loading}
      source={
      
              require(`../../assets/lottie/loading.json`)
          
      }
    />
  );
}
