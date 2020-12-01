import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import ReactNativeHapticFeedback, {
  TouchableWithHapticFeedback,
} from 'react-native-haptic-feedback';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import PieChart from 'react-native-pie-chart';
import NumberFormat from 'react-number-format';
import { WebView } from 'react-native-webview';
import {
  View,
  Image,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
  Alert,
  Easing,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from './redux/actions';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import ScrollPicker from 'react-native-wheel-scroll-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import SmoothPicker from 'react-native-smooth-picker';
import LinearGradient from 'react-native-linear-gradient';
import AmountDisplay from './AmountDisplay';

const height = hp('48%');
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};
const itemSpacing = 0;
const itemHeight = hp('8.5%');
const snapItem = itemHeight + itemSpacing;
const spacerHeight = (height - hp('8.5%')) / 2;
const bottomSpacerHeight = (height - 29) / 2;
function AccountsPage({ route, totalAsset, navigation }) {
  const scrollY = new Animated.Value(0);
  const scrollRef = React.createRef();

  scrollY.addListener((event) => {
    console.log('Scrolling');
    let index = 0;
    if (event.value != 0) {
      index = event.value / hp('8.5%');
    }

    if (Math.round(index) == 0) {
      console.log('index is 0');
      getSelectedAssetList(asset[0], Math.round(index));
    } else if (Math.round(index) > asset.length - 1) {
      console.log('index is ' + asset.length - 1);
      getSelectedAssetList(asset[asset.length - 1], Math.round(index));
    } else {
      for (let i = 0; i < asset.length; i++) {
        if (i == Math.round(index)) {
          console.log('index is ' + i);
          getSelectedAssetList(asset[i], Math.round(index));
        }
      }
    }
  });
  const dispatch = useDispatch();
  const [transactionList, setTransactionList] = useState([]);
  const [selectedSmoothPickerEle, setSelectedSmoothPickerEle] = useState(0);
  const [bgC, setBgC] = useState('#5E83F2');
  const [assetList, setAssetList] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [asset, setAsset] = useState([]);
  const [assetSeries, setAssetSeries] = useState([]);
  const [assetSliceColor, setAssetSliceColor] = useState([]);
  const [totalList, setTotalList] = useState([]);
  const [scrollEndStatus, setScrollEndStatus] = useState(false);
  const [list, setList] = useState([]);
  const [bankList, setBankList] = useState([]);
  var { width, height } = Dimensions.get('window');
  var fadeFlage = false;
  const xValue = new Animated.Value(0);
  const chart_wh = wp('55%');
  // const sliceColor = ['#63CDD6', '#F2A413', '#F22973'];
  const sliceColor = [
    '#5E83F2',
    '#63CDD6',
    '#F2A413',
    '#F22973',
    '#FCD6E2',
    '#5E83F24D',
    '#FBE3B7',
    '#D0F0F3',
    '#C8C3FD',
    '#427087',
    '#FD8C60',
    '#D94545',
    '#731314',
    '#2C356C',
  ];
  const [singleAccount, setSingleAccount] = useState(false)
  const [asssetsList, setAsssetsList] = useState({});
  const [totalAssetAmt, setTotalAssetAmt] = useState('');
  const [flag, setFlag] = useState(false);
  const [heading, setHeading] = useState('');
  const [loader, setLoader] = useState(false);
  let ls = require('react-native-local-storage');
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [dataTosend, setDataTosend] = useState('');
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const pan = useState(new Animated.ValueXY({ x: 0, y: hp('68%') }))[0];
  const [consentStatus, setConsentStatus] = useState(false);
  const [chartRotation, setChartRotation] = useState('');
  const [currentPosition, setcurrentPosition] = useState('');
  const [prevSpreadAngle, setprevSpreadAngle] = useState('');
  const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState(
    '',
  );
  const scrollOffset = 0;
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log(gestureState);
        console.log('singleAccount : ' + singleAccount);
        // setTimeout(() => {
        console.log('asset : ' + asset)

        if ((singleAccount == false || asset.length > 1) &&
          ((isScrollEnable == true && scrollOffset <= 0) ||
            (isScrollEnable == false &&
              gestureState.moveY >= hp('68%') &&
              gestureState.dy > 0) ||
            (isScrollEnable == false &&
              gestureState.moveY <= hp('68%') &&
              gestureState.dy < 0))
        ) {
          return true;
        } else {
          return false;
        }
        // }, 50)
      },
      onPanResponderGrant: (evt, gestureState) => {
        // pan.setOffset({
        //   x: pan.x._value,
        //   y: pan.y._value
        // });
        pan.extractOffset();
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      //   onPanResponderMove: Animated.event(
      //     [
      //       null,
      //       { dx: pan.x, dy: pan.y }
      //     ]
      //   ),
      onPanResponderRelease: (evt, gestureState) => {
        console.log(gestureState.dy);
        pan.flattenOffset();
        console.log('moveY :' + gestureState.moveY + ' , hp :' + hp('68%'));
        // if (gestureState.moveY >= hp('68%') && gestureState.dy < 0) {
        //     setIsScrollEnable(true)
        //     Animated.timing(pan.y, {
        //         toValue: hp('68%'),

        //         // tension: 1
        //     }).start()
        // } else if (gestureState.moveY <= hp('68%') && gestureState.dy > 0) {
        //     setIsScrollEnable(false)
        //     Animated.timing(pan.y, {
        //         toValue: hp('10%'),
        //         // tension: 1
        //     }).start()
        // }
        // else
        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.spring(pan.y, {
            toValue: wp('13%'),
            tension: 1,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.spring(pan.y, {
            toValue: hp('68%'),
            tension: 1,
          }).start();
        }
      },
    }),
  )[0];
  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };
  const viewOpacity = pan.y.interpolate({
    inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 300],
    // inputRange: [0, SCREEN_HEIGHT - 500],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const _opacityAnimation = pan.y.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
    // extrapolate: 'clamp'
  });

  const { rightDrawerState } = useSelector((state) => state.appConfig);

  const isDrawerOpen = useIsDrawerOpen();
  const [_bgColorAnimation, set_bgColorAnimation] = useState();
  useEffect(() => {
    console.log('Dashboard Page');
    // console.log(route.params.assets.length)
    if (singleAccount == true) {
      Animated.spring(pan.y, {
        toValue: wp('13%'),
        tension: 1,
      }).start();
    } else {
      Animated.spring(pan.y, {
        toValue: hp('68%'),
        tension: 1,
      }).start();
    }

    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);
        // scrollRef.scrollToTop = true
        // scrollRef.scrollTo(0)
        console.log(scrollRef);

        getNoSpinnerAssetData();
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);
  useEffect(() => {
    console.log('setSingleAccount : ' + singleAccount)
    return () => {
      setFlag(false);
      // setLoader(false);
    };
  }, [flag == true]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (singleAccount == true) {
        Animated.spring(pan.y, {
          toValue: wp('13%'),
          tension: 1,
        }).start();
      } else {
        Animated.spring(pan.y, {
          toValue: hp('68%'),
          tension: 1,
        }).start();
      }
      console.log('Dashboard Page Spinner On');
      ls.save('selectedDrawerItem', 'accounts');
      getAssetData();
    });
    return unsubscribe;
  }, [navigation]);
  getNoSpinnerAssetData = () => {
    let postData = {};
    let linkList = 0;
    ls.get('consentStatus').then((data) => {
      console.log('consentStatus : ' + data);
      if (data == 'true') {
        linkList = 1;
      }
    });
    ls.get('filterData').then((data) => {
      setLoader(true);
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (linkList == 1 || data.flag == false) {
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
      fetch(global.baseURL + 'customer/assets/' + global.loginID, {
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

          setTotalList(responseJson.data.assets);
          let tAssetDetails = [];
          let tAmount = 0;
          setCustomerPreferredCurrency(
            responseJson.data.assets[0].assets[0].userPreferredCurrency,
          );
          console.log(
            responseJson.data.assets[0].assets[0].userPreferredCurrency,
          );
          for (let at of responseJson.data.assets) {
            at.bgColor = undefined;
            at.active = false;
            at.bgColorSelected = '#5E83F2';
            tAssetDetails.push(at);
            // tAmount = tAmount + at.totalAssetvalue;
            tAmount = tAmount + at.totalAssetValueInUserPreferredCurrency;
          }
          let bankLi = [];
          for (let tAsset of tAssetDetails) {
            bankLi.push(tAsset.fiName);
          }
          setBankList(bankLi);
          setTotalAssetAmt(Number(tAmount));
          tAssetDetails.sort(function (a, b) {
            return (
              b.totalAssetValueInUserPreferredCurrency -
              a.totalAssetValueInUserPreferredCurrency
            );
          });
          setAsset(tAssetDetails);
          addAssetChartData(responseJson.data.assets);

          let prevspreadangle = 0;
          let selectedSpreadAngle = Math.round(
            (asset[0].totalAssetValueInUserPreferredCurrency / totalAssetAmt) *
            180,
          );
          let rotationAngle =
            Number(prevspreadangle) + Math.round(selectedSpreadAngle / 2);
          let piechartRotation = 90 - Number(rotationAngle);
          setChartRotation(piechartRotation + 'deg');
          setprevSpreadAngle(selectedSpreadAngle);
          console.log(assetSeries);
          console.log(assetSliceColor);
          tAssetDetails[0].bgColorSelected = '#FFFFFF2E';
          tAssetDetails[0].active = true;
          setAssetList(tAssetDetails[0].assets);
          setBgC(asssetsList.bgColor);
          // set_bgColorAnimation(
          //   viewOpacity.interpolate({
          //     inputRange: [0, 0, 1],
          //     outputRange: [
          //       'transparent',
          //       asssetsList.bgColor,
          //       asssetsList.bgColor,
          //     ],
          //   }),
          // );
          if (tAssetDetails.length > 1) {
            setSingleAccount(false)
            set_bgColorAnimation(
              viewOpacity.interpolate({
                // inputRange: [0, 1],
                // outputRange: ['transparent', asssetsList.bgColor]
                inputRange: [0, 0, 1],
                // inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT],
                outputRange: [
                  'transparent',
                  asssetsList.bgColor,
                  asssetsList.bgColor,
                ],
                // outputRange: ['transparent', 'blue', 'blue']
                // extrapolate: 'clamp'
              }),
            );
          } else {
            setSingleAccount(true)
            Animated.spring(pan.y, {
              toValue: wp('13%'),
              tension: 1,
            }).start();
          }
          setLoader(false);
          setFlag(true)
        })
        .catch(() => {
          console.log(error);
          setLoader(false);
        });
    });
  };
  getAssetData = () => {
    setSpinner(true);
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
      if (linkList == 1 || data.flag == false) {
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
      // fetch(global.baseURL+'customer/assets/250001', {
      fetch(global.baseURL + 'customer/assets/' + global.loginID, {
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
          setTotalList(responseJson.data.assets);
          let tAssetDetails = [];
          let tAmount = 0;
          // setCustomerPreferredCurrency(responseJson.data.assets[0].userPreferrrdCurrency)

          for (let at of responseJson.data.assets) {
            at.bgColorSelected = '#5E83F2';
            tAssetDetails.push(at);
            // tAssetDetails[0].active = true;
            // tAmount = tAmount + at.totalAssetvalue;
            tAmount = tAmount + at.totalAssetValueInUserPreferredCurrency;
          }
          let bankLi = [];
          for (let tAsset of tAssetDetails) {
            bankLi.push(tAsset.fiName);
          }
          setBankList(bankLi);
          setTotalAssetAmt(Number(tAmount));
          tAssetDetails.sort(function (a, b) {
            return (
              b.totalAssetValueInUserPreferredCurrency -
              a.totalAssetValueInUserPreferredCurrency
            );
          });
          tAssetDetails[0].active = true;
          setAsset(tAssetDetails);
          setCustomerPreferredCurrency(tAssetDetails[0].userPreferrrdCurrency);

          console.log('anusha in response' + Number(tAmount).toFixed(2));
          let totalamt = Number(tAmount).toFixed(2);
          let prevspreadangle = 0;
          let selectedSpreadAngle =
            (Number(tAssetDetails[0].totalAssetValueInUserPreferredCurrency) /
              Number(totalamt)) *
            360;
          console.log('selected spread angle' + selectedSpreadAngle);
          let rotationAngle = Number(prevspreadangle) + selectedSpreadAngle / 2;
          let piechartRotation = 90 - Number(rotationAngle);
          console.log('selected spread angle' + piechartRotation);
          // let prevspreadangle = 0;
          // let selectedSpreadAngle = Math.round(
          //   (Number(tAssetDetails[0].totalAssetvalue) / Number(totalamt)) * 360,
          // );
          // console.log('selected spread angle' + selectedSpreadAngle);
          // let rotationAngle =
          //   Number(prevspreadangle) + Math.round(selectedSpreadAngle / 2);
          // let piechartRotation =
          //   360 - Number(selectedSpreadAngle) + rotationAngle;

          setcurrentPosition(0);
          setChartRotation(piechartRotation + 'deg');
          setprevSpreadAngle(selectedSpreadAngle);
          addAssetChartData(responseJson.data.assets);
          // setCustomerPreferredCurrency(asset[0].userPreferrrdCurrency)
          console.log(assetSeries);
          console.log(assetSliceColor);
          tAssetDetails[0].bgColorSelected = '#FFFFFF2E';
          tAssetDetails[0].active = true;
          setAsssetsList(tAssetDetails[0]);
          setBgC(tAssetDetails[0].bgColor);
          setAssetList(tAssetDetails[0].assets);


          if (tAssetDetails.length > 1) {
            setSingleAccount(false)
            set_bgColorAnimation(
              viewOpacity.interpolate({
                // inputRange: [0, 1],
                // outputRange: ['transparent', asssetsList.bgColor]
                inputRange: [0, 0, 1],
                // inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT],
                outputRange: [
                  'transparent',
                  tAssetDetails[0].bgColor,
                  tAssetDetails[0].bgColor,
                ],
                // outputRange: ['transparent', 'blue', 'blue']
                // extrapolate: 'clamp'
              }),
            );
          } else {
            setSingleAccount(true)
            Animated.spring(pan.y, {
              toValue: wp('13%'),
              tension: 1,
            }).start();
          }
          setFlag(true)
          setSpinner(false);

        })
        .catch(() => {
          setSpinner(false);
          console.log(error);
        });
    });
  };
  addAssetChartData = (list) => {
    let d = [];
    let color = [];

    for (let a of list) {
      d.push(Number(a.totalAssetValueInUserPreferredCurrency));
    }
    d.sort(function (a, b) {
      return b - a;
    });
    // d.push(Number(totalAssetAmt));
    setAssetSeries(d);

    for (let i = 0; i < asset.length; i++) {
      if (i < sliceColor.length) {
        color.push(sliceColor[i]);
        asset[i].bgColor = sliceColor[i];
      } else {
        let c =
          'rgb(' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ')';
        color.push(c);
        asset[i].bgColor = c;
      }
    }
    color.push('#5e83f2');
    setAssetSliceColor(color);
  };

  const getSelectedAssetList = (value, index) => {
    setSpinner(true);
    setSelectedSmoothPickerEle(index);
    // console.log('ChartRotation : ' + chartRotation)
    console.log(value);
    let li = [...asset];
    for (let l of li) {
      if (l.fiId == value.fiId) {
        if (currentPosition != index) {
          // console.log('selected spread angle' + JSON.stringify(asset));
          ReactNativeHapticFeedback.trigger('impactHigh', options);
          let selectedSpreadAngle =
            (Number(value.totalAssetValueInUserPreferredCurrency) /
              Number(totalAssetAmt)) *
            360;
          let prevSpreadAngle = 0;
          console.log('current index' + index);
          for (let val of asset) {
            if (index == asset.indexOf(val)) {
              break;
            } else {
              let angle =
                (Number(val.totalAssetValueInUserPreferredCurrency) /
                  Number(totalAssetAmt)) *
                360;
              prevSpreadAngle = Number(prevSpreadAngle) + Number(angle);
            }
            console.log('indexof anusha' + asset.indexOf(val));
          }
          console.log('prev spread angle' + prevSpreadAngle);
          console.log('selected spread angle' + selectedSpreadAngle);

          let rotationAngle = Number(prevSpreadAngle) + selectedSpreadAngle / 2;
          let piechartRotation = 90 - Number(rotationAngle);
          console.log('piechart spread angle' + piechartRotation);
          setcurrentPosition(index);
          setChartRotation(piechartRotation + 'deg');
          // setprevSpreadAngle(
          //   Number(prevSpreadAngle) + Number(selectedSpreadAngle),
          // );
        }
        l.bgColorSelected = '#FFFFFF2E';
        l.active = true;
      } else {
        l.bgColorSelected = '#5E83F2';
        l.active = false;
      }
    }
    setList(li);
    console.log(list);
    setAsssetsList(value);
    setAssetList(value.assets);
    setBgC(value.bgColor);
    set_bgColorAnimation(
      viewOpacity.interpolate({
        // inputRange: [0, 1],
        // outputRange: ['transparent', asssetsList.bgColor]
        inputRange: [0, 0, 1],
        // inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT],
        outputRange: ['transparent', value.bgColor, value.bgColor],
        // outputRange: ['transparent', 'blue', 'blue']
        // extrapolate: 'clamp'
      }),
    );
    setFlag(true);
    setSpinner(false);
  };
  function moveAnimation() {
    if (fadeFlage == false) {
      fadeFlage = true;
      Animated.timing(xValue, {
        toValue: width - 70,
        duration: 350,
        asing: Easing.linear,
      }).start();
    } else {
      fadeFlage = false;
      Animated.timing(xValue, {
        toValue: 0,
        duration: 350,
        asing: Easing.linear,
      }).start();
    }
  }

  getTransactions = (item) => {
    Animated.spring(pan.y, {
      toValue: wp('13%'),
      tension: 1,
    }).start();

    setSpinner(true);
    let postData = {};

    ls.get('filterData').then((filterData) => {
      postData.linkedAccountId = item.linkedAccountId;
      postData.month = filterData.month.id;
      postData.year = filterData.year.year;
      console.log(JSON.stringify(postData));

      // fetch(global.baseURL+'customer/mode/wise/getTransactions', {
      fetch(global.baseURL + 'customer/mode/wise/getTransactions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          let data = {};
          setTransactionList([]);
          data.fiName = asssetsList.fiName;
          data.fiLogo = asssetsList.fiLogo;
          data.fiId = asssetsList.fiId;
          data.totalAssetvalue = asssetsList.totalAssetvalue;
          // data.asset = route.params
          data.assetData = item;
          data.transactionData = responseJson.data;
          ls.save('linkedAccountId', data.assetData.linkedAccountId);
          setDataTosend(data);
          setTransactionList(responseJson.data);
          console.log(responseJson.data);
          let AList = [];
          let routerList = [...assetList];
          for (let aLi of routerList) {
            console.log(aLi);
            if (item.linkedAccountId == aLi.linkedAccountId) {
              aLi.transactionList = responseJson.data;
              if (responseJson.message == 'No Data Available') {
                Alert.alert('Alert', 'No transactions carried out !!');
              }
            } else {
              // setTimeout(() => {
              aLi.transactionList = null;

              // }, 10)
            }
            AList.push(aLi);
          }
          setAssetList(AList);
          setFlag(true);
          setTimeout(() => {
            setSpinner(false);
          }, 10);
        })
        .catch((error) => {
          setSpinner(false);
          console.error(error);
        });
    });
  };
  const handleScroll = (event) => {
    const paddingToBottom = 30;
    setScrollEndStatus(
      event.nativeEvent.layoutMeasurement.height +
      event.nativeEvent.contentOffset.y >=
      event.nativeEvent.contentSize.height - paddingToBottom,
    );
    console.log(scrollEndStatus);
    let value =
      Math.round(event.nativeEvent.contentOffset.y / 30) +
      Math.round(asset.length / 2);
    let position = event.nativeEvent.contentOffset.y;
    let differnce = Math.round(value) - Math.round(asset.length / 2);
    // console.log(bankList)
    // setTimeout(() => {

    if (differnce > 0) {
      console.log('difference is  greater than zero');
    }
    // }, 10)

    // if ((Math.round(value) - Math.round(asset.length / 2)) > 0) {
    //     let list = [...asset]
    //     while ((Math.round(value) - Math.round(asset.length / 2)) != 0) {
    //         // for (let l of (Math.round(value) - Math.round(asset.length / 2))) {
    //         console.log('inner loop')
    //         let data = {}
    //         data.fiName = ''
    //         data.bgColorSelected = ''
    //         data.fiLogo = ''
    //         data.linkedAccountId = ''
    //         console.log(data)
    //         // list.push(data)
    //     }
    //     // setAsset(list)
    //     // setFlag(true)
    // }
    console.log('contentOffset: ' + event.nativeEvent.contentOffset.y);
    event.nativeEvent.contentOffset.y = 0;
    flatListRef.scrollToIndex({
      animated: true,
      index: Math.round(event.nativeEvent.contentOffset.y / 30),
    });

    // ((Math.round(event.nativeEvent.contentOffset.y / 30)) * 30);
    console.log('contentOffset: ' + event.nativeEvent.contentOffset.y);
    // console.log("differnce : " + (Math.round(value) - Math.round(asset.length / 2)))
    console.log('value : ' + value * 30);
  };
  revokeConsent = () => {
    // fadeFlage = true;
    setConsentStatus(true);
  };
  if (consentStatus) {
    return (
      // <ScrollView>

      <WebView
        scrollEnabled={true}
        source={{ uri: 'https://finvu.in/webview/onboarding/webview-login' }}
        startInLoadingState={true}
        style={{ flex: 1, marginTop: 15 }}
        onNavigationStateChange={(e) => {
          console.log('current state is ', JSON.stringify(e, null, 2));
          // console.log(e);
          /** put your comdition here based here and close webview.
                     Like if(e.url.indexOf("end_url") > -1)
                     Then close webview
                     */
        }}
      />
      // {/* </ScrollView> */ }
    );
  } else {
    return (
      <Animated.View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#5E83F2', '#2F4279', '#2F4279']}
          style={styles.linearGradient}>
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
              zIndex: 30,
            }}
            onPress={() => navigation.navigate('aggregator')}>
            <Image
              style={{ maxWidth: '100%', height: '100%' }}
              source={require('./assets/Addbutton.png')}
            />
          </TouchableOpacity>
          <Animated.View style={styles.layer1}>
            <View style={{ height: hp('30%') }}>
              <View>
                <Image
                  style={{ maxWidth: '100%' }}
                  source={require('./assets/graph_bg.png')}
                />
              </View>

              <View style={styles.container}>
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={navigation.openDrawer}
                    style={{ marginRight: 'auto' }}>
                    <Image
                      source={require('./assets/icons-menu(white)(2).png')}
                    />
                  </TouchableOpacity>
                  <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                    <Text style={{ textAlign: 'center', color: 'white' }}>
                      {heading}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(AppConfigActions.toggleRightDrawer())
                    }
                    style={{ marginLeft: 'auto' }}>
                    <Image
                      style={{ marginLeft: 'auto' }}
                      source={require('./assets/icons-filter-dark(white)(1).png')}
                    />
                  </TouchableOpacity>
                </View>
                <Animated.View style={{ opacity: viewOpacity }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.pageHeading}>Accounts</Text>
                    {loader == true ? (
                      <View
                        style={{
                          marginLeft: 'auto',
                          marginTop: hp('1%'),
                          marginRight: hp('3%'),
                        }}>
                        <ActivityIndicator size="small" color="white" />
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.totalAsset}>
                    <Text style={styles.tAssetLabel}>Total Assets</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}>
                      <Text
                        style={[
                          styles.tAssetPrice,
                          { fontSize: 13, marginTop: 4, marginRight: 3 },
                        ]}>
                        {customerPreferredCurrency}
                      </Text>
                      <AmountDisplay
                        style={styles.tAssetPrice}
                        amount={Number(totalAssetAmt)}
                        currency={customerPreferredCurrency}
                      />
                      {/* <NumberFormat
                        value={Number(totalAssetAmt)}
                        displayType={'text'}
                        thousandsGroupStyle={global.thousandsGroupStyle}
                        thousandSeparator={global.thousandSeparator}
                        decimalScale={global.decimalScale}
                        fixedDecimalScale={true}
                        // prefix={'₹'}
                        renderText={(value) => (
                          <Text style={styles.tAssetPrice}>{value}</Text>
                        )}
                      /> */}
                    </View>
                  </View>
                </Animated.View>
              </View>
            </View>
            {/* <Animated.View style={{ opacity: viewOpacity }}> */}
            <Grid style={{ zIndex: 5 }}>
              <Row>
                <Col size={3}>
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: hp('4.5%'),
                      left: '-110%',
                      transform: [
                        {
                          rotate:
                            chartRotation != ''
                              ? chartRotation.toString()
                              : '0deg',
                        },
                      ],
                    }}

                  // {...pieChartPanResponder.panHandlers}
                  >
                    {/* <View style={{ position: 'absolute', top: hp("4.5%"), left: '-114%' }}> */}
                    <PieChart
                      chart_wh={chart_wh}
                      // style={styles.piechartcss}
                      // borderWidth={1}
                      series={assetSeries}
                      sliceColor={assetSliceColor}
                      doughnut={true}
                      coverRadius={0.55}
                      coverFill={'#2F4279'}
                    />
                  </Animated.View>
                </Col>
                {/* <Col size={1}></Col>
                        <Col size={1} style={styles.triangle, [{ position: 'absolute', top: '27.5%', left: '30.8%' }]}>
                            <View style={styles.arrow} />
                        </Col> */}
                {/* <Col size={2} style={styles.triangle}>
                            <View style={styles.arrow} />
                        </Col> */}
                <Col size={2} />
                <Col size={7}>
                  <View style={styles.bankList}>
                    <Animated.ScrollView
                      style={{ width: '100%', marginLeft: hp('5%') }}
                      bounces={false}
                      ref={scrollRef}
                      // ref={(ref) => { flatListRef = ref }}
                      scrollEventThrottle={16}
                      // scrollToIndex={0}
                      snapToInterval={snapItem}
                      onScroll={
                        // handleScroll}
                        Animated.event(
                          [
                            {
                              nativeEvent: {
                                contentOffset: { y: scrollY },
                              },
                            },
                          ],
                          // ,
                          // { useNativeDriver: true }
                        )
                      }>
                      {/* <TouchableWithHapticFeedback> */}
                      <View style={styles.spacer} />
                      {asset.map((item) => (
                        <View style={styles.bank}>
                          {/* <Text>{item.fiName}</Text> */}
                          {/* <Row> */}
                          {/* <Col size={2} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                                <View style={[styles.triangle, styles.arrow, { borderRightColor: item.bgColorSelected }]} />

                                            </Col> */}
                          {/* <Col> */}
                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View
                              style={
                                item.active == true
                                  ? styles.activeBankIcon
                                  : styles.inActiveBankIcon
                              }>
                              <Image
                                resizeMode={'contain'}
                                style={{
                                  maxWidth: '100%',
                                  height: '100%',
                                  borderRadius: 30,
                                }}
                                source={{ uri: item.fiLogo }}
                              />
                            </View>
                            <Text
                              style={
                                item.active == true
                                  ? styles.activeBankText
                                  : styles.inActiveBankText
                              }>
                              {item.fiName}
                            </Text>
                          </View>
                          {/* </Col>
                                            </Row> */}
                        </View>
                      ))}
                      <View style={{ height: bottomSpacerHeight }} />
                      {/* </TouchableWithHapticFeedback> */}
                    </Animated.ScrollView>
                    {/* <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={styles.triangle, styles.arrow} /> */}
                    {/* <View style={[styles.triangle, styles.arrow], { backgroundColor: 'black' }} /> */}
                    <View style={styles.indicatorWrapper}>
                      {/* <View style={styles.triangle, styles.arrow} /> */}
                      {/* </View> */}
                      <View style={styles.triangle}>
                        <View style={styles.arrow} />
                      </View>
                    </View>
                  </View>
                </Col>
              </Row>
            </Grid>
          </Animated.View>
          {/* </Animated.View > */}
          {
            singleAccount
              ?
              <View
                style={
                  {
                    position: 'absolute',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    top: wp('13%'),
                    // backgroundColor: _bgColorAnimation,
                    height: SCREEN_HEIGHT - 50,
                  }
                }>
                <Animated.View
                  style={{
                    height: hp('15%'),
                    // backgroundColor: asssetsList.bgColor,
                    backgroundColor: _bgColorAnimation,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    marginBottom: 30,
                  }}>
                  <Animated.View style={{ right: xValue }}>
                    <Grid>
                      <Row style={{ width: '100%' }}>
                        <Col>
                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View
                              style={{
                                padding: hp('2.5%'),
                                paddingTop: hp('1.5%'),
                                paddingLeft: wp('5%'),
                              }}>
                              <View
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  border: 10,
                                  backgroundColor: 'white',
                                }}>
                                <Image
                                  resizeMode={'contain'}
                                  style={{
                                    maxWidth: '100%',
                                    height: '100%',
                                    borderRadius: 40,
                                  }}
                                  source={{ uri: asssetsList.fiLogo }}
                                />
                              </View>
                            </View>
                            <View
                              style={{ paddingTop: hp('3.5%'), width: wp('62%') }}>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontSize: 16,
                                  marginLeft: -10,
                                  height: 100,
                                }}>
                                {asssetsList.fiName != null
                                  ? asssetsList.fiName
                                  : '               '}
                              </Text>
                            </View>
                            <View style={{ paddingTop: hp('3%') }}>
                              <View
                                style={{
                                  width: 30,
                                  height: 30,
                                  alignItems: 'flex-end',
                                }}>
                                <TouchableOpacity onPress={() => moveAnimation()}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/icon-settings_white.png')}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => { console.log('clicked') }} style={{ alignItems: 'center', zIndex: 10 }}>
                                                <View style={{ width: 60, height: 60 }}>
                                                    <Image style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/consent_icon.png")}></Image>
                                                </View>
                                                <Text style={{ fontSize: 10, color: "white" }}>Revoke Consent</Text>
                                            </TouchableOpacity> */}
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                paddingTop: hp('1.5%'),
                                marginLeft: wp('12%'),
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginRight: hp('3%'),
                                }}>
                                <View style={{ width: 60, height: 60 }}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/Send_fund_icon.png')}
                                  />
                                </View>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: 'white',
                                    height: 100,
                                  }}>
                                  Send Funds
                            </Text>
                              </View>
                              {/* </Col>
                                                        <Col> */}
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginRight: hp('3%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('requestFunds')
                                  }
                                  style={{ zIndex: 10, width: 60, height: 60 }}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/Request_fund_icon.png')}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: 'white',
                                    height: 100,
                                  }}>
                                  Request Funds
                            </Text>
                              </View>
                              {/* </Col>
                                                        <Col></Col>
                                                    </Row>
                                                </Grid> */}
                            </View>
                          </View>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: hp('8%'), height: 100 }}>
                        <Col>
                          <View style={{ paddingRight: wp('7%') }}>
                            <Text style={[styles.tAssetLabel]}>
                              Assets in the bank
                        </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-end',
                              }}>
                              {/*  */}
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 13,
                                  textAlign: 'right',
                                  marginTop: 3,
                                  marginRight: 3,
                                  height: 150,
                                }}>
                                {customerPreferredCurrency}
                              </Text>
                              <AmountDisplay
                                style={{
                                  color: 'white',
                                  fontSize: 24,
                                  textAlign: 'right',
                                  height: 150,
                                }}
                                amount={
                                  asssetsList.totalAssetvalue != null
                                    ? Number(
                                      asssetsList.totalAssetValueInUserPreferredCurrency,
                                    )
                                    : Number(0)
                                }
                                currency={customerPreferredCurrency}
                              />
                              {/* <NumberFormat
                            value={
                              asssetsList.totalAssetvalue != null
                                ? Number(
                                    asssetsList.totalAssetValueInUserPreferredCurrency,
                                  )
                                : Number(0)
                            }
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 24,
                                  textAlign: 'right',
                                  height: 150,
                                }}>
                                {value}
                              </Text>
                            )}
                          /> */}
                            </View>
                          </View>
                        </Col>
                      </Row>
                    </Grid>
                    {/* </Animated.View></Animated.View> */}
                  </Animated.View>
                </Animated.View>
                <Animated.View style={styles.layer3}>
                  <View style={styles.line} />
                  <View style={{ flex: 1 }}>
                    {/* <ScrollView
                                style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                                scrollEnabled={isScrollEnable}
                                scrollEventThrottle={16}
                                onScroll={event => {
                                    this.scrollOffset = event.nativeEvent.contentOffset.y
                                }}
                            > */}

                    <FlatList
                      data={assetList}
                      scrollEnabled={isScrollEnable}
                      scrollEventThrottle={16}
                      // onScroll={(event) => {
                      //   setScrollOffset(event.nativeEvent.contentOffset.y);
                      // }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => getTransactions(item)}
                          style={{
                            zIndex: 1000,
                          }}>
                          <Grid>
                            <Row style={{ padding: hp('2%'), paddingRight: 20 }}>
                              <Col size={2}>
                                <View>
                                  {/* <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.assetDetails[34].value }}></Image> */}
                                  <Image
                                    resizeMode={'contain'}
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={{
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.assetDetails[34].value,
                                    }}
                                  />
                                </View>
                              </Col>
                              <Col size={5} style={{ paddingTop: 5 }}>
                                <Text
                                  style={{
                                    color: '#454F63',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                  }}>
                                  {item.assetDetails[3].value.replace(
                                    /.(?=.{4})/g,
                                    '.',
                                  )}{' '}
                                </Text>
                                <Text style={{ color: '#888888', fontSize: 12 }}>
                                  {' '}
                                  {item.assetDetails[1].value}
                                </Text>
                              </Col>
                              <Col size={5} style={{ paddingTop: 5 }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#454F63',
                                      fontSize: 9,
                                      marginRight: 3,
                                      marginTop: 3,
                                    }}>
                                    {item.accountCurrency}
                                  </Text>
                                  <AmountDisplay
                                    style={{
                                      color: '#454F63',
                                      fontSize: 18,
                                    }}
                                    amount={Number(
                                      item.assetValueInAccountCurrency,
                                    )}
                                    currency={item.accountCurrency}
                                  />
                                  {/* <NumberFormat
                                value={Number(item.assetValueInAccountCurrency)}
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
                                      fontSize: 18,
                                    }}>
                                    {value}
                                  </Text>
                                )}
                              /> */}
                                </View>
                              </Col>
                            </Row>
                          </Grid>
                          {/* </TouchableOpacity> */}
                          {/* </CollapseHeader> */}
                          <View>
                            {/* <CollapseBody> */}
                            {item.transactionList != null ? (
                              <View>
                                {item.transactionList.length != 0 ? (
                                  <View
                                    style={{
                                      padding: hp('2.5%'),
                                      backgroundColor: '#DFE4FB',
                                    }}>
                                    <Grid>
                                      <FlatList
                                        data={item.transactionList}
                                        renderItem={({ item }) => (
                                          <Row style={{ paddingBottom: 5 }}>
                                            <Col
                                              size={2}
                                              style={{ width: 30, height: 30 }}>
                                              {/* <Image resizeMode='contain' style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.image }}></Image> */}
                                              <Image
                                                resizeMode="contain"
                                                style={{
                                                  maxWidth: '100%',
                                                  height: '100%',
                                                }}
                                                source={{
                                                  uri:
                                                    global.baseURL +
                                                    'customer/' +
                                                    item.image,
                                                }}
                                              />
                                            </Col>
                                            <Col size={5} style={{ paddingTop: 5 }}>
                                              <Text
                                                style={{
                                                  color: '#5E83F2',
                                                  fontSize: 12,
                                                }}>
                                                {item.mode}
                                              </Text>
                                            </Col>
                                            <Col
                                              size={5}
                                              style={{
                                                paddingTop: 5,
                                                paddingRight: 10,
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  flex: 1,
                                                  justifyContent: 'flex-end',
                                                }}>
                                                {/*  */}
                                                <Text
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 9,
                                                    marginRight: 3,
                                                  }}>
                                                  {item.accountCurrency}
                                                </Text>
                                                <AmountDisplay
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 14,
                                                  }}
                                                  amount={Number(
                                                    item.amountInAccountCurrency,
                                                  )}
                                                  currency={item.accountCurrency}
                                                />
                                                {/* <NumberFormat
                                              // value={Number(item.amount)}
                                              value={Number(
                                                item.amountInAccountCurrency,
                                              )}
                                              displayType={'text'}
                                              thousandsGroupStyle={
                                                global.thousandsGroupStyle
                                              }
                                              thousandSeparator={
                                                global.thousandSeparator
                                              }
                                              decimalScale={global.decimalScale}
                                              fixedDecimalScale={true}
                                              // prefix={'₹'}
                                              renderText={(value) => (
                                                <Text
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 14,
                                                  }}>
                                                  {value}
                                                </Text>
                                              )}
                                            /> */}
                                              </View>
                                            </Col>
                                          </Row>
                                        )}
                                      />
                                      <Row>
                                        <Col>
                                          <TouchableOpacity
                                            style={styles.viewBtn}
                                            onPress={() =>
                                              navigation.navigate(
                                                'accountStatementPage',
                                                dataTosend,
                                              )
                                            }>
                                            <Text style={styles.viewBtnText}>
                                              View Statement
                                        </Text>
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </View>
                                ) : (
                                    <View>
                                      {/* <ActivityIndicator size="small" color="#00ff00" /> */}
                                      <Text>No transactions available</Text>
                                    </View>
                                  )}
                              </View>
                            ) : null}
                          </View>
                          {/* </View> */}
                        </TouchableOpacity>
                      )}
                    />

                    {/* </ScrollView> */}
                  </View>
                </Animated.View>
              </View>

              :
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  animatedHeight,
                  {
                    position: 'absolute',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: _bgColorAnimation,
                    height: SCREEN_HEIGHT - 50,
                  },
                ]}>
                <Animated.View
                  style={{
                    height: hp('15%'),
                    // backgroundColor: asssetsList.bgColor,
                    backgroundColor: _bgColorAnimation,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    marginBottom: 30,
                  }}>
                  <Animated.View style={{ right: xValue }}>
                    <Grid>
                      <Row style={{ width: '100%' }}>
                        <Col>
                          <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View
                              style={{
                                padding: hp('2.5%'),
                                paddingTop: hp('1.5%'),
                                paddingLeft: wp('5%'),
                              }}>
                              <View
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 50,
                                  border: 10,
                                  backgroundColor: 'white',
                                }}>
                                <Image
                                  resizeMode={'contain'}
                                  style={{
                                    maxWidth: '100%',
                                    height: '100%',
                                    borderRadius: 40,
                                  }}
                                  source={{ uri: asssetsList.fiLogo }}
                                />
                              </View>
                            </View>
                            <View
                              style={{ paddingTop: hp('3.5%'), width: wp('62%') }}>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontSize: 16,
                                  marginLeft: -10,
                                  height: 100,
                                }}>
                                {asssetsList.fiName != null
                                  ? asssetsList.fiName
                                  : '               '}
                              </Text>
                            </View>
                            <View style={{ paddingTop: hp('3%') }}>
                              <View
                                style={{
                                  width: 30,
                                  height: 30,
                                  alignItems: 'flex-end',
                                }}>
                                <TouchableOpacity onPress={() => moveAnimation()}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/icon-settings_white.png')}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => { console.log('clicked') }} style={{ alignItems: 'center', zIndex: 10 }}>
                                                <View style={{ width: 60, height: 60 }}>
                                                    <Image style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/consent_icon.png")}></Image>
                                                </View>
                                                <Text style={{ fontSize: 10, color: "white" }}>Revoke Consent</Text>
                                            </TouchableOpacity> */}
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                paddingTop: hp('1.5%'),
                                marginLeft: wp('12%'),
                              }}>
                              {/* <Grid>
                                                    <Row>
                                                        <Col> */}
                              {
                                asset.length > 1
                                  ?
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      marginRight: hp('2.5%'),
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => revokeConsent()}
                                      style={{ zIndex: 10, width: 60, height: 60 }}>
                                      {/* <View style={{ width: 60, height: 60 }}> */}
                                      <Image
                                        style={{ maxWidth: '100%', height: '100%' }}
                                        source={require('./assets/consent_icon.png')}
                                      />
                                      {/* </View> */}
                                    </TouchableOpacity>
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        color: 'white',
                                        height: 100,
                                      }}>
                                      Revoke Consent
                                                          </Text>
                                  </View>
                                  :
                                  null
                              }

                              {/* </Col>
                                                        <Col> */}
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginRight: hp('3%'),
                                }}>
                                <View style={{ width: 60, height: 60 }}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/Send_fund_icon.png')}
                                  />
                                </View>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: 'white',
                                    height: 100,
                                  }}>
                                  Send Funds
                            </Text>
                              </View>
                              {/* </Col>
                                                        <Col> */}
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginRight: hp('3%'),
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate('requestFunds')
                                  }
                                  style={{ zIndex: 10, width: 60, height: 60 }}>
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/Request_fund_icon.png')}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 10,
                                    color: 'white',
                                    height: 100,
                                  }}>
                                  Request Funds
                            </Text>
                              </View>
                              {/* </Col>
                                                        <Col></Col>
                                                    </Row>
                                                </Grid> */}
                            </View>
                          </View>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: hp('8%'), height: 100 }}>
                        <Col>
                          <View style={{ paddingRight: wp('7%') }}>
                            <Text style={[styles.tAssetLabel]}>
                              Assets in the bank
                        </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                justifyContent: 'flex-end',
                              }}>
                              {/*  */}
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 13,
                                  textAlign: 'right',
                                  marginTop: 3,
                                  marginRight: 3,
                                  height: 150,
                                }}>
                                {customerPreferredCurrency}
                              </Text>
                              <AmountDisplay
                                style={{
                                  color: 'white',
                                  fontSize: 24,
                                  textAlign: 'right',
                                  height: 150,
                                }}
                                amount={
                                  asssetsList.totalAssetvalue != null
                                    ? Number(
                                      asssetsList.totalAssetValueInUserPreferredCurrency,
                                    )
                                    : Number(0)
                                }
                                currency={customerPreferredCurrency}
                              />
                              {/* <NumberFormat
                            value={
                              asssetsList.totalAssetvalue != null
                                ? Number(
                                    asssetsList.totalAssetValueInUserPreferredCurrency,
                                  )
                                : Number(0)
                            }
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 24,
                                  textAlign: 'right',
                                  height: 150,
                                }}>
                                {value}
                              </Text>
                            )}
                          /> */}
                            </View>
                          </View>
                        </Col>
                      </Row>
                    </Grid>
                    {/* </Animated.View></Animated.View> */}
                  </Animated.View>
                </Animated.View>
                <Animated.View style={styles.layer3}>
                  <View style={styles.line} />
                  <View style={{ flex: 1 }}>
                    {/* <ScrollView
                                style={{ backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
                                scrollEnabled={isScrollEnable}
                                scrollEventThrottle={16}
                                onScroll={event => {
                                    this.scrollOffset = event.nativeEvent.contentOffset.y
                                }}
                            > */}

                    <FlatList
                      data={assetList}
                      scrollEnabled={isScrollEnable}
                      scrollEventThrottle={16}
                      // onScroll={(event) => {
                      //   setScrollOffset(event.nativeEvent.contentOffset.y);
                      // }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => getTransactions(item)}
                          style={{
                            zIndex: 1000,
                          }}>
                          <Grid>
                            <Row style={{ padding: hp('2%'), paddingRight: 20 }}>
                              <Col size={2}>
                                <View>
                                  {/* <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.assetDetails[34].value }}></Image> */}
                                  <Image
                                    resizeMode={'contain'}
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={{
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.assetDetails[34].value,
                                    }}
                                  />
                                </View>
                              </Col>
                              <Col size={5} style={{ paddingTop: 5 }}>
                                <Text
                                  style={{
                                    color: '#454F63',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                  }}>
                                  {item.assetDetails[3].value.replace(
                                    /.(?=.{4})/g,
                                    '.',
                                  )}{' '}
                                </Text>
                                <Text style={{ color: '#888888', fontSize: 12 }}>
                                  {' '}
                                  {item.assetDetails[1].value}
                                </Text>
                              </Col>
                              <Col size={5} style={{ paddingTop: 5 }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#454F63',
                                      fontSize: 9,
                                      marginRight: 3,
                                      marginTop: 3,
                                    }}>
                                    {item.accountCurrency}
                                  </Text>
                                  <AmountDisplay
                                    style={{
                                      color: '#454F63',
                                      fontSize: 18,
                                    }}
                                    amount={Number(
                                      item.assetValueInAccountCurrency,
                                    )}
                                    currency={item.accountCurrency}
                                  />
                                  {/* <NumberFormat
                                value={Number(item.assetValueInAccountCurrency)}
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
                                      fontSize: 18,
                                    }}>
                                    {value}
                                  </Text>
                                )}
                              /> */}
                                </View>
                              </Col>
                            </Row>
                          </Grid>
                          {/* </TouchableOpacity> */}
                          {/* </CollapseHeader> */}
                          <View>
                            {/* <CollapseBody> */}
                            {item.transactionList != null ? (
                              <View>
                                {item.transactionList.length != 0 ? (
                                  <View
                                    style={{
                                      padding: hp('2.5%'),
                                      backgroundColor: '#DFE4FB',
                                    }}>
                                    <Grid>
                                      <FlatList
                                        data={item.transactionList}
                                        renderItem={({ item }) => (
                                          <Row style={{ paddingBottom: 5 }}>
                                            <Col
                                              size={2}
                                              style={{ width: 30, height: 30 }}>
                                              {/* <Image resizeMode='contain' style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.image }}></Image> */}
                                              <Image
                                                resizeMode="contain"
                                                style={{
                                                  maxWidth: '100%',
                                                  height: '100%',
                                                }}
                                                source={{
                                                  uri:
                                                    global.baseURL +
                                                    'customer/' +
                                                    item.image,
                                                }}
                                              />
                                            </Col>
                                            <Col size={5} style={{ paddingTop: 5 }}>
                                              <Text
                                                style={{
                                                  color: '#5E83F2',
                                                  fontSize: 12,
                                                }}>
                                                {item.mode}
                                              </Text>
                                            </Col>
                                            <Col
                                              size={5}
                                              style={{
                                                paddingTop: 5,
                                                paddingRight: 10,
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  flex: 1,
                                                  justifyContent: 'flex-end',
                                                }}>
                                                {/*  */}
                                                <Text
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 9,
                                                    marginRight: 3,
                                                  }}>
                                                  {item.accountCurrency}
                                                </Text>
                                                <AmountDisplay
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 14,
                                                  }}
                                                  amount={Number(
                                                    item.amountInAccountCurrency,
                                                  )}
                                                  currency={item.accountCurrency}
                                                />
                                                {/* <NumberFormat
                                              // value={Number(item.amount)}
                                              value={Number(
                                                item.amountInAccountCurrency,
                                              )}
                                              displayType={'text'}
                                              thousandsGroupStyle={
                                                global.thousandsGroupStyle
                                              }
                                              thousandSeparator={
                                                global.thousandSeparator
                                              }
                                              decimalScale={global.decimalScale}
                                              fixedDecimalScale={true}
                                              // prefix={'₹'}
                                              renderText={(value) => (
                                                <Text
                                                  style={{
                                                    textAlign: 'right',
                                                    color: '#5E83F2',
                                                    fontSize: 14,
                                                  }}>
                                                  {value}
                                                </Text>
                                              )}
                                            /> */}
                                              </View>
                                            </Col>
                                          </Row>
                                        )}
                                      />
                                      <Row>
                                        <Col>
                                          <TouchableOpacity
                                            style={styles.viewBtn}
                                            onPress={() =>
                                              navigation.navigate(
                                                'accountStatementPage',
                                                dataTosend,
                                              )
                                            }>
                                            <Text style={styles.viewBtnText}>
                                              View Statement
                                        </Text>
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </View>
                                ) : (
                                    <View>
                                      {/* <ActivityIndicator size="small" color="#00ff00" /> */}
                                      <Text>No transactions available</Text>
                                    </View>
                                  )}
                              </View>
                            ) : null}
                          </View>
                          {/* </View> */}
                        </TouchableOpacity>
                      )}
                    />

                    {/* </ScrollView> */}
                  </View>
                </Animated.View>
              </Animated.View>

          }
        </LinearGradient>
      </Animated.View>
    );
  }
}

