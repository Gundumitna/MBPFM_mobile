import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
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
import {Card} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
function AccountSubStmtPage({route, navigation}) {
  let ls = require('react-native-local-storage');
  const [spinner, setSpinner] = useState(false);
  const [stmtList, setStmtList] = useState([]);
  const [orginal, setOrginal] = useState([]);
  const [category, setCategory] = useState([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const [flag, setFlag] = useState(false);
  const [status, setStatus] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  const [categoryFlag, setCategoryFlag] = useState(false);
  const [linkedAccountIdNo, setLinkedAccountIdNo] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (categoryFlag) {
        console.log(route.params.page);
      }
      ls.get('linkedAccountId').then((data) => {
        // console.log(data)
        setLinkedAccountIdNo(data);
      });
      console.log(linkedAccountIdNo);
      getDisplayData();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag == true]);
  useEffect(() => {
    console.log('rendered');
    return () => {
      setStatus(false);
    };
  }, [status]);
  getDisplayData = () => {
    getCategories();
    if (categoryFlag == true) {
      setCategoryFlag(false);
      let item = {};
      (item.categoryIcon = route.params.categoryIcon),
        (item.categoryId = route.params.categoryId);
      item.categoryName = route.params.category;

      item.type = route.params.categorType;

      filterData(item);
    } else {
      getStatementList();
    }
  };
  getStatementList = () => {
    setSpinner(true);

    setFilterStatus(false);
    setStmtList([]);
    // console.log(route.params.assetDataLinkedAccountId);
    let postData = {};
    ls.get('linkedAccountId').then((data) => {
      // console.log(data)
      // setLinkedAccountIdNo(data)
      postData.linkedAccountId = data;
    });
    ls.get('filterData').then((filterData) => {
      // postData.linkedAccountId = route.params.assetDataLinkedAccountId
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
          setStmtList(responseJson.data);
          setStatus(true);
          setOrginal(responseJson.data);
          console.log(stmtList);

          setSpinner(false);
        })
        .catch((error) => {
          console.error(error);
          setSpinner(false);
        });
    });
  };
  getCategories = () => {
    setSpinner(true);
    ls.get('linkedAccountId').then((data) => {
      // console.log(data)
      // setLinkedAccountIdNo(data)
      // postData.linkedAccountId = data

      // fetch(global.baseURL+'customer/get/popular/categories/' + data
      fetch(global.baseURL + 'customer/get/popular/categories/' + data)
        .then((response) => response.json())
        .then((responseJson) => {
          let list = [...responseJson.data];
          let allC = {};
          allC.categoryId = 0;
          allC.categoryIcon = 'YWxsX0luY29tZV9pY29uLnBuZw==';
          allC.count = null;
          allC.categoryName = 'All';
          list.unshift(allC);
          setCategory(list);
          setSpinner(false);
        })
        .catch((error) => {
          setSpinner(false);
          console.error(error);
        });
    });
  };
  filterData = (item) => {
    setSpinner(true);

    // setStmtList([])
    console.log('item');
    console.log(new Date());

    console.log(item);
    if (item.categoryId != 0) {
      console.log("other that  'all'");
      setFilterStatus(true);
      let postData = {};
      ls.get('linkedAccountId').then((data) => {
        postData.linkedAccountId = data;
      });
      ls.get('filterData').then((filterData) => {
        // postData.linkedAccountId = route.params.assetDataLinkedAccountId
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
          //     "linkedAccountId": route.params.assetDataLinkedAccountId,
          //     "month": null,
          //     "year": null,
          //     "categoryId": item.categoryId,
          //     "type": item.type
          // })
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.data);
            setStmtList(responseJson.data);
            setStatus(true);
            if (responseJson.data == null || responseJson.data.length == 0) {
              setNotransaction(true);
            } else {
              setNotransaction(false);
            }

            setSpinner(false);
          });
      });
    } else {
      console.log('all');
      setNotransaction(false);
      getStatementList();
      // setSpinner(false)
    }
  };
  // sendParentData = (item, list) => {
  //     setSpinner(true)
  //     let listData = [...list]
  //     let Data = []
  //     // console.log(item.transactionId)
  //     for (let li of listData) {
  //         // let d = {}
  //         // console.log(li)

  //         if (li.type == 'C') {
  //             console.log(li)
  //             console.log(item.transactionId)
  //             // let tId = li.transactionId.split('-')
  //             if (item.transactionId == li.parentId) {
  //                 Data.push(li)
  //             }
  //         }
  //     }
  //     // console.log(Data)
  //     navigation.navigate('transactionPage', { statementData: item, reDirectTo: 'accountSubStmtPage', splitList: Data, selectedItem: item })
  //     setSpinner(false)
  // }
  // sendData = (item) => {
  //     setSpinner(true)
  //     let listData = [...orginal]
  //     // let status = listData.hasOwnProperty('transactionId')
  //     // console.log(status)
  //     if (item.parentId != null) {
  //         let Data = []
  //         let parentData = {}
  //         for (let li of listData) {
  //             if (li.type == 'P') {
  //                 if (item.parentId == li.transactionId) {
  //                     parentData = li
  //                 }
  //             }
  //             if (li.type == 'C') {
  //                 if (item.parentId == li.parentId) {
  //                     Data.push(li)
  //                 }
  //             }
  //         }
  //         console.log({ statementData: parentData, reDirectTo: 'accountSubStmtPage', splitList: Data })
  //         navigation.navigate('transactionPage', { statementData: parentData, reDirectTo: 'accountSubStmtPage', splitList: Data, selectedItem: item })
  //         setSpinner(false)
  //     } else {
  //         console.log({ statementData: item, reDirectTo: 'accountSubStmtPage' })
  //         navigation.navigate('transactionPage', { statementData: item, reDirectTo: 'accountSubStmtPage', selectedItem: item })
  //         setSpinner(false)
  //     }
  //     // setSpinner(false)
  // }
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
            reDirectTo: 'accountSubStmtPage',
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
            reDirectTo: 'accountSubStmtPage',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'accountSubStmtPage',
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
  clickedCategoryFilter = () => {
    setCategoryFlag(true);
    navigation.navigate('categoriesPage', {
      reNavigateTo: 'accountSubStmtPage',
      reDirectTo: 'accountSubStmtPage',
    });
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
              style={styles.backBtn}
              onPress={() => navigation.navigate('accountStatementPage')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Statement</Text>
            </View>
          </View>

          <View>
            <Grid>
              <Row
                style={{
                  padding: hp('4%'),
                  paddingBottom: hp('-3%'),
                  paddingTop: hp('2%'),
                  paddingLeft: wp('4.5%'),
                }}>
                <Col>
                  <Text
                    style={{
                      color: '#454F63',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                    Popular Categories
                  </Text>
                </Col>
                <Col>
                  <TouchableOpacity onPress={() => clickedCategoryFilter()}>
                    <Image
                      style={{marginLeft: 'auto'}}
                      source={require('./assets/icons-filter-dark(dark).png')}></Image>
                  </TouchableOpacity>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={category}
                    renderItem={({item}) => (
                      <TouchableOpacity onPress={() => filterData(item)}>
                        <Card
                          containerStyle={{
                            borderRadius: 12,
                            padding: 10,
                            paddingLeft: 15,
                            paddingRight: 15,
                          }}>
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
                      </TouchableOpacity>
                    )}></FlatList>
                </Col>
              </Row>
            </Grid>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#5E83F2',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 20,
          height: hp('100%'),
          marginTop: hp('5.5%'),
          flex: 1,
        }}>
        <View style={styles.line}></View>
        <ScrollView>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={stmtList}
                renderItem={({item}) => (
                  <View>
                    <View>
                      {filterStatus == true ? (
                        <TouchableOpacity onPress={() => dataSelected(item)}>
                          <Row
                            style={
                              item.notAExpense == true
                                ? styles.transRowNE
                                : styles.transRow
                            }>
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
                              <NumberFormat
                                value={Number(item.amount).toFixed(2)}
                                thousandsGroupStyle="lakh"
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'₹'}
                                renderText={(value) => (
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View>
                      {item.type == 'S' && filterStatus == false ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('transactionPage', {
                              statementData: item,
                              reDirectTo: 'accountSubStmtPage',
                              selectedItem: item,
                            })
                          }>
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
                              <NumberFormat
                                value={Number(item.amount).toFixed(2)}
                                thousandsGroupStyle="lakh"
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'₹'}
                                renderText={(value) => (
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View>
                      {item.type == 'P' && filterStatus == false ? (
                        // <TouchableOpacity style={{ zIndex: 1 }} onPress={() => navigation.navigate('transactionPage', { statementData: item, reDirectTo: 'accountSubStmtPage' })}>
                        <TouchableOpacity onPress={() => dataSelected(item)}>
                          <Row style={styles.transRow}>
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
                              <NumberFormat
                                value={Number(item.amount).toFixed(2)}
                                thousandsGroupStyle="lakh"
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'₹'}
                                renderText={(value) => (
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </Col>
                          </Row>
                          <View
                            style={{
                              width: 40,
                              height: 40,
                              alignSelf: 'center',
                              position: 'absolute',
                              bottom: -10,
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
                        <TouchableOpacity
                          style={{zIndex: 0}}
                          disabled
                          onPress={() =>
                            navigation.navigate('transactionPage', {
                              statementData: item,
                              reDirectTo: 'accountSubStmtPage',
                              selectedItem: item,
                            })
                          }>
                          <Row
                            style={
                              item.notAExpense != null &&
                              item.notAExpense == true
                                ? styles.transRowNEC
                                : styles.transRowC
                            }>
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
                              <NumberFormat
                                value={Number(item.amount).toFixed(2)}
                                thousandsGroupStyle="lakh"
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'₹'}
                                renderText={(value) => (
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    {value}
                                  </Text>
                                )}
                              />
                            </Col>
                          </Row>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}></FlatList>
            ) : (
              <View style={{width: '100%', paddingTop: hp('15%')}}>
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
        </ScrollView>
      </View>
    </View>
  );
}

export default AccountSubStmtPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('6%'),
    width: wp('100%'),
    flex: 5,
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
  transRow: {
    padding: hp('2%'),
    paddingBottom: hp('0.5%'),
  },
  transRowC: {
    padding: hp('2%'),
    paddingBottom: 25.5,
    backgroundColor: '#587BE6',
    borderLeftColor: '#F22973',
    borderLeftWidth: 5,
    // zIndex: 1
  },
  transRowNEC: {
    padding: hp('2%'),
    paddingBottom: 25.5,
    backgroundColor: '#587BE6',
    borderLeftColor: '#F22973',
    borderLeftWidth: 5,
    opacity: 0.5,
  },
  transRowNE: {
    padding: hp('2%'),
    paddingBottom: hp('0.5%'),
    opacity: 0.5,
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
    marginTop: hp('0.5%'),
  },
});
