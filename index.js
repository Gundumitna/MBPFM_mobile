import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {Text, TextInput} from 'react-native';
// import {createStore} from 'redux';
if (Text.defaultProps == null) Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent('androidPFM', () => App);

if (Platform.OS === 'web') {
  const rootTag =
    document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('androidPFM', {rootTag});
}

// const increment = () => {
//   return {
//     type: 'INCREMENT',
//   };
// };

// const decrement = () => {
//   return {
//     type: 'DECREMENT',
//   };
// };

// const counter = (state = 0, action) => {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//   }
// };

// let store = createStore(counter);

// store.subscribe(() => {
//   console.log(store.getState());
// });
// store.dispatch(increment());
// store.dispatch(decrement());
