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

function MainIncomePage({navigation}) {
  const dispatch = useDispatch();

  let ls = require('react-native-local-storage');
  const [heading, setHeading] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [notransaction, setNotransaction] = useState(false);
  const [typeIcon, setTypeIcon] = useState('');
  const [chartList, setChartList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [scrollOffset, setScrollOffset] = useState();
  const [flag, setFlag] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const [loader, setLoader] = useState(false);
  const [orgtotalAmt, setOrgTotalAmt] = useState('');
  const [dataToSend, setDataToSend] = useState('all');
  const {rightDrawerState} = useSelector((state) => state.appConfig);
  const isDrawerOpen = useIsDrawerOpen();
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [userPreferredCurrency, setUserPreferredCurrency] = useState();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  useEffect(() => {
    console.log('Expense Page');
    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      // getDashboardData()
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);

        getNoSpinnerChartData();
        getNoSpinnerTransactionList();
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);
  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);
  useEffect(() => {
    console.log('rendered');
  }, [notransaction]);
  useEffect(() => {
    console.log('rendered');
  }, [!isEnabled]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ls.save('selectedDrawerItem', 'mainIncomePage');
      Animated.timing(pan.y, {
        toValue: wp('119%'),
        easing: Easing.linear,
      }).start();
      // setIsEnabled(true)
      setNotransaction(false);
      setTypeIcon('QWxsX2NhdGVnb3JpZXNfaWNvbi5wbmc=');
      setTitle('All Income');
      setIsEnabled(true);
      setDataToSend('all');
      // getDisplayData()
      getChartData();
      getTransactionList();
    });
    return unsubscribe;
  }, [navigation]);

  const toggleSwitch = () => {
    if (isEnabled == false) {
      setSpinner(true);
      setIsEnabled((previousState) => !previousState);
      let li = [...originalList];
      setList(li);
      setTotalAmt(orgtotalAmt);
      // list = originalList
      setDataToSend('all');
      console.log(list);
      setTitle('All Income');
      setTypeIcon('QWxsX2NhdGVnb3JpZXNfaWNvbi5wbmc=');

      // }
      let clist = [...chartList];
      for (let cLi of clist) {
        cLi.bgColor = '#DFE4FB';
      }
      setFlag(true);
      setSpinner(false);
    }
  };
  getNoSpinnerChartData = () => {
    let postData = {};
    ls.get('filterData').then((data) => {
      setLoader(true);
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      let heading = '';
      if (data.bank[0].bankId == 0 || data.bank.length == 0) {
        heading = 'All Banks - ' + data.month.mntName + ' ' + data.year.year;
      } else if (data.bank.length > 1) {
        heading =
          data.bank[0].bankName +
          ' +' +
          (data.bank.length - 1) +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      } else if (data.bank.length == 1) {
        heading =
          data.bank[0].bankName +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      }
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(
        global.baseURL + 'customer/dashboard/barChart/I/' + global.loginID,
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
          console.log(responseJson);
          if (responseJson.data != null) {
            let d = [...responseJson.data];
            d.sort(function (a, b) {
              return (
                b.userPreferredCurrencyAmount - a.userPreferredCurrencyAmount
              );
            });
            // d.sort(function (a, b) { return b.amount - a.amount });
            console.log(d[0].percentage);
            let t = 0;
            let list = [];
            for (let li of d) {
              if (li.percentage != 0) {
                let data = {};
                data.categoryId = li.categoryId;
                data.categoryName = li.categoryName;
                // data.amount = li.amount
                data.amount = li.userPreferredCurrencyAmount;
                data.bgColor = '#DFE4FB';
                data.height = (li.percentage / d[0].percentage) * 30;
                // data.height = ((li.percentage / d[0].percentage) * wp('50%'))

                data.percentage = li.percentage.toFixed(2) + '%';
                data.categoryIcon = li.categoryIcon;
                console.log(
                  'percentage : ' +
                    li.percentage / d[0].percentage +
                    'height : ' +
                    data.height,
                );

                list.push(data);
              }
            }
            console.log(list);
            setChartList(list);
          } else {
            setChartList([]);
          }
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    });
  };
  getNoSpinnerTransactionList = () => {
    let postData = {};
    ls.get('filterData').then((data) => {
      setLoader(true);
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      let heading = '';
      if (data.bank[0].bankId == 0 || data.bank.length == 0) {
        heading = 'All Banks - ' + data.month.mntName + ' ' + data.year.year;
      } else if (data.bank.length > 1) {
        heading =
          data.bank[0].bankName +
          ' +' +
          (data.bank.length - 1) +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      } else if (data.bank.length == 1) {
        heading =
          data.bank[0].bankName +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      }
      setHeading(heading);
      console.log(JSON.stringify(postData));
      setList([]);
      setOriginalList([]);
      fetch(
        global.baseURL + 'customer/get/transaction/all/I/' + global.loginID,
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
            setList(responseJson.data.responseList);
            setOriginalList(responseJson.data.responseList);
            let tA = 0;
            for (let d of responseJson.data.responseList) {
              tA = tA + d.userPreferredCurrencyAmount;
            }
            // setTotalAmt(responseJson.data.total)
            setTotalAmt(tA);
            // setOrgTotalAmt(responseJson.data.total)
            setOrgTotalAmt(tA);
            setUserPreferredCurrency(
              responseJson.data.responseList[0].userPreferredCurrency,
            );
            if (responseJson.data.responseList == null) {
              setNotransaction(true);
            }
          } else {
            setNotransaction(true);
            setTotalAmt(0);
            setOrgTotalAmt(0);
          }
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    });
  };

  getChartData = () => {
    setSpinner(true);
    let postData = {};
    ls.get('filterData').then((data) => {
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      let heading = '';
      if (data.bank[0].bankId == 0 || data.bank.length == 0) {
        heading = 'All Banks - ' + data.month.mntName + ' ' + data.year.year;
      } else if (data.bank.length > 1) {
        heading =
          data.bank[0].bankName +
          ' +' +
          (data.bank.length - 1) +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      } else if (data.bank.length == 1) {
        heading =
          data.bank[0].bankName +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      }
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(
        global.baseURL + 'customer/dashboard/barChart/I/' + global.loginID,
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
          console.log(responseJson);
          if (responseJson.data != null) {
            let d = [...responseJson.data];

            d.sort(function (a, b) {
              return (
                b.userPreferredCurrencyAmount - a.userPreferredCurrencyAmount
              );
            });
            // d.sort(function (a, b) { return b.amount - a.amount });

            console.log(d[0].percentage);
            let t = 0;
            let list = [];
            for (let li of d) {
              if (li.percentage != 0) {
                let data = {};
                data.categoryId = li.categoryId;
                data.categoryName = li.categoryName;
                // data.amount = li.amount
                data.amount = li.userPreferredCurrencyAmount;
                data.bgColor = '#DFE4FB';
                data.height = (li.percentage / d[0].percentage) * 30;

                data.percentage = li.percentage.toFixed(2) + '%';
                data.categoryIcon = li.categoryIcon;
                console.log(
                  'percentage : ' +
                    li.percentage / d[0].percentage +
                    'height : ' +
                    data.height,
                );

                list.push(data);
              }
            }
            console.log(list);
            setChartList(list);
          } else {
            setChartList([]);
          }
          setSpinner(false);
        })
        .catch((error) => {
          setSpinner(false);
          console.log(error);
        });
    });
  };
  getTransactionList = () => {
    setSpinner(true);
    let postData = {};
    ls.get('filterData').then((data) => {
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      // postData.linkedAccountIds = []
      // postData.linkedAccountIds = data.linkedAccountIds
      let heading = '';
      if (data.bank[0].bankId == 0 || data.bank.length == 0) {
        heading = 'All Banks - ' + data.month.mntName + ' ' + data.year.year;
      } else if (data.bank.length > 1) {
        heading =
          data.bank[0].bankName +
          ' +' +
          (data.bank.length - 1) +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      } else if (data.bank.length == 1) {
        heading =
          data.bank[0].bankName +
          ' - ' +
          data.month.mntName +
          ' ' +
          data.year.year;
      }
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(
        global.baseURL + 'customer/get/transaction/all/I/' + global.loginID,
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
          if (responseJson.data != null) {
            setNotransaction(false);
            setList(responseJson.data.responseList);
            setOriginalList(responseJson.data.responseList);
            let tA = 0;
            for (let d of responseJson.data.responseList) {
              tA = tA + d.userPreferredCurrencyAmount;
            }
            // setTotalAmt(responseJson.data.total)
            setTotalAmt(tA);
            // setOrgTotalAmt(responseJson.data.total)
            setOrgTotalAmt(tA);
            setUserPreferredCurrency(
              responseJson.data.responseList[0].userPreferredCurrency,
            );
            if (responseJson.data.responseList == null) {
              setNotransaction(true);
            }
            setFlag(true);
          } else {
            setNotransaction(true);
            setList([]);
            setOriginalList([]);
            setTotalAmt(0);
            // setOrgTotalAmt(responseJson.data.total)
            setOrgTotalAmt(0);
          }
          setSpinner(false);
        })
        .catch((error) => {
          setSpinner(false);
          console.log(error);
        });
    });
  };
  filterData = (item) => {
    setSpinner(true);
    let list = [...originalList];
    console.log(item);
    setNotransaction(false);
    setTitle(item.categoryName);
    setTypeIcon(item.categoryIcon);
    setDataToSend(item.categoryId);
    let clist = [...chartList];
    for (let cLi of clist) {
      if (item.categoryId == cLi.categoryId) {
        cLi.bgColor = '#5E83F2';
      } else {
        cLi.bgColor = '#DFE4FB';
      }
    }

    let d = [];
    let a = 0;
    for (let li of list) {
      if (item.categoryId == li.categoryId) {
        d.push(li);
        a = a + li.userPreferredCurrencyAmount;
      }
    }
    setTotalAmt(a);
    if (d.length != 0) {
      setList(d);
      setIsEnabled(false);
      setSpinner(false);
    } else {
      setSpinner(false);
      setNotransaction(true);
    }
  };
  selectedData = (item) => {
    setSpinner(true);
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      // fetch(global.baseURL+'customer/get/transaction/details/' + item.transactionId)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({statementData: item, reDirectTo: 'mainIncomePage'});
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: 'mainIncomePage',
            selectedItem: item,
          });
          setSpinner(false);
        } else {
          let Data = [];
          let parentData = {};
          for (let li of responseJson.data) {
            if (li.type == 'P') {
              parentData = li;
            }
            if (li.type == 'C') {
              Data.push(li);
            }
          }
          console.log({
            statementData: parentData,
            reDirectTo: 'mainIncomePage',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'mainIncomePage',
            splitList: Data,
            selectedItem: item,
          });
          setSpinner(false);
        }
      })
      .catch((error) => {
        setSpinner(false);
        console.error(error);
      });
  };
  // Slider Animation Part

  // const pan = useState(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 300 }))[0];
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
    <Animated.View style={{flex: 1, backgroundColor: 'white'}}>
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
          bottom: 10,
          right: 10,
          zIndex: 20,
        }}
        onPress={() => navigation.navigate('')}>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <Animated.View style={styles.layer1}>
        {/* <View > */}

        <View>
          <View>
            <Image
              style={{maxWidth: '100%'}}
              source={require('./assets/graph_bg_white(short).png')}></Image>
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              {/* <Animated.View style={{ opacity: viewOpacity }}> */}
              <TouchableOpacity
                onPress={navigation.openDrawer}
                style={{marginRight: 'auto'}}>
                <Image
                  source={require('./assets/icons-menu(dark).png')}></Image>
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignSelf: 'center'}}>
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
                      Income
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

              {/* <TouchableOpacity onPress={navigation.openDrawer} style={{ marginRight: 'auto' }}>
                                <Image source={require("./assets/icons-menu(dark).png")}></Image>
                            </TouchableOpacity >
                            <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#454F63', fontWeight: 'bold', fontSize: 15 }}>Expense</Text>
                                <Text style={{ textAlign: 'center', color: '#454F63' }}>{heading}</Text>

                            </View>
                            <TouchableOpacity
                                onPress={() => dispatch(AppConfigActions.toggleRightDrawer())} style={{ marginLeft: 'auto' }}>
                                <Image style={{ marginLeft: 'auto' }} source={require("./assets/icons-filter-dark(dark).png")}></Image>
                            </TouchableOpacity> */}
              {/* </Animated.View> */}
            </View>
            <Animated.View style={{opacity: viewOpacity}}>
              <Row>
                <Col size={10}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        paddingLeft: hp('3%'),
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 25,
                      }}>
                      Income
                    </Text>
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
                  </View>
                </Col>
              </Row>

              <Row style={{zIndex: 50}}>
                <Col size={10} style={{marginLeft: 'auto'}}>
                  <Text
                    style={{
                      marginRight: 10,
                      color: '#454F63',
                      textAlign: 'right',
                      // marginTop: hp('-2%'),
                      fontSize: 15,
                    }}>
                    All Income
                  </Text>
                </Col>

                <Col size={2} style={{paddingRight: hp('3%')}}>
                  <ToggleSwitch
                    isOn={isEnabled}
                    onColor="#63CDD6"
                    offColor="#767577"
                    size="medium"
                    onToggle={() => toggleSwitch()}
                  />
                </Col>
              </Row>
            </Animated.View>
          </View>
        </View>
        <View>
          {/* <Row>
                    <Col size={10} style={{ marginLeft: 'auto' }}>
                        <Text style={{
                            marginRight: 10,
                            color: '#454F63',
                            textAlign: 'right',
                            marginTop: hp('-2%'),
                            fontSize: 15
                        }}>All Expense</Text>

                    </Col>

                    <Col size={2} style={{ paddingRight: hp('3%') }}>

                        <ToggleSwitch
                            isOn={isEnabled}
                            onColor="#63CDD6"
                            offColor="#767577"
                            size="medium"
                            onToggle={() => toggleSwitch()}
                        />
                    </Col>
                </Row> */}

          {/* </View> */}
          {/* <Animated.View>
                <FlatList
                    horizontal
                    style={{
                        marginLeft: hp("2%"),
                        marginRight: hp('2%'),
                        paddingLeft: hp('1.2%'),

                        marginBottom: -15,
                        position: 'absolute',
                        bottom: 20,
                        height: hp(40),
                    }}
                    showsHorizontalScrollIndicator={false}
                    data={chartList}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={{ paddingRight: hp('2%'), width: wp('17%') }} onPress={() => filterData(item)}>
                            <View style={{ bottom: 0, position: 'absolute', flex: 1 }}>
                                <Text style={{
                                    marginLeft: 'auto', marginRight: 'auto',
                                    fontSize: 12,
                                    color: '#777',
                                }}>{item.percentage}</Text>
                                <View style={{
                                    width: wp('9%'), height: hp('9%'),
                                    marginBottom: hp('-5%'),
                                    marginLeft: 'auto', marginRight: 'auto', zIndex: 10
                                }}>
                                    <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.categoryIcon }}></Image>
                                </View>
                           
                                <View style={{ padding: hp('3%'), height: hp(item.height), backgroundColor: item.bgColor }}>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                >
                </FlatList>

            </Animated.View> */}

          <Animated.View style={{opacity: viewOpacity}}>
            {chartList != undefined && chartList.length != 0 ? (
              <FlatList
                horizontal
                style={{
                  marginLeft: hp('2%'),
                  marginRight: hp('2%'),
                  paddingLeft: hp('1.2%'),

                  // marginBottom: hp('50%'),
                  // position: 'absolute',
                  // bottom: 10,
                  // height: hp(40),
                  // height: wp('70%')
                  height: SCREEN_HEIGHT - hp('62%'),
                }}
                showsHorizontalScrollIndicator={false}
                data={chartList}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{paddingRight: hp('2%'), width: wp('17%')}}
                    onPress={() => filterData(item)}>
                    <View style={{bottom: 0, position: 'absolute', flex: 1}}>
                      <Text
                        style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          fontSize: 12,
                          color: '#777',
                        }}>
                        {item.percentage}
                      </Text>
                      <View
                        style={{
                          width: wp('9%'),
                          height: hp('9%'),
                          marginBottom: hp('-5%'),
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          zIndex: 10,
                        }}>
                        <Image
                          resizeMode={'contain'}
                          style={{maxWidth: '100%', height: '100%'}}
                          source={{
                            uri:
                              global.baseURL + 'customer/' + item.categoryIcon,
                          }}></Image>
                      </View>

                      <View
                        style={{
                          padding: hp('3%'),
                          height: hp(item.height),
                          backgroundColor: item.bgColor,
                        }}></View>
                    </View>
                  </TouchableOpacity>
                )}></FlatList>
            ) : (
              <View style={{paddingTop: wp('20%')}}>
                <Text style={{textAlign: 'center', color: '#AAAAAA'}}>
                  No data available
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
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
          },
        ]}>
        <Animated.View
          style={[styles.layer2, {backgroundColor: _bgColorAnimation}]}>
          <Grid>
            <Row style={{padding: hp('2%'), paddingBottom: hp('-4%')}}>
              <Col size={2}>
                <View style={{width: 45, height: 45}}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri: global.baseURL + 'customer/' + typeIcon,
                    }}></Image>
                </View>
              </Col>
              <Col size={10}>
                <View style={{paddingTop: hp('2%')}}>
                  <Text style={{color: '#5E83F2'}}>{title}</Text>
                </View>
              </Col>
            </Row>
            <Col
              style={{
                marginLeft: 'auto',
                paddingRight: hp('2%'),
                marginTop: hp('-4.5%'),
              }}>
              <Text style={{color: '#5E83F2', textAlign: 'right'}}>
                Total Income
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Text
                  style={{
                    color: '#5E83F2',
                    fontSize: 12,
                    textAlign: 'right',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    marginTop: 3,
                    marginRight: 3,
                  }}>
                  {userPreferredCurrency}
                </Text>

                <AmountDisplay
                  style={{
                    color: '#5E83F2',
                    fontSize: 24,
                    textAlign: 'right',
                    fontWeight: 'bold',
                  }}
                  amount={Number(totalAmt)}
                  currency={userPreferredCurrency}
                />
                {/* <NumberFormat
                  value={Number(totalAmt)}
                  displayType={"text"}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  // prefix={'₹'}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: "#5E83F2",
                        fontSize: 24,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {value}
                    </Text>
                  )}
                /> */}
                {/* <Text style={{ color: '#5E83F2', fontSize: 16, textAlign: 'right', fontWeight: 'bold', marginTop: 'auto', marginBottom: 3, marginLeft: 3 }}>{userPreferredCurrency}</Text> */}
              </View>
            </Col>
          </Grid>

          {/* </View> */}
        </Animated.View>
        <Animated.View
          style={{
            backgroundColor: '#5E83F2',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: hp('100%'),
            paddingTop: 10,
            flex: 1,
            paddingBottom: hp('2.5%'),
          }}>
          <View style={styles.line}></View>
          {/* <ScrollView
                        scrollEnabled={isScrollEnable}
                        scrollEventThrottle={16}
                        onScroll={event => {
                            setScrollOffset(event.nativeEvent.contentOffset.y)
                        }}
                    > */}
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(Number(event.nativeEvent.contentOffset.y));
                  console.log(
                    'event.nativeEvent.contentOffset.y : ' +
                      event.nativeEvent.contentOffset.y,
                  );
                }}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{zIndex: 300}}
                    onPress={() => selectedData(item)}>
                    <Row
                      style={
                        item.notAExpense != '' &&
                        item.notAExpense != null &&
                        item.notAExpense == true
                          ? styles.transRowNE
                          : styles.transRow
                      }>
                      <Col size={2} style={{alignItems: 'center'}}>
                        <View style={{width: 45, height: 45}}>
                          {isEnabled == false &&
                          item.merchantIcon != null &&
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
                              fontSize: 10,
                              marginTop: 'auto',
                              marginTop: 2,
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
                          {/* <Text style={{ color: 'white', fontSize: 10, marginTop: 'auto', marginBottom: 2, marginLeft: 3 }}>{item.transactionCurrency}</Text> */}
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
          </Grid>

          {/* </ScrollView> */}
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export default MainIncomePage;
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
    flex: 3,
    backgroundColor: 'white',
    opacity: 1,
    paddingBottom: hp('2%'),
  },
  layer2: {
    height: hp('17%'),
    backgroundColor: '#DFE4FB',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  layer3: {
    flex: 1,
    backgroundColor: '#5E83F2',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    // borderRightWidth: 15,
    borderBottomWidth: 12,
    borderRightWidth: 20,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    // borderRightColor: 'tomato',
    borderBottomColor: 'transparent',
    // borderRightColor: '#FFFFFF1A',
    // marginLeft: -30,
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
    marginTop: hp('1.5%'),
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
});
