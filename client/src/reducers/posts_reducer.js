import _ from 'lodash';
import {
  FETCH_POSTS,
  CREATE_POST,
  FETCH_POST,
  UPDATE_POST,
  DELETE_POST,
} from '../actions/types';

export default function(state = {}, action) {

  switch(action.type) {
    case FETCH_POSTS:
      return _.mapKeys(action.payload, '_id');
    case CREATE_POST:
      return { ...state, [action.payload._id]: action.payload }; 
    case FETCH_POST:
      return { ...state, [action.payload._id]: action.payload };
    case UPDATE_POST:
      return { ...state, [action.payload._id]: action.payload };
    case DELETE_POST:
      return _.omit(state, action.payload);
    default:
      return state;
  }
}