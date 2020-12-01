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
import Spinner from 'react-native-loading-spinner-overlay';
import AmountDisplay from './AmountDisplay';

function UncategorizedTransactionPage({navigation}) {
  let ls = require('react-native-local-storage');
  const [list, setList] = useState([]);
  const [notransaction, setNotransaction] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    console.log('rendered');
  }, [notransaction]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNotransaction(false);

      getDisplayData();
    });
    return unsubscribe;
  }, [navigation]);
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
      console.log(JSON.stringify(postData));
      fetch(
        global.baseURL + 'customer/get/transaction/all/UC/' + global.loginID,
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
          console.log(responseJson.data);
          setList(responseJson.data.responseList);
          if (responseJson.data.responseList == null) {
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

  selectedData = (item) => {
    setSpinner(true);
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({
            statementData: item,
            reDirectTo: 'uncategorizedTransaction',
          });
          navigation.navigate('transactionPage', {
            statementData: responseJson.data[0],
            reDirectTo: 'uncategorizedTransaction',
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
            reDirectTo: 'uncategorizedTransaction',
            splitList: Data,
          });
          navigation.navigate('transactionPage', {
            statementData: parentData,
            reDirectTo: 'uncategorizedTransaction',
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
          bottom: hp('3%'),
          right: hp('3%'),
          zIndex: 10,
        }}>
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
              onPress={() => navigation.navigate('dashboard')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Uncategorized Transactions</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#5E83F2',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 20,
          marginTop: -140,
          flex: 2,
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
                      style={{
                        paddingTop: hp('0.8%'),
                        paddingLeft: hp('0.8%'),
                        paddingBottom: hp('3%'),
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
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 11,
                              marginTop: 3,
                              marginRight: 3,
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
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{color: 'white', fontSize: 18}}>
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
                            style={{maxWidth: '100%', height: '100%'}}
                            source={{uri: item.bankIcon}}></Image>
                        </View>
                      </Col>
                    </Row>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}></FlatList>
            ) : (
              <View style={{width: '100%', paddingTop: hp('15%')}}>
                {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>No entries to show</Text> */}
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    paddingBottom: hp('1%'),
                  }}>
                  You are all caught up!!
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                  }}>
                  Nothing to categorise now!!
                </Text>
              </View>
            )}
          </Grid>
        </ScrollView>
      </View>
    </View>
  );
}

export default UncategorizedTransactionPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('3.5%'),
    width: wp('100%'),
    flex: 0.2,
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    // paddingTop: hp("2%")
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 21,
    paddingTop: hp('0.5%'),
  },
  backBtn: {
    paddingTop: hp('1%'),
    zIndex: 10,
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
    // marginTop: hp('0.5%')
  },
});
