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
import AmountDisplay from './AmountDisplay';

function MainExpensePage({route, navigation}) {
  let ls = require('react-native-local-storage');
  const [heading, setHeading] = useState('');
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [notransaction, setNotransaction] = useState(false);
  const [typeIcon, setTypeIcon] = useState('');
  const [chartList, setChartList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [flag, setFlag] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const [orgtotalAmt, setOrgTotalAmt] = useState('');
  const [dataToSend, setDataToSend] = useState('all');
  const [userPreferredCurrency, setUserPreferredCurrency] = useState();

  const {rightDrawerState} = useSelector((state) => state.appConfig);
  const [scrollOffset, setScrollOffset] = useState();
  const isDrawerOpen = useIsDrawerOpen();
  const dispatch = useDispatch();
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
    console.log(chartList);
  }, [notransaction]);
  useEffect(() => {
    console.log('rendered');
  }, [!isEnabled]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ls.save('selectedDrawerItem', 'mainExpensePage');
      Animated.timing(pan.y, {
        toValue: wp('119%'),
        easing: Easing.linear,
      }).start();
      console.log('main function');
      setIsEnabled(true);
      setDataToSend('all');
      // getDisplayData()
      setNotransaction(false);
      setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==');
      setTitle('All Expense');
      getChartData();
      getTransactionList();
    });
    return unsubscribe;
  }, [navigation]);

  const toggleSwitch = () => {
    if (isEnabled == false) {
      setIsEnabled((previousState) => !previousState);
      let li = [...originalList];
      setList(li);
      setTotalAmt(orgtotalAmt);
      setDataToSend('all');
      console.log(list);
      setTitle('All Expense');
      setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==');
      let clist = [...chartList];
      for (let cLi of clist) {
        cLi.bgColor = '#DFE4FB';
      }
      setFlag(true);
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
        global.baseURL + 'customer/dashboard/barChart/E/' + global.loginID,
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
            let d = [...responseJson.data];

            // d.sort(function (a, b) { return b.amount - a.amount });
            d.sort(function (a, b) {
              return (
                b.userPreferredCurrencyAmount - a.userPreferredCurrencyAmount
              );
            });

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
                list.push(data);
              }
            }
            console.log(list);
            setChartList(list);
          } else {
            setChartList([]);
          }
          setFlag(true);
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
        global.baseURL + 'customer/get/transaction/all/E/' + global.loginID,
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
            setList([]);
            setOriginalList([]);
            setTotalAmt(0);
            setOrgTotalAmt(0);
          }
          setFlag(true);
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
        global.baseURL + 'customer/dashboard/barChart/E/' + global.loginID,
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
            let d = [...responseJson.data];

            // d.sort(function (a, b) { return b.amount - a.amount });
            d.sort(function (a, b) {
              return (
                b.userPreferredCurrencyAmount - a.userPreferredCurrencyAmount
              );
            });
            console.log(d[0].percentage);
            // console.log(d)
            let t = 0;
            // for (let li of d) {
            //     t = t + li.percentage
            // }
            let list = [];
            for (let li of d) {
              if (li.percentage != 0) {
                let data = {};
                data.categoryId = li.categoryId;
                data.categoryName = li.categoryName;
                // data.amount = li.amount
                data.amount = li.userPreferredCurrencyAmount;
                data.bgColor = '#DFE4FB';
                // data.height = ((li.percentage / d[0].percentage) * 30)
                data.height = (li.percentage / d[0].percentage) * hp('3.5%');
                // data.marginTop = 80 - ((li.percentage / d[0].percentage) * 80)

                data.percentage = li.percentage.toFixed(2) + '%';
                data.categoryIcon = li.categoryIcon;
                list.push(data);
              }
            }

            console.log(list);
            setChartList(list);
            setFlag(true);
          } else {
            setChartList([]);
            setFlag(true);
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
        global.baseURL + 'customer/get/transaction/all/E/' + global.loginID,
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
            setList([]);
            setOriginalList([]);
            setTotalAmt(0);
            setOrgTotalAmt(0);
          }
          setFlag(true);
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
        // a = a + li.amount
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
          console.log({statementData: item, reDirectTo: 'mainExpensePage'});
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: 'mainExpensePage',
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
            reDirectTo: 'mainExpensePage',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'mainExpensePage',
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
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  // const pan = useState(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 300 }))[0];
  const pan = useState(new Animated.ValueXY({x: 0, y: wp('119%')}))[0];
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
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
        pan.flattenOffset();
        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('15%'),
            // tension: 1
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
        <View>
          <View>
            <Image
              style={{maxWidth: '100%'}}
              source={require('./assets/graph_bg_white(short).png')}></Image>
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
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
                      Expense
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
                      Expense
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

              <Row>
                <Col size={10} style={{marginLeft: 'auto'}}>
                  <Text
                    style={{
                      marginRight: 10,
                      color: '#454F63',
                      textAlign: 'right',
                      fontSize: 15,
                    }}>
                    All Expense
                  </Text>
                </Col>

                <Col size={2} style={{paddingRight: hp('3%'), zIndex: 10}}>
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
          <Animated.View style={{opacity: viewOpacity, zIndex: 30}}>
            {chartList != undefined && chartList.length != 0 ? (
              <FlatList
                horizontal
                style={{
                  marginLeft: hp('2%'),
                  marginRight: hp('2%'),
                  paddingLeft: hp('1.2%'),
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
            paddingBottom: hp('1%'),
          },
        ]}>
        <Animated.View
          style={[styles.layer2, {backgroundColor: _bgColorAnimation}]}>
          {/* <View style={styles.layer2}> */}
          {/* <View style={{
                    height: hp('13%'), backgroundColor: "#DFE4FB",
                    borderTopLeftRadius: 25, borderTopRightRadius: 25,
                    marginBottom: 30
                }}> */}
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
                Total Expense
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
                        fontSize: 24,
                        textAlign: 'right',
                        fontWeight: 'bold',
                      }}>
                      {value}
                    </Text>
                  )}
                /> */}
                {/* <Text style={{ color: '#5E83F2', fontSize: 16, textAlign: 'right', fontWeight: 'bold', marginTop: 'auto', marginBottom: 3, marginLeft: 3 }}>{userPreferredCurrency}</Text> */}
              </View>
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
            paddingBottom: hp('2.5%'),
          }}>
          <View style={styles.line}></View>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
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
                            // value={Number(item.userPreferredCurrencyAmount)}
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

                {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>No Transactions Available</Text> */}
              </View>
            )}
          </Grid>

          {/* </ScrollView> */}
          {/* </View> */}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default MainExpensePage;
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
    marginBottom: hp('-0.8%'),
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
});

