import { fromJS } from 'immutable'
import {
  CHANGE_ATRIST,
  CHANGE_SONGS_OF_ARTIST,
  CHANGE_ENTER_LOADING,
} from './constants'
import { getSingerInfoRequest } from '../../../api/request'

const changeEnterLoading = (data) => {
  return {
    type: CHANGE_ENTER_LOADING,
    data,
  }
}

const changeSongs = (data) => {
  return {
    type: CHANGE_SONGS_OF_ARTIST,
    data: fromJS(data),
  }
}

const changeArtist = (data) => {
  return {
    type: CHANGE_ATRIST,
    data: fromJS(data),
  }
}

const getSingerInfo = (id) => {
  return (dispatch) => {
    getSingerInfoRequest(id)
      .then((res) => {
        // console.log(res)
        dispatch(changeArtist(res.artist))
        dispatch(changeSongs(res.hotSongs))
        dispatch(changeEnterLoading(false))
      })
      .catch(() => console.log('获取歌手信息失败'))
  }
}

export { getSingerInfo, changeEnterLoading }
