import React, {useState, useEffect, useRef} from 'react';
import {Grid, Row, Col} from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Picker,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import {useForm, Controller} from 'react-hook-form';
import Modal from 'react-native-modal';
import CountdownCircle from 'react-native-countdown-circle';
import OTPTextView from 'react-native-otp-textinput';
import RNPickerSelect from 'react-native-picker-select';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const CreateAndEditGoals = ({route, navigation}) => {
  const [spinner, setSpinner] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState(null);
  const [formData, setFormData] = useState();
  const [failedOTP, setFailedOTP] = useState('');
  const [flag, setFlag] = useState(false);
  const [hostBankAccountNumbers, setHostBankAccountNumbers] = useState([]);
  const [contributionFrequencyList, setContributionFrequencyList] = useState(
    [],
  );
  const [categoryList, setCategoryList] = useState([]);
  const [currencyCode, setCurrencyCode] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    errors,
    setValue,
    control,
    getValues,
  } = useForm();
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDropDownData();
      if (route.params.type == 'edit') {
        console.log(route.params.selectedData);
        setValue('goalName', route.params.selectedData.goalName);
        setValue('category', route.params.selectedData.categoryId);
        setValue('totalAmountNeeded', route.params.selectedData.goalAmount);
        setValue(
          'contributionAmount',
          route.params.selectedData.contributionAmount,
        );
        setValue(
          'contributionFrequency',
          route.params.selectedData.contributionFrequency,
        );
        setValue('fundsReceivedFrom', route.params.selectedData.fundsFrom);
        setValue('currency', route.params.selectedData.currency);
        console.log(getValues('goalName'));
      }
    });
    return unsubscribe;
  }, [navigation]);

  getDropDownData = () => {
    setSpinner(true);
    fetch(
      global.baseURL +
        'customer/get/hostbank/accounts/contribution/frequeny/' +
        global.loginID,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        let hostBA = [];
        for (let h of responseJson.data.hostBankAccountNumbers) {
          hostBA.push(h);
        }
        let list1 = [];
        for (let l of hostBA) {
          let cat = {};
          cat.label = l.replace(/.(?=.{4})/g, 'x');
          cat.value = l;
          list1.push(cat);
        }
        setHostBankAccountNumbers(list1);
        let list = [];
        for (let l of responseJson.data.contributionFrequencyList) {
          let cat = {};
          cat.label = l;
          cat.value = l;
          list.push(cat);
        }
        setContributionFrequencyList(list);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch(global.baseURL + 'customer/get/goal/categories')
      .then((response) => response.json())
      .then((responseJson) => {
        // let list = []
        // for (let l of responseJson.data) {
        //     if (l.id != 1) {
        //         list.push(l)
        //     }
        // }
        let list = [];
        for (let l of responseJson.data) {
          let cat = {};
          cat.label = l.goalCategory;
          cat.value = l.id;
          list.push(cat);
        }
        setCategoryList(list);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch(global.baseURL + 'customer/get/country/currency/codes')
      .then((response) => response.json())
      .then((responseJson) => {
        // let list = []
        // for (let l of responseJson.data) {
        //     if (l.id != 1) {
        //         list.push(l)
        //     }
        // }
        let list = [];
        for (let l of responseJson.data.countries) {
          let cat = {};
          cat.label = l.currencyName;
          cat.value = l.code;
          list.push(cat);
        }
        //setCategoryList(list);
        setCurrencyCode(list);
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setSpinner(false);
    }, 100);
  };

  const onSubmit = (data) => {
    setDisableSaveBtn(true);
    console.log(data);
    console.log(
      Number(data.totalAmountNeeded) + ' , ' + Number(data.contributionAmount),
    );

    if (Number(data.totalAmountNeeded) < Number(data.contributionAmount)) {
      Alert.alert(
        'Alert',
        'Total Amount Needed should always be greater than Contribution Amount',
      );
      setDisableSaveBtn(false);
    } else {
      if (route.params.type == 'create') {
        console.log('Create');
        setFormData(data);
        setIsModalVisible(true);
        setFlag(true);
      } else {
        setSpinner(true);
        console.log('Upload');
        console.log(data);
        let d = {...data};
        d.key = route.params.selectedData.key;
        for (let c of categoryList) {
          if (c.value == data.category) {
            d.categoryName = c.label;
          }
        }
        console.log(d);
        fetch(
          global.baseURL +
            'customer/save/goal/details/' +
            global.loginID +
            '/E',
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
            console.log(responseJson);
            if (
              responseJson.status == 200 ||
              responseJson.message == 'Request Completed'
            ) {
              setDisableSaveBtn(false);
              // navigation.navigate('goalsPage')
              navigation.navigate('successPage', {
                type: 'editSuccess',
                data: d,
              });
            } else if (
              responseJson.message ==
              'CONTRIBUTION AMOUNT SHOULD NOT EXCEED TOTAL AMOUNT'
            ) {
              Alert.alert(
                'Alert',
                'Contribution amount should not exceed Total Amount',
              );
              setDisableSaveBtn(false);
            } else {
              setDisableSaveBtn(false);
              navigation.navigate('successPage', {type: 'failure'});
            }

            setSpinner(false);
          })
          .catch((error) => {
            console.error(error);
            setDisableSaveBtn(false);
            navigation.navigate('successPage', {type: 'failure'});
            setSpinner(false);
          });
        setFlag(true);
      }
      // )}
    }
  };
  const onChange = (arg) => {
    console.log(arg);
    console.log(
      getValues('totalAmountNeeded') > getValues('contributionAmount'),
    );
    return {
      value: arg.nativeEvent.text,
    };
  };
  verfityOTPFunction = () => {
    setSpinner(true);
    console.log('otp : ' + otpInput);
    if (otpInput == '1111') {
      setFailedOTP('');
      console.log(formData);
      // let d = []
      let d = {...formData};
      for (let c of categoryList) {
        if (c.value == d.category) {
          d.categoryName = c.label;
        }
      }
      // d.push(li)
      console.log(d);
      setIsModalVisible(false);
      fetch(
        global.baseURL + 'customer/save/goal/details/' + global.loginID + '/A',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (
            responseJson.status == 200 ||
            responseJson.message == 'Request Completed'
          ) {
            navigation.navigate('successPage', {
              type: 'createSuccess',
              data: d,
            });
          } else {
            navigation.navigate('successPage', {type: 'failure'});
          }
          setSpinner(false);
        })
        .catch((error) => {
          console.error(error);
          navigation.navigate('successPage', {type: 'failure'});
          setSpinner(false);
        });
      setFlag(true);
    } else {
      setFailedOTP('Invalid One Time Password');
      setFlag(true);
      setSpinner(false);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View style={{backgroundColor: 'white'}}>
        <View style={{zIndex: 1}}>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg(dark).png')}
          />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('goalsPage')}>
            <View style={{width: 25, height: 25}}>
              <Image
                style={{maxWidth: '100%', height: '100%'}}
                source={require('./assets/icons-back.png')}
              />
            </View>
          </TouchableOpacity>
          <View>
            {route.params.type == 'create' ? (
              <Text style={styles.heading}>Add New Goal</Text>
            ) : (
              <Text style={styles.heading}>Edit Goal</Text>
            )}
          </View>
        </View>
        <View>
          {route.params.type == 'create' ? (
            <Text style={styles.subHeading}>Create New Goal</Text>
          ) : (
            <Text style={styles.subHeading}>Update your Goal</Text>
          )}
        </View>
        <View>
          <ScrollView style={styles.form}>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Goal Name</Text>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <TextInput
                    placeholder="Enter Goal Name"
                    underlineColorAndroid="transparent"
                    style={styles.textInputBorderLine}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="goalName"
                rules={{required: true}}
                defaultValue=""
              />
              {errors.goalName && (
                <Text style={styles.error}>Please Enter Goal Name.</Text>
              )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerBorderLine}>
                <Controller
                  control={control}
                  render={({onChange, onBlur, value}) => (
                    // <Picker
                    //   // ref={register}
                    //   selectedValue={value}
                    //   style={{
                    //     height: 50,
                    //     width: '100%',
                    //     fontSize: 15,
                    //     color: '#555555',
                    //   }}
                    //   onValueChange={(itemValue, itemIndex) =>
                    //     onChange(itemValue)
                    //   }>
                    //   <Picker.Item label="Select Category" value="" />
                    //   {categoryList.map(item => (
                    //     <Picker.Item
                    //       label={item.goalCategory}
                    //       value={item.id}
                    //     />
                    //   ))}
                    // </Picker>
                    <RNPickerSelect
                      onValueChange={(value) => onChange(value)}
                      style={styles}
                      placeholder={{
                        label: 'Select Category',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={value}
                      items={categoryList}
                    />
                  )}
                  name="category"
                  rules={{required: true}}
                  defaultValue=""
                />
              </View>
              {errors.category && (
                <Text style={styles.error}>Please Select category .</Text>
              )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Total Amount Needed</Text>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <TextInput
                    placeholder="Enter Total Amount"
                    // editable={item.categoryId != 0}
                    underlineColorAndroid="transparent"
                    style={styles.textInputBorderLine}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      if (value.length < 19) {
                        onChange(value);
                      }
                    }}
                    value={value.toString()}
                    // value={item.amount.toString()}
                  />
                )}
                name="totalAmountNeeded"
                rules={{required: true, min: 1}}
                defaultValue=""
              />
              {errors.totalAmountNeeded &&
                errors.totalAmountNeeded.type === 'min' && (
                  <Text style={styles.error}>Please enter valid amount</Text>
                )}
              {errors.totalAmountNeeded &&
                errors.totalAmountNeeded.type !== 'min' && (
                  <Text style={styles.error}>
                    Please Enter Total Amount Needed
                  </Text>
                )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Contribution Amount</Text>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <TextInput
                    placeholder="Enter Contribution Amount"
                    // editable={item.categoryId != 0}
                    underlineColorAndroid="transparent"
                    style={styles.textInputBorderLine}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      if (value.length < 19) {
                        onChange(value);
                      }
                    }}
                    value={value.toString()}
                  />
                )}
                name="contributionAmount"
                // rules={{ required: true, min: 1, validate: getValues('totalAmountNeeded') > getValues('contributionAmount') }}
                rules={{required: true, min: 1}}
                defaultValue=""
              />
              {/* {
                                errors.contributionAmount && errors.contributionAmount.type === "validate" && errors.contributionAmount.type !== "min" &&
                                <Text style={styles.error}>Error</Text>


                            } */}
              {errors.contributionAmount &&
                errors.contributionAmount.type === 'min' && (
                  <Text style={styles.error}>Please enter valid amount</Text>
                )}
              {errors.contributionAmount &&
                errors.contributionAmount.type !== 'min' && (
                  <Text style={styles.error}>
                    Please Enter Contribution Amount.
                  </Text>
                )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Contribution Frequency</Text>
              <View style={styles.pickerBorderLine}>
                <Controller
                  control={control}
                  render={({onChange, onBlur, value}) => (
                    // <Picker
                    //   selectedValue={value}
                    //   style={{
                    //     height: 50,
                    //     width: '100%',
                    //     fontSize: 15,
                    //     color: '#555555',
                    //   }}
                    //   onValueChange={(itemValue, itemIndex) =>
                    //     onChange(itemValue)
                    //   }>
                    //   <Picker.Item
                    //     label="Select Contribution Frequency"
                    //     value=""
                    //   />
                    //   {contributionFrequencyList.map(item => (
                    //     <Picker.Item label={item} value={item} />
                    //   ))}
                    // </Picker>
                    <RNPickerSelect
                      onValueChange={(value) => onChange(value)}
                      style={styles}
                      items={contributionFrequencyList}
                      value={value}
                      placeholder={{
                        label: 'Select Contribution Frequency',
                        value: null,
                        color: '#9EA0A4',
                      }}
                    />
                  )}
                  name="contributionFrequency"
                  rules={{required: true}}
                  defaultValue=""
                />
              </View>
              {errors.contributionFrequency && (
                <Text style={styles.error}>
                  Please Select Contribution Frequency.
                </Text>
              )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Funds From</Text>
              <View style={styles.pickerBorderLine}>
                <Controller
                  control={control}
                  render={({onChange, onBlur, value}) => (
                    // <Picker
                    //   selectedValue={value}
                    //   style={{
                    //     height: 50,
                    //     width: '100%',
                    //     fontSize: 15,
                    //     color: '#555555',
                    //   }}
                    //   onValueChange={(itemValue, itemIndex) =>
                    //     onChange(itemValue)
                    //   }>
                    //   <Picker.Item
                    //     label="Select Funds"
                    //     itemStyle={{color: '#7D8C96'}}
                    //     value=""
                    //   />
                    //   {hostBankAccountNumbers.map(item => (
                    //     <Picker.Item label={item} value={item} />
                    //   ))}
                    // </Picker>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select Funds',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={value}
                      onValueChange={(value) => onChange(value)}
                      style={styles}
                      items={hostBankAccountNumbers}
                    />
                  )}
                  name="fundsReceivedFrom"
                  rules={{required: true}}
                  defaultValue=""
                />
              </View>
              {errors.fundsReceivedFrom && (
                <Text style={styles.error}>
                  Please Select Funds Received From.
                </Text>
              )}
            </View>
            <View style={{marginBottom: hp('2%')}}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.pickerBorderLine}>
                <Controller
                  control={control}
                  render={({onChange, onBlur, value}) => (
                    <RNPickerSelect
                      disabled={route.params.type == 'edit'}
                      placeholder={{
                        label: 'Select Currency',
                        value: null,
                        color: '#9EA0A4',
                      }}
                      value={value}
                      onValueChange={(value) => onChange(value)}
                      style={styles}
                      items={currencyCode}
                    />
                  )}
                  name="currency"
                  rules={{required: true}}
                  defaultValue=""
                />
              </View>
              {errors.currency && (
                <Text style={styles.error}>Please Select Currency.</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={disableSaveBtn == true}
          onPress={handleSubmit(onSubmit)}>
          {route.params.type == 'create' ? (
            <Text style={styles.footerBotton}>Save</Text>
          ) : (
            <Text style={styles.footerBotton}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        style={styles.view}
        swipeDirection={'up'}>
        <KeyboardAwareScrollView>
          <View style={{flex: 1, paddingBottom: hp('2%')}}>
            <View style={styles.modalImag}>
              <Image
                resizeMode={'contain'}
                style={{maxWidth: '100%', height: '100%'}}
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
              {/* <OTPTextInput ref={e => (otpInput = e)} /> */}
              {/* <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => ( */}
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
                // offTintColor={failedOTP != '' ? '#E5E5E5' : '#F22973'}
                // tintColor={failedOTP != '' ? '#5E83F2' : '#F22973'}
                keyboardType="numeric"
              />
            </View>
            <View style={{color: '#F22973'}}>
              {failedOTP != '' ? (
                <Text
                  style={{
                    color: '#F22973',
                    paddingLeft: hp('6%'),
                    marginTop: hp('-3%'),
                    marginBottom: hp('3%'),
                  }}>
                  {failedOTP}
                </Text>
              ) : null}
            </View>
            <View style={{alignItems: 'center'}}>
              <CountdownCircle
                seconds={10}
                radius={hp('4.5%')}
                borderWidth={9}
                color="#F78E1E"
                bgColor="#fff"
                // shadowColor="black"
                textStyle={{fontSize: 20}}
                onTimeElapsed={() => console.log('Elapsed!')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignSelf: 'center',
                paddingTop: hp('3%'),
              }}>
              <Text style={{color: '#5D707D'}}>Don't receive the OTP ? </Text>
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
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
};

export default CreateAndEditGoals;
const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
    flex: 1,
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
  subHeading: {
    color: '#7D8C96',
    fontSize: 14,
    paddingLeft: hp('3.5%'),
  },
  form: {
    padding: hp('3.5%'),
    height: hp('72%'),
    // marginBottom: hp('9%')
  },
  footer: {
    paddingLeft: hp('2.5%'),
    // paddingTop: hp("2.5%"),
    paddingRight: hp('5%'),
    zIndex: 40,

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
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 10,
    // position: 'absolute', left: 0, right: 0, bottom: 0,
    marginLeft: 20,
    marginRight: 20,
    color: 'white',
  },
  pickerBorderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    // paddingBottom: 8
  },
  textInputBorderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    paddingBottom: 8,
    paddingTop: hp('2%'),
    color: '#555555',
  },
  input: {
    backgroundColor: 'white',
    // borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  error: {
    color: '#F22973',
    paddingBottom: hp('3%'),
  },
  view: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    // marginTop: 65,
    marginTop: hp('12%'),
    marginLeft: wp('8%'),
    marginRight: wp('8%'),
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
  },
  modalImag: {
    alignSelf: 'center',
    width: hp('16%'),
    height: hp('16%'),
    // padding: hp('1%'),
    marginBottom: hp('2%'),
    margin: hp('4%'),
  },
  modalText1: {
    color: '#454F63',
    fontSize: 22,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalText2: {
    color: '#5D707D',
    fontSize: 12,
    textAlign: 'center',
  },

  verifyBtn: {
    backgroundColor: '#5E83F2',
    borderRadius: 10,
    padding: 15,
    // marginTop: 10,
    color: 'white',
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    // marginBottom: hp("2%"),
    textAlign: 'center',
  },
  roundedTextInput: {
    borderRadius: 5,
    borderWidth: 4,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#7D8C96',
    fontSize: 12,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
