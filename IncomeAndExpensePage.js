import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import {useIsDrawerOpen} from '@react-navigation/drawer';
function IncomeAndExpensePage({route, navigation}) {
  const dispatch = useDispatch();
  let ls = require('react-native-local-storage');
  const [loader, setLoader] = useState(false);
  const [heading, setHeading] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [list, setList] = useState([]);
  const [notransaction, setNotransaction] = useState(false);
  const [typeIcon, setTypeIcon] = useState('');
  const [original, setOriginal] = useState([]);
  const [directTo, setDirectTo] = useState();
  const [originalList, setOriginalList] = useState([]);
  const [title, setTitle] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const isDrawerOpen = useIsDrawerOpen();
  const {rightDrawerState} = useSelector((state) => state.appConfig);
  useEffect(() => {
    console.log('Expense Page');
    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      // getDashboardData()
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);
        getNoSpinnerData();
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);
  useEffect(() => {
    console.log('rendered');
    // return (() => {
    //     setFlag(false)
    // })
  }, [notransaction]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params.type);
      console.log(route.params.totalAmount);
      setNotransaction(false);
      if (route.params.listType == 'all') {
        setTotalAmt(route.params.totalAmount);
        if (route.params.type == 'expense') {
          setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==');
          setTitle('All Expense');
        } else if (route.params.type == 'income') {
          setTypeIcon('QWxsX2NhdGVnb3JpZXNfaWNvbi5wbmc=');
          setTitle('All Income');
        }
      }
      if (route.params.type == 'expense') {
        setDirectTo('mainExpensePage');
      } else if (route.params.type == 'income') {
        setDirectTo('mainIncomePage');
      }
      getDisplayData();
    });
    return unsubscribe;
  }, [navigation]);

  getNoSpinnerData = () => {
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

      let type = '';
      if (route.params.type == 'expense') {
        type = 'E';
      } else if (route.params.type == 'income') {
        type = 'I';
      }
      fetch(
        global.baseURL +
          'customer/get/transaction/all/' +
          type +
          '/' +
          global.loginID,
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
          console.log(responseJson.data.responseList);
          setOriginalList(responseJson.data.responseList);
          if (route.params.listType == 'all') {
            setList(responseJson.data.responseList);
            setTotalAmt(responseJson.data.total);
          } else {
            let d = [];
            let a = 0;
            let c = 0;
            for (let li of responseJson.data.responseList) {
              if (route.params.listType == li.categoryId) {
                c = c + 1;
                d.push(li);
                a = a + li.amount;
                if (c == 1) {
                  setTypeIcon(li.icon);
                  setTitle(li.category);
                }
              }
            }
            setTotalAmt(a);
            setList(d);
          }

          if (responseJson.data == null) {
            setNotransaction(true);
          }
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    });
  };
  getDisplayData = () => {
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

      let type = '';
      if (route.params.type == 'expense') {
        type = 'E';
      } else if (route.params.type == 'income') {
        type = 'I';
      }
      fetch(
        global.baseURL +
          'customer/get/transaction/all/' +
          type +
          '/' +
          global.loginID,
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
          console.log(responseJson.data.responseList);
          setOriginalList(responseJson.data.responseList);
          if (route.params.listType == 'all') {
            setList(responseJson.data.responseList);
            setTotalAmt(responseJson.data.total);
          } else {
            let d = [];
            let a = 0;
            let c = 0;
            for (let li of responseJson.data.responseList) {
              if (route.params.listType == li.categoryId) {
                c = c + 1;
                d.push(li);
                a = a + li.amount;
                if (c == 1) {
                  setTypeIcon(li.icon);
                  setTitle(li.category);
                }
              }
            }
            setTotalAmt(a);
            setList(d);
          }

          if (responseJson.data == null) {
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
  // getStatementList = (linkedAccountId, item) => {
  //     setSpinner(true)
  //     console.log(linkedAccountId);
  //     let postData = {}
  //     ls.get('filterData').then((filterData) => {

  //         postData.linkedAccountId = linkedAccountId
  //         postData.month = filterData.month.id
  //         postData.year = filterData.year.year
  //         console.log(JSON.stringify(postData))

  //         fetch(global.baseURL+'customer/child/row', {

  //             method: 'POST',
  //             headers: {
  //                 Accept: 'application/json',
  //                 'Content-Type': 'application/json',
  //             },
  //             body:
  //                 JSON.stringify(postData)
  //         }).then((response) => response.json())
  //             .then((responseJson) => {
  //                 setOriginal(responseJson.data)
  //                 let listData = [...responseJson.data]

  //                 if (item.parentId != null) {
  //                     let Data = []
  //                     let parentData = {}
  //                     for (let li of listData) {
  //                         if (li.type == 'P') {
  //                             if (item.parentId == li.transactionId) {
  //                                 parentData = li
  //                             }
  //                         }
  //                         if (li.type == 'C') {
  //                             if (item.parentId == li.parentId) {
  //                                 Data.push(li)
  //                             }
  //                         }
  //                     }
  //                     console.log({ statementData: parentData, reDirectTo: directTo, splitList: Data })
  //                     navigation.navigate('transactionPage', { statementData: parentData, reDirectTo: directTo, splitList: Data, selectedItem: item })
  //                     setSpinner(false)
  //                 } else {
  //                     console.log({ statementData: item, reDirectTo: 'incomeExpensePage' })
  //                     navigation.navigate('transactionPage', { statementData: item, reDirectTo: directTo, selectedItem: item })
  //                     setSpinner(false)
  //                 }
  //                 setSpinner(false)
  //             })
  //             .catch((error) => {

  //                 console.error(error);
  //                 setSpinner(false)
  //             })
  //     })
  // }
  selectedData = (item) => {
    setSpinner(true);
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      // fetch(global.baseURL+'customer/get/transaction/details/' + item.transactionId)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({statementData: item, reDirectTo: 'incomeExpensePage'});
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: directTo,
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
            reDirectTo: directTo,
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: directTo,
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
    // getStatementList(item.linkedAccountId, item)
    // let listData = [...original]

    // if (item.parentId != null) {
    //     let Data = []
    //     let parentData = {}
    //     for (let li of listData) {
    //         if (li.type == 'P') {
    //             if (item.parentId == li.transactionId) {
    //                 parentData = li
    //             }
    //         }
    //         if (li.type == 'C') {
    //             if (item.parentId == li.parentId) {
    //                 Data.push(li)
    //             }
    //         }
    //     }
    //     console.log({ statementData: parentData, reDirectTo: 'incomeExpensePage', splitList: Data })
    //     navigation.navigate('transactionPage', { statementData: parentData, reDirectTo: 'incomeExpensePage', splitList: Data })
    //     setSpinner(false)
    // } else {
    //     console.log({ statementData: item, reDirectTo: 'incomeExpensePage' })
    //     navigation.navigate('transactionPage', { statementData: item, reDirectTo: 'incomeExpensePage' })
    //     setSpinner(false)
    // }
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
          bottom: 10,
          right: 10,
          zIndex: 10,
        }}
        // onPress={() => navigation.navigate('aggregator')}
      >
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <View style={{backgroundColor: 'white'}}>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg_white.png')}></Image>
        </View>
        <View style={styles.container}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              onPress={navigation.openDrawer}
              style={{marginRight: 'auto'}}>
              <Image source={require('./assets/icons-menu(dark).png')}></Image>
            </TouchableOpacity>
            <View style={{justifyContent: 'center', alignSelf: 'center'}}>
              <Text style={{textAlign: 'center'}}>{heading}</Text>
            </View>
            <TouchableOpacity
              onPress={() => dispatch(AppConfigActions.toggleRightDrawer())}
              style={{marginLeft: 'auto'}}>
              <Image
                style={{marginLeft: 'auto'}}
                source={require('./assets/icons-filter-dark(dark).png')}></Image>
            </TouchableOpacity>
            {/* <Row>
                            <Col size={2}>
                                <TouchableOpacity
                                // onPress={() => navigation.navigate("menu")}
                                >
                                    <Image source={require("./assets/icons-menu(dark).png")}></Image>
                                </TouchableOpacity>
                            </Col>
                            <Col size={8}>
                                <Text style={{ textAlign: 'center' }}>All Banks - APRIL 2020</Text>
                            </Col>
                            <Col size={2}>
                                <View >
                                    <Image style={{ marginLeft: 'auto' }} source={require("./assets/icons-filter-dark(dark).png")}></Image>
                                </View>
                            </Col>
                        </Row> */}
          </View>

          <View>
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
                <Col size={9}>
                  <View style={{paddingTop: hp('1%')}}>
                    {/* {route.params.type == 'expense' ?
                                            <Text style={{ color: '#5E83F2' }}>All Expense</Text> : */}
                    <Text style={{color: '#5E83F2'}}>{title}</Text>

                    {/* } */}
                  </View>
                </Col>
                <Col size={1}>
                  {loader == true ? (
                    <View
                      style={{
                        marginLeft: 'auto',
                        marginTop: hp('1%'),
                        marginRight: hp('3%'),
                      }}>
                      <ActivityIndicator size="small" color="#5E83F2" />
                    </View>
                  ) : null}
                </Col>
              </Row>
              <Col style={{marginLeft: 'auto'}}>
                {route.params.type == 'expense' ? (
                  <Text style={{color: '#5E83F2', textAlign: 'right'}}>
                    Total Expense
                  </Text>
                ) : (
                  <Text style={{color: '#5E83F2', textAlign: 'right'}}>
                    Total Income
                  </Text>
                )}
                <NumberFormat
                  value={Number(totalAmt)}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  prefix={'₹'}
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
                />
              </Col>
            </Grid>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#5E83F2',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: hp('100%'),
          paddingTop: 10,
          flex: 1,
        }}>
        <View style={styles.line}></View>
        <ScrollView>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => selectedData(item)}>
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
                          {route.params.listType != 'all' &&
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
                        <NumberFormat
                          value={Number(item.amount)}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          prefix={'₹'}
                          renderText={(value) => (
                            <Text style={{color: 'white', fontSize: 18}}>
                              {value}
                            </Text>
                          )}
                        />
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
        </ScrollView>
      </View>
    </View>
  );
}

export default IncomeAndExpensePage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('3.5%'),
    width: wp('100%'),
    flex: 5,
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    // paddingTop: hp("2%"),
    // padding: hp("2.5%"),

    zIndex: 10,
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
    marginTop: hp('1%'),
  },
  transRow: {
    padding: hp('2%'),
    paddingRight: 0,
    paddingBottom: hp('0.5%'),
  },
  transRowNE: {
    padding: hp('2%'),
    paddingBottom: hp('0.5%'),
    opacity: 0.5,
  },
});
