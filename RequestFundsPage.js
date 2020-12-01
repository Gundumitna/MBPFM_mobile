import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Easing,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { FlatList } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { useForm, Controller } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import CountdownCircle from 'react-native-countdown-circle';
import OTPTextView from 'react-native-otp-textinput';
const RequestFundsPage = ({ navigation }) => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    setValue,
    control,
    getValues,
  } = useForm();
  const [spinner, setSpinner] = useState(false);
  const [backStatus, setBackStatus] = useState(false);
  const [requestFundData, setRequestFundData] = useState();
  const [failedOTP, setFailedOTP] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState(null);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [accountNoList, setAccountNoList] = useState([]);
  const [wholeList, setWholeList] = useState([]);
  const [selected, setSelected] = useState();
  const [minAmount, setMinAmount] = useState();
  const [currencyCode, setCurrencyCode] = useState([]);
  const [maxAmount, setMaxAmount] = useState();
  const [amtFormatError, setAmtFormatError] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDropDownData();
      getCurrency();
    });
    return unsubscribe;
  }, [navigation]);

  const getDropDownData = () => {
    setSpinner(true);
    fetch(global.baseURL + 'customer/get/creditFundsTo/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.data);
        setWholeList(responseJson.data.creditReceivedDropDownResponseModel);
        let bank = [];
        setMinAmount(responseJson.data.minAmount);
        setMaxAmount(responseJson.data.maxAmount);
        for (let d of responseJson.data.creditReceivedDropDownResponseModel) {
          let b = {};
          b.label = d.bankName;
          b.value = d.bankId;
          bank.push(b);
        }
        setBankList(bank);
        console.log(bankList);
        setSpinner(false);
      });

    setSpinner(false);
  };
  const getCurrency = () => {
    console.log(global.baseURL + "api/currency/all")
    fetch(
      global.baseURL + "currency/all"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.data)
        if (responseJson.data != null) {
          let list = [];
          for (let l of responseJson.data) {
            let li = {};
            li.value = l.currency;
            li.label = l.currency;
            li.country = l.country;
            list.push(li);
          }

          setCurrencyCode(list);
        } else {
          setCurrencyCode([]);

        }
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  }
  const onSubmit = (data) => {
    console.log(data);
    if (amtFormatError == false) {
      setRequestFundData(data);
      setBackStatus(true);
    }
  };
  confirm = () => {
    console.log(requestFundData);
    setIsModalVisible(true);
  };
  verfityOTPFunction = () => {
    setIsModalVisible(false);
    setSpinner(true);
    console.log('otp : ' + otpInput);
    if (otpInput == '1111') {
      setFailedOTP('');
      let d = { ...requestFundData };
      for (let b of bankList) {
        if (b.value == requestFundData.bankId) {
          d.bankName = b.label;
        }
      }
      fetch(global.baseURL + 'customer/requestFunds/' + global.loginID, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestFundData),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (
            responseJson.status == 200 ||
            responseJson.message == 'Request Completed'
          ) {
            setDisableSaveBtn(false);
            // navigation.navigate('goalsPage')
            navigation.navigate('successPage', {
              type: 'requestFund',
              data: d,
            });
          } else {
            setDisableSaveBtn(false);
            navigation.navigate('successPage', { type: 'failure' });
          }
          // setDisableSaveBtn(false)
          setIsModalVisible(false);
          setSpinner(false);
        });
    } else {
      setFailedOTP('Invalid OTP');
      setSpinner(false);
      setOtpInput(null);
    }
  };
  getAccountNo = (value) => {
    let accountNo = [];
    for (let s of wholeList) {
      if (s.bankId == value) {
        for (let a of s.accountDetails) {
          let an = {};
          an.label = a.accountNumber.replace(
            /.(?=.{4})/g,
            'x',
          );
          an.value = a.accountNumber;
          // an.currency = a.currency
          accountNo.push(an);
        }
      }
    }
    setAccountNoList(accountNo);
  };
  back = () => {
    setBackStatus(false);
    setValue('upiId', requestFundData.upiId);
    setValue('amount', requestFundData.amount);
    setValue('bankId', requestFundData.bankId);
    setValue('accountNumber', requestFundData.accountNumber);
    setValue('currency', requestFundData.currency);
  };
  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      <View>
        <View>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg_white(short).png')}></Image>
        </View>
        <View style={styles.topHeader}>
          {backStatus == false ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('accounts')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity style={styles.backBtn} onPress={() => back()}>
                <View>
                  <Image source={require('./assets/icons-back.png')}></Image>
                </View>
              </TouchableOpacity>
            )}

          <View>
            <Text style={styles.heading}>Request Funds</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.form}>
        {backStatus == false ? (
          <View>
            <View style={styles.text}>
              <Text style={{ fontSize: 11, color: '#454F63' }}>
                Request Funds is a feature that will help you get funds from
                your external bank accounts using UPI.{' '}
              </Text>
              <Text style={{ fontSize: 11, color: '#454F63' }}>
                Please enter the UPI of the external bank account below. This
                will send an UPI pull request from our bank. You need to login
                your other bank app and accept the pull request from us.
              </Text>
            </View>
            <View>
              <Text style={{ color: '#7D8C96', fontSize: 12 }}>
                External Bank Account UPI ID{' '}
              </Text>
              <Text style={{ color: '#7D8C96', fontSize: 12 }}>
                ( We will debit funds from this account )
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccc',
                  paddingTop: hp('-2%'),
                }}>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <TextInput
                      placeholder="Enter UPI ID"
                      underlineColorAndroid="transparent"
                      placeholderTextColor="grey"
                      style={styles.textInputBorderLine}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value.trim())}
                      value={value}
                    />
                  )}
                  name="upiId"
                  rules={{ required: true }}
                  defaultValue=""
                />
              </View>

              {errors.upiId && (
                <Text style={styles.error}>Please Enter External Bank.</Text>
              )}
            </View>
            <Grid>
              <Row>
                <Col size={7.3}>
                  <View style={{ paddingTop: hp('3%') }}>
                    <Text style={{ color: '#7D8C96', fontSize: 12 }}>
                      Request Amount
              </Text>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccc',
                        paddingTop: hp('-2%'),
                      }}>
                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <TextInput
                            placeholder="Enter Request Amount"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="grey"
                            style={styles.textInputBorderLine}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            onChangeText={(value) => {
                              if (
                                value.trim() == '' ||
                                (value.trim() <= maxAmount &&
                                  value.trim() >= minAmount)
                              ) {
                                setAmtFormatError(false);
                                onChange(value.trim());
                              } else {
                                setAmtFormatError(true);
                                onChange(value.trim());
                              }
                            }}
                            value={value}
                          />
                        )}
                        name="amount"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </View>
                    {errors.amount && (
                      <Text style={styles.error}>Please Enter Request Amount.</Text>
                    )}
                    {amtFormatError == true ? (
                      <Text style={styles.error}>
                        Invalide amount.Minimum amount is enter is {minAmount} and
                  maximum amount is {maxAmount}.
                      </Text>
                    ) : null}
                  </View>

                </Col>
                <Col size={0.4}></Col>
                <Col size={3.3}>
                  <View style={{ paddingTop: hp('3%') }}>
                    <Text style={{ color: '#7D8C96', fontSize: 12 }}>
                      Currency
              </Text>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#cccc',
                        paddingTop: hp('-2%'),
                      }}
                    >
                      <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                          <RNPickerSelect
                            value={value}
                            style={styles}
                            onValueChange={(value) => {
                              onChange(value);

                            }}
                            items={currencyCode}
                          />
                        )}
                        name="currency"
                        rules={{ required: true }}
                        defaultValue=""
                      />
                    </View>
                    {errors.amount && (
                      <Text style={styles.error}>Please Select Currency.</Text>
                    )}

                  </View>

                </Col>
              </Row>
            </Grid>
            <View style={{ paddingTop: hp('3%') }}>
              <Text
                style={{ color: '#454F63', fontSize: 18, fontWeight: 'bold' }}>
                Account Details
              </Text>
              <Text
                style={{ color: '#454F63', fontSize: 11, paddingTop: hp('1%') }}>
                Provide details about the account where you need to credit funds
                to. This could be our bank or any other external bank too.
              </Text>
            </View>

            <View style={{ paddingTop: hp('3%') }}>
              <Text style={{ color: '#7D8C96', fontSize: 12 }}>
                Credit Funds to
              </Text>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccc',
                  paddingTop: hp('-2%'),
                }}>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <RNPickerSelect
                      value={value}
                      style={styles}
                      onValueChange={(value) => {
                        onChange(value);
                        setSelected(value);
                        getAccountNo(value);
                      }}
                      items={bankList}
                    />
                  )}
                  name="bankId"
                  rules={{ required: true }}
                  defaultValue=""
                />
              </View>

              {errors.bankId && (
                <Text style={styles.error}>Please Select Credit Funds To.</Text>
              )}
            </View>

            <View style={{ paddingTop: hp('3%') }}>
              <Text style={{ color: '#7D8C96', fontSize: 12 }}>To Account</Text>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccc',
                  paddingTop: hp('-2%'),
                }}>
                <Controller
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <RNPickerSelect
                      disabled={
                        selected == '' ||
                        selected == null ||
                        selected == undefined
                      }
                      value={value}
                      style={styles}
                      onValueChange={(value) => onChange(value)}
                      items={accountNoList}
                    />
                  )}
                  name="accountNumber"
                  rules={{ required: true }}
                  defaultValue=""
                />
              </View>

              {errors.accountNumber && (
                <Text style={styles.error}>Please Select To Account.</Text>
              )}
            </View>
          </View>
        ) : (
            <View>
              <Text>Please confirm the below details</Text>
              <Text style={styles.label}>External Bank Account UPI ID</Text>
              <Text style={styles.value}>{requestFundData.upiId}</Text>

              <Text style={styles.label}>Request Amount ( {requestFundData.currency} )</Text>
              <Text style={styles.value}>{requestFundData.amount}</Text>

              <Text style={styles.label}>Credit Funds to</Text>
              <Text style={styles.value}>{requestFundData.bankId}</Text>

              <Text style={styles.label}>To Account</Text>
              <Text style={styles.value}>{requestFundData.accountNumber.replace(
                /.(?=.{4})/g,
                'x',
              )}</Text>
            </View>
          )}
      </ScrollView>
      <View style={styles.footer}>
        {backStatus == false ? (
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Text style={styles.footerBotton}>Request Funds</Text>
          </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => confirm()}>
              <Text style={styles.footerBotton}>Confirm</Text>
            </TouchableOpacity>
          )}
      </View>
      {/* <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                // style={{ top: 0 }}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalImag}>
                            <Image
                                resizeMode={'contain'}
                                style={{ maxWidth: '100%', height: '100%' }}
                                source={require('./assets/otpimage.png')}
                            />
                        </View>
                        <Text style={styles.modalText1}>OTP Verification</Text>
                        <Text style={styles.modalText2}>
                            A One - Time Password has been sent to your{' '}
                        </Text>
                        <Text style={styles.modalText2}>mobile number ( XXXXXX9876);</Text>
                        <Text style={styles.modalText2}>
                            kindly enter the password once received{' '}
                        </Text>
                        <Text style={styles.modalText2}> in the below field</Text>



                        <View
                            style={{
                                alignItems: 'center',
                                paddingLeft: hp('6%'),
                                paddingRight: hp('6%'),
                                paddingTop: hp('2%'),
                            }}>
                            <OTPTextView
                                containerStyle={styles.textInputContainer}
                                handleTextChange={text => setOtpInput(text)}
                                textInputStyle={styles.roundedTextInput}
                                inputCount={4}
                                offTintColor={'#E5E5E5'}
                                tintColor={'#5E83F2'}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ color: '#F22973' }}>
                            {failedOTP != '' ? (
                                <Text
                                    style={{
                                        color: '#F22973',
                                        // paddingLeft: hp('6%'),
                                        marginBottom: hp('2%'),
                                    }}>
                                    {failedOTP}
                                </Text>
                            ) : null}
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <CountdownCircle
                                seconds={10}
                                radius={hp('4.5%')}
                                borderWidth={9}
                                color="#F78E1E"
                                bgColor="#fff"
                                // shadowColor="black"
                                textStyle={{ fontSize: 20 }}
                                onTimeElapsed={() => console.log('Elapsed!')}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                // flex: 1,
                                // alignSelf: 'center',
                                // paddingTop: hp('3%'),
                            }}>
                            <Text style={{ color: '#5D707D' }}>Don't receive the OTP ? </Text>
                            <TouchableOpacity>
                                <Text
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#5D707D',
                                        color: '#5D707D',
                                    }}>
                                    Resend
              </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => verfityOTPFunction()}>
                            <Text style={styles.verifyBtn}>Verify & Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}

      <Modal
        isVisible={isModalVisible}
        style={styles.centeredView}
        swipeDirection={'up'}>
        <KeyboardAwareScrollView>
          <View style={styles.modalView}>
            <View>
              <View style={styles.modalImag}>
                <Image
                  resizeMode={'contain'}
                  style={{ maxWidth: '100%', height: '100%' }}
                  source={require('./assets/otpimage.png')}
                />
              </View>
              <Text style={styles.modalText1}>OTP Verification</Text>
              <Text style={styles.modalText2}>
                A One - Time Password has been sent to your{' '}
              </Text>
              <Text style={styles.modalText2}>
                mobile number ( XXXXXX9876);
              </Text>
              <Text style={styles.modalText2}>
                kindly enter the password once received{' '}
              </Text>
              <Text style={styles.modalText2}> in the below field</Text>
              <View
                style={{
                  alignItems: 'center',
                  paddingLeft: hp('6%'),
                  paddingRight: hp('6%'),
                  paddingTop: hp('2%'),
                }}>
                <OTPTextView
                  containerStyle={styles.textInputContainer}
                  handleTextChange={(text) => {
                    setOtpInput(text);
                    if (text.length == 4) {
                      Keyboard.dismiss();
                    }
                  }}
                  textInputStyle={styles.roundedTextInput}
                  inputCount={4}
                  offTintColor={'#E5E5E5'}
                  tintColor={'#5E83F2'}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ color: '#F22973' }}>
                {failedOTP != '' ? (
                  <Text
                    style={{
                      color: '#F22973',
                      paddingLeft: hp('6%'),
                      marginBottom: hp('2%'),
                    }}>
                    {failedOTP}
                  </Text>
                ) : null}
              </View>
              <View style={{ alignItems: 'center' }}>
                <CountdownCircle
                  seconds={10}
                  radius={hp('4.5%')}
                  borderWidth={9}
                  color="#F78E1E"
                  bgColor="#fff"
                  // shadowColor="black"
                  textStyle={{ fontSize: 20 }}
                  onTimeElapsed={() => console.log('Elapsed!')}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignSelf: 'center',
                  // paddingTop: hp('3%'),
                }}>
                <Text style={{ color: '#5D707D' }}>Don't receive the OTP ? </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#5D707D',
                      color: '#5D707D',
                    }}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => verfityOTPFunction()}>
                <Text style={styles.verifyBtn}>Verify & Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};

export default RequestFundsPage;
const styles = StyleSheet.create({
  container: {
    // padding: hp('2%'),
    width: wp('100%'),
    backgroundColor: 'white',
    flex: 1,
  },
  textInputBorderLine: {
    height: 50,
    color: 'black',
  },
  topHeader: {
    flexDirection: 'row',
    padding: hp('2%'),
    paddingTop: hp('3%'),
    position: 'absolute',
    // flex: 1
  },
  backBtn: {
    paddingTop: hp('1%'),
    zIndex: 10,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#F2A413',
    paddingBottom: 12,
    zIndex: 60,
  },
  tab: {
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    paddingBottom: 12,
    zIndex: 60,
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 25,
    width: wp('75%'),
  },
  listCss: {
    padding: hp('2.5%'),
  },
  profileImgCss: {
    height: 38,
    width: 40,
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 15,
    backgroundColor: '#F2A413',
  },
  footer: {
    paddingLeft: hp('2.5%'),
    paddingTop: hp('2.5%'),
    paddingRight: hp('5%'),
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerBotton: {
    padding: hp('1.7%'),
    fontSize: hp('2.4%'),
    fontFamily: 'Roboto',
    textAlign: 'center',
    backgroundColor: '#5E83F2',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
    color: 'white',
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
  name: {
    color: '#454F63',
    fontSize: 14,
  },
  number: {
    color: '#454F63',
    fontSize: 14,
    opacity: 0.7,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
    // backgroundColor: 'white',
    // bottom: hp('40%'),
    // marginLeft: wp('8%'),
    // marginRight: wp('8%'),
    // borderTopEndRadius: hp('2%'),
    // borderTopStartRadius: hp('2%'),

    // marginTop: wp('-50%')

    backgroundColor: 'white',
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
    padding: 35,
    paddingBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalImag: {
    alignSelf: 'center',
    width: wp('20%'),
    height: hp('20%'),
    // padding: hp('1%'),
    // margin: hp('8%')
  },
  modalText1: {
    color: '#454F63',
    fontSize: 18,
    // marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalText2: {
    color: '#5D707D',
    fontSize: 12,
    // marginBottom: wp('5%'),
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
  text: {
    paddingBottom: hp('3%'),
    marginBottom: hp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
  },
  inputIOS: {
    fontSize: 16,
    paddingRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    paddingBottom: 8,
    paddingTop: hp('2%'),
    color: '#555555',
    // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingRight: 30,
    borderBottomWidth: 9,
    borderBottomColor: '#cccc',
    paddingBottom: 8,
    paddingTop: hp('2%'),
    color: '#555555',
    // to ensure the text is never behind the icon
  },
  form: {
    top: wp('-21%'),
    marginBottom: wp('-11%'),
    paddingLeft: hp('5%'),
    paddingRight: hp('5%'),
  },
  error: {
    color: '#F22973',
    paddingBottom: hp('3%'),
  },
  label: {
    color: '#7D8C96',
    fontSize: 13,
    paddingTop: hp('3%'),
  },
  value: {
    color: '#555555',
    fontSize: 16,
    paddingTop: hp('1%'),
  },
  verifyBtn: {
    backgroundColor: '#5E83F2',
    borderRadius: 10,
    padding: 15,
    // marginTop: 10,
    color: 'white',
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
    marginBottom: hp('2%'),
    textAlign: 'center',
    // marginBottom: 15
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 4,
  },
  modalView: {
    // opacity: 1,
    backgroundColor: 'white',
    // margin: 0,
    // marginLeft: wp('8%'),
    // marginRight: wp('8%'),
    // borderTopEndRadius: hp('2%'),
    // borderTopStartRadius: hp('2%'),
    // padding: 35,
    // paddingBottom: 10,
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // openButton: {
  //     backgroundColor: "#F194FF",
  //     borderRadius: 20,
  //     padding: 10,
  //     elevation: 2
  // },
  // textStyle: {
  //     color: "white",
  //     fontWeight: "bold",
  //     textAlign: "center"
  // },
  // modalText: {
  //     marginBottom: 15,
  //     textAlign: "center"
  // },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    marginLeft: wp('6%'),
    marginRight: wp('6%'),
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
    marginTop: hp('20%'),
    // backgroundColor: '#777777',
    // opacity: 1
    // alignItems: "flex-end",
    // marginTop: 22
  },
});
