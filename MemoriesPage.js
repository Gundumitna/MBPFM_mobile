// import React, { Component } from 'react';
// import { Platform, StyleSheet, Text, View, Dimensions, PanResponder, Animated, ScrollView } from 'react-native';
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// const instructions = Platform.select({
//     ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//     android:
//         'Double tap R on your keyboard to reload,\n' +
//         'Shake or press menu button for dev menu',
// });

// export default class App extends Component {

//     constructor(props) {
//         super(props);

//         const { height, width } = Dimensions.get('window');

//         const initialPosition = { x: 0, y: wp('65%') }
//         const position = new Animated.ValueXY(initialPosition);

//         const parentResponder = PanResponder.create({
//             onMoveShouldSetPanResponderCapture: (e, gestureState) => {
//                 return false
//             },
//             onStartShouldSetPanResponder: () => false,
//             onMoveShouldSetPanResponder: (e, gestureState) => {
//                 if (this.state.toTop) {
//                     return gestureState.dy > 6
//                 } else {
//                     return gestureState.dy < -6
//                 }
//             },
//             onPanResponderTerminationRequest: () => false,
//             onPanResponderMove: (evt, gestureState) => {
//                 let newy = gestureState.dy
//                 if (this.state.toTop && newy < 0) return
//                 if (this.state.toTop) {
//                     position.setValue({ x: 0, y: newy });
//                 } else {
//                     position.setValue({ x: 0, y: initialPosition.y });
//                 }
//             },
//             onPanResponderRelease: (evt, gestureState) => {
//                 if (this.state.toTop) {
//                     if (gestureState.dy > wp('65%')) {
//                         this.snapToBottom(initialPosition)
//                     } else {
//                         this.snapToTop()
//                     }
//                 } else {
//                     if (gestureState.dy < wp('65%')) {
//                         this.snapToTop()
//                     } else {
//                         this.snapToBottom(initialPosition)
//                     }
//                 }
//             },
//         });

//         this.offset = 0;
//         this.parentResponder = parentResponder;
//         this.state = { position, toTop: false };
//     }

//     snapToTop = () => {
//         Animated.timing(this.state.position, {
//             toValue: { x: 0, y: wp('16%') },
//             duration: 300,
//         }).start(() => { });
//         this.setState({ toTop: true })
//     }

//     snapToBottom = (initialPosition) => {
//         Animated.timing(this.state.position, {
//             toValue: initialPosition,
//             duration: 150,
//         }).start(() => { });
//         this.setState({ toTop: false })
//     }

//     hasReachedTop({ layoutMeasurement, contentOffset, contentSize }) {
//         return contentOffset.y == 0;
//     }

//     render() {
//         const { height } = Dimensions.get('window');

//         return (
//             <View style={styles.container}>
//                 <Text style={styles.welcome}>Welcome to React Native!</Text>
//                 <Text style={styles.instructions}>To get started, edit App.js</Text>
//                 <Text style={styles.instructions}>{instructions}</Text>
//                 <Animated.View style={[styles.draggable, { height }, this.state.position.getLayout()]} {...this.parentResponder.panHandlers}>
//                     <Text style={styles.dragHandle}>=</Text>
//                     <ScrollView style={styles.scroll}>
//                         <Text style={{ fontSize: 44 }}>Lorem Ipsum</Text>
//                         <Text style={{ fontSize: 44 }}>dolor sit amet</Text>
//                         <Text style={{ fontSize: 44 }}>consectetur adipiscing elit.</Text>
//                         <Text style={{ fontSize: 44 }}>In ut ullamcorper leo.</Text>
//                         <Text style={{ fontSize: 44 }}>Sed sed hendrerit nulla,</Text>
//                         <Text style={{ fontSize: 44 }}>sed ullamcorper nisi.</Text>
//                         <Text style={{ fontSize: 44 }}>Mauris nec eros luctus</Text>
//                         <Text style={{ fontSize: 44 }}>leo vulputate ullamcorper</Text>
//                         <Text style={{ fontSize: 44 }}>et commodo nulla.</Text>
//                         <Text style={{ fontSize: 44 }}>Nullam id turpis vitae</Text>
//                         <Text style={{ fontSize: 44 }}>risus aliquet dignissim</Text>
//                         <Text style={{ fontSize: 44 }}>at eget quam.</Text>
//                         <Text style={{ fontSize: 44 }}>Nulla facilisi.</Text>
//                         <Text style={{ fontSize: 44 }}>Vivamus luctus lacus</Text>
//                         <Text style={{ fontSize: 44 }}>eu efficitur mattis</Text>
//                     </ScrollView>
//                 </Animated.View>
//             </View>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     welcome: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//     },
//     instructions: {
//         textAlign: 'center',
//         color: '#333333',
//         marginBottom: 5,
//     },
//     draggable: {
//         position: 'absolute',
//         right: 0,
//         backgroundColor: 'skyblue',
//         alignItems: 'center'
//     },
//     dragHandle: {
//         fontSize: 22,
//         color: '#707070',
//         height: 60
//     },
//     scroll: {
//         paddingLeft: 10,
//         paddingRight: 10
//     }
// });

