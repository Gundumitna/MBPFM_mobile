import React, { useEffect, useState } from 'react';
import {
  View,
  AsyncStorage,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerSection,
} from '@react-navigation/drawer';
import MainStack from './MainStack';
import Upshot from 'react-native-upshotsdk';

const Drawer = createDrawerNavigator();

export default ({ style }) => {
  useEffect(() => {
    console.log('Scale : ' + scale);
    if (scale.Value == 0) {
      console.log('scale value == 0');
    }
  }, []);
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
    <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
      <Drawer.Navigator
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
        <Drawer.Screen name="MainStack">
          {(props) => <MainStack {...props} style={screenStyles} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </Animated.View>
  );
};

export const CustomDrawerComp = (props) => {
  const { navigation } = props;
  let ls = require('react-native-local-storage');
  const [activeItem, setActiveItem] = useState('');
  const [flag, setFlag] = useState(false);
  const [userName, setUserName] = useState();
  const [menuList, setMenuList] = useState([
    {
      id: 1,
      navigation: 'dashboard',
      icon: require('./assets/Dashboard_menu_icon.png'),
      label: 'Dashboard',
    },
    {
      id: 2,
      navigation: 'accounts',
      icon: require('./assets/Accounts_menu_icon.png'),
      label: 'Accounts',
    },
    {
      id: 3,
      navigation: 'mainExpensePage',
      icon: require('./assets/expense_menu_icon.png'),
      label: 'Expense',
    },
    {
      id: 4,
      navigation: 'mainIncomePage',
      icon: require('./assets/income_menu_icon.png'),
      label: 'Income',
    },
    {
      id: 5,
      navigation: 'budgetPage',
      icon: require('./assets/Budgets_menu_icon.png'),
      label: 'Budgets',
    },
    {
      id: 6,
      navigation: 'goalsPage',
      icon: require('./assets/Goals_menu_icon.png'),
      label: 'Goals',
    },
    {
      id: 7,
      navigation: 'memories',
      icon: require('./assets/Memories_menu_icon.png'),
      label: 'Memories',
    },
    {
      id: 8,
      navigation: 'fincastPage',
      icon: require('./assets/fincast_menu_icon.png'),
      label: 'Fincast',
    },
    {
      id: 9,
      navigation: 'myBadges',
      icon: require('./assets/fincast_menu_icon.png'),
      label: 'My Badges',
    },
    // { id: 10, navigation: 'leaderBoard', icon: require("./assets/fincast_menu_icon.png"), label: "Leader Board" },
  ]);
  const isDrawerOpen = useIsDrawerOpen();
  useEffect(() => {
    selectedItem();
    ls.remove('budgetType');
    // console.log(navigation.dangerouslyGetState)
    // ls.get('selectedDrawerItem').then((data) => {
    //     console.log('selectedDrawerItem : ' + data)
    //     setActiveItem(data)
    // })
    // const retrievedItem = await AsyncStorage.getItem(key);
    // const item = JSON.parse(retrievedItem);
    // return (() => {
    //     console.log(console.log('activeItem : ' + item))
    // })
    return () => {
      setFlag(false);
    };
  }, [isDrawerOpen]);
  selectedItem = (item) => {
    console.log(item);
    ls.get('selectedDrawerItem').then((data) => {
      // console.log('selectedDrawerItem : ' + data)
      // setUserName(global.userName)
      console.log('global.userName : ' + global.userName);
      setActiveItem(data);
    });
    // setActiveItem(item)
    console.log('selectedDrawerItem : ' + activeItem);
    setFlag(true);
    // navigation.navigate(item)
  };
  const onLogout = (data) => {
    let logoutDetails = {
      appuID: '',
    };
    Upshot.setUserProfile(JSON.stringify(logoutDetails), function (response) {
      // response is either true or false
      console.log('logout' + response);
    });
    navigation.navigate(' ');
  };
  const onSurvey = (data) => {
    Upshot.showActivityWithType(-1, 'Survey Button');
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#2A2E43' }}>
      <View
        style={{
          marginLeft: hp('4%'),
          marginTop: hp('5%'),
          borderBottomWidth: 1,
          borderBottomColor: '#CCCCCC',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('userProfile')}
          style={{ width: 70, height: 70, marginTop: 10 }}>
          {global.userImage != undefined &&
            global.userImage != null &&
            global.userImage != '' ? (
              <Image
                resizeMode={'cover'}
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  borderRadius: hp('1.5%'),
                }}
                source={{
                  uri: global.baseURL + 'customer/' + global.userImage,
                }}></Image>
            ) : (
              <Image
                resizeMode={'cover'}
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  borderRadius: hp('1.5%'),
                }}
                source={require('./assets/avatar-icon.png')}
              />
            )}
        </TouchableOpacity>
        <View style={{ marginTop: hp('4%') }}>
          <Text style={{ color: '#AAAAAA', fontSize: 14 }}>Hello!</Text>
          <Text style={{ color: '#DFE4FB', fontWeight: 'bold', fontSize: 25 }}>
            {global.userName}
          </Text>
        </View>
      </View>
      <FlatList
        data={menuList}
        style={{ marginBottom: hp('10%') }}
        renderItem={({ item }) => (
          <View
            style={
              activeItem == item.navigation ? styles.active : styles.notActive
            }>
            <DrawerItem
              label={item.label}
              labelStyle={{ color: 'white', fontSize: 18, marginLeft: wp('-4%') }}
              icon={() => (
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    resizeMode={'contain'}
                    style={{ maxWidth: '100%', height: '100%' }}
                    source={item.icon}></Image>
                </View>
              )}
              onPress={() => {
                if (item.label == 'Survey') {
                  onSurvey();
                } else {
                  navigation.navigate(item.navigation);
                }
              }}
            />
          </View>
        )}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            paddingRight: hp('5%'),
            paddingLeft: hp('5%'),
            paddingBottom: hp('2%'),
          }}
          onPress={() => onLogout()}>
          <View style={{ width: 35, height: 35 }}>
            <Image
              resizeMode={'contain'}
              style={{ maxWidth: '100%', height: '100%' }}
              source={require('./assets/logout_menu_icon.png')}></Image>
          </View>
          <Text style={{ color: '#DFE4FB', marginTop: hp('0.5%'), fontSize: 18 }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 5,
    backgroundColor: '#2A2E43',
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
    borderRadius: hp('1.3%'),
    marginTop: hp('1%'),
    color: 'white',
  },
  active: {
    backgroundColor: '#ff950a',
    borderRadius: hp('12%'),
    margin: hp('2%'),
    marginBottom: 0,
  },
  notActive: {
    backgroundColor: 'transparent',
    marginLeft: hp('2%'),
    marginBottom: hp('-1%'),
  },
});
