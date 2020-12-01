import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';

function SplitTransactionPage({route, navigation}) {
  const [spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const [slitList, setSlitList] = useState([]);
  const [status, setStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [count, setCount] = useState(0);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const currencyMaster = useSelector((state) => state.currencyMaster);

  useEffect(() => {
    console.log(route.params.item);
    console.log(route.params.statementData.categoryId);
    console.log(route.params.splitList);
    setSlitList([]);
    setTotalAmount(0);

    if (route.params.splitList != undefined && route.params.splitList != null) {
      setSpinner(true);
      let ta = 0;
      let sList = [];

      for (let li of route.params.splitList) {
        let list = {};
        setCount(count + 1);
        console.log(count);
        list.id = count;
        list.bgColor = '#63CDD6';
        list.icon = li.icon;
        list.amount = li.amount;
        list.category = li.category;
        list.categoryId = li.categoryId;
        list.transactionId = li.transactionId;
        list.notAExpense = li.notAExpense;
        // list.change = false
        // if(li.notAExpense){
        //     list.changedFlag = 1
        // }else{
        list.changedFlag = 0;
        // }
        list.type = 'old';
        sList.push(list);
        ta = ta + li.amount;
      }

      setSlitList(sList);
      console.log(slitList);
      console.log(ta);
      setTotalAmount(ta);
      setTimeout(() => {
        setSpinner(false);
      }, 100);
    } else {
      let sList = [];
      let list = {};
      setCount(count + 1);
      console.log(count);
      list.id = count;
      list.bgColor = '#AAAAAA';
      list.icon = require('./assets/Categorize_small.png');
      list.amount = '';
      list.category = 'Category ?';
      list.categoryId = null;
      list.type = 'new';
      list.notAExpense = null;
      list.transactionId = null;
      list.changedFlag = 0;
      sList.push(list);
      setSlitList(sList);
      setTotalAmount(0);
    }
    //  else {
    //     let sList = [...slitList]
    //     let list = {}
    //     console.log(count);
    //     list.id = count
    //     list.bgColor = "#AAAAAA"
    //     list.icon = require("./assets/Categorize_small.png")
    //     list.amount = ''
    //     list.category = "Category ?"
    //     list.categoryId = null
    //     list.type = 'new'
    //     list.notAExpense = null
    //     list.transactionId = null
    //     list.changedFlag = 0
    //     sList.push(list)
    //     setSlitList(sList)
    // }
    // setSlitList(sList)
    // console.log(slitList)
  }, []);
  useEffect(() => {
    return () => {
      setStatus(false);
    };
  }, [status]);
  // useEffect(() => {
  //     console.log('save button enabled')
  //     // return () => {
  //     //     setDisableSaveBtn(false)

  //     // }
  // }, [setDisableSaveBtn == false])
  addList = () => {
    setSpinner(true);

    console.log('clicked on add list');
    setCount(count + 1);
    let list = {};
    console.log(count);
    list.id = count;
    list.bgColor = '#AAAAAA';
    list.icon = require('./assets/Categorize_small.png');
    list.amount = '';
    list.category = 'Category ?';
    list.categoryId = null;
    list.type = 'new';
    list.notAExpense = null;
    list.transactionId = null;
    list.changedFlag = 0;
    slitList.push(list);
    setStatus(true);
    console.log(slitList);
    setTimeout(() => {
      setSpinner(false);
    }, 100);
  };
  removeItem = (index, item, list) => {
    setSpinner(true);

    setTotalAmount(totalAmount - Number(item.amount));
    // let rD = []
    console.log(item.transactionId);

    if (item.type == 'old') {
      console.log(item.transactionId);
      itemsToRemove.push(item.transactionId);
    }
    // console.log(rD)
    // setItemsToRemove(rD)
    console.log(itemsToRemove);
    list.splice(index, 1);
    setSlitList(list);
    console.log(slitList);
    setStatus(true);
    setTimeout(() => {
      setSpinner(false);
    }, 100);
  };
  save = () => {
    setDisableSaveBtn(true);
    setSpinner(true);
    let errorCheck = false;
    let priceCheck = false;
    console.log(slitList);
    console.log(totalAmount);
    let data = [];
    let a = 0;
    let count = 0;
    for (let l of slitList) {
      if (l.categoryId == null) {
        errorCheck = true;
      }
      if (l.amount == 0 || l.amount == null) {
        priceCheck = true;
      }
      let s = {};
      (s.categoryId = l.categoryId), (s.amount = Number(l.amount));
      a = a + Number(l.amount);
      s.notAExpense = l.notAExpense;
      s.changedFlag = l.changedFlag;
      // if (l.change == true) {
      //     s.transactionId = null
      // } else {
      s.transactionId = l.transactionId;
      // }
      data.push(s);
    }
    // let type = ''
    // if (route.params.reDirectTo == 'incomeExpensePage' || route.params.reDirectTo == 'uncategorizedTransaction') {
    //     console.log('type : D')
    //     // console.log('type : N')
    //     type = 'D'
    //     // type = 'N'
    // } else {
    //     if (route.params.reDirectTo == 'accountSubStmtPage') {
    //         if (route.params.transType == 'single') {
    //             console.log('type : D')
    //             // console.log('type : N')
    //             type = 'D'
    //             // type = 'N'
    //         } else if (route.params.transType == 'parent') {
    //             console.log('type : N')
    //             // console.log('type : D')
    //             type = 'N'
    //             // type = 'D'
    //         }
    //     }

    // }
    if (errorCheck == false && priceCheck == false) {
      for (let d of data) {
        if (d.categoryId == route.params.statementData.categoryId) {
          d.amount = d.amount + (route.params.statementData.amount - a);
        } else {
          count = count + 1;
        }
      }
      if (data.length == count) {
        let s = {};
        s.categoryId = route.params.statementData.categoryId;
        s.amount = route.params.statementData.amount - a;
        data.push(s);
      }
      console.log(a);
      console.log(data);
      let splitData = {};
      splitData.transactionId = route.params.statementData.transactionId;
      splitData.categoryList = data;
      splitData.totalAmount = route.params.statementData.amount;
      console.log(JSON.stringify(splitData));
      if (a > route.params.statementData.amount) {
        setSpinner(false);
        setDisableSaveBtn(false);
        Alert.alert(
          'Alert',
          'Please split the amount within ' +
            '₹' +
            route.params.statementData.amount,
        );
      } else {
        // not using  fetch(global.baseURL+'customer/split/transaction/' + route.params.statementData.transactionId, {
        // fetch(global.baseURL+'customer/Split/transaction/u/' + route.params.statementData.transactionId, {
        fetch(
          global.baseURL +
            'customer/Split/transaction/u/' +
            route.params.statementData.transactionId,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(splitData),
          },
        )
          // .then((response) => {
          .then((responseJson) => {
            console.log(responseJson);

            setSpinner(false);
            setDisableSaveBtn(false);
            // navigation.navigate("transactionPage")

            navigation.navigate(route.params.reDirectTo);
          })
          .catch(() => {
            setSpinner(false);
            setDisableSaveBtn(false);
            console.log(error);
          });
        // }
      }
    } else if (errorCheck) {
      setDisableSaveBtn(false);
      setSpinner(false);
      Alert.alert('Alert', 'Please select category ');

      setStatus(true);
    } else if (priceCheck) {
      setDisableSaveBtn(false);
      setSpinner(false);
      Alert.alert('Alert', 'Please enter price ');

      setStatus(true);
    }
  };
  textEntered = (value, item) => {
    console.log(value.nativeEvent.text);
    let decimalAmt = value.nativeEvent.text.toString().split('.');
    if (decimalAmt[1] == undefined || decimalAmt[1].length < 3) {
      let ta = 0;
      let list = [...slitList];
      for (let s of list) {
        if (s.id == item.id) {
          item.amount = value.nativeEvent.text.trim();
          // s.change = true
        }
        ta = ta + Number(s.amount);
      }
      console.log(ta);
      setTotalAmount(ta);
      setSlitList(list);
      console.log(slitList);
      setStatus(true);
    }
  };
  // selectCategory = (item) => {
  //     // let list = [...slitList]
  //     // for (let s of list) {
  //     //     if (s.id == item.id) {

  //     //         s.change = true
  //     //     }

  //     // }
  //     // setSlitList(list)
  //     item.change = true
  //     navigation.navigate('categoriesPage', { reNavigateTo: "splitPage", item: item, statementData: route.params.statementData })
  // }
  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{height: hp('75%')}}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate(route.params.reDirectTo)}>
            <View>
              <Image source={require('./assets/icons-back.png')}></Image>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.heading}>Split Transaction</Text>
          </View>
        </View>
        <Grid>
          <Row style={{padding: hp('0.5%'), paddingTop: hp('4%')}}>
            <Col size={2} style={{alignItems: 'center'}}>
              <View style={{width: 45, height: 45}}>
                <Image
                  style={{maxWidth: '100%', height: '100%'}}
                  source={{
                    uri:
                      global.baseURL +
                      'customer/' +
                      route.params.statementData.icon,
                  }}></Image>
              </View>
            </Col>
            <Col size={5.5}>
              <Text style={{color: '#454F63', fontSize: 14}} numberOfLines={3}>
                {route.params.statementData.description}
              </Text>
              <Text style={{color: '#454F63', fontSize: 14, opacity: 0.7}}>
                {route.params.statementData.category} |{' '}
                {Moment(
                  route.params.statementData.transactionTimestamp,
                  'YYYY-MM-DD,h:mm:ss',
                ).format(global.dateFormat)}
              </Text>
            </Col>
            <Col size={4.5} style={{alignItems: 'flex-end', paddingRight: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 9,
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    marginTop: 3,
                    marginRight: 3,
                  }}>
                  {route.params.statementData.transactionCurrency}
                </Text>
                <NumberFormat
                  value={Number(route.params.statementData.amount)}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  // decimalScale={global.decimalScale}
                  decimalScale={
                    currencyMaster.currency[
                      route.params.statementData.transactionCurrency
                    ] != undefined
                      ? currencyMaster.currency[
                          route.params.statementData.transactionCurrency
                        ].decimalFormat
                      : 0
                  }
                  fixedDecimalScale={true}
                  // prefix={'₹'}
                  renderText={(value) => (
                    <Text style={{color: '#454F63', fontSize: 18}}>
                      {value}
                    </Text>
                  )}
                />
              </View>
            </Col>
          </Row>
        </Grid>
        <View style={{padding: hp('2%')}}>
          <Text
            style={{
              color: '#454F63',
              fontWeight: 'bold',
              fontSize: 18,
              paddingBottom: 10,
            }}>
            Split into
          </Text>
          <View style={{height: hp('50%')}}>
            <FlatList
              style={{flexGrow: 1}}
              data={slitList}
              renderItem={({item, index}) => (
                <Row style={{paddingBottom: 10}}>
                  <Col size={5.5}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('categoriesPage', {
                          reNavigateTo: 'splitPage',
                          item: item,
                          statementData: route.params.statementData,
                          splitList: slitList,
                        })
                      }>
                      <Row
                        style={{
                          borderWidth: 0,
                          backgroundColor: item.bgColor,
                          borderRadius: 25,
                          padding: 5,
                        }}>
                        <Col size={2.5}>
                          {item.bgColor == '#AAAAAA' ? (
                            <View>
                              <Image
                                resizeMode={'contain'}
                                style={{maxWidth: '100%', height: '100%'}}
                                source={item.icon}></Image>
                            </View>
                          ) : (
                            <View>
                              <Image
                                resizeMode={'contain'}
                                style={{maxWidth: '100%', height: '100%'}}
                                source={{
                                  uri: global.baseURL + 'customer/' + item.icon,
                                }}></Image>
                            </View>
                          )}
                        </Col>
                        <Col size={9.5}>
                          <Text style={{color: 'white', marginTop: -1}}>
                            {item.category}
                          </Text>
                        </Col>
                      </Row>
                    </TouchableOpacity>
                  </Col>
                  <Col size={0.5}></Col>
                  <Col size={5.5}>
                    {/* <NumberFormat
                                            value={Number(item.amount).toFixed(2)}
                                            thousandsGroupStyle="lakh"
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'₹'}
                                            renderText={value = <TextInput
                                                placeholder="0.00"
                                                style={{ borderBottomWidth: 1, borderBottomColor: '#cccc' }}
                                                keyboardType='numeric'
                                                onChange={(amount) => textEntered(amount, item)}
                                                value={item.amount.toString()}
                                            // defaultValue="0.00"
                                            ></TextInput>}
                                        /> */}
                    <TextInput
                      placeholder="0.00"
                      editable={item.categoryId != 0}
                      placeholderTextColor="grey"
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccc',
                        paddingBottom: hp('-0.5%'),
                        height: 25,
                        color: 'black',
                        textAlign: 'right',
                        paddingRight: 10,
                      }}
                      keyboardType="number-pad"
                      onChange={(amount) => textEntered(amount, item)}
                      value={item.amount.toString()}></TextInput>
                  </Col>
                  <Col size={1.5}>
                    {item.categoryId != 0 ? (
                      <TouchableOpacity
                        onPress={() => removeItem(index, item, slitList)}
                        style={{width: 25, height: 25}}>
                        <Image
                          resizeMode={'contain'}
                          style={{maxWidth: '100%', height: '100%'}}
                          source={require('./assets/Remove_icon.png')}></Image>
                      </TouchableOpacity>
                    ) : null}
                  </Col>
                </Row>
              )}></FlatList>
          </View>
          {totalAmount >= route.params.statementData.amount ? null : (
            <Row>
              <Col></Col>
              <TouchableOpacity
                onPress={() => addList()}
                style={{
                  padding: 20,
                  marginTop: 10,
                  borderWidth: 0,
                  backgroundColor: '#DFE4FB',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#5E83F2',
                    fontSize: 14,
                    marginTop: -10,
                    height: 20,
                  }}>
                  Add Category
                </Text>
              </TouchableOpacity>
            </Row>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={disableSaveBtn == true}
          onPress={() => save()}>
          <Text style={styles.footerBotton}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SplitTransactionPage;
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
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
