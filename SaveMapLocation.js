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
import {FlatList} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, {Marker} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const SaveMapLocation = ({route, navigation}) => {
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [description, setDescription] = useState();
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  const [region, setRegion] = useState({
    latitude: 17.385,
    longitude: 78.4867,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      setLat(region.latitude);
      setLng(region.longitude);
    });
    unsubscribe;
  }, [navigation]);
  useEffect(() => {
    return () => {
      setFlag(false);
    };
  }, [flag]);
  getData = (region) => {
    setRegion(region);
    console.log(region);
    setLat(region.latitude);
    setLng(region.longitude);
    setFlag(true);
  };
  onDrag = (e) => {
    console.log(e.nativeEvent.coordinate);
    setLat(e.nativeEvent.coordinate.latitude);
    setLng(e.nativeEvent.coordinate.longitude);
    setDescription();
  };
  save = () => {
    setDisableSaveBtn(true);
    setSpinner(true);
    console.log(route.params.transactionId);
    console.log('save map');
    let data = {};
    data.latitude = Number(lat);
    data.longitude = Number(lng);
    data.longitudeDelta = 0.0421;
    data.latitudeDelta = 0.0922;
    data.mapDescription = description;
    console.log(JSON.stringify(data));

    fetch(
      global.baseURL +
        'customer/save/transaction/details/' +
        route.params.transactionId +
        '/map',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setDisableSaveBtn(false);
        navigation.navigate(route.params.reNavigateTo);
        setSpinner(false);
      })
      .catch((error) => {
        console.log(error);
        setDisableSaveBtn(false);
        setSpinner(false);
      });
  };
  return (
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

          <View>
            <Text style={styles.heading}>Add Location</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          padding: hp('3%'),
          paddingBottom: 0,
          width: '100%',
          position: 'absolute',
          top: wp('15%'),
        }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            console.log(JSON.stringify(details.geometry));
            setLat(details.geometry.location.lat);
            setLng(details.geometry.location.lng);
            setDescription(data.description);
          }}
          query={{
            key: 'AIzaSyBcczp3pM81rKFS4wPI6j7adJQqihM0fDY',
            language: 'en',
          }}
        />
        <View style={{marginTop: hp('3%')}}>
          {lat != undefined && lng != undefined && description != undefined ? (
            <View>
              <MapView
                style={{width: '100%', height: hp('45%')}}
                region={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                onRegionChangeComplete={(region) => getData(region)}>
                <Marker
                  draggable
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  onDragEnd={(e) => onDrag(e)}
                  // title={'Test Marker'}
                  description={'This is a description of the marker'}
                />
              </MapView>
              <View>
                <Text style={{fontSize: 16, color: '#454F63', opacity: 0.7}}>
                  Description :{' '}
                </Text>
                <Text style={{fontSize: 14, color: '#454F63'}}>
                  {' '}
                  {description}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  disabled={disableSaveBtn == true}
                  onPress={() => save()}>
                  <Text style={styles.footerBotton}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>
      {/* <View style={{ padding: hp('3%'), top: hp('-10%') }}>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, color: '#454F63', opacity: 0.7 }}>Latitude : </Text>
                    <Text style={{ fontSize: 14, color: '#454F63' }}> {lat}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16, color: '#454F63', opacity: 0.7 }}>Longitude : </Text>
                    <Text style={{ fontSize: 14, color: '#454F63' }}> {lng}</Text>
                </View>
            </View>
            <View style={styles.footer}> */}
      {/* <TouchableOpacity disabled={disableSaveBtn == true} onPress={() => save()}>
                <Text style={styles.footerBotton} >Save</Text>
            </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default SaveMapLocation;
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
    // padding: hp('2.5%')
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
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
    borderRadius: 10,
    marginTop: hp('3%'),
    marginBottom: 5,
    // marginLeft: 15,
    color: 'white',
  },
});