// import React, { useState, useEffect, createRef } from 'react'
// import { View, Image, StyleSheet, Text, Animated, TouchableOpacity, Easing, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
// import { Grid, Row, Col } from 'react-native-easy-grid'
// import NumberFormat from 'react-number-format'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { FlatList } from 'react-native-gesture-handler'
// import Moment from 'moment'
// import ToggleSwitch from 'toggle-switch-react-native'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppConfigActions } from './redux/actions'
// import { useIsDrawerOpen } from '@react-navigation/drawer';
// import Spinner from 'react-native-loading-spinner-overlay';

// function MainExpensePage({ navigation }) {
//     let ls = require('react-native-local-storage');
//     const [heading, setHeading] = useState('')
//     const [loader, setLoader] = useState(false)
//     const [spinner, setSpinner] = useState(false)
//     const [list, setList] = useState([])
//     const [originalList, setOriginalList] = useState([])
//     const [notransaction, setNotransaction] = useState(false)
//     const [typeIcon, setTypeIcon] = useState('')
//     const [chartList, setChartList] = useState([])
//     const [isEnabled, setIsEnabled] = useState(true);
//     const [flag, setFlag] = useState(false)
//     const [title, setTitle] = useState('')
//     const [totalAmt, setTotalAmt] = useState('')
//     const [orgtotalAmt, setOrgTotalAmt] = useState('')
//     const [dataToSend, setDataToSend] = useState('all')
//     const { rightDrawerState } = useSelector((state) => state.appConfig);

