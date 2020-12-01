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
import MapView, { Marker } from 'react-native-maps';
function MemoriesCard(props) {
    const [memoriesData, setMemoriesData] = useState();
    const [totalIncomeAmt, setTotalIncomeAmt] = useState("");
    const [loader, setLoader] = useState(true);
    const [flag, setFlag] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
    const { rightDrawerState } = useSelector((state) => state.appConfig);
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
                console.log('http://63.142.252.161:8080/pfmv1/api/dashboard/memories/' + global.loginID)
                fetch('http://63.142.252.161:8080/pfmv1/api/dashboard/memories/' + global.loginID
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
                            setMemoriesData(responseJson.data.memoriesData);
                            setSpinner(false)
                        } else {
                            setMemoriesData([]);
                            setSpinner(false)
                        }
                        // props.stopApiLoader()
                    }).catch((error) => {
                        console.log(error)
                        setSpinner(false)
                        // props.stopApiLoader()
                    })
            })
    }
    navigationTomemories = () => {
        if (memoriesData.transactionDate != null) {
            global.memoriesSelectedDate = Moment(memoriesData.transactionDate).format(
                'YYYY-MM-DD',
            );
            global.memoriesDate = memoriesData.transactionDate;
            props.navigation.navigate('memories');
        } else {
            props.navigation.navigate('memories');
        }
    };

    if (spinner) {
        return (

            <Card>
                <View style={{ height: hp('14%') }}>
                    <Text style={styles.cardTitle}>Memories</Text>
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
                    disabled={memoriesData == null}
                    onPress={() => navigationTomemories()}>
                    <Card
                        containerStyle={[
                            styles.card,
                            { padding: 0, paddingBottom: hp('2%') },
                        ]}>
                        {spinner == false && memoriesData != null ? (
                            <View>
                                {/* <View> */}
                                <View style={{ paddingBottom: hp('0.5%') }}>
                                    <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                        {' '}
                        Memories
                      </Text>
                                </View>
                                <View style={styles.memoriesImgCard}>
                                    {/* <Image
                                        resizeMode={'stretch'}
                                        style={{
                                            maxWidth: '100%',
                                            height: '100%',
                                            borderRadius: hp('1.5%'),
                                        }}
                                        source={require('../assets/memoriesPic.png')}></Image> */}
                                    {
                                        memoriesData.cityImages != undefined && memoriesData.cityImages != null && memoriesData.cityImages.length != 0
                                            ?


                                            <Image
                                                resizeMode={'cover'}
                                                style={{
                                                    maxWidth: '100%',
                                                    height: '100%',
                                                    borderTopLeftRadius: hp('3%'),
                                                }}
                                                source={{
                                                    uri:
                                                        global.baseURL +
                                                        'customer/' +
                                                        memoriesData.cityImages
                                                }}
                                            />



                                            :
                                            <>
                                                {
                                                    memoriesData.longitude != null &&
                                                        memoriesData.longitude != "" &&
                                                        memoriesData.latitude != null &&
                                                        memoriesData.latitude != "" ?

                                                        <MapView
                                                            pitchEnabled={false}
                                                            scrollEnabled={false}
                                                            rotateEnabled={false}
                                                            zoomEnabled={false}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                borderBottomRightRadius: hp('4%'),
                                                            }}
                                                            region={{
                                                                latitude: memoriesData.latitude,
                                                                longitude: memoriesData.longitude,
                                                                latitudeDelta: 0.0922,
                                                                longitudeDelta: 0.0421,
                                                            }}>
                                                            <Marker
                                                                coordinate={{
                                                                    latitude: memoriesData.latitude,
                                                                    longitude: memoriesData.longitude,
                                                                }}
                                                            />
                                                        </MapView>
                                                        :
                                                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                                            <Text style={{ color: '#AAAAAA', marginTop: wp('10%') }}>No Location Available</Text>
                                                        </View>
                                                }
                                            </>
                                    }
                                </View>
                                <Grid>
                                    <Row>
                                        <Col size={0.5}></Col>
                                        <Col size={4.5} style={{ marginTop: wp('-20%') }}>
                                            {memoriesData.transactionDate != null ? (
                                                <Card containerStyle={styles.memoriesDateCard}>
                                                    <Text style={styles.memoriesMnt}>
                                                        {Moment(memoriesData.transactionDate).format(
                                                            'MMM',
                                                        )}
                                                    </Text>
                                                    <Text style={styles.memoriesDay}>
                                                        {Moment(memoriesData.transactionDate).format(
                                                            'DD',
                                                        )}
                                                    </Text>
                                                    <Text style={styles.memoriesYear}>
                                                        {Moment(memoriesData.transactionDate).format(
                                                            'YYYY',
                                                        )}
                                                    </Text>
                                                </Card>
                                            ) : (
                                                    <View></View>
                                                )}
                                        </Col>
                                        <Col size={1}></Col>

                                        {memoriesData.logos != null &&
                                            memoriesData.logos.length != 0 ? (
                                                <FlatList
                                                    horizontal
                                                    style={{ top: wp('-6%') }}
                                                    data={memoriesData.logos}
                                                    renderItem={({ item, index }) => (
                                                        <>
                                                            {index < 3 ? (
                                                                <Col size={2}>
                                                                    <View
                                                                        style={{
                                                                            width: 38,
                                                                            height: 38,
                                                                            marginLeft: 10,
                                                                        }}>
                                                                        <Image
                                                                            style={{
                                                                                maxWidth: '100%',
                                                                                height: '100%',
                                                                                shadowColor: '#000',
                                                                                shadowOffset: { width: 0, height: 1 },
                                                                                shadowOpacity: 0.8,
                                                                                shadowRadius: 2,
                                                                                elevation: 5,
                                                                            }}
                                                                            source={{
                                                                                uri:
                                                                                    global.baseURL + 'customer/' + item,
                                                                            }}></Image>
                                                                    </View>
                                                                </Col>
                                                            ) : null}
                                                        </>
                                                    )}
                                                />
                                            ) : null}
                                    </Row>
                                    <Row style={{ marginTop: hp('2%') }}>
                                        <Col
                                            size={6}
                                            style={{
                                                borderRightWidth: 1,
                                                borderRightColor: '#cccccc',
                                            }}>
                                            <View>
                                                <Text style={styles.memoriesLabel}>
                                                    Total Income
                            </Text>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        paddingLeft: 15,
                                                        paddingRight: 12,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            marginTop: 'auto',
                                                            marginTop: 5,
                                                            marginRight: 3,
                                                            color: '#02909C',
                                                        }}>
                                                        {memoriesData.userPreferredCurrency}
                                                    </Text>
                                                    {memoriesData.totalIncomeUserPreferred != null ? (
                                                        <AmountDisplay
                                                            style={{ color: '#02909C', fontSize: 22 }}
                                                            amount={Number(
                                                                memoriesData.totalIncomeUserPreferred,
                                                            )}
                                                            currency={memoriesData.userPreferredCurrency}
                                                        />
                                                    ) : (
                                                            // <NumberFormat
                                                            //   value={Number(
                                                            //     memoriesData.totalIncomeUserPreferred,
                                                            //   )}
                                                            //   displayType={'text'}
                                                            //   thousandsGroupStyle={
                                                            //     global.thousandsGroupStyle
                                                            //   }
                                                            //   thousandSeparator={global.thousandSeparator}
                                                            //   decimalScale={global.decimalScale}
                                                            //   fixedDecimalScale={true}
                                                            //   // prefix={'₹'}
                                                            //   renderText={(value) => (
                                                            //     <Text
                                                            //       style={{color: '#02909C', fontSize: 22}}>
                                                            //       {value}
                                                            //     </Text>
                                                            //   )}
                                                            // />
                                                            <AmountDisplay
                                                                style={{ color: '#02909C', fontSize: 22 }}
                                                                amount={Number(0)}
                                                                currency={memoriesData.userPreferredCurrency}
                                                            />
                                                            // <NumberFormat
                                                            //   value={Number(0)}
                                                            //   displayType={'text'}
                                                            //   thousandsGroupStyle={
                                                            //     global.thousandsGroupStyle
                                                            //   }
                                                            //   thousandSeparator={global.thousandSeparator}
                                                            //   decimalScale={global.decimalScale}
                                                            //   fixedDecimalScale={true}
                                                            //   // prefix={'₹'}
                                                            //   renderText={(value) => (
                                                            //     <Text
                                                            //       style={{color: '#02909C', fontSize: 22}}>
                                                            //       {value}
                                                            //     </Text>
                                                            //   )}
                                                            // />
                                                        )}
                                                </View>
                                            </View>
                                        </Col>
                                        <Col size={6}>
                                            <View>
                                                <Text style={styles.memoriesLabel}>
                                                    Total Expense
                            </Text>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        paddingLeft: 15,
                                                        paddingRight: 12,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            marginTop: 'auto',
                                                            marginTop: 5,
                                                            marginRight: 3,
                                                            color: '#F22973',
                                                        }}>
                                                        {memoriesData.userPreferredCurrency}
                                                    </Text>
                                                    {memoriesData.totalExpenseUserPreferred !=
                                                        null ? (
                                                            <AmountDisplay
                                                                style={{ color: '#F22973', fontSize: 22 }}
                                                                amount={Number(
                                                                    memoriesData.totalExpenseUserPreferred,
                                                                )}
                                                                currency={memoriesData.userPreferredCurrency}
                                                            />
                                                        ) : (
                                                            // <NumberFormat
                                                            //   value={Number(
                                                            //     memoriesData.totalExpenseUserPreferred,
                                                            //   )}
                                                            //   displayType={'text'}
                                                            //   thousandsGroupStyle={
                                                            //     global.thousandsGroupStyle
                                                            //   }
                                                            //   thousandSeparator={global.thousandSeparator}
                                                            //   decimalScale={global.decimalScale}
                                                            //   fixedDecimalScale={true}
                                                            //   // prefix={'₹'}
                                                            //   renderText={(value) => (
                                                            //     <Text
                                                            //       style={{color: '#F22973', fontSize: 22}}>
                                                            //       {value}
                                                            //     </Text>
                                                            //   )}
                                                            // />
                                                            <AmountDisplay
                                                                style={{ color: '#F22973', fontSize: 22 }}
                                                                amount={Number(0)}
                                                                currency={memoriesData.userPreferredCurrency}
                                                            />
                                                            // <NumberFormat
                                                            //   value={Number(0)}
                                                            //   displayType={'text'}
                                                            //   thousandsGroupStyle={
                                                            //     global.thousandsGroupStyle
                                                            //   }
                                                            //   thousandSeparator={global.thousandSeparator}
                                                            //   decimalScale={global.decimalScale}
                                                            //   fixedDecimalScale={true}
                                                            //   // prefix={'₹'}
                                                            //   renderText={(value) => (
                                                            //     <Text
                                                            //       style={{color: '#02909C', fontSize: 22}}>
                                                            //       {value}
                                                            //     </Text>
                                                            //   )}
                                                            // />
                                                        )}
                                                </View>
                                            </View>
                                        </Col>
                                    </Row>
                                </Grid>
                                {/* </View> */}
                            </View>
                        ) : (
                                <View style={{ height: hp('20%') }}>
                                    {spinner ? (
                                        <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                            Memories
                                        </Text>
                                    ) : null}
                                    {memoriesData == null && spinner == false ? (
                                        <View>
                                            <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                                Memories
                        </Text>

                                            <Text style={styles.emptyList}>
                                                No Memories Available
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

export default MemoriesCard
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
