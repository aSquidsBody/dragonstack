import { GENERATION } from './types';
import { BACKEND } from '../config';

export const fetchGeneration = () => dispatch => {
    // dispatch the fetch action
    dispatch( {type: GENERATION.FETCH });

    return fetch(`${BACKEND.ADDRESS}/generation`)
        .then(response => response.json())
        .then(json => {
            if (json.type === 'error') {
                dispatch({ 
                    type: GENERATION.FETCH_ERROR,
                    message: json.message
                });
            } else {
                // dipatch the fetch success action if fetch was successful
                dispatch({ 
                    type: GENERATION.FETCH_SUCCESS,
                    generation: json.generation
                });
            }
        })
        .catch(error => dispatch({ 
            type: GENERATION.FETCH_ERROR, 
            message: error.message 
        }));
};