//     const isDrawerOpen = useIsDrawerOpen();
//     const dispatch = useDispatch();
//     useEffect(() => {
//         console.log('Expense Page')
//         if (rightDrawerState == 'reload' && isDrawerOpen == false) {
//             // getDashboardData()
//             if (spinner == false) {
//                 console.log('isDrawerOpen : ' + isDrawerOpen)

//                 getNoSpinnerChartData()
//                 getNoSpinnerTransactionList()
//             }
//         }
//         return (() => {
//             dispatch(AppConfigActions.resetRightDrawer())
//         })
//     }, [rightDrawerState == 'reload'])
//     useEffect(() => {
//         console.log('rendered')
//         return (() => {
//             setFlag(false)
//         })
//     }, [flag])
//     useEffect(() => {
//         console.log('rendered')
//         console.log(chartList)

//     }, [notransaction])
//     useEffect(() => {
//         console.log('rendered')

//     }, [!isEnabled])
//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             ls.save('selectedDrawerItem', 'mainExpensePage')
//             console.log('main function')
//             setIsEnabled(true)
//             setDataToSend('all')
//             // getDisplayData()
//             setNotransaction(false)
//             setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==')
//             setTitle('All Expense')
//             getChartData()
//             getTransactionList()
//         });
//         return unsubscribe;
//     }, [navigation])

//     const toggleSwitch = () => {

//         if (isEnabled == false) {
//             setIsEnabled(previousState => !previousState);
//             let li = [...originalList]
//             setList(li)
//             setTotalAmt(orgtotalAmt)
//             setDataToSend('all')
//             console.log(list)
//             setTitle('All Expense')
//             setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==')
//             let clist = [...chartList]
//             for (let cLi of clist) {
//                 cLi.bgColor = '#DFE4FB'
//             }
//             setFlag(true)
//         }
//     }
//     getNoSpinnerChartData = () => {

//         let postData = {}
//         ls.get('filterData').then((data) => {
//             // setFilterData(data)
//             setLoader(true)
//             postData.calenderSelectedFlag = 1
//             postData.month = data.month.id
//             postData.year = data.year.year
//             postData.linkedAccountIds = []
//             postData.linkedAccountIds = data.linkedAccountIds
//             let heading = ""
//             if (data.bank[0].bankId == 0 || data.bank.length == 0) {

//                 heading = 'All Banks - ' + data.month.mntName + " " + data.year.year
//             } else
//                 if (data.bank.length > 1) {
//                     heading = data.bank[0].bankName + ' +' + (data.bank.length - 1) + ' - ' + data.month.mntName + " " + data.year.year
//                 } else if (data.bank.length == 1) {
//                     heading = data.bank[0].bankName + ' - ' + data.month.mntName + " " + data.year.year
//                 }
//             setHeading(heading)
//             console.log(JSON.stringify(postData))
//             // fetch(global.baseURL+'customer/dashboard/barChart/E/250001', {
//             fetch(global.baseURL+'customer/dashboard/barChart/E/250001', {
//                 method: 'POST',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(postData)
//             }).then((response) => response.json())
//                 .then((responseJson) => {
//                     console.log(responseJson.data)
//                     let d = [...responseJson.data]

