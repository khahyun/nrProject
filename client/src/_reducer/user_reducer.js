import {
    LOGIN_USER
} from '../_actions/types';

export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
                     //빈상태
            return { ...state, loginSuccess: action.payload }
            break;

        default:
            return state;
    }
}