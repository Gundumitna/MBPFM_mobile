import React, {useState, useEffect} from 'react';
// import { PanGestureHandler } from 'react-native-gesture-handler';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  View,
  Image,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  ImageBackground,
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
import {Card} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import AmountDisplay from './AmountDisplay';

function AccountStatementPage({route, navigation}) {
  let ls = require('react-native-local-storage');
  let linkedIdNo = require('react-native-local-storage');
  const [status, setStatus] = useState(false);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [linkedAccountIdNo, setLinkedAccountIdNo] = useState();
  const [spinner, setSpinner] = useState(false);
  const [category, setCategory] = useState([]);
  const [stmtList, setStmtList] = useState([]);
  const [dataToSend, setDataToSend] = useState('');
  const [filterStatus, setFilterStatus] = useState(false);
  const [notransaction, setNotransaction] = useState(false);

  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const pan = useState(new Animated.ValueXY({x: 0, y: wp('72%')}))[0];
  const [scrollOffset, setScrollOffset] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('AccountStatementPage');
      console.log(route.params);
      ls.get('linkedAccountId').then((data) => {
        // console.log(data)
        setLinkedAccountIdNo(data);
      });
      console.log(linkedAccountIdNo);
      if (categoryFlag == true) {
        console.log('route.params.page : ' + route.params.page);
      }
      getTransactionData();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    console.log('rendered');
    return () => {
      setStatus(false);
    };
  }, [status == true]);
  const data = {};
  getTransactionData = () => {
    // setSpinner(true)
    data.fiLogo = route.params.fiLogo;
    data.fiName = route.params.fiName;

    ls.get('linkedAccountId').then((data) => {
      console.log(data);
      // setLinkedAccountIdNo(data)
      data.assetDataLinkedAccountId = data;
    });
    // data.assetDataLinkedAccountId = linkedAccountIdNo;
    data.assetAmount = route.params.assetData.assetDetails[22].value;
    data.accountNo = route.params.assetData.assetDetails[3].value;
    data.accountType = route.params.assetData.assetDetails[1].value;
    getCategories();
    if (
      categoryFlag == true &&
      route.params.categoryId != null &&
      route.params.categoryId != '' &&
      route.params.categoryId != 0
    ) {
      let item = {};
      (item.categoryIcon = route.params.categoryIcon),
        (item.categoryId = route.params.categoryId);
      item.categoryName = route.params.category;

      item.type = route.params.categorType;
      setCategoryFlag(false);
      filterData(item);
    } else {
      getStatementList();
    }
    setDataToSend(data);
    console.log(dataToSend);
    // setSpinner(false)
  };
  getStatementList = () => {
    setSpinner(true);
    setFilterStatus(false);
    let postData = {};
    setStmtList([]);
    // setDisplyList([])
    ls.get('linkedAccountId').then((data) => {
      console.log(data);
      // setLinkedAccountIdNo(data)
      postData.linkedAccountId = data;
    });
    ls.get('filterData').then((filterData) => {
      // postData.linkedAccountId = linkedAccountIdNo
      postData.month = filterData.month.id;
      postData.year = filterData.year.year;
      console.log(JSON.stringify(postData));
      // fetch(global.baseURL+'customer/child/row', {
      fetch(global.baseURL + 'customer/child/row', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson.data)
          setStmtList(responseJson.data);
          // setDisplyList(responseJson.data)
          console.log(stmtList);
          setSpinner(false);
          setStatus(true);
          // .catch((error) => {
          //     console.error(error);
          // })
        })
        .catch((error) => {
          console.error(error);
          setSpinner(false);
        });
    });
  };
  clickedCategoryFilter = () => {
    setCategoryFlag(true);
    navigation.navigate('categoriesPage', {
      reNavigateTo: 'accountStatementPage',
      reDirectTo: 'accountStatementPage',
    });
  };
  dataSelected = (item) => {
    setSpinner(true);
    // fetch(global.baseURL+'customer/get/transaction/details/' + item.transactionId)
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({statementData: item, reDirectTo: 'accountSubStmtPage'});
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: 'accountStatementPage',
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
            reDirectTo: 'accountStatementPage',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'accountStatementPage',
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
  getCategories = () => {
    setSpinner(true);
    let linkedId = '';
    ls.get('linkedAccountId').then((data) => {
      console.log(data);
      // setLinkedAccountIdNo(data)
      linkedId = data;

      fetch(
        global.baseURL + 'customer/get/popular/categories/' + data,
        // fetch(global.baseURL+'customer/get/popular/categories/' + route.params.assetData.linkedAccountId
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.data != null) {
            let list = [...responseJson.data];
            let allC = {};
            allC.categoryId = 0;
            allC.categoryIcon = 'YWxsX0luY29tZV9pY29uLnBuZw==';
            allC.count = null;
            allC.categoryName = 'All';
            // "type": "CR"
            list.unshift(allC);
            setCategory(list);
            console.log(list);
            setSpinner(false);
          } else {
            setCategory(null);
            setSpinner(false);
          }
          // .catch((error) => {
          //     console.error(error);
          // })
        })
        .catch((error) => {
          console.error(error);
          setSpinner(false);
        });
    });
  };
  filterData = (item) => {
    setSpinner(true);
    setStmtList([]);
    // setDisplyList([])
    setNotransaction(false);
    console.log(item);
    if (item.categoryId != 0) {
      console.log(item.categoryId);
      setFilterStatus(true);
      let postData = {};
      ls.get('linkedAccountId').then((data) => {
        console.log(data);
        // setLinkedAccountIdNo(data)
        postData.linkedAccountId = data;
      });
      ls.get('filterData').then((filterData) => {
        // postData.linkedAccountId = linkedAccountIdNo
        postData.month = filterData.month.id;
        postData.year = filterData.year.year;
        postData.categoryId = item.categoryId;
        postData.type = item.type;
        console.log(JSON.stringify(postData));
        // fetch(global.baseURL+'customer/get/transactions/category/wise', {
        fetch(global.baseURL + 'customer/get/transactions/category/wise', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
          // JSON.stringify({
          //     "linkedAccountId": route.params.assetData.linkedAccountId,
          //     "month": null,
          //     "year": null,
          //     "categoryId": item.categoryId,
          //     "type": item.type
          // })
        })
          .then((response) => response.json())
          .then((responseJson) => {
            // console.log(responseJson.data)
            setStmtList(responseJson.data);
            // setDisplyList(responseJson.data)
            if (responseJson.data == null) {
              setNotransaction(true);
            } else {
              setNotransaction(false);
            }
            console.log(stmtList);
            setStatus(true);
            setSpinner(false);
          })
          .catch((error) => {
            console.error(error);
            setSpinner(false);
          });
      });
    } else {
      setFilterStatus(false);
      setNotransaction(false);
      getStatementList();
    }
  };

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log('moveY :' + gestureState.moveY + ' , hp :' + hp('80%'));
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          // isScrollEnable == false) {
          (isScrollEnable == false &&
            gestureState.moveY >= wp('72%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY <= wp('72%') &&
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
            toValue: wp('20%'),
            tension: 1,
            // easing: Easing.linear
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('72%'),
            tension: 1,
            // easing: Easing.linear
          }).start();
        }
      },
    }),
  )[0];
  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };
  const viewOpacity = pan.y.interpolate({
    // inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 400],
    inputRange: [0, hp('20%'), hp('33%')],
    // inputRange: [0, SCREEN_HEIGHT - 500],
    outputRange: [0, 0, 1],
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
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: hp('3%'),
          right: hp('3%'),
          zIndex: 30,
        }}
        // onPress={() => navigation.navigate('aggregator')}
      >
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <Animated.View style={{backgroundColor: 'white'}}>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg(dark).png')}></Image>
        </View>
        {/* <Animated.View> */}
        <Animated.View style={styles.container}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('accounts')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Statement</Text>
            </View>
          </View>
          <Animated.View style={{opacity: viewOpacity}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('accountStmtDetails', route.params)
              }>
              <Card containerStyle={{borderRadius: 15, padding: 0}}>
                <View>
                  <Grid>
                    <Row style={{maxWidth: '100%', maxHeight: '100%'}}>
                      <Col size={2}>
                        <View style={styles.cardCol_1}>
                          <Image
                            resizeMode={'contain'}
                            style={[
                              styles.cardCol_1Img,
                              {maxWidth: '100%', height: '100%'},
                            ]}
                            source={{
                              uri:
                                global.baseURL +
                                'customer/' +
                                route.params.assetData.assetDetails[34].value,
                            }}></Image>
                        </View>
                      </Col>
                      <Col size={3.5} style={styles.cardCol_2}>
                        <Text style={styles.cardCol_2Text_1}>
                          {route.params.assetData.assetDetails[3].value.replace(
                            /.(?=.{4})/g,
                            '.',
                          )}
                        </Text>
                        <Text style={styles.cardCol_2Text_2}>
                          {route.params.assetData.assetDetails[1].value}
                        </Text>
                      </Col>
                      <Col size={6.5} style={styles.cardCol_3}>
                        <ImageBackground
                          style={{maxWidth: '100%', height: '100%'}}
                          source={require('./assets/yellowbackground.png')}>
                          <View
                            style={{
                              alignItems: 'flex-end',
                              paddingTop: 10,
                              paddingRight: 18,
                            }}>
                            <View style={styles.cardCol_3ImgView}>
                              <Image
                                resizeMode={'contain'}
                                style={styles.cardCol_3FIImg}
                                source={{uri: route.params.fiLogo}}></Image>
                            </View>
                            <Text style={{fontSize: 10, color: 'white'}}>
                              {route.params.fiName}
                            </Text>
                          </View>
                        </ImageBackground>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <View style={styles.cardBalView}>
                          <Text style={styles.cardBalText}>Balance</Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                              width: '100%',
                            }}>
                            <Text
                              style={{
                                color: '#454F63',
                                fontSize: 9,
                                marginRight: 3,
                                marginTop: 3,
                              }}>
                              {route.params.assetData.accountCurrency}
                            </Text>
                            <AmountDisplay
                              style={styles.cardBalAmt}
                              amount={Number(
                                route.params.assetData
                                  .assetValueInAccountCurrency,
                              )}
                              currency={route.params.assetData.accountCurrency}
                            />
                            {/* <NumberFormat
                              value={Number(
                                route.params.assetData
                                  .assetValueInAccountCurrency,
                              )}
                              displayType={'text'}
                              thousandsGroupStyle={global.thousandsGroupStyle}
                              thousandSeparator={global.thousandSeparator}
                              decimalScale={global.decimalScale}
                              fixedDecimalScale={true}
                              // prefix={'₹'}
                              renderText={(value) => (
                                <Text style={styles.cardBalAmt}>{value}</Text>
                              )}
                            /> */}
                          </View>
                        </View>
                      </Col>
                    </Row>
                  </Grid>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>
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
            height: SCREEN_HEIGHT - 50,
          },
        ]}>
        <Animated.View style={{backgroundColor: _bgColorAnimation}}>
          {category != null ? (
            <View
              style={{
                paddingLeft: hp('2%'),
                paddingRight: hp('2%'),
                paddingBottom: hp('4%'),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: hp('1%'),
                  paddingLeft: hp('3%'),
                  paddingRight: hp('3%'),
                }}>
                <Text
                  style={{color: '#454F63', fontWeight: 'bold', fontSize: 14}}>
                  Popular Categories
                </Text>
                <View style={{marginLeft: 'auto'}}>
                  <TouchableOpacity onPress={() => clickedCategoryFilter()}>
                    <Image
                      style={{marginLeft: 'auto'}}
                      source={require('./assets/icons-filter-dark(dark).png')}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={category}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{zIndex: 300}}
                    onPress={() => filterData(item)}>
                    <View>
                      <Card containerStyle={{borderRadius: 12}}>
                        <View style={{width: wp('15%'), height: hp('10%')}}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={{
                              uri:
                                global.baseURL +
                                'customer/' +
                                item.categoryIcon,
                            }}></Image>
                        </View>
                      </Card>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#454F63',
                          fontSize: 10,
                        }}>
                        {item.categoryName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}></FlatList>
            </View>
          ) : (
            <View>
              {/* <Text style={{ textAlign: 'center' }}>No Popular Categories Available</Text> */}
            </View>
          )}
          {/* </View> */}
        </Animated.View>
        <Animated.View
          style={{
            backgroundColor: '#5E83F2',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingTop: 20,
            height: hp('100%'),
            flex: 1,
            paddingBottom: hp('4%'),
          }}>
          <View style={styles.line}></View>

          <Grid>
            {notransaction == false ? (
              <FlatList
                data={stmtList}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                renderItem={({item}) => (
                  <View>
                    <View>
                      {filterStatus == true ? (
                        <TouchableOpacity
                          style={{zIndex: 300}}
                          onPress={() => dataSelected(item)}>
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
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.icon,
                                    }}></Image>
                                )}
                              </View>
                            </Col>
                            <Col size={5}>
                              <Text style={{color: 'white', fontSize: 14}}>
                                {item.description}
                              </Text>
                              <Text
                                style={{
                                  color: 'white',
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
                              size={5}
                              style={{
                                alignItems: 'flex-end',
                                paddingRight: 10,
                              }}>
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
                                    fontSize: 18,
                                  }}>
                                  {item.transactionCurrency}
                                </Text>
                                <AmountDisplay
                                  style={{color: 'white', fontSize: 18}}
                                  amount={Number(item.amount)}
                                  currency={item.transactionCurrency}
                                />
                                {/* <NumberFormat
                                  value={Number(item.amount)}
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
                                      style={{color: 'white', fontSize: 18}}>
                                      {value}
                                    </Text>
                                  )}
                                /> */}
                              </View>
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View>
                      {item.type == 'S' && filterStatus == false ? (
                        <TouchableOpacity
                          style={{zIndex: 300}}
                          onPress={() =>
                            navigation.navigate('transactionPage', {
                              statementData: item,
                              reDirectTo: 'accountStatementPage',
                              selectedItem: item,
                            })
                          }>
                          <Row style={{padding: hp('2%'), paddingBottom: 25.5}}>
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
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.icon,
                                    }}></Image>
                                )}
                                {/* <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image> */}
                              </View>
                            </Col>
                            <Col size={5}>
                              <Text style={{color: 'white', fontSize: 14}}>
                                {item.description}
                              </Text>
                              <Text
                                style={{
                                  color: 'white',
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
                              size={5}
                              style={{
                                alignItems: 'flex-end',
                                paddingRight: 10,
                              }}>
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
                                  thousandsGroupStyle={
                                    global.thousandsGroupStyle
                                  }
                                  thousandSeparator={global.thousandSeparator}
                                  decimalScale={global.decimalScale}
                                  fixedDecimalScale={true}
                                  // prefix={'₹'}
                                  renderText={(value) => (
                                    <Text
                                      style={{color: 'white', fontSize: 18}}>
                                      {value}
                                    </Text>
                                  )}
                                /> */}
                              </View>
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View>
                      {item.type == 'P' && filterStatus == false ? (
                        <TouchableOpacity
                          style={{zIndex: 300}}
                          onPress={() => dataSelected(item)}>
                          <Row style={{padding: hp('2%'), paddingBottom: 25.5}}>
                            <Col size={2} style={{alignItems: 'center'}}>
                              <View style={{width: 45, height: 45}}>
                                <Image
                                  style={{maxWidth: '100%', height: '100%'}}
                                  source={{
                                    uri:
                                      global.baseURL + 'customer/' + item.icon,
                                  }}></Image>
                              </View>
                            </Col>
                            <Col size={5}>
                              <Text style={{color: 'white', fontSize: 14}}>
                                {item.description}
                              </Text>
                              <Text
                                style={{
                                  color: 'white',
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
                              size={5}
                              style={{
                                alignItems: 'flex-end',
                                paddingRight: 10,
                              }}>
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
                                  thousandsGroupStyle={
                                    global.thousandsGroupStyle
                                  }
                                  thousandSeparator={global.thousandSeparator}
                                  decimalScale={global.decimalScale}
                                  fixedDecimalScale={true}
                                  // prefix={'₹'}
                                  renderText={(value) => (
                                    <Text
                                      style={{color: 'white', fontSize: 18}}>
                                      {value}
                                    </Text>
                                  )}
                                /> */}
                              </View>
                            </Col>
                          </Row>
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              alignSelf: 'center',
                              position: 'absolute',
                              bottom: -10,
                              elevation: 10,
                            }}>
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={require('./assets/Link_icon.png')}></Image>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View>
                      {item.type == 'C' && filterStatus == false ? (
                        // <TouchableOpacity style={{ zIndex: 0, zIndex: 300 }} disabled onPress={() => navigation.navigate('transactionPage', { statementData: item, reDirectTo: 'accountStatementPage', selectedItem: item })} >
                        <TouchableOpacity
                          style={{zIndex: 300}}
                          onPress={() => dataSelected(item)}>
                          <Row
                            style={{
                              padding: hp('2%'),
                              paddingBottom: 25.5,
                              backgroundColor: '#587BE6',
                              borderLeftColor: '#F22973',
                              borderLeftWidth: 5,
                              elevation: 0.5,
                            }}>
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
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.icon,
                                    }}></Image>
                                )}
                                {/* <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image> */}
                              </View>
                            </Col>
                            <Col size={5}>
                              <Text style={{color: 'white', fontSize: 14}}>
                                {item.description}
                              </Text>
                              <Text
                                style={{
                                  color: 'white',
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
                              size={5}
                              style={{
                                alignItems: 'flex-end',
                                paddingRight: 10,
                              }}>
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
                                  thousandsGroupStyle={
                                    global.thousandsGroupStyle
                                  }
                                  thousandSeparator={global.thousandSeparator}
                                  decimalScale={global.decimalScale}
                                  fixedDecimalScale={true}
                                  // prefix={'₹'}
                                  renderText={(value) => (
                                    <Text
                                      style={{color: 'white', fontSize: 18}}>
                                      {value}
                                    </Text>
                                  )}
                                /> */}
                              </View>
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}></FlatList>
            ) : (
              <View style={{width: '100%', paddingTop: hp('5%')}}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    paddingBottom: hp('0.5%'),
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
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

export default AccountStatementPage;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('3.5%'),
    width: wp('100%'),
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    // paddingTop: hp("0.5%")
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

  cardCol_2: {
    paddingTop: 5,
    paddingLeft: hp('2%'),
  },
  cardCol_2Text_1: {
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: hp('2%'),
    marginLeft: hp('2%'),
  },
  cardCol_2Text_2: {
    color: '#888888',
    fontSize: 12,
  },
  cardCol_3ImgView: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 0,
  },
  cardCol_3FIImg: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: 40,
  },
  cardCol_1: {
    width: hp('8%'),
    height: hp('8%'),
    marginBottom: 35,
    marginTop: 10,
    marginLeft: 10,
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
    zIndex: 1,
  },
});
