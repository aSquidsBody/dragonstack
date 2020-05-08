import { ACCOUNT } from './types';
import { BACKEND } from '../config';

export const fetchFromAccount = ({ 
        endpoint, 
        options, 
        FETCH_TYPE,
        ERROR_TYPE,
        SUCCESS_TYPE 
    }) => dispatch => {
    dispatch({ type: ACCOUNT.FETCH });

    return fetch(`${BACKEND.ADDRESS}/account/${endpoint}`, options).then(response => response.json())
      .then(json => {
          if (json.type === 'error') {
              dispatch({ type: ACCOUNT.FETCH_ERROR, message: json.message });
          } else {
              dispatch({ type: SUCCESS_TYPE, ...json });
          }
      })
      .catch(error => dispatch({ 
          type: ERROR_TYPE, 
          message: error.message 
    }));
};

export const signup = ({ username, password }) => fetchFromAccount({ 
    endpoint: 'signup',
    options: {
        method: 'POST',  // defaults to GET
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'  // allows cookies to be saved on the browser. defaults to 'omit'.
    },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT.FETCH_SUCCESS
});

export const logout = () => fetchFromAccount({
    endpoint: 'logout',
    options: {
        credentials: 'include'
    },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT.FETCH_LOGOUT_SUCCESS
});

export const login = ({ username, password }) => fetchFromAccount({ 
    endpoint: 'login',
    options: {
        method: 'POST',  // defaults to GET
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'  // allows cookies to be saved on the browser. defaults to 'omit'.
    },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT.FETCH_SUCCESS
});

// named with a fetch prefix because each name for action is a verb
export const fetchAuthenticated = () => fetchFromAccount({
    endpoint: 'authenticated',
    options: {
        credentials: 'include'
    },
    FETCH_TYPE: ACCOUNT.FETCH,
    ERROR_TYPE: ACCOUNT.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT.FETCH_AUTHENTICATED_SUCCESS
});