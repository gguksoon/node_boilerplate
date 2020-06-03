import {
    SIGNIN_USER,
    SIGNUP_USER
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case SIGNIN_USER:
            return { ...state, signinSuccess: action.payload }
        case SIGNUP_USER:
            return { ...state, signupSuccess: action.payload }
        default:
            return state;
    }
}