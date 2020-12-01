import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import allReducers from './index';

// const reducer = combineReducers(reducersDucks);

export const store = createStore(allReducers, applyMiddleware(thunk));