//                     d.sort(function (a, b) { return b.amount - a.amount });
//                     console.log(d[0].percentage)
//                     // console.log(d)
//                     let t = 0
//                     // for (let li of d) {
//                     //     t = t + li.percentage
//                     // }
//                     let list = []
//                     for (let li of d) {
//                         if (li.percentage != 0) {
//                             let data = {};
//                             data.categoryId = li.categoryId
//                             data.categoryName = li.categoryName
//                             data.amount = li.amount
//                             data.bgColor = '#DFE4FB'
//                             data.height = ((li.percentage / d[0].percentage) * 30)
//                             data.percentage = (li.percentage).toFixed(2) + '%'
//                             data.categoryIcon = li.categoryIcon
//                             list.push(data)
//                         }
//                     }
//                     console.log(list)
//                     setChartList(list)
//                     setLoader(false)
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     setLoader(false)
//                 })
//         })
//     }
//     getNoSpinnerTransactionList = () => {

//         let postData = {}
//         ls.get('filterData').then((data) => {
//             setLoader(true)
//             postData.calenderSelectedFlag = 1
//             postData.month = data.month.id
//             postData.year = data.year.year
//             postData.linkedAccountIds = []
//             postData.linkedAccountIds = data.linkedAccountIds
//             let heading = ""
//             if (data.bank[0].bankId == 0 || data.bank.length == 0) {

//                 heading = 'All Banks - ' + data.month.mntName + " " + data.year.year
//             } else
//                 if (data.bank.length > 1) {
//                     heading = data.bank[0].bankName + ' +' + (data.bank.length - 1) + ' - ' + data.month.mntName + " " + data.year.year
//                 } else if (data.bank.length == 1) {
//                     heading = data.bank[0].bankName + ' - ' + data.month.mntName + " " + data.year.year
//                 }
//             setHeading(heading)
//             console.log(JSON.stringify(postData))
//             // fetch(global.baseURL+'customer/get/transaction/all/E/250001', {
//             fetch(global.baseURL+'customer/get/transaction/all/E/250001', {
//                 method: 'POST',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(postData)
//             }).then((response) => response.json())
//                 .then((responseJson) => {
//                     console.log(responseJson.data)
//                     setList(responseJson.data.responseList);
//                     setOriginalList(responseJson.data.responseList)
//                     setTotalAmt(responseJson.data.total)
//                     setOrgTotalAmt(responseJson.data.total)
//                     if (responseJson.data.responseList == null) {
//                         setNotransaction(true)
//                     }
//                     setLoader(false)
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     setLoader(false)
//                 })
//         })
//     }
//     // getDisplayData = () => {
//     //     console.log('Get Data')
//     //     getChartData()
//     //     getTransactionList()
//     // }
//     getChartData = () => {

//         setSpinner(true)
//         let postData = {}
//         ls.get('filterData').then((data) => {
//             // setFilterData(data)

//             postData.calenderSelectedFlag = 1
//             postData.month = data.month.id
//             postData.year = data.year.year
//             postData.linkedAccountIds = []
//             postData.linkedAccountIds = data.linkedAccountIds
//             let heading = ""
//             if (data.bank[0].bankId == 0 || data.bank.length == 0) {

//                 heading = 'All Banks - ' + data.month.mntName + " " + data.year.year
//             } else
//                 if (data.bank.length > 1) {
//                     heading = data.bank[0].bankName + ' +' + (data.bank.length - 1) + ' - ' + data.month.mntName + " " + data.year.year
//                 } else if (data.bank.length == 1) {
//                     heading = data.bank[0].bankName + ' - ' + data.month.mntName + " " + data.year.year
//                 }
//             setHeading(heading)
//             console.log(JSON.stringify(postData))
//             // fetch(global.baseURL+'customer/dashboard/barChart/E/250001', {
//             fetch(global.baseURL+'customer/dashboard/barChart/E/250001', {
//                 method: 'POST',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(postData)
//             }).then((response) => response.json())
//                 .then((responseJson) => {
//                     console.log(responseJson.data)
//                     let d = [...responseJson.data]

