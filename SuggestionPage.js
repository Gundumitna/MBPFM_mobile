import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Easing,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import Moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {scrollInterpolator, animatedStyles} from './CarouselAnimations';
import NumberFormat from 'react-number-format';
import Tags from 'react-native-tags';
import AmountDisplay from './AmountDisplay';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
const SuggestionPage = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [predictionData, setPredictionData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  const [collapseData, setCollapseData] = useState(false);
  const [flag, setFlag] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryStatus, setCategoryStatus] = useState(false);
  const [displayCategory, setDisplayCategory] = useState([]);
  const [carouselStatue, setCarouselStatue] = useState(false);
  const [start, setState] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      global.predictionList != undefined &&
      global.predictionList.length != 0
    ) {
      if (global.predictionStatus == true) {
        global.predictionList[0].collapseData = true;
        console.log(global.predictionIndex);
        let data = [...global.predictionList];
        let list = [];
        let c = 0;
        for (let d of data) {
          if (c < 5) {
            list.push(d);
            c = c + 1;
          }
        }
        setPredictionData(list);
        setFlag(true);
      } else {
        global.predictionList[0].collapseData = true;
        console.log(global.predictionIndex);
        let data = [...global.predictionList];
        setPredictionData(data);
        setFlag(true);
      }
    } else {
      global.predictionStatus = false;
      global.dashboardPredictionPage = false;
      dispatch(AppConfigActions.reloadPredictionList());
    }

    console.log(predictionData);
    return () => {
      setState(false);
    };
  }, [start]);
  useEffect(() => {
    console.log(predictionData);

    return () => {
      // if (global.predictionList.length != 0) {
      //     setPredictionData(global.predictionList)
      // } else {
      //     global.predictionStatus = false
      //     global.dashboardPredictionPage = false
      // }
      setFlag(false);
      // if (predictionData.length == 0) {
      //     global.predictionStatus = false
      // }
    };
  }, [flag]);
  useEffect(() => {
    // setFlag(true)
    console.log('index : ' + global.predictionIndex);
    // console.log(carousel)
    if (global.predictionList.length != 0) {
      if (global.predictionIndex != undefined) {
        carousel.snapToItem(global.predictionIndex + 1);

        // setIndex(global.predictionIndex)
      }
    }
    return () => {
      setCarouselStatue(false);
      global.predictionIndex = undefined;
    };
  }, [carouselStatue]);
  getPredictionData = () => {
    fetch(global.baseURL + 'customer/get/prediction/data/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        setPredictionData([]);
        if (responseJson.data == null) {
          global.predictionStatus = false;
          global.dashboardPredictionPage = false;
          dispatch(AppConfigActions.reloadPredictionList());
          global.predictionList = [];
        } else {
          if (responseJson.data.length != 0) {
            let i = 0;
            let data = [...responseJson.data];
            for (let d of data) {
              let ca = [];
              d.categoryStatus = false;
              d.collapseData = false;
              d.translate = new Animated.ValueXY({x: 0, y: 0});
              if (
                d.categoryDetailsModels != null &&
                d.categoryDetailsModels.length != 0 &&
                d.categoryDetailsModels != undefined
              )
                for (let c of d.categoryDetailsModels) {
                  if (c.categoryId != d.categoryId) {
                    let cc = {};
                    cc.color = '#AAAAAA';
                    cc.selectedCategory = false;
                    cc.categoryName = c.categoryName;
                    cc.categoryId = c.categoryId;
                    cc.categoryIcon = c.categoryIcon;
                    cc.amount = c.amount;
                    ca.push(cc);
                  }
                }
              d.categoryDetailsModels = ca;
            }
            if (index > data.length - 1) {
              data[index - 1].collapseData = true;
              setIndex(index - 1);
              setFlag(true);
            } else {
              data[index].collapseData = true;
            }

            setPredictionData(data);
            carousel.snapToItem(index);
            global.predictionList = data;
            console.log(responseJson.data);
            setFlag(true);
          } else {
            global.predictionStatus = false;
            global.dashboardPredictionPage = false;
            global.predictionList = [];
            dispatch(AppConfigActions.reloadPredictionList());
            setFlag(true);
          }
        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  skipFunction = (i) => {
    console.log(i);
    predictionData.splice(i, 1);
    setFlag(true);
    if (i == predictionData.length - 2) {
      setTimeout(() => {
        carousel.snapToItem(i - 1);
        predictionData[i - 1].collapseData = true;
        setIndex(i - 1);
      }, 10);
      setFlag(true);
    } else if (i != 0) {
      setTimeout(() => {
        carousel.snapToItem(i);
      }, 10);

      setFlag(true);
    } else {
      setTimeout(() => {
        carousel.snapToItem(i);
      }, 10);

      setFlag(true);
    }
    if (predictionData.length == 0) {
      global.predictionStatus = false;
      global.dashboardPredictionPage = false;
      dispatch(AppConfigActions.reloadPredictionList());
    }
  };
  yesFunction = (item) => {
    setFlag(true);
    console.log(item.transactionId + ',' + item.categoryId);
    console.log(
      'url: ' +
        global.baseURL +
        'customer/change/uncategorized/transaction/' +
        item.transactionId +
        '/' +
        item.categoryId,
    );
    fetch(
      global.baseURL +
        'customer/change/uncategorized/transaction/' +
        item.transactionId +
        '/' +
        item.categoryId,
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
        console.log('yes');
        console.log(responseJson.data);
        getPredictionData();
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  searchTextFunction = (event) => {
    console.log(event.nativeEvent.text);
    let textInLowerCase = event.nativeEvent.text.toLowerCase();
    let list = [...categoryList];
    let listToPush = [];
    if (event.nativeEvent.text != '') {
      for (let li of list) {
        let text = li.categoryName.toLowerCase();
        if (text.indexOf(textInLowerCase) > -1) {
          console.log('matched');
          listToPush.push(li);
        }
      }
      setDisplayCategory(listToPush);
      setFlag(true);
    } else {
      setDisplayCategory(list);
      setFlag(true);
    }
  };
  noFunction = (item) => {
    // setCategoryList(item.categoryDetailsModels)
    // setDisplayCategory(item.categoryDetailsModels)
    for (let p of predictionData) {
      if (p.transactionId == item.transactionId) {
        setCategoryList(p.categoryDetailsModels);
        setDisplayCategory(p.categoryDetailsModels);
        p.categoryStatus = true;
      } else {
        // setCategoryList([])
        // setDisplayCategory([])
        p.categoryStatus = false;
      }
    }
  };
  selectedCategory = (list, item, predictionList) => {
    console.log(item);
    for (let l of list) {
      if (l.categoryId == item.categoryId) {
        l.color = '#63CDD6';
        l.selectedCategory = true;
        console.log(predictionList.transactionId);
        console.log(l.categoryId);
        setFlag(true);
        // return
        // item.translateY = hp('-30%')
        fetch(
          global.baseURL +
            'customer/change/uncategorized/transaction/' +
            predictionList.transactionId +
            '/' +
            item.categoryId,
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
            getPredictionData();
            setSpinner(false);
          })
          .catch((error) => {
            console.error(error);
            setSpinner(false);
          });
      } else {
        item.color = '#AAAAAA';
        item.selectedCategory = false;
      }
    }
    setFlag(true);
  };
  back = (item) => {
    setCategoryList();
    setDisplayCategory();
    item.categoryStatus = false;
    for (let d of displayCategory) {
      d.selectedCategory = false;
      d.color = '#AAAAAA';
    }
    setFlag(true);
  };
  toggle = (item) => {
    if (item.collapseData) {
      item.collapseData = false;
    } else {
      item.collapseData = true;
    }
    setFlag(true);
  };
  toggleThroughIndex = (index) => {
    // if (predictionData[index].collapseData) {
    //     predictionData[index].collapseData = false

    // } else {
    for (let i = 0; i <= predictionData.length - 1; i++) {
      if (
        predictionData[index].transactionId == predictionData[i].transactionId
      ) {
        // if (predictionData[i].collapseData == true) {
        predictionData[i].collapseData = true;
        // }
      } else {
        predictionData[i].collapseData = false;
      }
    }
    // }

    // }
    setFlag(true);
  };
  _renderItem = ({item, index}) => {
    return (
      <Animated.View
        style={{backgroundColor: 'white', padding: 15, borderRadius: hp('1%')}}>
        <View style={{paddingBottom: hp('2%'), paddingTop: hp('2%')}}>
          <Text
            style={{
              color: '#000000',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {' '}
            Help us serve you better
          </Text>
          <Text
            style={{
              color: '#454F63',
              opacity: 0.7,
              fontSize: 12,
              textAlign: 'center',
            }}>
            Please confirm the categorization below
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: hp('1%'),
            borderTopWidth: 1,
            borderTopColor: '#cccccc',
          }}>
          <View style={{width: wp('12%'), height: hp('8%')}}>
            {item.icon != null && item.icon != '' ? (
              <Image
                style={{maxWidth: '100%', height: '100%'}}
                source={{
                  uri: global.baseURL + 'customer/' + item.icon,
                }}></Image>
            ) : (
              <Image
                resizeMode={'contain'}
                style={{maxWidth: '100%', height: '100%'}}
                source={require('./assets/uncategorized_Expense.png')}></Image>
            )}
          </View>
          <View style={{paddingLeft: hp('2%'), justifyContent: 'center'}}>
            {item.category != null && item.category != '' ? (
              <Text style={{color: '#454F63', fontSize: 14}}>
                {item.category}
              </Text>
            ) : (
              <Text style={{color: '#454F63', fontSize: 14}}>
                Uncategorized
              </Text>
            )}
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text
                style={{
                  color: '#F55485',
                  fontSize: 9,
                  marginRight: 3,
                  marginTop: 3,
                }}>
                {item.currency}
              </Text>
              <AmountDisplay
                style={{
                  color: '#F55485',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
                amount={Number(item.amount)}
                currency={item.currency}
              />
              {/* <NumberFormat
                value={item.amount}
                displayType={'text'}
                thousandsGroupStyle={global.thousandsGroupStyle}
                thousandSeparator={global.thousandSeparator}
                decimalScale={global.decimalScale}
                fixedDecimalScale={true}
                // prefix={'₹'}
                renderText={(value) => (
                  <Text
                    style={{
                      color: '#F55485',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    {value}
                  </Text>
                )}
              /> */}
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            padding: hp('1%'),
            backgroundColor: '#F6F6F6',
            borderRadius: hp('1%'),
          }}>
          <View style={{justifyContent: 'center'}}>
            <Text style={{color: '#454F63', fontSize: 14}}>
              {item.bankName}
            </Text>
            {item.transactionTimestamp != null &&
            item.transactionTimestamp != '' &&
            item.accountNumber != null &&
            item.accountNumber != '' ? (
              <Text style={{color: '#454F63', fontSize: 11, opacity: 0.7}}>
                {item.accountNumber.replace(/.(?=.{4})/g, 'x')} |{' '}
                {Moment(item.transactionTimestamp, 'YYYY-MM-DD,h:mm:ss').format(
                  global.dateFormat,
                )}
              </Text>
            ) : // <Text style={{ color: '#454F63', fontSize: 14, opacity: 0.7 }}>{item.category}</Text>
            null}
          </View>
          <View style={{width: 50, height: 50, marginLeft: 'auto'}}>
            <Image
              style={{maxWidth: '100%', height: '100%'}}
              source={{uri: item.bankIcon}}></Image>
          </View>
        </View>

        <View>
          {item.collapseData == false ? (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                backgroundColor: '#F6F6F6',
                width: '40%',
                paddingTop: 6,
                paddingBottom: 6,
                borderBottomLeftRadius: hp('1.5%'),
                borderBottomRightRadius: hp('1.5%'),
                top: -3,
              }}
              onPress={() => toggle(item)}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{color: '#454F63', fontSize: 11, textAlign: 'center'}}>
                  More Details{' '}
                </Text>
                <View style={{width: 15, height: 15}}>
                  <Image
                    style={{maxWidth: '100%', height: '100%'}}
                    source={require('./assets/down_arrow.png')}></Image>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        <View style={{backgroundColor: '#F6F6F6'}}>
          {item.collapseData ? (
            <View
              style={{
                padding: hp('1%'),
                borderRadius: hp('1%'),
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: '#cccccc',
                margin: 15,
                backgroundColor: 'white',
              }}>
              <View style={{flexDirection: 'row', paddingBottom: hp('1.5%')}}>
                <View>
                  <Text style={{color: '#454F63', fontSize: 11}}>
                    Ref # : {item.transactionId}{' '}
                  </Text>
                  <Text style={{color: '#454F63', fontSize: 11}}>
                    {item.bankName}-{item.mode}-{item.narration}
                  </Text>
                </View>
                <View style={{width: 15, height: 15, marginLeft: 'auto'}}>
                  <Image
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri: global.baseURL + 'customer/' + item.modeIcon,
                    }}></Image>
                </View>
              </View>
              {item.mapDescription != null && item.mapDescription != '' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    borderTopWidth: 0.5,
                    borderTopColor: '#cccccc',
                  }}>
                  <View style={{width: 30, height: 40, alignSelf: 'center'}}>
                    <Image
                      resizeMode={'contain'}
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/locationmap.png')}
                    />
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text
                      numberOfLines={2}
                      style={{
                        color: '#454F63',
                        fontSize: 11,
                        paddingRight: wp('6%'),
                      }}>
                      {item.mapDescription}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        <View>
          {item.collapseData == true ? (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                backgroundColor: '#F6F6F6',
                width: '40%',
                paddingTop: 6,
                paddingBottom: 6,
                borderBottomLeftRadius: hp('1.5%'),
                borderBottomRightRadius: hp('1.5%'),
                top: -3,
              }}
              onPress={() => toggle(item)}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text
                  style={{color: '#454F63', fontSize: 11, textAlign: 'center'}}>
                  Less Details{' '}
                </Text>
                <View style={{width: 15, height: 15}}>
                  <Image
                    style={{maxWidth: '100%', height: '100%'}}
                    source={require('./assets/top_arrow.png')}></Image>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        {item.categoryStatus == false ? (
          <View>
            <Text style={{textAlign: 'center'}}>
              <Text
                style={{
                  color: '#454F63',
                  fontSize: 14,
                  paddingTop: hp('1.5%'),
                  fontWeight: 'bold',
                }}>
                Is this transaction amount spent for{' '}
              </Text>
              <Text
                style={{
                  color: '#5E83F2',
                  fontSize: 14,
                  paddingTop: hp('1.5%'),
                  fontWeight: 'bold',
                }}>
                {' '}
                {item.category}{' '}
              </Text>
              <Text
                style={{
                  color: '#454F63',
                  fontSize: 14,
                  paddingTop: hp('1.5%'),
                  fontWeight: 'bold',
                }}>
                ?
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                paddingLeft: hp('3%'),
                paddingRight: hp('3%'),
              }}>
              {/* <View style={{ width: wp('10%') }}></View> */}
              {item.categoryId != null ? (
                <TouchableOpacity
                  onPress={() => yesFunction(item)}
                  style={{padding: 10, justifyContent: 'center'}}>
                  <View style={{width: 25, height: 25}}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/Check_icon.png')}></Image>
                  </View>
                  <Text>YES</Text>
                </TouchableOpacity>
              ) : null}
              {item.categoryDetailsModels != null &&
              item.categoryDetailsModels.length != 0 ? (
                <TouchableOpacity
                  onPress={() => noFunction(item)}
                  style={{padding: 10, marginLeft: 'auto'}}>
                  <View style={{width: 25, height: 25}}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/icons-x(red).png')}></Image>
                  </View>
                  <Text style={{paddingLeft: 5}}>No</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => skipFunction(index)}
                style={{padding: 10, marginLeft: 'auto'}}>
                <View style={{width: 25, height: 25}}>
                  <Image
                    style={{maxWidth: '100%', height: '100%'}}
                    source={require('./assets/skip_icon.png')}></Image>
                </View>
                <Text>SKIP</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginLeft: hp('2%')}}>
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor="grey"
                    // autoFocus={true}
                    // editable={item.categoryId != 0}
                    style={{width: wp('65%'), color: 'black', height: hp('7%')}}
                    keyboardType="visible-password"
                    onChange={(event) => searchTextFunction(event)}
                    // value={item.amount.toString()}
                  ></TextInput>
                </View>
                <View style={{marginLeft: 'auto', marginTop: hp('1%')}}>
                  <View style={{width: 25, height: 25}}>
                    <Image
                      resizeMode={'contain'}
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/search_icon.png')}></Image>
                  </View>
                </View>
              </View>

              <ScrollView
                style={{
                  backgroundColor: '#EEEEEE',
                  padding: 0,
                  margin: 0,
                  paddingTop: hp('2%'),
                  paddingBottom: hp('2%'),
                }}>
                <Tags
                  readonly={true}
                  textInputProps={false}
                  initialTags={displayCategory}
                  renderTag={({
                    tag,
                    index,
                    onPress,
                    deleteTagOnPress,
                    readonly,
                  }) => (
                    <TouchableOpacity
                      disabled={tag.selectedCategory}
                      onPress={() =>
                        selectedCategory(item.categoryDetailsModels, tag, item)
                      }
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        padding: 2,
                        margin: 4,
                        borderWidth: 0,
                        backgroundColor: tag.color,
                        borderRadius: 25,
                      }}>
                      <View style={{width: 30, height: 30}}>
                        <Image
                          resizeMode={'contain'}
                          style={{maxWidth: '100%', height: '100%'}}
                          source={{
                            uri:
                              global.baseURL + 'customer/' + tag.categoryIcon,
                          }}></Image>
                      </View>
                      <View style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            paddingLeft: hp('1%'),
                            paddingRight: hp('1.5%'),
                            color: 'white',
                          }}>
                          {tag.categoryName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  paddingLeft: hp('3%'),
                  paddingRight: hp('3%'),
                }}>
                {/* <View style={{ width: wp('10%') }}></View> */}
                <TouchableOpacity
                  onPress={() => back(item)}
                  style={{padding: 10, justifyContent: 'center'}}>
                  <View style={{width: 25, height: 25}}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/icons-back.png')}></Image>
                  </View>
                  <Text>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => skipFunction(index)}
                  style={{padding: 10, marginLeft: 'auto'}}>
                  <View style={{width: 25, height: 25}}>
                    <Image
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/skip_icon.png')}></Image>
                  </View>
                  <Text>SKIP</Text>
                </TouchableOpacity>
                {/* <View style={{ width: wp('25%') }}></View> */}
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Calculating your Finances...'}
        textStyle={styles.spinnerTextStyle}
      />

      <Modal
        isVisible={
          global.dashboardPredictionPage == true ||
          global.predictionStatus == true
        }
        style={{padding: 0, margin: 0}}>
        <TouchableOpacity
          onPress={() => {
            global.predictionStatus = false;
            global.dashboardPredictionPage = false;
            dispatch(AppConfigActions.reloadPredictionList());
            setFlag(true);
          }}
          style={{position: 'absolute', top: 20, right: 20, zIndex: 100}}>
          <View style={{width: 25, height: 25, marginTop: 20}}>
            <Text style={{color: 'white', fontSize: 24}}>X</Text>
          </View>
        </TouchableOpacity>
        <ScrollView>
          {notransaction == false ? (
            <View
              style={{
                height: height,
                justifyContent: 'center',
                alignSelf: 'center',
                flex: 1,
              }}>
              <Carousel
                contentContainerCustomStyle={{alignItems: 'center'}}
                ref={(c) => {
                  // console.log(c);
                  carousel = c;
                  setCarouselStatue(true);
                }}
                firstItem={
                  global.predictionIndex != undefined
                    ? global.predictionIndex
                    : index
                }
                // initialNumToRender={global.predictionIndex != undefined ? global.predictionIndex : index}

                initialScrollIndex={
                  global.predictionIndex != undefined
                    ? global.predictionIndex
                    : index
                }
                inactiveSlideOpacity={1}
                data={predictionData}
                // getItemLayout={(data, index) => ({ offset: viewportWidth * index, length: viewportWidth, index })}

                renderItem={_renderItem}
                sliderWidth={wp('100%')}
                itemWidth={wp('78%')}
                // containerCustomStyle={styles.carouselContainer}
                // inactiveSlideShift={0}
                layout={'default'}
                // onScroll={change}
                snapOnAndroid={true}
                removeClippedSubviews={false}
                onSnapToItem={(index) => {
                  setIndex(index);
                  toggleThroughIndex(index);
                }}
                // useScrollView={true}
              />
              <View
                style={{flexDirection: 'row', alignSelf: 'center', top: -40}}>
                {predictionData.map((i, k) => (
                  <Text
                    style={
                      k === index ? styles.activePagination : styles.pagination
                    }>
                    ⬤
                  </Text>
                ))}
              </View>
              {/* <Pagination
                                dotsLength={predictionData.length}
                                activeDotIndex={index}
                                // containerStyle={{ margin: 0 }}
                                dotStyle={{
                                    // width: 10,
                                    // height: 10,
                                    borderRadius: 5,

                                    // marginHorizontal: 10,
                                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                                }}
                                inactiveDotStyle={{
                                    // Define styles for inactive dots here
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            /> */}
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                paddingLeft: hp('5%'),
                paddingRight: hp('5%'),
                paddingTop: hp('15%'),
              }}>
              <Text
                style={{
                  color: '#454F63',
                  fontWeight: 'bold',
                  fontSize: 15,
                  textAlign: 'center',
                  paddingBottom: hp('1%'),
                }}>
                No data available
              </Text>
            </View>
          )}
        </ScrollView>
      </Modal>

      {/* <Overlay visible={true}
                    animationType="zoomIn" containerStyle={{ backgroundColor: 'rgba(15, 7, 8, 0.7)' }}
                    childrenWrapperStyle={{ backgroundColor: 'transparent' }}
                >
                    <FlatList
                        data={['1', '2']}
                        horizontal
                        style={{}}
                        renderItem={({ item }) =>
                            //             <Text style={styles.welcome}>
                            //                 Welcome to the React Native Playground!
                            // </Text>
    
                            <Text style={styles.welcome}>
                                Welcome to the React Native Playground!
             </Text>
    
                        }
                    />
    
                </Overlay> */}

      {/* <FlatList
                    data={['1', '2']}
                    horizontal
    
                    renderItem={({ item }) =>
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <Text>Hello</Text>
                            {/* <TouchableOpacity  >
                                <Text
                                    style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
                                >
                                    Cancel
    </Text>
                            </TouchableOpacity> */}
      {/* </View> */}
      {/* //                 }
    // /> */}
      {/* <View style={[styles.overlay, { height: 360 }]} /> */}
    </View>
  );
};
export default SuggestionPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    // height: 160,
    // textAlign: 'center',
    margin: 10,
    // width: width,
    // marginLeft: 0,
    backgroundColor: 'white',
  },
  // Flex to fill, position absolute,
  // Fixed left/top, and the width set to the window width
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: width,
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
  pagination: {
    color: 'white',
    margin: 3,
    opacity: 0.3,
  },
  activePagination: {
    color: 'white',
    margin: 3,
  },
});

