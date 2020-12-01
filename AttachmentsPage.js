import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
const AttachmentsPage = ({route, navigation}) => {
  const [spinner, setSpinner] = useState(false);
  const [flag, setFlag] = useState(false);
  const [selected, setSelected] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setSpinner(true);
    console.log(route.params.list);
    setSpinner(false);
  }, []);
  const uploadImage = () => {
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
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // SetFileuri(response.uri); //update state to update Image
        // console.log(response.data.split(';', 1))
        let data = {};
        console.log(
          'route.paramstransactionId : ' + route.params.transactionId,
        );
        // data = response.data.split(';', 1)
        // fetch(response.uri)
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
            route.params.transactionId,
          {
            body: form,
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              // 'Authorization': 'Bearer ' + user.token
            },
          },
        )
          .then((response) => response.json())
          .catch((error) => {
            console.log('ERROR ' + error);
          })
          .then((responseJson) => {
            console.log(responseJson);
            navigation.navigate(route.params.reNavigateTo);
          })
          .done();
      }
    });
  };
  deleteImage = () => {
    setSpinner(true);
    console.log(selected);
    let data = [];
    data.push(selected);
    console.log(JSON.stringify(data));
    fetch(
      global.baseURL + 'customer/remove/image/' + route.params.transactionId,
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
        setIsModalVisible(false);
        setSpinner(false);
        setSelected();
        navigation.navigate(route.params.reNavigateTo);
      })
      .catch((error) => {
        console.log(error);
        setSpinner(false);
        setIsModalVisible(false);
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
      <View
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: hp('3%'),
          left: wp('75%'),
          zIndex: 30,
          alignSelf: 'flex-end',
        }}>
        {selected != undefined ? (
          <TouchableOpacity style={{zIndex: 200}}>
            <Image
              style={{maxWidth: '100%', height: '100%'}}
              source={require('./assets/Download_icon.png')}></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => uploadImage()}>
            <Image
              style={{maxWidth: '100%', height: '100%'}}
              source={require('./assets/Addbutton.png')}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <View>
          <Image
            style={{maxWidth: '100%'}}
            source={require('./assets/graph_bg_white(short).png')}></Image>
        </View>
        <View style={styles.topHeader}>
          {selected != undefined ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSelected()}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate(route.params.reNavigateTo)}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
          )}
          <View>
            {selected != undefined ? (
              <Text style={styles.heading}>Back</Text>
            ) : (
              <Text style={styles.heading}>Attachments</Text>
            )}
          </View>
          {selected != undefined ? (
            <TouchableOpacity
              style={{zIndex: 200, right: wp('20%'), justifyContent: 'center'}}
              onPress={() => setIsModalVisible(true)}>
              <Text style={{color: '#F55485', fontWeight: 'bold'}}>
                Delete Image
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <View>
        {selected != undefined ? (
          <View
            style={{
              top: wp('-15%'),
              height: hp('60%'),
            }}>
            <Image
              resizeMode={'contain'}
              style={{maxWidth: '100%', height: '100%'}}
              source={{uri: global.baseURL + 'customer/' + selected}}
            />
          </View>
        ) : (
          <View
            style={{
              marginBottom: wp('16%'),
              top: wp('-21%'),
              paddingLeft: 'auto',
              alignSelf: 'center',
            }}>
            <FlatList
              data={route.params.list}
              // data={pictures}
              numColumns={2}
              style={{width: '100%'}}
              renderItem={({item, index}) => (
                // <Col size={5} style={styles.listCss}>
                // <View >
                // {/* {item.active == true ? */}
                <TouchableOpacity onPress={() => setSelected(item)}>
                  <View
                    style={{
                      height: hp('22%'),
                      width: hp('22%'),
                      // alignItems: 'center',
                      margin: 7,
                    }}>
                    <Image
                      resizeMode={'contain'}
                      style={{maxWidth: '100%', height: '100%'}}
                      source={{uri: global.baseURL + 'customer/' + item}}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
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
          <Text style={styles.modalText1}>
            Do you want to delete this image from your memory?
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => deleteImage()}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsModalVisible(false);
              setSelected();
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

export default AttachmentsPage;
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
    zIndex: 100,
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
  profileImgCss: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    borderRadius: 50,
    marginRight: 15,
    backgroundColor: '#F2A413',
  },

  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
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
    fontSize: 14,
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
