import React, { useState, useEffect } from 'react';
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
import { Grid, Row, Col } from 'react-native-easy-grid';
import {
    Collapse,
    CollapseHeader,
    CollapseBody,
} from 'accordion-collapse-react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import AmountDisplay from './AmountDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from './redux/actions';
import { useIsDrawerOpen } from '@react-navigation/drawer';
const SingleAccountPage = ({ navigation }) => {
    let ls = require('react-native-local-storage');
    const [totalList, setTotalList] = useState([]);
    const [bgC, setBgC] = useState('#5E83F2');
    const [assetList, setAssetList] = useState([]);
    const [asssetsList, setAsssetsList] = useState({});
    const [spinner, setSpinner] = useState(false);
    const [asset, setAsset] = useState([]);
    const [list, setList] = useState([]);
    const dispatch = useDispatch();
    const xValue = new Animated.Value(0);
    const { rightDrawerState } = useSelector((state) => state.appConfig);
    const isDrawerOpen = useIsDrawerOpen();
    const [flag, setFlag] = useState(false);
    const [heading, setHeading] = useState('');
    const [loader, setLoader] = useState(false);
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState(
        '',
    );
    useEffect(() => {

        if (rightDrawerState == 'reload' && isDrawerOpen == false) {
            if (spinner == false) {
                console.log('isDrawerOpen : ' + isDrawerOpen);
                // scrollRef.scrollToTop = true
                // scrollRef.scrollTo(0)
                console.log(scrollRef);

                getNoSpinnerAssetData();
            }
        }
        return () => {
            dispatch(AppConfigActions.resetRightDrawer());
        };
    }, [rightDrawerState == 'reload']);
    useEffect(() => {
        return () => {
            setFlag(false);
            // setLoader(false);
        };
    }, [flag == true]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            ls.save('selectedDrawerItem', 'accounts');
            getAssetData();
        });
        return unsubscribe;
    }, [navigation]);

    getAssetData = () => {
        setSpinner(true);
        let postData = {};
        let linkList = 0;
        ls.get('consentStatus').then((data) => {
            console.log('consentStatus : ' + data);
            if (data == 'true') {
                linkList = 1;
                // ls.remove('consentStatus')
            }
        });
        ls.get('filterData').then((data) => {
            postData.calenderSelectedFlag = 1;
            postData.month = data.month.id;
            postData.year = data.year.year;
            if (linkList == 1 || data.flag == false) {
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
            // fetch(global.baseURL+'customer/assets/250001', {
            fetch(global.baseURL + 'customer/assets/' + global.loginID, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson.data);
                    setTotalList(responseJson.data.assets);
                    let tAssetDetails = [];
                    let tAmount = 0;
                    setCustomerPreferredCurrency(responseJson.data.assets[0].userPreferrrdCurrency)
                    //   for (let at of responseJson.data.assets) {
                    //     at.bgColorSelected = '#5E83F2';
                    tAssetDetails.push(responseJson.data.assets);
                    // tAssetDetails[0].active = true;
                    // tAmount = tAmount + at.totalAssetvalue;
                    //     tAmount = tAmount + at.totalAssetValueInUserPreferredCurrency;
                    //   }
                    //   let bankLi = [];
                    //   for (let tAsset of tAssetDetails) {
                    //     bankLi.push(tAsset.fiName);
                    //   }
                    //   setBankList(bankLi);
                    setTotalAssetAmt(Number(responseJson.data.assets[0]));
                    //   tAssetDetails.sort(function (a, b) {
                    //     return (
                    //       b.totalAssetValueInUserPreferredCurrency -
                    //       a.totalAssetValueInUserPreferredCurrency
                    //     );
                    //   });
                    //   tAssetDetails[0].active = true;
                    setAsset(tAssetDetails);
                    setCustomerPreferredCurrency(tAssetDetails[0].userPreferrrdCurrency);

                    //   console.log('anusha in response' + Number(tAmount).toFixed(2));
                    //   let totalamt = Number(tAmount).toFixed(2);
                    //   let prevspreadangle = 0;
                    //   let selectedSpreadAngle =
                    //     (Number(tAssetDetails[0].totalAssetValueInUserPreferredCurrency) /
                    //       Number(totalamt)) *
                    //     360;
                    //   console.log('selected spread angle' + selectedSpreadAngle);
                    //   let rotationAngle = Number(prevspreadangle) + selectedSpreadAngle / 2;
                    //   let piechartRotation = 90 - Number(rotationAngle);
                    //   console.log('selected spread angle' + piechartRotation);
                    // let prevspreadangle = 0;
                    // let selectedSpreadAngle = Math.round(
                    //   (Number(tAssetDetails[0].totalAssetvalue) / Number(totalamt)) * 360,
                    // );
                    // console.log('selected spread angle' + selectedSpreadAngle);
                    // let rotationAngle =
                    //   Number(prevspreadangle) + Math.round(selectedSpreadAngle / 2);
                    // let piechartRotation =
                    //   360 - Number(selectedSpreadAngle) + rotationAngle;

                    //   setcurrentPosition(0);
                    //   setChartRotation(piechartRotation + 'deg');
                    //   setprevSpreadAngle(selectedSpreadAngle);
                    //   addAssetChartData(responseJson.data.assets);
                    // setCustomerPreferredCurrency(asset[0].userPreferrrdCurrency)
                    //   console.log(assetSeries);
                    //   console.log(assetSliceColor);
                    //   tAssetDetails[0].bgColorSelected = '#FFFFFF2E';
                    //   tAssetDetails[0].active = true;
                    setAsssetsList(tAssetDetails[0]);
                    console.log("**************************************************************************")
                    console.log(tAssetDetails[0])
                    //   setBgC(tAssetDetails[0].bgColor);
                    setAssetList(tAssetDetails[0].assets);
                    //   set_bgColorAnimation(
                    //     viewOpacity.interpolate({
                    //       // inputRange: [0, 1],
                    //       // outputRange: ['transparent', asssetsList.bgColor]
                    //       inputRange: [0, 0, 1],
                    //       // inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT],
                    //       outputRange: [
                    //         'transparent',
                    //         tAssetDetails[0].bgColor,
                    //         tAssetDetails[0].bgColor,
                    //       ],
                    //       // outputRange: ['transparent', 'blue', 'blue']
                    //       // extrapolate: 'clamp'
                    //     }),
                    //   );
                    setSpinner(false);
                })
                .catch((error) => {
                    setSpinner(false);
                    console.log(error);
                });
        });
    };
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
    return (
        <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#5E83F2' }}>
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
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/graph_bg.png')}></Image>
            </TouchableOpacity>
            <View style={{ backgroundColor: '#5E83F2' }}>
                <View>
                    <Image
                        style={{ maxWidth: '100%' }}
                        source={require('./assets/graph_bg.png')}></Image>
                </View>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={navigation.openDrawer}
                            style={{ marginRight: 'auto' }}>
                            <Image
                                source={require('./assets/icons-menu(white)(2).png')}
                            />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>
                                Accounts
                            </Text>
                            <Text style={{ textAlign: 'center', color: 'white' }}>
                                {heading}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                dispatch(AppConfigActions.toggleRightDrawer())
                            }
                            style={{ marginLeft: 'auto' }}>
                            <Image
                                style={{ marginLeft: 'auto' }}
                                source={require('./assets/icons-filter-dark(white)(1).png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Animated.View style={{ right: xValue }}>
                <Grid>
                    <Row style={{ width: '100%' }}>
                        <Col>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
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
                                            source={{ uri: asssetsList.fiLogo }}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{ paddingTop: hp('3.5%'), width: wp('62%') }}>
                                    <Text
                                        style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            marginLeft: -10,
                                            height: 100,
                                        }}>
                                        {asssetsList.fiName != null
                                            ? asssetsList.fiName
                                            : '               '}
                                    </Text>
                                </View>
                                <View style={{ paddingTop: hp('3%') }}>
                                    <View
                                        style={{
                                            width: 30,
                                            height: 30,
                                            alignItems: 'flex-end',
                                        }}>
                                        <TouchableOpacity onPress={() => moveAnimation()}>
                                            <Image
                                                style={{ maxWidth: '100%', height: '100%' }}
                                                source={require('./assets/icon-settings_white.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* <TouchableOpacity onPress={() => { console.log('clicked') }} style={{ alignItems: 'center', zIndex: 10 }}>
                                                <View style={{ width: 60, height: 60 }}>
                                                    <Image style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/consent_icon.png")}></Image>
                                                </View>
                                                <Text style={{ fontSize: 10, color: "white" }}>Revoke Consent</Text>
                                            </TouchableOpacity> */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        paddingTop: hp('1.5%'),
                                        marginLeft: wp('12%'),
                                    }}>
                                    {/* <Grid>
                                                    <Row>
                                                        <Col> */}
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: hp('2.5%'),
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => revokeConsent()}
                                            style={{ zIndex: 10, width: 60, height: 60 }}>
                                            {/* <View style={{ width: 60, height: 60 }}> */}
                                            <Image
                                                style={{ maxWidth: '100%', height: '100%' }}
                                                source={require('./assets/consent_icon.png')}
                                            />
                                            {/* </View> */}
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: 'white',
                                                height: 100,
                                            }}>
                                            Revoke Consent
                            </Text>
                                    </View>
                                    {/* </Col>
                                                        <Col> */}
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: hp('3%'),
                                        }}>
                                        <View style={{ width: 60, height: 60 }}>
                                            <Image
                                                style={{ maxWidth: '100%', height: '100%' }}
                                                source={require('./assets/Send_fund_icon.png')}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: 'white',
                                                height: 100,
                                            }}>
                                            Send Funds
                            </Text>
                                    </View>
                                    {/* </Col>
                                                        <Col> */}
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: hp('3%'),
                                        }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('requestFunds')
                                            }
                                            style={{ zIndex: 10, width: 60, height: 60 }}>
                                            <Image
                                                style={{ maxWidth: '100%', height: '100%' }}
                                                source={require('./assets/Request_fund_icon.png')}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                color: 'white',
                                                height: 100,
                                            }}>
                                            Request Funds
                            </Text>
                                    </View>
                                    {/* </Col>
                                                        <Col></Col>
                                                    </Row>
                                                </Grid> */}
                                </View>
                            </View>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: hp('8%'), height: 100 }}>
                        <Col>
                            <View style={{ paddingRight: wp('7%') }}>
                                <Text style={[styles.tAssetLabel]}>
                                    Assets in the bank
                        </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                    }}>
                                    {/*  */}
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 13,
                                            textAlign: 'right',
                                            marginTop: 3,
                                            marginRight: 3,
                                            height: 150,
                                        }}>
                                        {customerPreferredCurrency}
                                    </Text>
                                    <AmountDisplay
                                        style={{
                                            color: 'white',
                                            fontSize: 24,
                                            textAlign: 'right',
                                            height: 150,
                                        }}
                                        amount={
                                            asssetsList.totalAssetvalue != null
                                                ? Number(
                                                    asssetsList.totalAssetValueInUserPreferredCurrency,
                                                )
                                                : Number(0)
                                        }
                                        currency={customerPreferredCurrency}
                                    />
                                    {/* <NumberFormat
                            value={
                              asssetsList.totalAssetvalue != null
                                ? Number(
                                    asssetsList.totalAssetValueInUserPreferredCurrency,
                                  )
                                : Number(0)
                            }
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 24,
                                  textAlign: 'right',
                                  height: 150,
                                }}>
                                {value}
                              </Text>
                            )}
                          /> */}
                                </View>
                            </View>
                        </Col>
                    </Row>
                </Grid>
                {/* </Animated.View></Animated.View> */}
            </Animated.View>
            <View
                style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    paddingTop: 20,
                    marginTop: -70,
                    flex: 2,
                }}>
                {/* <View style={styles.line}></View> */}

                <ScrollView>
                    {/* <Grid>
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
                        style={{ maxWidth: '100%', height: '100%' }}
                        source={{ uri: item.bankIcon }}></Image>
                </View>
            </Col>
                    </Row>
                  </TouchableOpacity >
                )}
keyExtractor = {(item) => item.id}></FlatList >
            ) : (
    <View style={{ width: '100%', paddingTop: hp('15%') }}>
        {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>No entries to show</Text> */}
                    {/* <Text
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
          </Grid > */}
                    {/* * /} */}
                </ScrollView >
            </View >
        </View >

    )
}

export default SingleAccountPage
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        padding: hp('2%'),
        paddingTop: hp('3.5%'),
        width: wp('100%'),
        flex: 0.2,
    },
    header: {
        padding: hp('2%'),
        paddingTop: 0,
        paddingBottom: hp('2.5%'),
        flexDirection: 'row',
        zIndex: 1,
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
