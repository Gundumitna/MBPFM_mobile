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
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import Contacts from 'react-native-contacts';
const LinkedPeoplePage = ({route, navigation}) => {
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [heading, setHeading] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectItem, setSelectItem] = useState();
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const [phoneBookList, setPhoneBookList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params.list);
      setDisplayList(route.params.list);
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    console.log('render');
    return () => {
      setFlag(false);
    };
  }, [flag]);
  deleteFunction = () => {
    setSpinner(true);
    let list = [...route.params.list];
    console.log(selectedIndex);
    list.splice(selectedIndex, 1);

    setDisplayList(list);
    setIsModalVisible(false);
    setFlag(true);
    console.log(list);

    let beneficiary = [];
    let contacts = [];
    for (let l of list) {
      if (l.type == 'contacts') {
        let c = {};
        c.name = l.name;
        c.phoneNumber = l.number;
        c.profilePicture = l.image;
        contacts.push(c);
      } else {
        let b = {};
        b.id = l.id;
        b.beneficiaryName = l.name;
        b.beneficiaryAccountNumber = l.number;
        beneficiary.push(b);
      }
    }
    console.log(contacts);

    if (selectItem.type == 'contacts') {
      console.log(JSON.stringify({contactList: contacts}));
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
          body: JSON.stringify({contactList: contacts}),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          // navigation.navigate(route.params.reNavigateTo)
          setSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setSpinner(false);
        });
    } else {
      console.log(JSON.stringify({beneficiaryList: beneficiary}));
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
          body: JSON.stringify({beneficiaryList: beneficiary}),
        },
      )
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          // navigation.navigate(route.params.reNavigateTo)
          setSpinner(false);
        })
        .catch((error) => {
          console.log(error);
          setSpinner(false);
        });
    }
    navigation.navigate(route.params.reNavigateTo);
  };
  return (
    <View style={styles.container}>
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
          navigation.navigate('addPeople', {
            reNavigateTo: route.params.reNavigateTo,
            transactionId: route.params.transactionId,
            list: route.params.list,
          })
        }>
        <Image
          style={{maxWidth: '100%', height: '100%'}}
          source={require('./assets/Addbutton.png')}
        />
      </TouchableOpacity>

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
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.heading}>You spent your time with</Text>
          </View>
        </View>
      </View>
      <View style={{marginBottom: wp('21%'), top: wp('-21%')}}>
        {route.params.reNavigateTo == 'transactionPage' ? null : (
          <Text style={{fontSize: 11, color: '#AAAAAA'}}>
            Click below to see the people history
          </Text>
        )}
        <FlatList
          data={displayList}
          renderItem={({item, index}) => (
            <TouchableOpacity
              disabled={route.params.reNavigateTo == 'transactionPage'}
              onPress={() =>
                navigation.navigate('bankAndTransactionHistory', {
                  list: item,
                  data: route.params.data,
                  type: 'contacts',
                  reNavigateTo: route.params.reNavigateTo,
                  startDate: route.params.startDate,
                  endDate: route.params.endDate,
                })
              }>
              <Row
                style={[
                  styles.listCss,
                  {backgroundColor: index % 2 == 0 ? '#EEF2FC' : 'white'},
                ]}>
                <Col size={1.4} style={styles.profileImgCss}>
                  <View>
                    {item.profilePicture != null ? (
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
                    ) : (
                      <View>
                        <Text style={{textAlign: 'center', color: 'white'}}>
                          {item.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </View>
                </Col>
                <Col size={9}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.number}>{item.number}</Text>
                </Col>
                <Col size={1} style={{justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(true);
                      setSelectedIndex(index);
                      setSelectItem(item);
                    }}
                    style={{width: 25, height: 25}}>
                    <Image
                      resizeMode={'contain'}
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/Remove_icon.png')}></Image>
                  </TouchableOpacity>
                </Col>
              </Row>
            </TouchableOpacity>
          )}
        />
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
          {selectItem != undefined ? (
            <Text style={styles.modalText1}>
              Do you want to remove {selectItem.name} from your memory?
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={() => deleteFunction()}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsModalVisible(false);
              setSelectedIndex('');
              setSelectItem();
            }}>
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

export default LinkedPeoplePage;
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
    fontSize: 19,
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
  view: {
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'white',
    marginTop: hp('45%'),
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
    fontSize: 12,
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
