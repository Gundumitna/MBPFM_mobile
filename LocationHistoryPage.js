import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {FlatList} from 'react-native-gesture-handler';
import Moment from 'moment';
import ToggleSwitch from 'toggle-switch-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, {Marker} from 'react-native-maps';
import AmountDisplay from './AmountDisplay';

const LocationHistoryPage = ({route, navigation}) => {
  let ls = require('react-native-local-storage');
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  const [image, setIMage] = useState();
  const [label, setLabel] = useState();
  const [heading, setHeading] = useState();
  const [scrollOffset, setScrollOffset] = useState();
  const [flag, setFlag] = useState(false);
  const {rightDrawerState} = useSelector((state) => state.appConfig);
  const isDrawerOpen = useIsDrawerOpen();
  const [list, setList] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      getListData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);

  getListData = () => {
    setSpinner(true);

    setNotransaction(false);
    let postData = {};
    let linkList = 0;
    ls.get('consentStatus').then((data) => {
      console.log('consentStatus : ' + data);
      if (data == 'true') {
        linkList = 1;
        // ls.remove('consentStatus')
      }
    });
    ls.get('filterData').then((data) => {
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      postData.startDate = route.params.startDate;
      postData.endDate = route.params.endDate;
      postData.latitude = route.params.data.latitude;
      postData.longitude = route.params.data.longitude;
      if (linkList == 1 || data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      console.log(JSON.stringify(postData));

      fetch(
        global.baseURL +
          'customer/get/transaction/data/location/' +
          global.loginID +
          '/' +
          route.params.data.id,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.data);
          if (responseJson.data != null) {
            setNotransaction(false);
            setList(responseJson.data);
          } else {
            setNotransaction(true);
            setList([]);
          }
          setSpinner(false);
        });
    });
  };
  // Slider Animation Part
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  // const pan = useState(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 300 }))[0];
  const pan = useState(new Animated.ValueXY({x: 0, y: wp('120%')}))[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          (isScrollEnable == false &&
            gestureState.moveY >= wp('120%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('120%') &&
            gestureState.dy < 0)
        ) {
          return true;
        } else {
          return false;
        }
      },
      onPanResponderGrant: (evt, gestureState) => {
        pan.extractOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({x: 0, y: gestureState.dy});
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(gestureState.dy);
        pan.flattenOffset();
        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('22%'),
            // tension: 1
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('120%'),
            easing: Easing.linear,
          }).start();
        }
      },
    }),
  )[0];
  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };
  const viewOpacity = pan.y.interpolate({
    inputRange: [0, hp('20%'), hp('25%')],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const displayViewOpacity = pan.y.interpolate({
    inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 450],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const _bgColorAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', '#DFE4FB', '#DFE4FB'],
  });

  navigate = (item) => {
    if (
      item.latitude != null &&
      item.latitude != '' &&
      item.longitude != null &&
      item.longitude != ''
    ) {
      navigation.navigate('spentHistory', {
        reNavigateTo: 'memories',
        type: route.params.type,
        data: item,
        startDate: route.params.startDate,
        endDate: route.params.endDate,
      });
    } else {
      Alert.alert(
        'Alert !',
        'Location is not available. Please add location in memories.',
      );
    }
  };
  return (
    <View style={{flexDirection: 'column', flex: 1, backgroundColor: 'white'}}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: hp('3%'),
          right: hp('3%'),
          zIndex: 100,
        }}>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <View style={{backgroundColor: 'white', flex: 1.1}}>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg_white.png')}></Image>
        </View>
        <View style={styles.container}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('memories')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Location History</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              padding: hp('1.5%'),
              paddingLeft: hp('2%'),
              paddingRight: hp('2%'),
            }}>
            <View style={{width: 20, height: 20, alignSelf: 'center'}}>
              <Image
                resizeMode={'contain'}
                style={{maxWidth: '100%', height: '100%'}}
                source={require('./assets/locationmap.png')}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{color: '#454F63', fontSize: 10, marginRight: hp('2%')}}
                numberOfLines={1}>
                {route.params.data.mapDescription}
              </Text>
            </View>
          </View>
          {route.params.data.locationImage != null &&
          route.params.data.locationImage != '' ? (
            <Animated.View
              style={{opacity: viewOpacity, paddingLeft: hp('3%')}}>
              {/* <FlatList
                                    data={[require('./assets/memoriesPic.png'), require('./assets/Image23.png')]}
                                    horizontal
                                    renderItem={
                                        ({ item }) => */}
              <View style={styles.picView}>
                {/* <Image resizeMode={'contain'} style={styles.Img}
                                                    source={item}
                                                /> */}
                <Image
                  resizeMode={'cover'}
                  style={styles.Img}
                  source={{
                    uri:
                      global.baseURL +
                      'customer/' +
                      route.params.data.locationImage,
                  }}
                />
              </View>
              {/* }
                                />  */}
            </Animated.View>
          ) : null}
          {/* height: wp('80%'), */}
          <Animated.View
            style={{
              opacity: viewOpacity,
              marginLeft: 0,
              marginRight: 0,
              paddingTop: hp('2%'),
            }}>
            <MapView
              pitchEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
              style={{
                width: '100%',
                height:
                  route.params.data.locationImage != null &&
                  route.params.data.locationImage != ''
                    ? wp('80%')
                    : wp('95%'),
                borderBottomRightRadius: hp('4%'),
              }}
              region={{
                latitude: route.params.data.latitude,
                longitude: route.params.data.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: route.params.data.latitude,
                  longitude: route.params.data.longitude,
                }}
              />
            </MapView>
          </Animated.View>
        </View>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          animatedHeight,
          {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: _bgColorAnimation,
            height: SCREEN_HEIGHT - 50,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            flex: 1,
            paddingBottom: hp('1%'),
          },
        ]}>
        <View
          style={{
            backgroundColor: '#5E83F2',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingTop: 20,
            flex: 3,
          }}>
          <View style={styles.line}></View>
          {/* <ScrollView > */}

          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                renderItem={({item}) => (
                  // onPress={() => selectedData(item)}
                  <TouchableOpacity onPress={() => navigate(item)}>
                    <Row style={{padding: hp('2%'), paddingBottom: 10}}>
                      <Col size={2} style={{alignItems: 'center'}}>
                        <View style={{width: 45, height: 45}}>
                          {item.merchantIcon != null &&
                          item.merchantIcon != '' ? (
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={{
                                uri:
                                  global.baseURL +
                                  'customer/' +
                                  item.merchantIcon,
                              }}></Image>
                          ) : (
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={{
                                uri: global.baseURL + 'customer/' + item.icon,
                              }}></Image>
                          )}
                        </View>
                      </Col>
                      <Col size={5}>
                        <Text style={{color: 'white', fontSize: 14}}>
                          {item.description}
                        </Text>
                        <Text
                          style={{color: 'white', fontSize: 14, opacity: 0.7}}>
                          {item.category} |{' '}
                          {Moment(
                            item.transactionTimestamp,
                            'YYYY-MM-DD,h:mm:ss',
                          ).format(global.dateFormat)}
                        </Text>
                      </Col>
                      <Col
                        size={5}
                        style={{alignItems: 'flex-end', paddingRight: 10}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            width: '100%',
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 9,
                              marginRight: 3,
                              marginTop: 3,
                            }}>
                            {item.transactionCurrency}
                          </Text>
                          <AmountDisplay
                            style={{
                              color: 'white',
                              fontSize: 18,
                            }}
                            amount={Number(item.amount)}
                            currency={item.transactionCurrency}
                          />
                          {/* <NumberFormat
                            value={Number(item.amount)}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{color: 'white', fontSize: 18}}>
                                {value}
                              </Text>
                            )}
                          /> */}
                        </View>
                      </Col>
                    </Row>

                    {/* <Row style={{ paddingTop: hp('0.8%'), paddingLeft: hp('0.8%'), paddingBottom: hp("3%") }}>
                                        <Col size={2} style={{ alignItems: 'center' }}>
                                            <View style={{ width: 45, height: 45 }}>
                                                <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
                                            </View>
                                        </Col>
                                        <Col size={4.5} >
                                            <Text style={{ color: 'white', fontSize: 14 }}>{item.description}</Text>
                                            <Text style={{ color: 'white', fontSize: 14, opacity: 0.7 }}>{item.category} | {Moment(item.transactionTimestamp, 'YYYY-MM-DD,h:mm:ss').format(global.dateFormat)}</Text>
                                        </Col>
                                        <Col size={4.5} style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <Text style={{ color: 'white', fontSize: 11, marginTop: 3, marginRight: 3 }}>{item.transactionCurrency}</Text>

                                                <NumberFormat
                                                    value={Number(item.amount)}
                                                    displayType={'text'}
                                                    thousandsGroupStyle={global.thousandsGroupStyle}
                                                    thousandSeparator={global.thousandSeparator}
                                                    decimalScale={global.decimalScale}
                                                    fixedDecimalScale={true}
                                                    renderText={value => <Text style={{ color: 'white', fontSize: 18 }}>{value}</Text>}
                                                />
                                            </View>
                                        </Col>
                                        <Col size={1}>
                                            <View style={{ backgroundColor: 'white', height: hp('4.5%'), borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
                                                <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: "100%" }} source={{ uri: item.bankIcon }}></Image>
                                            </View>
                                        </Col>
                                    </Row>
                               */}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}></FlatList>
            ) : (
              <View style={{width: '100%', padding: hp('15%')}}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    paddingBottom: hp('1%'),
                  }}>
                  No data found
                </Text>
                {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
                                    Nothing to categorise now!!</Text> */}
              </View>
            )}
          </Grid>

          {/* </ScrollView> */}
        </View>
      </Animated.View>
    </View>
  );
};

