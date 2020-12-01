// import { types } from './redux/types';
export const types = {
  APP_CONFIG: {
    TOGGLE_DRAWER: 'APP_CONFIG/TOGGLE_DRAWER',
    RESET_RIGHT_DRAWER: 'APP_CONFIG/RESET_RIGHT_DRAWER',
    OPEN_RIGHT_DRAWER: 'APP_CONFIG/OPEN_RIGHT_DRAWER',
    RELOAD: 'APP_CONFIG/RELOAD',
    RELOADPREDICTION: 'APP_CONFIG/RELOADPREDICTION',
    CLOSE_RIGHT_DRAWER: 'APP_CONFIG/CLOSE_RIGHT_DRAWER',
    // SELECTED_DRAWER_ITEM: 'APP_CONFIG/SELECTED_DRAWER_ITEM'
  },
};

export const actions = {
  toggleRightDrawer: () => ({
    type: types.APP_CONFIG.TOGGLE_DRAWER,
  }),
  resetRightDrawer: () => ({
    type: types.APP_CONFIG.RESET_RIGHT_DRAWER,
  }),
  openRightDrawer: () => ({
    type: types.APP_CONFIG.OPEN_RIGHT_DRAWER,
  }),
  closeRightDrawer: () => ({
    type: types.APP_CONFIG.CLOSE_RIGHT_DRAWER,
  }),
  reload: () => ({
    type: types.APP_CONFIG.RELOAD,
  }),
  reloadPredictionList: () => ({
    type: types.APP_CONFIG.RELOADPREDICTION,
  }),
};
// export const selectedDrawerItem = {
//     selectedDrawerItem: (name) => {
//         console.log('name : ' + name)
//     }
// }
const initState = {
  rightDrawerState: '',
  drawerItem: '',
  // predictionReload:''
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.APP_CONFIG.TOGGLE_DRAWER:
      return {...state, rightDrawerState: 'toggle'};
    case types.APP_CONFIG.OPEN_RIGHT_DRAWER:
      return {...state, rightDrawerState: 'open'};
    case types.APP_CONFIG.RESET_RIGHT_DRAWER:
      return {...state, rightDrawerState: ''};
    case types.APP_CONFIG.RELOAD:
      return {...state, rightDrawerState: 'reload'};
    case types.APP_CONFIG.CLOSE_RIGHT_DRAWER:
      return {...state, rightDrawerState: 'close'};
    case types.APP_CONFIG.RELOADPREDICTION:
      return {...state, rightDrawerState: 'predictionReload'};
    default:
      return state;
  }
}

export const setCurrencyMaster = (data) => {
  console.log(data);
  return {
    type: 'ADD_CURRENCYMASTER',
    payload: data,
  };
};
