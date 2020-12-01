import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import PieChart from 'react-native-pie-chart';
import { BarChart } from "react-native-charts-wrapper";
import NumberFormat from 'react-number-format';
import {
  View,
  Image,
  Platform,
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
  processColor
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from './redux/actions';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressBar from 'react-native-progress/Bar';
// import PureChart from 'react-native-pure-chart';
import FusionCharts from 'react-native-fusioncharts';
// import { MultiLineChart } from 'react-native-d3multiline-chart';
function BudgetPage({ route, navigation }) {
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [heading, setHeading] = useState('');
  const [loader, setLoader] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  let ls = require('react-native-local-storage');
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [dataTosend, setDataTosend] = useState('');
  const [wholeBudgetAmt, setWholeBudgetAmt] = useState();
  const [wholeExpenseAmt, setWholeExpenseAmt] = useState();
  const [budgetLegendColor, setBudgetLegendColor] = useState();
  const [expenseLegendColor, setExpenseLegendColor] = useState();
  const [incomeLegendColor, setIncomeLegendColor] = useState();
  const [baseCurrency, setBaseCurrency] = useState();
  const [bgColor, setBgColor] = useState('');
  const [budgetList, setBudgetList] = useState([]);
  const [chartData, setChartData] = useState();
  const [noChartData, setNoChartData] = useState(false);
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const pan = useState(new Animated.ValueXY({ x: 0, y: wp('103%') }))[0];
  const [scrollOffset, setScrollOffset] = useState();
  const currencyMaster = useSelector((state) => state.currencyMaster);
  // const [chartDataSource,set?]
  // const scrollOffset = 0
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log(gestureState);
        console.log('scrollOffset : ' + scrollOffset);
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          (isScrollEnable == false &&
            gestureState.moveY >= wp('103%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('103%') &&
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
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(gestureState.dy);
        pan.flattenOffset();
        console.log('moveY :' + gestureState.moveY + ' , hp :' + hp('50%'));
        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('16%'),
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('103%'),
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
    inputRange: [0, hp('10%'), hp('20%')],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const _opacityAnimation = pan.y.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
  });
  const displayViewOpacity = pan.y.interpolate({
    inputRange: [0, hp('10%'), hp('20%')],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const bgColorAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', '#F22973', '#F22973'],
  });
  const borderWidthAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', '#FFFFFF69', '#FFFFFF69'],
  });
  const { rightDrawerState } = useSelector((state) => state.appConfig);

  const isDrawerOpen = useIsDrawerOpen();
  useEffect(() => {
    console.log('Dashboard Page');

    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);

        setActiveTab('DB');
        getNoSpinnerBudgetData('DB');
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Animated.timing(pan.y, {
        toValue: wp('103%'),
        easing: Easing.linear,
      }).start();
      console.log('Budget Page');
      ls.save('selectedDrawerItem', 'budgetPage');
      setBgColor('#63CDD6');
      ls.get('budgetType').then((data) => {
        console.log('budgetType : ' + data);
        if (data == null) {
          setActiveTab('DB');
          getBudgetData('DB');
        } else {
          setActiveTab(data);
          getBudgetData(data);
        }
      });
      ls.remove('budgetType');
    });
    return unsubscribe;
  }, [navigation]);

  getNoSpinnerBudgetData = (tab) => {
    setNoChartData(false);
    let postData = {};
    setNotransaction(false);
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
      postData.type = tab;
      console.log(JSON.stringify(postData));
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
      fetch(global.baseURL + 'customer/budgets/' + global.loginID, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          let bg = '';

          if (responseJson.data != null) {
            if (responseJson.data.budgetList != null) {
              let d = [...responseJson.data.budgetList];
              setNotransaction(false);

              let wholeAmount = 0;
              let wholeExpenseAmount = 0;
              let list = [];
              for (let li of d) {
                let data = {};
                data.icon = li.icon;
                data.categoryId = li.category;
                data.categoryName = li.categoryName;
                data.baseCurrency = li.baseCurrency;
                setBaseCurrency(li.baseCurrency);
                // data.budgetAmount = li.budgetAmount
                // data.expenseAmount = li.expenseAmount
                let budgetAmountInBaseCurrency = 0;
                let expenseAmountInBaseCurrency = 0;
                if (li.budgetAmountInBaseCurrency != null) {
                  budgetAmountInBaseCurrency = li.budgetAmountInBaseCurrency;
                }
                if (li.expenseAmountInBaseCurrency != null) {
                  expenseAmountInBaseCurrency = li.expenseAmountInBaseCurrency;
                }
                data.budgetAmount = budgetAmountInBaseCurrency;
                data.expenseAmount = expenseAmountInBaseCurrency;
                // data.remainingAmount = li.budgetAmount - li.expenseAmount
                data.remainingAmount =
                  budgetAmountInBaseCurrency - expenseAmountInBaseCurrency;
                if (tab == 'DB') {
                  if (expenseAmountInBaseCurrency == 0) {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <
                    1 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0.5
                  ) {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <=
                    0.5
                  ) {
                    data.colorIndicator = '#F2A413';
                    data.unfilledColorIndicator = '#FDEDD4';
                  } else {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  }
                } else {
                  if (expenseAmountInBaseCurrency == 0) {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <
                    1 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0.5
                  ) {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >=
                    0 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <=
                    0.5
                  ) {
                    data.colorIndicator = '#F2A413';
                    data.unfilledColorIndicator = '#FDEDD4';
                  } else {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  }
                }
                wholeAmount = wholeAmount + budgetAmountInBaseCurrency;
                wholeExpenseAmount =
                  wholeExpenseAmount + expenseAmountInBaseCurrency;

                list.push(data);
              }
              console.log(list);

              setBudgetList(list);
              setWholeBudgetAmt(wholeAmount);
              setWholeExpenseAmt(wholeExpenseAmount);
              let wholeRemaining = wholeAmount - wholeExpenseAmount;
              if (tab == 'DB') {
                if (
                  Number(wholeRemaining).toFixed(2) /
                  Number(wholeAmount).toFixed(2) <
                  1 &&
                  Number(wholeRemaining).toFixed(2) /
                  Number(wholeAmount).toFixed(2) >
                  0.5
                ) {
                  setBgColor('#63CDD6');
                  bg = '#63CDD6';
                } else if (
                  Number(wholeRemaining).toFixed(2) /
                  Number(wholeAmount).toFixed(2) >=
                  0 &&
                  Number(wholeRemaining).toFixed(2) /
                  Number(wholeAmount).toFixed(2) <=
                  0.5
                ) {
                  setBgColor('#F2A413');
                  bg = '#F2A413';
                } else {
                  setBgColor('#F22973');
                  bg = '#F22973';
                }
              } else {
                if (wholeExpenseAmount == 0) {
                  setBgColor('#F22973');
                  bg = '#F22973';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) < 1 &&
                  Number(wholeRemaining) / Number(wholeAmount) > 0.5
                ) {
                  setBgColor('#F22973');
                  bg = '#F22973';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) > 0 &&
                  Number(wholeRemaining) / Number(wholeAmount) <= 0.5
                ) {
                  setBgColor('#F2A413');
                  bg = '#F2A413';
                } else {
                  setBgColor('#63CDD6');
                  bg = '#63CDD6';
                }
              }
              getChartData(responseJson.data.graph, bg);
              if (
                responseJson.data.graph != null &&
                responseJson.data.graph.length != 0
              ) {
                getChartData(responseJson.data.graph, bg);
              } else {
                setChartData();
                setNoChartData(true);
              }
              setLoader(false);
            } else {
              setBudgetList([]);
              setWholeBudgetAmt(0);
              setWholeExpenseAmt(0);
              setBaseCurrency('');
              setNotransaction(true);

              if (
                responseJson.data.graph != null &&
                responseJson.data.graph.length != 0
              ) {
                getChartData(responseJson.data.graph, bg);
              } else {
                setChartData();
                setNoChartData(true);
              }
            }
          } else {
            setBudgetList([]);
            setWholeBudgetAmt(0);
            setWholeExpenseAmt(0);
            setBaseCurrency('');
            setChartData();
            setNotransaction(true);
            setNoChartData(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    });
  };
  getBudgetData = (tab) => {
    setSpinner(true);
    setNoChartData(false);
    setNotransaction(false);
    console.log('budget Data');
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
      postData.type = tab;
      console.log(JSON.stringify(postData));
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
      fetch(global.baseURL + 'customer/budgets/' + global.loginID, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          let bg = '';

          if (responseJson.data != null) {
            if (responseJson.data.budgetList != null) {
              // if ( responseJson.data.budgetList == 0 || responseJson.data == null) {
              //     setNotransaction(true)
              //     setBudgetList([])
              // } else {
              setNotransaction(false);
              // }
              let d = [...responseJson.data.budgetList];

              let wholeAmount = 0;
              let wholeExpenseAmount = 0;
              let list = [];
              for (let li of d) {
                let data = {};
                data.icon = li.icon;
                data.categoryId = li.category;
                data.categoryName = li.categoryName;
                data.baseCurrency = li.baseCurrency;
                setBaseCurrency(li.baseCurrency);
                // data.budgetAmount = li.budgetAmount
                // data.expenseAmount = li.expenseAmount
                let budgetAmountInBaseCurrency = 0;
                let expenseAmountInBaseCurrency = 0;
                if (li.budgetAmountInBaseCurrency != null) {
                  budgetAmountInBaseCurrency = li.budgetAmountInBaseCurrency;
                }
                if (li.expenseAmountInBaseCurrency != null) {
                  expenseAmountInBaseCurrency = li.expenseAmountInBaseCurrency;
                }
                data.budgetAmount = budgetAmountInBaseCurrency;
                data.expenseAmount = expenseAmountInBaseCurrency;
                // data.remainingAmount = li.budgetAmount - li.expenseAmount
                data.remainingAmount =
                  budgetAmountInBaseCurrency - expenseAmountInBaseCurrency;
                // data.remainingAmount = li.budgetAmount - li.expenseAmount
                if (tab == 'DB') {
                  if (expenseAmountInBaseCurrency == 0) {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <
                    1 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0.5
                  ) {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <=
                    0.5
                  ) {
                    data.colorIndicator = '#F2A413';
                    data.unfilledColorIndicator = '#FDEDD4';
                  } else {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  }
                } else {
                  if (expenseAmountInBaseCurrency == 0) {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <
                    1 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >
                    0.5
                  ) {
                    data.colorIndicator = '#F22973';
                    data.unfilledColorIndicator = '#FCD6E2';
                  } else if (
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) >=
                    0 &&
                    Number(data.remainingAmount).toFixed(2) /
                    Number(budgetAmountInBaseCurrency).toFixed(2) <=
                    0.5
                  ) {
                    data.colorIndicator = '#F2A413';
                    data.unfilledColorIndicator = '#FDEDD4';
                  } else {
                    data.colorIndicator = '#63CDD6';
                    data.unfilledColorIndicator = '#DBF3F5';
                  }
                }
                wholeAmount = wholeAmount + budgetAmountInBaseCurrency;
                wholeExpenseAmount =
                  wholeExpenseAmount + expenseAmountInBaseCurrency;
                list.push(data);
              }
              console.log(list);
              setBudgetList(list);
              setWholeBudgetAmt(wholeAmount);
              setWholeExpenseAmt(wholeExpenseAmount);
              let wholeRemaining = wholeAmount - wholeExpenseAmount;
              if (tab == 'DB') {
                if (wholeExpenseAmount == 0) {
                  setBgColor('#63CDD6');
                  bg = '#63CDD6';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) < 1 &&
                  Number(wholeRemaining) / Number(wholeAmount) > 0.5
                ) {
                  setBgColor('#63CDD6');
                  bg = '#63CDD6';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) > 0 &&
                  Number(wholeRemaining) / Number(wholeAmount) <= 0.5
                ) {
                  setBgColor('#F2A413');
                  bg = '#F2A413';
                } else {
                  setBgColor('#F22973');
                  bg = '#F22973';
                }
              } else {
                if (wholeExpenseAmount == 0) {
                  setBgColor('#F22973');
                  bg = '#F22973';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) < 1 &&
                  Number(wholeRemaining) / Number(wholeAmount) > 0.5
                ) {
                  setBgColor('#F22973');
                  bg = '#F22973';
                } else if (
                  Number(wholeRemaining) / Number(wholeAmount) > 0 &&
                  Number(wholeRemaining) / Number(wholeAmount) <= 0.5
                ) {
                  setBgColor('#F2A413');
                  bg = '#F2A413';
                } else {
                  setBgColor('#63CDD6');
                  bg = '#63CDD6';
                }
              }
              console.log(
                'wholeExpenseAmount : ' +
                wholeExpenseAmount +
                ' wholeAmount : ' +
                wholeAmount +
                ' wholeRemaining : ' +
                wholeRemaining,
              );
              if (
                responseJson.data.graph != null &&
                responseJson.data.graph.length != 0
              ) {
                getChartData(responseJson.data.graph, bg);
              } else {
                setChartData();
                setNoChartData(true);
              }
              setFlag(true);
            } else {
              setBudgetList([]);
              setWholeBudgetAmt(0);
              setWholeExpenseAmt(0);
              setBaseCurrency('');
              setNotransaction(true);
              if (
                responseJson.data.graph != null &&
                responseJson.data.graph.length != 0
              ) {
                getChartData(responseJson.data.graph, bg);
              } else {
                setNoChartData(true);
                setChartData();
              }
            }
          } else {
            setBudgetList([]);
            setWholeBudgetAmt(0);
            setWholeExpenseAmt(0);
            setBaseCurrency('');
            setChartData();
            setNoChartData(true);
            setNotransaction(true);
          }

          setSpinner(false);
        })
        .catch((error) => {
          setSpinner(false);
          console.log(error);
        });
    });
  };

  getChartData = (list, bg) => {
    let d = [...list];
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log(list);
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    d.sort(function (a, b) {
      return a.month - b.month;
    });
    let categoryLabel = [];
    let barData = [];
    let line1 = [];
    let line2 = [];
    let label = [];
    for (let li of d) {
      // array1.x = li.monthAndYear
      label.push(li.monthAndYear);
      // array2.x = li.monthAndYear
      if (li.expense != null) {
        // b.value = li.expense.toString();
        // l1.value = li.expense.toString();
        barData.push(li.expense);
      } else {
        barData.push(0);
        // b.value = 0;
        // l1.value = 0;
      }
      if (li.budgetAmount != null) {
        line2.push(li.budgetAmount);
      } else {
        line2.push(0);
      }
      // line1.push(l1);
      // line2.push(l2);

      // console.log(barData)
    }
    console.log("budget data" + line2);
    console.log(label);

    console.log(barData);
    setBudgetLegendColor("#63CDD6");
    // setIncomeLegendColor(bg)
    setExpenseLegendColor("white");
    let title = "";
    if (activeTab == "DB") {
      title = "Expense";
    } else {
      title = "Income";
    }
    let dataSource = {

      legend: {
        enabled: true,
        textSize: 10,
        form: "SQUARE",
        formSize: 10,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true,
      },
      data: {
        dataSets: [
          {
            values: line2,
            label: "Budget",
            config: {
              drawValues: false,
              colors: [processColor("blue")],
            },
          },
          {
            values: barData,
            label: title,
            config: {
              drawValues: false,
              colors: [processColor("rgba(0,0,0,0.3)")],
            },
          },
        ],
        config: {
          barWidth: 0.2,
          group: {
            fromX: 0,
            groupSpace: 0.4,
            barSpace: 0.1,
          },
        },
      },
      xAxis: {
        valueFormatter: label,
        granularityEnabled: true,
        granularity: 1,
        // axisMaximum: 5,
        axisMinimum: 0,
        centerAxisLabels: true,
      },

      marker: {
        enabled: true,
        markerColor: processColor("#F0C0FF8C"),
        textColor: processColor("white"),
        markerFontSize: 14,
      },
    };
    console.log(dataSource);
    setChartData(dataSource);

    setFlag(true);
    // let d = [...list];
    // d.sort(function (a, b) {
    //   return a.month - b.month;
    // });
    // let categoryLabel = [];
    // let barData = [];
    // let line1 = [];
    // let line2 = [];
    // for (let li of d) {
    //   let l1 = {};
    //   let l2 = {};
    //   let b = {};
    //   let label = {};
    //   b.color = '#FFFFFF';
    //   b.alpha = '35';
    //   // array1.x = li.monthAndYear
    //   label.label = li.monthAndYear;
    //   // array2.x = li.monthAndYear
    //   if (li.expenseInBaseCurrency != null) {
    //     // b.value = (li.expense).toString()
    //     // l1.value = (li.expense).toString()
    //     b.value = li.expenseInBaseCurrency.toString();
    //     l1.value = li.expenseInBaseCurrency.toString();
    //   } else {
    //     b.value = 0;
    //     l1.value = 0;
    //   }
    //   if (li.budgetAmountInBaseCurrency != null) {
    //     // l2.value = (li.budgetAmount).toString()
    //     l2.value = li.budgetAmountInBaseCurrency.toString();
    //   } else {
    //     l2.value = 0;
    //   }
    //   line1.push(l1);
    //   line2.push(l2);
    //   barData.push(b);
    //   categoryLabel.push(label);
    //   // console.log(l1)
    //   console.log(l2);
    //   // console.log(barData)
    // }
    // setBudgetLegendColor('#5E83F2');
    // setIncomeLegendColor(bg);
    // setExpenseLegendColor(bg);
    // let dataSource = {
    //   chart: {
    //     baseFontColor: '#ffffff',
    //     plotSpacePercent: '76',
    //     baseFontSize: '8',
    //     // numberprefix: "₹",
    //     toolTipBgColor: '#000000',
    //     bgColor: bg,
    //     theme: 'fusion',
    //     scrollheight: '4',
    //     flatScrollBars: '1',
    //     scrollShowButtons: '0',
    //     scrollColor: '#cccccc',
    //     showHoverEffect: '1',
    //   },
    //   categories: [
    //     {
    //       category: categoryLabel,
    //     },
    //   ],
    //   dataset: [
    //     {
    //       color: '#FFFFFF',
    //       alpha: '35',
    //       data: barData,
    //     },
    //     {
    //       renderas: 'line',
    //       color: '#FFFFFF',
    //       alpha: '35',
    //       anchorBgColor: bg,
    //       dashed: '1',
    //       data: line1,
    //     },
    //     {
    //       renderas: 'line',
    //       color: '#5E83F2',
    //       anchorBgColor: '#5E83F2',
    //       anchorBorderColor: '#cccccc',
    //       data: line2,
    //     },
    //   ],
    // };
    // console.log(dataSource);
    // setChartData(dataSource);
    // setFlag(true);
  };

  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    setFlag(true);
    getBudgetData(tab);
    // getBudgetData(tab)
  };

  const libraryPath = Platform.select({
    android: { uri: 'file:///android_asset/fusioncharts.html' },
    ios: require('./assets/fusioncharts.html'),
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: bgColor }}>
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
        onPress={() =>
          navigation.navigate('budgetCreatePage', {
            type: activeTab,
            currency: baseCurrency,
          })
        }>
        <Image
          style={{ maxWidth: '100%', height: '100%' }}
          source={require('./assets/Addbutton.png')}></Image>
      </TouchableOpacity>
      <Animated.View style={([styles.layer1], { backgroundColor: bgColor })}>
        <View style={{ height: hp('23%') }}>
          <View>
            <Image
              style={{ maxWidth: '100%' }}
              source={require('./assets/graph_bg.png')}></Image>
          </View>

          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={navigation.openDrawer}
                style={{ marginRight: 'auto' }}>
                <Image
                  source={require('./assets/icons-menu(white)(2).png')}></Image>
              </TouchableOpacity>
              {/* <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={{ textAlign: 'center', color: 'white' }}>{heading}</Text>
                            </View> */}
              <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                {viewOpacity !== undefined ? (
                  <Animated.View style={{ opacity: viewOpacity }}>
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                      {heading}
                    </Text>
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
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      Budgets
                    </Text>
                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                      {heading}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => dispatch(AppConfigActions.toggleRightDrawer())}
                style={{ marginLeft: 'auto' }}>
                <Image
                  style={{ marginLeft: 'auto' }}
                  source={require('./assets/icons-filter-dark(white)(1).png')}></Image>
              </TouchableOpacity>
            </View>
            <Animated.View style={{ opacity: viewOpacity }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.pageHeading}>Budgets</Text>
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
            </Animated.View>
            <Animated.View
              style={{
                opacity: viewOpacity,
                zIndex: 100,
                marginLeft: hp('1%'),
              }}>
              <Row
                style={{
                  marginLeft: hp('1%'),
                  marginRight: hp('2%'),
                  marginTop: hp('1%'),
                }}>
                <Col
                  size={4}
                  style={activeTab == 'DB' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('DB');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      Expense
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={activeTab == 'CR' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('CR');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      Income
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col size={4}></Col>
                <Col size={4}></Col>
              </Row>
            </Animated.View>
          </View>
        </View>
        <View>
          <Animated.View style={{ opacity: viewOpacity, zIndex: 30 }}>
            {/* <PureChart
                            data={chartData}
                            backgroundColor={bgColor}
                            // xAxisColor={'transparent'}
                            labelColor={'white'}
                            yAxisGridLineColor={'white'}
                            xAxisGridLineColor={'transparent'}
                            onPress={(event) => { console.log(event) }}
                            type='line'
                        /> */}
            <View style={styles.chartContainer}>
              {chartData != undefined ? (
                <BarChart
                  style={styles.bar}
                  xAxis={chartData.xAxis}
                  data={chartData.data}
                  legend={chartData.legend}
                  drawValueAboveBar={false}
                  onChange={(event) => console.log(event.nativeEvent)}
                  marker={chartData.marker}
                  visibleRange={{ x: { min: 3, max: 5 } }}
                />
              ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      height: '100%',
                    }}>
                    {spinner == false && noChartData == true ? (
                      <Text style={{ color: 'white' }}>No data to display</Text>
                    ) : null}
                  </View>
                )}
            </View>
            {/* <Grid style={{ marginTop: hp('2%') }}>
              <Row>
                <Col size={2}></Col>
                <Col size={4}>
                  <Row>
                    <Col size={3}></Col>
                    <Col size={1.5} style={{ marginTop: 3 }}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'white',
                          width: 12,
                          height: 12,
                          backgroundColor: budgetLegendColor,
                          borderRadius: 25,
                        }}></View>
                    </Col>

                    <Col size={6.5}>
                      <Text
                        style={{ color: 'white', fontSize: 10, marginTop: 2 }}>
                        BUDGET
                      </Text>
                    </Col>
                    <Col size={1}></Col>
                  </Row>
                </Col>
                <Col size={4}>
                  <Row>
                    <Col size={3}></Col>
                    <Col size={1.5} style={{ marginTop: 3 }}>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'white',
                          width: 12,
                          height: 12,
                          backgroundColor:
                            activeTab == 'DB'
                              ? expenseLegendColor
                              : incomeLegendColor,
                          borderRadius: 25,
                        }}></View>
                    </Col>

                    <Col size={6.5}>
                      {activeTab == 'DB' ? (
                        <Text
                          style={{ color: 'white', fontSize: 10, marginTop: 2 }}>
                          EXPENSES
                        </Text>
                      ) : (
                          <Text
                            style={{ color: 'white', fontSize: 10, marginTop: 2 }}>
                            INCOME
                          </Text>
                        )}
                    </Col>
                    <Col size={1}></Col>
                  </Row>
                </Col>
                <Col size={2}></Col>
              </Row>
            </Grid>
            */}
            {/* <FlatList
                            horizontal
                            style={{
                                marginLeft: hp("1.5%"),
                                marginRight: hp('1.5%'),
                                paddingLeft: hp('1.2%'),
                                height: SCREEN_HEIGHT - hp('62%')

                            }}
                            showsHorizontalScrollIndicator={false}
                            data={chartData}
                            renderItem={({ item }) =>
                                <TouchableOpacity style={{ paddingRight: hp('2%'), width: wp('10%') }}>

                                    <View style={{ bottom: 0, position: 'absolute', flex: 1 }}>
                                        <Text style={{
                                            // marginLeft: 'auto', marginRight: 'auto',
                                            textAlign: 'center',
                                            fontSize: hp('0.9%'),
                                            fontWeight: 'bold',
                                            marginBottom: 5,
                                            color: 'white',
                                            // width: hp('5%')
                                            // marginTop: hp(item.height)
                                            // height: item.height
                                        }}>{item.percentage}</Text>

                                        <View style={{ padding: hp('1%'), height: hp(item.height), backgroundColor: 'white', opacity: 0.4 }}>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        >
                        </FlatList> */}
          </Animated.View>
        </View>
      </Animated.View>
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
            height: '110%',
          },
        ]}>
        <Animated.View
          style={{
            height: hp('15%'),
            marginBottom: 30,
            borderTopWidth: 1,
            borderColor: borderWidthAnimation,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                padding: hp('1.5%'),
                zIndex: 5,
                margin: hp('2%'),
                paddingTop: hp('-0.2%'),
                paddingBottom: hp('-0.2%'),
                borderRadius: hp('50%'),
              }}>
              <View
                style={{
                  width: hp('5%'),
                  height: hp('5%'),
                  borderRadius: 50,
                  border: 10,
                  backgroundColor: 'white',
                  opacity: 1,
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{ maxWidth: '100%', height: '100%' }}
                  source={require('./assets/wallet.png')}></Image>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginLeft: hp('0.4%'),
                  opacity: 1,
                }}>
                {wholeBudgetAmt - wholeExpenseAmt < 0 ? (
                  <View>
                    {activeTab == 'DB' ? (
                      <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                        Over Spent
                      </Text>
                    ) : (
                        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                          Exceeded
                        </Text>
                      )}
                  </View>
                ) : (
                    <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                      Remaining
                    </Text>
                  )}
              </View>
              <View
                style={{
                  opacity: 1,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'flex-end',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 10,
                    marginRight: 3,
                    marginTop: 3,
                  }}>
                  {baseCurrency}
                </Text>
                <NumberFormat
                  value={
                    activeTab == 'CR'
                      ? Math.abs(wholeBudgetAmt - wholeExpenseAmt)
                      : Number(wholeBudgetAmt - wholeExpenseAmt)
                  }
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  // decimalScale={global.decimalScale}
                  decimalScale={
                    currencyMaster.currency[baseCurrency] != undefined
                      ? currencyMaster.currency[baseCurrency].decimalFormat
                      : 0
                  }
                  fixedDecimalScale={true}
                  // prefix={'₹'}
                  renderText={(value) => (
                    <View>
                      {wholeBudgetAmt - wholeExpenseAmt < 0 ? (
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 20,
                            textAlign: 'right',
                          }}>
                          {' '}
                          {value}
                        </Text>
                      ) : (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 20,
                              textAlign: 'right',
                            }}>
                            + {value}
                          </Text>
                        )}
                    </View>
                  )}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#000000',
                opacity: 0.15,
                padding: hp('3%'),
                borderRadius: hp('50%'),
                position: 'absolute',
                width: '95%',
                zIndex: 1,
                top: hp('1.6%'),
                alignSelf: 'center',
              }}></View>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: hp('4%'),
                paddingRight: hp('4%'),
              }}>
              <View>
                {activeTab == 'DB' ? (
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      textAlign: 'left',
                    }}>
                    Expense
                  </Text>
                ) : (
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 14,
                        textAlign: 'left',
                      }}>
                      Income
                    </Text>
                  )}
                <View style={{ opacity: 1, flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      marginRight: 3,
                      marginTop: 3,
                    }}>
                    {baseCurrency}
                  </Text>
                  <NumberFormat
                    value={Number(wholeExpenseAmt)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={
                      currencyMaster.currency[baseCurrency] != undefined
                        ? currencyMaster.currency[baseCurrency].decimalFormat
                        : 0
                    }
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 24,
                          textAlign: 'left',
                        }}>
                        {value}
                      </Text>
                    )}
                  />
                </View>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                <Text
                  style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'right' }}>
                  Total Budget
                </Text>
                <View
                  style={{
                    opacity: 1,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    alignSelf: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      marginRight: 3,
                      marginTop: 3,
                      textAlign: 'right',
                    }}>
                    {baseCurrency}
                  </Text>
                  <NumberFormat
                    value={Number(wholeBudgetAmt)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    // decimalScale={global.decimalScale}
                    decimalScale={
                      currencyMaster.currency[baseCurrency] != undefined
                        ? currencyMaster.currency[baseCurrency].decimalFormat
                        : 0
                    }
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <Text style={{ color: 'white', fontSize: 24 }}>
                        {value}
                      </Text>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={styles.layer3}>
          <View style={styles.line}></View>
          <View style={{ flex: 1 }}>
            {notransaction == false ? (
              // {/* {budgetList != null && budgetList.length != 0 ? */}
              <FlatList
                data={budgetList}
                scrollEnabled={isScrollEnable}
                style={{ paddingTop: hp('3%'), marginBottom: hp('15%') }}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('subBudgetPage', {
                        selectedItem: item,
                        type: activeTab,
                      });
                    }}
                    style={{
                      paddingLeft: hp('5%'),
                      paddingRight: hp('5%'),
                      paddingBottom: hp('3%'),
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 50,
                          border: 10,
                          backgroundColor: 'white',
                        }}>
                        <Image
                          style={{ maxWidth: '100%', height: '100%' }}
                          source={{
                            uri: global.baseURL + 'customer/' + item.icon,
                          }}></Image>
                      </View>
                      <View
                        style={{
                          marginTop: hp('1.6%'),
                          marginLeft: hp('0.4%'),
                        }}>
                        <Text style={{ color: '#454F63', fontSize: 14 }}>
                          {item.categoryName}{' '}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: 'auto',
                          marginTop: hp('1.2%'),
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            color: '#454F63',
                            fontSize: 10,
                            marginRight: 3,
                            marginTop: 3,
                          }}>
                          {item.baseCurrency}
                        </Text>
                        <NumberFormat
                          value={Number(item.budgetAmount)}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          // decimalScale={global.decimalScale}
                          decimalScale={
                            currencyMaster.currency[item.baseCurrency] !=
                              undefined
                              ? currencyMaster.currency[item.baseCurrency]
                                .decimalFormat
                              : 0
                          }
                          fixedDecimalScale={true}
                          // prefix={'₹'}
                          renderText={(value) => (
                            <Text
                              style={{
                                textAlign: 'right',
                                color: '#454F63',
                                fontSize: 18,
                              }}>
                              {value}
                            </Text>
                          )}
                        />
                      </View>
                    </View>
                    <View>
                      <ProgressBar
                        progress={
                          Number(item.expenseAmount).toFixed(2) /
                          Number(item.budgetAmount).toFixed(2)
                        }
                        width={null}
                        height={10}
                        borderRadius={35}
                        color={item.colorIndicator}
                        borderColor={'transparent'}
                        unfilledColor={item.unfilledColorIndicator}
                      />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        {activeTab == 'DB' ? (
                          <Text style={{ color: '#888888', fontSize: 14 }}>
                            Expense
                          </Text>
                        ) : (
                            <Text style={{ color: '#888888', fontSize: 14 }}>
                              Income
                            </Text>
                          )}
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              color: '#888888',
                              fontSize: 10,
                              marginRight: 3,
                              marginTop: 3,
                            }}>
                            {item.baseCurrency}
                          </Text>
                          <NumberFormat
                            value={Number(item.expenseAmount)}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            decimalScale={
                              currencyMaster.currency[item.baseCurrency] !=
                                undefined
                                ? currencyMaster.currency[item.baseCurrency]
                                  .decimalFormat
                                : 0
                            }
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{ color: '#888888', fontSize: 18 }}>
                                {value}
                              </Text>
                            )}
                          />
                        </View>
                      </View>
                      <View style={{ marginLeft: 'auto' }}>
                        {item.remainingAmount < 0 ? (
                          <View>
                            {activeTab == 'DB' ? (
                              <Text
                                style={{
                                  color: '#888888',
                                  fontSize: 14,
                                  textAlign: 'right',
                                }}>
                                Over Spent
                              </Text>
                            ) : (
                                <Text
                                  style={{
                                    color: '#888888',
                                    fontSize: 14,
                                    textAlign: 'right',
                                  }}>
                                  Exceeded
                                </Text>
                              )}
                          </View>
                        ) : (
                            <Text
                              style={{
                                color: '#888888',
                                fontSize: 14,
                                textAlign: 'right',
                              }}>
                              Remaining
                            </Text>
                          )}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                          }}>
                          {activeTab == 'DB' ? (
                            <Text
                              style={{
                                // color: '#454F63',
                                color:
                                  Number(item.budgetAmount).toFixed(2) -
                                    Number(item.expenseAmount).toFixed(2) <
                                    0
                                    ? '#F22973'
                                    : '#888888',
                                fontSize: 10,
                                marginRight: 3,
                                marginTop: 3,
                              }}>
                              {item.baseCurrency}
                            </Text>
                          ) : (
                              <Text
                                style={{
                                  // color: '#454F63',
                                  color:
                                    Number(item.budgetAmount).toFixed(2) -
                                      Number(item.expenseAmount).toFixed(2) <
                                      0
                                      ? '#63CDD6'
                                      : '#888888',
                                  fontSize: 10,
                                  marginRight: 3,
                                  marginTop: 3,
                                }}>
                                {item.baseCurrency}
                              </Text>
                            )}

                          <NumberFormat
                            value={
                              activeTab == 'DB'
                                ? Number(item.remainingAmount)
                                : Math.abs(Number(item.remainingAmount))
                            }
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            // decimalScale={global.decimalScale}
                            decimalScale={
                              currencyMaster.currency[item.baseCurrency] !=
                                undefined
                                ? currencyMaster.currency[item.baseCurrency]
                                  .decimalFormat
                                : 0
                            }
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <View>
                                {activeTab == 'DB' ? (
                                  <Text
                                    style={{
                                      color:
                                        Number(item.budgetAmount).toFixed(2) -
                                          Number(item.expenseAmount).toFixed(
                                            2,
                                          ) <
                                          0
                                          ? '#F22973'
                                          : '#888888',
                                      fontSize: 18,
                                      textAlign: 'right',
                                    }}>
                                    {value}
                                  </Text>
                                ) : (
                                    <Text
                                      style={{
                                        color:
                                          Number(item.budgetAmount).toFixed(2) -
                                            Number(item.expenseAmount).toFixed(
                                              2,
                                            ) <
                                            0
                                            ? '#63CDD6'
                                            : '#888888',
                                        fontSize: 18,
                                        textAlign: 'right',
                                      }}>
                                      {value}
                                    </Text>
                                  )}
                              </View>
                            )}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}></FlatList>
            ) : (
                <View style={{ width: '100%', paddingTop: hp('15%') }}>
                  <Text
                    style={{
                      color: '#888888',
                      fontWeight: 'bold',
                      fontSize: 15,
                      textAlign: 'center',
                      paddingBottom: hp('0.5%'),
                    }}>
                    You have not setup any budget yet.{' '}
                  </Text>
                  <Text
                    style={{
                      color: '#888888',
                      fontWeight: 'bold',
                      fontSize: 15,
                      textAlign: 'center',
                    }}>
                    Would you like to setup one?
                </Text>
                </View>
              )}

            {/* </ScrollView> */}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export default BudgetPage;
const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2%'),
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
    paddingBottom: hp('2.5%'),
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
    backgroundColor: 'white',
  },
  inActiveBankIcon: {
    width: 25,
    height: 25,
    marginTop: -10,
    opacity: 0.2,
    borderRadius: 50,
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
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    paddingBottom: 12,
    zIndex: 60,
  },
  tab: {
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    paddingBottom: 12,
    zIndex: 60,
  },
  chartContainer: {
    height: wp('45%'),
  },
  bar: {
    marginTop: 10,
    // height: Dimensions.get("window").height / 2.5,
    // width: wp("80%"),
    maxWidth: '100%',
    height: '100%'
  },
});
