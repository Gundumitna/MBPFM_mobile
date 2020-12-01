import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import ToggleSwitch from 'toggle-switch-react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {FlatList} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import AmountDisplay from './AmountDisplay';

// flex: hp("3%"),
// useEffect(() => {
//     getFonts();
// }, [])
// const getFonts = () => {
//     return Font.loadAsync({
//         'roboto-regular': require("./assets/fonts/Robot/Roboto-Regular.ttf"),
//         'roboto-bold': require("./assets/fonts/Roboto/Roboto-Bold.ttf")
//     })
// }

function TransactionPage({route, navigation}) {
  // const [fontsLoaded, setFontsLoaded] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  // const [region, setRegion] = useState({
  //     latitude: 51.5078788,
  //     longitude: -0.0877321,
  //     latitudeDelta: 0.009,
  //     longitudeDelta: 0.009,
  // });
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);
  // const [opacity, setOpacity] = useState(1);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch = () => {
    console.log(transactionDetails.notAExpense);
    console.log(route.params);

    console.log(transactionDetails.transactionId);
    // setIsEnabled(previousState => !previousState)
    // if (isEnabled == true) {
    if (route.params.selectedItem.type != 'P') {
      setSpinner(true);
      fetch(
        global.baseURL +
          'customer/mark/notAExpense/' +
          transactionDetails.transactionId,
        {
          // fetch(global.baseURL+'customer/mark/notAExpense/' + route.params.selectedItem.transactionId, {
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
          if (responseJson.message != 'Exception In Server') {
            setIsEnabled((previousState) => !previousState);
            getTransactionDetails();
          }

          setSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setSpinner(false);
        });
    } else {
      if (route.params.statementData.typeOfTransaction == 'DB') {
        Alert.alert(
          'Alert',
          'You cannot change a parent transaction to "Not an Expense". ',
        );
      } else {
        Alert.alert(
          'Alert',
          'You cannot change a parent transaction to "Not an Income". ',
        );
      }
    }
  };
  clickedOnCategorize = () => {
    if (route.params.selectedItem.type == 'P') {
      Alert.alert(
        'Alert',
        'You cannot categorize a parent transaction. Please select other transaction',
      );
    } else {
      if (route.params.selectedItem.type == 'C') {
        navigation.navigate('categoriesPage', {
          reNavigateTo: 'transactionPage',
          reDirectTo: route.params.reDirectTo,
          transaction: route.params.selectedItem,
          splitList: route.params.splitList,
        });
      } else {
        navigation.navigate('categoriesPage', {
          reNavigateTo: 'transactionPage',
          reDirectTo: route.params.reDirectTo,
          transaction: route.params.selectedItem,
          splitList: route.params.selectedItem,
        });
      }
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      getTransactionDetails();
      // return
    });
    unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(transactionDetails.notAExpense);

    if (transactionDetails.notAExpense == null) {
      setIsEnabled(false);
    } else if (transactionDetails.notAExpense == 'true') {
      setIsEnabled(true);
    } else if (transactionDetails.notAExpense == 'false') {
      setIsEnabled(false);
    }
    console.log(isEnabled);
  }, [isEnabled == true || isEnabled == false]);

  getTransactionDetails = () => {
    setSpinner(true);
    fetch(
      global.baseURL +
        'customer/get/transaction/details/' +
        route.params.selectedItem.transactionId,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        let c = [];
        for (let d of responseJson.data) {
          if (d.transactionId === route.params.selectedItem.transactionId) {
            for (let cont of d.contacts) {
              let cl = {};
              cl.id = null;
              cl.type = 'contacts';
              cl.name = cont.name;
              cl.image = cont.profilePicture;
              cl.number = cont.phoneNumber;
              c.push(cl);
            }
            for (let beneficiary of d.beneficiary) {
              let cl = {};
              cl.type = 'beneficiary';
              cl.id = beneficiary.id;
              cl.name = beneficiary.beneficiaryName;
              cl.image = null;
              cl.number = beneficiary.beneficiaryAccountNumber;
              c.push(cl);
            }
            d.contactsAndBeneficiary = c;
            if (d.notAExpense == null) {
              setIsEnabled(false);
            } else if (d.notAExpense == 'true') {
              setIsEnabled(true);
            } else if (d.notAExpense == 'false') {
              setIsEnabled(false);
            }
            setTransactionDetails(d);
            console.log(d);
            setImageUploaded(false);
            setFlag(true);
            // return
          }
        }
        setSpinner(false);
      });

    // }
  };

  const uploadImage = () => {
    const options = {
      title: 'Select Avatar',
      cameraType: 'front',
      mediaType: 'photo',
      quality: 0.2,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      setSpinner(true);
      setImageUploaded(true);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        setSpinner(false);
        setImageUploaded(false);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setSpinner(false);
        setImageUploaded(false);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
        setSpinner(false);
        setImageUploaded(false);
      } else {
        // SetFileuri(response.uri); //update state to update Image
        // console.log(response.data.split(';', 1))
        let data = {};
        console.log(
          'route.paramstransactionId : ' +
            route.params.selectedItem.transactionId,
        );
        // data = response.data.split(';', 1)
        // fetch(response.uri)
        var photo = {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', '/private'),
          type: 'image/jpeg',
          name: 'photo.jpg',
        };

        var form = new FormData();
        form.append('file', photo);

        fetch(
          global.baseURL +
            'customer/save/transaction/details/image/' +
            route.params.selectedItem.transactionId,
          {
            body: form,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              // 'Authorization': 'Bearer ' + user.token
            },
          },
        )
          .then((response) => response.json())
          .catch((error) => {
            console.log('ERROR ' + error);
          })
          .then((responseJson) => {
            console.log(responseJson);
            // setSpinner(true)
            setImageUploaded(true);
            getTransactionDetails();
          })
          .done();
      }
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={imageUploaded ? 'Uploading Image...' : 'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{backgroundColor: 'white'}}>
        <View>
          <Image
            resizeMode={'contain'}
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg(dark).png')}></Image>
        </View>
        <View
          style={{paddingTop: hp('3.5%'), position: 'absolute', width: '100%'}}>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate(route.params.reDirectTo)}>
              <View style={{width: 30, height: 30, marginTop: -3}}>
                <Image
                  style={{maxWidth: '100%', height: '100%'}}
                  source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Transaction</Text>
            </View>
          </View>
        </View>
        <ScrollView style={{width: '100%', top: wp('-31%'), height: hp('60%')}}>
          <Row
            style={{
              padding: hp('2%'),
              paddingTop: hp('2.5%'),
              backgroundColor: '#DFE4FB',
            }}>
            <Col size={2} style={{alignItems: 'center'}}>
              <View style={{width: 45, height: 45}}>
                {/* {route.params.selectedItem.merchantIcon != null && route.params.selectedItem.merchantIcon != "" ? */}
                {transactionDetails.merchantIcon != null &&
                transactionDetails.merchantIcon != '' ? (
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri:
                        global.baseURL +
                        'customer/' +
                        transactionDetails.merchantIcon,
                    }}></Image>
                ) : (
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri:
                        global.baseURL + 'customer/' + transactionDetails.icon,
                    }}></Image>
                )}
              </View>
            </Col>
            <Col size={5.5}>
              <Text style={{color: '#454F63', fontSize: 14}}>
                {transactionDetails.description}
              </Text>
              {transactionDetails.transactionTimestamp != null &&
              transactionDetails.transactionTimestamp != '' ? (
                <Text style={{color: '#454F63', fontSize: 14, opacity: 0.7}}>
                  {transactionDetails.category} |{' '}
                  {Moment(
                    transactionDetails.transactionTimestamp,
                    'YYYY-MM-DD,h:mm:ss',
                  ).format(global.dateFormat)}
                </Text>
              ) : (
                <Text style={{color: '#454F63', fontSize: 14, opacity: 0.7}}>
                  {transactionDetails.category}
                </Text>
              )}
            </Col>
            <Col size={4.5} style={{alignItems: 'flex-end', paddingRight: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  justifyContent: 'flex-end',
                }}>
                <Text
                  style={{
                    color: '#454F63',
                    fontSize: 9,
                    marginRight: 3,
                    marginTop: 3,
                  }}>
                  {transactionDetails.transactionCurrency}
                </Text>
                <AmountDisplay
                  style={{color: '#454F63', fontSize: 18}}
                  amount={Number(transactionDetails.amount)}
                  currency={transactionDetails.transactionCurrency}
                />
                {/* <NumberFormat
                  value={Number(transactionDetails.amount)}
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
            </Col>
          </Row>
          <View
            style={{
              paddingLeft: hp('5.5%'),
              paddingRight: hp('5%'),
              paddingBottom: hp('4%'),
            }}>
            <Grid style={{padding: hp('2%'), paddingTop: hp('0.8%')}}>
              <Col style={{paddingTop: hp('1%'), paddingLeft: wp('3%')}}>
                <Text
                  style={{color: '#454F63', fontSize: 14, fontWeight: 'bold'}}>
                  Mode
                </Text>
              </Col>
              <Row style={{paddingTop: hp('2%'), paddingBottom: 5}}>
                <Col size={0.5}></Col>
                <Col
                  size={1.5}
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: 'white',
                    borderRadius: 50,
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{
                      uri:
                        global.baseURL +
                        'customer/' +
                        transactionDetails.modeIcon,
                    }}></Image>
                </Col>
                {/* </Col> */}
                <Col size={10}>
                  <Text
                    style={{
                      marginLeft: 5,
                      paddingTop: 6,
                      color: '#454F63',
                      fontSize: 12,
                    }}>
                    {transactionDetails.mode}
                  </Text>
                </Col>
              </Row>
              <Col style={{paddingTop: hp('1%'), paddingLeft: wp('3%')}}>
                <Text
                  style={{color: '#454F63', fontSize: 14, fontWeight: 'bold'}}>
                  Actual Transaction
                </Text>
              </Col>
              <Row style={{paddingTop: hp('2%'), paddingLeft: wp('3%')}}>
                <Col
                  size={1.5}
                  style={{backgroundColor: 'white', borderRadius: 50}}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={{uri: transactionDetails.bankIcon}}></Image>
                </Col>
                <Col
                  size={10.5}
                  style={{paddingTop: hp('1.5%'), paddingLeft: wp('1%')}}>
                  <Text style={{fontSize: 12, color: '#454F63'}}>
                    {route.params.selectedItem.accountNumber.replace(
                      /.(?=.{4})/g,
                      '.',
                    )}{' '}
                    | {transactionDetails.accountType}
                  </Text>
                  <Text style={{fontSize: 12, color: '#454F63', opacity: 0.7}}>
                    {transactionDetails.bankName}
                  </Text>
                </Col>
              </Row>
              <View style={{paddingTop: hp('2%'), paddingLeft: wp('3%')}}>
                <Col style={{paddingLeft: wp('2%'), paddingBottom: hp('1.5%')}}>
                  <Text style={{fontSize: 12, color: '#454F63', opacity: 0.7}}>
                    Date:
                  </Text>
                  <Text style={{fontSize: 12, color: '#454F63'}}>
                    {Moment(
                      transactionDetails.transactionTimestamp,
                      'YYYY-MM-DD,h:mm:ss',
                    ).format(global.dateFormat)}
                  </Text>
                </Col>
                <Col style={{paddingLeft: wp('2%'), paddingBottom: hp('1.5%')}}>
                  <Text style={{fontSize: 12, color: '#454F63', opacity: 0.7}}>
                    Reference: No.
                  </Text>
                  <Text style={{fontSize: 12, color: '#454F63'}}>
                    {transactionDetails.transactionId}
                  </Text>
                </Col>
                <Col style={{paddingLeft: wp('2%'), paddingBottom: hp('1.5%')}}>
                  <Text style={{fontSize: 12, color: '#454F63', opacity: 0.7}}>
                    Description:
                  </Text>
                  <Text style={{fontSize: 12, color: '#454F63'}}>
                    {transactionDetails.description}
                  </Text>
                </Col>
              </View>

              <View>
                {route.params.selectedItem.type == 'P' ? (
                  <View></View>
                ) : (
                  <View>
                    <Row style={{marginBottom: hp('1.5%')}}>
                      <Col
                        size={1.5}
                        style={{
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <View
                          style={{width: 30, height: 40, alignSelf: 'center'}}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={require('./assets/locationmap.png')}
                          />
                        </View>
                      </Col>
                      <Col size={5} style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            color: '#454F63',
                            fontWeight: 'bold',
                            marginLeft: hp('1%'),
                          }}>
                          Location Details
                        </Text>
                      </Col>
                      <Col
                        size={5}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('saveMaps', {
                              reNavigateTo: 'transactionPage',
                              transactionId:
                                route.params.selectedItem.transactionId,
                            })
                          }>
                          <Text
                            style={{
                              color: '#454F63',
                              textAlign: 'center',
                              fontSize: 12,
                            }}>
                            Add Location
                          </Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                    <Col style={{paddingBottom: hp('2%')}}>
                      <View>
                        {transactionDetails.latitude != null &&
                        transactionDetails.longitude != null ? (
                          <MapView
                            pitchEnabled={false}
                            scrollEnabled={false}
                            rotateEnabled={false}
                            zoomEnabled={false}
                            // style={{ height: 500 }}
                            style={{width: '100%', height: hp('20%')}}
                            region={{
                              latitude: transactionDetails.latitude,
                              longitude: transactionDetails.longitude,
                              latitudeDelta: 0.009,
                              longitudeDelta: 0.009,
                            }}>
                            <Marker
                              draggable
                              coordinate={{
                                latitude: transactionDetails.latitude,
                                longitude: transactionDetails.longitude,
                              }}
                            />
                          </MapView>
                        ) : (
                          <View
                            style={{
                              flex: 1,
                              paddingTop: hp('1.5%'),
                              paddingBottom: hp('1.5%'),
                            }}>
                            <Text
                              style={{
                                color: '#454F63',
                                textAlign: 'center',
                                fontSize: 12,
                                opacity: 0.7,
                              }}>
                              No location found. Please add a location
                            </Text>
                          </View>
                        )}
                      </View>
                      {transactionDetails.mapDescription != null ? (
                        <Text
                          style={{
                            paddingTop: hp('1%'),
                            paddingBottom: hp('1%'),
                            color: '#454F63',
                            fontSize: 11,
                            opacity: 0.7,
                          }}>
                          {transactionDetails.mapDescription}
                        </Text>
                      ) : null}
                    </Col>
                    <Row style={{marginBottom: hp('1%')}}>
                      <Col
                        size={1.5}
                        style={{
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <View
                          style={{width: 30, height: 40, alignSelf: 'center'}}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={require('./assets/link_icon1.png')}
                          />
                        </View>
                      </Col>
                      <Col size={5} style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            color: '#454F63',
                            fontWeight: 'bold',
                            marginLeft: hp('1%'),
                          }}>
                          Linked People
                        </Text>
                      </Col>
                      <Col
                        size={5}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('addPeople', {
                              reNavigateTo: 'transactionPage',
                              transactionId:
                                route.params.selectedItem.transactionId,
                              list: transactionDetails.contactsAndBeneficiary,
                            })
                          }>
                          <Text
                            style={{
                              color: '#454F63',
                              textAlign: 'center',
                              fontSize: 12,
                            }}>
                            Add People
                          </Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                    <Col
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        paddingBottom: hp('2%'),
                      }}>
                      {transactionDetails.contactsAndBeneficiary != null &&
                      transactionDetails.contactsAndBeneficiary.length != 0 ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('linkedPeople', {
                              reNavigateTo: 'transactionPage',
                              transactionId:
                                route.params.selectedItem.transactionId,
                              list: transactionDetails.contactsAndBeneficiary,
                            })
                          }>
                          <FlatList
                            data={transactionDetails.contactsAndBeneficiary}
                            horizontal
                            renderItem={({item, index}) => (
                              // <TouchableOpacity onPress={()=>navigation.navigate('linkedPeople')}>
                              <View>
                                {index < 2 ? (
                                  <View>
                                    {item.profilePicture != null ? (
                                      <View
                                        style={
                                          index != 0
                                            ? styles.indexNotZero
                                            : styles.indexZero
                                        }>
                                        <Image
                                          resizeMode={'contain'}
                                          style={{
                                            maxWidth: '100%',
                                            height: '100%',
                                          }}
                                          source={item.image}
                                        />
                                      </View>
                                    ) : (
                                      <View
                                        style={
                                          index != 0
                                            ? styles.indexNotZeroProfileImgCss
                                            : styles.indexZeroProfileImgCss
                                        }>
                                        <Text
                                          style={{
                                            textAlign: 'center',
                                            color: 'white',
                                          }}>
                                          {item.name.charAt(0)}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                    {index == 2 ? (
                                      <View>
                                        {/* {
                                                                                                transactionDetails.contacts.length > 2 ? */}
                                        <View
                                          style={styles.linkedPeopleCntView}>
                                          <Text
                                            style={styles.linkedPeopleCntText}>
                                            +{' '}
                                            {transactionDetails
                                              .contactsAndBeneficiary.length -
                                              2}
                                          </Text>
                                        </View>
                                        {/* : null
                                                                                            } */}
                                      </View>
                                    ) : null}
                                  </View>
                                )}
                              </View>
                            )}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            paddingTop: hp('1.5%'),
                            paddingBottom: hp('1.5%'),
                            paddingLeft: hp('6%'),
                          }}>
                          <Text
                            style={{
                              color: '#454F63',
                              fontSize: 12,
                              opacity: 0.7,
                            }}>
                            Please Add People
                          </Text>
                        </View>
                      )}
                    </Col>
                    <Row style={{marginBottom: hp('1%')}}>
                      <Col
                        size={1.5}
                        style={{
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <View
                          style={{width: 30, height: 40, alignSelf: 'center'}}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={require('./assets/clip_icon.png')}
                          />
                        </View>
                      </Col>
                      <Col size={5} style={{justifyContent: 'center'}}>
                        <Text
                          style={{
                            color: '#454F63',
                            fontWeight: 'bold',
                            marginLeft: hp('1%'),
                          }}>
                          Attachments
                        </Text>
                      </Col>
                      <Col
                        size={5}
                        style={{
                          justifyContent: 'center',
                          backgroundColor: '#EEEEEE',
                          borderRadius: hp('50%'),
                        }}>
                        <TouchableOpacity onPress={() => uploadImage()}>
                          <Text
                            style={{
                              color: '#454F63',
                              textAlign: 'center',
                              fontSize: 12,
                            }}>
                            Add Photos
                          </Text>
                        </TouchableOpacity>
                      </Col>
                    </Row>
                    <Col
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        paddingBottom: hp('2%'),
                      }}>
                      {transactionDetails.attachmentsList != null &&
                      transactionDetails.attachmentsList.length != 0 ? (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('attachmentsPage', {
                              reNavigateTo: 'transactionPage',
                              list: transactionDetails.attachmentsList,
                              transactionId:
                                route.params.selectedItem.transactionId,
                            })
                          }>
                          <FlatList
                            data={transactionDetails.attachmentsList}
                            horizontal
                            renderItem={({item, index}) => (
                              <View>
                                {index < 2 ? (
                                  <View style={styles.pictureDisplayView}>
                                    <Image
                                      resizeMode={'contain'}
                                      style={{maxWidth: '100%', height: '100%'}}
                                      source={{
                                        uri:
                                          global.baseURL + 'customer/' + item,
                                      }}
                                    />
                                  </View>
                                ) : (
                                  <View>
                                    {index == 2 ? (
                                      <View>
                                        {transactionDetails.attachmentsList
                                          .length > 2 ? (
                                          <View style={styles.picturesCntView}>
                                            <Text
                                              style={
                                                styles.linkedPeopleCntText
                                              }>
                                              +{' '}
                                              {transactionDetails
                                                .attachmentsList.length - 2}
                                            </Text>
                                          </View>
                                        ) : null}
                                      </View>
                                    ) : null}
                                  </View>
                                )}
                              </View>
                            )}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            paddingTop: hp('1.5%'),
                            paddingBottom: hp('1.5%'),
                            paddingLeft: hp('6%'),
                          }}>
                          <Text
                            style={{
                              color: '#454F63',
                              fontSize: 12,
                              opacity: 0.7,
                            }}>
                            Please Add Photos
                          </Text>
                        </View>
                      )}
                    </Col>
                  </View>
                )}
              </View>
            </Grid>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Grid>
          <Row style={styles.footerRow}>
            <Col size={10}>
              {route.params.statementData.typeOfTransaction == 'DB' ? (
                <Text style={styles.footerHeading}>Not an Expense?</Text>
              ) : (
                <Text style={styles.footerHeading}>Not an Income?</Text>
              )}
            </Col>
            <Col size={2}>
              <ToggleSwitch
                isOn={isEnabled}
                onColor="#63CDD6"
                offColor="#767577"
                size="medium"
                onToggle={() => toggleSwitch()}
              />
            </Col>
          </Row>
          <Row>
            <Col size={6} style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={
                  isEnabled == true ? styles.disableBtn : styles.btnNotDisabled
                }
                disabled={isEnabled}
                onPress={() => clickedOnCategorize()}>
                <View style={{width: wp('12%'), height: hp('12%')}}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={require('./assets/Categorize_icon.png')}></Image>
                </View>
                <Text style={styles.footerBtnText}>CATEGORIZE</Text>
              </TouchableOpacity>
            </Col>
            <Col size={6} style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={
                  isEnabled == true ? styles.disableBtn : styles.btnNotDisabled
                }
                disabled={isEnabled}
                onPress={() => navigation.navigate('splitPage', route.params)}>
                <View style={{width: wp('12%'), height: hp('12%')}}>
                  <Image
                    resizeMode={'contain'}
                    style={{maxWidth: '100%', height: '100%'}}
                    source={require('./assets/Spllit_icon.png')}></Image>
                </View>
                <Text style={styles.footerBtnText}>SPLIT</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </View>
    </View>
  );
}

