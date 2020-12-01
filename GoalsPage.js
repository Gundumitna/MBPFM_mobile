import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  ActivityIndicator,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import ProgressBar from 'react-native-progress/Bar';
import {Card} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';
import AmountDisplay from './AmountDisplay';

const GoalsPage = ({navigation}) => {
  const dispatch = useDispatch();
  let ls = require('react-native-local-storage');
  const [spinner, setSpinner] = useState(false);
  const [heading, setHeading] = useState('');
  const [loader, setLoader] = useState(false);
  const {rightDrawerState} = useSelector((state) => state.appConfig);
  const isDrawerOpen = useIsDrawerOpen();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [goalData, setGoalData] = useState();
  const [eleToDelete, setEleToDelete] = useState();
  const [flag, setFlag] = useState(false);
  const [user, setUser] = React.useState(null);
  const [notransaction, setNotransaction] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      // const unsubscribe = subscribe(() => {
      ls.save('selectedDrawerItem', 'goalsPage');
      getGoalData();

      // });

      // return () => unsubscribe();
    }, [navigation]),
  );

  // useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', () => {
  //         ls.save('selectedDrawerItem', 'goalsPage')
  //         getGoalData()
  //     });
  //     return unsubscribe;
  // }, [navigation])

  useEffect(() => {
    console.log('Dashboard Page');

    if (rightDrawerState == 'reload' && isDrawerOpen == false) {
      if (spinner == false) {
        console.log('isDrawerOpen : ' + isDrawerOpen);

        getGoalData();
      }
    }
    return () => {
      dispatch(AppConfigActions.resetRightDrawer());
    };
  }, [rightDrawerState == 'reload']);

  getGoalData = () => {
    setSpinner(true);
    setNotransaction(false);
    ls.get('filterData').then((data) => {
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
    });
    fetch(global.baseURL + 'customer/get/goals/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        if (responseJson.data == null) {
          setNotransaction(true);
        } else {
          setNotransaction(false);
        }
        setGoalData(responseJson.data);
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  deleteFunction = () => {
    setSpinner(true);
    console.log(eleToDelete.goalName);
    let d = {};
    d.key = eleToDelete.key;
    d.goalName = eleToDelete.goalName;

    console.log(d);

    fetch(
      global.baseURL + 'customer/save/goal/details/' + global.loginID + '/D',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(d),
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setEleToDelete();
        console.log(responseJson);

        if (
          responseJson.status == 200 ||
          responseJson.message == 'Request Completed'
        ) {
          getGoalData();
        } else {
          navigation.navigate('successPage', {type: 'failure'});
        }
        setIsModalVisible(false);
        setSpinner(false);
      })
      .catch(() => {
        console.log(error);
        navigation.navigate('successPage', {type: 'failure'});
        setSpinner(false);
      });
  };
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);
  toggleModal = (data) => {
    console.log(data);
    if (data != undefined) {
      setEleToDelete(data);
      console.log(data);
      setFlag(true);
    }

    if (isModalVisible) {
      setEleToDelete();
    }
    console.log(eleToDelete);
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View
      style={{flexDirection: 'column', flex: 1, backgroundColor: '#5E83F2'}}>
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
          zIndex: 30,
        }}
        onPress={() =>
          navigation.navigate('createAndEditGoals', {type: 'create'})
        }>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Addbutton.png')}></Image>
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg.png')}></Image>
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={navigation.openDrawer}
              style={{marginRight: 'auto'}}>
              <Image
                source={require('./assets/icons-menu(white)(2).png')}></Image>
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginRight: 'auto',
              }}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                {heading}
              </Text>
            </View>
            {/* <TouchableOpacity
                            onPress={() => dispatch(AppConfigActions.toggleRightDrawer())} style={{ marginLeft: 'auto' }}>
                            <Image style={{ marginLeft: 'auto' }} source={require("./assets/icons-filter-dark(white)(1).png")}></Image>
                        </TouchableOpacity> */}
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.pageHeading}>Goals</Text>
            {loader == true ? (
              <View
                style={{
                  marginLeft: 'auto',
                  marginTop: hp('1%'),
                  marginRight: hp('3%'),
                }}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          flex: 4,
        }}>
        <View style={styles.line}></View>
        {notransaction == false ? (
          <FlatList
            data={goalData}
            style={{paddingLeft: hp('4%'), paddingRight: hp('4%')}}
            renderItem={({item}) => (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('goalStatementPage', {
                      selectedItem: item,
                    });
                  }}>
                  <Card containerStyle={styles.card}>
                    <View style={{height: hp('23%'), position: 'relative'}}>
                      {item.image != null ? (
                        <Image
                          resizeMode={'contain'}
                          style={{maxWidth: '100%', height: '100%'}}
                          source={{
                            uri: global.baseURL + 'customer/' + item.image,
                          }}
                        />
                      ) : (
                        <View></View>
                      )}
                    </View>
                    <>
                      {(item.status == 'COMPLETED' && item.activeFlag == 1) ||
                      item.activeFlag == 0 ? (
                        <View>
                          {item.status == 'COMPLETED' &&
                          item.activeFlag == 1 ? (
                            <Grid>
                              <Row
                                style={{
                                  backgroundColor: '#199AA6',
                                  paddingTop: hp('1%'),
                                  paddingBottom: hp('1%'),
                                  position: 'absolute',
                                  bottom: '10%',
                                }}>
                                <Col size={3}></Col>
                                <Col size={9}>
                                  <Text
                                    style={{
                                      color: 'white',
                                      fontSize: 16,
                                      fontWeight: 'bold',
                                    }}>
                                    Congratulations!!!
                                  </Text>
                                  <Text
                                    style={{
                                      color: 'white',
                                      fontSize: 11,
                                      opacity: 0.7,
                                    }}>
                                    Your goal completed successfully
                                  </Text>
                                </Col>
                              </Row>
                            </Grid>
                          ) : (
                            <Grid>
                              <Row
                                style={{
                                  backgroundColor: '#f2a413',
                                  paddingTop: hp('1%'),
                                  paddingBottom: hp('1%'),
                                  position: 'absolute',
                                  bottom: '10%',
                                }}>
                                {/* <Col size={3}></Col> */}
                                <Col size={12}>
                                  {/* <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Congratulations!!!</Text> */}
                                  <Text
                                    style={{
                                      color: 'white',
                                      fontSize: 11,
                                      opacity: 0.7,
                                      textAlign: 'center',
                                    }}>
                                    Your goal is closed
                                  </Text>
                                </Col>
                              </Row>
                            </Grid>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            bottom: '40%',
                          }}>
                          <TouchableOpacity
                            style={{width: '100%'}}
                            disabled={
                              (item.status == 'COMPLETED' &&
                                item.activeFlag == 1) ||
                              item.activeFlag == 0
                            }
                            onPress={() =>
                              navigation.navigate('createAndEditGoals', {
                                type: 'edit',
                                selectedData: item,
                              })
                            }>
                            <View
                              style={{
                                width: wp('10%'),
                                height: hp('10%'),
                                marginRight: hp('1%'),
                                alignSelf: 'flex-end',
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{maxWidth: '100%', height: '100%'}}
                                source={require('./assets/Edit_icon.png')}></Image>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              zIndex: 100,
                              marginTop: hp('-2%'),
                              alignSelf: 'flex-end',
                            }}
                            disabled={
                              (item.status == 'COMPLETED' &&
                                item.activeFlag == 1) ||
                              item.activeFlag == 0
                            }
                            onPress={(event) => toggleModal(item)}>
                            <View
                              style={{
                                width: wp('10%'),
                                height: hp('10%'),
                                marginRight: hp('1%'),
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{maxWidth: '100%', height: '100%'}}
                                source={require('./assets/delete_icon.png')}></Image>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                    <View style={{padding: hp('1%')}}>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            marginTop: hp('0.5%'),
                            marginLeft: hp('0.4%'),
                          }}>
                          <Text style={{color: '#454F63', fontSize: 14}}>
                            {item.goalName}{' '}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginTop: hp('0.4%'),
                            alignSelf: 'flex-end',
                            justifyContent: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: '#454F63',
                              fontSize: 9,
                              marginRight: 3,
                              marginTop: 3,
                            }}>
                            {item.currency}
                          </Text>
                          <AmountDisplay
                            style={{
                              color: '#454F63',
                              fontSize: 18,
                            }}
                            amount={Number(item.goalAmount)}
                            currency={item.currency}
                          />
                          {/* <NumberFormat
                            value={Number(item.goalAmount)}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={{color: '#454F63', fontSize: 18}}>
                                {value}
                              </Text>
                            )}
                          /> */}
                        </View>
                      </View>
                      <View>
                        <ProgressBar
                          borderColor={'transparent'}
                          height={10}
                          borderRadius={35}
                          progress={
                            Number(item.savedAmount).toFixed(2) /
                            Number(item.goalAmount).toFixed(2)
                          }
                          width={null}
                          color={
                            Number(item.goalAmount - item.savedAmount) == 0
                              ? '#63CDD6'
                              : Number(item.savedAmount).toFixed(2) /
                                  Number(item.goalAmount).toFixed(2) >=
                                  0 &&
                                Number(item.savedAmount).toFixed(2) /
                                  Number(item.goalAmount).toFixed(2) <
                                  0.5
                              ? '#F55485'
                              : '#F2A413'
                          }
                          unfilledColor={
                            Number(item.goalAmount - item.savedAmount) == 0
                              ? '#63CDD6'
                              : Number(item.savedAmount).toFixed(2) /
                                  Number(item.goalAmount).toFixed(2) >=
                                  0 &&
                                Number(item.savedAmount).toFixed(2) /
                                  Number(item.goalAmount).toFixed(2) <
                                  0.5
                              ? '#FCD6E2'
                              : '#FDEDD4'
                          }
                        />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <View>
                          <Text style={{color: '#888888', fontSize: 14}}>
                            Saved Amount
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                              marginTop: hp('0.4%'),
                              alignSelf: 'flex-end',
                              justifyContent: 'flex-end',
                            }}>
                            <Text
                              style={{
                                color: '#888888',
                                fontSize: 9,
                                marginRight: 3,
                                marginTop: 3,
                              }}>
                              {item.currency}
                            </Text>
                            <AmountDisplay
                              style={{
                                color: '#888888',
                                fontSize: 18,
                              }}
                              amount={Number(item.savedAmount)}
                              currency={item.currency}
                            />
                            {/* <NumberFormat
                              value={Number(item.savedAmount)}
                              displayType={'text'}
                              thousandsGroupStyle={global.thousandsGroupStyle}
                              thousandSeparator={global.thousandSeparator}
                              decimalScale={global.decimalScale}
                              fixedDecimalScale={true}
                              // prefix={'₹'}
                              renderText={(value) => (
                                <Text style={{color: '#888888', fontSize: 18}}>
                                  {value}
                                </Text>
                              )}
                            /> */}
                          </View>
                        </View>
                        <View style={{marginLeft: 'auto'}}>
                          <Text
                            style={{
                              color: '#888888',
                              fontSize: 14,
                              textAlign: 'right',
                            }}>
                            Remaining
                          </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                              marginTop: hp('0.4%'),
                              alignSelf: 'flex-end',
                              justifyContent: 'flex-end',
                            }}>
                            <Text
                              style={{
                                color: '#888888',
                                fontSize: 9,
                                marginRight: 3,
                                marginTop: 3,
                              }}>
                              {item.currency}
                            </Text>
                            <AmountDisplay
                              style={{
                                color: '#888888',
                                fontSize: 18,
                              }}
                              amount={Number(
                                item.goalAmount - item.savedAmount,
                              )}
                              currency={item.currency}
                            />
                            {/* <NumberFormat
                              value={Number(item.goalAmount - item.savedAmount)}
                              displayType={'text'}
                              thousandsGroupStyle={global.thousandsGroupStyle}
                              thousandSeparator={global.thousandSeparator}
                              decimalScale={global.decimalScale}
                              fixedDecimalScale={true}
                              // prefix={'₹'}
                              renderText={(value) => (
                                <View>
                                  <Text
                                    style={{
                                      color: '#888888',
                                      fontSize: 18,
                                      textAlign: 'right',
                                    }}>
                                    {value}
                                  </Text>
                                </View>
                              )}
                            /> */}
                          </View>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              </View>
            )}
          />
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
              You haven’t contributed to your goal yet!
            </Text>
            <Text
              style={{
                color: '#454F63',
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
              }}>
              Please start right away!
            </Text>
          </View>
        )}
      </View>
      <Modal
        testID={'modal'}
        isVisible={isModalVisible}
        style={styles.view}
        swipeDirection={'up'}>
        <View style={{flex: 1}}>
          <View style={styles.modalImag}>
            <Image
              resizeMode={'contain'}
              style={{maxWidth: '100%', height: '100%'}}
              source={require('./assets/deleteModalImg.png')}
            />
          </View>
          <Text style={styles.modalText1}>Are you Sure want to Delete ?</Text>
          <Text style={styles.modalText2}>This will Delete your Goal.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => deleteFunction()}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => toggleModal()}>
            <Text
              style={{width: '100%', textAlign: 'center', color: '#5E83F2'}}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default GoalsPage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('2%'),
    width: wp('100%'),
    flex: 0.2,
  },
  header: {
    padding: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    flexDirection: 'row',
    zIndex: 1,
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 21,
    paddingTop: hp('0.5%'),
  },
  card: {
    padding: hp('1%'),
    elevation: 1.5,
    shadowOffset: {width: 0, height: hp('0.1%')},
    shadowColor: '#00000029',
    shadowOpacity: 1,
    borderRadius: 5,
    marginBottom: hp('0.8%'),
  },
  backBtn: {
    paddingTop: hp('1%'),
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
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: hp('2%'),
  },
  pageHeading: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: hp('2.5%'),
  },
  completedBudget: {
    paddingLeft: hp('5%'),
    paddingRight: hp('5%'),
    paddingBottom: hp('3%'),
    paddingTop: hp('3%'),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    backgroundColor: '#DBF3F5',
  },
  closedBudgte: {
    paddingLeft: hp('5%'),
    paddingRight: hp('5%'),
    paddingBottom: hp('3%'),
    paddingTop: hp('3%'),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    backgroundColor: '#FDEDD4',
  },
  processingBudget: {
    paddingLeft: hp('5%'),
    paddingRight: hp('5%'),
    paddingBottom: hp('3%'),
    paddingTop: hp('3%'),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    backgroundColor: 'white',
  },
  rowBack: {
    alignItems: 'flex-end',
    backgroundColor: '#E2E2E2',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'white',
    marginTop: hp('40%'),
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
  },
  modalImag: {
    alignSelf: 'center',
    width: hp('12%'),
    height: hp('12%'),
    padding: hp('1%'),
    marginBottom: hp('3.5%'),
    margin: hp('8%'),
  },
  modalText1: {
    color: '#454F63',
    fontSize: 18,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalText2: {
    color: '#5D707D',
    fontSize: 12,
    marginBottom: wp('5%'),
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#DFE4FB',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#F55485',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    color: 'white',
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    textAlign: 'center',
  },
});
