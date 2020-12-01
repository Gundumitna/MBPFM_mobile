import {reducer as appConfig} from '../AppConfigActions';
import currencyReducer from './currency/currencyReducer';
import {combineReducers} from 'redux';
const allReducers = combineReducers({
  appConfig: appConfig,
  currencyMaster: currencyReducer,
});
export default allReducers;
