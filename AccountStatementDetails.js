import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {Grid, Row, Col} from 'react-native-easy-grid';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import {useDispatch, useSelector} from 'react-redux';

function AccountStatementDetails({route, navigation}) {
  const dispatch = useDispatch();
  const currencyMaster = useSelector((state) => state.currencyMaster);

  useEffect(() => {
    console.log(route.params);
    return () => {};
  }, []);
  return (
    <View>
      {/* <ImageBackground resizeMode={'contain'} style={{ maxWidth: wp("100%"), maxxHeight: hp('100%') }} source={require('./assets/graph_bg(dark).png')}> */}
      <View style={{zIndex: 1}}>
        <Image
          resizeMode={'contain'}
          style={{maxWidth: '100%'}}
          source={require('./assets/graph_bg(dark).png')}></Image>
      </View>
      {/* <ScrollView > */}
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.navigate('accountStatementPage')}>
              <View>
                <Image source={require('./assets/icons-back.png')}></Image>
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.heading}>Details</Text>
            </View>
          </View>
          <Card containerStyle={{borderRadius: 15, padding: 0}}>
            <View>
              <Grid>
                <Row style={{maxWidth: '100%', maxHeight: '100%'}}>
                  <Col size={2}>
                    <View style={styles.cardCol_1}>
                      <Image
                        resizeMode={'contain'}
                        style={styles.cardCol_1Img}
                        source={{
                          uri:
                            global.baseURL +
                            'customer/' +
                            route.params.assetData.assetDetails[34].value,
                        }}></Image>
                    </View>
                  </Col>
                  <Col size={3.5} style={styles.cardCol_2}>
                    {route.params.assetData.assetDetails[3].value !=
                      undefined &&
                    route.params.assetData.assetDetails[3].value != null ? (
                      <Text style={styles.cardCol_2Text_1}>
                        {route.params.assetData.assetDetails[3].value.replace(
                          /.(?=.{4})/g,
                          '.',
                        )}
                      </Text>
                    ) : null}
                    {route.params.assetData.assetDetails[1].value !=
                      undefined &&
                    route.params.assetData.assetDetails[1].value != null ? (
                      <Text style={styles.cardCol_2Text_2}>
                        {route.params.assetData.assetDetails[1].value}
                      </Text>
                    ) : null}
                  </Col>
                  <Col size={6.5} style={styles.cardCol_3}>
                    <ImageBackground
                      style={{maxWidth: '100%', height: '100%'}}
                      source={require('./assets/yellowbackground.png')}>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          paddingTop: 10,
                          paddingRight: 18,
                        }}>
                        <View style={styles.cardCol_3ImgView}>
                          <Image
                            resizeMode={'contain'}
                            style={styles.cardCol_3FIImg}
                            source={{uri: route.params.fiLogo}}></Image>
                        </View>
                        {route.params.fiName != null &&
                        route.params.fiName != undefined ? (
                          <Text style={{fontSize: 10, color: 'white'}}>
                            {route.params.fiName}
                          </Text>
                        ) : null}
                      </View>
                    </ImageBackground>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <View style={styles.cardBalView}>
                      <Text style={styles.cardBalText}>Balance</Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 12,
                            textAlign: 'left',
                            fontWeight: 'bold',
                            marginTop: 'auto',
                            marginTop: 3,
                            marginRight: 3,
                          }}>
                          {route.params.assetData.assetDetails[7].value}
                        </Text>
                        {route.params.assetData.assetDetails[22] != undefined &&
                        route.params.assetData.assetDetails[22] != null &&
                        route.params.assetData.assetDetails[22].value !=
                          undefined &&
                        route.params.assetData.assetDetails[22].value !=
                          null ? (
                          <NumberFormat
                            value={Number(
                              route.params.assetData.assetDetails[22].value,
                            )}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={global.decimalScale}
                            decimalScale={
                              currencyMaster.currency[
                                route.params.assetData.assetDetails[7].value
                              ] != undefined
                                ? currencyMaster.currency[
                                    route.params.assetData.assetDetails[7].value
                                  ].decimalFormat
                                : 0
                            }
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={styles.cardBalAmt}>{value}</Text>
                            )}
                          />
                        ) : (
                          <NumberFormat
                            value={0}
                            displayType={'text'}
                            thousandsGroupStyle={global.thousandsGroupStyle}
                            thousandSeparator={global.thousandSeparator}
                            decimalScale={
                              currencyMaster.currency[
                                route.params.assetData.assetDetails[7].value
                              ] != undefined
                                ? currencyMaster.currency[
                                    route.params.assetData.assetDetails[7].value
                                  ].decimalFormat
                                : 0
                            }
                            fixedDecimalScale={true}
                            // prefix={'₹'}
                            renderText={(value) => (
                              <Text style={styles.cardBalAmt}>{value}</Text>
                            )}
                          />
                        )}
                      </View>
                    </View>
                    <View style={styles.stmtDetails}>
                      <Text style={styles.stmtLabel}>Account Holder Name</Text>
                      {route.params.assetData.assetDetails[2] != undefined &&
                      route.params.assetData.assetDetails[2] != null &&
                      route.params.assetData.assetDetails[2].value !=
                        undefined &&
                      route.params.assetData.assetDetails[2].value != null ? (
                        <Text style={styles.stmtText}>
                          {route.params.assetData.assetDetails[2].value}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.stmtDetails}>
                      <Text style={styles.stmtLabel}>Branch Name</Text>
                      {route.params.assetData.assetDetails[4] != undefined &&
                      route.params.assetData.assetDetails[4] != null &&
                      route.params.assetData.assetDetails[4].value !=
                        undefined &&
                      route.params.assetData.assetDetails[4].value != null ? (
                        <Text style={styles.stmtText}>
                          {route.params.assetData.assetDetails[4].value}
                        </Text>
                      ) : null}
                    </View>
                    {/* <View style={styles.stmtDetails}>
                                                <Text style={styles.stmtLabel}>Account Opening Date</Text>
                                                <Text style={styles.stmtText}>26/02/2002</Text>
                                            </View> */}
                    <View style={styles.stmtDetails}>
                      <Text style={styles.stmtLabel}>Nominee</Text>
                      {route.params.assetData.assetDetails[20] != undefined &&
                      route.params.assetData.assetDetails[20] != null &&
                      route.params.assetData.assetDetails[20].value != null &&
                      route.params.assetData.assetDetails[20].value !=
                        undefined ? (
                        <Text style={styles.stmtText}>
                          {route.params.assetData.assetDetails[20].value}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.stmtDetails}>
                      <Text style={styles.stmtLabel}>Uncleared Amount</Text>
                      {route.params.assetData.assetDetails[27] != undefined &&
                      route.params.assetData.assetDetails[27] != null &&
                      route.params.assetData.assetDetails[27].value !=
                        undefined &&
                      route.params.assetData.assetDetails[27].value != null ? (
                        <NumberFormat
                          value={Number(
                            route.params.assetData.assetDetails[27].value,
                          )}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          renderText={(value) => (
                            <Text style={styles.stmtText}>{value}</Text>
                          )}
                        />
                      ) : (
                        <NumberFormat
                          value={0}
                          displayType={'text'}
                          thousandsGroupStyle={global.thousandsGroupStyle}
                          thousandSeparator={global.thousandSeparator}
                          decimalScale={global.decimalScale}
                          fixedDecimalScale={true}
                          renderText={(value) => (
                            <Text style={styles.stmtText}>{value}</Text>
                          )}
                        />
                      )}
                    </View>
                    {/* <View style={styles.stmtDetails}>
                                                <Text style={styles.stmtLabel}>Overdraft Limit</Text>
                                                <NumberFormat
                                                    value={100000}
                                                    thousandsGroupStyle="lakh"
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    // prefix={'₹'}
                                                    renderText={value => <Text style={styles.stmtText}>{value}</Text>}
                                                />
                                            </View> */}
                    <View style={styles.stmtDetails}>
                      {route.params.assetData.assetDetails[25] != undefined &&
                      route.params.assetData.assetDetails[25] != null &&
                      route.params.assetData.assetDetails[25].value !=
                        undefined &&
                      route.params.assetData.assetDetails[25].value != null ? (
                        <>
                          <Text style={styles.stmtLabel}>Interest Rate</Text>

                          <Text style={styles.stmtText}>
                            {Number(
                              route.params.assetData.assetDetails[25].value,
                            ).toFixed(2)}
                          </Text>
                        </>
                      ) : null}
                    </View>
                  </Col>
                </Row>
              </Grid>
            </View>
          </Card>
        </ScrollView>
      </View>
      {/* </ScrollView> */}
      {/* </ImageBackground> */}
    </View>
  );
}

