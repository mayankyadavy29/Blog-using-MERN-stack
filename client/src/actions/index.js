import axios from 'axios';
import { reset } from 'redux-form';
import {
  AUTH_USER,
  UNAUTH_USER,

  FETCH_PROFILE,
  CLEAR_PROFILE,
  UPDATE_PROFILE,

  FETCH_POSTS,
  CREATE_POST,
  FETCH_POST,
  UPDATE_POST,
  DELETE_POST,

  CHECK_AUTHORITY,

  CREATE_COMMENT,
  FETCH_COMMENTS,
} from './types';

const ROOT_URL = '/api';

export function signinUser({ email, password }, historyPush, historyReplace) {
  return function(dispatch) {

    axios.post(`${ROOT_URL}/signin`, { email, password }) 
      .then(response => {
        localStorage.setItem('token', response.data.token);

        dispatch({
          type: AUTH_USER,
          payload: response.data.username,
        });
        historyPush('/posts');
      })
      .catch(() => {  
        historyReplace('/signin', {
          time: new Date().toLocaleString(),
          message: 'The email and/or password are incorrect.'
        });
      });
  }
}

export function signupUser({ email, password, firstName, lastName }, historyPush, historyReplace) {

  return function(dispatch) {

    axios.post(`${ROOT_URL}/signup`, { email, password, firstName, lastName }) 
      .then(response => {

        historyPush('/signin', { time: new Date().toLocaleString(), message: response.data.message });
      })
      .catch(({response}) => {  

        historyReplace('/signup', { time: new Date().toLocaleString(), message: response.data.message });
      });
  }
}

export function signoutUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

export function verifyJwt() {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/verify_jwt`, {
      headers: { authorization: localStorage.getItem('token') }
    }).then((response) => {
      dispatch({
        type: AUTH_USER,
        payload: response.data.username,
      });
    });
  }
}


export function fetchProfile() {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/profile`, {
      headers: { authorization: localStorage.getItem('token') }
    }).then(response => {
      dispatch({
        type: FETCH_PROFILE,
        payload: response.data.user,
      });
    });
  }
}

export function clearProfile() {
  return { type: CLEAR_PROFILE };
}

export function updateProfile({ firstName, lastName, birthday, sex, phone, address, occupation, description }, historyReplace) {

  return function(dispatch) {
    axios.put(`${ROOT_URL}/profile`, {
        firstName,
        lastName,
        birthday,
        sex,
        phone,
        address,
        occupation,
        description,
      }, {  
        headers: {authorization: localStorage.getItem('token')},  
      }
    )
      .then((response) => {  
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data.user,
        });
        dispatch({
          type: AUTH_USER,
          payload: response.data.user.firstName + ' ' + response.data.user.lastName,
        });
        historyReplace('/profile', {
          status: 'success',
          time: new Date().toLocaleString(),
          message: 'You have successfully updated your profile.',
        });
      })
      .catch(() => { 
        historyReplace('/profile', {
          status: 'fail',
          time: new Date().toLocaleString(),
          message: 'Update profile failed. Please try again.',
        });
      });
  }
}

export function changePassword({ oldPassword, newPassword }, historyReplace) {

  return function(dispatch) {
    axios.put(`${ROOT_URL}/password`, {
      oldPassword,
      newPassword,
    }, {
      headers: {authorization: localStorage.getItem('token')}, 
    })
      .then((response) => {
        dispatch(reset('settings'));  
        historyReplace('/settings', {
          status: 'success',
          time: new Date().toLocaleString(),
          message: response.data.message,
        });
      })
      .catch(({response}) => {
        historyReplace('/settings', {
          status: 'fail',
          time: new Date().toLocaleString(),
          message: response.data.message,
        });
      });
  }
}


export function fetchPosts() {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/posts`).then((response) => {
      dispatch({
        type: FETCH_POSTS,
        payload: response.data,
      });
    });
  }
}

export function createPost({ title, categories, content }, historyPush, historyReplace) {

  return function(dispatch) {
    axios.post(`${ROOT_URL}/posts`, {
      title,
      categories,
      content,
    }, {
      headers: {authorization: localStorage.getItem('token')},  
    })
      .then((response) => {  
        dispatch({
          type: CREATE_POST,
          payload: response.data,
        });
        historyPush(`/posts/${response.data._id}`);
      })
      .catch(({response}) => { 
        historyReplace('/posts/new', {
          time: new Date().toLocaleString(),
          message: response.data.message,
        });
      });
  }
}

export function fetchPost(id) {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/posts/${id}`).then(response => {
      dispatch({
        type: FETCH_POST,
        payload: response.data,
      });
    });
  }
}

export function updatePost({ _id, title, categories, content }, onEditSuccess, historyReplace) {

  return function(dispatch) {
    axios.put(`${ROOT_URL}/posts/${_id}`, {
      _id,
      title,
      categories,
      content,
    }, {
      headers: {authorization: localStorage.getItem('token')}, 
    })
      .then((response) => {
        dispatch({
          type: UPDATE_POST,
          payload: response.data,
        });
        onEditSuccess();  
        historyReplace(`/posts/${_id}`, null);
      })
      .catch(({response}) => {
        historyReplace(`/posts/${_id}`, {
          time: new Date().toLocaleString(),
          message: response.data.message,
        });
      });
  }
}

export function deletePost(id, historyPush) {

  return function(dispatch) {
    axios.delete(`${ROOT_URL}/posts/${id}`, {
      headers: {authorization: localStorage.getItem('token')},
    }).then((response) => {
      dispatch({
        type: DELETE_POST,
        payload: id,
      });
      historyPush('/posts');
    })
  }
}

export function fetchPostsByUserId() {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/my_posts`, {
      headers: {authorization: localStorage.getItem('token')}, 
    })
      .then((response) => {
        dispatch({
          type: FETCH_POSTS,
          payload: response.data,
        });
      });
  }
}

export function createComment({ comment, postId }, clearTextEditor, historyReplace) {

  return function(dispatch) {
    axios.post(`${ROOT_URL}/comments/${postId}`, { content: comment }, {
      headers: {authorization: localStorage.getItem('token')},  
    })
      .then((response) => {  
        dispatch({
          type: CREATE_COMMENT,
          payload: response.data,
        });
        dispatch(reset('comment_new'));
        clearTextEditor();  
        historyReplace(`/posts/${postId}`, null);
      })
      .catch(({response}) => {

        if (!response.data.message) {
          return historyReplace(`/posts/${postId}`, {
            time: new Date().toLocaleString(),
            message: 'You must sign in before you can post new comment.',
          });
        }

        historyReplace(`/posts/${postId}`, {
          time: new Date().toLocaleString(),
          message: response.data.message,
        });
      });
  }
}

export function fetchComments(postId) {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/comments/${postId}`).then((response) => {
      dispatch({
        type: FETCH_COMMENTS,
        payload: response.data,
      });
    });
  }
}

export function checkAuthority(postId) {

  return function(dispatch) {
    axios.get(`${ROOT_URL}/allow_edit_or_delete/${postId}`, {
      headers: {authorization: localStorage.getItem('token')},  
    }).then((response) => {
      dispatch({
        type: CHECK_AUTHORITY,
        payload: response.data.allowChange,
      });
    }).catch(() => {  
      dispatch({
        type: CHECK_AUTHORITY,
        payload: false,
      })
    });
  }
}