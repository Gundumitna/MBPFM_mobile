import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import NumberFormat from 'react-number-format';
import {useSelector} from 'react-redux';
function AmountDisplay(props) {
  //   const [global, setGlobal] = useState({});
  const currencyMaster = useSelector((state) => state.currencyMaster);
  //   useEffect(() => {
  //    // setGlobal(JSON.parse(localStorage.getItem('configDetails')));
  //     return () => {
  //       // cleanup
  //     };
  //   }, []);
  return (
    <NumberFormat
      value={props.amount}
      displayType={'text'}
      thousandsGroupStyle={
        global != undefined ? global.thousandsGroupStyle : ''
      }
      thousandSeparator={global != undefined ? global.thousandSeparator : null}
      decimalScale={
        currencyMaster.currency[props.currency] != undefined
          ? currencyMaster.currency[props.currency].decimalFormat
          : 0
      }
      fixedDecimalScale={true}
      renderText={(value) => (
        <Text
          style={
            props.style == undefined
              ? {fontSize: 22, color: 'white'}
              : props.style
          }>
          {value}
        </Text>
      )}
    />

    // <NumberFormat
    //     value={props.amount}
    //     displayType={'text'}
    //     thousandsGroupStyle={global != undefined ? global.thousandsGroupStyle : ''}
    //     thousandSeparator={global != undefined ? global.thousandSeparator : null}
    //     decimalScale={currencyMaster.currency[props.currency] != undefined ? currencyMaster.currency[props.currency].decimalFormat : 0}
    //     fixedDecimalScale={true}
    //     // prefix={'₹'}
    //     renderText={value => <>
    //         <sup className="cur">{props.currency}</sup><span >{value.split(".")[0]}
    //             {currencyMaster.currency[props.currency] != undefined && currencyMaster.currency[props.currency].decimalFormat != 0
    //                 ?
    //                 <sup className="des">.{value.split(".")[1]}</sup>
    //                 :
    //                 null}
    //         </span></>}
    // />
  );
}

export default AmountDisplay;
