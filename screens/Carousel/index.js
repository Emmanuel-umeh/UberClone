import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import styles, { colors } from './styles/index.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import { scrollInterpolators, animatedStyles } from './utils/animations';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;

export default class Example extends Component {

    constructor (props) {
      
        super(props);
       let  navigation = props.navigation

       let data = props.cards
       console.log({data})
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            navigation :navigation,
            data : data,
            
        };
    }

    componentDidMount(){
        console.log("mounted with ", this.state.navigation)
    }

    _renderItem ({item, index, }) {
        // console.log("render method " , item)
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }



    layoutExample (number, title, type) {
        const isTinder = type === 'tinder';
        return (
            <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                {/* <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{`Example ${number}`}</Text> */}
                {/* <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{title}</Text> */}
                <Carousel
                 ref={c => this._slider1Ref = c}
                  data={ this.state.data}
                  renderItem={ this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  layout={type}
                  loop={false}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />

<Pagination
                  dotsLength={ this.state.data.length}
                  activeDotIndex={this.state.slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'gray'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.9}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    get gradient () {
        return (
            <LinearGradient
              colors={[colors.background1, colors.background2]}
              startPoint={{ x: 1, y: 0 }}
              endPoint={{ x: 0, y: 1 }}
              style={styles.gradient}
            />
        );
    }

    render () {
     
        const example3 = this.layoutExample(3, '"Stack of cards" layout | Loop', 'stack');
      

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    { this.gradient }
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >

{ example3 }
                     
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}