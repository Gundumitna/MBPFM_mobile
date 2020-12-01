import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';

const MyBadges = ({navigation}) => {
  const [spinner, setSpinner] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([
    {
      id: 1,
      badgeName: 'Mini Accountant',
      badgeImg: require('./assets/miniaccountbadge.jpg'),
      badgeDesc:
        'Awarded for perfect tracking of expenses to the last penny possible !',
    },

    // { id: 1, badgeName: 'Entrepreneur', badgeImg: require('./assets/Edit_icon.png') },
    // { id: 2, badgeName: 'Solid and Steady ', badgeImg: require('./assets/Edit_icon.png') },
    // { id: 3, badgeName: 'Outstanding student', badgeImg: require('./assets/Edit_icon.png') },
  ]);
  const [lockedBadges, setLockedBadges] = useState([
    {
      id: 1,
      badgeName: 'Money Master',
      badgeImg: require('./assets/moneymasterbadge.jpg'),
      badgeDesc:
        'Set up a budget to obtain the Money Master Badge and unlock more rewards !',
    },
    {
      id: 2,
      badgeName: 'Super Saver ',
      badgeImg: require('./assets/supermasterbadge.jpg'),
      badgeDesc:
        'Create a Goal with us and enjoy a higher interest rates and other benefits !',
    },
  ]);
  const [selectedBadge, setSelectedBadge] = useState();
  let ls = require('react-native-local-storage');
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      ls.save('selectedDrawerItem', 'myBadges');
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      <View>
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={navigation.openDrawer}>
            <Image source={require('./assets/icons-menu(white)(2).png')} />
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.heading}>My Badges</Text>
          </View>
        </View>
        <View style={styles.border}>
          <Text
            style={{
              padding: hp('2%'),
              paddingBottom: 0,
              fontSize: 18,
              color: '#3DD9CA',
              fontWeight: 'bold',
            }}>
            Badge Earned
          </Text>
          <FlatList
            data={earnedBadges}
            style={{alignSelf: 'center'}}
            numColumns={3}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true);
                  setSelectedBadge(item);
                }}
                style={{margin: hp('2.5%'), marginTop: 0}}>
                <View style={styles.bageImgView}>
                  <Image
                    resizeMode={'contain'}
                    style={styles.bageImg}
                    source={item.badgeImg}></Image>
                </View>
                <View style={{width: earnedBadges.length == 1 ? 100 : 70}}>
                  <Text style={styles.badgeLabel}>{item.badgeName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.border}>
          <Text
            style={{
              padding: hp('2%'),
              paddingBottom: 0,
              fontSize: 18,
              color: '#3DD9CA',
              fontWeight: 'bold',
            }}>
            Locked Badges
          </Text>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              opacity: 0.3,
            }}>
            <FlatList
              data={lockedBadges}
              numColumns={3}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(true);
                    setSelectedBadge(item);
                  }}
                  style={{
                    width: '33%',
                    alignItems: 'center',
                    paddingBottom: hp('4%'),
                  }}>
                  <View style={styles.bageImgView}>
                    <Image
                      resizeMode={'contain'}
                      style={styles.bageImg}
                      source={item.badgeImg}></Image>
                  </View>
                  <View style={{width: lockedBadges.length == 1 ? 100 : 70}}>
                    <Text style={styles.badgeLabel}>{item.badgeName}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
      <Modal
        testID={'modal'}
        isVisible={isModalVisible}
        style={styles.view}
        swipeDirection={'up'}>
        <View style={{flex: 1}}>
          {selectedBadge != undefined ? (
            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                padding: hp('2%'),
                paddingLeft: wp('10%'),
                paddingRight: wp('10%'),
              }}>
              <View style={styles.bageImgView}>
                <Image
                  resizeMode={'contain'}
                  style={styles.bageImg}
                  source={selectedBadge.badgeImg}></Image>
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  color: '#051094',
                  paddingBottom: hp('2%'),
                }}>
                {selectedBadge.badgeName}
              </Text>
              <Text
                style={{textAlign: 'center', fontSize: 15, color: '#5E83F2'}}>
                {selectedBadge.badgeDesc}
              </Text>
              {/* <Text
                style={{textAlign: 'center', fontSize: 15, color: '#5E83F2'}}>
                As a reward, you are auto-enrolled into "Savings Tip of the Day"
                program.
              </Text> */}
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#5E83F2',
            height: wp('15%'),
          }}>
          <TouchableOpacity
            style={{
              width: '50%',
              justifyContent: 'center',
              borderRightWidth: 1,
              borderRightColor: 'white',
            }}
            onPress={() => {
              setIsModalVisible(false);
              setSelectedBadge();
            }}>
            <Text style={{color: 'white', textAlign: 'center'}}>SHARE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: '50%', justifyContent: 'center'}}
            onPress={() => {
              setIsModalVisible(false);
              setSelectedBadge();
            }}>
            <Text style={{color: 'white', textAlign: 'center'}}>TO CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default MyBadges;
const styles = StyleSheet.create({
  container: {
    // padding: hp('2%'),
    width: wp('100%'),
    backgroundColor: '#5E83F2',
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    padding: hp('2%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('3%'),
    // position: 'absolute',
    // flex: 1
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  heading: {
    paddingLeft: hp('3%'),
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
    width: wp('75%'),
    textAlign: 'center',
  },
  badgeLabel: {
    textAlign: 'center',
    color: 'blue',
    marginTop: wp('-5%'),
    fontSize: 12,
  },
  bageImgView: {
    width: wp('18%'),
    height: hp('18%'),
    alignSelf: 'center',
  },
  bageImg: {
    maxWidth: '100%',
    height: '100%',
  },
  border: {
    borderWidth: 1,
    margin: hp('3%'),
    borderColor: '#cccccc',
    backgroundColor: 'white',
    borderRadius: hp('2%'),
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  view: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    backgroundColor: 'white',
    margin: hp('20%'),
    width: wp('75%'),
  },
});
