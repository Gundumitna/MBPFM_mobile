import React, {useState, useEffect, createRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList} from 'react-native-gesture-handler';
import Moment from 'moment';
import ToggleSwitch from 'toggle-switch-react-native';
function MainIncomeExpensePage({route, navigation}) {
  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [notransaction, setNotransaction] = useState(false);
  const [typeIcon, setTypeIcon] = useState('');
  const [chartList, setChartList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [flag, setFlag] = useState(false);
  const [title, setTitle] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const [dataToSend, setDataToSend] = useState('all');
  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);
  useEffect(() => {
    console.log('rendered');
  }, [notransaction]);
  useEffect(() => {
    console.log('rendered');
  }, [!isEnabled]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params.type);
      console.log(route.params.totalAmount);
      setTotalAmt(route.params.totalAmount);
      setNotransaction(false);
      if (route.params.type == 'expense') {
        setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==');
        setTitle('All Expense');
      } else if (route.params.type == 'income') {
        setTypeIcon('QWxsX2NhdGVnb3JpZXNfaWNvbi5wbmc=');
        setTitle('All Income');
      }
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const toggleSwitch = () => {
    if (isEnabled == false) {
      setIsEnabled((previousState) => !previousState);
      let li = [...originalList];
      setList(li);
      setTotalAmt(route.params.totalAmount);
      // list = originalList
      setDataToSend('all');
      console.log(list);
      if (route.params.type == 'expense') {
        setTitle('All Expense');
        setTypeIcon('YWxsX0luY29tZV9pY29uLnBuZw==');
      } else if (route.params.type == 'income') {
        setTitle('All Income');
        setTypeIcon('QWxsX2NhdGVnb3JpZXNfaWNvbi5wbmc=');
      }
      let clist = [...chartList];
      for (let cLi of clist) {
        cLi.bgColor = '#DFE4FB';
      }
      setFlag(true);
    }
  };
  getData = () => {
    getChartData();
    getTransactionList();
  };
  getChartData = () => {
    let type = '';
    if (route.params.type == 'expense') {
      type = 'E';
    } else if (route.params.type == 'income') {
      type = 'I';
    }
    fetch(
      global.baseURL +
        'customer/dashboard/barChart/' +
        type +
        '/' +
        global.loginID,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: 'null',
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        let d = [...responseJson.data];

        d.sort(function (a, b) {
          return b.amount - a.amount;
        });
        console.log(d[0].percentage);
        // console.log(d)
        let t = 0;
        // for (let li of d) {
        //     t = t + li.percentage
        // }
        let list = [];
        for (let li of d) {
          let data = {};
          data.categoryId = li.categoryId;
          data.categoryName = li.categoryName;
          data.amount = li.amount;
          data.bgColor = '#DFE4FB';
          // data.height = (li.percentage - 13).toFixed(2) + '%'
          data.height = (li.percentage / d[0].percentage) * 100 + '%';
          data.marginTop = 100 - (li.percentage / d[0].percentage) * 100;
          data.percentage = li.percentage.toFixed(2) + '%';
          data.categoryIcon = li.categoryIcon;
          list.push(data);
        }
        console.log(list);
        setChartList(list);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  getTransactionList = () => {
    let type = '';
    if (route.params.type == 'expense') {
      type = 'E';
    } else if (route.params.type == 'income') {
      type = 'I';
    }
    fetch(global.baseURL + 'customer/get/transaction/all/' + type, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: 'null',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson.data)
        setList(responseJson.data);
        setOriginalList(responseJson.data);
        if (responseJson.data == null) {
          setNotransaction(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  filterData = (item) => {
    let list = [...originalList];
    console.log(item);
    setNotransaction(false);
    setTitle(item.categoryName);
    setTypeIcon(item.categoryIcon);
    setDataToSend(item.categoryId);
    let clist = [...chartList];
    for (let cLi of clist) {
      if (item.categoryId == cLi.categoryId) {
        cLi.bgColor = '#5E83F2';
      } else {
        cLi.bgColor = '#DFE4FB';
      }
    }

    let d = [];
    let a = 0;
    for (let li of list) {
      if (item.categoryId == li.categoryId) {
        d.push(li);
        a = a + li.amount;
      }
    }
    setTotalAmt(a);
    if (d.length != 0) {
      setList(d);
      setIsEnabled(false);
    } else {
      setNotransaction(true);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'white',
        zIndex: 1,
      }}>
      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 10,
        }}
        onPress={() => navigation.navigate('aggregator')}>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Download_icon.png')}></Image>
      </TouchableOpacity>
      <View style={styles.layer1}>
        <View>
          <View style={{zIndex: 1}}>
            <Image
              style={{maxWidth: '100%'}}
              source={require('./assets/graph_bg_white(short).png')}></Image>
          </View>
          <View style={styles.container}>
            <View style={styles.header}>
              <Grid>
                <Row>
                  <Col size={2}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('dashboard')}>
                      <Image
                        source={require('./assets/icons-menu(dark).png')}></Image>
                    </TouchableOpacity>
                  </Col>
                  <Col size={8}>
                    <Text style={{textAlign: 'center'}}>
                      All Banks - APRIL 2020
                    </Text>
                  </Col>
                  <Col size={2}>
                    <View>
                      <Image
                        style={{marginLeft: 'auto'}}
                        source={require('./assets/icons-filter-dark(dark).png')}></Image>
                    </View>
                  </Col>
                </Row>
              </Grid>
            </View>
            <Row>
              <Col size={10}>
                <View>
                  {route.params.type == 'expense' ? (
                    <Text
                      style={{
                        paddingLeft: hp('3%'),
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 25,
                      }}>
                      Expense
                    </Text>
                  ) : (
                    <Text
                      style={{
                        paddingLeft: hp('3%'),
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 25,
                      }}>
                      Income
                    </Text>
                  )}
                </View>
              </Col>
            </Row>
          </View>
        </View>
        <View>
          <Row>
            <Col size={10} style={{marginLeft: 'auto'}}>
              {route.params.type == 'expense' ? (
                <Text
                  style={{
                    marginRight: 10,
                    color: '#454F63',
                    textAlign: 'right',
                    marginTop: hp('-2%'),
                    fontSize: 15,
                  }}>
                  All Expense
                </Text>
              ) : (
                <Text
                  style={{
                    marginRight: 10,
                    color: '#454F63',
                    marginTop: hp('-2%'),
                    textAlign: 'right',
                    fontSize: 15,
                  }}>
                  All Income
                </Text>
              )}
            </Col>

            <Col size={2} style={{paddingRight: hp('3%')}}>
              <ToggleSwitch
                isOn={isEnabled}
                onColor="#63CDD6"
                offColor="#767577"
                // label="Mark it as Expense?"
                // labelStyle={{ color: "black", fontWeight: "500" }}
                size="medium"
                onToggle={() => toggleSwitch()}
              />
            </Col>
          </Row>
        </View>
        {/* <View > */}
        <FlatList
          horizontal
          // contentOffset={}
          // scrollToOffset={chartList.length}
          style={{
            marginLeft: hp('2%'),
            marginRight: hp('2%'),
            // transform: [{
            //     rotate: "-180deg"
            // }],
            marginBottom: -15,
            marginTop: hp('-4%'),
            position: 'absolute',
            bottom: 20,
            // height: hp('60%')
          }}
          // initialScrollIndex={0}

          showsHorizontalScrollIndicator={false}
          data={chartList}
          // ref={(ref) => { this.flatListRef = ref; }}
          // scrollToIndex={() => {
          //     flatListRef.scrollToIndex({ animated: true, index: chartList.lastIndexOf });
          // }}
          // scrollToIndex={chartList.lastIndexOf}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{paddingRight: hp('2%')}}
              onPress={() => filterData(item)}>
              <View>
                <Text
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    // transform: [{
                    //     rotate: "180deg"
                    // }]
                    fontSize: 12,
                    color: '#777',
                    marginTop: item.marginTop,
                  }}>
                  {item.percentage}
                </Text>
                <View
                  style={{
                    width: wp('9%'),
                    height: hp('9%'),
                    // transform: [{
                    //     rotate: "180deg"
                    // }],
                    // marginTop: item.marginTop,
                    marginBottom: hp('-5%'),
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    zIndex: 10,
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri: global.baseURL + 'customer/' + item.categoryIcon,
                    }}></Image>
                </View>
                <View
                  style={{
                    padding: hp('3%'),
                    height: item.height,
                    backgroundColor: item.bgColor,
                  }}></View>
                {/* <View style={{
                                    width: wp('8%'), height: hp('8%'),
                                    // transform: [{
                                    //     rotate: "180deg"
                                    // }],
                                    marginLeft: 'auto', marginRight: 'auto', marginTop: -25, zIndex: 10
                                }}>
                                    <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.categoryIcon }}></Image>
                                </View> */}
                {/* <Text style={{
                                    marginLeft: 'auto', marginRight: 'auto', marginTop: -10,
                                    // transform: [{
                                    //     rotate: "180deg"
                                    // }]
                                }}>{item.percentage}</Text> */}
              </View>
            </TouchableOpacity>
          )}></FlatList>
        {/* </View> */}
      </View>
      <View style={styles.layer2}>
        <View
          style={{
            height: hp('13%'),
            backgroundColor: '#DFE4FB',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            marginBottom: 30,
          }}>
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
              <Col size={10}>
                <View style={{paddingTop: hp('1%')}}>
                  {/* {route.params.type == 'expense' ?
                                        <Text style={{ color: '#5E83F2' }}>All Expense</Text> : */}
                  <Text style={{color: '#5E83F2'}}>{title}</Text>
                  {/* } */}
                </View>
              </Col>
            </Row>
            <Col style={{marginLeft: 'auto', paddingRight: hp('2%')}}>
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

        <TouchableOpacity
          style={styles.layer3}
          onPress={() =>
            navigation.navigate('incomeExpensePage', {
              type: route.params.type,
              totalAmount: route.params.totalAmount,
              listType: dataToSend,
            })
          }>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={list}
                renderItem={({item}) => (
                  <Row
                    style={{
                      paddingTop: hp('2%'),
                      paddingLeft: hp('2%'),
                      paddingBottom: 25.5,
                    }}>
                    <Col size={2} style={{alignItems: 'center'}}>
                      <View style={{width: 45, height: 45}}>
                        <Image
                          style={{maxWidth: '100%', height: '100%'}}
                          source={{
                            uri: global.baseURL + 'customer/' + item.icon,
                          }}></Image>
                      </View>
                    </Col>
                    <Col size={4.5}>
                      <Text style={{color: 'white', fontSize: 14}}>
                        {item.merchantName}
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
                )}></FlatList>
            ) : (
              <View style={{width: '100%', padding: hp('15%')}}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
                  No Transactions Available
                </Text>
              </View>
            )}
          </Grid>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default MainIncomeExpensePage;
const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
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
    backgroundColor: 'white',
    opacity: 1,
    paddingBottom: hp('2%'),
  },
  layer2: {
    height: hp('30%'),
    backgroundColor: '#DFE4FB',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  layer3: {
    flex: 1,
    backgroundColor: '#5E83F2',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 1000,
  },
  arrow: {
    // borderRightWidth: 15,
    borderBottomWidth: 12,
    borderRightWidth: 20,
    borderTopWidth: 12,
    borderTopColor: 'transparent',
    // borderRightColor: 'tomato',
    borderBottomColor: 'transparent',
    // borderRightColor: '#FFFFFF1A',
    // marginLeft: -30,
  },
});
