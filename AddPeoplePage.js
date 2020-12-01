import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Grid, Row, Col} from 'react-native-easy-grid';
import NumberFormat from 'react-number-format';
import {FlatList} from 'react-native-gesture-handler';
// import Moment from 'moment'
// import ToggleSwitch from 'toggle-switch-react-native'
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from './redux/actions';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import Spinner from 'react-native-loading-spinner-overlay';
// import ProgressBar from 'react-native-progress/Bar';
import Contacts from 'react-native-contacts';
const AddPeoplePage = ({route, navigation}) => {
  let ls = require('react-native-local-storage');
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [heading, setHeading] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [searchText, setSearchText] = useState(false);
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const [phoneBookList, setPhoneBookList] = useState([]);
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getContacts();
      getBeneficiaryData();
      setActiveTab('phoneBook');
      console.log(route.params.list);
    });
    return unsubscribe;
  }, [navigation]);
  getContacts = () => {
    setSpinner(true);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(() => {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
          // error

          setSpinner(false);
        } else {
          // contacts returned in Array

          let list = [];
          let c = 0;
          for (let c of contacts) {
            if (c.phoneNumbers[0] != undefined) {
              let l = {};
              // l.name = c.displayName
              l.name = c.givenName;
              l.profilePicture = null;

              let pn = [];
              pn = c.phoneNumbers[0];
              // console.log(c.phoneNumbers[0])
              l.phoneNumber = pn.number;
              l.active = false;
              list.push(l);
              // } else {
              //     c = c + 1
            }
          }
          console.log(list);
          if (route.params.list != null && route.params.list.length != 0) {
            let oldList = [...route.params.list];

            for (let l of list) {
              let c = 0;

              for (let rl of oldList) {
                if (rl.type == 'contacts') {
                  if (l.phoneNumber == rl.number) {
                    l.active = true;
                    rl.matched = true;
                  }
                }
              }
            }
            for (let r of oldList) {
              if (r.type == 'contacts') {
                if (r.matched == undefined) {
                  r.active = true;
                  r.phoneNumber = r.number;

                  list.push(r);
                }
              }
            }
            console.log(oldList);
            // return
          }
          setPhoneBookList(list);
          setDisplayList(list);
          setSpinner(false);
          // return
        }
      });
    });
  };
  getBeneficiaryData = () => {
    fetch(global.baseURL + 'customer/get/beneficiary/data/' + global.loginID)
      .then((response) => response.json())
      .then((responseJson) => {
        // // return responseJson.movies;
        // if (responseJson.data == null) {
        //     setNotransaction(true)
        // } else {
        //     setNotransaction(false)
        // }
        let oldList = [...route.params.list];
        // setBeneficiaryList(responseJson.data);
        let list = [];

        for (let b of responseJson.data) {
          let l = {};
          // l.name = c.displayName
          l.id = b.id;
          l.beneficiaryName = b.beneficiaryName;

          l.beneficiaryAccountNumber = b.beneficiaryAccountNumber;
          l.active = false;
          for (let rl of oldList) {
            if (rl.type == 'beneficiary') {
              if (l.beneficiaryAccountNumber == rl.number) {
                l.active = true;
                // l.beneficiaryAccountNumber = rl.number
                // l.beneficiaryName = rl.name
                rl.matched = true;
              }
            }
          }
          list.push(l);
        }

        // for (let r of oldList) {
        //     if (r.type == 'beneficiary') {
        //         if (r.matched == undefined) {
        //             r.active = true
        //             r.beneficiaryAccountNumber = r.number
        //             r.beneficiaryName = r.name

        //             list.push(r)
        //         }
        //     }
        // }

        console.log(list);

        setBeneficiaryList(list);
        setDisplayList(list);
        setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
        setSpinner(false);
      });
  };
  selectedTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
    if (tab == 'phoneBook') {
      setDisplayList(phoneBookList);
    } else {
      setDisplayList(beneficiaryList);
    }
    setFlag(true);

    // getFincastData(activeExIncomeTab, tab)
  };
  useEffect(() => {
    console.log('rendered');
    return () => {
      setFlag(false);
    };
  }, [flag]);
  searchTextFunction = (event) => {
    console.log(event.nativeEvent.text);
    setSpinner(true);
    if (activeTab == 'phoneBook') {
      let textInLowerCase = event.nativeEvent.text.toLowerCase();
      let list = [...phoneBookList];
      let listToPush = [];
      if (event.nativeEvent.text != '') {
        for (let li of list) {
          // let name = '';
          // let number = 0;
          let name = li.name.toLowerCase();
          let number = li.phoneNumber;
          if (
            name.indexOf(textInLowerCase) > -1 ||
            number.indexOf(textInLowerCase) > -1
          ) {
            console.log('matched');
            listToPush.push(li);
          }
        }
        setDisplayList(listToPush);
        setFlag(true);
        setSpinner(false);
      } else {
        setDisplayList(list);
        setFlag(true);
        setSpinner(false);
      }
    } else {
      let textInLowerCase = event.nativeEvent.text.toLowerCase();
      let list = [...beneficiaryList];
      let listToPush = [];
      if (event.nativeEvent.text != '') {
        for (let li of list) {
          let name = '';
          let number = '0';
          if (
            li.beneficiaryName != null &&
            li.beneficiaryName != undefined &&
            li.beneficiaryName != ''
          ) {
            name = li.beneficiaryName.toLowerCase();
          }
          if (
            li.beneficiaryAccountNumber != null &&
            li.beneficiaryAccountNumber != undefined &&
            li.beneficiaryAccountNumber != ''
          ) {
            number = li.beneficiaryAccountNumber;
          }
          if (
            name.indexOf(textInLowerCase) > -1 ||
            number.indexOf(textInLowerCase) > -1
          ) {
            console.log('matched');
            listToPush.push(li);
          }
        }
        setDisplayList(listToPush);
        setFlag(true);
        setSpinner(false);
      } else {
        setDisplayList(list);
        setFlag(true);
        setSpinner(false);
      }
    }
  };
  closeSearch = () => {
    setSearchText(false);
    if (activeTab == 'phoneBook') {
      setDisplayList(phoneBookList);
    } else {
      setDisplayList([]);
    }
  };
  selectedContacts = (item) => {
    console.log(item);
    // for (let c of phoneBookList) {
    //     if (c.phoneNumber == item.phoneNumber) {
    //         c.active = true
    //     }
    // }
    if (item.active == false) {
      item.active = true;
    } else {
      item.active = false;
    }
    setFlag(true);
  };
  save = () => {
    setSpinner(true);
    setDisableSaveBtn(true);
    let data = [];
    for (let d of phoneBookList) {
      if (d.active == true) {
        data.push(d);
      }
    }
    let bData = [];
    for (let b of beneficiaryList) {
      if (b.active == true) {
        let bl = {};
        bl.id = b.id;
        bl.beneficiaryName = b.beneficiaryName;
        bl.beneficiaryAccountNumber = b.beneficiaryAccountNumber;

        bData.push(bl);
      }
    }
    let v;
    if (bData.length != 0) {
      v = JSON.stringify({beneficiaryList: bData});
      console.log(v);
      fetch(
        global.baseURL +
          'customer/save/transaction/details/' +
          route.params.transactionId +
          '/beneficiary',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: v,
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          // navigation.navigate(route.params.reNavigateTo)
          setDisableSaveBtn(false);
          setSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setDisableSaveBtn(false);
          setSpinner(false);
        });
    }
    if (data.length != 0) {
      v = JSON.stringify({contactList: data});

      console.log(v);
      // return
      fetch(
        global.baseURL +
          'customer/save/transaction/details/' +
          route.params.transactionId +
          '/contacts',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: v,
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          // navigation.navigate(route.params.reNavigateTo)
          setDisableSaveBtn(false);
          setSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setDisableSaveBtn(false);
          setSpinner(false);
        });
    }
    navigation.navigate(route.params.reNavigateTo);
  };
  return (
    // <View>
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
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg_white(short).png')}></Image>
        </View>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate(route.params.reNavigateTo)}>
            <View>
              <Image source={require('./assets/icons-back.png')}></Image>
            </View>
          </TouchableOpacity>
          {searchText == false ? (
            <View>
              <Text style={styles.heading}>Add People</Text>
            </View>
          ) : (
            <View style={{marginLeft: 'auto'}}>
              <TextInput
                placeholder="Search"
                autoFocus={true}
                style={{
                  borderBottomColor: '#cccc',
                  borderBottomWidth: 1,
                  width: wp('75%'),
                  marginLeft: hp('3%'),
                }}
                keyboardType="visible-password"
                onChange={(event) => searchTextFunction(event)}></TextInput>
            </View>
          )}
          {searchText == false ? (
            <TouchableOpacity
              onPress={() => setSearchText(true)}
              style={{alignSelf: 'flex-end'}}>
              <View style={{width: 25, height: 25}}>
                <Image
                  resizeMode={'contain'}
                  style={{maxWidth: '100%', height: '100%'}}
                  source={require('./assets/search_icon.png')}></Image>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => closeSearch()}
              style={{marginLeft: 'auto', marginTop: hp('1%')}}>
              <View style={{width: 25, height: 25}}>
                <Image
                  resizeMode={'contain'}
                  style={{maxWidth: '100%', height: '100%'}}
                  source={require('./assets/icons-x_icon.png')}></Image>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Row
          style={{
            paddingLeft: hp('2%'),
            paddingRight: hp('2%'),
            padding: hp('2%'),
            top: wp('18%'),
            position: 'absolute',
            marginBottom: wp('18%'),
          }}>
          <Col
            size={4.5}
            style={activeTab == 'phoneBook' ? styles.activeTab : styles.tab}>
            <TouchableOpacity
              style={{zIndex: 10}}
              onPress={() => {
                selectedTab('phoneBook');
              }}>
              <Text
                style={{
                  color: '#454F63',
                  textAlign: 'center',
                  fontWeight: activeTab == 'phoneBook' ? 'bold' : null,
                }}>
                PHONE BOOK
              </Text>
            </TouchableOpacity>
          </Col>
          <Col
            size={4.5}
            style={activeTab == 'beneficiary' ? styles.activeTab : styles.tab}>
            <TouchableOpacity
              style={{zIndex: 10}}
              onPress={() => {
                selectedTab('beneficiary');
              }}>
              <Text
                style={{
                  color: '#454F63',
                  textAlign: 'center',
                  fontWeight: activeTab == 'beneficiary' ? 'bold' : null,
                }}>
                BENEFICIARY
              </Text>
            </TouchableOpacity>
          </Col>
          <Col size={3}></Col>
        </Row>
      </View>
      <ScrollView style={{marginBottom: wp('16%')}}>
        {displayList != undefined && displayList.length != 0 ? (
          <FlatList
            data={displayList}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => selectedContacts(item)}
                style={[
                  styles.listCss,
                  {backgroundColor: index % 2 == 0 ? '#EEF2FC' : 'white'},
                ]}>
                <Row>
                  {item.active == true ? (
                    <Col size={1.4} style={{marginRight: 15}}>
                      {/* {
                                            activeTab != 'beneficiary' ? */}

                      <View>
                        <View
                          style={{
                            height: 40,
                            width: 40,
                          }}>
                          <Image
                            resizeMode={'contain'}
                            style={{maxWidth: '100%', height: '100%'}}
                            source={require('./assets/tick_icon.png')}
                          />
                        </View>
                      </View>
                      {/* :
                                                null
                                        } */}
                    </Col>
                  ) : (
                    <Col size={1.4} style={styles.profileImgCss}>
                      {/* <View> */}
                      {activeTab == 'beneficiary' ? (
                        <View>
                          {item.beneficiaryName != '' &&
                          item.beneficiaryName != undefined &&
                          item.beneficiaryName != null ? (
                            <Text style={{textAlign: 'center', color: 'white'}}>
                              {item.beneficiaryName.charAt(0)}
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <View>
                          {item.name != '' &&
                          item.name != undefined &&
                          item.name != null ? (
                            <Text style={{textAlign: 'center', color: 'white'}}>
                              {item.name.charAt(0)}
                            </Text>
                          ) : null}
                        </View>
                      )}
                      {/* </View> */}
                    </Col>
                  )}
                  <Col size={10}>
                    {activeTab == 'beneficiary' ? (
                      <>
                        <Text style={styles.name}>{item.beneficiaryName}</Text>
                        <Text style={styles.number}>
                          {item.beneficiaryAccountNumber}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.number}>{item.phoneNumber}</Text>
                      </>
                    )}

                    {/* <Text>{item.active}</Text> */}
                  </Col>
                </Row>
              </TouchableOpacity>
            )}
          />
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={disableSaveBtn == true}
          onPress={() => save()}>
          <Text style={styles.footerBotton}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>

    // </View>
  );
};

export default AddPeoplePage;
const styles = StyleSheet.create({
  container: {
    // padding: hp('2%'),
    width: wp('100%'),
    backgroundColor: 'white',
    flex: 1,
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
    height: 40,
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
    borderRadius: 12,
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
});
