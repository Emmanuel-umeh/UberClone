import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

const WIDTH = Dimensions.get('window').width
class SearchInput extends Component{


  
  render(){
    return(
      <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data);
        console.log(details);
      }}
      getDefaultValue={() => {
        return ''; // text input default value
      }}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyA4iUtzUInPyQUDlSwkPU2EXGvbEXWbCbM',
        language: 'en', // language of the results
        types: '(cities)', // default: 'geocode'
      }}
      styles={{
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
        container : {
         zIndex : 9,
          position : 'absolute',
          flexDirection : 'row',
          width : WIDTH - 40,
          height : 200,
          top : 110,
          left:20,
          borderRadius  :2,
          backgroundColor : 'white',
          alignItems : 'center',
          shadowColor : "#000000",
          elevation : 7,
          shadowRadius : 3,
          shadowOpacity: 1.0
      

        }
      }}
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel='Current location'
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        types: 'food',
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address',
      }}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3',
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={[homePlace, workPlace]}
      predefinedPlacesAlwaysVisible={true}
    />
    )
  }
}


const styles = StyleSheet.create({
  destination : {
    zIndex : 9,
    position : 'absolute',
    flexDirection : 'row',
    width : WIDTH - 40,
    height : 60,
    top : 110,
    left:20,
    borderRadius  :2,
    backgroundColor : 'transparent',
    alignItems : 'center',
    shadowColor : "#000000",
    elevation : 7,
    shadowRadius : 3,
    shadowOpacity: 1.0



},


})
export default SearchInput;
