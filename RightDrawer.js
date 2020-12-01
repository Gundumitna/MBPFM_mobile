import React, { useEffect, useState, createRef } from 'react';
import { AppConfigActions } from './redux/actions';
import ToggleSwitch from 'toggle-switch-react-native';
import Tags from 'react-native-tags';
import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
// import LinearGradient from "react-native-linear-gradient";
import Animated from 'react-native-reanimated';
import cloneDeep from 'lodash/cloneDeep';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';
import { DrawerActions, useNavigationState } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LeftDrawer from './LeftDrawer';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

export default ({ navigation }) => {
  const { rightDrawerState } = useSelector((state) => state.appConfig);
  const dispatch = useDispatch();

  useEffect(() => {
    if (rightDrawerState === 'toggle') {
      navigation.dispatch(DrawerActions.openDrawer());
      dispatch(AppConfigActions.resetRightDrawer());
    }
  }, [rightDrawerState === 'toggle']);

  const [progress, setProgress] = React.useState(new Animated.Value(0));
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const borderRadius = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 10],
  });
  const screenStyles = { borderRadius, transform: [{ scale }] };
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerType="slide"
      overlayColor="transparent"
      drawerStyle={{ width: '70%' }}
      drawerContentOptions={{
        activeBackgroundColor: 'transparent',
        activeTintColor: 'green',
        inactiveTintColor: 'green',
      }}
      sceneContainerStyle={{ backgroundColor: '#2A2E43' }}
      drawerContent={(props) => {
        setProgress(props.progress);
        return <CustomDrawerComp {...props} />;
      }}>
      <Drawer.Screen name="LeftDrawer">
        {(props) => <LeftDrawer {...props} style={screenStyles} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export const CustomDrawerComp = (props) => {
  const dispatch = useDispatch();
  const flatList = createRef();
  const [count, setCount] = useState(0);
  const isDrawerOpen = useIsDrawerOpen();
  const { navigation } = props;
  const [applyStatus, setApplyStatus] = useState(true);
  const [drawerEntry, setDrawerEntry] = useState(true);
  let ls = require('react-native-local-storage');
  const [months, setMonths] = useState([
    { id: 1, mntName: 'JAN', active: false },
    { id: 2, mntName: 'FEB', active: false },
    { id: 3, mntName: 'MAR', active: false },
    { id: 4, mntName: 'APR', active: false },
    { id: 5, mntName: 'MAY', active: false },
    { id: 6, mntName: 'JUNE', active: false },
    { id: 7, mntName: 'JULY', active: false },
    { id: 8, mntName: 'AUG', active: false },
    { id: 9, mntName: 'SEP', active: false },
    { id: 10, mntName: 'OCT', active: false },
    { id: 11, mntName: 'NOV', active: false },
    { id: 12, mntName: 'DEC', active: false },
  ]);
  const [filterData, setFilterData] = useState({
    month: null,
    year: null,
    linkedAccountIds: [],
    bank: [],
    flag: false,
  });
  const [year, setYear] = useState([]);
  const [bank, setBank] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bankSwitchToggle, setBankSwitchToggle] = useState(false);
  const [flag, setFlag] = useState(false);
  const [presetMnt, setPresetMnt] = useState('');
  const [bankDataCopy, setBankDataCopy] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [start, setStart] = useState(false);
  // const [changesDetected,setChangesDetected]
  const [ct, setCt] = useState(0);
  // const { navigationState } = useNavigationState()
  const { rightDrawerState } = useSelector((state) => state.appConfig);
  useEffect(() => {
    global.memoriesSelectedDate = '';
    global.memoriesDate = '';
    let c = count + 1;
    setCount(c);
    // console.log(navigation.state.routeName)
    let filter = { ...filterData };
    let todayDate = new Date().getFullYear(),
      min = todayDate - 4,
      max = todayDate;
    let yearList = [];
    for (let i = min; i <= max; i++) {
      if (todayDate == i) {
        let y = {};
        y.year = i;
        y.active = true;
        filter.year = y;
        yearList.push(y);
      } else {
        let y = {};
        y.year = i;
        y.active = false;
        yearList.push(y);
      }
    }
    yearList.sort(function (a, b) {
      return b.year - a.year;
    });
    setYear(yearList);
    let presetMonth = new Date().getMonth() + 1;
    let presetYear = new Date().getFullYear();
    console.log('presetMonth :' + presetMonth);
    setPresetMnt(presetMonth);
    if (filter.month == null) {
      for (let m of months) {
        if (presetMonth == m.id) {
          m.active = true;
          filter.month = m;
        }
      }
    }
    console.log(presetYear);
    setFilterData(filter);
    getData();

    getConfigDetails();
  }, []);
  useEffect(() => {
    console.log(
      'global.filter : ' +
      global.filter +
      ' global.loginID : ' +
      global.loginID,
    );
    // if (global.filter == false && global.loginID != '') {
    // setSelectAll(false)
    // setTimeout(()=>{
    getData();
    // })

    // }

    return () => {
      global.filter = true;
    };
  }, [global.filter == false && global.loginID != '']);
  getConfigDetails = () => {
    fetch(global.baseURL + 'config/details/7')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        global.thousandSeparator = responseJson.data.value.thousandSeparator;
        global.thousandsGroupStyle =
          responseJson.data.value.thousandsGroupStyle;
        console.log('thousandSeparator : ' + global.thousandSeparator);
        console.log('thousandsGroupStyle : ' + global.thousandsGroupStyle);
      })
      .catch((error) => {
        console.error(error);
      });
    fetch(global.baseURL + 'config/details/8')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        global.dateFormat = responseJson.data.value;
        // global.thousandsGroupStyle = responseJson.data.value.thousandsGroupStyle
        // global.decimalScale = responseJson.data.value.decimalScale
        // console.log('thousandSeparator : ' + global.thousandSeparator)
        // console.log('thousandsGroupStyle : ' + global.thousandsGroupStyle)
        // console.log('decimalScale : ' + global.decimalScale)
      })
      .catch((error) => {
        console.error(error);
      });
    if (global.loginID != undefined && global.loginID != '') {
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
          // global.thousandsGroupStyle = responseJson.data.value.thousandsGroupStyle
          // global.decimalScale = responseJson.data.value.decimalScale
          // console.log('thousandSeparator : ' + global.thousandSeparator)
          // console.log('thousandsGroupStyle : ' + global.thousandsGroupStyle)
          // console.log('decimalScale : ' + global.decimalScale)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    console.log(bankDataCopy);
    if (start == true) {
      setCt(0);
      setStart(false);
    } else {
      if (ct > 0 && drawerEntry == false) {
        if (applyStatus == true) {
          Alert.alert(
            'Alert',
            'Do you want to apply the changes made in the filter ? ',
            [
              {
                text: 'No',
                onPress: () => {
                  if (bankDataCopy != undefined && bankDataCopy.length != 0) {
                    setBank(cloneDeep(bankDataCopy));

                    ls.get('filterData').then((data) => {
                      let fData = cloneDeep(filterData);
                      if (data.linkedAccountIds.length == originalData.length) {
                        setSelectAll(true);
                      } else {
                        setSelectAll(false);
                      }
                      for (let y of year) {
                        if (y.year == data.year.year) {
                          y.active = true;
                          fData.year.year = y.year;
                        } else {
                          y.active = false;
                        }
                      }
                      for (let m of months) {
                        if (m.id == data.month.id) {
                          m.active = true;
                          fData.month.id = m.id;
                          fData.month.mntName = m.mntName;
                        } else {
                          m.active = false;
                        }
                      }
                      setFilterData(fData);
                    });
                    setFlag(true);
                  }
                },
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  applyFilterFunction();
                },
              },
            ],
            { cancelable: false },
          );
        }
      } else {
        setApplyStatus(true);
      }
    }
    return () => {
      setApplyStatus(true);
      setStart(true);
    };
  }, [isDrawerOpen == false && global.loginID != '' && drawerEntry == false]);
  useEffect(() => {
    setDrawerEntry(true);
    getData();
  }, [global.loginID == '']);
  useEffect(() => {
    // return
    return () => {
      setFlag(false);
    };
  }, [flag]);

  getData = () => {
    console.log('get data function');
    console.log('global.loginID : ' + global.loginID);
    fetch(global.baseURL + 'customer/' + global.loginID + '/assets/all')
      .then((response) => response.json())
      .then((responseJson) => {
        setOriginalData(responseJson.data);
        let TotalList = [];
        let totA = [];
        let previousId = '';
        let previousAssetType = '';
        for (let l of responseJson.data) {
          let t = {};
          if (previousId == '' || previousId != l.bankId) {
            let m = {};
            m.bankId = l.bankId;
            m.bankLogo = l.bankLogo;
            m.bankName = l.bankName;
            m.asset = [];
            m.active = false;
            if (
              previousAssetType == '' ||
              previousAssetType != l.asseType ||
              previousId != l.bankId
            ) {
              let innerAsset = {};
              t.asseType = l.asseType;
              t.assetList = [];
              innerAsset.maskedAccountNumber = l.maskedAccountNumber;
              innerAsset.linkedAccountId = l.linkedAccountId;
              innerAsset.active = false;
              t.assetList.push(innerAsset);
              m.asset.push(t);
              // console.log(m.asset)
            }
            TotalList.push(m);
          } else if (previousId == l.bankId) {
            let list = [...TotalList];
            for (let totLi of list) {
              if (totLi.bankId == l.bankId) {
                if (previousAssetType != l.asseType) {
                  let innerAsset = {};
                  t.asseType = l.asseType;
                  t.assetList = [];
                  innerAsset.maskedAccountNumber = l.maskedAccountNumber;
                  innerAsset.linkedAccountId = l.linkedAccountId;
                  innerAsset.active = false;
                  t.assetList.push(innerAsset);
                  totLi.asset.push(t);
                } else if (previousAssetType == l.asseType) {
                  for (let al of totLi.asset) {
                    if (al.asseType == l.asseType) {
                      let innerAsset = {};
                      innerAsset.maskedAccountNumber = l.maskedAccountNumber;
                      innerAsset.linkedAccountId = l.linkedAccountId;
                      innerAsset.active = false;
                      al.assetList.push(innerAsset);
                    }
                  }
                }
              }
            }
          }
          previousId = l.bankId;
          previousAssetType = l.asseType;
        }
        setBank(TotalList);
        console.log('*********************TotalList************************');
        console.log(TotalList);
        setSelectAll(false);
        allSelectSwitch();
        // console.log(bank)
      });
  };
  allSelectSwitch = () => {
    let filter = { ...filterData };
    filter.bank = [];
    if (selectAll == false) {
      setSelectAll((previousState) => !previousState);
      setBankSwitchToggle(true);
      let linkedAccounts = [];

      for (let a of bank) {
        console.log('bank');
        a.active = true;
        for (let assets of a.asset) {
          for (let assetList of assets.assetList) {
            assetList.active = true;
          }
        }
        let data = {};
        data.bankId = 0;
        data.bankName = 'All Banks';
        filter.bank.push(data);
        console.log(a);
      }

      for (let od of originalData) {
        linkedAccounts.push(od.linkedAccountId);
      }
      filter.linkedAccountIds = linkedAccounts;
      setFilterData(filter);
      setBank(bank);
      console.log(filter);
      // return
      if (drawerEntry) {
        ls.save('filterData', filter);
        setBankDataCopy(cloneDeep(bank));
        setDrawerEntry(false);
      }
      setCt(ct + 1);
      setApplyStatus(true);
      setFlag(true);
    } else {
      Alert.alert('Alert', 'Please select atleast one account');
    }
  };
  bankSwitch = (value) => {

    let filter = { ...filterData };
    filter.bank = [];
    console.log(value);
    filter.linkedAccountIds = [];

    if (value.active) {
      if (filterData.linkedAccountIds.length == 1 || originalData.length == 1 || filterData.bank.length == 1) {
        Alert.alert('Alert', 'Please select atleast one account');
      } else {
        setSelectAll(false);
        console.log(originalData);
        console.log(value);
        for (let a of bank) {
          if (value.bankId == a.bankId) {
            a.active = false;
            for (let assets of a.asset) {
              for (let assetList of assets.assetList) {
                assetList.active = false;
              }
            }
          } else {
            let bankCount = 0;
            for (let assets of a.asset) {
              for (let assetList of assets.assetList) {
                // assetList.active = false

                if (assetList.active) {
                  bankCount = bankCount + 1;
                  filter.linkedAccountIds.push(assetList.linkedAccountId);
                  if (bankCount == 1) {
                    let data = {};
                    data.bankId = a.bankId;
                    data.bankName = a.bankName;
                    filter.bank.push(data);
                  }
                }
              }
            }
          }
        }
        setBank(bank);
        setFilterData(filter);
        console.log(filterData);
        setCt(ct + 1);
        setApplyStatus(true);
        setFlag(true);
      }
    } else {
      setSelectAll(false);
      for (let a of bank) {
        if (value.bankId == a.bankId) {
          let bankCount = 0;

          a.active = true;
          for (let assets of a.asset) {
            for (let assetList of assets.assetList) {
              bankCount = bankCount + 1;
              console.log(assetList.linkedAccountId);
              assetList.active = true;
              filter.linkedAccountIds.push(assetList.linkedAccountId);
              if (bankCount == 1) {
                let data = {};
                data.bankId = a.bankId;
                data.bankName = a.bankName;
                filter.bank.push(data);
                console.log('1 : ' + data);
              }
            }
          }
          // if (bankCount == 1) {
          //     let data = {}
          //     a.bankId = a.bankId
          //     a.bankName = a.bankName
          //     filter.bank.push(data)
          // }
          // for (let original of originalData) {
          //     if (original.bankId == value.bankId) {
          //         filter.linkedAccountIds.push(original.linkedAccountId)
          //     }
          // }
        } else {
          if (a.active == true) {
            let bankCount = 0;

            for (let original of originalData) {
              if (original.bankId == a.bankId) {
                bankCount = bankCount + 1;
                console.log(original.linkedAccountId);
                filter.linkedAccountIds.push(original.linkedAccountId);
                if (bankCount == 1) {
                  let data = {};
                  data.bankId = original.bankId;
                  data.bankName = original.bankName;
                  filter.bank.push(data);
                  console.log('2 : ' + data);
                }
              }
            }
          } else {
            let bankCount = 0;

            for (let assets of a.asset) {
              for (let assetList of assets.assetList) {
                if (assetList.active == true) {
                  bankCount = bankCount + 1;
                  console.log(assetList.linkedAccountId);
                  filter.linkedAccountIds.push(assetList.linkedAccountId);
                  if (bankCount == 1) {
                    let data = {};
                    data.bankId = a.bankId;
                    data.bankName = a.bankName;
                    filter.bank.push(data);
                    console.log('3 : ' + data);
                  }
                }
              }
            }
          }
        }

        setBank(bank);
        setFilterData(filter);
      }

      let c = 0;
      for (let bk of bank) {
        if (bk.active == true) {
          c = c + 1;
        }
      }
      setCt(ct + 1);
      setApplyStatus(true);
      if (bank.length == c) {
        setSelectAll(true);
      }
      // setFlag(true)
    }
  };
  linkedAssestSelected = (value, index, list, selectedBank) => {
    console.log(value);
    console.log(list);

    console.log(filterData.linkedAccountIds);
    console.log(selectedBank);
    let filter = { ...filterData };
    filter.linkedAccountIds = [];
    filter.bank = [];
    let totalList = [...bank];
    let c = 0;
    let count = 0;
    if ((filterData.linkedAccountIds.length == 1 || originalData.length == 1) && value.active == true) {
      Alert.alert('Alert', 'Please select atleast one account');
    } else {
      setSelectAll(false);
      for (let t of totalList) {
        let bankCount = 0;
        let totalAssetIds = 0
        if (t.bankId == selectedBank.bankId) {
          for (let asset of t.asset) {
            for (let aList of asset.assetList) {
              totalAssetIds = totalAssetIds + 1;
              if (aList.linkedAccountId == value.linkedAccountId) {
                // let bankCount = 0
                if (aList.active) {
                  aList.active = false;
                } else {
                  bankCount = bankCount + 1;
                  count = count + 1;
                  aList.active = true;
                  filter.linkedAccountIds.push(aList.linkedAccountId);
                  if (bankCount == 1) {
                    let data = {};
                    data.bankId = t.bankId;
                    data.bankName = t.bankName;
                    filter.bank.push(data);
                  }
                }
              } else {
                if (aList.active) {
                  bankCount = bankCount + 1;
                  count = count + 1;
                  filter.linkedAccountIds.push(aList.linkedAccountId);
                  if (bankCount == 1) {
                    let data = {};
                    data.bankId = t.bankId;
                    data.bankName = t.bankName;
                    filter.bank.push(data);
                  }
                }
              }
            }

          }
          if (count == totalAssetIds) {
            t.active = true;
          } else {
            t.active = false;
          }
          // }
        } else {
          for (let asset of t.asset) {
            for (let aList of asset.assetList) {
              if (aList.active == true) {
                bankCount = bankCount + 1;
                filter.linkedAccountIds.push(aList.linkedAccountId);
                if (bankCount == 1) {
                  let data = {};
                  data.bankId = t.bankId;
                  data.bankName = t.bankName;
                  filter.bank.push(data);
                }
              }
            }
          }
          setCt(ct + 1);
          setApplyStatus(true);
        }
      }

      setFilterData(filter);
    }
    if (filterData.linkedAccountIds.length > 1) {
      setBank(totalList);

      setFilterData(filter);
      let tc = 0;
      for (let bk of bank) {
        if (bk.active == true) {
          tc = tc + 1;
        }
      }
      console.log(tc);
      if (bank.length == tc) {
        setSelectAll(true);
      }
      console.log(filterData);
      setFlag(true);
    }
  };
  selectedMonth = (value, index) => {
    console.log('index : ' + index);
    console.log('month : ' + value.id);
    let filter = { ...filterData };

    for (let m of months) {
      if (m.id != value.id) {
        m.active = false;
      } else {
        m.active = true;
        filter.month = value;
        flatListRef.scrollToIndex({ animated: true, index: index });
      }
    }
    setFilterData(filter);
    setMonths(months);
    setCt(ct + 1);
    setApplyStatus(true);
    setFlag(true);
  };
  selectedYear = (value) => {
    console.log(value);
    let filter = { ...filterData };
    for (let m of year) {
      if (m.year != value.year) {
        m.active = false;
      } else {
        m.active = true;
        filter.year = value;
      }
    }
    setFilterData(filter);
    setYear(year);
    setCt(ct + 1);
    setApplyStatus(true);
    setFlag(true);
  };
  applyFilterFunction = () => {
    filterData.flag = true;
    if (isDrawerOpen == true) {
      navigation.dispatch(DrawerActions.closeDrawer());
      ls.get('consentStatus').then((data) => {
        // setApplyStatus(false)
        console.log('consentStatus : ' + data);
        if (data == 'true') {
          getData();
          ls.remove('consentStatus');
        }
      });
    }
    console.log(filterData);
    ls.save('filterData', filterData);
    // return
    setApplyStatus(false);
    setBankDataCopy(cloneDeep(bank));

    // setTimeout(() => {
    //
    dispatch(AppConfigActions.reload());
    // }, 10)
  };
  return (
    <View style={{ paddingTop: hp('5.5%'), backgroundColor: '#2A2E43', flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.heading, { width: wp('40%') }]}>Filter</Text>
        <TouchableOpacity
          style={styles.applyBtnView}
          onPress={() => applyFilterFunction()}>
          <Text style={styles.applyBtnText}> Apply Filter</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.viewText}>Select Year & Month</Text>
        <View>
          <FlatList
            horizontal
            data={year}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectedYear(item)}
                style={{ marginBottom: hp('2%') }}>
                <Text
                  style={{
                    padding: hp('1%'),
                    paddingLeft: hp('2%'),
                    paddingRight: hp('2%'),
                    color: item.active ? '#FFFFFF' : '#DFE4FB',
                    backgroundColor: item.active ? '#63CDD6' : '#2A2E43',
                    borderRadius: 25,
                  }}>
                  {item.year}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View>
          <FlatList
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            }}
            ref={(ref) => {
              flatListRef = ref;
            }}
            horizontal
            data={months}
            initialScrollIndex={10}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => selectedMonth(item, index)}
                style={{ marginBottom: hp('2%') }}>
                <Text
                  style={{
                    padding: hp('1%'),
                    paddingLeft: hp('2%'),
                    paddingRight: hp('2%'),
                    color: item.active ? '#FFFFFF' : '#DFE4FB',
                    backgroundColor: item.active ? '#63CDD6' : '#2A2E43',
                    borderRadius: 25,
                  }}>
                  {item.mntName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: '#AAAAAA', fontSize: 12, paddingTop: hp('1%') }}>
            Select all Accounts
          </Text>
          <View style={{ marginLeft: 'auto', paddingRight: hp('2%') }}>
            <ToggleSwitch
              isOn={selectAll}
              onColor="#63CDD6"
              offColor="#767577"
              size="medium"
              onToggle={() => allSelectSwitch()}
            />
          </View>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <FlatList
          data={bank}
          renderItem={({ item }) => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  padding: hp('1.5%'),
                  paddingRight: 0,
                  marginTop: hp('1%'),
                  backgroundColor: '#4A4D5F',
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                }}>
                <View style={{ width: 30, height: 30 }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={{ uri: item.bankLogo }}
                  />
                </View>
                <Text
                  style={{
                    color: '#DFE4FB',
                    fontSize: 16,
                    marginLeft: hp('2%'),
                    marginTop: hp('0.5%'),
                  }}>
                  {item.bankName}
                </Text>
                <View
                  style={{
                    marginLeft: 'auto',
                    paddingRight: hp('2%'),
                    marginTop: hp('0.5%'),
                    zIndex: 10,
                  }}>
                  <ToggleSwitch
                    isOn={item.active}
                    onColor="#63CDD6"
                    offColor="#767577"
                    size="medium"
                    onToggle={() => bankSwitch(item)}
                  />
                </View>
              </View>
              <View>
                {item.asset.map((asset) => (
                  <View>
                    <Text
                      style={{
                        color: '#DFE4FB',
                        fontSize: 12,
                        marginTop: hp('1%'),
                      }}>
                      {asset.asseType}
                    </Text>
                    {/* <View> */}
                    <Tags
                      readonly={true}
                      textInputProps={false}
                      initialTags={asset.assetList}
                      renderTag={({
                        tag,
                        index,
                        onPress,
                        deleteTagOnPress,
                        readonly,
                      }) => (
                          <TouchableOpacity
                            style={{
                              padding: hp('2%'),
                              marginTop: hp('1%'),
                              marginBottom: hp('1%'),
                              backgroundColor: tag.active ? '#63CDD6' : '#4A4D5F',
                              width: hp('15%'),
                              borderRadius: 30,
                            }}
                            onPress={() =>
                              linkedAssestSelected(tag, index, tag.asset, item)
                            }>
                            <Text
                              style={{
                                color: tag.active ? '#FFFFFF' : '#DFE4FB',
                                fontSize: 14,
                              }}>
                              {tag.maskedAccountNumber.replace(/.(?=.{4})/g, '.')}
                            </Text>
                          </TouchableOpacity>
                        )}
                    />

                    {/* </View> */}
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      </DrawerContentScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  heading: {
    color: '#DFE4FB',
    fontSize: 25,
    fontWeight: 'bold',
  },
  viewText: {
    color: '#AAAAAA',
    fontSize: 12,
    paddingTop: hp('1%'),
    paddingBottom: hp('2.5%'),
  },
  applyBtnView: {
    justifyContent: 'center',
    width: wp('60%'),
    backgroundColor: '#63CDD6',
    borderTopLeftRadius: hp('50%'),
    borderBottomLeftRadius: hp('50%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },
  applyBtnText: {
    color: 'white',
    paddingLeft: 20,
    fontSize: 12,
  },
});
