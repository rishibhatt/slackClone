import * as actionTypes from './types';
/* user action types */
export const setUser = user => {
    return {
        type : actionTypes.SET_USER,
        payload : {
            currentUser : user
        }
    };
};

export const clearUser = () => {
    return {
        type : actionTypes.CLEAR_USER,
        
    };
};

/* channel action type */

export const setCurrentChannel = channel => {
    return {
        type : actionTypes.SET_CURRENT_CHANNEL,
        payload : {
            currentChannel : channel
        }
    }
};