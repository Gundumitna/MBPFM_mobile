import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Upshot from 'react-native-upshotsdk';
import {useDispatch, useSelector} from 'react-redux';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
const BudgetCreatePage = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [spinner, setSpinner] = useState(false);
  let ls = require('react-native-local-storage');
  const [slitList, setSlitList] = useState([]);
  const [status, setStatus] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [budgetType, setBudgetType] = useState();
  const [count, setCount] = useState(0);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [baseCurrency, setBaseCurrency] = useState();
  const currencyMaster = useSelector((state) => state.currencyMaster);

  useEffect(() => {
    Upshot.addListener('UpshotActivityDidAppear', handleActivityDidAppear);

    Upshot.addListener('UpshotActivityDidDismiss', handleActivityDidDismiss);

    Upshot.addListener('UpshotDeepLink', handleDeeplink);

    const unsubscribe = navigation.addListener('focus', () => {
      setSlitList([]);
      setTotalAmount(0);
      ls.save('budgetType', route.params.type);
      setActiveTab('month');
      getBudgetList('month');
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    return () => {
      setStatus(false);
    };
  }, [status]);

  getBudgetList = (tab) => {
    setSpinner(true);
    console.log(route.params.type);
    console.log('basecurrency: ' + route.params.currency);

    setBaseCurrency(route.params.currency);
    setSlitList([]);
    ls.get('filterData').then((filterData) => {
      if (tab == 'month') {
        fetch(
          global.baseURL +
            'customer/get/template/monthly/' +
            global.loginID +
            '/' +
            filterData.month.id +
            '/' +
            filterData.year.year +
            '/' +
            route.params.type,
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.data);
            if (responseJson.data != null) {
              setNotransaction(false);
              //  else {
              //     console.log('TotalAmount is null')
              //     setTotalAmount(0)
              // }
              let totalAmt = 0;
              setBudgetType(responseJson.data.type);
              let li = [];
              if (
                responseJson.data.categoryList != null &&
                responseJson.data.categoryList.length != 0
              ) {
                for (let data of responseJson.data.categoryList) {
                  let list = {};
                  list.icon = data.categoryIcon;
                  if (data.amount != null && data.amount != 0) {
                    list.amount = data.amount.toFixed(global.decimalScale);
                    totalAmt = totalAmt + data.amount;
                  } else {
                    list.amount = '';
                  }
                  list.category = data.categoryName;
                  list.categoryId = data.categoryId;

                  li.push(list);
                }
                // if (responseJson.data.amount != null) {
                //     console.log('TotalAmount is not null')
                //     setTotalAmount(responseJson.data.amount)
                // } else {
                setTotalAmount(totalAmt);
                // }
                setSlitList(li);
              } else {
                setSlitList([]);
                setNotransaction(true);
                setTotalAmount(0);
              }
              console.log(slitList);
            } else {
              setNotransaction(true);
              setSlitList([]);
              setTotalAmount(0);
            }
            setSpinner(false);
          })
          .catch((error) => {
            setSpinner(false);
            console.error(error);
          });
      } else if (tab == 'year') {
        fetch(
          global.baseURL +
            'customer/get/template/yearly/' +
            global.loginID +
            '/' +
            filterData.year.year +
            '/' +
            route.params.type,
        )
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.data);
            if (responseJson.data != null) {
              setNotransaction(false);
              //  else {
              //     console.log('TotalAmount is null')
              //     setTotalAmount(0)
              // }
              let totalAmt = 0;
              if (responseJson.data.type != null) {
                setBudgetType(responseJson.data.type);
              }
              let li = [];
              if (
                responseJson.data.categoryList != null &&
                responseJson.data.categoryList.length != 0
              ) {
                for (let data of responseJson.data.categoryList) {
                  let list = {};
                  list.icon = data.categoryIcon;
                  if (data.amount != null && data.amount != 0) {
                    list.amount = data.amount.toFixed(global.decimalScale);
                    totalAmt = totalAmt + data.amount;
                  } else {
                    list.amount = '';
                  }
                  list.category = data.categoryName;
                  list.categoryId = data.categoryId;

                  li.push(list);
                }
                if (responseJson.data.amount != null) {
                  console.log('TotalAmount is not null');
                  setTotalAmount(responseJson.data.amount);
                } else {
                  setTotalAmount(totalAmt);
                }
                setSlitList(li);
                console.log(slitList);
              } else {
                setSlitList([]);
                setNotransaction(true);
                setTotalAmount(0);
              }
              setSpinner(false);
            } else {
              setNotransaction(true);
              setSlitList([]);
              setTotalAmount(0);
              setSpinner(false);
            }
          })
          .catch((error) => {
            setSpinner(false);
            console.error(error);
          });
      }
    });
  };
  const handleActivityDidAppear = (response) => {
    console.log('activity did appear');
    console.log(response);
  };

  const handleActivityDidDismiss = (response) => {
    console.log('activity dismiss');
    //if activity==7
    if (response.activityType == 7) {
      Upshot.showActivityWithType(-1, 'Home Survey');
    }
    console.log(response);
  };
  const handleDeeplink = (response) => {
    console.log('deeplink ' + JSON.stringify(response));
    console.log(response);
    if (response.deepLink == 'BADGE') {
      navigation.navigate('myBadges');
      console.log('deeplink to badge found');
    } else if (response.deepLink == 'BUDGET') {
      navigation.navigate('budgetPage');
      console.log('deeplink to budget found');
    } else if (response.deepLink == 'GOAL') {
      console.log('deeplink to goal found');
      navigation.navigate('goalsPage');
    }
  };
  saveMonthlyBudget = () => {
    setDisableSaveBtn(true);
    setSpinner(true);
    // let postData = {}
    console.log('***************** month *********************');

    ls.get('filterData').then((filterData) => {
      // postData.categoryList = slitList
      // console.log(JSON.stringify(postData))
      let data = [];
      for (let sli of slitList) {
        if (sli.amount != 0 && sli.amount != '') {
          data.push(sli);
        }
      }
      console.log(JSON.stringify(data));
      fetch(
        global.baseURL +
          'customer/save/budget/monthly/' +
          global.loginID +
          '/' +
          filterData.month.id +
          '/' +
          filterData.year.year +
          '/' +
          budgetType +
          '/' +
          route.params.type,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          setDisableSaveBtn(false);
          const payload = {};

          Upshot.createCustomEvent(
            'SetBudget',
            JSON.stringify(payload),
            false,
            function (eventId) {
              console.log('Event all SetBudget' + eventId);
            },
          );
          navigation.navigate('budgetPage');
        })
        .catch((error) => {
          setSpinner(false);
          setDisableSaveBtn(false);
          console.error(error);
        });
    });
  };
  saveYearlyBudget = () => {
    setDisableSaveBtn(true);
    setSpinner(true);
    // let postData = {}
    ls.get('filterData').then((filterData) => {
      // postData.categoryList = slitList
      // console.log(JSON.stringify(postData))
      let data = [];
      for (let sli of slitList) {
        if (sli.amount != 0 && sli.amount != '') {
          data.push(sli);
        }
      }
      console.log('*****************year*********************');
      console.log(JSON.stringify(data));

      fetch(
        global.baseURL +
          'customer/save/budget/yearly/' +
          global.loginID +
          '/' +
          filterData.year.year +
          '/' +
          route.params.type,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          setDisableSaveBtn(false);
          const payload = {};

          Upshot.createCustomEvent(
            'SetBudget',
            JSON.stringify(payload),
            false,
            function (eventId) {
              console.log('Event all SetBudget' + eventId);
            },
          );
          navigation.navigate('budgetPage');
        })
        .catch((error) => {
          setSpinner(false);
          setDisableSaveBtn(false);
          console.error(error);
        });
    });
  };
  textEntered = (value, item) => {
    let ta = 0;
    let list = [...slitList];
    for (let s of list) {
      if (s.categoryId == item.categoryId) {
        item.amount = value.nativeEvent.text;
      }
      ta = ta + Number(s.amount);
    }
    setSlitList(list);
    setTotalAmount(ta);
    console.log(slitList);
    setStatus(true);
  };
  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    getBudgetList(tab);
    // if (tab == 'month') {
    //     // setEpenseBudgetList(dataSource)
    //     setBudgetChart(epenseBudgetList)
    // } else if (tab == 'year') {
    //     setBudgetChart(incomeBudgetList)
    // }
    // setFlag(true)
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({android: 'height', ios: 'padding'})}
      style={styles.container}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{height: wp('55%')}}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('budgetPage')}>
            <View>
              <Image source={require('./assets/icons-back.png')}></Image>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Manage Budget</Text>
          </View>
        </View>
        <View style={{zIndex: 100, marginLeft: hp('1%'), flexDirection: 'row'}}>
          {/* <Row style={{ marginLeft: hp('1%'), marginRight: hp('2%'), marginTop: hp('1%') }}>
                        <Col size={4} style={activeTab == 'month' ? styles.activeTab : styles.tab} > */}

          <TouchableOpacity
            style={activeTab == 'month' ? styles.activeTab : styles.tab}
            onPress={() => {
              selectedTab('month');
            }}>
            <Text
              style={{
                color: '#454F63',
                textAlign: 'center',
                fontWeight: activeTab == 'month' ? 'bold' : 'normal',
                opacity: activeTab == 'month' ? 1 : 0.7,
              }}>
              MONTHLY
            </Text>
          </TouchableOpacity>
          {/* </Col>
                        <Col size={4} style={activeTab == 'year' ? styles.activeTab : styles.tab}> */}
          <TouchableOpacity
            style={activeTab == 'year' ? styles.activeTab : styles.tab}
            onPress={() => {
              selectedTab('year');
            }}>
            <Text
              style={{
                color: '#454F63',
                textAlign: 'center',
                fontWeight: activeTab == 'year' ? 'bold' : 'normal',
                opacity: activeTab == 'year' ? 1 : 0.7,
              }}>
              YEARLY
            </Text>
          </TouchableOpacity>
          {/* </Col>
                        <Col size={4} ></Col>
                        <Col size={4} ></Col> */}
          {/* </Row> */}
        </View>
        <View style={{padding: hp('3%')}}>
          {activeTab == 'month' ? (
            <Text
              style={{
                color: '#888888',
                fontSize: wp('2.4%'),
                paddingBottom: 10,
              }}>
              Provide Monthly Budget value for your expenses
            </Text>
          ) : (
            <Text
              style={{
                color: '#888888',
                fontSize: wp('2.4%'),
                paddingBottom: 10,
              }}>
              Provide Yearly Budget value for your expenses
            </Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              paddingTop: hp('2.2%'),
              paddingRight: hp('1%'),
              paddingLeft: hp('1%'),
              zIndex: 5,
            }}>
            <View>
              <Text style={{color: '#5E83F2', fontSize: 10, height: hp('2%')}}>
                Your calculated
              </Text>
              {activeTab == 'month' ? (
                <Text
                  style={{
                    color: '#5E83F2',
                    fontSize: 16,
                    height: 100,
                    fontWeight: 'bold',
                  }}>
                  Monthly Budget
                </Text>
              ) : (
                <Text
                  style={{
                    color: '#5E83F2',
                    fontSize: 16,
                    height: 100,
                    fontWeight: 'bold',
                  }}>
                  Yearly Budget
                </Text>
              )}
            </View>
            <View style={{marginLeft: 'auto', alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: '#5E83F2',
                    fontSize: 10,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    // marginTop: 3,
                    marginRight: 3,
                    height: 10,
                  }}>
                  {baseCurrency}
                </Text>
                <NumberFormat
                  value={Number(totalAmount)}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  // decimalScale={global.decimalScale}
                  prefix={baseCurrency}
                  fixedDecimalScale={true}
                  decimalScale={
                    currencyMaster.currency[baseCurrency] != undefined
                      ? currencyMaster.currency[baseCurrency].decimalFormat
                      : 0
                  }
                  renderText={(value) => (
                    <Text style={{fontSize: 22, color: '#5E83F2', height: 100}}>
                      {value}
                    </Text>
                  )}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#DFE4FB',
              padding: wp('9%'),
              position: 'absolute',
              width: '100%',
              top: wp('8.5%'),
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: hp('2%'),
              borderRadius: hp('1%'),
            }}></View>
        </View>
      </View>
      {/* <View > */}
      <ScrollView>
        {notransaction == false ? (
          <FlatList
            style={{flexGrow: 1, paddingLeft: hp('2%'), paddingRight: hp('2%')}}
            data={slitList}
            renderItem={({item, index}) => (
              <Row style={{paddingBottom: 10}}>
                <Col size={5.5}>
                  <TouchableOpacity>
                    <Row
                      style={{
                        borderWidth: 0,
                        backgroundColor: '#AAAAAA',
                        borderRadius: 25,
                        padding: 5,
                      }}>
                      <Col size={2.5}>
                        {/* {item.bgColor == "#AAAAAA" ? */}
                        {/* <View>
                                                            <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={item.icon}></Image>
                                                        </View>
                                                        : */}
                        <View>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={{
                              uri: global.baseURL + 'customer/' + item.icon,
                            }}></Image>
                        </View>
                        {/* } */}
                      </Col>
                      <Col size={9.5}>
                        <Text style={{color: 'white', marginTop: -1}}>
                          {item.category}
                        </Text>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                </Col>
                <Col size={1}></Col>
                <Col size={5}>
                  <TextInput
                    placeholder="0.00"
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#cccc',
                      textAlign: 'right',
                      paddingBottom: hp('-0.5%'),
                      marginTop: hp('-0.2%'),
                      height: 25,
                      color: 'black',
                    }}
                    keyboardType="numeric"
                    onChange={(a) => textEntered(a, item)}
                    value={item.amount.toString()}></TextInput>
                </Col>

                {/* <Col size={1.5}>
                                        {item.categoryId != 0 ?
                                            <TouchableOpacity onPress={() => removeItem(index, item, slitList)} style={{ width: 25, height: 25 }}>
                                                <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/Remove_icon.png")}></Image>
                                            </TouchableOpacity>
                                            : null}
                                    </Col> */}
              </Row>
            )}></FlatList>
        ) : (
          <View>
            <Text>No data found</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {activeTab == 'month' ? (
          <TouchableOpacity
            disabled={disableSaveBtn == true}
            onPress={() => saveMonthlyBudget()}>
            <Text style={styles.footerBotton}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={disableSaveBtn == true}
            onPress={() => saveYearlyBudget()}>
            <Text style={styles.footerBotton}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default BudgetCreatePage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp('2%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('8%'),
    width: wp('100%'),
    backgroundColor: 'white',
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    paddingTop: hp('0.5%'),
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 25,
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  footer: {
    paddingLeft: hp('2.5%'),
    paddingTop: hp('2.5%'),
    paddingRight: hp('5%'),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerBotton: {
    padding: hp('1.7%'),
    fontSize: hp('2.4%'),
    fontFamily: 'Roboto',
    textAlign: 'center',
    backgroundColor: '#5E83F2',
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
    color: 'white',
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#F2A413',
    paddingBottom: 12,
    zIndex: 60,
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
    marginTop: hp('1%'),
  },
  tab: {
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    // paddingBottom: 12,
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
    zIndex: 60,
    marginTop: hp('1%'),
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
