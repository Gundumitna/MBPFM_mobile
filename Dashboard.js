import React, { useState, useEffect, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  processColor,
} from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";
import PieChart from "react-native-pie-chart";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import Carousel from "react-native-snap-carousel";
import Moment from "moment";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { AppConfigActions } from "./redux/actions";
import ProgressBar from "react-native-progress/Bar";
import FusionCharts from "react-native-fusioncharts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Upshot from "react-native-upshotsdk";
import Modal from "react-native-modal";
import SuggestionPage from "./SuggestionPage";
import Overlay from "react-native-modal-overlay";
import AmountDisplay from "./AmountDisplay";
import { BarChart, CombinedChart } from "react-native-charts-wrapper";

function Dashboard({ navigation }) {
  const [singleAccount, setSingleAccount] = useState(false);
  const { rightDrawerState } = useSelector((state) => state.appConfig);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const SLIDER_HEIGHT = Dimensions.get("window").height;
  const isDrawerOpen = useIsDrawerOpen();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotionData, setPromotionData] = useState([]);
  const [active, setActive] = useState(0);
  const [loader, setLoader] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [dashboardData, setDashboardData] = useState("");
  const [assetsList, setAssetsList] = useState([]);
  const [uncategoziedList, setUncategoziedList] = useState([]);
  const [goalsList, setGoalsList] = useState([]);
  const [memoriesData, setMemoriesData] = useState();
  const [expenseList, setExpenseList] = useState([]);
  const [noBudgetChartData, setNoBudegtChartData] = useState(false);
  const [incomeList, setIncomeList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalAssetAmt, setTotalAssetAmt] = useState("");
  const [totalExpenseAmt, setTotalExpenseAmt] = useState("");
  const [totalIncomeAmt, setTotalIncomeAmt] = useState("");
  const [pendingCnt, setpendingCnt] = useState("");
  const [freeToUseBalance, setFreeToUseBalance] = useState("");
  const [progressBarData, setProgressBarData] = useState("");

  const chart_wh = 106;
  // const sliceColor = ['#63CDD6', '#F2A413', '#F22973', '#FCD6E2']
  const sliceColor = [
    "#5E83F2",
    "#63CDD6",
    "#F2A413",
    "#F22973",
    "#FCD6E2",
    "#5E83F24D",
    "#FBE3B7",
    "#D0F0F3",
    "#C8C3FD",
    "#427087",
    "#FD8C60",
    "#D94545",
    "#731314",
    "#2C356C",
  ];
  const [assetSeries, setAssetSeries] = useState([]);
  const [assetSliceColor, setAssetSliceColor] = useState([]);
  const [expensesChartSeries, setExpensesChartSeries] = useState([]);
  const [expensesChartSliceColor, setExpensesChartSliceColor] = useState([]);
  const [incomeChartSeries, setIncomeChartSeries] = useState([]);
  const [incomeChartSliceColor, setIncomeChartSliceColor] = useState([]);
  const [assetBalance, setAssetBalance] = useState([]);
  const [assetBalanceSeries, setAssetBalanceSeries] = useState([]);
  const [assetBalanceSliceColor, setAssetBalanceSliceColor] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [heading, setHeading] = useState("");
  const [flag, setFlag] = useState(false);
  const [budgetChart, setBudgetChart] = useState();
  const [budgetLegendColor, setBudgetLegendColor] = useState();
  const [expenseLegendColor, setExpenseLegendColor] = useState();
  const [expenseBudgetGraph, setexpenseBudgetGraph] = useState();
  const [incomeBudgetGraph, setincomeBudgetGraph] = useState();
  const [epenseBudgetList, setEpenseBudgetList] = useState();
  const [incomeBudgetList, setIncomeBudgetList] = useState();
  const [activeTab, setActiveTab] = useState("");
  const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
  const [predictionPage, setPredictionPage] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  let ls = require("react-native-local-storage");

  useEffect(() => {
    const payload = {
      appuID: global.loginID,
    };
    // if (global.loginID == "250002") {
    console.log("FCM TOKEN DASHBOARD: " + global.fcmtoken);
    Upshot.createCustomEvent(
      "AppVisit",
      JSON.stringify(payload),
      false,
      function (eventId) {
        console.log("Event app visit" + eventId);
      }
    );
    Upshot.showActivityWithType(-1, "Home");
    //} // Home
    Upshot.addListener("UpshotActivityDidAppear", handleActivityDidAppear);

    Upshot.addListener("UpshotActivityDidDismiss", handleActivityDidDismiss);

    Upshot.addListener("UpshotDeepLink", handleDeeplink);

    const unsubscribe = navigation.addListener("focus", () => {
      console.log(global.predictionList);
      global.dashboardPredictionPage = false;
      global.predictionIndex = undefined;
      if (global.predictionList.length != 0) {
        // if (global.predictionList.length >= 5) {
        //     let list = []
        //     let i = 0
        //     // for (let l of global.predictionList) {
        //     //     if (i < 5) {
        //     //         l.id = i
        //     //         list.push(l)
        //     //         i = i + 1
        //     //     } else {
        //     //         return
        //     //     }
        //     // }
        //     console.log('1st ')
        //     for (let j = 0; j < 5; j++) {
        //         predictionList[j].id = i
        //         list.push(global.predictionList[j])
        //         i = i + 1

        //     }
        //     list.push({ id: i })
        //     list.push({ id: i + 1, image: require('./assets/zomatoDashboardBanner.jpg') })
        //     list.push({ id: i + 2, image: require('./assets/article_2.png') })
        //     list.push({ id: i + 3, image: require('./assets/zomatoDashboardBanner.jpg') })
        //     console.log(list)
        //     setPromotionData(list)
        // }
        // else {
        //     console.log('2nd ')
        let list = [];
        let i = 0;
        for (let l of global.predictionList) {
          // if (i < 5) {
          l.id = i;
          list.push(l);
          i = i + 1;
          // }
        }
        list.push({
          id: i,
          image: require("./assets/zomatoDashboardBanner.jpg"),
        });
        list.push({ id: i + 1, image: require("./assets/article_2.png") });
        list.push({
          id: i + 2,
          image: require("./assets/zomatoDashboardBanner.jpg"),
        });
        console.log(list);
        setPromotionData(list);
        // }
      } else {
        setPromotionData([
          // { id: 0, text1: 'You have spent INR 10,000 on Petrol this month. ', text2: 'Want to apply for Petro Card ?' },
          // { id: 1, text1: 'Your spend at Spencer’s for Rs. 2500 yesterday was for Food?', text2: '' },
          // { id: 2, text1: 'Is the monthly payout of Rs 25,000 towards House Rent?', text2: '' },
          { id: 0, image: require("./assets/zomatoDashboardBanner.jpg") },
          { id: 1, image: require("./assets/article_2.png") },
          { id: 2, image: require("./assets/zomatoDashboardBanner.jpg") },
        ]);
      }
      ls.save("selectedDrawerItem", "dashboard");
      console.log("global.thousandsGroupStyle : " + global.thousandsGroupStyle);
      getDashboardData();
      setActiveTab("DB");
      updateFCMToken();
    });
    return unsubscribe;
  }, [navigation]);
  const handleActivityDidAppear = (response) => {
    console.log("activity did appear");
    console.log(response);
  };

  const handleActivityDidDismiss = (response) => {
    console.log("activity dismiss");
    //if activity==7
    if (response.activityType == 7) {
      Upshot.showActivityWithType(-1, "Home Survey");
    }
    console.log(response);
  };
  const handleDeeplink = (response) => {
    console.log("deeplink available");
    console.log(response);
    if (response.deepLink == "BADGE") {
      navigation.navigate("myBadges");
      console.log("deeplink to badge found");
    } else if (response.deepLink == "BUDGET") {
      navigation.navigate("budgetPage");
      console.log("deeplink to budget found");
    } else if (response.deepLink == "GOAL") {
      console.log("deeplink to goal found");
      navigation.navigate("goalsPage");
    }
  };
  useEffect(() => {
    console.log("Dashboard Page");
    if (rightDrawerState == "reload" && isDrawerOpen == false) {
      if (spinner == false) {
        console.log("isDrawerOpen : " + isDrawerOpen);
        setActiveTab("DB");
        getNoSpinnerDashboardData();
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == "reload"]);

  useEffect(() => {
    console.log("Dashboard Page");
    if (global.predictionList.length != 0) {
      // if (global.predictionList.length >= 5) {
      //     let list = []
      //     let i = 0
      //     // for (let l of global.predictionList) {
      //     //     if (i < 5) {
      //     //         l.id = i
      //     //         list.push(l)
      //     //         i = i + 1
      //     //     } else {
      //     //         return
      //     //     }
      //     // }
      //     console.log('1st ')
      //     for (let j = 0; j < 5; j++) {
      //         predictionList[j].id = i
      //         list.push(global.predictionList[j])
      //         i = i + 1

      //     }
      //     list.push({ id: i, image: require('./assets/zomatoDashboardBanner.jpg') })
      //     list.push({ id: i + 1, image: require('./assets/article_2.png') })
      //     list.push({ id: i + 2, image: require('./assets/zomatoDashboardBanner.jpg') })
      //     console.log(list)
      //     setPromotionData(list)
      // }
      // else {
      //     console.log('2nd ')
      let list = [];
      let i = 0;
      for (let l of global.predictionList) {
        // if (i < 5) {
        l.id = i;
        list.push(l);
        i = i + 1;
        // }
      }
      list.push({
        id: i,
        image: require("./assets/zomatoDashboardBanner.jpg"),
      });
      list.push({ id: i + 1, image: require("./assets/article_2.png") });
      list.push({
        id: i + 2,
        image: require("./assets/zomatoDashboardBanner.jpg"),
      });
      console.log(list);
      setPromotionData(list);
      // }
    } else {
      setPromotionData([
        // { id: 0, text1: 'You have spent INR 10,000 on Petrol this month. ', text2: 'Want to apply for Petro Card ?' },
        // { id: 1, text1: 'Your spend at Spencer’s for Rs. 2500 yesterday was for Food?', text2: '' },
        // { id: 2, text1: 'Is the monthly payout of Rs 25,000 towards House Rent?', text2: '' },
        { id: 0, image: require("./assets/zomatoDashboardBanner.jpg") },
        { id: 1, image: require("./assets/article_2.png") },
        { id: 2, image: require("./assets/zomatoDashboardBanner.jpg") },
      ]);
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == "predictionReload"]);

  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);

  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    if (tab == "DB") {
      // setEpenseBudgetList(dataSource)
      setBudgetChart(epenseBudgetList);
      if (epenseBudgetList != undefined) {
        setNoBudegtChartData(false);
      } else {
        setNoBudegtChartData(true);
      }
    } else if (tab == "CR") {
      setBudgetChart(incomeBudgetList);
      if (incomeBudgetList != undefined) {
        setNoBudegtChartData(false);
      } else {
        setNoBudegtChartData(true);
      }
    }
    setFlag(true);
  };
  const updateFCMToken = () => {
    let postdata = {};
    postdata.customerId = global.loginID;
    postdata.pushToken = global.fcmtoken;
    console.log("update token: " + JSON.stringify(postdata));
    fetch(global.baseURL + "customer/save/pushtoken", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(
          "token updated successfully" + JSON.stringify(responseJson)
        );
      })
      .catch((error) => {
        console.log("token error" + JSON.stringify(error));
        console.error(error);
      });
  };
  getNoSpinnerDashboardData = () => {
    let postData = {};
    let linkList = 0;
    ls.get("consentStatus").then((data) => {
      console.log("consentStatus : " + data);
      if (data == "true") {
        linkList = 1;
        // ls.remove('consentStatus')
      }
    });
    ls.get("filterData")
      .then((data) => {
        setLoader(true);
        setFilterData(data);
        // if(data.month.id==new Date().getMonth() + 1){
        //   postData.calenderSelectedFlag = 1;
        // }else{
        //   postData.calenderSelectedFlag = 0;
        // }
        console.log("flag : " + data.flag);
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
        let heading = "";
        if (data.bank[0].bankId == 0 || data.bank.length == 0) {
          heading = "All Banks - " + data.month.mntName + " " + data.year.year;
        } else if (data.bank.length > 1) {
          heading =
            data.bank[0].bankName +
            " +" +
            (data.bank.length - 1) +
            " - " +
            data.month.mntName +
            " " +
            data.year.year;
        } else if (data.bank.length == 1) {
          heading =
            data.bank[0].bankName +
            " - " +
            data.month.mntName +
            " " +
            data.year.year;
        }

        setHeading(heading);
        console.log(JSON.stringify(postData));
        fetch(global.baseURL + "customer/" + global.loginID + "/dashboard", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.data);
            if (responseJson.data != null) {
              setDashboardData(responseJson.data);
              setCustomerPreferredCurrency(
                responseJson.data.customerPreferredCurrency
              );
              setMemoriesData(responseJson.data.memoriesData);
              setUncategoziedList(responseJson.data.uncategTransactionsList);
              setGoalsList(responseJson.data.getGoalsDataModelList);
              if (responseJson.data.expenseBudgetsGraph != null) {
                getBudgetChartData(responseJson.data.expenseBudgetsGraph, "DB");
                setexpenseBudgetGraph(responseJson.data.expenseBudgetsGraph);
              } else {
                setexpenseBudgetGraph();
                setExpensesChartSeries([]);
                setExpensesChartSliceColor([]);
              }
              if (responseJson.data.incomeBudgetGraph != null) {
                setincomeBudgetGraph(responseJson.data.incomeBudgetGraph);
                getBudgetChartData(responseJson.data.incomeBudgetGraph, "CR");
              } else {
                setincomeBudgetGraph();
                setIncomeChartSliceColor([]);
                setIncomeChartSeries([]);
              }
              if (responseJson.data.freeToUse != null) {
                setFreeToUseBalance(
                  responseJson.data.freeToUseInUserPreferredCurrency
                );
                if (
                  responseJson.data.openingBalanceInUserPreferredCurrency !=
                  null
                ) {
                  setProgressBarData(
                    responseJson.data.openingBalanceInUserPreferredCurrency /
                    responseJson.data.freeToUseInUserPreferredCurrency
                  );
                } else {
                  setProgressBarData(0);
                }
              } else {
                setFreeToUseBalance(0);
              }

              if (responseJson.data.expenseBudgetsGraph != null) {
                getBudgetChartData(responseJson.data.expenseBudgetsGraph, "DB");
                setexpenseBudgetGraph(responseJson.data.expenseBudgetsGraph);
              } else {
                setexpenseBudgetGraph();
              }
              if (responseJson.data.incomeBudgetGraph != null) {
                getBudgetChartData(responseJson.data.incomeBudgetGraph, "CR");
                setincomeBudgetGraph(responseJson.data.incomeBudgetGraph);
              } else {
                setincomeBudgetGraph();
              }
              setSingleAccount(false);
              console.log(uncategoziedList);
              if (responseJson.data.assets != null) {
                if (responseJson.data.assets.length == 1) {
                  setSingleAccount(true);
                  let tAssetDetails = [];
                  let tAmount = 0;
                  for (let asset of responseJson.data.assets[0].assets) {
                    let a = {};
                    a.fiId = asset.linkedAccountId;
                    a.fiName = asset.assetDetails[1].value;
                    // a.amount = asset.totalAssetvalue;
                    a.amount = asset.assetValueInUserPreferredCurrencyAmount;
                    a.userPreferrrdCurrency = asset.userPreferredCurrency;
                    a.logo =
                      "http://63.142.252.161:8080/pfm/api/customer/" +
                      asset.assetDetails[34].value;

                    a.color = undefined;
                    tAssetDetails.push(a);
                    // tAmount = tAmount + asset.totalAssetvalue;
                    tAmount =
                      tAmount + asset.assetValueInUserPreferredCurrencyAmount;
                  }
                  setTotalAssetAmt(Number(tAmount));
                  tAssetDetails.sort(function (a, b) {
                    return b.amount - a.amount;
                  });
                  // setAssetSeries(d);
                  let color = [];
                  let chartSeries = [];
                  for (let i = 0; i < tAssetDetails.length; i++) {
                    let chart = {};
                    chart.value = tAssetDetails[i].amount;
                    // chart.fiName = tAssetDetails[i].fiName;
                    if (i < sliceColor.length) {
                      color.push(sliceColor[i]);
                      tAssetDetails[i].color = sliceColor[i];
                    } else {
                      // console.log('random color')
                      let c =
                        "rgb(" +
                        Math.floor(Math.random() * 256) +
                        "," +
                        Math.floor(Math.random() * 256) +
                        "," +
                        Math.floor(Math.random() * 256) +
                        ")";
                      color.push(c);
                      tAssetDetails[i].color = c;
                    }
                    chartSeries.push(chart.value);
                  }
                  setAssetSeries(chartSeries);
                  setAssetSliceColor(color);
                  setAssetsList(tAssetDetails);
                } else {
                  setSingleAccount(false);
                  let tAssetDetails = [];
                  let tAmount = 0;
                  for (let asset of responseJson.data.assets) {
                    let a = {};
                    a.fiId = asset.fiId;
                    a.fiName = asset.fiName;
                    // a.amount = asset.totalAssetvalue;
                    a.amount = asset.totalAssetValueInUserPreferredCurrency;
                    a.userPreferrrdCurrency = asset.userPreferrrdCurrency;
                    a.logo = asset.fiLogo;
                    a.color = undefined;
                    tAssetDetails.push(a);
                    // tAmount = tAmount + asset.totalAssetvalue;
                    tAmount =
                      tAmount + asset.totalAssetValueInUserPreferredCurrency;
                  }
                  setTotalAssetAmt(Number(tAmount));
                  tAssetDetails.sort(function (a, b) {
                    return b.amount - a.amount;
                  });
                  setAssetsList(tAssetDetails);
                  addAssetChartData();
                }
              } else {
                setAssetsList([]);
              }
              if (responseJson.data.expense != null) {
                let tExpenseDetails = [];
                let tExpense = 0;
                for (let e of responseJson.data.expense) {
                  if (e.userPreferredCurrencyAmount != 0) {
                    let a = {};
                    a.categoryId = e.categoryId;
                    a.categoryName = e.categoryName;
                    // a.amount = e.amount;
                    a.amount = e.userPreferredCurrencyAmount;
                    a.color = undefined;
                    a.userPreferedCurrency = e.userPreferedCurrency;
                    tExpenseDetails.push(a);
                    // tExpense = tExpense + e.amount;
                    tExpense = tExpense + e.userPreferredCurrencyAmount;
                  }
                }

                setTotalExpenseAmt(tExpense);
                tExpenseDetails.sort(function (a, b) {
                  return b.amount - a.amount;
                });
                setExpenseList(tExpenseDetails);
                addExpenseChartData();
              } else {
                setExpenseList([]);
              }

              if (responseJson.data.income != null) {
                let tIncomeDetails = [];
                let tIncome = 0;
                for (e of responseJson.data.income) {
                  if (e.userPreferredCurrencyAmount != 0) {
                    let a = {};
                    a.categoryId = e.categoryId;
                    a.categoryName = e.categoryName;
                    // a.amount = e.amount;
                    a.amount = e.userPreferredCurrencyAmount;
                    a.userPreferedCurrency = e.userPreferedCurrency;
                    a.color = undefined;
                    tIncomeDetails.push(a);
                    // tIncome = tIncome + e.amount;
                    tIncome = tIncome + e.userPreferredCurrencyAmount;
                  }
                }

                setTotalIncomeAmt(tIncome);
                tIncomeDetails.sort(function (a, b) {
                  return b.amount - a.amount;
                });

                setIncomeList(tIncomeDetails);
                addIncomeChartData();
              } else {
                setIncomeList([]);
                // setAssetSeries([]);
                // setIncomeChartSliceColor([])
              }
              if (responseJson.data.assetWiseBalance != null) {
                if (
                  responseJson.data.assetWiseBalance != undefined &&
                  responseJson.data.assetWiseBalance != null
                ) {
                  let tAssetWBal = [];
                  for (let asset of responseJson.data.assetWiseBalance) {
                    let a = {};
                    a.assetType = asset.assetType;
                    a.balance = asset.balance;
                    a.color = undefined;
                    a.icon =
                      global.baseURL + "customer/" +
                      asset.icon;
                    a.userPreferedCurrency = asset.userPreferedCurrency;
                    a.balanceInUserPreferredCurrency =
                      asset.balanceInUserPreferredCurrency;
                    tAssetWBal.push(a);
                  }
                  tAssetWBal.sort(function (a, b) {
                    return (
                      b.balanceInUserPreferredCurrency -
                      a.balanceInUserPreferredCurrency
                    );
                  });
                  setAssetBalance(tAssetWBal);
                  addAssetBalChartData();
                  getNoSpinnerPendingConsentCnt();
                }
              } else {
                setAssetBalance([]);
              }
            } else {
              setSpinner(false);
              setAssetBalance([]);
              setIncomeList([]);
              setExpenseList([]);
              setAssetsList([]);
              setIncomeList([]);
              setincomeBudgetGraph();
              setexpenseBudgetGraph();
              setMemoriesData([]);
              setGoalsList([]);
              setUncategoziedList([]);
              setDashboardData([]);
              setAssetSeries([]);
              setAssetSliceColor([]);
              setProgressBarData(0);
              setFreeToUseBalance(0);
            }
            setLoader(false);
          });
      })
      .catch(() => {
        setLoader(false);
        console.log(error);
      });
  };
  getNoSpinnerPendingConsentCnt = () => {
    setLoader(true);
    return fetch(
      global.baseURL + "consent/get/consents/count/" + global.loginID
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        setpendingCnt(responseJson.data);
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };
  getPendingConsentCnt = () => {
    setSpinner(true);
    return fetch(
      global.baseURL + "consent/get/consents/count/" + global.loginID
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        console.log(responseJson);
        setpendingCnt(responseJson.data);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  getDashboardData = () => {
    setSpinner(true);

    let postData = {};
    let linkList = 0;
    ls.get("consentStatus").then((data) => {
      console.log("consentStatus : " + data);
      if (data == "true") {
        linkList = 1;
        // ls.remove('consentStatus')
      }
    });
    ls.get("filterData")
      .then((data) => {
        setFilterData(data);
        // postData.filterDuration: "MFEB2020",
        // "fiProviders": [1]
        console.log("flag : " + data.flag);
        postData.calenderSelectedFlag = 1;
        postData.month = data.month.id;
        postData.year = data.year.year;
        if (linkList == 1 || data.flag == false) {
          postData.linkedAccountIds = [];
        } else {
          postData.linkedAccountIds = data.linkedAccountIds;
        }
        // postData.linkedAccountIds = []

        let heading = "";
        if (data.bank[0].bankId == 0 || data.bank.length == 0) {
          heading = "All Banks - " + data.month.mntName + " " + data.year.year;
        } else if (data.bank.length > 1) {
          heading =
            data.bank[0].bankName +
            " +" +
            (data.bank.length - 1) +
            " - " +
            data.month.mntName +
            " " +
            data.year.year;
        } else if (data.bank.length == 1) {
          heading =
            data.bank[0].bankName +
            " - " +
            data.month.mntName +
            " " +
            data.year.year;
        }
        setHeading(heading);
        console.log(JSON.stringify(postData));
        fetch(global.baseURL + "customer/" + global.loginID + "/dashboard", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.data);
            if (responseJson.data != null) {
              setSingleAccount(false);
              setDashboardData(responseJson.data);
              setCustomerPreferredCurrency(
                responseJson.data.customerPreferredCurrency
              );
              setUncategoziedList(responseJson.data.uncategTransactionsList);
              setMemoriesData(responseJson.data.memoriesData);
              setGoalsList(responseJson.data.getGoalsDataModelList);
              if (responseJson.data.freeToUse != null) {
                setFreeToUseBalance(
                  responseJson.data.freeToUseInUserPreferredCurrency
                );
                if (
                  responseJson.data.openingBalanceInUserPreferredCurrency !=
                  null
                ) {
                  setProgressBarData(
                    responseJson.data.openingBalanceInUserPreferredCurrency /
                    responseJson.data.freeToUseInUserPreferredCurrency
                  );
                } else {
                  setProgressBarData(0);
                }
              } else {
                setFreeToUseBalance(0);
              }
              // setFreeToUseBalance(responseJson.data.freeToUse)
              // setProgressBarData(responseJson.data.openingBalance / responseJson.data.freeToUse)
              // setexpenseBudgetGraph(responseJson.data.expenseBudgetsGraph)
              // setincomeBudgetGraph(responseJson.data.incomeBudgetGraph)
              // getBudgetChartData(responseJson.data.expenseBudgetsGraph, 'DB')
              // getBudgetChartData(responseJson.data.incomeBudgetGraph, 'CR')
              if (responseJson.data.expenseBudgetsGraph != null) {
                getBudgetChartData(responseJson.data.expenseBudgetsGraph, "DB");
                setexpenseBudgetGraph(responseJson.data.expenseBudgetsGraph);
              } else {
                setexpenseBudgetGraph();
                setExpensesChartSeries([]);
                setExpensesChartSliceColor([]);
              }
              // else {
              //     setBudgetChart()
              // }
              if (responseJson.data.incomeBudgetGraph != null) {
                setincomeBudgetGraph(responseJson.data.incomeBudgetGraph);
                getBudgetChartData(responseJson.data.incomeBudgetGraph, "CR");
              } else {
                setincomeBudgetGraph();
                setIncomeChartSliceColor([]);
                setIncomeChartSeries([]);
              }
              if (responseJson.data.assets != null) {
                if (responseJson.data.assets.length == 1) {
                  setSingleAccount(true);
                  let tAssetDetails = [];
                  let tAmount = 0;
                  for (let asset of responseJson.data.assets[0].assets) {
                    let a = {};
                    a.fiId = asset.linkedAccountId;
                    a.fiName = asset.assetDetails[1].value;
                    // a.amount = asset.totalAssetvalue;
                    a.amount = asset.assetValueInUserPreferredCurrencyAmount;
                    a.userPreferrrdCurrency = asset.userPreferredCurrency;
                    a.logo =
                      "http://63.142.252.161:8080/pfm/api/customer/" +
                      asset.assetDetails[34].value;

                    a.color = undefined;
                    tAssetDetails.push(a);
                    // tAmount = tAmount + asset.totalAssetvalue;
                    tAmount =
                      tAmount + asset.assetValueInUserPreferredCurrencyAmount;
                  }
                  setTotalAssetAmt(Number(tAmount));
                  tAssetDetails.sort(function (a, b) {
                    return b.amount - a.amount;
                  });
                  // setAssetSeries(d);
                  let chartSeries = [];
                  let color = [];
                  for (let i = 0; i < tAssetDetails.length; i++) {
                    let chart = {};
                    chart.value = tAssetDetails[i].amount;
                    // chart.fiName = tAssetDetails[i].fiName;
                    if (i < sliceColor.length) {
                      color.push(sliceColor[i]);
                      tAssetDetails[i].color = sliceColor[i];
                    } else {
                      // console.log('random color')
                      let c =
                        "rgb(" +
                        Math.floor(Math.random() * 256) +
                        "," +
                        Math.floor(Math.random() * 256) +
                        "," +
                        Math.floor(Math.random() * 256) +
                        ")";
                      color.push(c);
                      tAssetDetails[i].color = c;
                    }
                    chartSeries.push(chart.value);
                  }
                  setAssetSeries(chartSeries);
                  setAssetSliceColor(color);
                  setAssetsList(tAssetDetails);
                } else {
                  setSingleAccount(false);
                  let tAssetDetails = [];
                  let tAmount = 0;
                  for (let asset of responseJson.data.assets) {
                    let a = {};
                    a.fiId = asset.fiId;
                    a.fiName = asset.fiName;
                    // a.amount = asset.totalAssetvalue;
                    a.amount = asset.totalAssetValueInUserPreferredCurrency;
                    a.userPreferrrdCurrency = asset.userPreferrrdCurrency;
                    a.logo = asset.fiLogo;
                    a.color = undefined;
                    tAssetDetails.push(a);
                    // tAmount = tAmount + asset.totalAssetvalue;
                    tAmount =
                      tAmount + asset.totalAssetValueInUserPreferredCurrency;
                  }
                  setTotalAssetAmt(Number(tAmount));
                  tAssetDetails.sort(function (a, b) {
                    return b.amount - a.amount;
                  });
                  setAssetsList(tAssetDetails);
                  addAssetChartData();
                }
              } else {
                setAssetsList([]);
                setAssetSeries([]);
                setAssetSliceColor([]);
              }
              if (responseJson.data.expense != null) {
                let tExpenseDetails = [];
                let tExpense = 0;
                for (let e of responseJson.data.expense) {
                  if (e.userPreferredCurrencyAmount != 0) {
                    let a = {};
                    a.categoryId = e.categoryId;
                    a.categoryName = e.categoryName;
                    // a.amount = e.amount;
                    a.amount = e.userPreferredCurrencyAmount;
                    a.color = undefined;
                    a.userPreferedCurrency = e.userPreferedCurrency;
                    tExpenseDetails.push(a);
                    // tExpense = tExpense + e.amount;
                    tExpense = tExpense + e.userPreferredCurrencyAmount;
                  }
                }
                setTotalExpenseAmt(tExpense);
                tExpenseDetails.sort(function (a, b) {
                  return b.amount - a.amount;
                });
                setExpenseList(tExpenseDetails);

                addExpenseChartData();
                console.log(expensesChartSeries);
                console.log(expensesChartSliceColor);
              }
              if (responseJson.data.income != null) {
                let tIncomeDetails = [];
                let tIncome = 0;
                for (let e of responseJson.data.income) {
                  if (e.userPreferredCurrencyAmount != 0) {
                    let a = {};
                    a.categoryId = e.categoryId;
                    a.categoryName = e.categoryName;
                    // a.amount = e.amount;
                    a.amount = e.userPreferredCurrencyAmount;
                    a.userPreferedCurrency = e.userPreferedCurrency;
                    a.color = undefined;
                    tIncomeDetails.push(a);
                    // tIncome = tIncome + e.amount;
                    tIncome = tIncome + e.userPreferredCurrencyAmount;
                  }
                }

                setTotalIncomeAmt(tIncome);
                tIncomeDetails.sort(function (a, b) {
                  return b.amount - a.amount;
                });

                setIncomeList(tIncomeDetails);
                addIncomeChartData();
              } else {
                setIncomeList([]);
                setIncomeChartSliceColor([])
              }
              if (responseJson.data.assetWiseBalance != null) {
                if (
                  responseJson.data.assetWiseBalance != undefined &&
                  responseJson.data.assetWiseBalance != null
                ) {
                  let tAssetWBal = [];
                  for (let asset of responseJson.data.assetWiseBalance) {
                    let a = {};
                    a.assetType = asset.assetType;
                    a.balance = asset.balance;
                    a.color = undefined;
                    a.userPreferedCurrency = asset.userPreferedCurrency;
                    a.icon =
                      global.baseURL + "customer/" +
                      asset.icon;
                    a.balanceInUserPreferredCurrency =
                      asset.balanceInUserPreferredCurrency;
                    tAssetWBal.push(a);
                  }
                  tAssetWBal.sort(function (a, b) {
                    return (
                      b.balanceInUserPreferredCurrency -
                      a.balanceInUserPreferredCurrency
                    );
                  });

                  setAssetBalance(tAssetWBal);
                  addAssetBalChartData();
                  getPendingConsentCnt();
                }
              } else {
                setAssetBalance([]);
              }

              setSpinner(false);
            } else {
              setSpinner(false);
              setAssetBalance([]);
              setIncomeList([]);
              setExpenseList([]);
              setAssetsList([]);
              setIncomeList([]);
              setincomeBudgetGraph();
              setexpenseBudgetGraph();
              setMemoriesData([]);
              setGoalsList([]);
              setUncategoziedList([]);
              setDashboardData([]);
              setAssetSeries([]);
              setAssetSliceColor([]);
              setProgressBarData(0);
              setFreeToUseBalance(0);
            }
          });
      })
      .catch(() => {
        console.log(error);
        setSpinner(false);
      });
  };

  addAssetBalChartData = () => {
    let d = [];
    let color = [];
    for (let e of assetBalance) {
      d.push(Number(e.balance));
    }
    if (d.length != []) {
      d.sort(function (a, b) {
        return b - a;
      });
      // console.log(d);
      setAssetBalanceSeries(d);
      for (let i = 0; i < assetBalance.length; i++) {
        if (i < sliceColor.length) {
          color.push(sliceColor[i]);
          assetBalance[i].color = sliceColor[i];
        } else {
          // console.log('random color')
          let c =
            "rgb(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ")";
          color.push(c);
          assetBalance[i].color = c;
        }
      }
      setAssetBalanceSliceColor(color);
    }
  };

  addExpenseChartData = () => {
    let d = [];
    let color = [];
    console.log("expenseList : " + dashboardData.expense);
    for (let e of dashboardData.expense) {
      d.push(Number(e.userPreferredCurrencyAmount));
    }
    if (d.length != []) {
      d.sort(function (a, b) {
        return b - a;
      });
      console.log(d);
      setExpensesChartSeries(d);
      for (let i = 0; i < expenseList.length; i++) {
        if (i < sliceColor.length) {
          color.push(sliceColor[i]);
          // expensesChartSliceColor.push(sliceColor[i])
          expenseList[i].color = sliceColor[i];
        } else {
          console.log("random color");
          let c =
            "rgb(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ")";
          color.push(c);
          // expensesChartSliceColor.push(c)
          expenseList[i].color = c;
        }
      }
      setExpensesChartSliceColor(color);
      console.log(expensesChartSeries);
      console.log(expensesChartSliceColor);
    }
  };
  addIncomeChartData = () => {
    let d = [];
    let color = [];
    for (let e of dashboardData.income) {
      d.push(Number(e.userPreferredCurrencyAmount));
    }
    if (d.length != []) {
      d.sort(function (a, b) {
        return b - a;
      });
      // console.log(d);

      setIncomeChartSeries(d);
      for (let i = 0; i < incomeList.length; i++) {
        if (i < sliceColor.length) {
          color.push(sliceColor[i]);
          // console.log(sliceColor[i])
          incomeList[i].color = sliceColor[i];
          // console.log(incomeList[i])
        } else {
          // console.log('random color')
          let c =
            "rgb(" +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            "," +
            Math.floor(Math.random() * 256) +
            ")";
          color.push(c);
          incomeList[i].color = c;
        }
      }
      setIncomeChartSliceColor(color);
    }
  };
  addAssetChartData = () => {
    let d = [];
    let color = [];
    for (let asset of dashboardData.assets) {
      d.push(Number(asset.totalAssetValueInUserPreferredCurrency));
    }
    d.sort(function (a, b) {
      return b - a;
    });
    setAssetSeries(d);

    for (let i = 0; i < assetsList.length; i++) {
      if (i < sliceColor.length) {
        color.push(sliceColor[i]);
        assetsList[i].color = sliceColor[i];
      } else {
        // console.log('random color')
        let c =
          "rgb(" +
          Math.floor(Math.random() * 256) +
          "," +
          Math.floor(Math.random() * 256) +
          "," +
          Math.floor(Math.random() * 256) +
          ")";
        color.push(c);
        assetsList[i].color = c;
      }
    }
    setAssetSliceColor(color);
  };
  change = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    if (slide !== active) {
      setActive(slide);
      setFlag(true);
    }
  };
  getBudgetChartData = (list, type) => {
    let d = [...list];
    console.log(list);
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
    if (type == "DB") {
      title = "Expense";
    } else {
      title = "Income";
    }
    let dataSource = {
      // chart: {
      //   baseFontColor: "#AAAAAA",
      //   plotSpacePercent: "76",
      //   baseFontSize: "8",
      //   // numberprefix: "₹",
      //   // bgColor: "#ffffff",
      //   scrollheight: hp("1%"),
      //   theme: "ocean",
      // },
      // categories: [
      //   {
      //     category: categoryLabel,
      //   },
      // ],
      // dataset: [
      //   {
      //     color: "#5E83F2",
      //     alpha: "20",
      //     data: barData,
      //   },
      //   {
      //     renderas: "line",
      //     color: "#5E83F2",
      //     alpha: "35",
      //     anchorBgColor: "#FFFFFF",
      //     dashed: "1",
      //     data: line1,
      //   },
      //   {
      //     renderas: "line",
      //     color: "#63CDD6",
      //     anchorBgColor: "#63CDD6",
      //     anchorBorderColor: "#63CDD6",
      //     data: line2,
      //   },
      // ],
      legend: {
        enabled: true,
        textSize: 10,
        form: "SQUARE",
        formSize: 10,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true,
      },
      // data: {
      //   // barData: {
      //   //   dataSets:
      //   //     [
      //   //       // {
      //   //       //     values: line2,
      //   //       //     label: "Budget",
      //   //       //     config: {
      //   //       //         drawValues: false,
      //   //       //         colors: [processColor("#63CDD6")],
      //   //       //     },
      //   //       // },
      //   //       {
      //   //         values: barData,
      //   //         label: title,
      //   //         config: {
      //   //           drawValues: false,
      //   //           colors: [processColor("blue")],
      //   //         },
      //   //       },


      //   //     ],
      //   //   // config: {
      //   //   //   barWidth: 0.2,
      //   //   //   group: {
      //   //   //     fromX: 0,
      //   //   //     groupSpace: 0.4,
      //   //   //     barSpace: 0.1,
      //   //   //   },
      //   //   // },
      //   // },
      //   // lineData: {
      //   //   dataSets:
      //   //     [
      //   //       {
      //   //         values: line2,
      //   //         label: "Budget",
      //   //         config: {
      //   //           drawValues: false,
      //   //           colors: [processColor("#63CDD6")],
      //   //         },
      //   //       },
      //   //       // {
      //   //       //     values: barData,
      //   //       //     label: title,
      //   //       //     config: {
      //   //       //         drawValues: false,
      //   //       //         colors: [processColor("blue")],
      //   //       //     },
      //   //       // },
      //   //       // ],

      //   //     ],
      //   //   // config: {
      //   //   //   barWidth: 0.2,
      //   //   //   group: {
      //   //   //     fromX: 0,
      //   //   //     groupSpace: 0.4,
      //   //   //     barSpace: 0.1,
      //   //   //   },
      //   //   // },
      //   // }
      //   dataSets: [
      //     {
      //       values: line2,
      //       label: "Budget",
      //       config: {
      //         drawValues: false,
      //         colors: [processColor("#63CDD6")],
      //       },
      //     },
      //     {
      //       values: barData,
      //       label: title,
      //       config: {
      //         drawValues: false,
      //         colors: [processColor("blue")],
      //       },
      //     },
      //   ],
      //   config: {
      //     barWidth: 0.2,
      //     group: {
      //       fromX: 0,
      //       groupSpace: 0.4,
      //       barSpace: 0.1,
      //     },
      //   },
      // },
      data: {

        dataSets: [
          {
            values: line2,
            label: "Budget",
            config: {
              drawValues: false,
              colors: [processColor("#63CDD6")],
            },
          },
          {
            values: barData,
            label: title,
            config: {
              drawValues: false,
              colors: [processColor("blue")],
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
    if (type == "DB") {
      setEpenseBudgetList(dataSource);
      setBudgetChart(dataSource);
    } else if (type == "CR") {
      setIncomeBudgetList(dataSource);
    }

    setFlag(true);
  };
  const libraryPath = Platform.select({
    // Specify fusioncharts.html file location
    android: { uri: "file:///android_asset/fusioncharts.html" },
    ios: require("./assets/fusioncharts.html"),
  });
  navigationTomemories = () => {
    if (memoriesData.transactionDate != null) {
      global.memoriesSelectedDate = Moment(memoriesData.transactionDate).format(
        "YYYY-MM-DD"
      );
      global.memoriesDate = memoriesData.transactionDate;
      navigation.navigate("memories");
    } else {
      navigation.navigate("memories");
    }
  };

  _renderItem = ({ item, index }) => {
    if (
      index <= global.predictionList.length - 1 &&
      global.predictionList.length != 0
    ) {
      // if (index == promotionData.length - 4 && global.predictionList.length > 5) {
      //     return (
      //         <TouchableOpacity onPress={() => { global.dashboardPredictionPage = true; global.predictionIndex = index; setFlag(true); }} style={{ width: wp('82.5%'), height: hp('27%'), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 15 }} >
      //             <Text style={{ color: '#555555' }}>{global.predictionList.length - 4} + more categories are present to confirm</Text>
      //         </TouchableOpacity>
      //     )
      // } else {
      return (
        <TouchableOpacity
          onPress={() => {
            global.dashboardPredictionPage = true;
            global.predictionIndex = index;
            setFlag(true);
          }}
          style={{
            width: wp("82.5%"),
            height: hp("27%"),
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#454F63",
              opacity: 0.7,
              fontSize: 12,
              textAlign: "center",
              paddingTop: -5,
            }}
          >
            Please confirm the categorization below
          </Text>

          <View style={{ flexDirection: "row", width: "100%" }}>
            <View style={{ width: wp("12%"), height: hp("8%") }}>
              {item.icon != null && item.icon != "" ? (
                <Image
                  style={{ maxWidth: "100%", height: "100%" }}
                  resizeMode={"contain"}
                  source={{
                    uri: global.baseURL + "customer/" + item.icon,
                  }}
                ></Image>
              ) : (
                  <Image
                    style={{ maxWidth: "100%", height: "100%" }}
                    resizeMode={"contain"}
                    source={require("./assets/uncategorized_Expense.png")}
                  ></Image>
                )}
            </View>
            <View style={{ paddingLeft: hp("2%"), justifyContent: "center" }}>
              {item.category != null && item.category != "" ? (
                <Text style={{ color: "#454F63", fontSize: 14 }}>
                  {item.category}
                </Text>
              ) : (
                  <Text style={{ color: "#454F63", fontSize: 14 }}>
                    Uncategorized
                  </Text>
                )}
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    color: "#F55485",
                    fontSize: 9,
                    marginRight: 3,
                    marginTop: 3,
                  }}
                >
                  {item.currency}
                </Text>
                <AmountDisplay
                  amount={Number(item.amount)}
                  currency={item.currency}
                />
                {/* <NumberFormat
                  value={item.amount}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: '#F55485',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {value}
                    </Text>
                  )}
                /> */}
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: hp("1%"),
              backgroundColor: "#F6F6F6",
              borderRadius: hp("1%"),
              width: "100%",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text style={{ color: "#454F63", fontSize: 14 }}>
                {item.bankName}
              </Text>
              {item.transactionTimestamp != null &&
                item.transactionTimestamp != "" &&
                item.accountNumber != null &&
                item.accountNumber != "" ? (
                  <Text style={{ color: "#454F63", fontSize: 11, opacity: 0.7 }}>
                    {item.accountNumber.replace(/.(?=.{4})/g, "x")} |{" "}
                    {Moment(
                      item.transactionTimestamp,
                      "YYYY-MM-DD,h:mm:ss"
                    ).format(global.dateFormat)}
                  </Text>
                ) : // <Text style={{ color: '#454F63', fontSize: 14, opacity: 0.7 }}>{item.category}</Text>
                null}
            </View>
            <View style={{ width: 50, height: 50, marginLeft: "auto" }}>
              <Image
                style={{ maxWidth: "100%", height: "100%" }}
                source={{ uri: item.bankIcon }}
              ></Image>
            </View>
          </View>
        </TouchableOpacity>
      );
      // }
    } else {
      return (
        <View>
          <View
            style={{
              margin: 2,
              paddingLeft: 3.8,
              paddingRight: 4.5,
              paddingTop: 3,
            }}
          >
            <TouchableOpacity
              style={{ width: wp("79.2%"), height: hp("26%") }}
              onPress={() => navigation.navigate("promotionsPage")}
            >
              <Image
                resizeMode={"stretch"}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 5,
                  padding: 10,
                  flex: 1,
                }}
                source={item.image}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  leftArrow = () => {
    console.log("left arrow");
    if (carouselIndex != 0) {
      carousel.snapToItem(carouselIndex - 1);
      // setCarouselIndex(carouselIndex - 1)
      setFlag(true);
    }
  };
  rightArrow = () => {
    console.log("right arrow");
    if (carouselIndex != promotionData.length - 1) {
      // carousel.snapToItem(carouselIndex - 1)
      setTimeout(() => carousel.snapToNext(), 50);
      // setCarouselIndex(carouselIndex - 1)
      setFlag(true);
    }
  };

  // budget combined graph
  const state = {
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
          values: [5, 40, 77, 81, 43],
          label: "Budget",
          config: {
            drawValues: false,
            colors: [processColor("#63CDD6")],
          },
        },
        {
          values: [40, 5, 50, 23, 79],
          label: "Expense",
          config: {
            drawValues: false,
            colors: [processColor("blue")],
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
      valueFormatter: ["1990", "1991", "1992", "1993", "1994"],
      granularityEnabled: true,
      granularity: 1,
      axisMaximum: 5,
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
  renderBar = () => {
    // return (
    //   <View>
    //     <BarChart
    //       style={styles.bar}
    //       xAxis={xAxisStyle}
    //       chartDescription={{ text: "" }}
    //       data={dataStyle}
    //       legend={legendStyle}
    //       drawValueAboveBar={true}
    //     />
    //   </View>
    // );
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      {(spinner == false && global.predictionStatus == true) ||
        global.dashboardPredictionPage == true ? (
          <View style={{ padding: 0, margin: 0 }}>
            <SuggestionPage />
          </View>
        ) : null}

      <View style={styles.header}>
        <Spinner
          visible={spinner}
          overlayColor="rgba(0, 0, 0, 0.65)"
          textContent={"Calculating your Finances..."}
          textStyle={styles.spinnerTextStyle}
        />
        <TouchableOpacity
          onPress={navigation.openDrawer}
          style={{ marginRight: "auto" }}
        >
          <Image source={require("./assets/icons-menu(dark).png")}></Image>
        </TouchableOpacity>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ textAlign: "center" }}>{heading}</Text>
          {/* <Text style={{ textAlign: 'center' }}>All Banks - MAY 2020</Text> */}
        </View>
        <TouchableOpacity
          onPress={() => dispatch(AppConfigActions.toggleRightDrawer())}
          style={{ marginLeft: "auto" }}
        >
          <Image
            style={{ marginLeft: "auto" }}
            source={require("./assets/icons-filter-dark(dark).png")}
          ></Image>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.containerHeading}>Dashboard</Text>
            {loader == true ? (
              <View
                style={{
                  marginLeft: "auto",
                  // marginTop: hp('1%'),
                  marginRight: hp("3%"),
                }}
              >
                <ActivityIndicator size="small" color="#333333" />
              </View>
            ) : null}
          </View>

          <View style={{ paddingLeft: 0 }}>
            <TouchableOpacity
              disabled={assetsList.length == 0}
              onPress={() => {
                // if (singleAccount) {
                //   navigation.navigate('singleAccountPage', {
                //     assets: assets,
                //     assetSeries: assetSeries,
                //     assetSliceColor: assetSliceColor,
                //     heading: heading,
                //   })
                // } else {
                navigation.navigate("accounts", {
                  assets: assets,
                  assetSeries: assetSeries,
                  assetSliceColor: assetSliceColor,
                  heading: heading,
                });
                // }
              }}
            >
              <Card containerStyle={styles.card}>
                {spinner == false && assetsList.length != 0 ? (
                  <Grid>
                    <Col style={{ paddingBottom: hp("0.5%") }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.cardTitle}>Total Assets </Text>
                        {pendingCnt != null && pendingCnt != 0 ? (
                          <View>
                            {pendingCnt == 1 ? (
                              <Text style={styles.cardTitle}>
                                ({pendingCnt} Pending consent)
                              </Text>
                            ) : (
                                <Text style={styles.cardTitle}>
                                  ({pendingCnt} Pending consents)
                                </Text>
                              )}
                          </View>
                        ) : null}
                      </View>
                    </Col>
                    <Col style={{ paddingBottom: hp("0.5%") }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          paddingBottom: 10,
                        }}
                      >
                        <Text
                          style={[
                            styles.cardTotalAmount,
                            {
                              fontSize: 11,
                              marginTop: "auto",
                              marginTop: 5,
                              marginRight: 3,
                            },
                          ]}
                        >
                          {customerPreferredCurrency}
                        </Text>
                        {/* {/* <NumberFormat
                          value={totalAssetAmt}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          renderText={(value) => (
                            <Text style={styles.cardTotalAmount}>{value}</Text>
                          )} 
                        /> */}
                        <AmountDisplay
                          style={styles.cardTotalAmount}
                          amount={Number(totalAssetAmt)}
                          currency={customerPreferredCurrency}
                        />
                      </View>
                    </Col>
                    <Row>
                      <Col
                        size={5}
                        style={{
                          marginTop: hp("-2%"),
                        }}
                      >
                        <View>
                          <PieChart
                            chart_wh={chart_wh}
                            series={assetSeries}
                            sliceColor={assetSliceColor}
                            doughnut={true}
                            coverRadius={0.55}
                            coverFill={"#FFF"}
                          />
                        </View>
                      </Col>
                      <Col size={7}>
                        {assetsList.length != 0 ? (
                          <FlatList
                            data={assetsList}
                            renderItem={({ item, index }) => (
                              <View>
                                {index < 3 ? (
                                  <Row style={{ marginBottom: -1 }}>
                                    <Col size={2}>
                                      <View
                                        style={{
                                          width: 10,
                                          height: 10,
                                          backgroundColor: item.color,
                                          marginTop: 10,
                                        }}
                                      ></View>
                                    </Col>
                                    <Col size={3}>
                                      <View
                                        style={{
                                          width: 33,
                                          height: 33,
                                          marginTop: hp("0.2%"),
                                        }}
                                      >
                                        <Image
                                          resizeMode={"contain"}
                                          style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                          }}
                                          source={{ uri: item.logo }}
                                        ></Image>
                                      </View>
                                    </Col>
                                    <Col size={7}>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "flex-end",
                                          paddingLeft: 12,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "#888888",
                                            fontSize: 8,
                                            marginTop: 4,
                                            marginRight: 3,
                                          }}
                                        >
                                          {customerPreferredCurrency}
                                        </Text>
                                        <AmountDisplay
                                          style={{
                                            color: "#888888",
                                            fontSize: 12,
                                            paddingBottom: 10,
                                            marginTop: 5,
                                          }}
                                          amount={Number(item.amount)}
                                          currency={customerPreferredCurrency}
                                        />
                                        {/* <NumberFormat
                                          value={Number(item.amount)}
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
                                                color: '#888888',
                                                fontSize: 12,
                                                paddingBottom: 10,
                                                marginTop: 5,
                                              }}>
                                              {value}
                                            </Text>
                                          )}
                                        /> */}
                                      </View>
                                    </Col>
                                  </Row>
                                ) : null}
                              </View>
                            )}
                          ></FlatList>
                        ) : (
                            <View>
                              <ActivityIndicator size="small" color="#00ff00" />
                            </View>
                          )}
                        {assetsList.length > 3 ? (
                          <Row style={{ paddingBottom: hp("0.5%") }}>
                            <Col>
                              <Text
                                style={{
                                  color: "#888888",
                                  fontSize: 12,
                                  textAlign: "right",
                                }}
                              >
                                + {assetsList.length - 3} more...
                              </Text>
                            </Col>
                          </Row>
                        ) : null}
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={styles.cardTitle}>Total Assets</Text>
                      ) : null}
                      {assetsList.length == 0 && spinner == false ? (
                        <View>
                          <Text style={styles.cardTitle}>Total Assets</Text>
                          <Text style={styles.emptyList}>
                            No Total Assets Available
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>
          {singleAccount == false ? (
            <View style={{ paddingLeft: 0 }}>
              <TouchableOpacity disabled={assetBalance.length == 0}>
                <Card containerStyle={styles.card}>
                  {spinner == false && assetBalance.length != 0 ? (
                    <Grid>
                      <Col style={{ paddingBottom: hp("0.5%") }}>
                        <Text style={styles.cardTitle}>Asset Balances</Text>
                      </Col>
                      <Row style={{ paddingTop: 5, marginTop: 5 }}>
                        <Col size={5}></Col>
                        <Col size={4}>
                          <View>
                            <Text style={{ color: "#AAAAAA", fontSize: 11 }}>
                              TYPE
                            </Text>
                          </View>
                        </Col>
                        <Col size={3}>
                          <View>
                            <Text
                              style={{
                                color: "#AAAAAA",
                                fontSize: 11,
                                textAlign: "right",
                                marginLeft: 5,
                              }}
                            >
                              BALANCE
                            </Text>
                          </View>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          size={5}
                          style={{
                            marginTop: hp("-1.5%"),
                          }}
                        >
                          <View>
                            <PieChart
                              chart_wh={chart_wh}
                              series={assetBalanceSeries}
                              sliceColor={assetBalanceSliceColor}
                              doughnut={true}
                              coverRadius={0.55}
                              coverFill={"#FFF"}
                            />
                          </View>
                        </Col>
                        <Col size={7}>
                          {assetBalance.length != 0 ? (
                            <FlatList
                              data={assetBalance}
                              style={{ height: hp("14%") }}
                              renderItem={({ item, index }) => (
                                <View>
                                  {index < 3 ? (
                                    <Row>
                                      <Col size={2}>
                                        <View
                                          style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: item.color,
                                            marginTop: 10,
                                          }}
                                        ></View>
                                      </Col>
                                      <Col size={4}>
                                        <View
                                          style={{
                                            width: 33,
                                            height: 33,
                                            // marginTop: hp('0.2%'),
                                          }}
                                        >
                                          <Image
                                            resizeMode={"contain"}
                                            style={{
                                              maxWidth: "100%",
                                              height: "100%",
                                            }}
                                            source={{ uri: item.icon }}
                                          ></Image>
                                        </View>
                                      </Col>
                                      {/* <Col size={5}>
                                          <Text
                                            numberOfLines={1}
                                            style={{
                                              width: '100%',
                                              color: '#888888',
                                              fontSize: 12,
                                              marginTop: 3,
                                            }}>
                                            {' '}
                                            {item.assetType}
                                          </Text>
                                        </Col> */}
                                      <Col size={6}>
                                        <View
                                          style={{
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              color: "#888888",
                                              fontSize: 8,
                                              marginTop: 6,
                                            }}
                                          >
                                            {item.userPreferedCurrency}
                                          </Text>
                                          <AmountDisplay
                                            style={{
                                              color: "#888888",
                                              fontSize: 12,
                                              textAlign: "right",
                                              marginTop: 5,
                                              marginLeft: 5,
                                            }}
                                            amount={Number(
                                              item.balanceInUserPreferredCurrency
                                            )}
                                            currency={item.userPreferedCurrency}
                                          />
                                          {/* <NumberFormat
                                          value={Number(
                                            item.balanceInUserPreferredCurrency,
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
                                          renderText={(value) => (
                                            <Text
                                              style={{
                                                color: '#888888',
                                                fontSize: 12,
                                                textAlign: 'right',
                                                marginTop: 5,
                                                marginLeft: 5,
                                              }}>
                                              {value}
                                            </Text>
                                          )}
                                        /> */}
                                        </View>
                                      </Col>
                                    </Row>
                                  ) : null}
                                </View>
                              )}
                            ></FlatList>
                          ) : (
                              <View>
                                <Text>No Asset Balances Available</Text>
                              </View>
                            )}
                          {assetBalance.length > 3 ? (
                            <Row style={{ paddingBottom: hp("0.5%") }}>
                              <Col>
                                <Text
                                  style={{
                                    color: "#888888",
                                    fontSize: 12,
                                    textAlign: "right",
                                  }}
                                >
                                  + {assetBalance.length - 3} more...
                                </Text>
                              </Col>
                            </Row>
                          ) : null}
                        </Col>
                      </Row>
                    </Grid>
                  ) : (
                      <View style={{ height: hp("20%") }}>
                        {spinner ? (
                          <Text style={styles.cardTitle}>Asset Balances</Text>
                        ) : null}
                        {assetBalance.length == 0 && spinner == false ? (
                          <View>
                            <Text style={styles.cardTitle}>Asset Balances</Text>

                            <Text style={styles.emptyList}>
                              No Asset Balances Available
                          </Text>
                          </View>
                        ) : null}
                      </View>
                    )}
                </Card>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={{ paddingLeft: 0 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("fincastPage")}
            >
              <Card containerStyle={styles.card}>
                {spinner == false ? (
                  <View>
                    <Text style={styles.cardTitle}>Free To Use</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styles.cardTotalAmount,
                          {
                            fontSize: 11,
                            marginTop: "auto",
                            marginTop: 5,
                            marginRight: 3,
                          },
                        ]}
                      >
                        {customerPreferredCurrency}
                      </Text>
                      <AmountDisplay
                        style={styles.cardTotalAmount}
                        amount={Number(freeToUseBalance)}
                        currency={customerPreferredCurrency}
                      />
                      {/* <NumberFormat
                        value={Number(freeToUseBalance)}
                        displayType={'text'}
                        thousandsGroupStyle={global.thousandsGroupStyle}
                        thousandSeparator={global.thousandSeparator}
                        decimalScale={global.decimalScale}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text style={styles.cardTotalAmount}>{value}</Text>
                        )}
                      /> */}
                    </View>
                    <Text
                      style={{
                        color: "#888888",
                        fontSize: 9,
                        textAlign: "center",
                        marginTop: hp("1%"),
                      }}
                    >
                      ( above amount is calculated based on your Transaction
                      patterns)
                    </Text>
                    <ProgressBar
                      progress={progressBarData}
                      width={null}
                      height={10}
                      style={{ marginTop: hp("1.5%") }}
                      borderRadius={35}
                      color={"#F2A413"}
                      borderColor={"transparent"}
                      unfilledColor={"#FDEDD4"}
                    />
                  </View>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={styles.cardTitle}>Free To Use</Text>
                      ) : null}
                      {/* {assetBalance.length == 0 && spinner == false ?
                                            <View >
                                                <Text style={styles.emptyList}>No Data Available</Text>
                                            </View>
                                            : null
                                        } */}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              disabled={memoriesData == null}
              onPress={() => navigationTomemories()}
            >
              <Card
                containerStyle={[
                  styles.card,
                  { padding: 0, paddingBottom: hp("2%") },
                ]}
              >
                {spinner == false && memoriesData != null ? (
                  <View>
                    {/* <View> */}
                    <View style={{ paddingBottom: hp('0.5%') }}>
                      <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                        {' '}
                        Memories
                      </Text>
                    </View>
                    <View style={styles.memoriesImgCard}>
                      {/* <Image
                                        resizeMode={'stretch'}
                                        style={{
                                            maxWidth: '100%',
                                            height: '100%',
                                            borderRadius: hp('1.5%'),
                                        }}
                                        source={require('../assets/memoriesPic.png')}></Image> */}
                      {
                        memoriesData.cityImages != undefined && memoriesData.cityImages != null && memoriesData.cityImages.length != 0
                          ?


                          <Image
                            resizeMode={'cover'}
                            style={{
                              maxWidth: '100%',
                              height: '100%',
                              borderTopLeftRadius: hp('3%'),
                            }}
                            source={{
                              uri:
                                global.baseURL +
                                'customer/' +
                                memoriesData.cityImages
                            }}
                          />



                          :
                          <>
                            {
                              memoriesData.longitude != null &&
                                memoriesData.longitude != "" &&
                                memoriesData.latitude != null &&
                                memoriesData.latitude != "" ?

                                <MapView
                                  pitchEnabled={false}
                                  scrollEnabled={false}
                                  rotateEnabled={false}
                                  zoomEnabled={false}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderBottomRightRadius: hp('4%'),
                                  }}
                                  region={{
                                    latitude: memoriesData.latitude,
                                    longitude: memoriesData.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                  }}>
                                  <Marker
                                    coordinate={{
                                      latitude: memoriesData.latitude,
                                      longitude: memoriesData.longitude,
                                    }}
                                  />
                                </MapView>
                                :
                                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                  <Text style={{ color: '#AAAAAA', marginTop: wp('10%') }}>No Location Available</Text>
                                </View>
                            }
                          </>
                      }
                    </View>
                    <Grid>
                      <Row>
                        <Col size={0.5}></Col>
                        <Col size={4.5} style={{ marginTop: wp('-20%') }}>
                          {memoriesData.transactionDate != null ? (
                            <Card containerStyle={styles.memoriesDateCard}>
                              <Text style={styles.memoriesMnt}>
                                {Moment(memoriesData.transactionDate).format(
                                  'MMM',
                                )}
                              </Text>
                              <Text style={styles.memoriesDay}>
                                {Moment(memoriesData.transactionDate).format(
                                  'DD',
                                )}
                              </Text>
                              <Text style={styles.memoriesYear}>
                                {Moment(memoriesData.transactionDate).format(
                                  'YYYY',
                                )}
                              </Text>
                            </Card>
                          ) : (
                              <View></View>
                            )}
                        </Col>
                        <Col size={1}></Col>

                        {memoriesData.logos != null &&
                          memoriesData.logos.length != 0 ? (
                            <FlatList
                              horizontal
                              style={{ top: wp('-6%') }}
                              data={memoriesData.logos}
                              renderItem={({ item, index }) => (
                                <>
                                  {index < 3 ? (
                                    <Col size={2}>
                                      <View
                                        style={{
                                          width: 38,
                                          height: 38,
                                          marginLeft: 10,
                                        }}>
                                        <Image
                                          style={{
                                            maxWidth: '100%',
                                            height: '100%',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            elevation: 5,
                                          }}
                                          source={{
                                            uri:
                                              global.baseURL + 'customer/' + item,
                                          }}></Image>
                                      </View>
                                    </Col>
                                  ) : null}
                                </>
                              )}
                            />
                          ) : null}
                      </Row>
                      <Row style={{ marginTop: hp('2%') }}>
                        <Col
                          size={6}
                          style={{
                            borderRightWidth: 1,
                            borderRightColor: '#cccccc',
                          }}>
                          <View>
                            <Text style={styles.memoriesLabel}>
                              Total Income
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingLeft: 15,
                                paddingRight: 12,
                              }}>
                              <Text
                                style={{
                                  fontSize: 11,
                                  marginTop: 'auto',
                                  marginTop: 5,
                                  marginRight: 3,
                                  color: '#02909C',
                                }}>
                                {memoriesData.userPreferredCurrency}
                              </Text>
                              {memoriesData.totalIncomeUserPreferred != null ? (
                                <AmountDisplay
                                  style={{ color: '#02909C', fontSize: 22 }}
                                  amount={Number(
                                    memoriesData.totalIncomeUserPreferred,
                                  )}
                                  currency={memoriesData.userPreferredCurrency}
                                />
                              ) : (
                                  // <NumberFormat
                                  //   value={Number(
                                  //     memoriesData.totalIncomeUserPreferred,
                                  //   )}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                  <AmountDisplay
                                    style={{ color: '#02909C', fontSize: 22 }}
                                    amount={Number(0)}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                  // <NumberFormat
                                  //   value={Number(0)}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                )}
                            </View>
                          </View>
                        </Col>
                        <Col size={6}>
                          <View>
                            <Text style={styles.memoriesLabel}>
                              Total Expense
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                paddingLeft: 15,
                                paddingRight: 12,
                              }}>
                              <Text
                                style={{
                                  fontSize: 11,
                                  marginTop: 'auto',
                                  marginTop: 5,
                                  marginRight: 3,
                                  color: '#F22973',
                                }}>
                                {memoriesData.userPreferredCurrency}
                              </Text>
                              {memoriesData.totalExpenseUserPreferred !=
                                null ? (
                                  <AmountDisplay
                                    style={{ color: '#F22973', fontSize: 22 }}
                                    amount={Number(
                                      memoriesData.totalExpenseUserPreferred,
                                    )}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                ) : (
                                  // <NumberFormat
                                  //   value={Number(
                                  //     memoriesData.totalExpenseUserPreferred,
                                  //   )}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#F22973', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                  <AmountDisplay
                                    style={{ color: '#F22973', fontSize: 22 }}
                                    amount={Number(0)}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                  // <NumberFormat
                                  //   value={Number(0)}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                )}
                            </View>
                          </View>
                        </Col>
                      </Row>
                    </Grid>
                    {/* </View> */}
                  </View>
                ) : (
                    <View style={{ height: hp('20%') }}>
                      {spinner ? (
                        <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                          Memories
                        </Text>
                      ) : null}
                      {memoriesData == null && spinner == false ? (
                        <View>
                          <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                            Memories
                        </Text>

                          <Text style={styles.emptyList}>
                            No Memories Available
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                {/* {spinner == false && memoriesData != null ? (
                  <View>
                    <View style={{ paddingBottom: hp("0.5%") }}>
                      <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                        {" "}
                        Memories
                      </Text>
                    </View>
                    <View style={styles.memoriesImgCard}>
                      <Image
                        resizeMode={"stretch"}
                        style={{
                          maxWidth: "100%",
                          height: "100%",
                          borderRadius: hp("1.5%"),
                        }}
                        source={require("./assets/memoriesPic.png")}
                      ></Image>
                    </View>
                    <Grid>
                      <Row>
                        <Col size={0.5}></Col>
                        <Col size={4.5} style={{ marginTop: wp("-20%") }}>
                          {memoriesData.transactionDate != null ? (
                            <Card containerStyle={styles.memoriesDateCard}>
                              <Text style={styles.memoriesMnt}>
                                {Moment(memoriesData.transactionDate).format(
                                  "MMM"
                                )}
                              </Text>
                              <Text style={styles.memoriesDay}>
                                {Moment(memoriesData.transactionDate).format(
                                  "DD"
                                )}
                              </Text>
                              <Text style={styles.memoriesYear}>
                                {Moment(memoriesData.transactionDate).format(
                                  "YYYY"
                                )}
                              </Text>
                            </Card>
                          ) : (
                              <View></View>
                            )}
                        </Col>
                        <Col size={1}></Col>

                        {memoriesData.logos != null &&
                          memoriesData.logos.length != 0 ? (
                            <FlatList
                              horizontal
                              style={{ top: wp("-6%") }}
                              data={memoriesData.logos}
                              renderItem={({ item, index }) => (
                                <>
                                  {index < 3 ? (
                                    <Col size={2}>
                                      <View
                                        style={{
                                          width: 38,
                                          height: 38,
                                          marginLeft: 10,
                                        }}
                                      >
                                        <Image
                                          style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 2,
                                            elevation: 5,
                                          }}
                                          source={{
                                            uri:
                                              global.baseURL + "customer/" + item,
                                          }}
                                        ></Image>
                                      </View>
                                    </Col>
                                  ) : null}
                                </>
                              )}
                            />
                          ) : null}
                      </Row>
                      <Row style={{ marginTop: hp("2%") }}>
                        <Col
                          size={6}
                          style={{
                            borderRightWidth: 1,
                            borderRightColor: "#cccccc",
                          }}
                        >
                          <View>
                            <Text style={styles.memoriesLabel}>
                              Total Income
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                paddingLeft: 15,
                                paddingRight: 12,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  marginTop: "auto",
                                  marginTop: 5,
                                  marginRight: 3,
                                  color: "#02909C",
                                }}
                              >
                                {memoriesData.userPreferredCurrency}
                              </Text>
                              {memoriesData.totalIncomeUserPreferred != null ? (
                                <AmountDisplay
                                  style={{ color: "#02909C", fontSize: 22 }}
                                  amount={Number(
                                    memoriesData.totalIncomeUserPreferred
                                  )}
                                  currency={memoriesData.userPreferredCurrency}
                                />
                              ) : (
                                  // <NumberFormat
                                  //   value={Number(
                                  //     memoriesData.totalIncomeUserPreferred,
                                  //   )}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                  <AmountDisplay
                                    style={{ color: "#02909C", fontSize: 22 }}
                                    amount={Number(0)}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                  // <NumberFormat
                                  //   value={Number(0)}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                )}
                            </View>
                          </View>
                        </Col>
                        <Col size={6}>
                          <View>
                            <Text style={styles.memoriesLabel}>
                              Total Expense
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                paddingLeft: 15,
                                paddingRight: 12,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 11,
                                  marginTop: "auto",
                                  marginTop: 5,
                                  marginRight: 3,
                                  color: "#F22973",
                                }}
                              >
                                {memoriesData.userPreferredCurrency}
                              </Text>
                              {memoriesData.totalExpenseUserPreferred !=
                                null ? (
                                  <AmountDisplay
                                    style={{ color: "#F22973", fontSize: 22 }}
                                    amount={Number(
                                      memoriesData.totalExpenseUserPreferred
                                    )}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                ) : (
                                  // <NumberFormat
                                  //   value={Number(
                                  //     memoriesData.totalExpenseUserPreferred,
                                  //   )}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#F22973', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                  <AmountDisplay
                                    style={{ color: "#F22973", fontSize: 22 }}
                                    amount={Number(0)}
                                    currency={memoriesData.userPreferredCurrency}
                                  />
                                  // <NumberFormat
                                  //   value={Number(0)}
                                  //   displayType={'text'}
                                  //   thousandsGroupStyle={
                                  //     global.thousandsGroupStyle
                                  //   }
                                  //   thousandSeparator={global.thousandSeparator}
                                  //   decimalScale={global.decimalScale}
                                  //   fixedDecimalScale={true}
                                  //   // prefix={'₹'}
                                  //   renderText={(value) => (
                                  //     <Text
                                  //       style={{color: '#02909C', fontSize: 22}}>
                                  //       {value}
                                  //     </Text>
                                  //   )}
                                  // />
                                )}
                            </View>
                          </View>
                        </Col>
                      </Row>
                    </Grid>
                  </View>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                          Memories
                        </Text>
                      ) : null}
                      {memoriesData == null && spinner == false ? (
                        <View>
                          <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                            Memories
                        </Text>

                          <Text style={styles.emptyList}>
                            No Memories Available
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )} */}
              </Card>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                if (goalsList == null) {
                  navigation.navigate("createAndEditGoals", { type: "create" });
                } else {
                  navigation.navigate("goalsPage");
                }
              }}
            >
              <Card
                containerStyle={[
                  styles.card,
                  { padding: 0, paddingBottom: hp("2%") },
                ]}
              >
                {spinner == false &&
                  goalsList != null &&
                  goalsList.length != 0 ? (
                    <Grid>
                      <Row>
                        <Col style={{ paddingBottom: hp("0.5%") }}>
                          <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                            Your Goals
                        </Text>
                        </Col>
                      </Row>
                      <FlatList
                        data={goalsList}
                        renderItem={({ item, index }) => (
                          <View>
                            {index < 3 ? (
                              <Grid>
                                <Row>
                                  <Col size={4}>
                                    <View
                                      style={{
                                        position: "relative",
                                        paddingLeft: hp("1%"),
                                      }}
                                    >
                                      {item.image != null ? (
                                        <Image
                                          resizeMode={"contain"}
                                          style={{
                                            maxWidth: "100%",
                                            height: "100%",
                                          }}
                                          source={{
                                            uri:
                                              global.baseURL +
                                              "customer/" +
                                              item.image,
                                          }}
                                        />
                                      ) : (
                                          <View></View>
                                        )}
                                    </View>
                                  </Col>
                                  <Col size={8}>
                                    <View>
                                      <View
                                        style={{
                                          marginTop: hp("2%"),
                                          paddingLeft: hp("2%"),
                                          paddingRight: hp("1%"),
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "#454F63",
                                            fontSize: 12,
                                            paddingBottom: hp("-2%"),
                                          }}
                                        >
                                          {item.goalName}{" "}
                                        </Text>
                                        {item.targetDate != null ? (
                                          <Text
                                            style={{
                                              color: "#454F63",
                                              fontSize: 11,
                                              paddingBottom: hp("-2%"),
                                              opacity: 0.7,
                                            }}
                                          >
                                            Target date :{" "}
                                            {Moment(item.targetDate).format(
                                              "Do MMM YYYY"
                                            )}
                                          </Text>
                                        ) : null}
                                        {item.savedAmount != null &&
                                          item.goalAmount != null ? (
                                            <>
                                              <Text
                                                style={{
                                                  color: "#454F63",
                                                  fontWeight: "bold",
                                                  fontSize: 14,
                                                }}
                                              >
                                                {Math.ceil(
                                                  (Number(item.savedAmount) /
                                                    Number(item.goalAmount).toFixed(
                                                      2
                                                    )) *
                                                  100
                                                )}
                                            %
                                          </Text>
                                              <ProgressBar
                                                progress={
                                                  Number(item.savedAmount) /
                                                  Number(item.goalAmount).toFixed(2)
                                                }
                                                width={null}
                                                color={
                                                  Number(
                                                    item.goalAmount -
                                                    item.savedAmount
                                                  ) == 0
                                                    ? "#63CDD6"
                                                    : Number(
                                                      item.savedAmount
                                                    ).toFixed(2) /
                                                      Number(
                                                        item.goalAmount
                                                      ).toFixed(2) >=
                                                      0 &&
                                                      Number(
                                                        item.savedAmount
                                                      ).toFixed(2) /
                                                      Number(
                                                        item.goalAmount
                                                      ).toFixed(2) <
                                                      0.5
                                                      ? "#F55485"
                                                      : "#F2A413"
                                                }
                                                borderColor={"transparent"}
                                                unfilledColor={
                                                  Number(
                                                    item.goalAmount -
                                                    item.savedAmount
                                                  ) == 0
                                                    ? "#63CDD6"
                                                    : Number(
                                                      item.savedAmount
                                                    ).toFixed(2) /
                                                      Number(
                                                        item.goalAmount
                                                      ).toFixed(2) >=
                                                      0 &&
                                                      Number(
                                                        item.savedAmount
                                                      ).toFixed(2) /
                                                      Number(
                                                        item.goalAmount
                                                      ).toFixed(2) <
                                                      0.5
                                                      ? "#FCD6E2"
                                                      : "#FDEDD4"
                                                }
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <Text
                                                style={{
                                                  color: "#454F63",
                                                  fontWeight: "bold",
                                                  fontSize: 14,
                                                }}
                                              >
                                                {0}%
                                          </Text>
                                              <ProgressBar
                                                progress={0}
                                                width={null}
                                                color={"#63CDD6"}
                                                borderColor={"transparent"}
                                                unfilledColor={"#FCD6E2"}
                                              />
                                            </>
                                          )}
                                      </View>
                                    </View>
                                  </Col>
                                </Row>
                              </Grid>
                            ) : null}
                          </View>
                        )}
                      ></FlatList>
                      {goalsList.length != undefined && goalsList.length > 3 ? (
                        <Row>
                          <Col>
                            <Text
                              style={{
                                color: "#888888",
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: "right",
                                marginRight: 8,
                              }}
                            >
                              + {goalsList.length - 3} more...
                          </Text>
                          </Col>
                        </Row>
                      ) : null}
                    </Grid>
                  ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                          Your Goals
                        </Text>
                      ) : null}
                      {goalsList == null && spinner == false ? (
                        <View>
                          <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                            Your Goals
                        </Text>
                          <Text style={styles.emptyList}>
                            <Text>No Goals Available.</Text>
                            <Text
                              style={{ color: "#5e83f2", fontWeight: "bold" }}
                            >
                              {" "}
                            Click here
                          </Text>
                            <Text> to add one</Text>
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>

          <View>
            {carouselIndex != 0 ? (
              <TouchableOpacity
                onPress={() => leftArrow()}
                style={[
                  styles.backBtn,
                  { position: "absolute", top: "50%", left: -5 },
                ]}
              >
                <View style={{ width: 20, height: 20 }}>
                  <Image
                    resizeMode={"cover"}
                    style={{ maxWidth: "100%", height: "100%" }}
                    source={require("./assets/left-angle-icon.png")}
                  ></Image>
                </View>
              </TouchableOpacity>
            ) : null}
            <Card containerStyle={[styles.promotionCard, { zIndex: 1 }]}>
              <Carousel
                ref={(c) => (carousel = c)}
                data={promotionData}
                renderItem={_renderItem}
                sliderWidth={wp("100%")}
                itemWidth={wp("100%")} // containerCustomStyle={styles.carouselContainer}
                // inactiveSlideShift={0}
                layout={"default"}
                // onScroll={change}
                // layout={'tinder'} layoutCardOffset={'5'}
                onSnapToItem={(index) => setCarouselIndex(index)}
                // scrollInterpolator={scrollInterpolator}
                // slideInterpolatedStyle={animatedStyles}
                useScrollView={true}
              />
            </Card>
            {carouselIndex != promotionData.length - 1 ? (
              <TouchableOpacity
                onPress={() => rightArrow()}
                style={[
                  styles.backBtn,
                  { position: "absolute", top: "50%", right: -5 },
                ]}
              >
                <View style={{ width: 20, height: 20 }}>
                  <Image
                    resizeMode={"cover"}
                    style={{ maxWidth: "100%", height: "100%" }}
                    source={require("./assets/right-angle-arrow-png.png")}
                  ></Image>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <View>
            <Card containerStyle={[styles.card, { padding: 0 }]}>
              {spinner == false &&
                (expenseBudgetGraph != null || incomeBudgetGraph != null) ? (
                  <View>
                    <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                      Budget vs Expenses
                  </Text>
                    <View style={{ zIndex: 100, marginLeft: hp("1%") }}>
                      <Row
                        style={{
                          marginLeft: hp("1%"),
                          marginRight: hp("2%"),
                          marginTop: hp("1%"),
                        }}
                      >
                        <Col
                          size={4}
                          style={
                            activeTab == "DB" ? styles.activeTab : styles.tab
                          }
                        >
                          <TouchableOpacity
                            style={{ zIndex: 10 }}
                            onPress={() => {
                              selectedTab("DB");
                            }}
                          >
                            <Text
                              style={{ color: "#AAAAAA", textAlign: "center" }}
                            >
                              Expense
                          </Text>
                          </TouchableOpacity>
                        </Col>
                        <Col
                          size={4}
                          style={
                            activeTab == "CR" ? styles.activeTab : styles.tab
                          }
                        >
                          <TouchableOpacity
                            style={{ zIndex: 10 }}
                            onPress={() => {
                              selectedTab("CR");
                            }}
                          >
                            <Text
                              style={{ color: "#AAAAAA", textAlign: "center" }}
                            >
                              Income
                          </Text>
                          </TouchableOpacity>
                        </Col>
                        <Col size={4}></Col>
                        <Col size={4}></Col>
                      </Row>
                    </View>
                    {/* <BarChart
                    style={styles.bar}
                    xAxis={budgetChart.xAxis}
                    data={budgetChart.data}
                    legend={budgetChart.legend}
                    drawValueAboveBar={false}
                    onChange={(event) => console.log(event.nativeEvent)}
                    marker={budgetChart.marker}
                  /> */}
                    {/* {renderBar()} */}
                    <TouchableOpacity
                      onPress={() => navigation.navigate("budgetPage")}
                    >
                      <View style={styles.chartContainer}>
                        {budgetChart != undefined ? (

                          // <BarChart
                          //   style={styles.bar}
                          //   xAxis={budgetChart.xAxis}
                          //   data={budgetChart.data}
                          //   legend={budgetChart.legend}
                          //   drawValueAboveBar={false}
                          //   onChange={(event) => console.log(event.nativeEvent)}
                          //   marker={budgetChart.marker}
                          // // visibleRange={{ x: { min: 3, max: 5 } }}
                          // />
                          <BarChart
                            style={styles.bar}
                            xAxis={budgetChart.xAxis}
                            data={budgetChart.data}
                            legend={budgetChart.legend}
                            drawValueAboveBar={false}
                            onChange={(event) => console.log(event.nativeEvent)}
                            marker={budgetChart.marker}
                            visibleRange={{ x: { min: 3, max: 5 } }}
                          />
                          // <CombinedChart
                          //   drawOrder={['BAR', 'LINE']}
                          //   style={styles.bar}
                          //   xAxis={budgetChart.xAxis}
                          //   data={budgetChart.data}
                          //   legend={budgetChart.legend}
                          //   drawValueAboveBar={false}
                          //   onChange={(event) => console.log(event.nativeEvent)}
                          //   marker={budgetChart.marker}
                          // />
                        ) : (
                            <View
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                height: "100%",
                              }}
                            >
                              {spinner == false && noBudgetChartData == true ? (
                                <Text style={{ color: "#AAAAAA" }}>
                                  No data to display
                                </Text>
                              ) : null}
                            </View>
                          )}
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ height: hp("20%") }}>
                    {spinner ? (
                      <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                        Budget vs Expenses
                      </Text>
                    ) : null}
                    {expenseBudgetGraph == null &&
                      incomeBudgetGraph == null &&
                      spinner == false ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("budgetCreatePage", { type: "DB" })
                          }
                        >
                          <View>
                            <Text style={[styles.cardTitle, { padding: hp("2%") }]}>
                              Budget vs Expenses
                        </Text>

                            <Text style={styles.emptyListBudget}>
                              <Text>
                                Create a Budget and manage your finances
                                effectively.
                          </Text>
                              <Text
                                style={{ color: "#5e83f2", fontWeight: "bold" }}
                              >
                                Click here
                          </Text>
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                  </View>
                )}
            </Card>
          </View>

          <View>
            <TouchableOpacity
              disabled={expenseList.length == 0}
              onPress={() => navigation.navigate("mainExpensePage")}
            >
              <Card containerStyle={styles.card}>
                {spinner == false && expenseList.length != 0 ? (
                  <Grid>
                    <Col style={{ paddingBottom: hp("0.5%") }}>
                      <Text style={styles.cardTitle}>Your Expenses</Text>
                    </Col>
                    <Col style={{ paddingBottom: hp("1%") }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            styles.cardTotalAmount,
                            {
                              fontSize: 11,
                              marginTop: "auto",
                              marginTop: 5,
                              marginRight: 3,
                            },
                          ]}
                        >
                          {customerPreferredCurrency}
                        </Text>
                        <AmountDisplay
                          style={styles.cardTotalAmount}
                          amount={Number(totalExpenseAmt)}
                          currency={customerPreferredCurrency}
                        />
                        {/* <NumberFormat
                          value={Number(totalExpenseAmt)}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          // prefix={'₹'}
                          renderText={(value) => (
                            <Text style={styles.cardTotalAmount}>{value}</Text>
                          )}
                        /> */}
                        {/* <Text style={[styles.cardTotalAmount, { fontSize: 11, marginTop: 'auto', marginBottom: 5, marginLeft: 3 }]}>{customerPreferredCurrency}</Text> */}
                      </View>
                      <Row style={{ paddingTop: 5 }}>
                        <Col size={5}></Col>
                        <Col size={4}>
                          <View>
                            <Text style={{ color: "#AAAAAA", fontSize: 11 }}>
                              CATEGORIES
                            </Text>
                          </View>
                        </Col>
                        <Col size={3}>
                          <View>
                            <Text
                              style={{
                                color: "#AAAAAA",
                                fontSize: 11,
                                textAlign: "right",
                                marginLeft: 5,
                              }}
                            >
                              AMOUNT
                            </Text>
                          </View>
                        </Col>
                      </Row>
                    </Col>
                    <Row>
                      <Col size={5} style={{ marginTop: hp("-2.5%") }}>
                        <View>
                          <PieChart
                            chart_wh={chart_wh}
                            series={expensesChartSeries}
                            sliceColor={expensesChartSliceColor}
                            doughnut={true}
                            coverRadius={0.55}
                            coverFill={"#FFF"}
                          />
                        </View>
                      </Col>
                      <Col size={7}>
                        {expenseList.length != 0 ? (
                          <FlatList
                            data={expenseList}
                            style={{ height: 120 }}
                            renderItem={({ item, index }) => (
                              <View>
                                {index < 5 ? (
                                  <Row>
                                    <Col size={1}>
                                      <View
                                        style={{
                                          width: 10,
                                          height: 10,
                                          backgroundColor: item.color,
                                          marginTop: 6,
                                        }}
                                      ></View>
                                    </Col>
                                    <Col size={5}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          width: "100%",
                                          color: "#888888",
                                          fontSize: 12,
                                          marginTop: 3,
                                        }}
                                      >
                                        {" "}
                                        {item.categoryName}
                                      </Text>
                                    </Col>
                                    <Col size={6}>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "flex-end",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "#888888",
                                            fontSize: 8,
                                            marginTop: 6,
                                          }}
                                        >
                                          {item.userPreferedCurrency}
                                        </Text>
                                        <AmountDisplay
                                          style={{
                                            color: "#888888",
                                            fontSize: 12,
                                            marginTop: 5,
                                            marginLeft: 3,
                                          }}
                                          amount={Number(item.amount)}
                                          currency={item.userPreferedCurrency}
                                        />
                                        {/* <NumberFormat
                                          value={Number(item.amount)}
                                          displayType={'text'}
                                          thousandsGroupStyle={
                                            global.thousandsGroupStyle
                                          }
                                          thousandSeparator={
                                            global.thousandSeparator
                                          }
                                          decimalScale={global.decimalScale}
                                          fixedDecimalScale={true}
                                          renderText={(value) => (
                                            <Text
                                              style={{
                                                color: '#888888',
                                                fontSize: 12,
                                                marginTop: 5,
                                                marginLeft: 3,
                                              }}>
                                              {value}
                                            </Text>
                                          )}
                                        /> */}
                                        {/* <Text style={{ color: '#888888', fontSize: 8, marginTop: 10 }}>{item.userPreferedCurrency}</Text> */}
                                      </View>
                                    </Col>
                                  </Row>
                                ) : null}
                              </View>
                            )}
                          ></FlatList>
                        ) : (
                            <View>
                              <Text>No Expenses Available</Text>
                            </View>
                          )}

                        {expenseList.length > 5 ? (
                          <Row style={{ paddingBottom: hp("0.5%") }}>
                            <Col>
                              <Text
                                style={{
                                  color: "#888888",
                                  fontSize: 12,
                                  marginTop: 5,
                                  textAlign: "right",
                                }}
                              >
                                + {expenseList.length - 5} more...
                              </Text>
                            </Col>
                          </Row>
                        ) : null}
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={styles.cardTitle}>Your Expenses</Text>
                      ) : null}
                      {expenseList.length == 0 && spinner == false ? (
                        <View>
                          <Text style={styles.cardTitle}>Your Expenses</Text>

                          <Text style={styles.emptyList}>
                            No Expenses Available
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              disabled={incomeList.length == 0}
              onPress={() => navigation.navigate("mainIncomePage")}
            >
              <Card containerStyle={styles.card}>
                {spinner == false && incomeList.length != 0 ? (
                  <Grid>
                    <Col style={{ paddingBottom: hp("0.5%") }}>
                      <Text style={styles.cardTitle}>Your Income</Text>
                    </Col>
                    <Col style={{ paddingBottom: hp("1%") }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={[
                            styles.cardTotalAmount,
                            {
                              fontSize: 11,
                              marginTop: "auto",
                              marginTop: 4,
                              marginRight: 3,
                            },
                          ]}
                        >
                          {customerPreferredCurrency}
                        </Text>
                        <AmountDisplay
                          style={styles.cardTotalAmount}
                          amount={Number(totalIncomeAmt)}
                          currency={customerPreferredCurrency}
                        />
                        {/* <NumberFormat
                          value={Number(totalIncomeAmt)}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          // prefix={'₹'}
                          renderText={(value) => (
                            <Text style={styles.cardTotalAmount}>{value}</Text>
                          )}
                        /> */}
                        {/* <Text style={[styles.cardTotalAmount, { fontSize: 11, marginTop: 'auto', marginBottom: 5, marginLeft: 3 }]}>{customerPreferredCurrency}</Text> */}
                      </View>
                      <Row style={{ paddingTop: 5 }}>
                        <Col size={5}></Col>
                        <Col size={4}>
                          <View>
                            <Text style={{ color: "#AAAAAA", fontSize: 11 }}>
                              CATEGORIES
                            </Text>
                          </View>
                        </Col>
                        <Col size={3}>
                          <View>
                            <Text
                              style={{
                                color: "#AAAAAA",
                                fontSize: 11,
                                textAlign: "right",
                                marginLeft: 5,
                              }}
                            >
                              AMOUNT
                            </Text>
                          </View>
                        </Col>
                      </Row>
                    </Col>
                    <Row>
                      <Col size={5} style={{ marginTop: hp("-2.5%") }}>
                        <View>
                          <PieChart
                            chart_wh={chart_wh}
                            series={incomeChartSeries}
                            sliceColor={incomeChartSliceColor}
                            doughnut={true}
                            coverRadius={0.55}
                            coverFill={"#FFF"}
                          />
                        </View>
                      </Col>
                      <Col size={7}>
                        {incomeList.length != 0 ? (
                          <FlatList
                            data={incomeList}
                            style={{ height: 120 }}
                            renderItem={({ item, index }) => (
                              <View>
                                {index < 5 ? (
                                  <Row>
                                    <Col size={1}>
                                      <View
                                        style={{
                                          width: 10,
                                          height: 10,
                                          backgroundColor: item.color,
                                          marginTop: 6,
                                        }}
                                      ></View>
                                    </Col>
                                    <Col size={5}>
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          width: "100%",
                                          color: "#888888",
                                          fontSize: 12,
                                          marginTop: 3,
                                        }}
                                      >
                                        {" "}
                                        {item.categoryName}
                                      </Text>
                                    </Col>
                                    <Col size={6}>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "flex-end",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            color: "#888888",
                                            fontSize: 8,
                                            marginTop: 6,
                                          }}
                                        >
                                          {item.userPreferedCurrency}
                                        </Text>
                                        <AmountDisplay
                                          style={{
                                            color: "#888888",
                                            fontSize: 12,
                                            textAlign: "right",
                                            marginTop: 5,
                                            marginLeft: 5,
                                          }}
                                          amount={Number(item.amount)}
                                          currency={item.userPreferedCurrency}
                                        />
                                        {/* <NumberFormat
                                          value={Number(item.amount)}
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
                                                color: '#888888',
                                                fontSize: 12,
                                                textAlign: 'right',
                                                marginTop: 5,
                                                marginLeft: 5,
                                              }}>
                                              {value}
                                            </Text>
                                          )}
                                        /> */}
                                        {/* <Text style={{ color: '#888888', fontSize: 8, marginTop: 10 }}>{item.userPreferedCurrency}</Text> */}
                                      </View>
                                    </Col>
                                  </Row>
                                ) : null}
                              </View>
                            )}
                          ></FlatList>
                        ) : (
                            <View></View>
                          )}
                        {incomeList.length > 5 ? (
                          <Row>
                            <Col>
                              <Text
                                style={{
                                  color: "#888888",
                                  fontSize: 12,
                                  marginTop: 5,
                                  textAlign: "right",
                                }}
                              >
                                + {incomeList.length - 5} more...
                              </Text>
                            </Col>
                          </Row>
                        ) : null}
                      </Col>
                    </Row>
                  </Grid>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={styles.cardTitle}>Your Incomes</Text>
                      ) : null}
                      {incomeList.length == 0 && spinner == false ? (
                        <View>
                          <Text style={styles.cardTitle}>Your Incomes</Text>

                          <Text style={styles.emptyList}>
                            No Incomes Available
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              disabled={uncategoziedList == null}
              onPress={() => navigation.navigate("uncategorizedTransaction")}
            >
              <Card containerStyle={styles.card}>
                {spinner == false && uncategoziedList != null ? (
                  <Grid>
                    <Row>
                      <Col style={{ paddingBottom: hp("0.5%") }}>
                        <Text style={styles.cardTitle}>
                          Uncategorized Transactions
                        </Text>
                      </Col>
                    </Row>
                    <FlatList
                      data={uncategoziedList}
                      renderItem={({ item, index }) => (
                        <View>
                          {index < 3 ? (
                            <Row style={{ paddingTop: hp("2.5%") }}>
                              <Col
                                size={1.5}
                                style={{
                                  alignItems: "center",
                                  marginTop: hp("1%"),
                                  marginRight: 2,
                                }}
                              >
                                <View style={{ width: 30, height: 30 }}>
                                  <Image
                                    resizeMode={"contain"}
                                    style={{ maxWidth: "100%", height: "100%" }}
                                    source={{
                                      uri:
                                        global.baseURL +
                                        "customer/" +
                                        item.icon,
                                    }}
                                  ></Image>
                                </View>
                              </Col>
                              <Col size={5.5}>
                                <Text
                                  style={{ color: "#888888", fontSize: 12 }}
                                >
                                  {item.description}
                                </Text>
                                <Text
                                  style={{ color: "#888888", fontSize: 12 }}
                                >
                                  {item.category} |{" "}
                                  {Moment(
                                    item.transactionTimestamp,
                                    "YYYY-MM-DD,h:mm:ss"
                                  ).format(global.dateFormat)}
                                </Text>
                              </Col>
                              <Col
                                size={4}
                                style={{
                                  alignItems: "flex-end",
                                  paddingRight: 10,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <View>
                                    {/* {
                                                                                item.transactionCurrency == 'INR'
                                                                                    ?
                                                                                    <Text style={{ color: '#888888', fontSize: 10, marginTop: 1, marginRight: 3 }}>₹</Text>

                                                                                    : */}
                                    <Text
                                      style={{
                                        color: "#888888",
                                        fontSize: 8,
                                        marginTop: 1,
                                        marginRight: 3,
                                      }}
                                    >
                                      {item.transactionCurrency}
                                    </Text>

                                    {/* } */}
                                  </View>
                                  <AmountDisplay
                                    style={{
                                      color: "#888888",
                                      fontSize: 12,
                                    }}
                                    amount={Number(item.amount)}
                                    currency={item.transactionCurrency}
                                  />
                                  {/* <NumberFormat
                                    value={Number(item.amount)}
                                    // value={Number(item.userPreferredCurrencyAmount)}
                                    displayType={'text'}
                                    thousandsGroupStyle={
                                      global.thousandsGroupStyle
                                    }
                                    thousandSeparator={global.thousandSeparator}
                                    decimalScale={global.decimalScale}
                                    fixedDecimalScale={true}
                                    // prefix={'₹'}
                                    renderText={(value) => (
                                      <Text
                                        style={{
                                          color: '#888888',
                                          fontSize: 12,
                                        }}>
                                        {value}
                                      </Text>
                                    )}
                                  /> */}
                                </View>
                              </Col>
                              <Col size={1}>
                                <View
                                  style={{
                                    backgroundColor: "white",
                                    height: hp("4.5%"),
                                    borderTopLeftRadius: 20,
                                    borderBottomLeftRadius: 20,
                                  }}
                                >
                                  <Image
                                    resizeMode={"contain"}
                                    style={{ maxWidth: "100%", height: "100%" }}
                                    source={{ uri: item.bankIcon }}
                                  ></Image>
                                </View>
                              </Col>
                            </Row>
                          ) : null}
                        </View>
                      )}
                    ></FlatList>
                    {uncategoziedList.length != undefined &&
                      uncategoziedList.length > 3 ? (
                        <Row>
                          <Col>
                            <Text
                              style={{
                                color: "#888888",
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: "right",
                              }}
                            >
                              + {uncategoziedList.length - 3} more...
                          </Text>
                          </Col>
                        </Row>
                      ) : null}
                  </Grid>
                ) : (
                    <View style={{ height: hp("20%") }}>
                      {spinner ? (
                        <Text style={styles.cardTitle}>
                          Your Uncategorized Transaction
                        </Text>
                      ) : null}
                      {uncategoziedList == null && spinner == false ? (
                        <View>
                          <Text style={styles.cardTitle}>
                            Your Uncategorized Transaction
                        </Text>
                          <Text style={styles.emptyList}>
                            You are all caught up!!
                        </Text>
                          <Text
                            style={{
                              marginLeft: "auto",
                              marginRight: "auto",
                              color: "#AAAAAA",
                            }}
                          >
                            Nothing to categorise now!!
                        </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  header: {
    padding: hp("3.5%"),
    paddingLeft: hp("3%"),
    paddingRight: hp("3%"),
    flexDirection: "row",
    paddingBottom: hp("3%"),
  },
  chart: {
    flex: 1,
  },
  container: {
    paddingLeft: hp("2.5%"),
    paddingRight: hp("2.5%"),
    fontFamily: "Roboto",
    marginBottom: hp("15%"),
  },
  containerHeading: {
    paddingLeft: 10,
    fontSize: 25,
    color: "#454F63",
    fontWeight: "bold",
  },
  card: {
    padding: hp("1.7%"),
    elevation: 1.5,
    shadowOffset: { width: 0, height: hp("0.1%") },
    shadowColor: "#00000029",
    shadowOpacity: 1,
    borderRadius: 5,
  },
  promotionCard: {
    elevation: 1.5,
    padding: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#00000029",
    shadowOpacity: 1,
    borderRadius: 5,
  },
  cardTitle: {
    color: "#454F63",
    fontSize: 14,
    fontFamily: "Roboto",
  },
  cardTotalAmount: {
    textAlign: "right",
    color: "#454F63",
    fontSize: 24,
  },
  spinnerTextStyle: {
    color: "white",
    fontSize: 15,
  },
  emptyList: {
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: hp("15%") / 2.5,
    color: "#AAAAAA",
  },
  emptyListBudget: {
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    paddingTop: hp("15%") / 3.5,
    color: "#AAAAAA",
  },
  pagination: {
    color: "#5E83F2",
    margin: 3,
    opacity: 0.3,
  },
  activePagination: {
    color: "gray",
    margin: 3,
  },
  completedBudget: {
    padding: hp("1.5%"),
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#DBF3F5",
  },
  processingBudget: {
    padding: hp("1.5%"),
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "white",
  },
  closedBudgte: {
    padding: hp("1.5%"),
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FDEDD4",
  },
  chartContainer: {
    height: wp("40%"),
    marginBottom: wp('5%')
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#AAAAAA",
    paddingBottom: 12,
    zIndex: 60,
  },
  backBtn: {
    // paddingTop: hp("1%")
    // position: 'absolute',
    zIndex: 100,
    elevation: 5,
    backgroundColor: "#EEEEEE",
    padding: 10,
  },
  tab: {
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    paddingBottom: 12,
    zIndex: 60,
  },
  memoriesYear: {
    paddingTop: 0,
    padding: 5,
    backgroundColor: "white",
    color: "#454F63",
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
  },
  memoriesDay: {
    padding: 5,
    backgroundColor: "white",
    color: "#454F63",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  memoriesMnt: {
    padding: 5,
    backgroundColor: "#F22973",
    color: "white",
    textAlign: "center",
  },
  memoriesDateCard: {
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  memoriesImgCard: {
    width: "90%",
    height: wp("40%"),
    alignSelf: "center",
  },
  memoriesLabel: {
    textAlign: "center",
    color: "#454F63",
    opacity: 0.5,
    fontSize: 12,
  },
  overlay: {
    opacity: 0.5,
    // height: '100%',
    // backgroundColor: '#cccccc'
    position: "absolute",
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0
  },
  view: {
    justifyContent: "flex-end",
    // margin: 50,
    marginTop: wp("35%"),
    marginBottom: wp("35%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: hp('40%'),
    marginLeft: wp("8%"),
    marginRight: wp("8%"),
    borderRadius: hp("2%"),
  },

  // bar graph
  error: {
    color: "#F22973",
    paddingBottom: hp("3%"),
  },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  bar: {
    marginTop: 10,
    // height: Dimensions.get("window").height / 2.5,
    width: wp("80%"),
    height: '100%',
    marginBottom: 10
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});

{
  /* <FlatList
data={promotionData}
horizontal
pagingEnabled
onScroll={change}
snapToAlignment='center'
decelerationRate={'fast'}
scrollEventThrottle={16}
showsHorizontalScrollIndicator={false}
renderItem={({ item, index }) =>
    <View>
        {
            index <= promotionData.length - 4 && global.predictionList.length != 0
                ?
                <>
                    {
                        index == promotionData.length - 4 && global.predictionList.length > 5
                            ?
                            <TouchableOpacity onPress={() => { global.dashboardPredictionPage = true; global.predictionIndex = index; setFlag(true); }} style={{ width: wp('82.5%'), height: hp('27%'), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 15 }} >
                                <Text style={{ color: '#555555' }}>{global.predictionList.length - 4} + more categories are present to confirm</Text>
                            </TouchableOpacity>

                            :

                            <TouchableOpacity onPress={() => { global.dashboardPredictionPage = true; global.predictionIndex = index; setFlag(true); }} style={{ width: wp('82.5%'), height: hp('27%'), borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: 15 }} >
                                <Text style={{ color: '#454F63', opacity: 0.7, fontSize: 12, textAlign: 'center', paddingTop: -5 }}>Please confirm the categorization below</Text>

                                <View style={{ flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: wp('12%'), height: hp('8%') }}>
                                        {
                                            item.icon != null && item.icon != ''
                                                ?

                                                <Image style={{ maxWidth: '100%', height: "100%" }} resizeMode={'contain'} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
                                                :
                                                <Image style={{ maxWidth: '100%', height: "100%" }} resizeMode={'contain'} source={require('./assets/uncategorized_Expense.png')}></Image>

                                        }
                                    </View>
                                    <View style={{ paddingLeft: hp('2%'), justifyContent: 'center' }}>
                                        {
                                            item.category != null && item.category != '' ?

                                                <Text style={{ color: '#454F63', fontSize: 14 }}>{item.category}</Text>
                                                :
                                                <Text style={{ color: '#454F63', fontSize: 14 }}>Uncategorized</Text>
                                        }
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <NumberFormat
                                                value={item.amount}
                                                displayType={'text'}
                                                thousandsGroupStyle={global.thousandsGroupStyle}
                                                thousandSeparator={global.thousandSeparator}
                                                decimalScale={global.decimalScale}
                                                fixedDecimalScale={true}
                                                // prefix={'₹'}
                                                renderText={value => <Text style={{ color: '#F55485', fontSize: 20, fontWeight: 'bold' }}>{value}</Text>}
                                            />
                                        </View>
                                    </View>

                                </View >

                                <View style={{ flexDirection: 'row', padding: hp('1%'), backgroundColor: '#F6F6F6', borderRadius: hp('1%'), width: '100%' }}>

                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ color: '#454F63', fontSize: 14 }}>{item.bankName}</Text>
                                        {
                                            item.transactionTimestamp != null && item.transactionTimestamp != '' && item.accountNumber != null && item.accountNumber != ''
                                                ?

                                                <Text style={{ color: '#454F63', fontSize: 11, opacity: 0.7 }}>{item.accountNumber.replace(/.(?=.{4})/g, 'x')}  | {Moment(item.transactionTimestamp, 'YYYY-MM-DD,h:mm:ss').format(global.dateFormat)}</Text>
                                                :
                                                // <Text style={{ color: '#454F63', fontSize: 14, opacity: 0.7 }}>{item.category}</Text>
                                                null

                                        }
                                    </View>
                                    <View style={{ width: 50, height: 50, marginLeft: 'auto' }}>

                                        <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: item.bankIcon }}></Image>
                                    </View>
                                </View >
                            </TouchableOpacity>
                    }
                </>
                :
                <>
                   
                    <View>
                       
                        <View style={{ margin: 2, paddingLeft: 3.8, paddingRight: 4.5, paddingTop: 3 }}>
                            <TouchableOpacity style={{ width: wp('79.2%'), height: hp('26%') }} onPress={() => navigation.navigate("promotionsPage")}>
                                <Image
                                    resizeMode={'stretch'}
                                    style={{ width: '100%', height: '100%', borderRadius: 5, padding: 10, flex: 1 }}
                                    source={item.image}
                                ></Image>

                            </TouchableOpacity>

                        </View>
                    
                    </View>

                   
                </>
        }
    </View>
}></FlatList>
<View style={{ flexDirection: "row", alignSelf: 'center', position: 'absolute', bottom: 0 }}>
{promotionData.map((i, k) => (
    <Text style={k === active ? styles.activePagination : styles.pagination}>⬤</Text>
))
}
</View> */
}