import React, { useState, useEffect, useRef } from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import { Card } from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import Modal from 'react-native-modal';
import moment from 'moment';
import AmountDisplay from './AmountDisplay';
import ImagePicker from 'react-native-image-picker';
import {
  View,
  Image,
  StyleSheet,
  Text,
  PanResponder,
  Animated,
  TouchableOpacity,
  Alert,
  Easing,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from './redux/actions';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import Tags from 'react-native-tags';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, { Marker } from 'react-native-maps';
import { captureRef } from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Share from 'react-native-share';
function MemoriesPage({ route, navigation }) {
  // const viewRef = useRef();
  const viewRef = [];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [imageUploaded, setImageUploaded] = useState(false);
  const [notransaction, setNotransaction] = useState(false);
  const [widgetData, setWidgetData] = useState([
    { id: 1, count: '06', text: 'Months Back', active: true },
    { id: 2, count: '01', text: 'Year Back', active: false },
    { id: 3, count: '02', text: 'Year Back', active: false },
    { id: 4, count: '03', text: 'Year Back', active: false },
    { id: 5, count: '04', text: 'Year Back', active: false },
  ]);
  const [selectedItem, setSelectedItem] = useState();
  const [scrollOffset, setScrollOffset] = useState();
  const [calendarStrip, setCalendarStrip] = useState();
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [scrollEndStatus, setScrollEndStatus] = useState(false);
  const [flag, setFlag] = useState(false);
  const [start, setStart] = useState(false);
  const [heading, setHeading] = useState('');
  let ls = require('react-native-local-storage');
  // const [selectedDate, setSelectedDate] = useState(moment().subtract(6, 'months'))
  const [sDate, setSdate] = useState();
  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Animated.timing(pan.y, {
      //   toValue: wp('65%'),
      //   easing: Easing.linear,
      // }).start();
      ls.save('selectedDrawerItem', 'memories');
      console.log('date : ' + new Date(global.memoriesSelectedDate));
      if (global.memoriesSelectedDate != '') {
        console.log('date : ' + global.memoriesSelectedDate);

        getMemoriesData(global.memoriesSelectedDate);
        // calendarStrip.setSelectedDate(new Date(global.memoriesSelectedDate))
        setStart(false);
      } else {
        getMemoriesData(moment().format('YYYY-MM-DD'));
      }
    });
    return unsubscribe;
  }, [navigation]);

  selectedItemInWidget = (item) => {
    console.log(item);

    if (item.count == '06') {
      global.memoriesSelectedDate = moment()
        .subtract(6, 'months')
        .format('YYYY-MM-DD');
      getMemoriesData(moment().subtract(6, 'months').format('YYYY-MM-DD'));
      calendarStrip.setSelectedDate(moment().subtract(6, 'months'));

      setFlag(true);
    } else if (item.count == '01') {

      console.log('item count : ', item.count)
      global.memoriesSelectedDate = moment()
        .subtract(1, 'year')
        .format('YYYY-MM-DD');
      getMemoriesData(moment().subtract(1, 'year').format('YYYY-MM-DD'));
      console.log('memoriesSelectedDate  ', global.memoriesSelectedDate)

      calendarStrip.setSelectedDate(moment().subtract(1, 'year'));
      console.log('selected Date  ', moment().subtract(1, 'year'))
      setFlag(true);
    } else if (item.count == '02') {
      global.memoriesSelectedDate = moment()
        .subtract(2, 'year')
        .format('YYYY-MM-DD');
      getMemoriesData(moment().subtract(2, 'year').format('YYYY-MM-DD'));
      calendarStrip.setSelectedDate(moment().subtract(2, 'year'));

      setFlag(true);
    } else if (item.count == '03') {
      global.memoriesSelectedDate = moment()
        .subtract(3, 'year')
        .format('YYYY-MM-DD');
      getMemoriesData(moment().subtract(3, 'year').format('YYYY-MM-DD'));
      calendarStrip.setSelectedDate(moment().subtract(3, 'year'));

      setFlag(true);
    } else if (item.count == '04') {
      global.memoriesSelectedDate = moment()
        .subtract(4, 'year')
        .format('YYYY-MM-DD');
      getMemoriesData(moment().subtract(4, 'year').format('YYYY-MM-DD'));
      calendarStrip.setSelectedDate(moment().subtract(4, 'year'));

      setFlag(true);
    }
    for (let w of widgetData) {
      if (item.id == w.id) {
        w.active = true;
        setFlag(true);
      } else {
        w.active = false;
        setFlag(true);
      }
    }
  };
  getMemoriesData = (date) => {
    console.log(date);
    // setSdate(date)
    setSpinner(true);
    setNotransaction(false);
    let postData = {};
    let linkList = 0;
    ls.get('consentStatus').then((data) => {
      console.log('consentStatus : ' + data);
      if (data == 'true') {
        linkList = 1;
      }
    });
    ls.get('filterData').then((data) => {
      postData.calenderSelectedFlag = 1;
      postData.month = data.month.id;
      postData.year = data.year.year;
      if (linkList == 1 || data.flag == false) {
        postData.linkedAccountIds = [];
      } else {
        postData.linkedAccountIds = data.linkedAccountIds;
      }
      let heading = '';
      heading = data.month.mntName + ' ' + data.year.year;
      setHeading(heading);
      console.log(JSON.stringify(postData));
      fetch(
        global.baseURL +
        'customer/memories/transactions/' +
        date +
        '/' +
        global.loginID,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.data);
          setImageUploaded(false);
          if (responseJson.data != null) {
            setNotransaction(false);
            let data = [...responseJson.data];

            for (let d of data) {
              let c = [];
              for (let cont of d.contacts) {
                let cl = {};
                cl.id = 0;
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
            }
            console.log(data);

            setData(data);
          } else {
            setNotransaction(true);
            setData([]);
          }
          setSpinner(false);
        });
    });
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

  const shareImage = async (index) => {
    console.log(viewRef[index]);
    // console.log('share' + JSON.stringify(viewRef));
    try {
      const uri = await captureRef(viewRef[index], {
        format: 'png',
        quality: 0.8,
        children: true,
      });
      console.log('uri', uri);
      // if (Platform.OS === 'android') {
      //   const granted = await getPermissionAndroid();
      //   if (!granted) {
      //     return;
      //   }
      // }
      const shareResponse = await Share.open({ url: uri });
      console.log('shareResponse', shareResponse);
    } catch (error) {
      console.log('error', error);
    }
  };
  // Slider Animation Part
  const [isScrollEnable, setIsScrollEnable] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  // const pan = useState(new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 300 }))[0];
  const pan = useState(new Animated.ValueXY({ x: 0, y: wp('65%') }))[0];
  const panResponder =
    useState(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          if (
            // (isScrollEnable == true && scrollOffset <= 0) ||
            // (isScrollEnable == false &&
            //   gestureState.moveY >= wp('65%') &&
            //   gestureState.dy < 0) ||
            // (isScrollEnable == false &&
            //   gestureState.moveY <= wp('65%') &&
            //   gestureState.dy > 0)
            (isScrollEnable == true && scrollOffset <= 0) ||
            (isScrollEnable == false &&
              gestureState.moveY >= wp('65%') &&
              gestureState.dy > 0) ||
            (isScrollEnable == false &&
              gestureState.moveY <= wp('65%') &&
              gestureState.dy < 0)
          ) {
            return true;
          } else {
            return false;
          }
        },
        onPanResponderGrant: (evt, gestureState) => {
          pan.extractOffset();
        },
        onPanResponderMove: (evt, gestureState) => {
          pan.setValue({ x: 0, y: gestureState.dy });
        },

        onPanResponderRelease: (evt, gestureState) => {
          console.log(gestureState.dy);
          pan.flattenOffset();
          if (gestureState.dy < 0) {
            setIsScrollEnable(true);
            Animated.timing(pan.y, {
              toValue: wp('15%'),
              // tension: 1
              easing: Easing.linear,
            }).start();
          } else if (gestureState.dy > 0) {
            setIsScrollEnable(false);
            Animated.timing(pan.y, {
              toValue: wp('65%'),
              easing: Easing.linear,
            }).start();
          }
        },
      })
    )[0];
  const animatedHeight = {
    transform: pan.getTranslateTransform(),
  };
  const viewOpacity = pan.y.interpolate({
    inputRange: [0, hp('20%'), hp('25%')],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  const displayViewOpacity = pan.y.interpolate({
    inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 450],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });
  const _bgColorAnimation = viewOpacity.interpolate({
    inputRange: [0, 0, 1],
    outputRange: ['transparent', '#DFE4FB', '#DFE4FB'],
  });

  const uploadImage = () => {
    setIsModalVisible(false);
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
        let data = {};
        // setSpinner(true)
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
          selectedItem.transactionId,
          {
            body: form,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
          .then((response) => response.json())
          .catch((error) => {
            console.log('ERROR ' + error);
            setSelectedItem();
          })
          .then((responseJson) => {
            console.log(responseJson);
            setImageUploaded(true);
            // setSpinner(true)
            getMemoriesData(
              moment(calendarStrip.getSelectedDate()).format('YYYY-MM-DD'),
            );
            setSelectedItem();
          })
          .done();
      }
    });
  };
  const selectedDateFunction = (date) => {
    console.log(moment(date).format('DD-MM-YYYY'));
    global.memoriesSelectedDate = moment(date).format('YYYY-MM-DD');
    getMemoriesData(moment(date).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    console.log(calendarStrip);
    if (calendarStrip != undefined) {
      if (global.memoriesSelectedDate != '') {
        calendarStrip.setSelectedDate(new Date(global.memoriesSelectedDate));
      } else {
        calendarStrip.setSelectedDate(moment());
      }
      // // setSdate(moment().subtract(6, 'months'))
      console.log(
        ' calendarStrip.getSelectedDate() : ' +
        moment(calendarStrip.getSelectedDate()).format('YYYY-MM-DD'),
      );
    }
  }, [calendarStrip != undefined]);

  dataSelected = (type, item) => {
    console.log(type);
    // return
    setSpinner(true);
    // fetch(global.baseURL+'customer/get/transaction/details/' + item.transactionId)
    fetch(
      global.baseURL + 'customer/get/transaction/details/' + item.transactionId,
    )
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length == 1) {
          console.log({ statementData: item, reDirectTo: 'memories' });
          if (type == 'split') {
            navigation.navigate('splitPage', {
              statementData: responseJson.data[0],
              reDirectTo: 'memories',
              selectedItem: item,
            });
            setSpinner(false);
          } else if (type == 'categorize') {
            navigation.navigate('categoriesPage', {
              reNavigateTo: 'memories',
              statementData: responseJson.data[0],
              transaction: item,
              reDirectTo: 'memories',
              splitList: responseJson.data[0],
            });
            setSpinner(false);
          }
        } else {
          let Data = [];
          let parentData = {};
          for (let li of responseJson.data) {
            if (li.type == 'P') {
              parentData = li;
            }
            if (li.type == 'C') {
              Data.push(li);
            }
          }
          if (type == 'split') {
            console.log({
              statementData: parentData,
              reDirectTo: 'memories',
              splitList: Data,
            });
            navigation.navigate('splitPage', {
              statementData: parentData,
              reDirectTo: 'memories',
              splitList: Data,
              selectedItem: item,
            });
            setSpinner(false);
          } else if (type == 'categorize') {
            console.log({
              statementData: parentData,
              reDirectTo: 'memories',
              splitList: Data,
            });
            navigation.navigate('categoriesPage', {
              reNavigateTo: 'memories',
              statementData: parentData,
              transaction: item,
              reDirectTo: 'memories',
              splitList: Data,
              selectedItem: item,
            });
            setSpinner(false);
          }
        }
      })
      .catch((error) => {
        setSpinner(false);
        console.error(error);
      });
  };
  histroyNavFunction = (type, item) => {
    setStart(true);
    let sT;
    for (let w of widgetData) {
      if (w.active == true) {
        if (w.count == '06') {
          sT = moment().subtract(6, 'months').format('YYYY-MM-DD');
        } else if (w.count == '01') {
          sT = moment().subtract(1, 'year').format('YYYY-MM-DD');
        } else if (w.count == '02') {
          sT = moment().subtract(2, 'year').format('YYYY-MM-DD');
        } else if (w.count == '03') {
          sT = moment().subtract(3, 'year').format('YYYY-MM-DD');
        } else if (w.count == '04') {
          sT = moment().subtract(4, 'year').format('YYYY-MM-DD');
        }
      }
    }
    console.log(sT);
    if (type == 'transaction') {
      if (item.merchantIcon != null && item.merchantIcon != '') {
        navigation.navigate('bankAndTransactionHistory', {
          reNavigateTo: 'memories',
          type: type,
          data: item,
          startDate: sT,
          endDate: moment().format('YYYY-MM-DD'),
        });
      }
      //  else {
      //     Alert.alert('Alert', "This transaction doesn't contain merchant description")
      // }
    } else if (type == 'location') {
      navigation.navigate('locationHistory', {
        reNavigateTo: 'memories',
        type: type,
        data: item,
        startDate: sT,
        endDate: moment().format('YYYY-MM-DD'),
      });
    } else {
      navigation.navigate('bankAndTransactionHistory', {
        reNavigateTo: 'memories',
        type: type,
        data: item,
        startDate: sT,
        endDate: moment().format('YYYY-MM-DD'),
      });
    }
  };
  contactsNavigation = (item) => {
    setStart(true);
    let sT;
    for (let w of widgetData) {
      if (w.active == true) {
        if (w.count == '06') {
          sT = moment().subtract(6, 'months').format('YYYY-MM-DD');
        } else if (w.count == '01') {
          sT = moment().subtract(1, 'year').format('YYYY-MM-DD');
        } else if (w.count == '02') {
          sT = moment().subtract(2, 'year').format('YYYY-MM-DD');
        } else if (w.count == '03') {
          sT = moment().subtract(3, 'year').format('YYYY-MM-DD');
        } else if (w.count == '04') {
          sT = moment().subtract(4, 'year').format('YYYY-MM-DD');
        }
      }
    }
    console.log(sT);
    // console.log({ reNavigateTo: 'memories', list: item.contacts, transactionId: item.transactionId, data: item, startDate: sT, endDate: moment().format('YYYY-MM-DD') })
    navigation.navigate('linkedPeople', {
      reNavigateTo: 'memories',
      list: item.contactsAndBeneficiary,
      transactionId: item.transactionId,
      data: item,
      startDate: sT,
      endDate: moment().format('YYYY-MM-DD'),
    });
  };
  return (
    <Animated.View style={{ flex: 1, backgroundColor: '#587BE6' }}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={imageUploaded ? 'Uploading Image...' : 'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      <Animated.View style={styles.layer1}>
        <View>
          <Image
            style={{ maxWidth: '100%' }}
            source={require('./assets/graph_bg.png')}
          />
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={navigation.openDrawer}
                style={{ marginRight: 'auto' }}>
                <Image source={require('./assets/icons-menu(white)(2).png')} />
              </TouchableOpacity>
              {/* <View style={{ marginRight: 'auto' }}>
                                <Text style={{ textAlign: 'center', color: 'white' }}>
                                    {heading}
                                </Text>
                            </View> */}
            </View>
            <Animated.View style={{ opacity: viewOpacity }}>
              <Text style={styles.title}>Memories</Text>
              <View style={{ paddingTop: hp('3%'), alignItems: 'center' }}>
                <View
                  style={{
                    width: wp('80%'),
                    height: hp('1.5%'),
                    top: 25,
                    left: 1,
                    marginLeft: 10,
                    marginRight: 10,
                  }}>
                  <Image
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/widgetLineImgInMemories.png')}
                  />
                </View>

                <FlatList
                  data={widgetData}
                  horizontal
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => selectedItemInWidget(item)}
                      style={{
                        paddingRight: index == 4 ? 0 : wp('7%'),
                        zIndex: 500,
                      }}>
                      <View style={{ width: 40, height: 40 }}>
                        {item.active == false ? (
                          <Image
                            resizeMode={'contain'}
                            style={{
                              maxWidth: '100%',
                              height: '100%',
                              zIndex: 50,
                            }}
                            source={require('./assets/notActiveWidgetImg.png')}
                          />
                        ) : (
                            <Image
                              resizeMode={'contain'}
                              style={{
                                maxWidth: '100%',
                                height: '100%',
                                zIndex: 50,
                              }}
                              source={require('./assets/activeWidgeImg.png')}
                            />
                          )}
                      </View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: 'white',
                          fontWeight: 'bold',
                          paddingLeft: wp('2.3'),
                        }}>
                        {item.count}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: 'white',
                          width: index == 4 ? wp('11%') : wp('12%'),
                          paddingLeft: wp('1.4'),
                        }}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          animatedHeight,
          {
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'white',
            height: SCREEN_HEIGHT - 50,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            flex: 1,
            paddingBottom: hp('1%'),
          },
        ]}>
        <Animated.View style={[styles.layer2, { backgroundColor: 'white' }]}>
          <Animated.View
            style={{
              height: hp('15%'),
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              marginBottom: 30,
            }}>
            <View
              style={{ position: 'absolute', right: hp('5%'), top: hp('4%') }}>
              <View style={{ width: hp('3.5%'), height: hp('3.5%') }}>
                <Image
                  style={{ maxWidth: '100%', height: '100%' }}
                  source={require('./assets/calander_icon.png')}
                />
              </View>
            </View>
            <View style={{ paddingTop: hp('4%') }}>
              <CalendarStrip
                ref={(calendarStrip) => {
                  setCalendarStrip(calendarStrip);
                }}
                scrollable={true}
                // scrollEnabled={isScrollEnable}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                style={{ height: 100, zIndex: 100 }}
                dateNumberStyle={{ color: '#587BE6' }}
                dateNameStyle={{ color: '#587BE6' }}
                calendarHeaderStyle={{ color: '#454F63' }}
                // startingDate={new Date()}
                // startingDate={global.memoriesSelectedDate != '' ? new Date(global.memoriesSelectedDate) : new Date()}
                selectedDate={
                  global.memoriesSelectedDate != ''
                    ? new Date(global.memoriesSelectedDate)
                    : new Date()
                }
                daySelectionAnimation={{
                  type: 'border',
                  borderWidth: 1,
                  borderRadius: 0,
                  borderHighlightColor: '#F2A413',
                  backgroundColor: '#F2A413',
                }}
                // minDate={new Date(moment().subtract(6, 'year').format('YYYY-MM-DD'))}
                // maxDate={new Date(moment().format('YYYY-MM-DD'))}
                onDateSelected={selectedDateFunction}
                highlightDateNumberStyle={{ color: '#F2A413' }}
                highlightDateNameStyle={{ color: '#F2A413' }}
              // calendarHeaderFormat={"dddd, DD MMMM  YYYY"}
              />
            </View>
          </Animated.View>
        </Animated.View>
        <View
          style={{
            backgroundColor: notransaction == false ? '#F2F2F2' : 'white',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: hp('100%'),
            paddingTop: 10,
            flex: 1,
            paddingBottom: hp('2.5%'),
          }}>
          <View style={styles.line}></View>
          <Grid>
            {notransaction == false ? (
              <FlatList
                data={data}
                scrollEnabled={isScrollEnable}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                renderItem={({ item, index }) => (
                  <View>
                    {item.type == 'S' || item.type == 'C' ? (
                      <View
                        // ref={viewRef}
                        ref={(view) => {
                          viewRef[index] = view;
                        }}
                        captureMode="mount"
                        style={{
                          borderLeftWidth: 1,
                          borderLeftColor: '#A7A8B0',
                          borderStyle: 'dashed',

                          marginLeft: hp('2.5%'),
                          marginBottom: 0,
                          marginRight: hp('1.5%'),
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            width: hp('2%'),
                            height: hp('2%'),
                            left: wp('-2'),
                            zIndex: 500,
                          }}>
                          <Image
                            style={{
                              maxWidth: '100%',
                              height: '100%',
                              zIndex: 500,
                            }}
                            source={require('./assets/smallEllipse.png')}
                          />
                        </View>
                        <Card containerStyle={styles.card} collapsable={false}>
                          <View
                            style={{ flexDirection: 'row', padding: hp('1%') }}>
                            <Text>
                              {moment(item.transactionTimestamp).format(
                                'hh:mm',
                              )}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginLeft: 'auto',
                              }}>
                              <TouchableOpacity
                                onPress={() => shareImage(index)}
                                style={{ width: hp('4%'), height: hp('4%') }}>
                                <Image
                                  style={{ maxWidth: '100%', height: '100%' }}
                                  source={require('./assets/share_icon.png')}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setIsModalVisible(true);
                                  setSelectedItem(item);
                                }}
                                style={{ width: hp('4%'), height: hp('4%') }}>
                                <Image
                                  style={{ maxWidth: '100%', height: '100%' }}
                                  source={require('./assets/more_icon.png')}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <TouchableOpacity
                            disabled={
                              item.typeOfTransaction == 'CR' ||
                              item.merchantIcon == null ||
                              item.merchantIcon == ''
                            }
                            onPress={() =>
                              histroyNavFunction('transaction', item)
                            }
                            style={{
                              flexDirection: 'row',
                              backgroundColor: '#EEEEEE',
                              padding: hp('1.5%'),
                            }}>
                            <View style={{ width: 40, height: 40 }}>
                              {item.merchantIcon != null &&
                                item.merchantIcon != '' ? (
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={{
                                      uri:
                                        global.baseURL +
                                        'customer/' +
                                        item.merchantIcon,
                                    }}></Image>
                                ) : (
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={{
                                      uri:
                                        global.baseURL + 'customer/' + item.icon,
                                    }}></Image>
                                )}
                            </View>
                            <View
                              style={{
                                justifyContent: 'center',
                                paddingLeft: hp('1%'),
                              }}>
                              {item.merchantName != null &&
                                item.merchantName != '' ? (
                                  <View style={{ justifyContent: 'center' }}>
                                    <Text style={{}}>{item.merchantName}</Text>
                                    {/* <View> */}
                                    {item.typeOfTransaction == 'DB' ? (
                                      <Text
                                        style={{ fontSize: 10, color: '#AAAAAA' }}>
                                        Expense
                                      </Text>
                                    ) : null}
                                    {item.category != 'Income' &&
                                      item.typeOfTransaction == 'CR' ? (
                                        <Text
                                          style={{ fontSize: 10, color: '#AAAAAA' }}>
                                          Income
                                        </Text>
                                      ) : null}
                                    {/* </View> */}
                                  </View>
                                ) : (
                                  <View style={{ justifyContent: 'center' }}>
                                    <Text style={{}}>{item.category}</Text>
                                    {item.category != 'Expense' &&
                                      item.typeOfTransaction == 'DB' ? (
                                        <Text
                                          style={{ fontSize: 10, color: '#AAAAAA' }}>
                                          Expense
                                        </Text>
                                      ) : null}
                                    {item.category != 'Income' &&
                                      item.typeOfTransaction == 'CR' ? (
                                        <Text
                                          style={{ fontSize: 10, color: '#AAAAAA' }}>
                                          Income
                                        </Text>
                                      ) : null}
                                  </View>
                                )}
                            </View>
                          </TouchableOpacity>
                          {item.longitude != null &&
                            item.longitude != '' &&
                            item.latitude != null &&
                            item.latitude != '' ? (
                              <View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    padding: hp('1.5%'),
                                    paddingLeft: 0,
                                  }}>
                                  <View
                                    style={{
                                      width: 20,
                                      height: 20,
                                      alignSelf: 'center',
                                    }}>
                                    <Image
                                      resizeMode={'contain'}
                                      style={{ maxWidth: '100%', height: '100%' }}
                                      source={require('./assets/locationmap.png')}
                                    />
                                  </View>
                                  <View style={{ justifyContent: 'center' }}>
                                    <Text
                                      style={{
                                        color: '#454F63',
                                        fontSize: 10,
                                        marginRight: hp('2%'),
                                      }}
                                      numberOfLines={1}>
                                      {item.mapDescription}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    width:
                                      item.locationImage != null &&
                                        item.locationImage != ''
                                        ? '50%'
                                        : '100%',
                                    // width: '100%',
                                    height: hp('25%'),
                                    flexDirection: 'row',
                                  }}>
                                  {item.locationImage != null &&
                                    item.locationImage != '' ? (
                                      <View
                                        style={{
                                          // padding: 2,
                                          // paddingBottom: 0
                                          height: '80%',
                                          width: '100%',
                                        }}>
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
                                              item.locationImage,
                                          }}
                                        />
                                      </View>
                                    ) : null}

                                  <TouchableOpacity
                                    onPress={() =>
                                      histroyNavFunction('location', item)
                                    }
                                    style={{
                                      height: '80%',
                                      width: '100%',
                                      overflow: 'hidden',
                                      padding: 2,
                                      paddingBottom: 0,
                                      zIndex: 10,
                                      borderBottomRightRadius: hp('4%'),
                                    }}>
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
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                      }}>
                                      <Marker
                                        coordinate={{
                                          latitude: item.latitude,
                                          longitude: item.longitude,
                                        }}
                                      />
                                    </MapView>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View></View>
                            )}
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingTop: hp('2%'),
                              paddingBottom: hp('3%'),
                            }}>
                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <View
                                  style={{
                                    width: 20,
                                    height: 20,
                                    alignSelf: 'center',
                                  }}>
                                  <Image
                                    resizeMode={'contain'}
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/clip_icon.png')}
                                  />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                  <Text
                                    style={{
                                      color: '#454F63',
                                      opacity: 0.7,
                                      fontSize: 10,
                                    }}>
                                    Attachments
                                  </Text>
                                </View>
                              </View>
                              {item.attachmentsList != null ? (
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() =>
                                    navigation.navigate('attachmentsPage', {
                                      reNavigateTo: 'memories',
                                      list: item.attachmentsList,
                                      transactionId: item.transactionId,
                                    })
                                  }>
                                  {item.attachmentsList.map((v, i) => (
                                    <View style={{ alignItems: 'center' }}>
                                      {i < 2 ? (
                                        <View style={styles.pictureDisplayView}>
                                          <Image
                                            resizeMode={'contain'}
                                            style={{
                                              maxWidth: '100%',
                                              height: '100%',
                                            }}
                                            source={{
                                              uri:
                                                global.baseURL +
                                                'customer/' +
                                                v,
                                            }}
                                          />
                                        </View>
                                      ) : (
                                          <View>
                                            {i == 2 ? (
                                              <View>
                                                {item.attachmentsList.length >
                                                  2 ? (
                                                    <View
                                                      style={
                                                        styles.picturesCntView
                                                      }>
                                                      <Text
                                                        style={
                                                          styles.linkedPeopleCntText
                                                        }>
                                                        +{' '}
                                                        {item.attachmentsList
                                                          .length - 2}
                                                      </Text>
                                                    </View>
                                                  ) : null}
                                              </View>
                                            ) : null}
                                          </View>
                                        )}
                                    </View>
                                  ))}
                                </TouchableOpacity>
                              ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setIsModalVisible(true);
                                      setSelectedItem(item);
                                    }}
                                    style={{
                                      justifyContent: 'center',
                                      paddingLeft: 11,
                                    }}>
                                    <Text
                                      style={{ color: '#AAAAAA', fontSize: 11 }}>
                                      Upload attachments here.
                                  </Text>
                                  </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ marginLeft: hp('3%') }}>
                              <View style={{ flexDirection: 'row' }}>
                                <View
                                  style={{
                                    width: 20,
                                    height: 20,
                                    alignSelf: 'center',
                                  }}>
                                  <Image
                                    resizeMode={'contain'}
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/link_icon1.png')}
                                  />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                  <Text
                                    style={{
                                      color: '#454F63',
                                      opacity: 0.7,
                                      fontSize: 10,
                                    }}>
                                    Links
                                  </Text>
                                </View>
                              </View>
                              {item.contactsAndBeneficiary != null &&
                                item.contactsAndBeneficiary.length != 0 ? (
                                  <TouchableOpacity
                                    style={{ flexDirection: 'row', flex: 1 }}
                                    onPress={() => contactsNavigation(item)}>
                                    {item.contactsAndBeneficiary.map((v, i) => (
                                      <View>
                                        {i < 2 ? (
                                          <View>
                                            {v.profilePicture != null ? (
                                              <View
                                                style={
                                                  1 != 0
                                                    ? styles.indexNotZero
                                                    : styles.indexZero
                                                }>
                                                <Image
                                                  resizeMode={'contain'}
                                                  style={{
                                                    maxWidth: '100%',
                                                    height: '100%',
                                                  }}
                                                  source={v.img}
                                                />
                                              </View>
                                            ) : (
                                                <View
                                                  style={
                                                    i != 0
                                                      ? styles.indexNotZeroProfileImgCss
                                                      : styles.indexZeroProfileImgCss
                                                  }>
                                                  <Text
                                                    style={{
                                                      textAlign: 'center',
                                                      color: 'white',
                                                    }}>
                                                    {v.name.charAt(0)}
                                                  </Text>
                                                </View>
                                              )}
                                          </View>
                                        ) : (
                                            <View>
                                              {i == 2 ? (
                                                <View>
                                                  <View
                                                    style={
                                                      styles.linkedPeopleCntView
                                                    }>
                                                    <Text
                                                      style={
                                                        styles.linkedPeopleCntText
                                                      }>
                                                      +{' '}
                                                      {item.contactsAndBeneficiary
                                                        .length - 2}
                                                    </Text>
                                                  </View>
                                                </View>
                                              ) : null}
                                            </View>
                                          )}
                                      </View>
                                    ))}
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setIsModalVisible(true);
                                      setSelectedItem(item);
                                    }}
                                    style={{
                                      justifyContent: 'center',
                                      paddingLeft: 11,
                                    }}>
                                    <Text
                                      style={{ color: '#AAAAAA', fontSize: 11 }}>
                                      Tag Your Friends here.
                                  </Text>
                                  </TouchableOpacity>
                                )}
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => histroyNavFunction('bank', item)}
                            style={{
                              flexDirection: 'row',
                              backgroundColor: '#EDEFF2',
                              padding: hp('2%'),
                              marginTop: hp('1.5%'),
                              marginBottom: hp('1.5%'),
                            }}>
                            {/* <View style={{width: 40, height: 40}}>
                              <Image
                                style={{maxWidth: '100%', height: '100%'}}
                                source={require('./assets/bank13x.png')}></Image>
                            </View> */}
                            <View style={{ width: 40, height: 40 }}>
                              {item.bankIcon != null && item.bankIcon != '' ? (
                                <Image
                                  style={{ maxWidth: '100%', height: '100%' }}
                                  source={{ uri: item.bankIcon }}></Image>
                              ) : (
                                  <Image
                                    style={{ maxWidth: '100%', height: '100%' }}
                                    source={require('./assets/bank13x.png')}></Image>
                                )}
                            </View>
                            <View
                              style={{
                                justifyContent: 'center',
                                paddingLeft: hp('1%'),
                              }}>
                              <View style={{ opacity: 1, flexDirection: 'row' }}>
                                <Text
                                  style={{
                                    color: '#454F63',
                                    fontSize: 12,
                                    marginRight: 3,
                                    marginTop: 3,
                                  }}>
                                  {item.transactionCurrency}
                                </Text>
                                <AmountDisplay
                                  style={{
                                    color: '#454F63',
                                    fontSize: 18,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                  }}
                                  amount={Number(item.amount)}
                                  currency={item.transactionCurrency}
                                />
                                {/* <NumberFormat
                                  value={item.amount}
                                  displayType={'text'}
                                  thousandsGroupStyle={
                                    global.thousandsGroupStyle
                                  }
                                  thousandSeparator={global.thousandSeparator}
                                  decimalScale={global.decimalScale}
                                  fixedDecimalScale={true}
                                  // prefix={'₹'}
                                  renderText={(value) => (
                                    <Text
                                      style={{
                                        color: '#454F63',
                                        fontSize: 18,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                      }}>
                                      {value}
                                    </Text>
                                  )}
                                /> */}
                              </View>
                              <Text
                                style={{
                                  color: '#454F63',
                                  fontSize: 11,
                                  width: wp('60%'),
                                }}>
                                {item.description}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={{ flexDirection: 'row' }}>
                            {item.category != 'Expense' &&
                              item.category != 'Income' ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    margin: 9,
                                    marginRight: 0,
                                    borderWidth: 0,
                                    backgroundColor: '#63CDD6',
                                    borderRadius: 25,
                                  }}>
                                  <View
                                    style={{
                                      width: 30,
                                      height: 30,
                                      justifyContent: 'center',
                                      alignSelf: 'center',
                                    }}>
                                    <Image
                                      resizeMode={'contain'}
                                      style={{ maxWidth: '100%', height: '100%' }}
                                      source={{
                                        uri:
                                          global.baseURL +
                                          'customer/' +
                                          item.icon,
                                      }}></Image>
                                  </View>
                                  <View style={{ justifyContent: 'center' }}>
                                    <Text
                                      style={{
                                        paddingLeft: hp('1%'),
                                        paddingRight: hp('1.5%'),
                                        color: 'white',
                                      }}>
                                      {item.category}
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                            <TouchableOpacity
                              onPress={() => dataSelected('categorize', item)}
                              style={{
                                width: 40,
                                height: 40,
                                margin: 10,
                                zIndex: 100,
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{ maxWidth: '100%', height: '100%' }}
                                source={require('./assets/Categorize_icon.png')}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => dataSelected('split', item)}
                              style={{
                                margin: 10,
                                marginLeft: 0,
                                width: 40,
                                height: 40,
                              }}>
                              <Image
                                resizeMode={'contain'}
                                style={{ maxWidth: '100%', height: '100%' }}
                                source={require('./assets/Spllit_icon.png')}></Image>
                            </TouchableOpacity>
                          </View>
                        </Card>
                      </View>
                    ) : (
                        <View></View>
                      )}
                  </View>
                )}></FlatList>
            ) : (
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '50%' }}
                    source={require('./assets/noMemoriesImg.png')}
                  />
                  <View style={{ padding: hp('2.5%') }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#454F63',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}>
                      No Memories
                  </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#454F63',
                        fontSize: 11,
                        opacity: 0.7,
                      }}>
                      We will build your memories as you keep transacting with us!
                      Check back here later !
                  </Text>
                  </View>
                </View>
              )}
          </Grid>
        </View>
      </Animated.View>
      <Modal
        isVisible={isModalVisible}
        style={styles.view}
        swipeDirection={'up'}>
        <Text
          style={{
            color: '#454F63',
            fontSize: 18,
            padding: hp('2%'),
            paddingBottom: 0,
          }}>
          More Options
        </Text>
        <Text
          style={{
            color: '#454F63',
            fontSize: 11,
            opacity: 0.7,
            padding: hp('2%'),
            paddingTop: 0,
          }}>
          Add Locations,Photos,Peoples to the Transactions
        </Text>
        <Grid style={{ paddingTop: hp('3%') }}>
          <Row>
            <Col size={4}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.navigate('saveMaps', {
                    reNavigateTo: 'memories',
                    transactionId: selectedItem.transactionId,
                  });
                }}
                style={{ alignSelf: 'center' }}>
                <View
                  style={{
                    width: wp('15%'),
                    height: hp('10%'),
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/Add_Location.png')}></Image>
                </View>
                <Text style={{ color: '#5D707D', fontSize: 14 }}>
                  Add Location
                </Text>
              </TouchableOpacity>
            </Col>
            <Col size={4}>
              <TouchableOpacity
                onPress={() => uploadImage()}
                style={{ alignSelf: 'center' }}>
                <View
                  style={{
                    width: wp('15%'),
                    height: hp('10%'),
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/Add_Photo.png')}></Image>
                </View>
                <Text style={{ color: '#5D707D', fontSize: 14 }}>Add Photos</Text>
              </TouchableOpacity>
            </Col>
            <Col size={4}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.navigate('addPeople', {
                    reNavigateTo: 'memories',
                    transactionId: selectedItem.transactionId,
                    list: selectedItem.contacts,
                  });
                }}
                style={{ alignSelf: 'center' }}>
                <View
                  style={{
                    width: wp('15%'),
                    height: hp('10%'),
                    alignSelf: 'center',
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={require('./assets/Add_Peoples.png')}></Image>
                </View>
                <Text style={{ color: '#5D707D', fontSize: 14 }}>Add People</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(false);
            setSelectedItem();
          }}
          style={{
            padding: hp('2%'),
            backgroundColor: '#DFE4FB',
            borderRadius: hp('2%'),
          }}>
          <Text style={{ color: '#5E83F2', fontSize: 14, textAlign: 'center' }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
}

export default MemoriesPage;

const styles = StyleSheet.create({
  header: {
    padding: hp('2.5%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
    flexDirection: 'row',
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
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
    height: hp('20%'),

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  layer3: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: hp('100%'),
    // paddingBottom: hp('2.5%')
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
  line: {
    padding: 2,
    width: hp('6.5%'),
    borderWidth: 0,
    backgroundColor: '#DDDDDD',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: hp('3%'),
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    paddingLeft: hp('3%'),
  },
  card: {
    padding: hp('1.7%'),
    elevation: 1.5,
    shadowOffset: { width: 0, height: hp('0.1%') },
    shadowColor: '#00000029',
    shadowOpacity: 1,
    borderRadius: 5,
    marginTop: hp('0%'),
    marginBottom: hp('2%'),
  },
  picturesCntView: {
    width: 45,
    height: 45,
    // width: hp('6.8%'),
    // height: hp('6.8%'),
    backgroundColor: '#5E83F2',
    // borderRadius: hp('50%'),
    marginLeft: hp('-1.5%'),
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  pictureDisplayView: {
    width: 45,
    height: 45,
    // width: hp('6.8%'),
    // height: hp('6.8%'),
    padding: hp('0.2%'),
  },
  linkedPeopleCntText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkedPeopleCntView: {
    width: 45,
    height: 45,
    backgroundColor: '#5E83F2',
    borderRadius: hp('50%'),
    marginLeft: hp('-1.5%'),
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  indexNotZero: {
    marginLeft: hp('-1.5%'),
    width: 45,
    height: 45,
  },
  indexZero: {
    width: 45,
    height: 45,
  },
  indexNotZeroProfileImgCss: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    borderRadius: 50,
    // marginRight: 15,
    marginLeft: hp('-1.5%'),
    backgroundColor: '#F2A413',
    borderWidth: 1,
    borderColor: 'white',
  },
  indexZeroProfileImgCss: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    borderRadius: 50,
    // marginRight: 15,
    backgroundColor: '#F2A413',

    borderWidth: 1,
    borderColor: 'white',
  },
  view: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    marginTop: hp('53%'),
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    borderTopEndRadius: hp('2%'),
    borderTopStartRadius: hp('2%'),
    padding: hp('2%'),
  },
});
