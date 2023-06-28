import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import { getSongDetailRequest } from '../../../api/request'

const changeFullScreen = (data) => {
  return {
    type: actionTypes.SET_FULL_SCREEN,
    data,
  }
}

const changePlayingState = (data) => {
  return {
    type: actionTypes.SET_PLAYING_STATE,
    data,
  }
}

const changePlayMode = (data) => {
  return {
    type: actionTypes.SET_PLAY_MODE,
    data,
  }
}

const changeCurrentIndex = (data) => {
  return {
    type: actionTypes.SET_CURRENT_INDEX,
    data,
  }
}

const changeShowPlaylist = (data) => {
  return {
    type: actionTypes.SET_SHOW_PLAYLIST,
    data,
  }
}

const changeCurrentSong = (data) => {
  return {
    type: actionTypes.SET_CURRENT_SONG,
    data: fromJS(data),
  }
}

const changeSequencePlaylist = (data) => {
  return {
    type: actionTypes.SET_SEQUENCE_PALYLIST,
    data: fromJS(data),
  }
}

const changePlaylist = (data) => {
  return {
    type: actionTypes.SET_PLAYLIST,
    data: fromJS(data),
  }
}

const deleteSong = (data) => {
  return {
    type: actionTypes.DELETE_SONG,
    data,
  }
}

const insertSong = (data) => {
  return {
    type: actionTypes.INSTERT_SONG,
    data,
  }
}

const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailRequest(id).then((res) => {
      const song = res.songs[0]
      dispatch(insertSong(song))
    })
  }
}

export {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayMode,
  changePlayingState,
  changePlaylist,
  changeSequencePlaylist,
  changeShowPlaylist,
  deleteSong,
  getSongDetail,
}
