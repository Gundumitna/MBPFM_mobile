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
import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-datepicker';
import {useForm, Controller} from 'react-hook-form';
import ToggleSwitch from 'toggle-switch-react-native';
import ImagePicker from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
const UserProfilePage = ({navigation}) => {
  const [spinner, setSpinner] = useState(false);
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
  const [isEnabled, setIsEnabled] = useState(false);
  const [flag, setFlag] = useState(false);
  const [stateSelected, setStateSelected] = useState();
  const [cities, setCities] = useState([]);
  const [currencyCode, setCurrencyCode] = useState([]);
  const [userName, setUserName] = useState();
  const [customerId, setCustomerId] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [mobileNoFormatError, setMobileNoFormatError] = useState(false);
  const [userImage, setUserImage] = useState();
  const [states, setStates] = useState(
    [
      {
        label: 'Andhra Pradesh',
        value: 'AndhraPradesh',

        districts: [
          {
            value: 'Anantapur',
            label: 'Anantapur',
          },
          {
            value: 'Chittoor',
            label: 'Chittoor',
          },
          {
            value: 'EastGodavari',
            label: 'East Godavari',
          },
          {
            value: 'Guntur',
            label: 'Guntur',
          },
          {
            value: 'Kadapa',
            label: 'Kadapa',
          },
          {
            value: 'Kurnool',
            label: 'Kurnool',
          },
          {
            value: 'Nellore',
            label: 'Nellore',
          },
        ],
      },
      {
        label: 'Tamil Nadu',
        value: 'TamilNadu',

        districts: [
          {
            value: 'Chennai',
            label: 'Chennai',
          },
          {
            value: 'Coimbatore',
            label: 'Coimbatore',
          },
          {
            value: 'Tiruchirappali',
            label: 'Tiruchirappali',
          },
          {
            value: 'Kanniyakumari',
            label: 'Kanniyakumari',
          },
          {
            value: 'Kanchipuram',
            label: 'Kanchipuram',
          },
          {
            value: 'Madurai',
            label: 'Madurai',
          },
          {
            value: 'Salem',
            label: 'Salem',
          },
        ],
      },
      {
        label: 'Telangana',
        value: 'Telangana',

        districts: [
          {
            value: 'Adilabad',
            label: 'Adilabad',
          },
          {
            value: 'Kothagudem',
            label: 'Kothagudem',
          },
          {
            value: 'Hyderabad',
            label: 'Hyderabad',
          },
          {
            value: 'Jagitial',
            label: 'Jagitial',
          },
          {
            value: 'Jangaon',
            label: 'Jangaon',
          },
          {
            value: 'Bhupalpally',
            label: 'Bhupalpally',
          },
          {
            value: 'Gadwal',
            label: 'Gadwal',
          },
        ],
      },
      {
        label: 'maharashtra',
        value: 'maharashtra',

        districts: [
          {
            value: 'Mumbai',
            label: 'Mumbai',
          },
        ],
      },
    ],
    // [{ "value": "AN", "label": "Andaman and Nicobar Islands" },
    // { "value": "AP", "label": "Andhra Pradesh" },
    // { "value": "AR", "label": "Arunachal Pradesh" },
    // { "value": "AS", "label": "Assam" },
    // { "value": "BR", "label": "Bihar" },
    // { "value": "CG", "label": "Chandigarh" },
    // { "value": "CH", "label": "Chhattisgarh" },
    // { "value": "DH", "label": "Dadra and Nagar Haveli" },
    // { "value": "DD", "label": "Daman and Diu" },
    // { "value": "DL", "label": "Delhi" },
    // { "value": "GA", "label": "Goa" },
    // { "value": "GJ", "label": "Gujarat" },
    // { "value": "HR", "label": "Haryana" },
    // { "value": "HP", "label": "Himachal Pradesh" },
    // { "value": "JK", "label": "Jammu and Kashmir" },
    // { "value": "JH", "label": "Jharkhand" },
    // { "value": "KA", "label": "Karnataka" },
    // { "value": "KL", "label": "Kerala" },
    // { "value": "LD", "label": "Lakshadweep" },
    // { "value": "MP", "label": "Madhya Pradesh" },
    // { "value": "MH", "label": "Maharashtra" },
    // { "value": "MN", "label": "Manipur" },
    // { "value": "ML", "label": "Meghalaya" },
    // { "value": "MZ", "label": "Mizoram" },
    // { "value": "NL", "label": "Nagaland" },
    // { "value": "OR", "label": "Odisha" },
    // { "value": "PY", "label": "Puducherry" },
    // { "value": "PB", "label": "Punjab" },
    // { "value": "RJ", "label": "Rajasthan" },
    // { "value": "SK", "label": "Sikkim" },
    // { "value": "TN", "label": "Tamil Nadu" },
    // { "value": "TS", "label": "Telangana" },
    // { "value": "TR", "label": "Tripura" },
    // { "value": "UK", "label": "Uttarakhand" },
    // { "value": "UP", "label": "Uttar Pradesh" },
    // { "value": "WB", "label": "West Bengal" }]
  );
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDropDownData();
      setSpinner(true);
      // fetch(global.baseURL+'customer/get/customer/details/' + global.loginID)
      //     .then((response) => response.json())
      //     .then((responseJson) => {
      //         console.log(responseJson.data)
      //         setUserName(responseJson.data.userName)
      //         setCustomerId(responseJson.data.customerId)
      //         if (responseJson.data.dateOFBirth != null) {
      //             setValue("dateOFBirth", responseJson.data.dateOFBirth)
      //         } else {
      //             setValue("dateOFBirth", '')
      //         }
      //         if (responseJson.data.state != null) {
      //             setValue("state", responseJson.data.state)
      //         } else {
      //             setValue("state", '')
      //         }
      //         if (responseJson.data.city != null) {
      //             setValue("city", responseJson.data.city)
      //         } else {
      //             setValue("city", '')
      //         }
      //         if (responseJson.data.userIncome != null) {
      //             setValue("userIncome", responseJson.data.userIncome)
      //         } else {
      //             setValue("userIncome", '')
      //         }
      //         if (responseJson.data.mobileNumber != null) {
      //             setValue("mobileNumber", responseJson.data.mobileNumber)
      //             setMobileNumber(responseJson.data.mobileNumber)
      //         } else {
      //             setValue("mobileNumber", '')
      //             setMobileNumber('')
      //         }
      //         if (responseJson.data.noOfDependents != null) {
      //             setValue("noOfDependents", responseJson.data.noOfDependents)
      //         } else {
      //             setValue("noOfDependents", '')
      //         }
      //         if (responseJson.data.baseCurrency != null) {
      //             setValue("baseCurrency", responseJson.data.baseCurrency)
      //         } else {
      //             setValue("baseCurrency", '')
      //         }

      //         if (responseJson.data.salaryFlag == null || responseJson.data.salaryFlag == 0) {
      //             setValue("salaryFlag", false)
      //         } else {
      //             setValue("salaryFlag", true)
      //         }
      //         setSpinner(false)
      //     })
      //     .catch((error) => {
      //         console.error(error);
      //         setSpinner(false)
      //     })
      getUserData();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);

  getUserData = () => {
    fetch(global.baseURL + 'customer/get/customer/details/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.data);
        setUserName(responseJson.data.userName);
        setCustomerId(responseJson.data.customerId);
        if (responseJson.data.dateOFBirth != null) {
          setValue('dateOFBirth', responseJson.data.dateOFBirth);
        } else {
          setValue('dateOFBirth', '');
        }
        if (responseJson.data.state != null) {
          setValue('state', responseJson.data.state);
        } else {
          setValue('state', '');
        }
        if (responseJson.data.city != null) {
          setValue('city', responseJson.data.city);
        } else {
          setValue('city', '');
        }
        if (responseJson.data.userIncome != null) {
          setValue('userIncome', responseJson.data.userIncome);
        } else {
          setValue('userIncome', '');
        }
        if (responseJson.data.mobileNumber != null) {
          setValue('mobileNumber', responseJson.data.mobileNumber);
          setMobileNumber(responseJson.data.mobileNumber);
        } else {
          setValue('mobileNumber', '');
          setMobileNumber('');
        }
        if (responseJson.data.noOfDependents != null) {
          setValue('noOfDependents', responseJson.data.noOfDependents);
        } else {
          setValue('noOfDependents', '');
        }
        if (responseJson.data.baseCurrency != null) {
          setValue('baseCurrency', responseJson.data.baseCurrency);
        } else {
          setValue('baseCurrency', '');
        }

        if (
          responseJson.data.salaryFlag == null ||
          responseJson.data.salaryFlag == 0
        ) {
          setValue('salaryFlag', false);
        } else {
          setValue('salaryFlag', true);
        }
        setUserImage(responseJson.data.userImage);
        global.userImage = responseJson.data.userImage;
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  getDropDownData = () => {
    fetch(global.baseURL + 'customer/get/country/currency/codes')
      .then((response) => response.json())
      .then((responseJson) => {
        let list = [];
        for (let l of responseJson.data.countries) {
          let li = {};
          li.value = l.code;
          li.label = l.currencyName;
          li.country = l.country;
          list.push(li);
        }
        setCurrencyCode(list);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getCities = (value) => {
    for (let s of states) {
      if (s.value == value) {
        setCities(s.districts);
      }
    }
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
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // console.log(response.uri)
        // SetFileuri(response.uri); //update state to update Image
        // console.log(response.data.split(';', 1))
        let data = {};
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

        fetch(global.baseURL + 'customer/save/customer/image/' + customerId, {
          body: form,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((response) => response.json())
          .catch((error) => {
            console.log('ERROR ' + error);
          })
          .then((responseJson) => {
            console.log(responseJson);
            getUserData();
          })
          .done();
      }
    });
  };
  const getDecimalFormat = () => {
    fetch(
      global.baseURL +
        'config/get/userPreferredDecimalFormat/' +
        global.loginID,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        global.decimalScale = responseJson.data.value;
        console.log('userProfile decimalScale : ' + global.decimalScale);
        navigation.navigate('successPage', {type: 'editProfilePage'});
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const update = (data) => {
    if (mobileNoFormatError == false) {
      setDisableSaveBtn(true);
      setSpinner(true);
      console.log(data);
      let d = {};
      d.customerId = customerId;
      d.state = data.state;
      d.city = data.city;
      d.dateOFBirth = data.dateOFBirth;
      d.userName = userName;
      d.baseCurrency = data.baseCurrency;
      d.userIncome = data.userIncome;
      d.mobileNumber = data.mobileNumber;
      d.noOfDependents = data.noOfDependents;
      if (data.salaryFlag == false) {
        d.salaryFlag = 0;
      } else {
        d.salaryFlag = 1;
      }
      fetch(global.baseURL + 'customer/save/customer/profile/E', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(d),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          setDisableSaveBtn(false);
          if (
            responseJson.status == 200 ||
            responseJson.message == 'Request Completed'
          ) {
            setDisableSaveBtn(false);
            // navigation.navigate('goalsPage')
            getDecimalFormat();
            // navigation.navigate('successPage', {type: 'editProfilePage'});
          } else {
            setDisableSaveBtn(false);
            navigation.navigate('successPage', {type: 'failure'});
          }

          setSpinner(false);
        })
        .catch((error) => {
          console.error(error);
          setDisableSaveBtn(false);
          setSpinner(false);
        });
    }
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
      <View style={{flex: 1}}>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg.png')}></Image>
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('dashboard')}>
              <View style={styles.backBtn}>
                <Image
                  resizeMode={'contain'}
                  style={{maxWidth: '100%', height: '100%'}}
                  source={require('./assets/icons-back_white.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Profile</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', paddingLeft: hp('3%')}}>
            <View style={styles.profileView}>
              {userImage != null && userImage != '' ? (
                <Image
                  resizeMode={'cover'}
                  style={styles.profileImg}
                  source={{
                    uri: global.baseURL + 'customer/' + userImage,
                  }}></Image>
              ) : (
                <Image
                  resizeMode={'cover'}
                  style={styles.profileImg}
                  source={require('./assets/avatar-icon.png')}
                />
              )}
            </View>

            <View style={{justifyContent: 'center', marginLeft: hp('2%')}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
                {userName}
              </Text>
              <Text style={{fontSize: 12, color: 'white'}}>{mobileNumber}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          flex: wp('0.9%'),
        }}>
        <TouchableOpacity
          style={styles.cameraView}
          onPress={() => uploadImage()}>
          <Image
            style={{alignSelf: 'center', height: hp('4%'), width: hp('4%')}}
            source={require('./assets/camera_icon.png')}
          />
        </TouchableOpacity>

        <ScrollView style={styles.form}>
          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>Mobile Number</Text>
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <TextInput
                  placeholder="Enter Mobile Number"
                  underlineColorAndroid="transparent"
                  style={styles.textInputBorderLine}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  onChangeText={(value) => {
                    if (
                      value == '' ||
                      (value.length <= 15 && value.length >= 8)
                    ) {
                      setMobileNoFormatError(false);
                      onChange(value);
                    } else {
                      setMobileNoFormatError(true);
                      onChange(value);
                    }
                  }}
                  value={value}
                />
              )}
              name="mobileNumber"
              rules={{required: true}}
              defaultValue=""
            />
            {errors.mobileNumber && (
              <Text style={styles.error}> Please Enter Mobile Number.</Text>
            )}
            {mobileNoFormatError == true ? (
              <Text style={styles.error}>Invalid Mobile Number.</Text>
            ) : null}
          </View>
          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.pickerBorderLine}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <DatePicker
                    style={{width: '100%'}}
                    date={value}
                    mode="date"
                    placeholder="Select date"
                    iconSource={require('./assets/calander_icon.png')}
                    format="YYYY-MM-DD"
                    // style={styles.textInputBorderLine}
                    // minDate="2016-05-01"
                    // maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        width: hp('4%'),
                        height: hp('4%'),
                        position: 'absolute',
                        right: 0,
                        marginLeft: 0,
                      },
                      dateInput: {
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderTopWidth: 0,
                        borderBottomColor: '#cccccc',
                        alignItems: 'flex-start',
                      },
                      placeholderText: {
                        marginRight: 'auto',
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(value) => onChange(value)}
                  />
                )}
                name="dateOFBirth"
                rules={{required: true}}
                defaultValue=""
              />
            </View>
            {errors.dateOFBirth && (
              <Text style={styles.error}>Please Date Of Birth.</Text>
            )}
          </View>
          <View
            style={{
              marginBottom: hp('2%'),
              flexDirection: 'row',
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: '#cccc',
              paddingBottom: hp('3%'),
              // paddingTop: hp('2%')
              color: '#555555',
            }}>
            <Text style={[styles.label, {marginTop: 5}]}>Salaried ?</Text>
            <View style={{marginLeft: 'auto'}}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <ToggleSwitch
                    isOn={value}
                    onColor="#63CDD6"
                    offColor="#767577"
                    size="medium"
                    onToggle={(value) => onChange(value)}
                  />
                )}
                name="salaryFlag"
                // rules={{ required: true }}
                defaultValue=""
              />
            </View>
          </View>
          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>Monthly Income</Text>
            <Controller
              control={control}
              render={({onChange, onBlur, value}) => (
                <TextInput
                  placeholder="Enter Monthly Income"
                  underlineColorAndroid="transparent"
                  style={styles.textInputBorderLine}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(value) => onChange(value)}
                  value={value.toString()}
                />
              )}
              name="userIncome"
              rules={{required: true}}
              defaultValue=""
            />
            {errors.userIncome && (
              <Text style={styles.error}>Please Enter Monthly Income.</Text>
            )}
          </View>
          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>No of Dependents</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#cccc',
                paddingTop: hp('-2%'),
              }}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <RNPickerSelect
                    value={value.toString()}
                    style={styles}
                    onValueChange={(value) => onChange(value)}
                    items={[
                      {label: '0', value: '0'},
                      {label: '1', value: '1'},
                      {label: '2', value: '2'},
                      {label: '3', value: '3'},
                      {label: '4', value: '4'},
                      {label: '5', value: '5'},
                      {label: '6', value: '6'},
                      {label: '7', value: '7'},
                      {label: '8', value: '8'},
                      {label: '9', value: '9'},
                      {label: '10', value: '10'},
                    ]}
                  />
                )}
                name="noOfDependents"
                rules={{required: true}}
                defaultValue=""
              />
            </View>

            {errors.noOfDependents && (
              <Text style={styles.error}>Please Select No of Dependents.</Text>
            )}
          </View>

          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>Current State</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#cccc',
                paddingTop: hp('-2%'),
              }}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <RNPickerSelect
                    value={value}
                    style={styles}
                    onValueChange={(value) => {
                      onChange(value);
                      setStateSelected(value);
                      getCities(value);
                    }}
                    items={states}
                  />
                )}
                name="state"
                rules={{required: true}}
                defaultValue=""
              />
            </View>
            {errors.state && (
              <Text style={styles.error}>Please Select Current State.</Text>
            )}
          </View>

          <View style={{marginBottom: hp('2%')}}>
            <Text style={styles.label}>Current City</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#cccc',
                paddingTop: hp('-2%'),
              }}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <RNPickerSelect
                    disabled={
                      stateSelected == '' ||
                      stateSelected == null ||
                      stateSelected == undefined
                    }
                    value={value}
                    style={styles}
                    onValueChange={(value) => onChange(value)}
                    items={cities}
                  />
                )}
                name="city"
                rules={{required: true}}
                defaultValue=""
              />
            </View>
            {errors.city && (
              <Text style={styles.error}>Please Select Current City.</Text>
            )}
          </View>

          <View style={{marginBottom: hp('5%')}}>
            <Text style={styles.label}>Preferred Currency</Text>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#cccc',
                paddingTop: hp('-2%'),
              }}>
              <Controller
                control={control}
                render={({onChange, onBlur, value}) => (
                  <RNPickerSelect
                    value={value}
                    style={styles}
                    onValueChange={(value) => onChange(value)}
                    items={currencyCode}
                  />
                )}
                name="baseCurrency"
                rules={{required: true}}
                defaultValue=""
              />
            </View>
            {errors.baseCurrency && (
              <Text style={styles.error}>
                Please Select Preferred Currency.
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={disableSaveBtn == true}
            onPress={handleSubmit(update)}>
            <Text style={styles.footerBotton}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UserProfilePage;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('2.5%'),
    width: wp('100%'),
    flex: 0.2,
  },
  header: {
    // padding: hp("2%"),
    paddingLeft: hp('2.5%'),
    paddingBottom: hp('2.5%'),
    flexDirection: 'row',
    zIndex: 1,
  },
  heading: {
    paddingLeft: hp('3%'),
    color: 'white',
    fontWeight: 'bold',
    fontSize: 26,
    // paddingTop: hp('0.5%')
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
  backBtn: {
    width: hp('5%'),
    height: hp('5%'),
    marginTop: hp('0.8%'),
  },
  profileView: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: hp('50%'),
  },
  profileImg: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: hp('50%'),
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
  form: {
    marginBottom: wp('16%'),
    paddingTop: hp('5%'),
    paddingLeft: hp('6%'),
    paddingRight: hp('6%'),
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
  error: {
    color: '#F22973',
    paddingBottom: hp('3%'),
  },
  label: {
    color: '#7D8C96',
    fontSize: 12,
  },
  textInputBorderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    paddingBottom: 8,
    paddingTop: hp('2%'),
    color: '#555555',
  },
  cameraView: {
    height: hp('8%'),
    width: hp('8%'),
    backgroundColor: '#EDA32B',
    justifyContent: 'center',
    borderRadius: hp('50%'),
    position: 'absolute',
    right: wp('10%'),
    top: hp('-4%'),
    zIndex: 1,
  },
});
