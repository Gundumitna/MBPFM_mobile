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

function FreeToUse(props) {
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
    const [freeToUseBalance, setFreeToUseBalance] = useState("");
    const [progressBarData, setProgressBarData] = useState("");
    const [loader, setLoader] = useState(true);
    const [flag, setFlag] = useState(false);
    const [spinner, setSpinner] = useState(false);
    let ls = require('react-native-local-storage');
    const { rightDrawerState } = useSelector((state) => state.appConfig);
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
                console.log('http://63.142.252.161:8080/pfmv1/api/dashboard/fincast/' + global.loginID)
                fetch('http://63.142.252.161:8080/pfmv1/api/dashboard/fincast/' + global.loginID
                    // window.$baseUrl +
                    // userDetails.userId
                    // + "/dashboard"
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
                        console.log(responseJson.data);
                        if (responseJson.data != null) {
                            setCustomerPreferredCurrency(responseJson.data.customerPreferredCurrency)
                            if (responseJson.data.freeToUse != null) {
                                setFreeToUseBalance(
                                    responseJson.data.freeToUseInUserPreferredCurrency
                                );
                                if (
                                    responseJson.data.openingBalanceInUserPreferredCurrency != null
                                ) {
                                    setProgressBarData(
                                        responseJson.data.openingBalanceInUserPreferredCurrency /
                                        responseJson.data.freeToUseInUserPreferredCurrency
                                    );
                                } else {
                                    setProgressBarData(0);
                                }
                            } else {
                                setFreeToUseBalance(0);
                            }
                            setSpinner(false)
                            // props.stopApiLoader()
                        } else {
                            setProgressBarData(0);
                            setFreeToUseBalance(0)
                            setSpinner(false)
                            // props.stopApiLoader()
                        }

                    }).catch((error) => {
                        console.log(error)
                        setSpinner(false)
                        // props.stopApiLoader()
                    })
            })
    }
    if (spinner) {
        return (

            <Card>
                <View>
                    <Text style={styles.cardTitle}> Budget vs Expenses</Text>
                    <Text style={[styles.emptyList, { top: '-25%' }]}>
                        <ActivityIndicator size="small" color="#333333" />
                    </Text>
                </View>
            </Card >

        )
    } else {
        return (
            <>

                <TouchableOpacity
                    onPress={() => props.navigation.navigate('fincastPage')}>
                    <Card containerStyle={styles.card}>
                        {spinner == false ? (
                            <View>
                                <Text style={styles.cardTitle}>Free To Use</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <Text
                                        style={[
                                            styles.cardTotalAmount,
                                            {
                                                fontSize: 11,
                                                marginTop: 'auto',
                                                marginTop: 5,
                                                marginRight: 3,
                                            },
                                        ]}>
                                        {customerPreferredCurrency}
                                    </Text>
                                    <AmountDisplay
                                        style={styles.cardTotalAmount}
                                        amount={Number(freeToUseBalance)}
                                        currency={customerPreferredCurrency}
                                    />

                                </View>

                                {
                                    freeToUseBalance != 0 && freeToUseBalance != null && progressBarData != 0 && progressBarData != null && progressBarData != undefined
                                        ?
                                        <>
                                            <Text
                                                style={{
                                                    color: '#888888',
                                                    fontSize: 9,
                                                    textAlign: 'center',
                                                    marginTop: hp('1%'),
                                                }}>
                                                ( above amount is calculated based on your Transaction
                                                patterns)
                    </Text>
                                            <ProgressBar
                                                progress={Number(progressBarData)}
                                                width={null}
                                                height={10}
                                                style={{ marginTop: hp('1.5%') }}
                                                borderRadius={35}
                                                color={'#F2A413'}
                                                borderColor={'transparent'}
                                                unfilledColor={'#FDEDD4'}
                                            />
                                        </>
                                        :
                                        null
                                }

                            </View>
                        ) : (
                                <View style={{ height: hp('20%') }}>
                                    {spinner ? (
                                        <Text style={styles.cardTitle}>Free To Use</Text>
                                    ) : null}
                                </View>
                            )}
                    </Card>
                </TouchableOpacity>

            </>
        )
    }
}

export default FreeToUse
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