// import React, { useState, useEffect } from 'react'
// import { ScrollView, View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native'
// import { Grid, Row, Col } from 'react-native-easy-grid'

// import Overlay from 'react-native-modal-overlay';
// import Modal from 'react-native-modal';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import Spinner from 'react-native-loading-spinner-overlay';
// const { width, height } = Dimensions.get('window');
// import Carousel from 'react-native-snap-carousel';
// import { scrollInterpolator, animatedStyles } from './CarouselAnimations';
// import NumberFormat from 'react-number-format';
// function SuggestionPage({ navigation }) {
//     const [index, setIndex] = useState(0)
//     const [predictionData, setPredictionData] = useState([])
//     const [spinner, setSpinner] = useState(false)
//     const [notransaction, setNotransaction] = useState(false)
//     useEffect(() => {
//         // const unsubscribe = navigation.addListener('focus', () => {
//         getPredictionData();

//         // });
//         // return unsubscribe;
//         // }, [navigation])
//     }, [])
//     getPredictionData = () => {
//         fetch(global.baseURL+'customer/get/prediction/data/' + global.loginID)
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 // return responseJson.movies;
//                 if (responseJson.data == null) {
//                     setNotransaction(true)
//                 } else {
//                     setNotransaction(false)
//                 }
//                 setPredictionData(responseJson.data);
//                 console.log(responseJson.data)
//                 setSpinner(false)
//             })
//             .catch((error) => {
//                 console.error(error);
//                 setSpinner(false)
//             })
//     }
//     _renderItem = ({ item }) => {

