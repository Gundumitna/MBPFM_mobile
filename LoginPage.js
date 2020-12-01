import React, { useState, useEffect, Fragment, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Keyboard,
  FlatList,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm, Controller } from 'react-hook-form';
import Upshot from 'react-native-upshotsdk';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Share from 'react-native-share';
import { useDispatch } from 'react-redux';
import { fetchCurrency } from './redux/currency/currencyActions';

export default function LoginPage({ navigation }) {
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
  const [spinner, setSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const viewRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrency());

    const unsubscribe = navigation.addListener('focus', () => {
      setValue('userId', '');
      global.loginID = '';
      global.memoriesSelectedDate = '';
      global.memoriesDate = '';
      global.predictionStatus = false;
      // global.filter = true

      console.log(
        'global.filter : ' +
        global.filter +
        ' global.loginID : ' +
        global.loginID,
      );
    });
    return unsubscribe;
  }, [navigation]);
  const onDateSelected = (date) => {
    console.log('Selected Date:==>', date);
  };
  // get permission on android
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{ text: 'OK', onPress: () => { } }],
        { cancelable: false },
      );
    } catch (err) {
      // handle error as you please
      console.log('err', err);
    }
  };

  // download image
  const downloadImage = async () => {
    try {
      // react-native-view-shot caputures component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      if (Platform.OS === 'android') {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }

      // cameraroll saves image
      const image = CameraRoll.save(uri, 'photo');
      if (image) {
        shareImage();
        // Alert.alert(
        //   '',
        //   'Image saved successfully.',
        //   [{text: 'OK', onPress: () => {
        //   }}],
        //   {cancelable: false},
        // );
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const shareImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });
      console.log('uri', uri);
      const shareResponse = await Share.open({ url: uri });
      console.log('shareResponse', shareResponse);
    } catch (error) {
      console.log('error', error);
    }
  };

  const onSubmit = (data) => {
    setDisableSaveBtn(true);
    // setFailedId('')
    Keyboard.dismiss();
    console.log(data);
    if (
      data.userId == '250001' ||
      data.userId == '250002' ||
      data.userId == '250003' ||
      data.userId == '250004' ||
      data.userId == '250005'
    ) {
      setDisableSaveBtn(false);
      global.loginID = data.userId;
      global.predictionStatus = true;
      global.filter = false;
      console.log(global.loginID);
      console.log(
        'global.filter : ' +
        global.filter +
        ' global.loginID : ' +
        global.loginID,
      );
      const userDetails = {
        userName: global.userName,
        appuID: global.loginID,
      };
      console.log('usernetails' + JSON.stringify(userDetails));
      Upshot.setUserProfile(JSON.stringify(userDetails), function (response) {
        // response is either true or false
        console.log('result' + JSON.stringify(response));
      });
      getPredictionData();
      // fetch(global.baseURL+ 'customer/' + data.userId + '/assets/host')
      //     .then((response) => response.json())
      //     .then((responseJson) => {
      //         // return responseJson.movies;

      //         console.log(responseJson.data)
      //         if (responseJson.data != null) {
      //             setUser(responseJson.data);
      //             global.userName = responseJson.data.userName
      //             global.userImage = responseJson.data.userImage

      //             console.log('global.userName : ' + global.userName)
      //             navigation.navigate('landingPage')
      //         }
      //         setSpinner(false)

      //         // AsyncStorage.setItem('userDetails', responseJson.data);
      //     })
      //     .catch((error) => {
      //         setSpinner(false)
      //         console.error(error);

      // navigation.navigate('landingPage')
      //     })
    } else {
      setDisableSaveBtn(false);
      Alert.alert('Alert', 'Invalid User ID');
    }
  };
  getPredictionData = () => {
    console.log(global.baseURL);
    fetch(global.baseURL + 'customer/get/prediction/data/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        console.log(responseJson.data);
        if (responseJson.data != null && responseJson.data.length != 0) {
          let data = [...responseJson.data];
          let i = 0;
          for (let d of data) {
            let ca = [];
            d.categoryStatus = false;
            d.collapseData = false;
            d.translate = new Animated.ValueXY({ x: 0, y: 0 });
            if (d.categoryDetailsModels != null) {
              for (let c of d.categoryDetailsModels) {
                if (c.categoryId != null) {
                  if (c.categoryId != d.categoryId) {
                    let cc = {};
                    cc.color = '#AAAAAA';
                    cc.selectedCategory = false;
                    cc.categoryName = c.categoryName;
                    cc.categoryId = c.categoryId;
                    cc.categoryIcon = c.categoryIcon;
                    cc.amount = c.amount;
                    ca.push(cc);
                  }
                }
              }

              d.categoryDetailsModels = ca;
            }

            // }
          }
          global.predictionList = data;
          navigation.navigate('landingPage');
        } else {
          global.predictionList = [];
          navigation.navigate('landingPage');
        }

        // navigation.navigate('landingPage')
      })
      .catch((error) => {
        console.error(error);
        global.predictionList = [];
        navigation.navigate('landingPage');
      });
  };
  return (
    <View style={styles.container}>
      <View
        ref={viewRef}
        style={{
          padding: hp('5%'),
          borderColor: 'white',
          borderWidth: 1,
          borderRadius: hp('1.5%'),
          backgroundColor: 'white',
        }}>
        <Text style={styles.heading}>Login</Text>

        <View style={{ marginBottom: hp('2%') }}>
          <Text style={styles.label}>User ID</Text>
          <Controller
            control={control}
            render={({ onChange, onBlur, value }) => (
              <TextInput
                placeholder="Enter User ID"
                underlineColorAndroid="white"
                placeholderTextColor="#AAAAAA"
                // style={styles.textInputBorderLine}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#cccc',
                  marginTop: hp('-1%'),
                  paddingBottom: hp('-0.5%'),
                  color: '#444444',
                }}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="userId"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors.userId && (
            <Text style={styles.error}>Please Enter User ID.</Text>
          )}
        </View>
        <TouchableOpacity
          disabled={disableSaveBtn == true}
          onPress={handleSubmit(onSubmit)}
        // onPress={shareImage}
        >
          <Text style={styles.footerBotton}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    padding: hp('4%'),
    textAlign: 'center',
    fontSize: 25,
    color: '#555555',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: hp('4%'),
    paddingRight: hp('4%'),
    backgroundColor: '#454F63',
    borderWidth: 1,
  },
  label: {
    color: '#777777',
    fontSize: 12,
    height: 25,
  },
  textInputBorderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    paddingBottom: 8,
    paddingTop: hp('2%'),
    color: '#333333',
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
    marginLeft: 20,
    marginRight: 20,
    color: 'white',
  },
  error: {
    color: '#F22973',
    paddingBottom: hp('3%'),
  },
});
