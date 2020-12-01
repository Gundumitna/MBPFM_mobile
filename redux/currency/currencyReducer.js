import { FETCH_CURRENCY_REQUEST, FETCH_CURRENCY_SUCCESS, FETCH_CURRENCY_FAILURE } from './currencyType'

const initialState = {
    loading: false,
    currency: [],
    error: ''
}
const reducer = (state = initialState, action) => {
    console.log(action.payload)
    switch (action.type) {
        case FETCH_CURRENCY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_CURRENCY_SUCCESS:
            return {

                loading: false,
                currency: action.payload,
                error: ''
            }
        case FETCH_CURRENCY_FAILURE:
            return {

                loading: false,
                currency: [],
                error: action.payload
            }
        default: return state
    }
}
export default reducer