import React, { useState, useEffect, Fragment } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { Card } from 'react-native-elements';
import PieChart from 'react-native-pie-chart';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Carousel from 'react-native-snap-carousel';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from '../redux/actions';
import ProgressBar from 'react-native-progress/Bar';
import FusionCharts from 'react-native-fusioncharts';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Upshot from 'react-native-upshotsdk';
import Modal from 'react-native-modal';
import SuggestionPage from '../SuggestionPage';
import Overlay from 'react-native-modal-overlay';
import AmountDisplay from '../AmountDisplay';

function AssetBalancesCard(props) {
    const { rightDrawerState } = useSelector((state) => state.appConfig);
    const [loader, setLoader] = useState(true);
    const chart_wh = 106;
    const sliceColor = [
        "#5E83F2",
        "#63CDD6",
        "#F2A413",
        "#F22973",
        "#FCD6E2",
        "#CED9FB",
        "#FBE3B7",
        "#D0F0F3",
        "#C8C3FD",
        "#427087",
        "#FD8C60",
        "#D94545",
        "#731314",
        "#2C356C",
    ];
    const [flag, setFlag] = useState(false);
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
    const [assetBalance, setAssetBalance] = useState([]);
    const [assetBalanceSeries, setAssetBalanceSeries] = useState([]);
    const [assetBalanceSliceColor, setAssetBalanceSliceColor] = useState([]);
    const [assetBalanceLabel, setAssetBalanceLabel] = useState([]);
    const [start, setStart] = useState(true)
    const [spinner, setSpinner] = useState(false);
    let ls = require('react-native-local-storage');
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getData()
        })

        return unsubscribe;
    }, [props.navigation])
    useEffect(() => {
        if (rightDrawerState == 'reload') {
            getData()
        }
        return (() => { });
    }, [rightDrawerState == 'reload'])
    useEffect(() => {
        return () => {
            setFlag(false);
        };
    }, [flag]);
    const getData = () => {
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
        ls.get('filterData')
            .then((data) => {

                console.log('flag : ' + data.flag);
                if (data.month.id < new Date().getMonth() + 1) {
                    postData.calenderSelectedFlag = 1;
                } else {
                    postData.calenderSelectedFlag = 0;
                }
                postData.month = data.month.id;
                postData.year = data.year.year;
                if (linkList == 1 || data.flag == false) {
                    postData.linkedAccountIds = [];
                } else {
                    postData.linkedAccountIds = data.linkedAccountIds;
                }
                console.log(JSON.stringify(postData));
                console.log(global.loginID)
                fetch('http://63.142.252.161:8080/pfmv1/api/dashboard/asset/balances/' + global.loginID
                    , {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(postData),
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {

                        if (responseJson.data != null) {
                            setCustomerPreferredCurrency(responseJson.data.customerPreferredCurrency)
                            if (responseJson.data.assetWiseBalance != null && responseJson.data.assetWiseBalance.length != 0) {

                                let tAssetWBal = [];
                                for (let asset of responseJson.data.assetWiseBalance) {
                                    let a = {};
                                    a.assetType = asset.assetType;
                                    a.balance = asset.balance;
                                    a.color = undefined;
                                    a.userPreferedCurrency = asset.userPreferedCurrency;
                                    a.balanceInUserPreferredCurrency =
                                        asset.balanceInUserPreferredCurrency;
                                    tAssetWBal.push(a);
                                }
                                tAssetWBal.sort(function (a, b) {
                                    return (
                                        b.balanceInUserPreferredCurrency -
                                        a.balanceInUserPreferredCurrency
                                    );
                                });
                                console.log('******************************************************************');
                                console.log(tAssetWBal);
                                console.log('******************************************************************');
                                setAssetBalance(tAssetWBal);
                                addAssetBalChartData(responseJson.data.assetWiseBalance);
                                setFlag(true)
                                setSpinner(false)
                            }
                            else {
                                setAssetBalance([])
                                setAssetBalanceSeries([])
                                setAssetBalanceSliceColor([])
                                setFlag(true)
                                setSpinner(false)
                            }


                        } else {
                            setAssetBalance([])
                            setAssetBalanceSeries([])
                            setAssetBalanceSliceColor([])
                            setFlag(true)
                            setSpinner(false)
                        }

                    }).catch((error) => {
                        console.log(error)
                        setSpinner(false)
                    })
            })
    }
    addAssetBalChartData = (list) => {
        let d = [];
        let color = [];
        for (let e of list) {
            d.push(Number(e.balance));
        }
        if (d.length != []) {
            d.sort(function (a, b) {
                return b - a;
            });
            // console.log(d);
            setAssetBalanceSeries(d);
            for (let i = 0; i < assetBalance.length; i++) {
                if (i < sliceColor.length) {
                    color.push(sliceColor[i]);
                    assetBalance[i].color = sliceColor[i];
                } else {
                    // console.log('random color')
                    let c =
                        'rgb(' +
                        Math.floor(Math.random() * 256) +
                        ',' +
                        Math.floor(Math.random() * 256) +
                        ',' +
                        Math.floor(Math.random() * 256) +
                        ')';
                    color.push(c);
                    assetBalance[i].color = c;
                }
            }
            setAssetBalanceSliceColor(color);
        }
    };
    if (spinner) {
        return (

            <Card>
                <View style={{ height: hp('14%') }}>
                    <Text style={styles.cardTitle}>Asset Balances</Text>
                    <Text style={[styles.emptyList, { top: '-25%' }]}>
                        <ActivityIndicator size="small" color="#333333" />
                    </Text>
                </View>
            </Card >

        )
    } else {
        return (
            <>
                <TouchableOpacity disabled={assetBalance.length == 0}>
                    <Card containerStyle={styles.card}>
                        {spinner == false && assetBalance != null && assetBalance.length != 0 ? (
                            <Grid>
                                <Col style={{ paddingBottom: hp('0.5%') }}>
                                    <Text style={styles.cardTitle}>Asset Balances</Text>
                                </Col>
                                <Row style={{ paddingTop: 5, marginTop: 5 }}>
                                    <Col size={5}></Col>
                                    <Col size={4}>
                                        <View>
                                            <Text style={{ color: '#AAAAAA', fontSize: 11 }}>
                                                TYPE
                          </Text>
                                        </View>
                                    </Col>
                                    <Col size={3}>
                                        <View>
                                            <Text
                                                style={{
                                                    color: '#AAAAAA',
                                                    fontSize: 11,
                                                    textAlign: 'right',
                                                    marginLeft: 5,
                                                }}>
                                                BALANCE
                          </Text>
                                        </View>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col
                                        size={5}
                                        style={{
                                            marginTop: hp('-1.5%'),
                                        }}>
                                        <View>
                                            <PieChart
                                                chart_wh={chart_wh}
                                                series={assetBalanceSeries}
                                                sliceColor={assetBalanceSliceColor}
                                                doughnut={true}
                                                coverRadius={0.55}
                                                coverFill={'#FFF'}
                                            />
                                        </View>
                                    </Col>
                                    <Col size={7}>
                                        {assetBalance.length != 0 ? (
                                            <FlatList
                                                data={assetBalance}
                                                style={{ height: hp('14%') }}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        {index < 3 ? (
                                                            <Row>
                                                                <Col size={1}>
                                                                    <View
                                                                        style={{
                                                                            width: 10,
                                                                            height: 10,
                                                                            backgroundColor: item.color,
                                                                            marginTop: 6,
                                                                        }}></View>
                                                                </Col>
                                                                <Col size={5}>
                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={{
                                                                            width: '100%',
                                                                            color: '#888888',
                                                                            fontSize: 12,
                                                                            marginTop: 3,
                                                                        }}>
                                                                        {' '}
                                                                        {item.assetType}
                                                                    </Text>
                                                                </Col>
                                                                <Col size={6}>
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'flex-end',
                                                                        }}>
                                                                        <Text
                                                                            style={{
                                                                                color: '#888888',
                                                                                fontSize: 8,
                                                                                marginTop: 6,
                                                                            }}>
                                                                            {item.userPreferedCurrency}
                                                                        </Text>
                                                                        <AmountDisplay
                                                                            style={{
                                                                                color: '#888888',
                                                                                fontSize: 12,
                                                                                textAlign: 'right',
                                                                                marginTop: 5,
                                                                                marginLeft: 5,
                                                                            }}
                                                                            amount={Number(
                                                                                item.balanceInUserPreferredCurrency,
                                                                            )}
                                                                            currency={item.userPreferedCurrency}
                                                                        />

                                                                    </View>
                                                                </Col>
                                                            </Row>
                                                        ) : null}
                                                    </View>
                                                )}></FlatList>
                                        ) : (
                                                <View>
                                                    <Text>No Asset Balances Available</Text>
                                                </View>
                                            )}
                                        {assetBalance.length > 3 ? (
                                            <Row style={{ paddingBottom: hp('0.5%') }}>
                                                <Col>
                                                    <Text
                                                        style={{
                                                            color: '#888888',
                                                            fontSize: 12,
                                                            textAlign: 'right',
                                                        }}>
                                                        + {assetBalance.length - 3} more...
                              </Text>
                                                </Col>
                                            </Row>
                                        ) : null}
                                    </Col>
                                </Row>
                            </Grid>
                        ) : (
                                <View style={{ height: hp('20%') }}>
                                    {spinner ? (
                                        <Text style={styles.cardTitle}>Asset Balances</Text>
                                    ) : null}
                                    { assetBalance.length == 0 && spinner == false ? (
                                        <View>
                                            <Text style={styles.cardTitle}>Asset Balances</Text>

                                            <Text style={styles.emptyList}>
                                                No Asset Balances Available
                        </Text>
                                        </View>
                                    ) : null}
                                </View>
                            )}
                    </Card>
                </TouchableOpacity>

            </>
        )
    }
}

