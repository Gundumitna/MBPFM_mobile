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
    processColor,
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
import { BarChart } from "react-native-charts-wrapper";
function BudgetCard(props, { navigation }) {
    const [expenseLegendColor, setExpenseLegendColor] = useState();
    const [expenseBudgetGraph, setexpenseBudgetGraph] = useState();
    const [incomeBudgetGraph, setincomeBudgetGraph] = useState();
    const [epenseBudgetList, setEpenseBudgetList] = useState();
    const [incomeBudgetList, setIncomeBudgetList] = useState();
    const [noBudgetChartData, setNoBudegtChartData] = useState(false);
    const [budgetLegendColor, setBudgetLegendColor] = useState();
    const [budgetChart, setBudgetChart] = useState();
    const [activeTab, setActiveTab] = useState("");
    const [totalIncomeAmt, setTotalIncomeAmt] = useState("");
    const [loader, setLoader] = useState(true);
    const [flag, setFlag] = useState(false);
    const [epenseBudgetListLabel, setEpenseBudgetListLabel] = useState();
    const [incomeBudgetListLabel, setIncomeBudgetListLabel] = useState();
    const [goalsList, setGoalsList] = useState([]);
    const [budgetGraphLabel, setBudgetGraphLabel] = useState();
    const [spinner, setSpinner] = useState(false);
    const [customerPreferredCurrency, setCustomerPreferredCurrency] = useState();
    let ls = require('react-native-local-storage');
    const { rightDrawerState } = useSelector((state) => state.appConfig);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            setActiveTab('DB');
            getData()

        })

        return unsubscribe;
    }, [props.navigation])
    useEffect(() => {
        if (rightDrawerState == 'reload') {
            setActiveTab('DB');
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
                // setFilterData(data);
                // postData.filterDuration: "MFEB2020",
                // "fiProviders": [1]
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
                console.log('http://63.142.252.161:8080/pfmv1/api/dashboard/budgets/' + global.loginID)
                fetch('http://63.142.252.161:8080/pfmv1/api/dashboard/budgets/' + global.loginID
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
                            if (responseJson.data.expenseBudgetsGraph != null) {
                                getBudgetChartData(responseJson.data.expenseBudgetsGraph, 'DB');
                                setexpenseBudgetGraph(responseJson.data.expenseBudgetsGraph);
                            } else {
                                setexpenseBudgetGraph();
                                setExpensesChartSeries([])
                                setExpensesChartSliceColor([])
                            }
                            if (responseJson.data.incomeBudgetGraph != null) {
                                setincomeBudgetGraph(responseJson.data.incomeBudgetGraph);
                                getBudgetChartData(responseJson.data.incomeBudgetGraph, 'CR');
                            } else {
                                setincomeBudgetGraph();
                                setIncomeChartSliceColor([])
                                setIncomeChartSeries([])
                            }
                            setSpinner(false)
                            // props.stopApiLoader()
                        } else {
                            setincomeBudgetGraph();
                            setIncomeChartSliceColor([])
                            setIncomeChartSeries([])
                            setexpenseBudgetGraph();
                            setExpensesChartSeries([])
                            setExpensesChartSliceColor([])
                            setSpinner(false)
                            // props.stopApiLoader()
                        }

                    }).catch((error) => {
                        console.log(error)
                        setSpinner(false)
                    })
            })
    }
    getBudgetChartData = (list, type) => {
        let d = [...list];
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        console.log(list);
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        d.sort(function (a, b) {
            return a.month - b.month;
        });
        let categoryLabel = [];
        let barData = [];
        let line1 = [];
        let line2 = [];
        let label = [];
        for (let li of d) {
            // array1.x = li.monthAndYear
            label.push(li.monthAndYear);
            // array2.x = li.monthAndYear
            if (li.expense != null) {
                // b.value = li.expense.toString();
                // l1.value = li.expense.toString();
                barData.push(li.expense);
            } else {
                barData.push(0);
                // b.value = 0;
                // l1.value = 0;
            }
            if (li.budgetAmount != null) {
                line2.push(li.budgetAmount);
            } else {
                line2.push(0);
            }
            // line1.push(l1);
            // line2.push(l2);

            // console.log(barData)
        }
        console.log("budget data" + line2);
        console.log(label);

        console.log(barData);
        setBudgetLegendColor("#63CDD6");
        // setIncomeLegendColor(bg)
        setExpenseLegendColor("white");
        let title = "";
        if (type == "DB") {
            title = "Expense";
        } else {
            title = "Income";
        }
        let dataSource = {
            // chart: {
            //   baseFontColor: "#AAAAAA",
            //   plotSpacePercent: "76",
            //   baseFontSize: "8",
            //   // numberprefix: "₹",
            //   // bgColor: "#ffffff",
            //   scrollheight: hp("1%"),
            //   theme: "ocean",
            // },
            // categories: [
            //   {
            //     category: categoryLabel,
            //   },
            // ],
            // dataset: [
            //   {
            //     color: "#5E83F2",
            //     alpha: "20",
            //     data: barData,
            //   },
            //   {
            //     renderas: "line",
            //     color: "#5E83F2",
            //     alpha: "35",
            //     anchorBgColor: "#FFFFFF",
            //     dashed: "1",
            //     data: line1,
            //   },
            //   {
            //     renderas: "line",
            //     color: "#63CDD6",
            //     anchorBgColor: "#63CDD6",
            //     anchorBorderColor: "#63CDD6",
            //     data: line2,
            //   },
            // ],
            legend: {
                enabled: true,
                textSize: 10,
                form: "SQUARE",
                formSize: 10,
                xEntrySpace: 10,
                yEntrySpace: 5,
                wordWrapEnabled: true,
            },
            data: {
                dataSets: [
                    {
                        values: line2,
                        label: "Budget",
                        config: {
                            drawValues: false,
                            colors: [processColor("#63CDD6")],
                        },
                    },
                    {
                        values: barData,
                        label: title,
                        config: {
                            drawValues: false,
                            colors: [processColor("blue")],
                        },
                    },
                ],
                config: {
                    barWidth: 0.2,
                    group: {
                        fromX: 0,
                        groupSpace: 0.4,
                        barSpace: 0.1,
                    },
                },
            },
            xAxis: {
                valueFormatter: label,
                granularityEnabled: true,
                granularity: 1,
                axisMaximum: 5,
                axisMinimum: 0,
                centerAxisLabels: true,
            },

            marker: {
                enabled: true,
                markerColor: processColor("#F0C0FF8C"),
                textColor: processColor("white"),
                markerFontSize: 14,
            },
        };
        console.log(dataSource);
        if (type == "DB") {
            setEpenseBudgetList(dataSource);
            setBudgetChart(dataSource);
        } else if (type == "CR") {
            setIncomeBudgetList(dataSource);
        }

        setFlag(true);
        // let d = [...list];
        // d.sort(function (a, b) {
        //     return a.month - b.month;
        // });
        // let categoryLabel = [];
        // let barData = [];
        // let line1 = [];
        // let line2 = [];
        // for (let li of d) {
        //     let l1 = {};
        //     let l2 = {};
        //     let b = {};
        //     let label = {};
        //     // array1.x = li.monthAndYear
        //     label.label = li.monthAndYear;
        //     // array2.x = li.monthAndYear
        //     if (li.expense != null) {
        //         b.value = li.expense.toString();
        //         l1.value = li.expense.toString();
        //     } else {
        //         b.value = 0;
        //         l1.value = 0;
        //     }
        //     if (li.budgetAmount != null) {
        //         l2.value = li.budgetAmount.toString();
        //     } else {
        //         l2.value = 0;
        //     }
        //     line1.push(l1);
        //     line2.push(l2);
        //     barData.push(b);
        //     categoryLabel.push(label);
        //     // console.log(l1)
        //     console.log(l2);
        //     // console.log(barData)
        // }
        // setBudgetLegendColor('#63CDD6');
        // // setIncomeLegendColor(bg)
        // setExpenseLegendColor('white');
        // let dataSource = {
        //     chart: {
        //         baseFontColor: '#AAAAAA',
        //         plotSpacePercent: '76',
        //         baseFontSize: '8',
        //         // numberprefix: "₹",
        //         // bgColor: "#ffffff",
        //         scrollheight: hp('1%'),
        //         theme: 'ocean',
        //     },
        //     categories: [
        //         {
        //             category: categoryLabel,
        //         },
        //     ],
        //     dataset: [
        //         {
        //             color: '#5E83F2',
        //             alpha: '20',
        //             data: barData,
        //         },
        //         {
        //             renderas: 'line',
        //             color: '#5E83F2',
        //             alpha: '35',
        //             anchorBgColor: '#FFFFFF',
        //             dashed: '1',
        //             data: line1,
        //         },
        //         {
        //             renderas: 'line',
        //             color: '#63CDD6',
        //             anchorBgColor: '#63CDD6',
        //             anchorBorderColor: '#63CDD6',
        //             data: line2,
        //         },
        //     ],
        // };
        // console.log(dataSource);
        // if (type == 'DB') {
        //     setEpenseBudgetList(dataSource);
        //     setBudgetChart(dataSource);
        // } else if (type == 'CR') {
        //     setIncomeBudgetList(dataSource);
        // }
        // console.log(props)
        // setFlag(true);
    };

    const libraryPath = Platform.select({
        // Specify fusioncharts.html file location
        android: { uri: 'file:///android_asset/fusioncharts.html' },
        ios: require('./assets/fusioncharts.html'),
    });
    selectedTab = (tab) => {
        setActiveTab(tab);
        console.log(tab);
        if (tab == 'DB') {
            // setEpenseBudgetList(dataSource)
            setBudgetChart(epenseBudgetList);
            if (epenseBudgetList != undefined) {
                setNoBudegtChartData(false);
            } else {
                setNoBudegtChartData(true);
            }
        } else if (tab == 'CR') {
            setBudgetChart(incomeBudgetList);
            if (incomeBudgetList != undefined) {
                setNoBudegtChartData(false);
            } else {
                setNoBudegtChartData(true);
            }
        }
        setFlag(true);
    };
    if (spinner) {
        return (

            <Card>
                <View style={{ height: hp('14%') }}>
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
                <Card containerStyle={[styles.card, { padding: 0 }]}>
                    {spinner == false &&
                        (expenseBudgetGraph != null || incomeBudgetGraph != null) ? (
                            <View>
                                <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                    Budget vs Expenses
                  </Text>
                                <View style={{ zIndex: 100, marginLeft: hp('1%') }}>
                                    <Row
                                        style={{
                                            marginLeft: hp('1%'),
                                            marginRight: hp('2%'),
                                            marginTop: hp('1%'),
                                        }}>
                                        <Col
                                            size={4}
                                            style={
                                                activeTab == 'DB' ? styles.activeTab : styles.tab
                                            }>
                                            <TouchableOpacity
                                                style={{ zIndex: 10 }}
                                                onPress={() => {
                                                    selectedTab('DB');
                                                }}>
                                                <Text style={{ color: '#AAAAAA', textAlign: 'center' }}>
                                                    Expense
                          </Text>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col
                                            size={4}
                                            style={
                                                activeTab == 'CR' ? styles.activeTab : styles.tab
                                            }>
                                            <TouchableOpacity
                                                style={{ zIndex: 10 }}
                                                onPress={() => {
                                                    selectedTab('CR');
                                                }}>
                                                <Text style={{ color: '#AAAAAA', textAlign: 'center' }}>
                                                    Income
                          </Text>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col size={4}></Col>
                                        <Col size={4}></Col>
                                    </Row>
                                </View>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate('budgetPage')}>

                                    <View style={styles.chartContainer}>
                                        {budgetChart != undefined ? (
                                            // <FusionCharts
                                            //     type={'scrollcombi2d'}
                                            //     width={'100%'}
                                            //     height={'100%'}
                                            //     dataFormat={'json'}
                                            //     dataSource={budgetChart}
                                            //     libraryPath={libraryPath} // set the libraryPath property
                                            // />
                                            <BarChart
                                                style={styles.bar}
                                                xAxis={budgetChart.xAxis}
                                                data={budgetChart.data}
                                                legend={budgetChart.legend}
                                                drawValueAboveBar={false}
                                                onChange={(event) => console.log(event.nativeEvent)}
                                                marker={budgetChart.marker}
                                            />
                                        ) : (
                                                <View
                                                    style={{
                                                        justifyContent: 'center',
                                                        alignSelf: 'center',
                                                        height: '100%',
                                                    }}>
                                                    {spinner == false && noBudgetChartData == true ? (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                props.navigation.navigate('budgetCreatePage', { type: activeTab })
                                                            }>
                                                            <Text style={[styles.emptyListBudget, { padding: wp('2%') }]}>
                                                                <Text>
                                                                    Create a
                                                            </Text>
                                                                {
                                                                    activeTab == 'DB'
                                                                        ?
                                                                        <Text>
                                                                            {'  '}
                                                                            Expense
                                                                            {'  ] '}
                                                                        </Text>
                                                                        :
                                                                        <Text>
                                                                            {'  '}
                                                                            Income
                                                                            {'  '}
                                                                        </Text>
                                                                }

                                                                <Text>Budget and manage your finances
                                                            effectively.</Text>

                                                                <Text style={{ color: '#5e83f2', fontWeight: 'bold' }}>
                                                                    Click here
                              </Text>
                                                            </Text>
                                                        </TouchableOpacity>
                                                        // </Text>
                                                    ) : null}
                                                </View>
                                            )}
                                    </View>
                                    {/* <Grid style={{ marginTop: hp('1%'), marginBottom: hp('2%') }}>
                                        <Row>
                                            <Col size={2}></Col>
                                            <Col size={4}>
                                                <Row>
                                                    <Col size={3}></Col>
                                                    <Col size={1.5} style={{ marginTop: 3 }}>
                                                        <View
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: 'white',
                                                                width: 12,
                                                                height: 12,
                                                                backgroundColor: budgetLegendColor,
                                                                borderRadius: 25,
                                                            }}></View>
                                                    </Col>

                                                    <Col size={6.5}>
                                                        <Text
                                                            style={{
                                                                color: '#AAAAAA',
                                                                fontSize: 10,
                                                                marginTop: 2,
                                                                marginLeft: 2,
                                                            }}>
                                                            BUDGET
                              </Text>
                                                    </Col>
                                                    <Col size={1}></Col>
                                                </Row>
                                            </Col>
                                            <Col size={4}>
                                                <Row>
                                                    <Col size={3}></Col>
                                                    <Col size={1.5} style={{ marginTop: 3 }}>
                                                        <View
                                                            style={{
                                                                borderWidth: 1,
                                                                borderColor: '#5E83F2',
                                                                width: 11,
                                                                height: 11,
                                                                backgroundColor: expenseLegendColor,
                                                                borderRadius: 25,
                                                            }}></View>
                                                    </Col>

                                                    <Col size={7}>
                                                        {activeTab == 'DB' ? (
                                                            <Text
                                                                style={{
                                                                    color: '#AAAAAA',
                                                                    fontSize: 10,
                                                                    marginTop: 2,
                                                                    marginLeft: 2,
                                                                }}>
                                                                EXPENSES
                                                            </Text>
                                                        ) : (
                                                                <Text
                                                                    style={{
                                                                        color: '#AAAAAA',
                                                                        fontSize: 10,
                                                                        marginTop: 2,
                                                                        marginLeft: 2,
                                                                    }}>
                                                                    INCOME
                                                                </Text>
                                                            )}
                                                    </Col>
                                                    <Col size={0.5}></Col>
                                                </Row>
                                            </Col>
                                            <Col size={2}></Col>
                                        </Row>
                                    </Grid>
                               */}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ height: hp('20%') }}>
                                {spinner ? (
                                    <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                        Budget vs Expenses
                                    </Text>
                                ) : null}
                                {expenseBudgetGraph == null &&
                                    incomeBudgetGraph == null &&
                                    spinner == false ? (
                                        <TouchableOpacity
                                            onPress={() =>
                                                props.navigation.navigate('budgetCreatePage', { type: 'DB' })
                                            }>
                                            <View>
                                                <Text style={[styles.cardTitle, { padding: hp('2%') }]}>
                                                    Budget vs Expenses
                        </Text>

                                                <Text style={styles.emptyListBudget}>
                                                    <Text>
                                                        Create a Budget and manage your finances
                                                        effectively.
                          </Text>
                                                    <Text style={{ color: '#5e83f2', fontWeight: 'bold' }}>
                                                        Click here
                          </Text>
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : null}
                            </View>
                        )}
                </Card>

            </>
        )
    }
}

export default BudgetCard
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
        marginBottom: wp('5%')
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
    bar: {
        marginTop: 10,
        // height: Dimensions.get("window").height / 2.5,
        // width: wp("80%"),
        maxWidth: '100%',
        height: '100%'
    },
});