export default AccountsPage;

const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
    flexDirection: 'row',
    zIndex: 1,
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
    // backgroundColor: '#5E83F2',
    opacity: 1,
  },
  layer2: {
    height: hp('30%'),

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  layer3: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    // position: 'absolute',
    zIndex: 1000,
    // top: spacerHeight,
    top: '32%',
    left: wp('-5%'),
    // left: wp('24.5%')
  },
  arrow: {
    // borderRightWidth: 15,
    borderBottomWidth: 10,
    borderRightWidth: 20,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightColor: '#FFFFFF2E',
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
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: hp('2%'),
  },
  inActiveBank: {
    opacity: 0.4,
  },
  activeBank: {
    opacity: 1,
    backgroundColor: '#0000001A',
  },
  activeBankText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    marginTop: hp('-0.4%'),
  },
  inActiveBankText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 12,
    opacity: 0.2,
    marginTop: hp('-0.9%'),
  },
  activeBankIcon: {
    width: 35,
    height: 35,
    marginTop: wp('-2.7%'),
    opacity: 1,
    borderRadius: 50,
    // border: 10,
    backgroundColor: 'white',
  },
  inActiveBankIcon: {
    width: 25,
    height: 25,
    marginTop: -10,
    opacity: 0.2,
    borderRadius: 50,
    // border: 10,
    backgroundColor: 'white',
  },
  viewBtn: {
    marginTop: hp('1%'),
    alignItems: 'center',
    padding: hp('2%'),
    backgroundColor: '#5E83F2',
    borderRadius: 12,
  },
  viewBtnText: {
    color: 'white',
    fontSize: 14,
  },
  indicatorWrapper: {
    backgroundColor: '#FFFFFF2E',
    width: '100%',
    position: 'absolute',
    zIndex: 20,
    height: itemHeight,
    top: '33%',
    // left: '20%'
  },
  bankList: {
    height: hp('50%'),
    // backgroundColor: '#cccc',
    //   height:itemHeight,
    alignItems: 'center',
    // width: '100%'
    // justifyContent: 'flex-start'
  },
  bank: {
    height: itemHeight,
    // width: '100%'
  },
  spacer: {
    height: spacerHeight,
  },
  piechartcss: {
    borderWidth: 3,
    borderColor: 'white',
  },
  linearGradient: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    // borderRadius: 5
  },
});
