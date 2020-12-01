import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import { BarChart } from "react-native-charts-wrapper";
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
  Platform,
  processColor
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Moment from 'moment';
import FusionCharts from 'react-native-fusioncharts';
import PureChart from 'react-native-pure-chart';
import AmountDisplay from './AmountDisplay';

function SubBudgetPage({ route, navigation }) {
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [noChartData, setNoChartData] = useState(false);
  const [heading, setHeading] = useState('');
  const [loader, setLoader] = useState(false);
  const [bgColor, setBgColor] = useState('');
  let ls = require('react-native-local-storage');
  const [notransaction, setNotransaction] = useState(false);
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const [wholeBudgetAmt, setWholeBudgetAmt] = useState();
  const [wholeExpenseAmt, setWholeExpenseAmt] = useState();
  const [baseCurrency, setBaseCurrency] = useState();
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const [dataTosend, setDataTosend] = useState('');
  const [budgetList, setBudgetList] = useState([]);
  const [chartData, setChartData] = useState();
  const [budgetLegendColor, setBudgetLegendColor] = useState();
  const [expenseLegendColor, setExpenseLegendColor] = useState();
  const [incomeLegendColor, setIncomeLegendColor] = useState();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const pan = useState(new Animated.ValueXY({ x: 0, y: wp('100%') }))[0];
  // const scrollOffset = 0
  const [scrollOffset, setScrollOffset] = useState();
  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log(gestureState);
        console.log('scrollOffset : ' + scrollOffset);
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          (isScrollEnable == false &&
            gestureState.moveY >= wp('100%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('100%') &&
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
        console.log(
          'moveY :' + gestureState.moveY + ' , hp :' + SCREEN_HEIGHT - 200,
        );

        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('15%'),
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('100%'),
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
  const currencyMaster = useSelector((state) => state.currencyMaster);

  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScrollOffset(0);
      console.log('ScrollOffset : ' + scrollOffset);
      ls.save('selectedDrawerItem', '');
      setActiveTab('monthly');
      setBgColor('#63CDD6');
      console.log(activeTab);
      ls.save('budgetType', route.params.type);
      getBudgetCategoryLt('monthly');
    });
    return unsubscribe;
  }, [navigation]);

  getBudgetCategoryLt = (tab) => {
    setSpinner(true);
    setNotransaction(false);
    setNoChartData(false);
    let postData = {};
    console.log(route.params.type);
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
      let type = '';
      if (tab == 'weekly') {
        type = 'W';
      } else if (tab == 'monthly') {
        type = 'M';
      } else if (tab == 'quarterly') {
        type = 'Q';
      } else if (tab == 'yearly') {
        type = 'Y';
      }
      postData.getDataType = type;
      postData.type = route.params.type;
      console.log(JSON.stringify(postData));
      console.log(
        global.baseURL +
        'customer/budgets/details/categoryWise/' +
        global.loginID +
        '/' +
        route.params.selectedItem.categoryId,
      );
      fetch(
        global.baseURL +
        'customer/budgets/details/categoryWise/' +
        global.loginID +
        '/' +
        route.params.selectedItem.categoryId,
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
            if (
              responseJson.data.expenseList == null ||
              responseJson.data.expenseList.length == 0
            ) {
              setNotransaction(true);
            } else {
              setNotransaction(false);
            }
            setBudgetList(responseJson.data.expenseList);
            let wholeExpenseAmount = 0;
            let wholeAmount = 0;
            let wholeRemaining = 0;
            // let line1 = []
            // let line2 = []
            // let graph = []
            // let g1 = {}
            // let g2 = {}
            let categoryLabel = [];
            let barData = [];
            let line1 = [];
            let line2 = [];
            let label = [];
            let bg = '';
            setChartData();
            setWholeBudgetAmt(0);
            setWholeExpenseAmt(0);
            setBaseCurrency('');
            if (tab == 'weekly') {
              if (responseJson.data.totalBudgetInBaseCurrency != null) {
                wholeAmount = responseJson.data.totalBudgetInBaseCurrency;
              }
              for (let w of responseJson.data.graph) {
                setBaseCurrency(w.baseCurrency);
                // let l1 = {};
                // let l2 = {};
                // let b = {};
                // let label = {};
                if (w.monthAndYear != null) {
                  label.push(w.monthAndYear);
                }

                if (w.expenseInBaseCurrency != null) {
                  // b.value = (w.expense).toString()
                  // l1.value = (w.expense).toString()
                  barData.push(w.expenseInBaseCurrency);
                  // l1.value = w.expenseInBaseCurrency.toString();
                } else {
                  // b.value = 0;
                  // l1.value = 0;
                  barData.push(0)
                }
                if (w.budgetAmountInBaseCurrency != null) {
                  // l2.value = (w.budgetAmount).toString()
                  line2.push(w.budgetAmountInBaseCurrency);
                } else {
                  line2.push(0);
                }
                // line1.push(l1);
                // line2.push(l2);
                // barData.push(b);
                // categoryLabel.push(label);
              }
            } else if (tab == 'monthly') {
              let mD = responseJson.data.graph.sort(function (a, b) {
                return a.month - b.month;
              });
              for (let m of mD) {
                setBaseCurrency(m.baseCurrency);
                // let l1 = {};
                // let l2 = {};
                // let b = {};
                // let label = {};
                if (m.monthAndYear != null) {
                  label.push(m.monthAndYear);
                }
                if (m.budgetAmountInBaseCurrency != null) {
                  // l2.value = (m.budgetAmount).toString()
                  line2.push(m.budgetAmountInBaseCurrency);
                } else {
                  line2.push(0)
                }

                if (m.expenseInBaseCurrency != null) {
                  // b.value = (m.expense).toString()
                  // l1.value = (m.expense).toString()
                  barData.push(m.expenseInBaseCurrency);
                  // l1.value = m.expenseInBaseCurrency.toString();
                } else {
                  // b.value = 0;
                  // l1.value = 0;
                  barData.push(0);
                }

                // line1.push(l1);
                // line2.push(l2);
                // barData.push(b);
                // categoryLabel.push(label);
              }
            } else if (tab == 'yearly') {
              let yD = responseJson.data.graph.sort(function (a, b) {
                return a.year - b.year;
              });
              for (let y of yD) {
                setBaseCurrency(y.baseCurrency);
                // let l1 = {};
                // let l2 = {};
                // let b = {};
                // let label = {};
                if (y.year.toString() != null) {
                  label.push(y.year.toString());
                }
                if (y.budgetAmountInBaseCurrency != null) {
                  // l2.value = (y.budgetAmount).toString()
                  line2.push(y.budgetAmountInBaseCurrency);
                } else {
                  line2.push(0)
                }

                if (y.expenseInBaseCurrency != null) {
                  barData.push(y.expenseInBaseCurrency);
                  // l1.value = y.expenseInBaseCurrency.toString();
                } else {
                  barData.push(0)
                  // l1.value = 0;
                }

                // line1.push(l1);
                // line2.push(l2);
                // barData.push(b);
                // categoryLabel.push(label);
              }
            }
            for (let g of responseJson.data.graph) {
              setBaseCurrency(g.baseCurrency);
              // let l1 = {};
              // let l2 = {};
              // let b = {};
              // let label = {};
              if (g.quaterly != null) {
                label.push(g.quaterly);
              }

              if (tab == 'monthly') {
                if (g.month == data.month.id && g.month != null) {
                  // wholeExpenseAmount = g.expense
                  // wholeAmount = g.budgetAmount
                  wholeExpenseAmount = g.expenseInBaseCurrency;
                  wholeAmount = g.budgetAmountInBaseCurrency;
                }
                // getMonthChartData(responseJson.data.graph)
              } else if (tab == 'quarterly') {
                if (data.month.id >= 1 && data.month.id < 4) {
                  if (g.quaterly == 'Q1' && g.quaterly != null) {
                    // wholeExpenseAmount = g.expense
                    // wholeAmount = g.budgetAmount
                    wholeExpenseAmount = g.expenseInBaseCurrency;
                    wholeAmount = g.budgetAmountInBaseCurrency;
                  }
                } else if (data.month.id >= 4 && data.month.id < 7) {
                  if (g.quaterly == 'Q2' && g.quaterly != null) {
                    // wholeExpenseAmount = g.expense
                    // wholeAmount = g.budgetAmount
                    wholeExpenseAmount = g.expenseInBaseCurrency;
                    wholeAmount = g.budgetAmountInBaseCurrency;
                  }
                } else if (data.month.id >= 7 && data.month.id < 10) {
                  if (g.quaterly == 'Q3' && g.quaterly != null) {
                    // wholeExpenseAmount = g.expense
                    // wholeAmount = g.budgetAmount
                    wholeExpenseAmount = g.expenseInBaseCurrency;
                    wholeAmount = g.budgetAmountInBaseCurrency;
                  }
                } else if (data.month.id >= 10 && data.month.id < 13) {
                  if (g.quaterly == 'Q4' && g.quaterly != null) {
                    // wholeExpenseAmount = g.expense
                    // wholeAmount = g.budgetAmount
                    wholeExpenseAmount = g.expenseInBaseCurrency;
                    wholeAmount = g.budgetAmountInBaseCurrency;
                  }
                }

                // label.label = g.
                if (g.budgetAmountInBaseCurrency != null) {
                  line2.push(g.budgetAmountInBaseCurrency);
                } else {
                  // array1.y = 0
                  line2.push(0)
                }

                // array2.x = g.quaterly
                if (g.expenseInBaseCurrency != null) {
                  // array2.y = g.expense
                  barData.push(g.expenseInBaseCurrency);
                  // l1.value = g.expenseInBaseCurrency.toString();
                } else {
                  // array2.y = 0
                  barData.push(0);
                  // l1.value = 0;
                }

                // line1.push(l1);
                // line2.push(l2);
                // barData.push(b);
                // categoryLabel.push(label);
              } else if (tab == 'yearly') {
                if (g.year == data.year.year) {
                  // wholeExpenseAmount = g.expense
                  // wholeAmount = g.budgetAmount
                  wholeExpenseAmount = g.expenseInBaseCurrency;
                  wholeAmount = g.budgetAmountInBaseCurrency;
                }
              } else if (tab == 'weekly') {
                if (g.month == data.month.id && g.year == data.year.year) {
                  // wholeExpenseAmount = wholeExpenseAmount + g.expense
                  wholeExpenseAmount =
                    wholeExpenseAmount + g.expenseInBaseCurrency;
                }
              }
            }

            wholeRemaining = wholeAmount - wholeExpenseAmount;
            console.log(
              'wholeExpenseAmount : ' +
              wholeExpenseAmount +
              ' wholeAmount : ' +
              wholeAmount +
              ' wholeRemaining : ' +
              wholeRemaining,
            );
            setWholeBudgetAmt(wholeAmount);
            setWholeExpenseAmt(wholeExpenseAmount);
            if (route.params.type == 'DB') {
              if (wholeExpenseAmount == 0) {
                setBgColor('#63CDD6');
                bg = '#63CDD6';
                // setIncomeLegendColor('#F22973')
                // setExpenseLegendColor('#F22973')
              } else if (
                Number(wholeRemaining) / Number(wholeAmount) < 1 &&
                Number(wholeRemaining) / Number(wholeAmount) > 0.5
              ) {
                setBgColor('#63CDD6');
                bg = '#63CDD6';
                // setIncomeLegendColor('#F22973')
                // setExpenseLegendColor('#F22973')
              } else if (
                Number(wholeRemaining) / Number(wholeAmount) > 0 &&
                Number(wholeRemaining) / Number(wholeAmount) <= 0.5
              ) {
                setBgColor('#F2A413');
                bg = '#F2A413';
                // setIncomeLegendColor('#63CDD6')
                // setExpenseLegendColor('#63CDD6')
              } else {
                setBgColor('#F22973');
                bg = '#F22973';
                // setIncomeLegendColor('#63CDD6')
                // setExpenseLegendColor('#63CDD6')
              }
            } else {
              if (wholeExpenseAmount == 0) {
                setBgColor('#F22973');
                bg = '#F22973';
                // setIncomeLegendColor('#63CDD6')
                // setExpenseLegendColor('#63CDD6')
              } else if (
                Number(wholeRemaining) / Number(wholeAmount) < 1 &&
                Number(wholeRemaining) / Number(wholeAmount) > 0.5
              ) {
                setBgColor('#F22973');
                bg = '#F22973';
                // setIncomeLegendColor('#63CDD6')
                // setExpenseLegendColor('#63CDD6')
              } else if (
                Number(wholeRemaining) / Number(wholeAmount) > 0 &&
                Number(wholeRemaining) / Number(wholeAmount) <= 0.5
              ) {
                setBgColor('#F2A413');
                bg = '#F2A413';
                // setIncomeLegendColor('#63CDD6')
                // setExpenseLegendColor('#63CDD6')
              } else {
                setBgColor('#63CDD6');
                bg = '#63CDD6';
              }
            }
            let title = "";
            if (tab == "DB") {
              title = "Expense";
            } else {
              title = "Income";
            }
            setBudgetLegendColor('#5E83F2');
            setIncomeLegendColor(bg);
            setExpenseLegendColor(bg);
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
            setSpinner(false);
          } else {
            setChartData();
            setNoChartData(true);
            setWholeBudgetAmt(0);
            setWholeExpenseAmt(0);
            setBaseCurrency('');
            setNotransaction(true);
            setBudgetList([]);
          }
        });
    });
  };
  getMonthChartData = (list) => {
    let data = [...list];
    // data.sort(function (a, b) { return b.expense - a.expense });
    // console.log(data[0].expense)
    data.sort(function (a, b) {
      return b.expenseInBaseCurrency - a.expenseInBaseCurrency;
    });
    console.log(data[0].expenseInBaseCurrency);
    let i = 1;
    let array = [];
    while (i <= 12) {
      for (let d of data) {
        if (i == d.month) {
          let dt = {};
          dt.count = i;
          dt.label = d.monthAndYear;
          dt.expense = d.expenseInBaseCurrency.toFixed(2);
          if (d[0].expenseAmount == 0) {
            dt.height = 0;
          } else {
            dt.height =
              (d.expenseInBaseCurrency / data[0].expenseInBaseCurrency) * 30;
          }
          dt.budgetAmount = d.budgetAmountInBaseCurrency.toFixed(2);

          array.push(dt);
        } else {
          let dt = {};
          dt.count = i;
          dt.label = d.monthAndYear;
          dt.expense = (0).toFixed(2);

          dt.height = 0;

          dt.budgetAmount = (0).toFixed(2);

          array.push(dt);
        }
      }
      i = i + 1;
    }
    console.log(array);
  };

  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    setFlag(true);
    getBudgetCategoryLt(tab);
  };
  selectedData = (item) => {
    setSpinner(true);
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({ statementData: item, reDirectTo: 'budgetPage' });
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: 'budgetPage',
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
            reDirectTo: 'budgetPage',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'budgetPage',
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
  const libraryPath = Platform.select({
    // Specify fusioncharts.html file location
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

      <Animated.View style={styles.layer1}>
        <View style={{ height: hp('20%') }}>
          <View>
            <Image
              style={{ maxWidth: '100%' }}
              source={require('./assets/graph_bg.png')}></Image>
          </View>

          <View style={styles.container}>
            <View style={styles.topHeader}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('budgetPage')}>
                <View style={{ width: 25, height: 25 }}>
                  <Image
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/icons-back_white.png')}></Image>
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.heading}>
                  {route.params.selectedItem.categoryName}
                </Text>
              </View>
            </View>
            <Animated.View style={{ opacity: viewOpacity, zIndex: 100 }}>
              <Row style={{ paddingLeft: hp('2%'), paddingRight: hp('2%') }}>
                <Col
                  size={4}
                  style={activeTab == 'weekly' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('weekly');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      WEEKLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={
                    activeTab == 'monthly' ? styles.activeTab : styles.tab
                  }>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('monthly');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      MONTHLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={
                    activeTab == 'quarterly' ? styles.activeTab : styles.tab
                  }>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('quarterly');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      QUARTERLY
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  size={4}
                  style={activeTab == 'yearly' ? styles.activeTab : styles.tab}>
                  <TouchableOpacity
                    style={{ zIndex: 10 }}
                    onPress={() => {
                      selectedTab('yearly');
                    }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                      YEARLY
                    </Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Animated.View>
          </View>
        </View>
        <View>
          <Animated.View
            style={{ opacity: viewOpacity, zIndex: 30, padding: hp('0.1%') }}>
            <View style={styles.chartContainer}>
              {chartData != undefined ? (
                // <FusionCharts
                //   type={'scrollcombi2d'}
                //   width={'100%'}
                //   height={'100%'}
                //   dataFormat={'json'}
                //   dataSource={chartData}
                //   // renderAt={"chart-container"}
                //   libraryPath={libraryPath} // set the libraryPath property
                // />
                <BarChart
                  style={styles.bar}
                  xAxis={chartData.xAxis}
                  data={chartData.data}
                  legend={chartData.legend}
                  drawValueAboveBar={false}
                  onChange={(event) => console.log(event.nativeEvent)}
                  marker={chartData.marker}
                // scaleXEnabled={true}
                // autoScaleMinMaxEnabled={true}
                // visibleRange={{ x: { min: 3, max: 5 } }}
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
            {/* <Grid style={{marginTop: hp('2%')}}>
              <Row>
                <Col size={2}></Col>
                <Col size={4}>
                  <Row>
                    <Col size={3}></Col>
                    <Col size={1.5} style={{marginTop: 3}}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: budgetLegendColor,
                          borderWidth: 1,
                          borderColor: 'white',
                          borderRadius: 25,
                        }}></View>
                    </Col>

                    <Col size={6.5}>
                      <Text
                        style={{color: 'white', fontSize: 10, marginTop: 2}}>
                        BUDGET
                      </Text>
                    </Col>
                    <Col size={1}></Col>
                  </Row>
                </Col>
                <Col size={4}>
                  <Row>
                    <Col size={3}></Col>
                    <Col size={1.5} style={{marginTop: 3}}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderWidth: 1,
                          borderColor: 'white',
                          backgroundColor:
                            route.params.type == 'DB'
                              ? expenseLegendColor
                              : incomeLegendColor,
                          borderRadius: 25,
                        }}></View>
                    </Col>

                    <Col size={6.5}>
                      {route.params.type == 'DB' ? (
                        <Text
                          style={{color: 'white', fontSize: 10, marginTop: 2}}>
                          EXPENSES
                        </Text>
                      ) : (
                        <Text
                          style={{color: 'white', fontSize: 10, marginTop: 2}}>
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
            zIndex: 100,
            height: hp('94%'),
            // marginBottom: wp('32%'),
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
                  source={{
                    uri:
                      global.baseURL +
                      'customer/' +
                      route.params.selectedItem.icon,
                  }}></Image>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginLeft: hp('0.4%'),
                  opacity: 1,
                }}>
                {wholeBudgetAmt - wholeExpenseAmt < 0 ? (
                  <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                    Over Spent
                  </Text>
                ) : (
                    <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                      Remaining
                    </Text>
                  )}
              </View>
              <View
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  opacity: 1,
                  flexDirection: 'row',
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
                    route.params.type == 'CR'
                      ? Math.abs(wholeBudgetAmt - wholeExpenseAmt)
                      : Number(wholeBudgetAmt - wholeExpenseAmt)
                  }
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
                {route.params.type == 'DB' ? (
                  <Text
                    style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'left' }}>
                    Expense
                  </Text>
                ) : (
                    <Text
                      style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'left' }}>
                      Income
                    </Text>
                  )}
                <View
                  style={{
                    marginLeft: 'auto',
                    alignSelf: 'center',
                    opacity: 1,
                    flexDirection: 'row',
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
                  <AmountDisplay
                    style={{
                      color: 'white',
                      fontSize: 24,
                      textAlign: 'left',
                    }}
                    amount={Number(wholeExpenseAmt)}
                    currency={baseCurrency}
                  />
                  {/* <NumberFormat
                    value={Number(wholeExpenseAmt)}
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
                          textAlign: 'left',
                        }}>
                        {value}
                      </Text>
                    )}
                  /> */}
                </View>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                <Text
                  style={{ color: '#FFFFFF', fontSize: 14, textAlign: 'right' }}>
                  Total Budget
                </Text>
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
                  <AmountDisplay
                    style={{ color: 'white', fontSize: 24 }}
                    amount={Number(wholeBudgetAmt)}
                    currency={baseCurrency}
                  />
                  {/* <NumberFormat
                    value={Number(wholeBudgetAmt)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={global.decimalScale}
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <Text style={{color: 'white', fontSize: 24}}>
                        {value}
                      </Text>
                    )}
                  /> */}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={styles.layer3}>
          <View style={styles.line}></View>
          <View style={{ flex: 1 }}>
            {/* {budgetList != null && budgetList.length != 0 ? */}
            {notransaction == false ? (
              <FlatList
                data={budgetList}
                style={{ marginBottom: hp('3%'), marginTop: hp('2%') }}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  let e = event.nativeEvent.contentOffset.y;
                  console.log('e : ' + e);
                  setScrollOffset(e);
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ zIndex: 300 }}
                    onPress={() => selectedData(item)}>
                    <Row
                      style={{
                        paddingLeft: hp('1.5%'),
                        paddingBottom: hp('3%'),
                      }}>
                      <Col size={2} style={{ alignItems: 'center' }}>
                        <View style={{ width: 45, height: 45 }}>
                          {item.merchantIcon != null &&
                            item.merchantIcon != '' ? (
                              <Image
                                style={{ maxWidth: '100%', height: '100%' }}
                                source={{
                                  uri:
                                    global.baseURL +
                                    'customer/' +
                                    item.merchantIcon,
                                }}></Image>
                            ) : (
                              <Image
                                style={{ maxWidth: '100%', height: '100%' }}
                                source={{
                                  uri: global.baseURL + 'customer/' + item.icon,
                                }}></Image>
                            )}
                          {/* <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image> */}
                        </View>
                      </Col>
                      <Col size={4.5}>
                        <Text style={{ color: '#454F63', fontSize: 14 }}>
                          {item.description}
                        </Text>
                        <Text
                          style={{
                            color: '#888888',
                            fontSize: 14,
                            opacity: 0.7,
                          }}>
                          {item.category} |{' '}
                          {Moment(
                            item.transactionTimestamp,
                            'YYYY-MM-DD,h:mm:ss',
                          ).format(global.dateFormat)}
                        </Text>
                      </Col>
                      <Col
                        size={4.5}
                        style={{ alignItems: 'flex-end', paddingRight: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              color: '#454F63',
                              fontSize: 10,
                              marginRight: 3,
                              marginTop: 3,
                            }}>
                            {item.transactionCurrency}
                          </Text>
                          <AmountDisplay
                            style={{ color: '#454F63', fontSize: 18 }}
                            amount={Number(item.amount)}
                            currency={item.transactionCurrency}
                          />
                          {/* <NumberFormat
                            value={Number(item.amount)}
                            thousandsGroupStyle="lakh"
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{color: '#454F63', fontSize: 18}}>
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
                            style={{ maxWidth: '100%', height: '100%' }}
                            source={{ uri: item.bankIcon }}></Image>
                        </View>
                      </Col>
                    </Row>
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
                    Oops! We have drawn a blank here!
                </Text>
                  <Text
                    style={{
                      color: '#888888',
                      fontWeight: 'bold',
                      fontSize: 15,
                      textAlign: 'center',
                    }}>
                    No transactions to show!
                </Text>
                </View>
              )}
            {/* </Grid> */}

            {/* </ScrollView> */}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export default SubBudgetPage;
const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
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
  heading: {
    paddingLeft: hp('3%'),
    color: 'white',
    fontWeight: 'bold',
    fontSize: 21,
    paddingTop: hp('0.5%'),
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
    // backgroundColor: "#5E83F2",
    borderRadius: 12,
  },
  viewBtnText: {
    color: 'white',
    fontSize: 14,
  },
  backBtn: {
    paddingTop: hp('1%'),
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
    zIndex: 30,
  },
  bar: {
    marginTop: 10,
    // height: Dimensions.get("window").height / 2.5,
    // width: wp("80%"),
    maxWidth: '100%',
    height: '100%'
  },
});
