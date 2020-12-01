import {
  FETCH_CURRENCY_REQUEST,
  FETCH_CURRENCY_SUCCESS,
  FETCH_CURRENCY_FAILURE,
} from './currencyType';
import axois from 'axios';
export const fetchUsersRequest = () => {
  return {
    type: FETCH_CURRENCY_REQUEST,
  };
};

export const fetchUsersSuccess = (currency) => {
  return {
    type: FETCH_CURRENCY_SUCCESS,
    payload: currency,
  };
};
export const fetchUsersFailure = (error) => {
  return {
    type: FETCH_CURRENCY_FAILURE,
    payload: error,
  };
};
export const fetchCurrency = () => {
  return (dispatch) => {
    dispatch(fetchUsersRequest());
    console.log('in fetchCurrency');
    axois
      .get(global.baseURL + 'currency/all')
      .then((response) => {
        const currency = response.data;
        console.log(currency);
        let list = [];

        for (let d of response.data.data) {
          let li = {};
          list[d.currency] = d;
          // list.push(li)
        }
        console.log(list);
        dispatch(fetchUsersSuccess(list));
      })
      .catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchUsersFailure(errorMsg));
      });
  };
};