//                     d.sort(function (a, b) { return b.amount - a.amount });
//                     console.log(d[0].percentage)
//                     // console.log(d)
//                     let t = 0
//                     // for (let li of d) {
//                     //     t = t + li.percentage
//                     // }
//                     let list = []
//                     for (let li of d) {
//                         if (li.percentage != 0) {
//                             let data = {};
//                             data.categoryId = li.categoryId
//                             data.categoryName = li.categoryName
//                             data.amount = li.amount
//                             data.bgColor = '#DFE4FB'
//                             // data.height = (li.percentage - 13).toFixed(2) + '%'
//                             // data.height = li.percentage / d[0].percentage * 100 + '%'
//                             // data.marginTop = 100 - li.percentage / d[0].percentage * 100
//                             data.height = ((li.percentage / d[0].percentage) * 30)
//                             // data.marginTop = 80 - ((li.percentage / d[0].percentage) * 80)

//                             data.percentage = (li.percentage).toFixed(2) + '%'
//                             data.categoryIcon = li.categoryIcon
//                             list.push(data)
//                         }
//                     }
//                     console.log(list)
//                     setChartList(list)
//                     setSpinner(false)
//                 })
//                 .catch((error) => {
//                     setSpinner(false)
//                     console.log(error)
//                 })
//         })
//     }
//     getTransactionList = () => {

//         setSpinner(true)
//         let postData = {}
//         ls.get('filterData').then((data) => {

//             postData.calenderSelectedFlag = 1
//             postData.month = data.month.id
//             postData.year = data.year.year
//             postData.linkedAccountIds = []
//             postData.linkedAccountIds = data.linkedAccountIds
//             let heading = ""
//             if (data.bank[0].bankId == 0 || data.bank.length == 0) {

//                 heading = 'All Banks - ' + data.month.mntName + " " + data.year.year
//             } else
//                 if (data.bank.length > 1) {
//                     heading = data.bank[0].bankName + ' +' + (data.bank.length - 1) + ' - ' + data.month.mntName + " " + data.year.year
//                 } else if (data.bank.length == 1) {
//                     heading = data.bank[0].bankName + ' - ' + data.month.mntName + " " + data.year.year
//                 }
//             setHeading(heading)
//             console.log(JSON.stringify(postData))
//             // fetch(global.baseURL+'customer/get/transaction/all/E/250001', {
//             fetch(global.baseURL+'customer/get/transaction/all/E/250001', {
//                 method: 'POST',
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(postData)
//             }).then((response) => response.json())
//                 .then((responseJson) => {
//                     console.log(responseJson.data)
//                     setList(responseJson.data.responseList);
//                     setOriginalList(responseJson.data.responseList)
//                     setTotalAmt(responseJson.data.total)
//                     setOrgTotalAmt(responseJson.data.total)
//                     if (responseJson.data.responseList == null) {
//                         setNotransaction(true)
//                     }
//                     setSpinner(false)
//                 })
//                 .catch((error) => {
//                     setSpinner(false)
//                     console.log(error)
//                 })
//         })
//     }
//     filterData = (item) => {
//         setSpinner(true)
//         let list = [...originalList]
//         console.log(item)
//         setNotransaction(false)
//         setTitle(item.categoryName)
//         setTypeIcon(item.categoryIcon)
//         setDataToSend(item.categoryId)
//         let clist = [...chartList]
//         for (let cLi of clist) {
//             if (item.categoryId == cLi.categoryId) {
//                 cLi.bgColor = "#5E83F2"
//             } else {
//                 cLi.bgColor = '#DFE4FB'

//             }
//         }

