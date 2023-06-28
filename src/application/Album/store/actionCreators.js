import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import { getAlbumDetailRequest } from '../../../api/request'

const changeCurrentAlbum = (data) => {
  return {
    type: actionTypes.CHANGE_CURRENT_ALBUM,
    data: fromJS(data),
  }
}

const changeEnterLoading = (data) => {
  return {
    type: actionTypes.CHANGE_ENTER_LOADING,
    data,
  }
}

const getCurrentAlbum = (id) => {
  return (dispatch) => {
    getAlbumDetailRequest(id)
      .then((res) => {
        const data = res.playlist
        dispatch(changeCurrentAlbum(data))
        dispatch(changeEnterLoading(false))
      })
      .catch(() => console.log('获取 album 数据失败'))
  }
}

export { changeEnterLoading, getCurrentAlbum }
