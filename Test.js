import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import PieChart from 'react-native-pie-chart';

const {cond, eq, add, call, set, Value, event, timing} = Animated;
var {width, height} = Dimensions.get('window');

// const config = {
//     duration: 300,
//     toValue: new Value(-1),
//     easing: Easing.inOut(Easing.ease),
// };
const xValue = new Animated.Value(0);
const chart_wh = wp('55%');
const series = [789, 450, 321, 240, 180, 2208];
const sliceColor = [
  '#63CDD6',
  '#F2A413',
  '#F22973',
  '#FCD6E2',
  '#DFE4FB',
  '#FFFFFF',
];
export default class Test extends React.Component {
  componentWillMount = () => {
    this.getCustomerAssests();
  };
  getCustomerAssests = () => {
    return fetch(global.baseURL + 'customer/250001/assets')
      .then((response) => response.json())
      .then((responseJson) => {
        // setCustomerAssets(responseJson.data);
        this.setState({
          customerAssets: responseJson.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  moveAnimation = () => {
    if (this.fadeFlage == false) {
      this.fadeFlage = true;
      Animated.timing(xValue, {
        toValue: width - 70,
        duration: 350,
        // asing: Easing.linear,
      }).start();
    } else {
      this.fadeFlage = false;
      Animated.timing(xValue, {
        toValue: 0,
        duration: 350,
        // asing: Easing.linear,
      }).start();
    }
  };

  constructor(props) {
    super(props);
    this.fadeFlage = false;
    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.absoluteY = new Value(hp('72%'));
    this.absoluteX = new Value(wp('10%'));
    this.offsetX = new Value(0);
    this.offsetY = new Value(0);
    this.gestureState = new Value(-1);
    this.translateX = new Animated.Value(0);
    this.horizontalGesState = new Value(-1);
    this.State = {
      customerAssets: [],
    };
    this._forwardConfig = {
      duration: 350,
      toValue: -(width - 70),
      easing: Easing.out(Easing.ease),
    };
    this._backwardConfig = {
      duration: 350,
      toValue: 0,
      easing: Easing.out(Easing.ease),
    };
    // const[customerAssets, setCustomerAssets] = useState([])
    this.onGestureEvent = event([
      {
        nativeEvent: {
          absoluteY: this.absoluteY,
          state: this.gestureState,
          transY: this.dragY,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
        },
      },
    ]);
    this.onHorizontalGesEvent = Animated.event([
      {
        nativeEvent: {
          translateX: this.translateX,
        },
      },
    ]);
    // this.onMoveAnimation = event([
    //     {
    //         nativeEvent: {
    //             absoluteX: this.absoluteX,
    //             state: this.gestureState,
    //             transY: this.dragY,
    //             offsetX: this.offsetX,
    //             offsetY: this.offsetY
    //         },
    //     },
    // ]);
    // this.transY = cond(eq(this.gestureState, State.ACTIVE), this.absoluteY, [
    //     set(this.offsetY, this.absoluteY),
    // ]);
  }

  onStateChange = (event) => {
    // alert('OK');
    // if (event.nativeEvent.oldState == State.ACTIVE) {
    if (this.fadeFlage == false) {
      this.fadeFlage = true;
      Animated.timing(this.translateX, this._forwardConfig).start();
    } else {
      this.fadeFlage = false;
      Animated.timing(this.translateX, this._backwardConfig).start();
    }
  };
  render() {
    return (
      <View
        style={{flexDirection: 'column', flex: 1, backgroundColor: '#5E83F2'}}>
        {/* <Animated.Code>
                    {() =>
                        cond(
                            eq(this.gestureState, State.END),
                            call([this.addX, this.addY], this.onDrop)
                        )
                    }
                </Animated.Code> */}
        <Animated.View style={styles.layer1}>
          <View style={{height: hp('30%')}}>
            <View>
              <Image
                resizeMode={'stretch'}
                style={{maxWidth: '100%'}}
                source={require('./assets/graph_bg(dark).png')}></Image>
            </View>
            <View style={styles.container}>
              <View style={styles.header}>
                <Grid>
                  <Row>
                    <Col size={2}>
                      <Image
                        source={require('./assets/icons-menu(white)(2).png')}></Image>
                    </Col>
                    <Col size={8}>
                      <Text style={{textAlign: 'center', color: 'white'}}>
                        All Banks - JAN 2020
                      </Text>
                    </Col>
                    <Col size={2}>
                      <View>
                        <Image
                          style={{marginLeft: 'auto'}}
                          source={require('./assets/icons-filter-dark(white)(1).png')}></Image>
                      </View>
                    </Col>
                  </Row>
                </Grid>
              </View>
              <Text style={styles.pageHeading}>Accounts</Text>
              <View style={styles.totalAsset}>
                <Text style={styles.tAssetLabel}>Total Assets</Text>
                <Text style={styles.tAssetPrice}>₹ 13,07,250.00</Text>
              </View>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{position: 'absolute', top: hp('5%'), left: '-28.5%'}}>
              <PieChart
                chart_wh={chart_wh}
                series={series}
                sliceColor={sliceColor}
                doughnut={true}
                coverRadius={0.55}
                coverFill={'#5E83F2'}
              />
            </View>
            <ScrollView>
              <View style={{paddingLeft: hp('25%')}}>
                <Grid>
                  <Row style={{paddingBottom: 10}}>
                    <Col size={2}>
                      <View style={{width: 40, height: 40}}>
                        <Image
                          style={{
                            maxWidth: '100%',
                            height: '100%',
                            borderRadius: 30,
                          }}
                          source={require('./assets/bank_of_baroda-13x.png')}></Image>
                      </View>
                    </Col>
                    <Col size={10}>
                      <Text
                        style={{
                          color: 'white',
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}>
                        IDFC BANK
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{paddingBottom: 10}}>
                    <Col size={2}>
                      <View style={{width: 40, height: 40}}>
                        <Image
                          style={{
                            maxWidth: '100%',
                            height: '100%',
                            borderRadius: 30,
                          }}
                          source={require('./assets/bandhan_bank3x.png')}></Image>
                      </View>
                    </Col>
                    <Col size={10}>
                      <Text
                        style={{
                          color: 'white',
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}>
                        BANDHAN BANK
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{paddingBottom: 10}}>
                    <Col size={2}>
                      <View style={{width: 40, height: 40}}>
                        <Image
                          style={{
                            maxWidth: '100%',
                            height: '100%',
                            borderRadius: 30,
                          }}
                          source={require('./assets/bank_of_india3x.png')}></Image>
                      </View>
                    </Col>
                    <Col size={10}>
                      <Text
                        style={{
                          color: 'white',
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}>
                        BANK OF INDIA
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{paddingBottom: 10}}>
                    <Col size={2}>
                      <View style={{width: 40, height: 40}}>
                        <Image
                          style={{
                            maxWidth: '100%',
                            height: '100%',
                            borderRadius: 30,
                          }}
                          source={require('./assets/induslnd3x.png')}></Image>
                      </View>
                    </Col>
                    <Col size={10}>
                      <Text
                        style={{
                          color: 'white',
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}>
                        INDUSINDU BANK
                      </Text>
                    </Col>
                  </Row>
                  <Row style={{paddingBottom: 10}}>
                    <Col size={2}>
                      <View style={{width: 40, height: 40}}>
                        <Image
                          style={{
                            maxWidth: '100%',
                            height: '100%',
                            borderRadius: 30,
                          }}
                          source={require('./assets/bank13x.png')}></Image>
                      </View>
                    </Col>
                    <Col size={10}>
                      <Text
                        style={{
                          color: 'white',
                          paddingTop: 10,
                          paddingLeft: 10,
                        }}>
                        BANK
                      </Text>
                    </Col>
                  </Row>
                </Grid>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
        {/* <PanGestureHandler
                    maxPointers={1}
                    minDist={10}
                    onGestureEvent={this.onGestureEvent}
                    // onGestureEvent={e => console.log(e)}
                    onHandlerStateChange={this.onGestureEvent}> */}
        <Animated.View
          style={[
            styles.layer2,
            {
              top: this.absoluteY,
              // transform: [
              //     // {
              //     //     translateX: this.transX,
              //     // },
              //     {
              //         translateY: this.transY,
              //     },
              // ],
            },
          ]}>
          <Animated.View
            style={{
              height: hp('13%'),
              backgroundColor: '#F2A413',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              marginBottom: 35,
              // height: 100,
              // backgroundColor: "#F2A413",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}>
            <Animated.View style={{transform: [{translateX: this.translateX}]}}>
              <Grid>
                <Row style={{width: '100%'}}>
                  <Col>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <View
                        style={{
                          padding: hp('2.5%'),
                          paddingTop: hp('1.5%'),
                          paddingLeft: wp('5%'),
                        }}>
                        <View style={{width: 50, height: 50}}>
                          <Image
                            style={{
                              maxWidth: '100%',
                              height: '100%',
                              borderRadius: 40,
                            }}
                            source={require('./assets/demobank.png')}></Image>
                        </View>
                      </View>
                      <View style={{paddingTop: hp('3.5%')}}>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontSize: 16,
                            marginLeft: -10,
                          }}>
                          HDFC BANK
                        </Text>
                      </View>
                      <View
                        style={{paddingLeft: wp('38%'), paddingTop: hp('3%')}}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            alignItems: 'flex-end',
                          }}>
                          {/* <TouchableOpacity onPress={this.moveAnimation()}> */}
                          <PanGestureHandler
                            onGestureEvent={this.onHorizontalGesEvent}
                            onHandlerStateChange={this.onStateChange}>
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={require('./assets/icon-settings_white.png')}></Image>
                            {/* </TouchableOpacity> */}
                          </PanGestureHandler>
                        </View>
                      </View>
                      {/*   paddingLeft:wp("38%") */}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          paddingTop: hp('1.5%'),
                          paddingLeft: wp('12%'),
                        }}>
                        <Grid>
                          <Row>
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/consent_icon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Revoke Consent
                                </Text>
                              </View>
                            </Col>
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/Send_fund_icon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Send Funds
                                </Text>
                              </View>
                            </Col>
                            <Col>
                              <View style={{alignItems: 'center'}}>
                                <View style={{width: 60, height: 60}}>
                                  <Image
                                    style={{maxWidth: '100%', height: '100%'}}
                                    source={require('./assets/Request_fund_icon.png')}></Image>
                                </View>
                                <Text style={{fontSize: 10, color: 'white'}}>
                                  Request Funds
                                </Text>
                              </View>
                            </Col>
                            <Col></Col>
                          </Row>
                        </Grid>
                      </View>
                    </View>
                  </Col>
                </Row>
                <Row style={{marginTop: 52}}>
                  <Col>
                    <View style={{paddingRight: wp('10%')}}>
                      <Text style={styles.tAssetLabel}>Assets in the bank</Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 24,
                          textAlign: 'right',
                        }}>
                        ₹ 1,01,700.00
                      </Text>
                    </View>
                  </Col>
                </Row>
              </Grid>
            </Animated.View>
          </Animated.View>
          <PanGestureHandler
            // maxPointers={1}
            // minDist={10}
            onGestureEvent={this.onGestureEvent}
            // onGestureEvent={e => console.log(e)}
            // onHandlerStateChange={this.onGestureEvent}
          >
            <Animated.View
              style={{
                padding: hp('2%'),
                height: hp('100%'),
                backgroundColor: 'white',
                // margin: 0
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
              }}>
              {/* <Grid>
                                <Row>
                                    <Col size={3}>
                                        <View style={{ width: 45, height: 45, alignItems: 'flex-end' }}>
                                            <Image style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/savingACicon.png")}></Image>
                                        </View>
                                    </Col>
                                    <Col size={4}>
                                        <Text>...2453 </Text>
                                        <Text>Saving A/c</Text>
                                    </Col>
                                    <Col size={5}>
                                        <Text style={{ textAlign: 'right', paddingRight: hp('2%'), paddingTop: hp("1%") }}>₹ 56,000.00</Text>
                                    </Col>
                                </Row>
                            </Grid> */}
              <Collapse>
                <CollapseHeader>
                  <View
                    style={{
                      padding: hp('2%'),
                      paddingRight: 20,
                    }}>
                    <Grid>
                      <Row>
                        <Col size={3}>
                          <View
                            style={{
                              width: 45,
                              height: 45,
                              alignItems: 'flex-end',
                            }}>
                            <Image
                              style={{maxWidth: '100%', height: '100%'}}
                              source={require('./assets/savingACicon.png')}></Image>
                          </View>
                        </Col>
                        <Col size={4}>
                          <Text>...2453 </Text>
                          <Text>Saving A/c</Text>
                        </Col>
                        <Col size={5}>
                          <Text
                            style={{
                              textAlign: 'right',
                              paddingRight: hp('2%'),
                              paddingTop: hp('1%'),
                            }}>
                            ₹ 56,000.00
                          </Text>
                        </Col>
                      </Row>
                    </Grid>
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <Text>Account</Text>
                  <Text>Account-1</Text>
                  <Text>Account-2</Text>
                  <Text>Account-3</Text>
                </CollapseBody>
              </Collapse>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
        {/* </PanGestureHandler> */}
      </View>
    );
  }
}