//         let d = []
//         let a = 0
//         for (let li of list) {
//             if (item.categoryId == li.categoryId) {
//                 d.push(li);
//                 a = a + li.amount
//             }
//         }
//         setTotalAmt(a)
//         if (d.length != 0) {
//             setList(d);
//             setIsEnabled(false)
//             setSpinner(false)
//         } else {
//             setSpinner(false)
//             setNotransaction(true)
//         }
//     }
//     return (
//         < View style={{ flexDirection: 'column', flex: 1, backgroundColor: "white", zIndex: 1 }
//         }>
//             <Spinner
//                 visible={spinner}
//                 overlayColor='rgba(0, 0, 0, 0.65)'
//                 textContent={'Loading...'}
//                 textStyle={styles.spinnerTextStyle}
//             />
//             < TouchableOpacity style={{
//                 width: 50,
//                 height: 50,
//                 position: 'absolute',
//                 bottom: 10,
//                 right: 10,
//                 zIndex: 10
//             }}
//                 onPress={() => navigation.navigate('aggregator')}>
//                 <Image style={{ maxWidth: '100%', height: '100%' }} source={require('./assets/Download_icon.png')}></Image>
//             </TouchableOpacity >
//             <View style={styles.layer1}>

//                 <View  >
//                     <View style={{ zIndex: 1 }}>
//                         <Image style={{ maxWidth: "100%" }} source={require('./assets/graph_bg_white(short).png')}></Image>
//                     </View>
//                     <View style={styles.container}>
//                         <View style={styles.header}>
//                             <TouchableOpacity onPress={navigation.openDrawer} style={{ marginRight: 'auto' }}>
//                                 <Image source={require("./assets/icons-menu(dark).png")}></Image>
//                             </TouchableOpacity >
//                             <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
//                                 <Text style={{ textAlign: 'center' }}>{heading}</Text>

//                             </View>
//                             <TouchableOpacity
//                                 onPress={() => dispatch(AppConfigActions.toggleRightDrawer())} style={{ marginLeft: 'auto' }}>
//                                 <Image style={{ marginLeft: 'auto' }} source={require("./assets/icons-filter-dark(dark).png")}></Image>
//                             </TouchableOpacity>

//                         </View>
//                         <Row>
//                             <Col size={10} >
//                                 <View style={{ flexDirection: 'row' }}>
//                                     <Text style={{
//                                         paddingLeft: hp('3%'),
//                                         color: '#454F63',
//                                         fontWeight: 'bold',
//                                         fontSize: 25
//                                     }}>Expense</Text>
//                                     {loader == true ?
//                                         <View style={{ marginLeft: 'auto', marginTop: hp('1%'), marginRight: hp('3%') }}>
//                                             <ActivityIndicator size="small" color="#454F63" />
//                                         </View>
//                                         : null}
//                                 </View>
//                             </Col>

//                         </Row>
//                     </View>
//                 </View>
//                 <View>
//                     <Row>
//                         <Col size={10} style={{ marginLeft: 'auto' }}>
//                             <Text style={{
//                                 marginRight: 10,
//                                 color: '#454F63',
//                                 textAlign: 'right',
//                                 marginTop: hp('-2%'),
//                                 fontSize: 15
//                             }}>All Expense</Text>

//                         </Col>

//                         <Col size={2} style={{ paddingRight: hp('3%') }}>

//                             <ToggleSwitch
//                                 isOn={isEnabled}
//                                 onColor="#63CDD6"
//                                 offColor="#767577"
//                                 size="medium"
//                                 onToggle={() => toggleSwitch()}
//                             />
//                         </Col>
//                     </Row>
//                 </View>
//                 <FlatList
//                     horizontal
//                     style={{
//                         marginLeft: hp("2%"),
//                         marginRight: hp('2%'),
//                         paddingLeft: hp('1.2%'),

