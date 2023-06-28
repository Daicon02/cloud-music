import { fromJS } from 'immutable'
import * as actionTypes from './constants'
import {
    getHotSingerListRequest,
    getSingerListRequest,
} from '../../../api/request'

// actions
const changeSingerList = (data) => {
    return {
        type: actionTypes.CHANGE_SINGER_LIST,
        data: fromJS(data),
    }
}

const changePageCount = (data) => {
    return {
        type: actionTypes.CHANGE_PAGE_COUNT,
        data,
    }
}

const changeEnterLoading = (data) => {
    return {
        type: actionTypes.CHANGE_ENTER_LOADING,
        data,
    }
}

const changePullUpLoading = (data) => {
    return {
        type: actionTypes.CHANGE_PULLUP_LOADING,
        data,
    }
}

const changePullDownLoading = (data) => {
    return {
        type: actionTypes.CHANGE_PULLDOWN_LOADING,
        data,
    }
}

const changeAB = (data) => {
    return {
        type: actionTypes.CHANGE_AB,
        data
    }
}
const changeCategory = (data) => {
    return {
        type: actionTypes.CHANGE_CATEGORY,
        data
    }
}

// 异步 api
// 第一次加载热门歌手
const getHotSingerList = () => {
    return (dispatch) => {
        getHotSingerListRequest(0)
            .then((res) => {
                const data = res.artists
                dispatch(changeSingerList(data))
                dispatch(changeEnterLoading(false))
                dispatch(changePullDownLoading(false))
            })
            .catch(() => {
                console.log('热门歌手数据获取失败')
            })
    }
}

// 加载更多热门歌手
const refreshMoreHotSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount'])
        const singerList = getState().getIn(['singers', 'singerList']).toJS()
        getHotSingerListRequest(pageCount)
            .then((res) => {
                const data = [...singerList, ...res.artists]
                dispatch(changeSingerList(data))
                dispatch(changePullUpLoading(false))
            })
            .catch(() => {
                console.log('热门歌手数据获取失败')
            })
    }
}

// 第一次加载对应类别的歌手
const getSingerList = () => {
    return (dispatch, getState) => {
        const ab = getState().getIn(['singers', 'ab'])
        const category = getState().getIn(['singers', 'category'])
        getSingerListRequest(category, ab, 0)
            .then((res) => {
                const data = res.artists
                dispatch(changeSingerList(data))
                dispatch(changeEnterLoading(false))
                dispatch(changePullDownLoading(false))
            })
            .catch(() => {
                console.log('第一次类别歌手数据获取失败')
            })
    }
}

// 加载更多歌手
const refreshMoreSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount'])
        const singerList = getState().getIn(['singers', 'singerList']).toJS()
        const ab = getState().getIn(['singers', 'ab'])
        const category = getState().getIn(['singers', 'category'])
        getSingerListRequest(category, ab, pageCount)
            .then((res) => {
                const data = [...singerList, ...res.artists]
                dispatch(changeSingerList(data))
                dispatch(changePullUpLoading(false))
            })
            .catch(() => {
                console.log('歌手数据获取失败')
            })
    }
}



export {
    changePageCount,
    changePullUpLoading,
    changePullDownLoading,
    changeEnterLoading,
    changeCategory,
    changeAB,
    getHotSingerList,
    getSingerList,
    refreshMoreHotSingerList,
    refreshMoreSingerList,
}
