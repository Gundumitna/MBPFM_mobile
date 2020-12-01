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

const TotalAssetCard = (props) => {
    const [totalIncomeAmt, setTotalIncomeAmt] = useState("");
    const chart_wh = 106;
    const [loader, setLoader] = useState(false);
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
    const [pendingCnt, setpendingCnt] = useState('');
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
    const [flag, setFlag] = useState(false);
    const [assetsList, setAssetsList] = useState([]);
    const [assetSeries, setAssetSeries] = useState([]);
    const [assetSliceColor, setAssetSliceColor] = useState([]);
    const [assetChartLabel, setAssetChartLabel] = useState([]);
    const [singleAccount, setSingleAccount] = useState(false)
    const [totalAssetAmt, setTotalAssetAmt] = useState("");
    const [spinner, setSpinner] = useState(false);
    let ls = require('react-native-local-storage');
    const { rightDrawerState } = useSelector((state) => state.appConfig);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getPendingConsentCnt()

        })

        return unsubscribe;
    }, [props.navigation])
    useEffect(() => {
        if (rightDrawerState == 'reload') {
            console.log(props.assetsList.length)
            getPendingConsentCnt()
        }
        return (() => { });
    }, [rightDrawerState == 'reload'])

    getPendingConsentCnt = () => {
        setSpinner(true);
        return fetch(
            global.baseURL + 'consent/get/consents/count/' + global.loginID,
        )
            .then((response) => response.json())
            .then((responseJson) => {
                // return responseJson.movies;
                console.log(responseJson);
                setpendingCnt(responseJson.data);
                setSpinner(false);
            })
            .catch((error) => {
                console.error(error);
                setSpinner(false);
            });
    };
    useEffect(() => {
        return () => {
            setFlag(false);
        };
    }, [flag]);
    if (props.loadApi) {
        return (
            <Card>
                <View style={{ height: hp('14%') }}>
                    <Text style={styles.cardTitle}>Total Assets</Text>
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
                    disabled={props.assetsList.length == 0}
                    onPress={() => {

                        props.navigation.navigate('accounts', {
                            assets: props.assets,
                            assetsList: props.assetsList,
                            assetSeries: props.assetSeries,
                            assetSliceColor: props.assetSliceColor,
                            // heading: props.heading,
                        })
                        // }

                    }

                    }>
                    <Card containerStyle={styles.card}>
                        {spinner == false && props.assetsList.length != 0 ? (
                            <Grid>
                                <Col style={{ paddingBottom: hp('0.5%') }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.cardTitle}>Total Assets </Text>
                                        {pendingCnt != null && pendingCnt != 0 ? (
                                            <View>
                                                {pendingCnt == 1 ? (
                                                    <Text style={styles.cardTitle}>
                                                        ({pendingCnt} Pending consent)
                                                    </Text>
                                                ) : (
                                                        <Text style={styles.cardTitle}>
                                                            ({pendingCnt} Pending consents)
                                                        </Text>
                                                    )}
                                            </View>
                                        ) : null}
                                    </View>
                                </Col>
                                <Col style={{ paddingBottom: hp('0.5%') }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            paddingBottom: 10,
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
                                            {props.customerPreferredCurrency}
                                        </Text>
                                        <AmountDisplay
                                            style={styles.cardTotalAmount}
                                            amount={Number(props.totalAssetAmt)}
                                            currency={props.customerPreferredCurrency}
                                        />
                                    </View>
                                </Col>
                                <Row>
                                    <Col
                                        size={5}
                                        style={{
                                            marginTop: hp('-2%'),
                                        }}>
                                        <View>
                                            <PieChart
                                                chart_wh={chart_wh}
                                                series={props.assetSeries}
                                                sliceColor={props.assetSliceColor}
                                                doughnut={true}
                                                coverRadius={0.55}
                                                coverFill={'#FFF'}
                                            />
                                        </View>
                                    </Col>
                                    <Col size={7}>
                                        {props.assetsList.length != 0 ? (
                                            <FlatList
                                                data={props.assetsList}
                                                renderItem={({ item, index }) => (
                                                    <View>
                                                        {index < 3 ? (
                                                            <Row style={{ marginBottom: -1 }}>
                                                                <Col size={2}>
                                                                    <View
                                                                        style={{
                                                                            width: 10,
                                                                            height: 10,
                                                                            backgroundColor: item.color,
                                                                            marginTop: 10,
                                                                        }}></View>
                                                                </Col>
                                                                <Col size={3}>
                                                                    <View
                                                                        style={{
                                                                            width: 33,
                                                                            height: 33,
                                                                            marginTop: hp('0.2%'),
                                                                        }}>
                                                                        <Image
                                                                            resizeMode={'contain'}
                                                                            style={{
                                                                                maxWidth: '100%',
                                                                                height: '100%',
                                                                            }}
                                                                            source={{ uri: item.logo }}></Image>
                                                                    </View>
                                                                </Col>
                                                                <Col size={7}>
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'flex-end',
                                                                            paddingLeft: 12,
                                                                        }}>
                                                                        <Text
                                                                            style={{
                                                                                color: '#888888',
                                                                                fontSize: 8,
                                                                                marginTop: 4,
                                                                                marginRight: 3,
                                                                            }}>
                                                                            {props.customerPreferredCurrency}
                                                                        </Text>
                                                                        <AmountDisplay
                                                                            style={{
                                                                                color: '#888888',
                                                                                fontSize: 12,
                                                                                paddingBottom: 10,
                                                                                marginTop: 5,
                                                                            }}
                                                                            amount={Number(item.amount)}
                                                                            currency={props.customerPreferredCurrency}
                                                                        />
                                                                    </View>
                                                                </Col>
                                                            </Row>
                                                        ) : null}
                                                    </View>
                                                )}></FlatList>
                                        ) : (
                                                <View>
                                                    <ActivityIndicator size="small" color="#00ff00" />
                                                </View>
                                            )}
                                        {props.assetsList.length > 3 ? (
                                            <Row style={{ paddingBottom: hp('0.5%') }}>
                                                <Col>
                                                    <Text
                                                        style={{
                                                            color: '#888888',
                                                            fontSize: 12,
                                                            textAlign: 'right',
                                                        }}>
                                                        + {props.assetsList.length - 3} more...
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
                                        <Text style={styles.cardTitle}>Total Assets</Text>
                                    ) : null}
                                    {props.assetsList.length == 0 && spinner == false ? (
                                        <View>
                                            <Text style={styles.cardTitle}>Total Assets</Text>
                                            <Text style={styles.emptyList}>
                                                No Total Assets Available
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

export default TotalAssetCard
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
        color: 'black',
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
