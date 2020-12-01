import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import { store } from './redux/configStore';
import Navigator from './MainNavigator';
import messaging from '@react-native-firebase/messaging';
import { Alert, AppState } from 'react-native';
import Upshot from 'react-native-upshotsdk';
// import firebase from 'react-native-firebase';

const App = () => {
  // global.baseURL = 'http://63.142.252.161:8080/pfm/api/';
  global.baseURL = 'http://63.142.252.161:8080/mbpfmdemo/api/';
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  async function saveTokenToDatabase(token) {
    //Alert.alert(token);
    console.log('FCM TOKEN: ' + token);
    global.fcmtoken = token;
  }

  useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });
    AppState.addEventListener('change', _handleAppStateChange);
    Upshot.addListener('UpshotAuthStatus', handleAuthStatus);
    Upshot.addListener('UpshotPushPayload', getPushPayload);
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('app state+ ' + appStateVisible);
      console.log('app state+ ' + JSON.stringify(appState));
      if (appStateVisible == 'active') {
        console.log(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage),
        );
        Alert.alert('Budget Alert', remoteMessage.notification.body);
      }
    });
    return unsubscribe;
  }, []);
  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      startUpshot();
      setAppStateVisible(nextAppState);
    } else if (nextAppState === 'background') {
      terminateUpshot();
      setAppStateVisible(nextAppState);
    }
  };
  const handleAuthStatus = (response) => {
    console.log('Authentication Status' + JSON.stringify(response));
    console.log(response);
  };
  const getPushPayload = (response) => {
    ///console.log('push payload ' + JSON.stringify(response));
    console.log(response);
  };

  const startUpshot = () => {
    Upshot.initializeUpshot();
  };

  const terminateUpshot = () => {
    Upshot.terminate();
  };

  console.disableYellowBox = true;
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
};
export default App;
