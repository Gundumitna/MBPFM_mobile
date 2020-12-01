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
  const [list, setList] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      if (route.params.type == 'transaction') {
        setIMage(route.params.data.merchantIcon);

        setLabel(route.params.data.merchantName);

        setHeading('Merchant History');
        console.log('image : ' + route.params.data.merchantIcon);
        getListData();
      } else if (route.params.type == 'bank') {
        setIMage(route.params.data.bankIcon);
        setLabel(route.params.data.bankName);
        setHeading('Bank History');
        console.log('image : ' + route.params.data.bankIcon);
        getListData();
      } else {
        setHeading('Spent History');
        getListData();
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
      if (linkList == 1 || data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      console.log(JSON.stringify(postData));
      let id;
      let url = '';
      if (route.params.type == 'transaction') {
        id = route.params.data.merchantId;
        url = global.baseURL + 'customer/get/merchant/';
      } else if (route.params.type == 'bank') {
        id = route.params.data.bankId;
        url = global.baseURL + 'customer/get/transaction/data/bank/';
      }
      if (route.params.type != 'contacts') {
        if (id != null && id != '' && id != undefined) {
          fetch(url + global.loginID + '/' + id + '/' + route.params.data.id, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          })
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
        } else {
          Alert.alert('Error', 'Something went wrong. Please try later.');
        }
      } else {
        if (route.params.list.type == 'contacts') {
          fetch(
            global.baseURL +
              'customer/get/transaction/data/person/' +
              global.loginID +
              '/' +
              route.params.list.number.trim() +
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
        } else if (route.params.list.type == 'beneficiary') {
          fetch(
            global.baseURL +
              'customer/get/transaction/data/person/beneficiary/' +
              global.loginID +
              '/' +
              route.params.list.number.trim() +
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
        }
      }
    });
  };

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
      // reNavigateTo: 'memories', type: type, data: item, startDate: sT, endDate: moment().format('YYYY-MM-DD')
      // { data: route.params }
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
              onPress={() =>
                navigation.navigate(route.params.reNavigateTo, {back: 'back'})
              }>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>{heading}</Text>
            </View>
          </View>

          <View style={{paddingTop: hp('2%')}}>
            {route.params.type == 'contacts' ? (
              <View style={styles.profileImgCss}>
                {route.params.data.image != null ? (
                  <View
                    style={{
                      height: 40,
                      width: 40,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/tick_icon.png')}
                    />
                  </View>
                ) : (
                  <View>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      {route.params.list.name.charAt(0)}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.imageView}>
                {
                  route.params.type == 'bank' ? (
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={{uri: route.params.data.bankIcon}}></Image>
                  ) : (
                    // <View>
                    //     {
                    //         route.params.type == 'transaction'
                    //             ?
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={{
                        uri: global.baseURL + 'customer/' + image,
                      }}></Image>
                  )
                  //         : null
                  // }
                  // </View>
                }
              </View>
            )}
            {route.params.type == 'contacts' ? (
              <View style={{justifyContent: 'center'}}>
                <Text style={[styles.label, {paddingBottom: 0}]}>
                  {route.params.list.name}
                </Text>
                {/* <Text style={[styles.label, { paddingTop: 0 }]}>{route.params.contactDetails.phoneNumber}</Text> */}
              </View>
            ) : (
              <Text style={styles.label}>{label}</Text>
            )}
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
        {/* <ScrollView > */}

        <Grid>
          {notransaction == false ? (
            <FlatList
              data={list}
              renderItem={({item}) => (
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
                No data available
              </Text>
              {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
                                Nothing to categorise now!!</Text> */}
            </View>
          )}
        </Grid>

        {/* </ScrollView> */}
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
    textAlign: 'center',
    // alignSelf: 'center',
    paddingTop: hp('1.5%'),
  },
  imageView: {
    width: 45,
    height: 45,
    alignSelf: 'center',
  },
  profileImgCss: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: hp('50%'),
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#F2A413',
  },
});
