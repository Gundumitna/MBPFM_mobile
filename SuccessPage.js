import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NumberFormat from 'react-number-format';
import { Grid, Row, Col } from 'react-native-easy-grid';
import Upshot from 'react-native-upshotsdk';
import AmountDisplay from './AmountDisplay';
import { useDispatch, useSelector } from 'react-redux';

const SuccessPage = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const currencyMaster = useSelector((state) => state.currencyMaster);

  useEffect(() => {
    Upshot.addListener('UpshotActivityDidAppear', handleActivityDidAppear);

    Upshot.addListener('UpshotActivityDidDismiss', handleActivityDidDismiss);

    Upshot.addListener('UpshotDeepLink', handleDeeplink);
    const payload = {};
    if (route.params.type == 'createSuccess') {
      Upshot.createCustomEvent(
        'SetSavings',
        JSON.stringify(payload),
        false,
        function (eventId) {
          console.log('Event  SetSavings' + eventId);
        },
      );
    }
  }, []);
  const handleActivityDidAppear = (response) => {
    console.log('activity did appear');
    console.log(response);
  };

  const handleActivityDidDismiss = (response) => {
    console.log('activity dismiss');
    //if activity==7
    // if (response.activityType == 7) {
    //   Upshot.showActivityWithType(-1, 'Home Survey');
    // }
    console.log(response);
  };
  const handleDeeplink = (response) => {
    console.log('deeplink ' + JSON.stringify(response));
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
    console.log(response);
  };
  if (
    route.params.type == 'createSuccess' ||
    route.params.type == 'editSuccess' ||
    route.params.type == 'requestFund'
  ) {
    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: '#02909C',
          flex: 1,
          paddingTop: hp('6%'),
        }}>
        <View style={{ zIndex: 1, position: 'absolute' }}>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg.png')}
          />
        </View>
        <ScrollView
          style={{ zIndex: 20, paddingLeft: hp('5%'), paddingRight: hp('5%') }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: hp('25%'), height: hp('25%') }}>
              <Image
                style={{ maxWidth: '100%', height: '100%' }}
                resizeMode={'contain'}
                source={require('./assets/successPage_img.png')}
              />
            </View>
            {route.params.type == 'createSuccess' ? (
              <View>
                <Text style={styles.congratsText}>Congratulations !!!</Text>
                <Text style={styles.text}>Your Goal Created Successfully.</Text>
              </View>
            ) : (
                <View>
                  {route.params.type == 'editSuccess' ? (
                    <Text style={styles.text}>
                      Your Goal Updated Successfully.
                    </Text>
                  ) : null}
                </View>
              )}
            {route.params.type == 'requestFund' ? (
              <View>
                <Text style={[styles.congratsText, { textAlign: 'center' }]}>
                  Success !!!
                </Text>
                <Text style={styles.text}>
                  Your request initiated Successfully.
                </Text>
              </View>
            ) : null}
            {route.params.type == 'createSuccess' ||
              route.params.type == 'editSuccess' ? (
                <View style={{ marginTop: hp('5.5%'), alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'left',
                        fontWeight: 'bold',
                        marginTop: 'auto',
                        marginTop: 3,
                        marginRight: 3,
                      }}>
                      {route.params.data.currency}
                    </Text>
                    <NumberFormat
                      value={Number(route.params.data.totalAmountNeeded)}
                      displayType={'text'}
                      thousandsGroupStyle={global.thousandsGroupStyle}
                      thousandSeparator={global.thousandSeparator}
                      decimalScale={
                        currencyMaster.currency[route.params.data.currency] !=
                          undefined
                          ? currencyMaster.currency[route.params.data.currency]
                            .decimalFormat
                          : 0
                      }
                      fixedDecimalScale={true}
                      // prefix={route.params.data.currency}
                      renderText={(value) => (
                        <View>
                          <Text style={{ color: '#FFFFFF', fontSize: 27 }}>
                            {value}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </View>
              ) : (
                <View style={{ marginTop: hp('3.5%'), alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'white' }}>
                    Requested Amount
                </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'left',
                        fontWeight: 'bold',
                        marginTop: 'auto',
                        marginTop: 3,
                        marginRight: 3,
                      }}>
                      {route.params.data.currency}
                    </Text>
                    <NumberFormat
                      value={Number(route.params.data.amount)}
                      displayType={'text'}
                      thousandsGroupStyle={global.thousandsGroupStyle}
                      thousandSeparator={global.thousandSeparator}
                      decimalScale={
                        currencyMaster.currency[route.params.data.currency] !=
                          undefined
                          ? currencyMaster.currency[route.params.data.currency]
                            .decimalFormat
                          : 0
                      }
                      fixedDecimalScale={true}
                      // prefix={route.params.data.currency}
                      // prefix={'₹'}
                      renderText={(value) => (
                        <View>
                          <Text style={{ color: '#FFFFFF', fontSize: 27 }}>
                            {value}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </View>
              )}
            <Text
              style={{
                color: '#FFFFFF',
                paddingTop: hp('1%'),
                fontSize: 16,
                textAlign: 'center',
              }}>
              {route.params.data.goalName}
            </Text>
          </View>
          <Grid>
            <Row style={{ marginTop: hp('1.5%') }}>
              <Col size={4.5}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingTop: hp('3%'),
                    borderBottomColor: 'white',
                  }}
                />
              </Col>
              <Col size={3}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: hp('1.5%'),
                    color: 'white',
                    fontSize: 14,
                  }}>
                  Details
                </Text>
              </Col>
              <Col size={4.5}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingTop: hp('3%'),
                    borderBottomColor: 'white',
                  }}
                />
              </Col>
            </Row>
          </Grid>
          {route.params.type == 'createSuccess' ||
            route.params.type == 'editSuccess' ? (
              <View>
                <View style={{ paddingTop: hp('3.5%') }}>
                  <Text style={styles.label}>Category</Text>
                  <Text style={styles.data}>
                    {route.params.data.categoryName}
                  </Text>
                </View>
                <View
                  style={{
                    paddingTop: hp('3.5%'),
                  }}>
                  <Text style={styles.label}>Contribution Amount</Text>
                  <Text style={styles.data}>
                    {route.params.data.contributionFrequency}
                  </Text>
                </View>
                <View
                  style={{
                    paddingTop: hp('3.5%'),
                  }}>
                  <Text style={styles.label}>Funds From</Text>
                  <Text style={styles.data}>
                    {route.params.data.fundsReceivedFrom}
                  </Text>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ paddingTop: hp('3.5%') }}>
                  <Text style={styles.label}>External Bank Account UPI ID</Text>
                  <Text style={styles.data}>{route.params.data.upiId}</Text>
                </View>
                <View
                  style={{
                    paddingTop: hp('3.5%'),
                  }}>
                  <Text style={styles.label}>Credit Funds to</Text>
                  <Text style={styles.data}>{route.params.data.bankName}</Text>
                </View>
                <View
                  style={{
                    paddingTop: hp('3.5%'),
                  }}>
                  <Text style={styles.label}>To Account</Text>
                  <Text style={styles.data}>
                    {route.params.data.accountNumber.replace(
                      /.(?=.{4})/g,
                      'x',
                    )}
                  </Text>
                </View>
              </View>
            )}
        </ScrollView>
        <View style={styles.footer}>
          {route.params.type == 'requestFund' ? (
            <TouchableOpacity onPress={() => navigation.navigate('accounts')}>
              <Text style={styles.footerBotton}>Done</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity onPress={() => navigation.navigate('goalsPage')}>
                <Text style={styles.footerBotton}>Done</Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  } else if (route.params.type == 'failure') {
    return (
      <View
        style={{
          flexDirection: 'column',
          backgroundColor: '#F22973',
          flex: 1,
          paddingTop: hp('6%'),
        }}>
        <View style={{ zIndex: 1, position: 'absolute' }}>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg.png')}
          />
        </View>
        <ScrollView style={{ zIndex: 20 }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: hp('20%'),
            }}>
            <View style={{ width: hp('25%'), height: hp('25%') }}>
              <Image
                style={{ maxWidth: '100%', height: '100%' }}
                resizeMode={'contain'}
                source={require('./assets/failurePageImg.png')}
              />
            </View>
            <Text style={styles.congratsText}>Oops !!!</Text>
            <Text style={styles.text}>Something went wrong.</Text>
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('goalsPage')}>
                <Text
                  style={[
                    styles.footerBotton,
                    {
                      backgroundColor: '#F55485',
                      paddingLeft: hp('10%'),
                      paddingRight: hp('10%'),
                    },
                  ]}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else if (route.params.type == 'editProfilePage') {
    return (
      <View
        style={{ flexDirection: 'column', backgroundColor: '#02909C', flex: 1 }}>
        <View style={{ zIndex: 1, position: 'absolute' }}>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg.png')}
          />
        </View>
        <ScrollView
          style={{
            zIndex: 20,
            paddingLeft: hp('5%'),
            paddingRight: hp('5%'),
            top: wp('35%'),
          }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: hp('25%'), height: hp('25%') }}>
              <Image
                style={{ maxWidth: '100%', height: '100%' }}
                resizeMode={'contain'}
                source={require('./assets/successPage_img.png')}
              />
            </View>

            <Text style={styles.text}>Your Profile Updated Successfully.</Text>
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('dashboard')}>
                <Text
                  style={[
                    styles.footerBotton,
                    {
                      backgroundColor: '#63CDD6',
                      paddingLeft: hp('6%'),
                      paddingRight: hp('6%'),
                    },
                  ]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default SuccessPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: hp('5%'),
  },
  footer: {
    paddingLeft: hp('6%'),
    paddingTop: hp('2.5%'),
    paddingRight: hp('6%'),
    paddingBottom: hp('3.5%'),
    backgroundColor: 'transparent',
    borderTopRightRadius: hp('6%'),
    zIndex: 50,
  },
  footerBotton: {
    padding: hp('1.7%'),
    fontSize: hp('2.4%'),
    fontFamily: 'Roboto',
    textAlign: 'center',
    backgroundColor: '#63CDD6',
    borderRadius: hp('1.3%'),
    marginTop: hp('1%'),
    color: 'white',
  },
  label: {
    color: '#DBF3F5',
    fontSize: 13,
  },
  data: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  congratsText: {
    color: 'white',
    fontSize: 35,
    paddingTop: hp('2%'),
  },
  text: {
    color: 'white',
    fontSize: 15,
    paddingTop: hp('1%'),
  },
});
