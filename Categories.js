import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import Tags from 'react-native-tags';
import Upshot from 'react-native-upshotsdk';

function Categories({route, navigation}) {
  const [categories, setCategories] = useState([]);
  const [originalList, setOriginalList] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [searchText, setSearchText] = useState(false);
  const [typeOfTransaction, setTypeOfTransaction] = useState('');
  const [status, setStatus] = useState(false);
  useEffect(() => {
    Upshot.addListener('UpshotActivityDidAppear', handleActivityDidAppear);

    Upshot.addListener('UpshotActivityDidDismiss', handleActivityDidDismiss);

    Upshot.addListener('UpshotDeepLink', handleDeeplink);
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(route.params);
      if (
        route.params.reNavigateTo == 'transactionPage' ||
        route.params.reNavigateTo == 'memories'
      ) {
        // console.log(route.params.transaction.typeOfTransaction)
        setTypeOfTransaction(route.params.transaction.typeOfTransaction);
        // console.log(typeOfTransaction)
      } else if (route.params.reNavigateTo == 'splitPage') {
        // console.log()
        console.log(route.params.splitList);
        setTypeOfTransaction(route.params.statementData.typeOfTransaction);
        console.log(route.params.splitList);
        // let categoriesList = [...categories]
        // for (let c of categoriesList) {
        //     for (let s of route.params.splitList) {
        //         if (s.categoryId == c.categoryId) {
        //             c.color = '#63CDD6';
        //             c.selectedCategory = true;
        //         }
        //     }
        // }

        // setCategories(categoriesList)
        // setStatus(true)
      }
      getCatoriesList();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    console.log('selected');
    return () => {
      setStatus(false);
    };
  }, [status]);
  getCatoriesList = () => {
    setSpinner(true);
    let url = '';
    let type = '';
    console.log(typeOfTransaction);
    // if (typeOfTransaction == "DB") {
    if (
      ((route.params.reNavigateTo == 'transactionPage' ||
        route.params.reNavigateTo == 'memories') &&
        route.params.transaction.typeOfTransaction == 'DB') ||
      (route.params.reNavigateTo == 'splitPage' &&
        route.params.statementData.typeOfTransaction == 'DB')
    ) {
      url = 'get/categories/expense';
      type = 'DB';
    } else if (
      ((route.params.reNavigateTo == 'transactionPage' ||
        route.params.reNavigateTo == 'memories') &&
        route.params.transaction.typeOfTransaction == 'CR') ||
      (route.params.reNavigateTo == 'splitPage' &&
        route.params.statementData.typeOfTransaction == 'CR')
    ) {
      url = 'get/categories/income';
      type = 'CR';
    } else if (
      route.params.reNavigateTo == 'accountStatementPage' ||
      route.params.reNavigateTo == 'accountSubStmtPage' ||
      route.params.reNavigateTo == 'budgetCreatePage'
    ) {
      url = 'get/categories/all';
      type = '';
    }
    // fetch(global.baseURL+'customer/' + url
    fetch(global.baseURL + 'customer/' + url)
      .then((response) => response.json())
      .then((responseJson) => {
        // setExpenseCatories(responseJson.data)

        list = [];
        if (type != '') {
          for (let c of responseJson.data) {
            if (c.id != 1) {
              let data = {};
              data.id = c.id;
              if (type == 'DB') {
                data.category = c.expenseCategory;
              } else if (type == 'CR') {
                data.category = c.incomeCategoryName;
              }
              data.icon = c.icon;

              data.color = '#AAAAAA';
              data.alreadySelected = false;
              list.push(data);
            }
          }
        } else if (type == '') {
          for (let c of responseJson.data) {
            if (c.id != 1) {
              let data = {};
              data.id = c.id;

              data.category = c.name;
              data.type = c.type;
              data.icon = c.image;
              data.color = '#AAAAAA';
              list.push(data);
            }
          }
        }
        let categoriesList = [...list];
        if (route.params.splitList != undefined) {
          if (route.params.splitList.length > 1) {
            console.log('Split List');

            for (let c of categoriesList) {
              for (let s of route.params.splitList) {
                if ((type = '')) {
                  if (c.id == s.categoryId && c.type == s.type) {
                    console.log('in');
                    c.color = '#63CDD6';
                    c.selectedCategory = true;
                  }
                } else {
                  if (c.id == s.categoryId) {
                    console.log('in');
                    c.color = '#63CDD6';
                    c.selectedCategory = true;
                  }
                }
              }
            }
          } else {
            for (let c of categoriesList) {
              if ((type = '')) {
                if (
                  c.id == route.params.splitList.categoryId &&
                  c.type == route.params.splitList.type
                ) {
                  console.log('in');
                  c.color = '#63CDD6';
                  c.selectedCategory = true;
                }
              } else {
                if (c.id == route.params.splitList.categoryId) {
                  console.log('in');
                  c.color = '#63CDD6';
                  c.selectedCategory = true;
                }
              }
            }
          }

          // setCategories(categoriesList)
          list = categoriesList;
        }
        setCategories(categoriesList);
        setOriginalList(list);
        // console.log(categoriesList)
        setSpinner(false);
      })
      .catch((error) => {
        setSpinner(false);
        console.log(error);
      });
  };
  selectedCategory = (list, category) => {
    setSpinner(true);
    // let list = [...categories]
    console.log(list);
    console.log(category);
    for (let c of list) {
      if (c.id == category.id && c.type == category.type) {
        c.color = '#63CDD6';
        setStatus(true);
        setCategories(list);
        if (
          route.params.reNavigateTo == 'splitPage' ||
          route.params.reNavigateTo == 'budgetCreatePage'
        ) {
          route.params.item.bgColor = '#63CDD6';
          route.params.item.icon = c.icon;
          route.params.item.category = c.category;
          route.params.item.categoryId = c.id;
          if (route.params.item.notAExpense) {
            route.params.item.changedFlag = 1;
          }
          navigation.navigate(route.params.reNavigateTo, route.params);
          setSpinner(false);
        } else if (
          route.params.reNavigateTo == 'transactionPage' ||
          route.params.reNavigateTo == 'memories'
        ) {
          // console.log(route.params.transactionId)
          console.log(route.params.transactionId);
          console.log(c.id);
          // fetch(global.baseURL+'customer/category/change/' + route.params.transaction.transactionId + '/' + c.id, {
          fetch(
            global.baseURL +
              'customer/category/change/' +
              route.params.transaction.transactionId +
              '/' +
              c.id,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: 'null',
            },
          )
            // .then((response) => {
            .then((response) => response.json())
            .then((responseJson) => {
              route.params.transaction.category = category.category;
              route.params.transaction.icon = category.icon;
              route.params.transaction.categoryId = category.id;
              route.params.transaction.transactionId = responseJson.data;
              console.log(route.params);
              navigation.navigate(route.params.reDirectTo, route.params);
              setSpinner(false);
              if (route.params.reNavigateTo != 'memories') {
                const payload = {};

                Upshot.createCustomEvent(
                  'AllCategDone',
                  JSON.stringify(payload),
                  false,
                  function (eventId) {
                    console.log('Event all categ done' + eventId);
                  },
                );
              }
            })
            .catch((error) => {
              setSpinner(false);
              console.error(error);
            });
        } else if (
          route.params.reNavigateTo == 'accountSubStmtPage' ||
          route.params.reNavigateTo == 'accountStatementPage'
        ) {
          let postList = {};
          postList.page = 'CategoryPage';
          postList.category = c.category;
          postList.categoryId = c.id;
          postList.categoryIcon = c.icon;
          postList.categorType = c.type;
          console.log(postList);
          navigation.navigate(route.params.reNavigateTo, postList);
          setSpinner(false);
        }
      } else {
        c.color = '#AAAAAA';
      }
    }
  };
  searchTextFunction = (event) => {
    console.log(event.nativeEvent.text);
    let textInLowerCase = event.nativeEvent.text.toLowerCase();
    let list = [...originalList];
    let listToPush = [];
    if (event.nativeEvent.text != '') {
      for (let li of list) {
        let text = li.category.toLowerCase();
        if (text.indexOf(textInLowerCase) > -1) {
          console.log('matched');
          listToPush.push(li);
        }
      }
      setCategories(listToPush);
      setStatus(true);
    } else {
      setCategories(list);
    }
  };
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
    console.log('deeplink ' + JSON.stringify(response));
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

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        overlayColor="rgba(0, 0, 0, 0.65)"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
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
            <Text style={styles.heading}>Select Category</Text>
          </View>
        ) : (
          <View style={{marginLeft: hp('2%')}}>
            <TextInput
              placeholder="Search"
              autoFocus={true}
              // editable={item.categoryId != 0}
              style={{
                borderBottomColor: '#cccc',
                borderBottomWidth: 1,
                width: wp('65%'),
              }}
              keyboardType="visible-password"
              onChange={(event) => searchTextFunction(event)}
              // value={item.amount.toString()}
            ></TextInput>
          </View>
        )}
        {searchText == false ? (
          <TouchableOpacity
            onPress={() => setSearchText(true)}
            style={{marginLeft: 'auto', marginTop: hp('1%')}}>
            <View style={{width: 25, height: 25}}>
              <Image
                resizeMode={'contain'}
                style={{maxWidth: '100%', height: '100%'}}
                source={require('./assets/search_icon.png')}></Image>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setSearchText(false)}
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

      {/* {searchText == true ?
                <View>
                    <View>
                        <TextInput
                            placeholder="Search"
                            // editable={item.categoryId != 0}
                            style={{ borderBottomWidth: 1, borderBottomColor: '#cccc' }}
                            // keyboardType='text'
                            onChange={(text) => searchTextFunction(text)}
                        // value={item.amount.toString()}

                        ></TextInput>
                    </View>
                    <TouchableOpacity onPress={() => setSearchText(false)} style={{ marginLeft: "auto", marginTop: hp('1%') }}>
                        <View style={{ width: 25, height: 25 }}>
                            <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={require("./assets/icons-x_icon.png")}></Image>
                        </View>
                    </TouchableOpacity>
                </View>
                : null} */}
      {/* </View/> */}
      <ScrollView>
        <Tags
          readonly={true}
          textInputProps={false}
          initialTags={categories}
          renderTag={({tag, index, onPress, deleteTagOnPress, readonly}) => (
            <TouchableOpacity
              disabled={tag.selectedCategory}
              onPress={() => selectedCategory(categories, tag)}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 2,
                margin: 4,
                borderWidth: 0,
                backgroundColor: tag.color,
                borderRadius: 25,
              }}>
              <View style={{width: 30, height: 30}}>
                <Image
                  resizeMode={'contain'}
                  style={{maxWidth: '100%', height: '100%'}}
                  source={{
                    uri: global.baseURL + 'customer/' + tag.icon,
                  }}></Image>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Text
                  style={{
                    paddingLeft: hp('1%'),
                    paddingRight: hp('1.5%'),
                    color: 'white',
                  }}>
                  {tag.category}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      {/* <FlatList
                // style={{ flexGrow: 1 }}
                data={categories}
                renderItem={({ item }) =>
                    <TouchableOpacity disabled={item.selectedCategory} onPress={() => selectedCategory(categories, item)} style={{ flexDirection: 'row', flexWrap: "wrap", padding: 2, margin: 4, borderWidth: 0, backgroundColor: item.color, borderRadius: 25 }}>
                        <View style={{ width: 40, height: 40 }}>
                            <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
                        </View>
                        <Text style={{ marginTop: 10, paddingLeft: 5, color: 'white' }}>{item.category}</Text>
                        
                    </TouchableOpacity>
                }
            ></FlatList> */}
      {/* </View> */}
      {/* <Grid>
                <Row>
                    <FlatList
                        style={{ flexGrow: 1 }}
                        data={categories}
                        renderItem={({ item }) =>
                            <Col>
                                <Row>
                                    <Col size={2}>
                                        <View style={{ width: 40, height: 40 }}>
                                            <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
                                        </View>
                                    </Col>
                                    <Col size={10}>
                                        <Text style={{ marginTop: 10, paddingLeft: 5, color: 'white' }}>{item.category}</Text>
                                    </Col>
                                </Row>
                            </Col>
                            // <TouchableOpacity onPress={() => selectedCategory(categories, item)} style={{ flexDirection: 'row', padding: 2, margin: 4, borderWidth: 0, backgroundColor: item.color, borderRadius: 25 }}>
                            //     <View style={{ width: 40, height: 40 }}>
                            //         <Image resizeMode={'contain'} style={{ maxWidth: '100%', height: '100%' }} source={{ uri: global.baseURL+'customer/' + item.icon }}></Image>
                            //     </View>
                            //     <Text style={{ marginTop: 10, paddingLeft: 5, color: 'white' }}>{item.category}</Text>
                            // </TouchableOpacity>
                        }
                    ></FlatList>
                </Row>
            </Grid> */}
    </View>
  );
}

export default Categories;
const styles = StyleSheet.create({
  container: {
    padding: hp('2%'),
    // paddingTop: hp('3.5%'),
    // paddingBottom: hp('8%'),
    width: wp('100%'),
    backgroundColor: 'white',
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    // paddingLeft: hp("2%"),
    // paddingRight: hp("2%"),
    // paddingTop: hp("2%")
    padding: hp('2%'),
  },
  heading: {
    paddingLeft: hp('3%'),
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 25,
  },
  backBtn: {
    paddingTop: hp('1%'),
  },
  spinnerTextStyle: {
    color: 'white',
    fontSize: 15,
  },
});
