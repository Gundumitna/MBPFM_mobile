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
import AmountDisplay from './AmountDisplay';

const BankAndTransactionHistoryPage = ({route, navigation}) => {
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
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [list, setList] = useState([
    {
      id: null,
      parentId: 2866,
      categoryId: 40,
      category: 'Service',
      icon: 'U2VydmljZV9pY29uLnBuZw==',
      merchantName: 'FLIPKART',
      narration: null,
      date: 'Aug2020',
      amount: 1000,
      transactionId: '1308201742002652894C',
      typeOfTransaction: 'DB',
      transactionTimestamp: '2020-08-01 05:34:45',
      mode: 'Online',
      modeIcon: 'T25saW5lX2ljb24ucG5n',
      description: 'FLIPKART',
      bankId: 2,
      bankName: 'HDFC Bank',
      bankIcon: global.baseURL + 'customer/aGRmY19iYW5rLnBuZw==',
      notAExpense: null,
      accountType: 'Savings',
      accountNumber: '623401000026',
      type: 'C',
      merchantIcon: 'bXludHJhLnBuZw==',
      linkedAccountId: 5,
      openingBalance: null,
      closingBalance: null,
      transactionCurrency: 'INR',
      userPreferredCurrency: 'INR',
      userPreferredCurrencyAmount: 1000,
      latitude: 17.38504319719344,
      longitude: 78.48667027428746,
      attachmentsList: [
        'Ly9JbWFnZTE1OTc3NTA4OTE0MTUuanBn',
        'Ly9JbWFnZTE1OTc3NTA5MjEzODcuanBn',
        'Ly9JbWFnZTE1OTc3NTEwMzAxMTEuanBn',
        'Ly9JbWFnZTE1OTc3NzUzOTY2NTYuanBn',
      ],
      contacts: [],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      mapDescription: 'Hyderabad, Telangana, India',
    },
    {
      id: null,
      parentId: null,
      categoryId: 2,
      category: 'Groceries',
      icon: 'R3JvY2VyaWVzX2ljb24ucG5n',
      merchantName: 'PARADISE',
      narration: null,
      date: 'Aug2020',
      amount: 3400,
      transactionId: '0708201906002912891C',
      typeOfTransaction: 'DB',
      transactionTimestamp: '2020-08-01 05:34:45',
      mode: 'Online',
      modeIcon: 'T25saW5lX2ljb24ucG5n',
      description: 'PARADISE',
      bankId: 1,
      bankName: 'Host Bank',
      bankIcon: global.baseURL + 'customer/aW5kdXNsbmQucG5n',
      notAExpense: 'false',
      accountType: 'Savings',
      accountNumber: '623401000010',
      type: null,
      merchantIcon: 'cGFyYWRpc2UucG5n',
      linkedAccountId: 1,
      openingBalance: null,
      closingBalance: null,
      transactionCurrency: 'INR',
      userPreferredCurrency: 'INR',
      userPreferredCurrencyAmount: 3400,
      latitude: 28.581196064307676,
      longitude: 77.24208505824208,
      attachmentsList: [
        'Ly9JbWFnZTE1OTcxNTYzODkyNzMuanBn',
        'Ly9JbWFnZTE1OTcxNjczNTExMTkuanBn',
        'Ly9JbWFnZTE1OTcyMDQzMDQ3ODcuanBn',
        'Ly9JbWFnZTE1OTcyMDUwNDAxNjYuanBn',
        'Ly9JbWFnZTE1OTcyMDU0MzA5MzUuanBn',
        'Ly9JbWFnZTE1OTc4MTQ0MTk2ODYuanBn',
      ],
      contacts: [
        {
          name: 'Sahith',
          phoneNumber: '+91 76 59 080906',
          profilePicture: null,
        },
        {
          name: 'Hafiz',
          phoneNumber: '+919515674742',
          profilePicture: null,
        },
        {
          name: 'Samsung Helpline',
          phoneNumber: '1800407267864',
          profilePicture: null,
        },
        {
          name: 'Nabhonil',
          phoneNumber: '7993663211',
          profilePicture: null,
        },
        {
          name: 'Shalini Bangalore',
          phoneNumber: '80 50 420554',
          profilePicture: null,
        },
      ],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      mapDescription:
        'INOX Eros One, Jangpura, Block H, Jungpura Extension, New Delhi, Delhi, India',
    },
  ]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      if (route.params.type == 'transaction') {
        setIMage(route.params.data.transactionImg);
        setLabel(route.params.data.transactionName);
        setHeading('Merchant History');
      } else if (route.params.type == 'bank') {
        setIMage(route.params.data.bankImg);
        setLabel(route.params.data.bankName);
        setHeading('Bank History');
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);

  const pan = useState(new Animated.ValueXY({x: 0, y: wp('119%')}))[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log('scrollOffset : ' + scrollOffset);
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          (isScrollEnable == false &&
            gestureState.moveY >= wp('119%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('119%') &&
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
        console.log(
          ' gestureState.moveY : ' +
            gestureState.moveY +
            ' height : ' +
            wp('119%'),
        );
        pan.flattenOffset();

        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('15%'),
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('119%'),
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
    inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 450],
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
          zIndex: 10,
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
              <Text style={styles.heading}>{heading}</Text>
            </View>
          </View>

          <View style={{paddingTop: hp('2%')}}>
            <View style={styles.imageView}>
              <Image
                style={{maxWidth: '100%', height: '100%'}}
                source={image}></Image>
            </View>
            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#5E83F2',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 20,
          flex: 3,
        }}>
        {/* <View style={styles.line}></View> */}

        <ScrollView>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => selectedData(item)}>
                    <Row
                      style={{
                        paddingTop: hp('0.8%'),
                        paddingLeft: hp('0.8%'),
                        paddingBottom: hp('3%'),
                      }}>
                      <Col size={2} style={{alignItems: 'center'}}>
                        <View style={{width: 45, height: 45}}>
                          <Image
                            style={{maxWidth: '100%', height: '100%'}}
                            source={{
                              uri: global.baseURL + 'customer/' + item.icon,
                            }}></Image>
                        </View>
                      </Col>
                      <Col size={4.5}>
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
                        size={4.5}
                        style={{alignItems: 'flex-end', paddingRight: 10}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 11,
                              marginTop: 3,
                              marginRight: 3,
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
                            displayType={"text"}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{ color: "white", fontSize: 18 }}>
                                {value}
                              </Text>
                            )}
                          /> */}
                        </View>
                      </Col>
                      <Col size={1}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            height: hp('4.5%'),
                            borderTopLeftRadius: 20,
                            borderBottomLeftRadius: 20,
                          }}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={{uri: item.bankIcon}}></Image>
                        </View>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}></FlatList>
            ) : (
              <View style={{width: '100%', padding: hp('15%')}}>
                {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>No entries to show</Text> */}
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    paddingBottom: hp('1%'),
                  }}>
                  You are all caught up!!
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                  }}>
                  Nothing to categorise now!!
                </Text>
              </View>
            )}
          </Grid>
        </ScrollView>
      </View>
    </View>
  );
};

export default BankAndTransactionHistoryPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
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
});
