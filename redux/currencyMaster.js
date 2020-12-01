const initialValue = {
    currencyMaster: 0
}
const currencyMasterReducer = (state = initialValue, action) => {
    console.log(action.type)
    switch (action.type) {
        case 'ADD_CURRENCYMASTER':
            return {
                ...state,
                currencyMaster: action.payload
            }
        default:
            return state
    }
    // return {
    //     type: 'ADD_CURRENCYMASTER',
    //     currencyMaster: action.payload
    // }
    // if (state != undefined) {
    //     return state
    // } else {
    //     return 2
    // }
}
export default currencyMasterReducer;