//                         marginBottom: -15,
//                         position: 'absolute',
//                         bottom: 20,
//                         height: hp(40),
//                     }}
//                     showsHorizontalScrollIndicator={false}
//                     data={chartList}
//                     renderItem={({ item }) =>
//                         <TouchableOpacity style={{ paddingRight: hp('2%'), width: wp('17%') }} onPress={() => filterData(item)}>
//                             <View style={{ bottom: 0, position: 'absolute', flex: 1 }}>
//                                 <Text style={{
//                                     marginLeft: 'auto', marginRight: 'auto',
//                                     fontSize: 12,
//                                     color: '#777',
//                                 }}>{item.percentage}</Text>
//                                 <View style={{
//                                     width: wp('9%'), height: hp('9%'),
//                                     marginBottom: hp('-5%'),
//                                     marginLeft: 'auto', marginRight: 'auto', zIndex: 10
//                                 }}>
//                                     <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.categoryIcon }}></Image>
//                                 </View>
//                                 {/* <View style={{ width: 17, flexDirection: 'row' }} >
//                                     <View style={{ transform: [{ rotate: '-90deg' }], width: 200, height: 150, backgroundColor: "yellow", top: 20 }}>
//                                         <Text style={{ fontSize: 8 }}>   {item.categoryName}</Text>
//                                         <Text> {item.amount}</Text>
//                                     </View>
//                                 </View> */}
//                                 <View style={{ padding: hp('3%'), height: hp(item.height), backgroundColor: item.bgColor }}>
//                                 </View>
//                             </View>
//                         </TouchableOpacity>
//                     }
//                 >
//                 </FlatList>

//             </View>
//             <View style={styles.layer2}>
//                 <View style={{
//                     height: hp('13%'), backgroundColor: "#DFE4FB",
//                     borderTopLeftRadius: 25, borderTopRightRadius: 25,
//                     marginBottom: 30
//                 }}>
//                     <Grid>
//                         <Row style={{ padding: hp("2%"), paddingBottom: hp("-4%") }}>
//                             <Col size={2}>
//                                 <View style={{ width: 45, height: 45 }}>
//                                     <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + typeIcon }}></Image>
//                                 </View>
//                             </Col>
//                             <Col size={10}>
//                                 <View style={{ paddingTop: hp('1%') }}>
//                                     <Text style={{ color: '#5E83F2' }}>{title}</Text>
//                                 </View>
//                             </Col>
//                         </Row>
//                         <Col style={{ marginLeft: 'auto', paddingRight: hp('2%') }}>
//                             <Text style={{ color: '#5E83F2', textAlign: 'right' }}>Total Expense</Text>

//                             <NumberFormat
//                                 value={Number(totalAmt).toFixed(2)}
//                                 thousandsGroupStyle="lakh"
//                                 displayType={'text'}
//                                 thousandSeparator={true}
//                                 prefix={'₹'}
//                                 renderText={value => <Text style={{ color: '#5E83F2', fontSize: 24, textAlign: 'right', fontWeight: 'bold' }}>{value}</Text>}
//                             />
//                         </Col>
//                     </Grid>

//                 </View>

//                 <TouchableOpacity style={styles.layer3} onPress={() => navigation.navigate('incomeExpensePage', { type: 'expense', totalAmount: totalAmt, listType: dataToSend })}>
//                     <View style={styles.line}></View>
//                     <Grid>
//                         {notransaction == false ?
//                             <FlatList data={list}
//                                 renderItem={({ item }) =>
//                                     // style={item.notAExpense != "" && item.notAExpense != null && item.notAExpense == true ? styles.transRowNE : styles.transRow}
//                                     <Row style={item.notAExpense != "" && item.notAExpense != null && item.notAExpense == true ? styles.transRowNE : styles.transRow}>
//                                         <Col size={2} style={{ alignItems: 'center' }}>
//                                             <View style={{ width: 45, height: 45 }}>
//                                                 {isEnabled == false && item.merchantIcon != null && item.merchantIcon != "" ?
//                                                     <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.merchantIcon }}></Image>
//                                                     :
//                                                     <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>

