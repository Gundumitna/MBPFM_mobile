import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
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
import { Card } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressBar from 'react-native-progress/Bar';
import AmountDisplay from './AmountDisplay';

const GoalStatementPage = ({ route, navigation }) => {
  let ls = require('react-native-local-storage');
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const pan = useState(new Animated.ValueXY({ x: 0, y: wp('57%') }))[0];
  const [scrollOffset, setScrollOffset] = useState();
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const [goalAccountNumber, setGoalAccountNumber] = useState();
  const [debitAccountNumber, setDebitAccountNumber] = useState();
  const [installmentAmount, setInstallmentAmount] = useState();
  const [goalName, setGoalName] = useState();
  const [notransaction, setNotransaction] = useState(false);
  const [goalStmtList, setGoalStmtList] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(Moment(1579418145000).format('DD'));
      getGoalData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag == true]);

  getGoalData = () => {
    setSpinner(true);
    setNotransaction(false);
    console.log(route.params.selectedItem.key);
    fetch(
      global.baseURL +
      'customer/get/goals/statement/' +
      global.loginID +
      '/' +
      route.params.selectedItem.key,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        if (responseJson.data.goalStatements == null) {
          setNotransaction(true);
        } else {
          setNotransaction(false);
        }
        setGoalAccountNumber(responseJson.data.goalAccountNumber);
        setDebitAccountNumber(responseJson.data.debitAccountNumber);
        setInstallmentAmount(responseJson.data.installmentAmount);
        setGoalName(responseJson.data.goalName);
        if (
          responseJson.data.goalStatements != null &&
          responseJson.data.goalStatements.length != 0
        ) {
          let data = [];
          for (let d of responseJson.data.goalStatements) {
            let li = {};
            li.goalStatementId = d.goalStatementId;
            li.narration = d.narration;
            li.transactionId = d.transactionId;
            li.transactionAmount = d.transactionAmount;
            li.no = Moment(d.transactionTimestamp).format('DD');
            li.date = Moment(d.transactionTimestamp).format('MMM YYYY');
            data.push(li);
          }
          console.log(data);
          setGoalStmtList(data);
        } else {
          setGoalStmtList(responseJson.data.goalStatements);
        }
        setFlag(true);
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log('moveY :' + gestureState.moveY + ' , hp :' + hp('80%'));
        console.log(scrollOffset);
        if (
          (isScrollEnable == true && scrollOffset <= 0) ||
          // isScrollEnable == false) {
          (isScrollEnable == false &&
            gestureState.moveY > wp('57%') &&
            gestureState.dy > 0) ||
          (isScrollEnable == false &&
            gestureState.moveY < wp('57%') &&
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
        if (gestureState.dy < 0) {
          setIsScrollEnable(true);
          Animated.timing(pan.y, {
            toValue: wp('20%'),
            tension: 1,
            easing: Easing.linear,
          }).start();
        } else if (gestureState.dy > 0) {
          setIsScrollEnable(false);
          Animated.timing(pan.y, {
            toValue: wp('57%'),
            tension: 1,
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
    inputRange: [0, hp('20%'), hp('23%')],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const _bgColorAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', 'white', 'white'],
  });
  const borderWidthAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', '#EEEEEE', '#EEEEEE'],
  });
  return (
    <Animated.View style={{ flex: 1, backgroundColor: 'white' }}>
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
          style={{ maxWidth: '100%', height: '100%' }}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <Animated.View style={{ backgroundColor: 'white' }}>
        <View>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg(dark).png')}></Image>
        </View>
        {/* <Animated.View> */}
        <Animated.View style={styles.container}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('goalsPage')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Goal Statement</Text>
            </View>
          </View>
          <View
            style={{
              padding: hp('2%'),
              paddingLeft: hp('3%'),
              paddingRight: hp('3%'),
            }}>
            <Text
              numberOfLines={1}
              style={{
                paddingBottom: hp('1%'),
                paddingTop: hp('-1%'),
                color: '#454F63',
                fontSize: 15,
              }}>
              {goalName}
            </Text>
            <View style={{ alignItems: 'center', paddingBottom: hp('2%') }}>
              <Text style={{ color: '#454F63', opacity: 0.7, fontSize: 11 }}>
                Goal Amount
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Text style={{
                                    color: '#333333',
                                    fontSize: 9,
                                    marginRight: 3,
                                    marginTop: 3,
                                    fontWeight: 'bold'
                                }}>{route.params.selectedItem.currency}</Text> */}
                <AmountDisplay
                  style={{
                    color: '#333333',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                  amount={Number(route.params.selectedItem.goalAmount)}
                  currency={route.params.selectedItem.currency}
                />
                {/* <NumberFormat
                  value={Number(route.params.selectedItem.goalAmount)}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  // prefix={'₹'}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      {value}
                    </Text>
                  )}
                /> */}
              </View>
            </View>

            {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ paddingTop: hp('-1%') }}>
                                <Text style={{ color: '#454F63', fontSize: 14 }}>{route.params.selectedItem.goalName} </Text>

                            </View>
                            <View style={{ marginLeft: 'auto', paddingTop: hp('-1%') }}>
                                <NumberFormat
                                    value={Number(route.params.selectedItem.goalAmount)}
                                    displayType={'text'}
                                    thousandsGroupStyle={global.thousandsGroupStyle}
                                    thousandSeparator={global.thousandSeparator}
                                    decimalScale={global.decimalScale}
                                    fixedDecimalScale={true}
                                    prefix={'₹'}
                                    renderText={value => <Text style={{ textAlign: 'right', color: '#454F63', fontSize: 18 }}>{value}</Text>}
                                />
                            </View>
                        </View> */}
            <View>
              <ProgressBar
                borderColor={'transparent'}
                height={10}
                borderRadius={35}
                progress={
                  Number(route.params.selectedItem.savedAmount).toFixed(2) /
                  Number(route.params.selectedItem.goalAmount).toFixed(2)
                }
                width={null}
                color={
                  Number(
                    route.params.selectedItem.goalAmount -
                    route.params.selectedItem.savedAmount,
                  ) == 0
                    ? '#63CDD6'
                    : Number(route.params.selectedItem.savedAmount).toFixed(2) /
                      Number(route.params.selectedItem.goalAmount).toFixed(
                        2,
                      ) >=
                      0 &&
                      Number(route.params.selectedItem.savedAmount).toFixed(2) /
                      Number(route.params.selectedItem.goalAmount).toFixed(
                        2,
                      ) <
                      0.5
                      ? '#F55485'
                      : '#F2A413'
                }
                unfilledColor={
                  Number(
                    route.params.selectedItem.goalAmount -
                    route.params.selectedItem.savedAmount,
                  ) == 0
                    ? '#63CDD6'
                    : Number(route.params.selectedItem.savedAmount).toFixed(2) /
                      Number(route.params.selectedItem.goalAmount).toFixed(
                        2,
                      ) >=
                      0 &&
                      Number(route.params.selectedItem.savedAmount).toFixed(2) /
                      Number(route.params.selectedItem.goalAmount).toFixed(
                        2,
                      ) <
                      0.5
                      ? '#FCD6E2'
                      : '#FDEDD4'
                }
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={{ color: '#888888', fontSize: 14 }}>
                  Saved Amount
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: hp('0.4%'),
                    alignSelf: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#888888',
                      fontSize: 9,
                      marginRight: 3,
                      marginTop: 3,
                    }}>
                    {route.params.selectedItem.currency}
                  </Text>
                  <AmountDisplay
                    style={{
                      color: '#888888',
                      fontSize: 18,
                    }}
                    amount={Number(route.params.selectedItem.savedAmount)}
                    currency={route.params.selectedItem.currency}
                  />
                  {/* <NumberFormat
                    value={Number(route.params.selectedItem.savedAmount)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={global.decimalScale}
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <Text style={{color: '#888888', fontSize: 18}}>
                        {value}
                      </Text>
                    )}
                  /> */}
                </View>
              </View>
              <View style={{ marginLeft: 'auto' }}>
                <Text
                  style={{ color: '#888888', fontSize: 14, textAlign: 'right' }}>
                  Remaining
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: hp('0.4%'),
                    alignSelf: 'flex-end',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{
                      color: '#888888',
                      fontSize: 9,
                      marginRight: 3,
                      marginTop: 3,
                    }}>
                    {route.params.selectedItem.currency}
                  </Text>
                  <AmountDisplay
                    style={{
                      color: '#888888',
                      fontSize: 18,
                      textAlign: 'right',
                    }}
                    amount={Number(
                      route.params.selectedItem.goalAmount -
                      route.params.selectedItem.savedAmount,
                    )}
                    currency={route.params.selectedItem.currency}
                  />
                  {/* <NumberFormat
                    value={Number(
                      route.params.selectedItem.goalAmount -
                        route.params.selectedItem.savedAmount,
                    )}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={global.decimalScale}
                    fixedDecimalScale={true}
                    // prefix={'₹'}
                    renderText={(value) => (
                      <View>
                        <Text
                          style={{
                            color: '#888888',
                            fontSize: 18,
                            textAlign: 'right',
                          }}>
                          {value}
                        </Text>
                      </View>
                    )}
                  /> */}
                </View>
              </View>
            </View>
          </View>
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
        <Animated.View style={{ opacity: viewOpacity, height: wp('38%') }}>
          <Grid
            style={{
              paddingLeft: hp('2%'),
              paddingRight: hp('2%'),
              paddingTop: hp('2%'),
              backgroundColor: '#F6F6F6',
              margin: hp('3%'),
            }}>
            <Row>
              <Col size={6.5}>
                <Text style={{ color: '#5D707D', fontSize: 11 }}>
                  Goal Account Number
                </Text>
                <Text style={{ color: '#454F63', fontSize: 16 }}>
                  {goalAccountNumber}
                </Text>
              </Col>
              <Col size={0.5}></Col>
              <Col size={5.5}>
                <Text style={{ color: '#5D707D', fontSize: 11 }}>
                  Installment Amount
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginTop: hp('0.4%'),
                  }}>
                  <Text
                    style={{
                      color: '#454F63',
                      fontSize: 9,
                      marginRight: 3,
                      marginTop: 3,
                    }}>
                    {route.params.selectedItem.currency}
                  </Text>
                  <AmountDisplay
                    style={{
                      color: '#454F63',
                      fontSize: 16,
                    }}
                    amount={Number(installmentAmount)}
                    currency={route.params.selectedItem.currency}
                  />
                  {/* <NumberFormat
                    value={Number(installmentAmount)}
                    displayType={'text'}
                    thousandsGroupStyle={global.thousandsGroupStyle}
                    thousandSeparator={global.thousandSeparator}
                    decimalScale={global.decimalScale}
                    fixedDecimalScale={true}
                    renderText={(value) => (
                      <View>
                        <Text style={{color: '#454F63', fontSize: 16}}>
                          {value}
                        </Text>
                      </View>
                    )}
                  /> */}
                </View>
              </Col>
            </Row>
            <Row>
              <Col size={6.5}>
                <Text style={{ color: '#5D707D', fontSize: 11 }}>
                  Debit Account Number
                </Text>
                <Text style={{ color: '#454F63', fontSize: 16 }}>
                  {debitAccountNumber.replace(/.(?=.{4})/g, 'x')}
                </Text>
              </Col>
              <Col size={0.5}></Col>
              <Col size={5.5}>
                <Text style={{ color: '#5D707D', fontSize: 11 }}>
                  Category Name
                </Text>
                <Text style={{ color: '#454F63', fontSize: 16 }}>
                  {route.params.selectedItem.categoryName}
                </Text>
              </Col>
            </Row>
          </Grid>
        </Animated.View>

        <Animated.View
          style={{
            backgroundColor: '#5E83F2',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingTop: 20,
            height: hp('100%'),
            flex: 1,
            paddingBottom: hp('3%'),
          }}>
          <View style={styles.line}></View>

          <Grid>
            {notransaction == false ? (
              <FlatList
                data={goalStmtList}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                style={{ paddingLeft: hp('3%'), paddingRight: hp('3%') }}
                onScroll={(event) => {
                  let e = event.nativeEvent.contentOffset.y;
                  console.log('e : ' + e);
                  setScrollOffset(e);
                }}
                renderItem={({ item }) => (
                  <View style={{ paddingTop: hp('4%') }}>
                    <Row>
                      <Col size={2}>
                        <View
                          style={{
                            padding: 12,
                            backgroundColor: '#DFE4FB',
                            marginRight: 12,
                            borderRadius: 25,
                          }}>
                          <Text style={{ color: '#555555', textAlign: 'center' }}>
                            {item.no}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 9,
                            marginLeft: hp('0.2%'),
                          }}>
                          {item.date}
                        </Text>
                      </Col>
                      <Col size={0.5}>
                        <View
                          style={{
                            width: 1,
                            height: '100%',
                            backgroundColor: '#DFE4FB',
                          }}></View>
                      </Col>
                      <Col size={4.5} style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
                          {item.narration}
                        </Text>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 14,
                            opacity: 0.6,
                          }}>
                          {item.transactionId}
                        </Text>
                      </Col>
                      <Col size={5} style={{ justifyContent: 'center' }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginTop: hp('0.4%'),
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontSize: 9,
                              marginRight: 3,
                              marginTop: 3,
                            }}>
                            {route.params.selectedItem.currency}
                          </Text>
                          <AmountDisplay
                            style={{
                              color: '#FFFFFF',
                              fontSize: 16,
                              textAlign: 'right',
                            }}
                            amount={Number(item.transactionAmount)}
                            currency={route.params.selectedItem.currency}
                          />
                          {/* <NumberFormat
                            value={Number(item.transactionAmount)}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontSize: 16,
                                  textAlign: 'right',
                                }}>
                                {value}
                              </Text>
                            )}
                          /> */}
                        </View>
                      </Col>
                    </Row>
                  </View>
                )}></FlatList>
            ) : (
                <View style={{ width: '100%', padding: hp('15%') }}>
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
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default GoalStatementPage;
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
