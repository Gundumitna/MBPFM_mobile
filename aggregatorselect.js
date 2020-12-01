import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  Platform,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  AsyncStorage,
  Alert,
} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Aggregatorselect({navigation}) {
  const [aggregator, setAggregator] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [register, setRegister] = useState();
  const [consentStatus, setConsentStatus] = useState(false);
  const [aggregatorId, setAggregatorId] = useState('');
  const [userId, setUserId] = useState('');
  let ls = require('react-native-local-storage');
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ls.save('selectedDrawerItem', '');
      setRegister();
      // console.log('filterData : ' + filterData)
      // let f = JSON.parse(AsyncStorage.getItem('filterData'))
      // console.log('f : ' + filterData)
      getAggregatorList();
    });
    return unsubscribe;
  }, [navigation]);
  getAggregatorList = () => {
    return fetch(global.baseURL + 'aggregators/active')
      .then((response) => response.json())
      .then((responseJson) => {
        // return responseJson.movies;
        setAggregator(responseJson.data);
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  submitFunction = () => {
    console.log('aggregatorId : ' + aggregatorId.trim());
    // if (userId != '' || aggregatorId != '') {
    if (aggregatorId != '') {
      // if (userId != '') {
      setSpinner(true);
      console.log('aggregatorId : ' + aggregatorId);
      // console.log('userId : ' + userId)
      fetch(
        global.baseURL +
          'consent/send/consent/' +
          aggregatorId.trim() +
          '/' +
          global.loginID,
        {
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
          if (responseJson.message == 'REQUESTED') {
            setConsentStatus(true);
          }
          setSpinner(false);
        })
        .catch(() => {
          console.log(error);
          Alert.alert('Error', error.message);
          setSpinner(false);
        });
    } else {
      Alert.alert('', 'Please enter aggregator Id');
    }

    setSpinner(false);
  };
  backButton = () => {
    console.log('backbutton clicked');
    setConsentStatus(false);
    setRegister(false);
  };
  if (consentStatus) {
    return (
      // <ScrollView>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.backIcon} onPress={() => backButton()}>
          <View>
            <Image source={require('./assets/icons-back.png')}></Image>
          </View>
        </TouchableOpacity>
        <WebView
          style={{flex: 1}}
          scrollEnabled={true}
          source={{uri: 'https://finvu.in/webview/onboarding/webview-login'}}
          startInLoadingState={true}
          // javaScriptEnabled={true}
          // domStorageEnabled={true}
          style={{flex: 1, marginTop: 15}}
          onNavigationStateChange={(e) => {
            console.log('current state is ', JSON.stringify(e, null, 2));
            ls.save('consentStatus', 'true');
            if (
              e.url ==
              'https://finvu.in/webview/onboarding/consent-confirmation'
            ) {
              console.log('consent completed');
              //consentStatus = false;
              Alert.alert(
                'Success',
                'Your consent has been sent to Clayfin Finance for data request. You are logged out of application. For any pending consent request please re-login',
              );

              setConsentStatus(false);
              navigation.navigate('dashboard');
            }
          }}
        />
      </View>

      // {/* </ScrollView> */ }
    );
  } else if (register) {
    return (
      // <ScrollView>
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.backIcon} onPress={() => backButton()}>
          <View>
            <Image source={require('./assets/icons-back.png')}></Image>
          </View>
        </TouchableOpacity>
        <WebView
          style={{flex: 1}}
          scrollEnabled={true}
          source={{
            uri: 'https://finvu.in/webview/onboarding/webview-register',
          }}
          startInLoadingState={true}
          // javaScriptEnabled={true}
          // domStorageEnabled={true}
          style={{flex: 1, marginTop: 15}}
          onNavigationStateChange={(e) => {
            console.log('current state is ', JSON.stringify(e, null, 2));
            // ls.save('consentStatus', 'true')
          }}
        />
      </View>
      // {/* </ScrollView> */ }
    );
  } else {
    return (
      <KeyboardAwareScrollView
        // behavior={Platform.select({android: 'height', ios: 'padding'})}
        // behavior={Platform.OS == "ios" ? "padding" : "height"}
        // behavior='padding'
        // keyboardVerticalOffset={-64}
        style={styles.container}>
        <Spinner
          visible={spinner}
          overlayColor="rgba(0, 0, 0, 0.65)	"
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.navigate('landingPage')}>
            <Image source={require('./assets/icons-back.png')}></Image>
          </TouchableOpacity>
          <Text style={styles.contentHeader}>Select Aggregator</Text>
          <Text style={styles.contentText}>
            Create new Aggregator ID with any one below{' '}
          </Text>
          <Text style={[styles.contentText, {paddingTop: 0}]}>
            (All entities are approved by regulators)
          </Text>
          <FlatList
            data={aggregator}
            style={{paddingTop: hp('4%')}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                disabled={item.aggregatorName != 'Finvu'}
                style={{flex: 0.5, paddingBottom: 10}}
                onPress={() => setRegister(item)}>
                {/* <View style={{ flex: 0.5, paddingBottom: 10 }}> */}
                <Col size={6}>
                  <View style={styles.card}>
                    <View style={styles.imgView}>
                      <Image
                        resizeMode={'center'}
                        style={{
                          maxWidth: '100%',
                          height: hp('6.5%'),
                        }}
                        source={{uri: item.logo}}></Image>
                    </View>
                    <View style={styles.cardBtn}>
                      <Text style={{color: '#5E83F2'}}>
                        {item.aggregatorName}
                      </Text>
                    </View>
                  </View>
                </Col>
                {/* </View> */}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.aggregatorId}
            numColumns={2}></FlatList>
        </View>

        <View style={styles.footer}>
          <Grid
            style={{
              width: '140%',
              top: hp('-3.5%'),
              marginLeft: hp('-5%'),
              // borderRadius: hp("6%"),
              // borderTopRightRadius: hp('5%')
            }}>
            <Row>
              <Col size={9}>
                <View
                  style={{
                    width: '100%',
                    height: 8,
                    backgroundColor: '#5E83F2',
                  }}></View>
              </Col>
              <Col size={3}>
                <View
                  style={{
                    width: '100%',
                    height: 8,
                    backgroundColor: '#F2A413',
                  }}></View>
              </Col>
            </Row>
          </Grid>
          <View>
            <Text style={styles.footerText}>Already have Aggregator ID?</Text>
            <TextInput
              style={styles.footerInput}
              placeholder="Enter Aggregator ID"
              placeholderTextColor="white"
              underlineColorAndroid="white"
              onChange={(amount) =>
                setAggregatorId(amount.nativeEvent.text)
              }></TextInput>
          </View>
          {/* <View>
            <TextInput style={styles.footerInput}
              placeholder="Enter PFM User ID"
              underlineColorAndroid="white"
              onChange={(userId) => setUserId(userId.nativeEvent.text)}
            ></TextInput>
          </View> */}
          <TouchableOpacity onPress={() => submitFunction()}>
            <Text style={styles.footerBotton}>Submit</Text>
          </TouchableOpacity>
          <View style={styles.line} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Roboto',
    // borderLeftColor: "#2A2E43",
    // borderLeftWidth: wp('3%'),
    backgroundColor: 'white',
  },
  content: {
    padding: hp('2.5%'),
    // paddingLeft: hp("1%")
  },
  contentHeader: {
    color: '#454F63',
    fontSize: 25,
    padding: hp('0.5%'),
    paddingLeft: hp('1.5%'),
    fontWeight: 'bold',
  },
  contentText: {
    color: '#888888',
    fontSize: 14,
    paddingLeft: hp('1.8%'),
    paddingRight: hp('1.8%'),
    paddingTop: hp('0.5%'),
    paddingBottom: hp('0.2%'),
  },
  image: {
    marginLeft: 'auto',
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  footer: {
    paddingLeft: hp('5%'),
    paddingTop: hp('2.5%'),
    paddingRight: hp('5%'),
    paddingBottom: hp('3.5%'),
    backgroundColor: '#2A2E43',
    marginTop: hp('30%'),
    // borderTopWidth: 5,
    // borderTopColor: '#5E83F2',
    // borderTopRightRadius: hp("6%"),
    // position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerText: {
    padding: hp('0.5%'),
    color: '#ffffff',
    fontSize: hp('2.7%'),
  },
  footerInput: {
    padding: hp('0.7%'),
    paddingBottom: hp('1.8%'),
    color: 'white',
  },
  footerBotton: {
    padding: hp('1.7%'),
    fontSize: hp('2.4%'),
    fontFamily: 'Roboto',
    textAlign: 'center',
    backgroundColor: '#5E83F2',
    borderRadius: hp('1.3%'),
    marginTop: hp('1%'),
    color: 'white',
  },
  cardBtn: {
    borderBottomLeftRadius: hp('1.5%'),
    borderBottomRightRadius: hp('1.5%'),
    backgroundColor: '#DFE4FB',
    color: '#5E83F2',
    padding: hp('1.35%'),
    alignItems: 'center',
  },
  imgView: {
    padding: 25,
    width: '100%',
  },
  card: {
    marginLeft: hp('2.5%'),
    marginRight: hp('2.5%'),
    paddingLeft: 0,
    paddingRight: 0,
    elevation: hp('0.2%'),
    shadowOffset: {width: 0, height: 1},
    shadowColor: '#00000029',
    shadowOpacity: 1,
    borderRadius: hp('1.2%'),
  },
  backIcon: {
    paddingTop: hp('1%'),
    paddingLeft: hp('1%'),
  },
  line: {
    padding: 1.8,
    width: hp('16%'),
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: hp('3%'),
    marginBottom: hp('-1%'),
    opacity: 0.2,
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