//         return (
//             <View style={{ width: wp('100%'), backgroundColor: 'white' }}>
//                 <View>
//                     <Text style={{ color: '#000000', textAlign: 'center', fontSize: 18 }}>A new transaction found !!!</Text>
//                     <Text style={{ color: '#454F63', opacity: 0.7, fontSize: 12, textAlign: 'center' }}>Please confirm the categorization below</Text>
//                 </View>
//                 {/* <View style={{ flexDirection: 'row' }}> */}
//                 {/* <Row>
//                         <Col size={2}> */}
//                 <View style={{ width: 50, height: 50 }}>
//                     <Image style={{ maxWidth: '100%', height: "100%" }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
//                 </View>
//                 {/* </Col>
//                         <Col size={10}> */}
//                 {/* <Text>{item.category}</Text>
//                     <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//                <NumberFormat
//                     value={item.amount}
//                     displayType={'text'}
//                     thousandsGroupStyle={global.thousandsGroupStyle}
//                     thousandSeparator={global.thousandSeparator}
//                     decimalScale={global.decimalScale}
//                     fixedDecimalScale={true}
//                     // prefix={'₹'}
//                     renderText={value => <Text style={styles.cardTotalAmount}>{value}</Text>}
//                 />
//             </View> * /}
//                     {/* </Col>
//                     </Row> */}
//                 {/* </View > */}
//             </View >
//         )