export default AssetBalancesCard
const styles = StyleSheet.create({
    header: {
        padding: hp('3.5%'),
        paddingLeft: hp('3%'),
        paddingRight: hp('3%'),
        flexDirection: 'row',
        paddingBottom: hp('3%'),
    },

    container: {
        paddingLeft: hp('2.5%'),
        paddingRight: hp('2.5%'),
        fontFamily: 'Roboto',
        marginBottom: hp('15%'),
    },
    containerHeading: {
        paddingLeft: 10,
        fontSize: 25,
        color: '#454F63',
        fontWeight: 'bold',
    },
    card: {
        padding: hp('1.7%'),
        elevation: 1.5,
        shadowOffset: { width: 0, height: hp('0.1%') },
        shadowColor: '#00000029',
        shadowOpacity: 1,
        borderRadius: 5,
    },
    promotionCard: {
        elevation: 1.5,
        padding: 0,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: '#00000029',
        shadowOpacity: 1,
        borderRadius: 5,
    },
    cardTitle: {
        color: '#454F63',
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    cardTotalAmount: {
        textAlign: 'right',
        color: '#454F63',
        fontSize: 24,
    },
    spinnerTextStyle: {
        color: 'white',
        fontSize: 15,
    },
    emptyList: {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: hp('15%') / 2.5,
        color: '#AAAAAA',
    },
    emptyListBudget: {
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        paddingTop: hp('15%') / 3.5,
        color: '#AAAAAA',
    },
    pagination: {
        color: '#5E83F2',
        margin: 3,
        opacity: 0.3,
    },
    activePagination: {
        color: 'gray',
        margin: 3,
    },
    completedBudget: {
        padding: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F2F2F2',
        backgroundColor: '#DBF3F5',
    },
    processingBudget: {
        padding: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F2F2F2',
        backgroundColor: 'white',
    },
    closedBudgte: {
        padding: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F2F2F2',
        backgroundColor: '#FDEDD4',
    },
    chartContainer: {
        height: wp('40%'),
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#AAAAAA',
        paddingBottom: 12,
        zIndex: 60,
    },
    backBtn: {
        // paddingTop: hp("1%")
        // position: 'absolute',
        zIndex: 100,
        elevation: 5,
        backgroundColor: '#EEEEEE',
        padding: 10,
    },
    tab: {
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        paddingBottom: 12,
        zIndex: 60,
    },
    memoriesYear: {
        paddingTop: 0,
        padding: 5,
        backgroundColor: 'white',
        color: '#454F63',
        textAlign: 'center',
        fontSize: 14,
        opacity: 0.7,
    },
    memoriesDay: {
        padding: 5,
        backgroundColor: 'white',
        color: '#454F63',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    memoriesMnt: {
        padding: 5,
        backgroundColor: '#F22973',
        color: 'white',
        textAlign: 'center',
    },
    memoriesDateCard: {
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    memoriesImgCard: {
        width: '90%',
        height: wp('40%'),
        alignSelf: 'center',
    },
    memoriesLabel: {
        textAlign: 'center',
        color: '#454F63',
        opacity: 0.5,
        fontSize: 12,
    },
    overlay: {
        opacity: 0.5,
        // height: '100%',
        // backgroundColor: '#cccccc'
        position: 'absolute',
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0
    },
    view: {
        justifyContent: 'flex-end',
        // margin: 50,
        marginTop: wp('35%'),
        marginBottom: wp('35%'),
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: hp('40%'),
        marginLeft: wp('8%'),
        marginRight: wp('8%'),
        borderRadius: hp('2%'),
    },
});
