import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import Aggregatorselect from './aggregatorselect';
import Upshot from 'react-native-upshotsdk';
import NumberFormat from 'react-number-format';
import Spinner from 'react-native-loading-spinner-overlay';
import CalendarStrip from 'react-native-calendar-strip';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AmountDisplay from './AmountDisplay';

export default function LandingScreen({navigation}) {
  let ls = require('react-native-local-storage');
  const [user, setUser] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [amount, setAmount] = useState();

  useEffect(() => {
    Upshot.addListener('UpshotActivityDidAppear', handleActivityDidAppear);

    Upshot.addListener('UpshotActivityDidDismiss', handleActivityDidDismiss);

    Upshot.addListener('UpshotDeepLink', handleDeeplink);
    const unsubscribe = navigation.addListener('focus', () => {
      ls.save('selectedDrawerItem', '');
      console.log(global.thousandsGroupStyle);
      getDecimalFormat();
    });
    return unsubscribe;
  }, [navigation]);
  const handleActivityDidAppear = (response) => {
    console.log('activity did appear');
    console.log(response);
  };

  const handleActivityDidDismiss = (response) => {
    console.log('activity dismiss');
    //if activity==7
    if (response.activityType == 7) {
      Upshot.showActivityWithType(-1, 'Home Survey');
    }
    console.log(response);
  };
  const handleDeeplink = (response) => {
    console.log('deeplink available');
    console.log(response);
    if (response.deepLink == 'BADGE') {
      navigation.navigate('myBadges');
      console.log('deeplink to badge found');
    } else if (response.deepLink == 'BUDGET') {
      navigation.navigate('budgetPage');
      console.log('deeplink to budget found');
    } else if (response.deepLink == 'GOAL') {
      console.log('deeplink to goal found');
      navigation.navigate('goalsPage');
    }
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
        console.log('decimalScale : ' + global.decimalScale);
        getResponse();
        // navigation.navigate("successPage", { type: "editProfilePage" });
        // global.thousandsGroupStyle = responseJson.data.value.thousandsGroupStyle
        // global.decimalScale = responseJson.data.value.decimalScale
        // console.log('thousandSeparator : ' + global.thousandSeparator)
        // console.log('thousandsGroupStyle : ' + global.thousandsGroupStyle)
        // console.log('decimalScale : ' + global.decimalScale)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getResponse = () => {
    if (global.loginID != undefined && global.loginID != '') {
      return fetch(
        global.baseURL + 'customer/' + global.loginID + '/assets/host',
      )
        .then((response) => response.json())
        .then((responseJson) => {
          // return responseJson.movies;

          console.log(responseJson.data);
          if (responseJson.data != null) {
            global.userName = responseJson.data.userName;
            global.userImage = responseJson.data.userImage;
            setUser(responseJson.data);
          }
          setSpinner(false);
          // AsyncStorage.setItem('userDetails', responseJson.data);

          const payload = {
            appuID: global.loginID,
          };
          // // if (global.loginID == "250002") {
          // console.log('FCM TOKEN DASHBOARD: ' + global.fcmtoken);
          // Upshot.createCustomEvent(
          //   'AppVisit',
          //   JSON.stringify(payload),
          //   false,
          //   function (eventId) {
          //     console.log('Event app visit' + eventId);
          //   },
          // );
          // Upshot.showActivityWithType(-1, 'Home');
          // // } // Home
        })
        .catch((error) => {
          setSpinner(false);
          console.error(error);
        });
    }
  };
  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Spinner
          visible={spinner}
          overlayColor="rgba(0, 0, 0, 0.65)	"
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        {/* <Text style={styles.title}>Personal Finance Management</Text> */}

        <Image
          style={styles.image}
          source={require('./assets/landing_bg.png')}></Image>
        <View style={{position: 'absolute', zIndex: 1, paddingTop: hp('4%')}}>
          {/* <Image
            style={styles.user}
            source={require("./assets/user.png")}
          ></Image> */}

          <View style={{width: 50, height: 50}}>
            {user.userImage != null && user.userImage != '' ? (
              <Image
                resizeMode={'cover'}
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  borderRadius: hp('1%'),
                }}
                source={{
                  uri: global.baseURL + 'customer/' + user.userImage,
                }}></Image>
            ) : (
              <Image
                resizeMode={'cover'}
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  borderRadius: hp('1%'),
                }}
                source={require('./assets/avatar-icon.png')}
              />
            )}
          </View>
          <Text style={styles.welcome}>Good Morning,</Text>
          <Text style={styles.name}>{user.userName}</Text>
        </View>
        <View style={{paddingRight: 30, marginTop: wp('-28%')}}>
          {/* <View> */}
          <View>
            {/* <View
                style={{
                  flex: 1,
                  flexDirection: "row"
                }}
              > */}

            {/* </View> */}
            <View
              style={{
                flex: 1,
                paddingTop: hp('2.2%'),
                paddingRight: hp('1%'),
                paddingLeft: hp('1%'),
                zIndex: 5,
              }}>
              {/* <View> */}
              <View
                style={{
                  width: wp('15%'),
                  height: hp('10%'),
                  marginTop: hp('-7%'),
                  // alignItems: 'center'
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginBottom: 8,
                }}>
                <Image
                  resizeMode={'contain'}
                  style={styles.demobank}
                  source={{uri: user.bankLogo}}></Image>
              </View>

              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  height: hp('2.1%'),
                  textAlign: 'center',
                }}>
                Assets with our Bank
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: 100,
                  alignSelf: 'center',
                }}>
                {user.userPreferredCurrency != null ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 'bold',
                      marginTop: 4,
                      marginRight: 3,
                    }}>
                    {user.userPreferredCurrency}
                  </Text>
                ) : null}
                {/* <NumberFormat
                  value={user.userPreferredCurrencyAmount}
                  displayType={'text'}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  renderText={(value) => (
                    <Text style={{fontSize: 22, color: 'white'}}>{value}</Text>
                  )} 
                /> */}
                <AmountDisplay
                  amount={Number(user.userPreferredCurrencyAmount)}
                  currency={user.userPreferredCurrency}
                />
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#F2A413',
                padding: wp('14%'),
                position: 'absolute',
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: hp('1%'),
              }}></View>
          </View>
          {/* </View> */}
          <View style={{marginTop: -25}}>
            <Text style={styles.desctitle}>Hurray !!</Text>
            <Text style={styles.desc}>
              Now you can add other Bank assets and get a complete view of your
              finances across all your financial institution.
            </Text>
            <Text style={styles.desc}>
              To add other Bank assets You can use your existing Aggregator ID
              or choose from our list of approved Account Aggregators.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('aggregator')}>
              <Text
                style={{width: '100%', textAlign: 'center', color: 'white'}}>
                Add Other Bank Assets
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonskip}
              onPress={() => navigation.navigate('dashboard')}>
              <Text
                style={{width: '100%', textAlign: 'center', color: '#5E83F2'}}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.card}>
          <Image
            style={styles.user}
            source={require("./assets/user.png")}
          ></Image>
          <Text style={styles.welcome}>Good Morning,</Text>
          <Text style={styles.name}>{user.userName}</Text>
          <View style={{ flexDirection: "column", height: 100 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row"
              }}
            >
              <View style={{
                marginRight: 10, width: hp("12%"),
                height: hp("12%")
              }}>
                <Image
                  resizeMode={'contain'}
                  style={styles.demobank}
                  source={{ uri: user.bankLogo }}
                ></Image>
              </View>
              <View>
                <Text style={styles.label}>Assets with our bank</Text>
                <NumberFormat
                  value={Number(user.totalAssetvalue)}
                  thousandsGroupStyle={global.thousandsGroupStyle}
                  thousandSeparator={global.thousandSeparator}
                  decimalScale={global.decimalScale}
                  fixedDecimalScale={true}
                  displayType={'text'}
                  prefix={'₹'}
                  renderText={value => <Text style={styles.subtitle}>{value}</Text>}
                />

              </View>
            </View>
          </View>
          <Text style={styles.desctitle}>Hurray !!</Text>
          <Text style={styles.desc}>
            Now you can add other Bank assets and get a complete view of your
            finances across all your financial institution.
        </Text>
          <Text style={styles.desc}>
            To add other Bank assets You can use your existing Aggregator ID or
            choose from our list of approved Account Aggregators.
        </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("aggregator")}
          >
            <Text
              style={{ width: "100%", textAlign: "center", color: "white" }}
            >
              Add Other Bank Assets
          </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonskip} onPress={() => navigation.navigate('dashboard')}>
            <Text
              style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
            >
              Skip
          </Text>
          </TouchableOpacity>
        </View>
     */}
      </View>
    </ScrollView>

    // <ScrollView>
    //   <View style={styles.container}>
    //     <Spinner
    //       visible={spinner}
    //       overlayColor='rgba(0, 0, 0, 0.65)	'
    //       textContent={'Loading...'}
    //       textStyle={styles.spinnerTextStyle}
    //     />
    //     <Text style={styles.title}>Personal Finance Management</Text>
    //     <Image
    //       style={styles.image}
    //       source={require("./assets/landing_bg(transparentBg).png")}
    //     ></Image>
    //     <View style={styles.card}>
    //       <Image
    //         style={styles.user}
    //         source={require("./assets/user.png")}
    //       ></Image>
    //       <Text style={styles.welcome}>Good Morning,</Text>
    //       <Text style={styles.name}>{user.userName}</Text>
    //       <View style={{ flexDirection: "column", height: 100 }}>
    //         <View
    //           style={{
    //             flex: 1,
    //             flexDirection: "row"
    //           }}
    //         >
    //           <View style={{
    //             marginRight: 10, width: hp("12%"),
    //             height: hp("12%")
    //           }}>
    //             <Image
    //               resizeMode={'contain'}
    //               style={styles.demobank}
    //               source={{ uri: user.bankLogo }}
    //             ></Image>
    //           </View>
    //           <View>
    //             <Text style={styles.label}>Assets with our bank</Text>
    //             <NumberFormat
    //               value={Number(user.totalAssetvalue)}
    //               thousandsGroupStyle={global.thousandsGroupStyle}
    //               thousandSeparator={global.thousandSeparator}
    //               decimalScale={global.decimalScale}
    //               fixedDecimalScale={true}
    //               displayType={'text'}
    //               prefix={'₹'}
    //               renderText={value => <Text style={styles.subtitle}>{value}</Text>}
    //             />

    //           </View>
    //         </View>
    //       </View>
    //       <Text style={styles.desctitle}>Hurray !!</Text>
    //       <Text style={styles.desc}>
    //         Now you can add other Bank assets and get a complete view of your
    //         finances across all your financial institution.
    //       </Text>
    //       <Text style={styles.desc}>
    //         To add other Bank assets You can use your existing Aggregator ID or
    //         choose from our list of approved Account Aggregators.
    //       </Text>
    //       <TouchableOpacity
    //         style={styles.button}
    //         onPress={() => navigation.navigate("aggregator")}
    //       >
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "white" }}
    //         >
    //           Add Other Bank Assets
    //         </Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity style={styles.buttonskip} onPress={() => navigation.navigate('dashboard')}>
    //         <Text
    //           style={{ width: "100%", textAlign: "center", color: "#5E83F2" }}
    //         >
    //           Skip
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 22,
    marginLeft: 30,
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    padding: 20,
    width: '80%',
    fontSize: 25,
    color: '#454F63',
    fontWeight: 'bold',
  },
  image: {
    // marginLeft: "auto",
    marginTop: wp('-18%'),
    width: '100%',
    height: wp('100%'),
    // position: 'absolute'
  },
  demobank: {
    // width: 70,
    // height: 70
    maxWidth: '100%',
    height: '100%',
  },
  user: {
    width: 100,
    height: 100,
    // marginTop: -50
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    width: '90%',
    height: '100%',
    marginTop: -110,
    padding: 30,
  },
  welcome: {
    color: '#454F63',
    fontSize: 16,
    fontWeight: 'bold',
  },
  name: {
    color: '#454F63',
    fontSize: 16,
    marginBottom: 15,
  },
  label: {color: '#454F63', fontSize: 12, marginTop: hp('1%')},
  subtitle: {
    color: '#454F63',
    fontSize: 25,
    fontWeight: '500',
  },
  desctitle: {
    color: '#888888',
    fontSize: 16,
    paddingBottom: 20,
  },
  desc: {
    color: '#888888',
    fontSize: 14,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#5E83F2',
    // borderRadius: 20,
    borderRadius: hp('2%'),
    padding: 15,
    textAlign: 'center',
  },
  buttonskip: {
    backgroundColor: '#DFE4FB',
    borderRadius: hp('2%'),
    padding: 15,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