//     }
//     return (
//         <View style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center'
//         }}>
//             <Spinner
//                 visible={spinner}
//                 overlayColor='rgba(0, 0, 0, 0.65)'
//                 textContent={'Calculating your Finances...'}
//                 textStyle={styles.spinnerTextStyle}
//             />
//             <Modal isVisible={true}
//                 style={{ padding: 0, margin: 0 }}
//             >
//                 <ScrollView >
//                     {notransaction == false ?
//                         <View style={{ height: height, justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
//                             <Carousel
//                                 contentContainerCustomStyle={{ alignItems: 'center' }}
//                                 ref={(c) => carousel = c}
//                                 // data={predictionData}
//                                 data={['1', '2']}
//                                 // style={{ height: height }}
//                                 renderItem={_renderItem}
//                                 sliderWidth={width}
//                                 itemWidth={height}
//                                 // containerCustomStyle={styles.carouselContainer}
//                                 inactiveSlideShift={0}
//                                 layout={'default'}
//                                 // onScroll={change}
//                                 // layout={'tinder'} layoutCardOffset={'5'}
//                                 onSnapToItem={(index) => setIndex(index)}
//                                 // scrollInterpolator={scrollInterpolator}
//                                 // slideInterpolatedStyle={animatedStyles}
//                                 useScrollView={true}
//                             />
//                         </View>
//                         //                         <FlatList */}
//                         //                             data={predictionData}
//                         //                             // data={['1', '2']}
//                         //                             horizontal
//                         //                             style={{
//                         //                                 // flex: 1,
//                         //                                 // align: 'center',
//                         //                                 height: height,
//                         //                                 width: width,
//                         //                                 top: hp('24%')
//                         //                                 // justifyContent: 'center'
//                         //                             }}
//                         //                             renderItem={({ item, index }) =>
//                         //                                 <View style={{ width: predictionData.length == 1 ? wp('90%') : wp('80%') }}>
//                         //                                     <Text style={styles.welcome}>
//                         //                                         Welcome to the React Native Playground!
//                         //  </Text>
//                         //                                 </View>
//                         //                             }
//                         //                         />
//                         :
//                         <View style={{ width: '100%', paddingLeft: hp('5%'), paddingRight: hp('5%'), paddingTop: hp('15%') }}>
//                             <Text style={{ color: '#454F63', fontWeight: 'bold', fontSize: 15, textAlign: 'center', paddingBottom: hp('1%') }}>No data available</Text>