//                                                 }
//                                             </View>
//                                         </Col>
//                                         <Col size={4.5} >
//                                             <Text style={{ color: 'white', fontSize: 14 }}>{item.description}</Text>
//                                             <Text style={{ color: 'white', fontSize: 14, opacity: 0.7 }}>{item.category} | {Moment(item.transactionTimestamp, 'YYYY-MM-DD,h:mm:ss').format('ll')}</Text>
//                                         </Col>
//                                         <Col size={4.5} style={{ alignItems: 'flex-end', paddingRight: 10 }}>
//                                             <NumberFormat
//                                                 value={Number(item.amount).toFixed(2)}
//                                                 thousandsGroupStyle="lakh"
//                                                 displayType={'text'}
//                                                 thousandSeparator={true}
//                                                 prefix={'₹'}
//                                                 renderText={value => <Text style={{ color: 'white', fontSize: 18 }}>{value}</Text>}
//                                             />
//                                         </Col>
//                                         <Col size={1}>
//                                             <View style={{ backgroundColor: 'white', height: hp('4.5%'), borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
//                                                 <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: "100%" }} source={{ uri: item.bankIcon }}></Image>
//                                             </View>
//                                         </Col>
//                                     </Row>

//                                 } ></FlatList>
//                             : <View style={{ width: '100%', padding: hp('15%') }}>
//                                 <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center', paddingBottom: hp('1%') }}>Oops! We have drawn a blank here!</Text>
//                                 <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
//                                     No entries to show!</Text>

//                                 {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>No Transactions Available</Text> */}
//                             </View>}
//                     </Grid>
//                 </TouchableOpacity>
//             </View>
//         </View >

//     )
// }

// export default MainExpensePage
// const styles = StyleSheet.create({
//     header: {
//         padding: hp("2.5%"),
//         paddingTop: hp("6.5%"),
//         paddingBottom: hp("2.5%"),
//         zIndex: 10,
//         flexDirection: 'row',
//         paddingBottom: hp('3%')
//     },
//     container: {
//         position: 'absolute',
//         left: 0,
//         right: 0
//     },
//     pageHeading: {
//         color: "white",
//         fontSize: 25,
//         fontWeight: 'bold',
//         paddingLeft: hp("3.5%")
//     },
//     totalAsset: {
//         paddingRight: hp("3.5%")
//     },
//     tAssetLabel: {
//         color: '#FFFFFF',
//         fontSize: 14,
//         textAlign: 'right',
//         opacity: 0.7
//     },
//     tAssetPrice: {
//         color: '#FFFFFF',
//         fontSize: 30,
//         textAlign: 'right'
//     },
//     TouchableOpacityStyle: {
//         position: 'absolute',
//         width: 50,
//         height: 50,
//         alignItems: 'center',
//         justifyContent: 'center',
//         right: 30,
//         bottom: 30,
//         zIndex: 10
//     },

//     FloatingButtonStyle: {
//         resizeMode: 'contain',
//         width: 50,
//         height: 50
//     },
//     layer1: {
//         flex: 3,
//         backgroundColor: "white",
//         opacity: 1,
//         paddingBottom: hp('2%')
//     },
//     layer2: {
//         height: hp('30%'),
//         backgroundColor: "#DFE4FB",
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25
//     },
//     layer3: {
//         flex: 1,
//         backgroundColor: "#5E83F2",
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//         paddingTop: hp('2%')
//     },
//     triangle: {
//         width: 0,
//         height: 0,
//         backgroundColor: 'transparent',
//         borderStyle: 'solid',
//         position: 'absolute',
//         zIndex: 1000
//     },
//     arrow: {
//         borderBottomWidth: 12,
//         borderRightWidth: 20,
//         borderTopWidth: 12,
//         borderTopColor: "transparent",
//         borderBottomColor: "transparent",
//     },
//     spinnerTextStyle: {
//         color: 'white',
//         fontSize: 15
//     },
//     line: {
//         padding: 2,
//         width: hp('6.5%'),
//         borderWidth: 0,
//         backgroundColor: '#DFE4FB',
//         borderRadius: 10,
//         marginLeft: 'auto',
//         marginRight: 'auto',
//         marginTop: hp('0.5%')
//     },
//     transRow: {
//         padding: hp('2%'),
//         paddingRight: 0,
//         paddingBottom: hp("0.5%")
//     },
//     transRowNE: {
//         padding: hp('2%'),
//         paddingBottom: hp("0.5%"),
//         opacity: 0.5
//     }
// })