export default AccountStatementDetails;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: hp('2%'),
    paddingTop: hp('2.5%'),
    width: wp('100%'),
    // height: hp('100%'),
    zIndex: 10,
    // top: wp('30%')
  },
  topHeader: {
    flexDirection: 'row',
    paddingLeft: hp('2%'),
    paddingRight: hp('2%'),
    paddingTop: hp('2%'),
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
  cardCol_1: {
    width: hp('8%'),
    height: hp('8%'),
    marginBottom: 35,
    marginTop: 10,
    marginLeft: 10,
  },
  cardCol_1Img: {
    maxWidth: '100%',
    height: '100%',
  },
  cardCol_2: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  cardCol_2Text_1: {
    color: '#454F63',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: hp('2%'),
    marginLeft: hp('2%'),
  },
  cardCol_2Text_2: {
    color: '#888888',
    fontSize: 12,
    marginLeft: hp('2%'),
  },
  cardCol_3: {
    // alignItems: 'flex-end',
    // width: hp('10%'),
    // height: hp('16.5%')
  },
  cardCol_3ImgView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  cardCol_3FIImg: {
    maxWidth: '100%',
    height: '100%',
    borderRadius: hp('50%'),
  },
  cardBalView: {
    marginLeft: hp('3%'),
    marginRight: hp('3%'),
    marginBottom: hp('3%'),
    paddingBottom: hp('3%'),
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 1,
  },
  cardBalText: {
    color: '#888888',
    fontSize: 10,
  },
  cardBalAmt: {
    color: '#454F63',
    fontSize: 24,
  },
  stmtDetails: {
    paddingLeft: hp('3%'),
    paddingRight: hp('3%'),
    paddingBottom: hp('2%'),
  },
  stmtLabel: {
    color: '#454F63',
    fontSize: 14,
    opacity: 0.7,
    paddingBottom: 5,
  },
  stmtText: {
    color: '#454F63',
    fontSize: 14,
  },
});