//                         </View>
//                     }
//                 </ScrollView>
//             </Modal>
//             {/* <Overlay visible={true}
//                 animationType="zoomIn" containerStyle={{ backgroundColor: 'rgba(15, 7, 8, 0.7)' }}
//                 childrenWrapperStyle={{ backgroundColor: 'transparent' }}
//             >
//                 <FlatList
//                     data={['1', '2']}
//                     horizontal
//                     style={{}}
//                     renderItem={({ item }) =>
//                         //             <Text style={styles.welcome}>
//                         //                 Welcome to the React Native Playground!
//                         // </Text>

//                         <Text style={styles.welcome}>
//                             Welcome to the React Native Playground!
//          </Text>

//                     }
//                 />

//             </Overlay> */}

//             {/* <FlatList
//                 data={['1', '2']}
//                 horizontal

//                 renderItem={({ item }) =>
//                     <View style={{ flex: 1, backgroundColor: 'white' }}>
//                         <Text>Hello</Text>
//                         {/* <TouchableOpacity  >
//                             <Text
//                                 style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
//                             >
//                                 Cancel
// </Text>
//                         </TouchableOpacity> */}
//             {/* </View> */}
//             {/* //                 }
// // /> */}
//             {/* <View style={[styles.overlay, { height: 360 }]} /> */}
//         </View >
//     )
// }
// export default SuggestionPage
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     welcome: {
//         fontSize: 20,
//         // height: 160,
//         // textAlign: 'center',
//         margin: 10,
//         // width: width,
//         // marginLeft: 0,
//         backgroundColor: 'white'
//     },
//     // Flex to fill, position absolute,
//     // Fixed left/top, and the width set to the window width
//     overlay: {
//         flex: 1,
//         position: 'absolute',
//         left: 0,
//         top: 0,
//         opacity: 0.5,
//         backgroundColor: 'black',
//         width: width
//     },
//     spinnerTextStyle: {
//         color: 'white',
//         fontSize: 15
//     }
// });

// {/* <Text style={[styles.cardTotalAmount, { fontSize: 11, marginTop: 'auto', marginTop: 5, marginRight: 3 }]}>{customerPreferredCurrency}</Text> */ }

// for (let d of data) {
//     let ca = []
//     d.categoryStatus = false
//     d.collapseData = false
//     for (let c of d.categoryDetailsModels) {

//         if (c.categoryId != d.categoryId) {
//             let cc = {}
//             cc.color = '#AAAAAA'
//             cc.selectedCategory = false
//             cc.categoryName = c.categoryName
//             cc.categoryId == c.categoryId
//             cc.categoryIcon = c.categoryIcon
//             cc.amount = c.amount
//             ca.push(cc)
//         }
//     }
//     d.categoryDetailsModels = ca
// }
