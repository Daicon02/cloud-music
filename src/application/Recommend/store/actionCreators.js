import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request'

const changeBannerList = (data) => {
  return {
    type: actionTypes.CHANGE_BANNER,
    data: fromJS(data),
  }
}

const changeRecommendList = (data) => {
  return {
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data: fromJS(data),
  }
}

const changeEnterLoading = (data) => {
  return {
    type: actionTypes.CHANGE_ENTER_LOADING,
    data,
  }
}

const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest()
      .then((data) => {
        dispatch(changeBannerList(data.banners))
      })
      .catch(() => {
        console.log('轮播图数据传输错误')
      })
  }
}

const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest()
      .then((data) => {
        dispatch(changeRecommendList(data.result))
        //  改变 loading 状态
        dispatch(changeEnterLoading(false))
      })
      .catch(() => {
        console.log('推荐歌单数据传输错误')
      })
  }
}

export {
  changeBannerList,
  changeRecommendList,
  getBannerList,
  getRecommendList,
}
