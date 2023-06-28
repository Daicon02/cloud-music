import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import {
  getHotKeyWordsRequest,
  getResultSongsListRequest,
  getSuggestListRequest,
} from '../../../api/request'

const changeHotKeyWords = (data) => {
  return {
    type: actionTypes.SET_HOT_KEYWRODS,
    data: fromJS(data),
  }
}

const changeSuggestList = (data) => {
  return {
    type: actionTypes.SET_SUGGEST_LIST,
    data: fromJS(data),
  }
}

const changeResultSongs = (data) => {
  return {
    type: actionTypes.SET_RESULT_SONGS_LIST,
    data: fromJS(data),
  }
}

const changeEnterLoading = (data) => {
  return {
    type: actionTypes.SET_ENTER_LOADING,
    data,
  }
}

const getHotKeyWords = () => {
  return (dispatch) => {
    getHotKeyWordsRequest().then((res) => {
      const list = res.result.hots
      dispatch(changeHotKeyWords(list))
    })
  }
}

const getSuggestList = (query) => {
  return (dispatch) => {
    getSuggestListRequest(query).then((res) => {
      if (!res) return
      const data = res.result || []
      dispatch(changeSuggestList(data))
    })
    getResultSongsListRequest(query).then((res) => {
      if (!res) return
      const songs = res.result.songs || []
      dispatch(changeResultSongs(songs))
      dispatch(changeEnterLoading(false))
    })
  }
}

export { changeEnterLoading, getHotKeyWords, getSuggestList }
