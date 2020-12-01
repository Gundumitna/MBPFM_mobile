import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  Alert,
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
import Spinner from 'react-native-loading-spinner-overlay';
function AccountsSubPage({route, navigation}) {
  let ls = require('react-native-local-storage');
  const [heading, setHeading] = useState('');
  const [transactionList, setTransactionList] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [dataTosend, setDataTosend] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    setAssetList(route.params.assets);
    ls.get('filterData').then((data) => {
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
    });
  }, []);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);
  getTransactions = (item, assetList) => {
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
          data.fiName = route.params.fiName;
          data.fiLogo = route.params.fiLogo;
          data.fiId = route.params.fiId;
          data.totalAssetvalue = route.params.totalAssetvalue;
          // data.asset = route.params
          data.assetData = item;
          data.transactionData = responseJson.data;
          ls.save('linkedAccountId', data.assetData.linkedAccountId);
          setDataTosend(data);
          setTransactionList(responseJson.data);
          console.log(responseJson.data);
          let AList = [];
          let routerList = [...route.params.assets];
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
  var {width, height} = Dimensions.get('window');
  var fadeFlage = false;
  const xValue = new Animated.Value(0);
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
  // hp('-3.5%')
  return (
    <View
      style={{flexDirection: 'column', flex: 1, backgroundColor: '#5E83F2'}}>
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
          zIndex: 10,
        }}
        onPress={() => navigation.navigate('aggregator')}>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Addbutton.png')}></Image>
      </TouchableOpacity>
      <View style={{backgroundColor: '#5E83F2', opacity: 1, marginBottom: -12}}>
        <View>
          <View>
            <Image
              style={{maxWidth: '100%'}}
              source={require('./assets/graph_bg.png')}></Image>
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={navigation.openDrawer}
                style={{marginRight: 'auto'}}>
                <Image
                  source={require('./assets/icons-menu(white)(2).png')}></Image>
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {heading}
                </Text>
                {/* <Text style={{ textAlign: 'center' }}>All Banks - MAY 2020</Text> */}
              </View>
              <TouchableOpacity style={{marginLeft: 'auto'}}>
                <Image
                  style={{marginLeft: 'auto'}}
                  source={require('./assets/icons-filter-dark(white)(1).png')}></Image>
              </TouchableOpacity>

              {/* <Grid>
                                <Row>
                                    <Col size={2}>
                                        <Image source={require("./assets/icons-menu(white)(2).png")}></Image>
                                    </Col>
                                    <Col size={8}>
                                        <Text style={styles.pageHeading}>Accounts</Text>
                                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{heading}</Text>
                                    </Col>
                                    <Col size={2}>
                                        <View >
                                            <Image style={{ marginLeft: 'auto' }} source={require("./assets/icons-filter-dark(white)(1).png")}></Image>
                                        </View>
                                    </Col>
                                </Row>
                            </Grid> */}
            </View>

            <Animated.View style={{right: xValue}}>
              <Grid>
                <Row style={{width: '100%'}}>
                  <Col>
                    <View style={{flexDirection: 'row', flex: 1}}>
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
                            source={{uri: route.params.fiLogo}}></Image>
                        </View>
                      </View>
                      <View style={{paddingTop: hp('3.5%'), width: wp('62%')}}>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            marginLeft: -10,
                          }}>
                          {route.params.fiName}
                        </Text>
                      </View>
                      <View style={{paddingTop: hp('3%')}}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            alignItems: 'flex-end',
                          }}>
                          <TouchableOpacity onPress={() => moveAnimation()}>
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={require('./assets/icon-settings_white.png')}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          paddingTop: hp('1.5%'),
                          paddingLeft: wp('12%'),
                        }}>
                        <Grid>
                          <Row>
                            {/* <Col></Col> */}
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/savingACicon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Revoke Consent
                                </Text>
                              </View>
                            </Col>
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/cc_ac_icon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Send Funds
                                </Text>
                              </View>
                            </Col>
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/current_ac_icon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Request Funds
                                </Text>
                              </View>
                            </Col>
                            <Col></Col>
                          </Row>
                        </Grid>
                      </View>
                    </View>
                  </Col>
                </Row>
                <Row style={{marginTop: hp('-4%')}}>
                  <Col>
                    <View style={{paddingRight: wp('7%')}}>
                      <Text style={styles.tAssetLabel}>Assets in the bank</Text>
                      <NumberFormat
                        value={Number(route.params.totalAssetvalue).toFixed(2)}
                        thousandsGroupStyle="lakh"
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'₹'}
                        renderText={(value) => (
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 24,
                              textAlign: 'right',
                            }}>
                            {value}
                          </Text>
                        )}
                      />
                    </View>
                  </Col>
                </Row>
              </Grid>
            </Animated.View>
          </View>
        </View>
      </View>
      <View
        style={{
          height: hp('100%'),
          backgroundColor: 'white',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 15,
        }}>
        <View style={styles.line}></View>

        <ScrollView>
          <FlatList
            data={assetList}
            renderItem={({item}) => (
              <Collapse onToggle={() => getTransactions(item, assetList)}>
                <CollapseHeader>
                  <View
                    style={{
                      padding: hp('2%'),
                      paddingRight: 20,
                    }}>
                    <Grid>
                      <Row>
                        <Col size={2}>
                          <View>
                            <Image
                              resizeMode={'contain'}
                              style={{maxWidth: '100%', height: '100%'}}
                              source={{
                                uri:
                                  global.baseURL +
                                  'customer/' +
                                  item.assetDetails[34].value,
                              }}></Image>
                          </View>
                        </Col>
                        <Col size={5} style={{paddingTop: 5}}>
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
                          <Text style={{color: '#888888', fontSize: 12}}>
                            {' '}
                            {item.assetDetails[1].value}
                          </Text>
                        </Col>
                        <Col size={5} style={{paddingTop: 5}}>
                          <NumberFormat
                            value={Number(item.assetDetails[22].value).toFixed(
                              2,
                            )}
                            thousandsGroupStyle="lakh"
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'₹'}
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
                        </Col>
                      </Row>
                    </Grid>
                  </View>
                </CollapseHeader>

                <CollapseBody>
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
                              renderItem={({item}) => (
                                <Row style={{paddingBottom: 5}}>
                                  <Col size={2} style={{width: 30, height: 30}}>
                                    <Image
                                      resizeMode="contain"
                                      style={{maxWidth: '100%', height: '100%'}}
                                      source={{
                                        uri:
                                          global.baseURL +
                                          'customer/' +
                                          item.image,
                                      }}></Image>
                                  </Col>
                                  <Col size={5} style={{paddingTop: 5}}>
                                    <Text
                                      style={{color: '#5E83F2', fontSize: 12}}>
                                      {item.mode}
                                    </Text>
                                  </Col>
                                  <Col
                                    size={5}
                                    style={{paddingTop: 5, paddingRight: 10}}>
                                    <NumberFormat
                                      value={Number(item.amount).toFixed(2)}
                                      thousandsGroupStyle="lakh"
                                      displayType={'text'}
                                      thousandSeparator={true}
                                      prefix={'₹'}
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
                                    />
                                  </Col>
                                </Row>
                              )}></FlatList>
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
                </CollapseBody>
              </Collapse>
            )}></FlatList>
        </ScrollView>
      </View>
    </View>
  );
}

export default AccountsSubPage;
const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('6%'),
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalAsset: {
    paddingRight: 15,
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
    marginTop: hp('0.5%'),
  },
});