const CIRCLE_SIZE = 70;

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'column',
//         flex: 1,
//         backgroundColor: "#5E83F2"
//     },
//     box: {
//         backgroundColor: 'tomato',
//         position: 'absolute',
//         // marginLeft: -(CIRCLE_SIZE / 2),
//         // marginTop: -(CIRCLE_SIZE / 2),
//         width: '100%',
//         height: '100%',
//         // borderRadius: CIRCLE_SIZE / 2,
//         // borderColor: '#000',
//     },
// });
const styles = StyleSheet.create({
  // box: {
  //     // backgroundColor: 'tomato',
  //     position: 'absolute',
  //     // marginLeft: -(CIRCLE_SIZE / 2),
  //     // marginTop: -(CIRCLE_SIZE / 2),
  //     width: '100%',
  //     height: '100%',
  //     // borderRadius: CIRCLE_SIZE / 2,
  //     // borderColor: '#000',
  // },
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('6%'),
    paddingBottom: hp('2%'),
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pageHeading: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: hp('3.5%'),
  },
  totalAsset: {
    paddingRight: hp('3.5%'),
  },
  tAssetLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.7,
  },
  tAssetPrice: {
    color: '#FFFFFF',
    fontSize: 30,
    textAlign: 'right',
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    zIndex: 10,
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  layer1: {
    flex: 3,
    backgroundColor: '#5E83F2',
    opacity: 1,
  },
  layer2: {
    height: hp('30%'),
    backgroundColor: '#F2A413',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    width: '100%',
  },
  layer3: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
});