export default TransactionPage;
const styles = StyleSheet.create({
  container: {
    padding: hp('2%'),
    // paddingTop: hp('2%'),
    width: wp('100%'),
    height: '100%',
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('3%'),
    paddingRight: hp('0.5%'),
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 25,
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
  disableBtn: {
    alignItems: 'center',
    opacity: 0.5,
  },
  btnNotDisabled: {
    alignItems: 'center',
    opacity: 1,
  },
  footer: {
    paddingLeft: hp('2.5%'),
    // paddingTop: hp("2.5%"),
    paddingRight: hp('2.5%'),
    paddingBottom: hp('3.5%'),
    backgroundColor: '#587BE6',
    borderTopRightRadius: hp('3%'),
    borderTopLeftRadius: hp('3%'),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  indexNotZero: {
    marginLeft: hp('-1.5%'),
    width: hp('7%'),
    height: hp('7%'),
  },
  indexZero: {
    width: hp('7%'),
    height: hp('7%'),
  },
  indexNotZeroProfileImgCss: {
    width: hp('7%'),
    height: hp('7%'),
    justifyContent: 'center',
    borderRadius: 50,
    // marginRight: 15,
    marginLeft: hp('-1.5%'),
    backgroundColor: '#F2A413',
    borderWidth: 1,
    borderColor: 'white',
  },
  indexZeroProfileImgCss: {
    width: hp('7%'),
    height: hp('7%'),
    justifyContent: 'center',
    borderRadius: 50,
    // marginRight: 15,
    backgroundColor: '#F2A413',

    borderWidth: 1,
    borderColor: 'white',
  },
  linkedPeopleCntView: {
    width: hp('7%'),
    height: hp('7%'),
    backgroundColor: '#5E83F2',
    borderRadius: hp('50%'),
    marginLeft: hp('-1.5%'),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  linkedPeopleCntText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  picturesCntView: {
    width: hp('6.8%'),
    height: hp('6.8%'),
    backgroundColor: '#5E83F2',
    // borderRadius: hp('50%'),
    marginLeft: hp('-1.5%'),
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  pictureDisplayView: {
    width: hp('6.8%'),
    height: hp('6.8%'),
    padding: hp('0.2%'),
  },
  footerRow: {
    paddingTop: hp('5%'),
    borderBottomColor: '#DFE4FB',
    borderBottomWidth: 1,
    height: hp('12%'),
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
  },
  footerHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerBtnText: {
    color: 'white',
    fontSize: 14,
    marginTop: -15,
  },
});
