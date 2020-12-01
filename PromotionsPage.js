import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import {FlatList} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import {scrollInterpolator, animatedStyles} from './CarouselAnimations';

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').height;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
function PromotionsPage({navigation}) {
  const [active, setActive] = useState(0);
  const [flag, setFlag] = useState(false);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([
    // { id: 0, image: '', text1: 'You have spent INR 10,000 on Petrol this month.', text2: ' Want to apply for Petro Card ?', url: "https://www.icicibank.com/" },
    // { id: 1, image: global.baseURL+'customer/aGRmY19iYW5rLnBuZw=', text1: 'Your spend at Spencer’s for Rs. 2500 yesterday was for Food?', text2: '', url: "https://www.hdfcbank.com/" },
    // { id: 2, image: require('./assets/iciciBank_logo.png'), text1: 'Is the monthly payout of Rs 25,000 towards House Rent?', text2: '', url: "https://www.icicibank.com/" },

    {
      id: 0,
      image: require('./assets/PromotionIMage2.png'),
      url: 'https://www.zomato.com/hyderabad',
    },
    {
      id: 1,
      image: require('./assets/promotionImage1.png'),
      url: 'https://www.swiggy.com/',
    },
    {
      id: 2,
      image: require('./assets/PromotionIMage2.png'),
      url: 'https://www.zomato.com/hyderabad',
    },
  ]);
  useEffect(() => {
    console.log('global.thousandsGroupStyle : ' + global.thousandsGroupStyle);

    return () => {
      setFlag(false);
    };
  }, [flag]);

  _renderItem = ({item}) => {
    // if (item.id >= 3) {
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(item.url)}
        style={{height: hp('65')}}>
        <Image
          resizeMode={'stretch'}
          style={{maxWidth: '100%', height: '100%', borderRadius: 15}}
          source={item.image}></Image>
      </TouchableOpacity>
    );
    //}
    // else if (item.id == 0) {
    //   return (
    //     <View
    //       style={{
    //         height: hp("65"),
    //         justifyContent: "center",
    //         borderRadius: 15,
    //         padding: hp("1%"),
    //         backgroundColor: "white",
    //         paddingTop: hp("-0.6%"),
    //         borderWidth: 1,
    //         borderColor: "#DDDDDD",
    //       }}
    //     >
    //       <View
    //         style={{
    //           width: 40,
    //           height: 40,
    //           alignSelf: "center",
    //           marginBottom: hp("3%"),
    //         }}
    //       >
    //         <Image
    //           resizeMode={"contain"}
    //           style={{ maxWidth: "100%", height: "100%", borderRadius: 50 }}
    //           source={require("./assets/demobank.png")}
    //         ></Image>
    //       </View>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           color: "#888888",
    //           paddingBottom: hp("0.5%"),
    //         }}
    //       >
    //         {item.text1}
    //       </Text>
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           fontWeight: "bold",
    //           color: "#888888",
    //         }}
    //       >
    //         {item.text2}
    //       </Text>
    //       <TouchableOpacity
    //         style={styles.button}
    //         onPress={() => Linking.openURL(item.url)}
    //       >
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "white" }}
    //         >
    //           Yes
    //         </Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         style={styles.buttonskip}
    //         onPress={() => navigation.navigate("dashboard")}
    //       >
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
    //         >
    //           No
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <View
    //       style={{
    //         height: hp("65"),
    //         justifyContent: "center",
    //         borderRadius: 15,
    //         padding: hp("1%"),
    //         backgroundColor: "white",
    //         paddingTop: hp("-0.6%"),
    //         borderColor: "#DDDDDD",
    //         borderWidth: 1,
    //       }}
    //     >
    //       {/* <View style={{ width: 40, height: 40, alignSelf: 'center', marginBottom: hp('3%') }}> */}
    //       {item.id == 1 ? (
    //         <View
    //           style={{
    //             width: 50,
    //             height: 50,
    //             alignSelf: "center",
    //             marginBottom: hp("3%"),
    //           }}
    //         >
    //           <Image
    //             resizeMode={"contain"}
    //             style={{ maxWidth: "100%", height: "100%", borderRadius: 50 }}
    //             source={{ uri: item.image }}
    //           ></Image>
    //         </View>
    //       ) : (
    //         <View
    //           style={{
    //             width: 80,
    //             height: 80,
    //             alignSelf: "center",
    //             marginBottom: hp("2%"),
    //           }}
    //         >
    //           <Image
    //             resizeMode={"contain"}
    //             style={{ maxWidth: "100%", height: "100%", borderRadius: 50 }}
    //             source={item.image}
    //           ></Image>
    //         </View>
    //       )}
    //       {/* </View> */}
    //       <Text
    //         style={{
    //           textAlign: "center",
    //           color: "#888888",
    //           paddingBottom: hp("0.5%"),
    //         }}
    //       >
    //         {item.text1}
    //       </Text>
    //       <TouchableOpacity
    //         style={styles.button}
    //         onPress={() => Linking.openURL(item.url)}
    //       >
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "white" }}
    //         >
    //           Yes
    //         </Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity
    //         style={styles.buttonskip}
    //         onPress={() => navigation.navigate("dashboard")}
    //       >
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
    //         >
    //           No
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
  };
  navigateToWebsite = (url) => {
    console.log(url);
    window.location = url;
  };
  return (
    <View>
      <View>
        <Image
          style={{maxWidth: '100%'}}
          source={require('./assets/graph_bg_white(short).png')}></Image>
      </View>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('dashboard')}>
            <View>
              <Image source={require('./assets/icons-back.png')}></Image>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Promotions</Text>
          </View>
        </View>
      </View>
      <View style={{top: wp('-10%')}}>
        <Carousel
          ref={(c) => (carousel = c)}
          data={data}
          renderItem={_renderItem}
          sliderWidth={wp('100%')}
          itemWidth={wp('78%')} // containerCustomStyle={styles.carouselContainer}
          // inactiveSlideShift={0}
          layout={'default'}
          // onScroll={change}
          // layout={'tinder'} layoutCardOffset={'5'}
          onSnapToItem={(index) => setIndex(index)}
          // scrollInterpolator={scrollInterpolator}
          // slideInterpolatedStyle={animatedStyles}
          useScrollView={true}
        />
        {/* <Text style={styles.counter}
                >

                    {index}
                </Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            paddingTop: hp('3%'),
          }}>
          {data.map((i, k) => (
            <Text
              style={
                i.id === index ? styles.activePagination : styles.pagination
              }>
              ⬤
            </Text>
          ))}
        </View>
      </View>
      {/* <FlatList
                data={data}
                horizontal
                onScroll={change}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: hp("-5%") }}
                renderItem={({ item, index }) =>
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={{ width: wp("100%"), height: hp("65"), paddingLeft: wp('15%'), paddingRight: wp('15%') }}>
                        <Image
                            resizeMode={'stretch'}
                            style={{ maxWidth: '100%', height: '100%', borderRadius: 15 }}
                            source={item.image}
                        ></Image>
                    </TouchableOpacity>
                }
            >

            </FlatList>
            <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                {data.map((i, k) => (
                    <Text style={k === active ? styles.activePagination : styles.pagination}>⬤</Text>
                ))
                }
            </View> */}
    </View>
  );
}

export default PromotionsPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('3.5%'),
    width: wp('100%'),
    // height: hp('100%'),
    // zIndex: 10
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    paddingTop: hp('2%'),
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 25,
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  pagination: {
    color: '#5E83F2',
    margin: 3,
    opacity: 0.3,
  },
  activePagination: {
    color: '#5E83F2',
    margin: 3,
  },
  // carouselContainer: {
  //     marginTop: 50
  // },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue',
  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5E83F2',
    borderRadius: 20,
    padding: 9,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    textAlign: 'center',
  },
  buttonskip: {
    backgroundColor: '#DFE4FB',
    borderRadius: 20,
    padding: 9,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    textAlign: 'center',
  },
});
