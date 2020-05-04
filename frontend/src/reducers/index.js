import generationReducer from './generation';
import dragonReducer from './dragon';
import { combineReducers } from 'redux';

export default combineReducers({ generation: generationReducer, dragon: dragonReducer });