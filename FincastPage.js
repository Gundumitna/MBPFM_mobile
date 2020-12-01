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
import {Grid, Row, Col} from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import {FlatList} from 'react-native-gesture-handler';
import Moment from 'moment';
import ToggleSwitch from 'toggle-switch-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressBar from 'react-native-progress/Bar';
import AmountDisplay from './AmountDisplay';

const FincastPage = ({navigation}) => {
  let ls = require('react-native-local-storage');
  const [spinner, setSpinner] = useState(false);
  const [loader, setLoader] = useState(false);
  const [flag, setFlag] = useState(false);
  const [heading, setHeading] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const [activeExIncomeTab, setActiveExIncomeTab] = useState('');
  const [freeToUseAmount, setFreeToUseAmount] = useState('');
  const [scrollOffset, setScrollOffset] = useState();
  const [fincastList, setFincastList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [openingBalance, setOpeningBalance] = useState('');
  const [totalIncome, setTotalIncome] = useState('');
  const [totalExpense, setTotalExpense] = useState('');
  const [progressBarData, setProgressBarData] = useState('');
  const [notransaction, setNotransaction] = useState(false);
  const [currency, setCurrency] = useState();
  const dispatch = useDispatch();
  // const { state } = useSelector((state) => state.appConfig);
  const {rightDrawerState} = useSelector((state) => state.appConfig);
  const isDrawerOpen = useIsDrawerOpen();
  useEffect(() => {
    console.log('rendered');
    // console.log(state)
    return () => {
      setFlag(false);
    };
  }, [flag]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Fincast Page');
      setActiveTab('M');
      setActiveExIncomeTab('DB');
      ls.save('selectedDrawerItem', 'fincastPage');
      getFincastData('DB', 'M');
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    console.log('Fincast Page');
    Animated.timing(pan.y, {
      toValue: wp('90%'),
      easing: Easing.linear,
    }).start();
    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);
        setActiveTab('M');
        setActiveExIncomeTab('DB');

        getNoSpinnerFincastData('DB', 'M');
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);

  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    setFlag(true);
    getFincastData(activeExIncomeTab, tab);
  };
  selectedExIncomeTab = (tab) => {
    setActiveExIncomeTab(tab);
    if (tab == 'DB') {
      let list = [...expenseList];
      setFincastList(list);
    } else {
      let list = [...incomeList];
      setFincastList(list);
    }
    // getFincastData(tab, activeTab)
    console.log(tab);
    setFlag(true);
  };
  getNoSpinnerFincastData = (incomeExType, durationType) => {
    setLoader(true);
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
      postData.type = incomeExType;
      postData.getDataType = durationType;
      if (linkList == 1 || data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      // postData.linkedAccountIds = []
      // postData.linkedAccountIds = data.linkedAccountIds
      let heading = '';
      heading = data.month.mntName + ' ' + data.year.year;
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(global.baseURL + 'customer/get/fincast/data/' + global.loginID, {
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
          setExpenseList(responseJson.data.expenseList);
          setIncomeList(responseJson.data.incomeList);
          let openingBalanceInUserPreferredCurrency = 0;
          let totalIncomeInUserPreferredCurrency = 0;
          let totalExpenseInUserPreferredCurrency = 0;
          setCurrency(responseJson.data.userPreferredCurrency);
          if (incomeExType == 'DB') {
            setFincastList(responseJson.data.expenseList);
          } else {
            setFincastList(responseJson.data.incomeList);
          }
          if (responseJson.data.openingBalanceInUserPreferredCurrency != null) {
            setOpeningBalance(
              responseJson.data.openingBalanceInUserPreferredCurrency,
            );
            openingBalanceInUserPreferredCurrency =
              responseJson.data.openingBalanceInUserPreferredCurrency;
          } else {
            setOpeningBalance(0);
          }
          if (responseJson.data.totalIncomeInUserPreferredCurrency != null) {
            setTotalIncome(
              responseJson.data.totalIncomeInUserPreferredCurrency,
            );
            totalIncomeInUserPreferredCurrency =
              responseJson.data.totalIncomeInUserPreferredCurrency;
          } else {
            setTotalIncome(0);
          }
          if (responseJson.data.totalExpenseInUserPreferredCurrency != null) {
            setTotalExpense(
              responseJson.data.totalExpenseInUserPreferredCurrency,
            );
            totalExpenseInUserPreferredCurrency =
              responseJson.data.totalExpenseInUserPreferredCurrency;
          } else {
            setTotalExpense(0);
          }
          // let a = responseJson.data(responseJson.data.length-1)
          setProgressBarData(
            openingBalanceInUserPreferredCurrency /
              (openingBalanceInUserPreferredCurrency +
                totalIncomeInUserPreferredCurrency -
                totalExpenseInUserPreferredCurrency),
          );
          // setFreeToUseAmount(openingBalanceInUserPreferredCurrency + totalIncomeInUserPreferredCurrency - totalExpenseInUserPreferredCurrency)
          if (responseJson.data.freeToUseInUserPreferredCurrency != null) {
            setFreeToUseAmount(
              responseJson.data.freeToUseInUserPreferredCurrency,
            );
          } else {
            setFreeToUseAmount(
              openingBalanceInUserPreferredCurrency +
                totalIncomeInUserPreferredCurrency -
                totalExpenseInUserPreferredCurrency,
            );
          }
          console.log('progressBarData : ' + progressBarData);
          setLoader(false);
        });
    });
  };
  getFincastData = (incomeExType, durationType) => {
    setSpinner(true);
    let postData = {};
    let linkList = 0;
    setNotransaction(false);
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
      postData.type = incomeExType;
      postData.getDataType = durationType;
      if (linkList == 1 || data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      // postData.linkedAccountIds = []
      // postData.linkedAccountIds = data.linkedAccountIds
      let heading = '';
      heading = data.month.mntName + ' ' + data.year.year;
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(global.baseURL + 'customer/get/fincast/data/' + global.loginID, {
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
          if (responseJson.data == null) {
            setNotransaction(true);
          } else {
            setNotransaction(false);
          }
          setExpenseList(responseJson.data.expenseList);
          setIncomeList(responseJson.data.incomeList);
          let openingBalanceInUserPreferredCurrency = 0;
          let totalIncomeInUserPreferredCurrency = 0;
          let totalExpenseInUserPreferredCurrency = 0;
          setCurrency(responseJson.data.userPreferredCurrency);
          if (incomeExType == 'DB') {
            setFincastList(responseJson.data.expenseList);
          } else {
            setFincastList(responseJson.data.incomeList);
          }
          // setOpeningBalance(responseJson.data.openingBalance)
          // setTotalIncome(responseJson.data.totalIncome)
          // setTotalExpense(responseJson.data.totalExpense)
          // let a = responseJson.data(responseJson.data.length-1)
          if (responseJson.data.openingBalanceInUserPreferredCurrency != null) {
            setOpeningBalance(
              responseJson.data.openingBalanceInUserPreferredCurrency,
            );
            openingBalanceInUserPreferredCurrency =
              responseJson.data.openingBalanceInUserPreferredCurrency;
          } else {
            setOpeningBalance(0);
          }
          if (responseJson.data.totalIncomeInUserPreferredCurrency != null) {
            setTotalIncome(
              responseJson.data.totalIncomeInUserPreferredCurrency,
            );
            totalIncomeInUserPreferredCurrency =
              responseJson.data.totalIncomeInUserPreferredCurrency;
          } else {
            setTotalIncome(0);
          }
          if (responseJson.data.totalExpenseInUserPreferredCurrency != null) {
            setTotalExpense(
              responseJson.data.totalExpenseInUserPreferredCurrency,
            );
            totalExpenseInUserPreferredCurrency =
              responseJson.data.totalExpenseInUserPreferredCurrency;
          } else {
            setTotalExpense(0);
          }
          setProgressBarData(
            openingBalanceInUserPreferredCurrency /
              (openingBalanceInUserPreferredCurrency +
                totalIncomeInUserPreferredCurrency -
                totalExpenseInUserPreferredCurrency),
          );
          setFreeToUseAmount(
            openingBalanceInUserPreferredCurrency +
              totalIncomeInUserPreferredCurrency -
              totalExpenseInUserPreferredCurrency,
          );

          console.log('progressBarData : ' + progressBarData);
          setSpinner(false);
        });
    });
  };

  // Slider Animation Part

  // const pan = useState(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 300 }))[0];
  const pan = useState(new Animated.ValueXY({x: 0, y: wp('90%')}))[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          (isScrollEnable == false &&
            gestureState.moveY >= wp('90%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('90%') &&
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
            toValue: wp('16'),
            // tension: 1
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('90%'),
            easing: Easing.linear,
          }).start();
        }
      },
    }),
  )[0];
  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };
  // const viewOpacity = pan.y.interpolate({
  //     inputRange: [0, SCREEN_HEIGHT - 520, SCREEN_HEIGHT - 500],
  //     outputRange: [0, 0, 1],
  //     extrapolate: 'clamp'
  // })
  const viewOpacity = pan.y.interpolate({
    inputRange: [0, hp('10%'), hp('20%')],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const displayViewOpacity = pan.y.interpolate({
    inputRange: [0, hp('10%'), hp('20%')],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const _bgColorAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', 'white', 'white'],
  });

  return (
    <Animated.View style={{flex: 1, backgroundColor: 'white'}}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Animated.View style={styles.layer1}>
        <View>
          <View>
            <Image
              style={{maxWidth: '100%'}}
              source={require('./assets/graph_bg_white(short).png')}></Image>
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={navigation.openDrawer}>
                <Image
                  source={require('./assets/icons-menu(dark).png')}></Image>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 'auto',
                }}>
                {viewOpacity !== undefined ? (
                  <Animated.View style={{opacity: viewOpacity}}>
                    <Text style={{textAlign: 'center'}}>{heading}</Text>
                  </Animated.View>
                ) : null}
                {displayViewOpacity !== undefined ? (
                  <Animated.View
                    style={{
                      opacity: displayViewOpacity,
                      position: 'absolute',
                      top: 0,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      Fincast
                    </Text>
                    <Text style={{textAlign: 'center', color: '#454F63'}}>
                      {heading}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => dispatch(AppConfigActions.toggleRightDrawer())}
                style={{marginLeft: 'auto'}}>
                <Image
                  style={{marginLeft: 'auto'}}
                  source={require('./assets/icons-filter-dark(dark).png')}></Image>
              </TouchableOpacity>
            </View>
            <Animated.View style={{opacity: viewOpacity}}>
              <Row style={{paddingLeft: hp('2%'), paddingRight: hp('2%')}}>
                <Col
                  size={4}
                  style={activeTab == 'M' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{zIndex: 10}}
                    onPress={() => {
                      selectedTab('M');
                    }}>
                    <Text
                      style={{
                        color: '#454F63',
                        textAlign: 'center',
                        fontWeight: activeTab == 'M' ? 'bold' : null,
                      }}>
                      MONTHLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={activeTab == 'Q' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{zIndex: 10}}
                    onPress={() => {
                      selectedTab('Q');
                    }}>
                    <Text
                      style={{
                        color: '#454F63',
                        textAlign: 'center',
                        fontWeight: activeTab == 'Q' ? 'bold' : null,
                      }}>
                      QUARTERLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={activeTab == 'Y' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{zIndex: 10}}
                    onPress={() => {
                      selectedTab('Y');
                    }}>
                    <Text
                      style={{
                        color: '#454F63',
                        textAlign: 'center',
                        fontWeight: activeTab == 'Y' ? 'bold' : null,
                      }}>
                      YEARLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={4}>
                  {loader == true ? (
                    <View
                      style={{
                        marginLeft: 'auto',
                        marginTop: hp('1%'),
                        marginRight: hp('3%'),
                      }}>
                      <ActivityIndicator size="small" color="#454F63" />
                    </View>
                  ) : null}
                </Col>
              </Row>
              <Row>
                <Col style={{alignItems: 'flex-end', paddingRight: hp('3%')}}>
                  <Text style={{color: '#454F63', fontSize: 13}}>
                    Opening Balance
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={{
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 13,
                        marginTop: 4,
                        marginRight: 3,
                      }}>
                      {currency}
                    </Text>
                    <AmountDisplay
                      style={{
                        color: '#454F63',
                        fontSize: 24,
                        fontWeight: 'bold',
                      }}
                      amount={Number(openingBalance)}
                      currency={currency}
                    />
                    {/* <NumberFormat
                      value={Number(openingBalance)}
                      displayType={'text'}
                      thousandsGroupStyle={global.thousandsGroupStyle}
                      thousandSeparator={global.thousandSeparator}
                      decimalScale={global.decimalScale}
                      fixedDecimalScale={true}
                      // prefix={'₹'}
                      renderText={(value) => (
                        <Text
                          style={{
                            color: '#454F63',
                            fontSize: 24,
                            fontWeight: 'bold',
                          }}>
                          {value}
                        </Text>
                      )}
                    /> */}
                  </View>
                </Col>
              </Row>
            </Animated.View>
          </View>
        </View>
        <Animated.View style={{opacity: viewOpacity}}>
          <Grid>
            <Row style={{padding: hp('3%'), paddingTop: hp('3%')}}>
              <Col size={6} style={{paddingRight: hp('1%')}}>
                <View style={{zIndex: 100, paddingLeft: hp('2%')}}>
                  <View
                    style={{
                      width: hp('5.5%'),
                      height: hp('5.5%'),
                      marginTop: hp('2%'),
                      marginBottom: hp('2%'),
                    }}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/all_Expense_icon.png')}></Image>
                  </View>
                  <Text
                    style={{
                      color: '#F22973',
                      fontSize: 12,
                      height: hp('2.5%'),
                    }}>
                    Expected Expense
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: '#F22973',
                        fontWeight: 'bold',
                        fontSize: 10,
                        marginTop: 4,
                        marginRight: 3,
                        height: hp('3.5%'),
                      }}>
                      {currency}
                    </Text>
                    <AmountDisplay
                      style={{
                        color: '#F22973',
                        fontSize: 18,
                        fontWeight: 'bold',
                        height: hp('3.5%'),
                      }}
                      amount={Number(totalExpense)}
                      currency={currency}
                    />
                    {/* <NumberFormat
                      value={Number(totalExpense)}
                      displayType={'text'}
                      thousandsGroupStyle={global.thousandsGroupStyle}
                      thousandSeparator={global.thousandSeparator}
                      decimalScale={global.decimalScale}
                      fixedDecimalScale={true}
                      // prefix={'₹'}
                      renderText={(value) => (
                        <Text
                          style={{
                            color: '#F22973',
                            fontSize: 18,
                            fontWeight: 'bold',
                            height: hp('3.5%'),
                          }}>
                          {value}
                        </Text>
                      )}
                    /> */}
                  </View>
                </View>
                <View
                  style={{
                    padding: hp('9%'),
                    backgroundColor: '#FCD6E2',
                    borderTopRightRadius: hp('3%'),
                    borderBottomLeftRadius: hp('3%'),
                  }}></View>
              </Col>
              <Col size={6} style={{paddingLeft: hp('1%')}}>
                <View style={{zIndex: 100, paddingLeft: hp('2%')}}>
                  <View
                    style={{
                      width: hp('5.5%'),
                      height: hp('5.5%'),
                      marginTop: hp('2%'),
                      marginBottom: hp('2%'),
                    }}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/all_Income_icon.png')}></Image>
                  </View>
                  <Text
                    style={{
                      color: '#02909C',
                      fontSize: 12,
                      height: hp('2.5%'),
                    }}>
                    Expected Income
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: '#02909C',
                        fontWeight: 'bold',
                        fontSize: 10,
                        marginTop: 4,
                        marginRight: 3,
                        height: hp('3.5%'),
                      }}>
                      {currency}
                    </Text>
                    <AmountDisplay
                      style={{
                        color: '#02909C',
                        fontSize: 18,
                        fontWeight: 'bold',
                        height: hp('3.5%'),
                      }}
                      amount={Number(totalIncome)}
                      currency={currency}
                    />
                    {/* <NumberFormat
                      value={Number(totalIncome)}
                      displayType={'text'}
                      thousandsGroupStyle={global.thousandsGroupStyle}
                      thousandSeparator={global.thousandSeparator}
                      decimalScale={global.decimalScale}
                      fixedDecimalScale={true}
                      // prefix={'₹'}
                      renderText={(value) => (
                        <Text
                          style={{
                            color: '#02909C',
                            fontSize: 18,
                            fontWeight: 'bold',
                            height: hp('3.5%'),
                          }}>
                          {value}
                        </Text>
                      )}
                    /> */}
                  </View>
                </View>
                <View
                  style={{
                    padding: hp('9%'),
                    backgroundColor: '#DBF3F5',
                    borderTopRightRadius: hp('3%'),
                    borderBottomLeftRadius: hp('3%'),
                  }}
                />
              </Col>
            </Row>
          </Grid>
        </Animated.View>
      </Animated.View>
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
        <Animated.View
          style={[styles.layer2, {backgroundColor: _bgColorAnimation}]}>
          <Grid style={{padding: hp('3%')}}>
            <Row>
              <Col size={6}>
                <View>
                  <Text
                    style={{
                      color: '#454F63',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Free To Use
                  </Text>
                  <Text style={{color: '#454F63', fontSize: 12, opacity: 0.7}}>
                    Expected Balance
                  </Text>
                </View>
              </Col>
              <Col size={6}>
                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <Text
                    style={{
                      color: '#5E83F2',
                      fontWeight: 'bold',
                      fontSize: 10,
                      marginTop: 4,
                      marginRight: 3,
                      justifyContent: 'center',
                    }}>
                    {currency}
                  </Text>
                  <AmountDisplay
                    style={{
                      color: '#5E83F2',
                      fontSize: 18,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}
                    amount={Number(freeToUseAmount)}
                    currency={currency}
                  />
                  {/* <NumberFormat
                    value={Number(freeToUseAmount)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={global.decimalScale}
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#5E83F2',
                          fontSize: 18,
                          fontWeight: 'bold',
                          justifyContent: 'center',
                        }}>
                        {value}
                      </Text>
                    )}
                  /> */}
                </View>
              </Col>
            </Row>
            <Col style={{marginTop: hp('5%')}}>
              <ProgressBar
                progress={progressBarData}
                width={null}
                height={10}
                borderRadius={35}
                color={'#F2A413'}
                borderColor={'transparent'}
                unfilledColor={'#FDEDD4'}
              />
            </Col>
          </Grid>
        </Animated.View>
        <View
          style={{
            backgroundColor: '#5E83F2',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: hp('100%'),
            paddingTop: 10,
            flex: 1,
            paddingBottom: wp('18%'),
          }}>
          <View style={styles.line}></View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={
                activeExIncomeTab == 'DB'
                  ? styles.activeExIncomeTab
                  : styles.exIncometab
              }>
              <TouchableOpacity
                style={{zIndex: 300}}
                onPress={() => {
                  selectedExIncomeTab('DB');
                }}>
                <Text
                  style={{
                    color: '#DFE4FB',
                    textAlign: 'center',
                    fontWeight: activeExIncomeTab == 'DB' ? 'bold' : null,
                  }}>
                  EXPENSE
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={
                activeExIncomeTab == 'CR'
                  ? styles.activeExIncomeTab
                  : styles.exIncometab
              }>
              <TouchableOpacity
                style={{zIndex: 300}}
                onPress={() => {
                  selectedExIncomeTab('CR');
                }}>
                <Text
                  style={{
                    color: '#DFE4FB',
                    textAlign: 'center',
                    fontWeight: activeExIncomeTab == 'CR' ? 'bold' : null,
                  }}>
                  INCOME
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            {notransaction == false ? (
              <FlatList
                data={fincastList}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                renderItem={({item}) => (
                  <TouchableOpacity style={{zIndex: 30}}>
                    <Row style={styles.transRow}>
                      <Col size={2} style={{alignItems: 'center'}}>
                        <View style={{width: 40, height: 40}}>
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
                            <View>
                              {item.icon != null && item.icon != '' ? (
                                <Image
                                  style={{maxWidth: '100%', height: '100%'}}
                                  source={{
                                    uri:
                                      global.baseURL + 'customer/' + item.icon,
                                  }}></Image>
                              ) : (
                                <Image
                                  style={{maxWidth: '100%', height: '100%'}}
                                  source={require('./assets/uncategorized_Expense.png')}></Image>
                              )}
                            </View>
                          )}
                          {/* <Image style={{ maxWidth: '100%', height: "100%" }} source={item.image}></Image> */}
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
                        {/* <Text style={{ color: 'white', fontSize: 14 }}>{item.name}</Text>
                                        <Text style={{ color: 'white', fontSize: 14, opacity: 0.7 }}>{item.subText}</Text> */}
                      </Col>
                      <Col
                        size={5}
                        style={{alignItems: 'flex-end', paddingRight: 10}}>
                        <View
                          style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 10,
                              marginTop: 4,
                              marginRight: 3,
                              justifyContent: 'center',
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
                  </TouchableOpacity>
                )}></FlatList>
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
                  Oops! We have drawn a blank here!
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                  }}>
                  No entries to show!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default FincastPage;
const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
    zIndex: 10,
    flexDirection: 'row',
    paddingBottom: hp('3%'),
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pageHeading: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: hp('3.5%'),
  },
  totalAsset: {
    paddingRight: hp('3.5%'),
  },
  tAssetLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.7,
  },
  tAssetPrice: {
    color: '#FFFFFF',
    fontSize: 30,
    textAlign: 'right',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    zIndex: 10,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  layer1: {
    // flex: 1,
    backgroundColor: 'white',
    opacity: 1,
    paddingBottom: hp('2%'),
  },
  layer2: {
    height: hp('18%'),
    // backgroundColor: "#DFE4FB",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // marginBottom: hp('-0.8%')
  },
  layer3: {
    flex: 1,
    backgroundColor: '#5E83F2',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: hp('2%'),
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 1000,
  },
  arrow: {
    borderBottomWidth: 12,
    borderRightWidth: 20,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
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
    marginTop: hp('0.5%'),
  },
  transRow: {
    padding: hp('1.8%'),
    paddingRight: 0,
    paddingBottom: hp('3%'),
  },
  transRowNE: {
    padding: hp('1.8%'),
    paddingBottom: hp('3%'),
    opacity: 0.5,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#F2A413',
    paddingBottom: 12,
    zIndex: 60,
  },
  tab: {
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    paddingBottom: 12,
    zIndex: 60,
  },
  activeExIncomeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#DFE4FB',
    padding: hp('2.5%'),
    marginLeft: hp('2%'),
    zIndex: 100,
  },
  exIncometab: {
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    padding: hp('2.5%'),
    marginLeft: hp('2%'),
    zIndex: 100,
  },
});
