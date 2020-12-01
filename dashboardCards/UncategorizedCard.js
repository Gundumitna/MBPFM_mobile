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


function UncategorizedCard(props) {
    const [uncategoryModal, setUncategoryModal] = useState(false);
    const [list, setList] = useState([]);
    const [notransaction, setNotransaction] = useState(false);
    const [totalIncomeAmt, setTotalIncomeAmt] = useState("");
    const [loader, setLoader] = useState(true);
    const [flag, setFlag] = useState(false);
    const [uncategoziedList, setUncategoziedList] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
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
                console.log('http://63.142.252.161:8080/pfmv1/api/dashboard/uncategorized/transactions/' + global.loginID)
                fetch('http://63.142.252.161:8080/pfmv1/api/dashboard/uncategorized/transactions/' + global.loginID
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
                            setUncategoziedList(responseJson.data.uncategTransactionsList)
                            setFlag(true)
                            setSpinner(false)
                        } else {
                            setUncategoziedList([]);
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
                <Spinner
                    visible={spinner}
                    overlayColor="rgba(0, 0, 0, 0.65)"
                    textContent={'Calculating your Finances...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <TouchableOpacity
                    disabled={uncategoziedList == null}
                    onPress={() => props.navigation.navigate('uncategorizedTransaction')}>
                    <Card containerStyle={styles.card}>
                        {spinner == false && uncategoziedList != null && uncategoziedList.length != 0 ? (
                            <Grid>
                                <Row>
                                    <Col style={{ paddingBottom: hp('0.5%') }}>
                                        <Text style={styles.cardTitle}>
                                            Uncategorized Transactions
                        </Text>
                                    </Col>
                                </Row>

                                <FlatList
                                    data={uncategoziedList}
                                    renderItem={({ item, index }) => (
                                        <View>
                                            {index < 3 ? (
                                                <Row style={{ paddingTop: hp('2.5%') }}>
                                                    <Col
                                                        size={1.5}
                                                        style={{
                                                            alignItems: 'center',
                                                            marginTop: hp('1%'),
                                                            marginRight: 2,
                                                        }}>
                                                        <View style={{ width: 30, height: 30 }}>
                                                            <Image
                                                                resizeMode={'contain'}
                                                                style={{ maxWidth: '100%', height: '100%' }}
                                                                source={{
                                                                    uri:
                                                                        global.baseURL +
                                                                        'customer/' +
                                                                        item.icon,
                                                                }}></Image>
                                                        </View>
                                                    </Col>
                                                    <Col size={5.5}>
                                                        <Text style={{ color: '#888888', fontSize: 12 }}>
                                                            {item.description}
                                                        </Text>
                                                        <Text style={{ color: '#888888', fontSize: 12 }}>
                                                            {item.category} |{' '}
                                                            {Moment(
                                                                item.transactionTimestamp,
                                                                'YYYY-MM-DD,h:mm:ss',
                                                            ).format(global.dateFormat)}
                                                        </Text>
                                                    </Col>
                                                    <Col
                                                        size={4}
                                                        style={{
                                                            alignItems: 'flex-end',
                                                            paddingRight: 10,
                                                        }}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'flex-end',
                                                            }}>
                                                            <View>
                                                                {/* {
                                                                                item.transactionCurrency == 'INR'
                                                                                    ?
                                                                                    <Text style={{ color: '#888888', fontSize: 10, marginTop: 1, marginRight: 3 }}>₹</Text>

                                                                                    : */}
                                                                <Text
                                                                    style={{
                                                                        color: '#888888',
                                                                        fontSize: 8,
                                                                        marginTop: 1,
                                                                        marginRight: 3,
                                                                    }}>
                                                                    {item.transactionCurrency}
                                                                </Text>

                                                                {/* } */}
                                                            </View>
                                                            <AmountDisplay
                                                                style={{
                                                                    color: '#888888',
                                                                    fontSize: 12,
                                                                }}
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
                                            ) : null}
                                        </View>
                                    )}></FlatList>
                                {uncategoziedList.length != undefined &&
                                    uncategoziedList.length > 3 ? (
                                        <Row>
                                            <Col>
                                                <Text
                                                    style={{
                                                        color: '#888888',
                                                        fontSize: 12,
                                                        marginTop: 5,
                                                        textAlign: 'right',
                                                    }}>
                                                    + {uncategoziedList.length - 3} more...
                          </Text>
                                            </Col>
                                        </Row>
                                    ) : null}
                            </Grid>
                        ) : (
                                <View style={{ height: hp('20%') }}>
                                    {spinner ? (
                                        <Text style={styles.cardTitle}>
                                            Your Uncategorized Transaction
                                        </Text>
                                    ) : null}
                                    {uncategoziedList == null && spinner == false ? (
                                        <View>
                                            <Text style={styles.cardTitle}>
                                                Your Uncategorized Transaction
                        </Text>
                                            <Text style={styles.emptyList}>
                                                You are all caught up!!
                        </Text>
                                            <Text
                                                style={{
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto',
                                                    color: '#AAAAAA',
                                                }}>
                                                Nothing to categorise now!!
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

export default UncategorizedCard
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