export default LocationHistoryPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // padding: hp('2%'),
    paddingTop: hp('2.5%'),
    width: wp('100%'),
    // flex: 2.2
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    // paddingTop: hp("-2%")
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 21,
    paddingTop: hp('0.5%'),
  },
  backBtn: {
    paddingTop: hp('1%'),
    zIndex: 10,
  },
  cardCol_1: {
    width: hp('8%'),
    height: hp('8%'),
    marginBottom: 45,
  },
  cardCol_1Img: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: hp('2%'),
  },
  cardCol_2: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  cardCol_2Text_1: {
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: hp('2%'),
    marginLeft: hp('2%'),
  },
  cardCol_2Text_2: {
    color: '#888888',
    fontSize: 12,
  },
  cardCol_3ImgView: {
    width: hp('7%'),
    height: hp('7%'),
  },
  cardCol_3FIImg: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: 40,
  },
  cardCol_1: {
    width: hp('8%'),
    height: hp('8%'),
    marginBottom: 45,
  },
  cardCol_1Img: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: hp('2%'),
  },
  cardCol_2: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  cardCol_2Text_1: {
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: hp('2%'),
    marginLeft: hp('2%'),
  },
  cardCol_2Text_2: {
    color: '#888888',
    fontSize: 12,
    marginLeft: hp('2%'),
  },

  cardCol_3ImgView: {
    width: hp('7%'),
    height: hp('7%'),
  },
  cardCol_3FIImg: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: 40,
  },

  cardBalView: {
    marginLeft: hp('3%'),
    marginRight: hp('3%'),
    marginBottom: hp('3%'),
  },
  cardBalText: {
    color: '#888888',
    fontSize: 10,
  },
  cardBalAmt: {
    color: '#454F63',
    fontSize: 24,
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
  line: {
    padding: 2,
    width: hp('6.5%'),
    borderWidth: 0,
    backgroundColor: '#DFE4FB',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    // marginTop: hp('0.5%')
  },
  label: {
    color: '#454F63',
    fontSize: 15,
    alignSelf: 'center',
    paddingTop: hp('1.5%'),
  },
  imageView: {
    width: 45,
    height: 45,
    alignSelf: 'center',
  },
  picView: {
    width: hp('15%'),
    height: hp('15%'),
    borderRadius: hp('50%'),
    marginLeft: 5,
    marginRight: 5,
  },
  Img: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: hp('3%'),
  },
});
