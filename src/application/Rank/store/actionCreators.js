import { fromJS } from 'immutable'
import { CHANGE_LOADING, CHANGE_RANK_LIST } from './constants'
import { getRankListRequest } from '../../../api/request'

const changeRankList = (data) => {
    return {
        type: CHANGE_RANK_LIST,
        data: fromJS(data),
    }
}

const changeLoading = (data) => {
    return {
        type: CHANGE_LOADING,
        data,
    }
}

const getRankList = () => {
    return (dispatch) => {
        getRankListRequest()
            .then((data) => {
                const list = data && data.list
                dispatch(changeRankList(list))
                dispatch(changeLoading(false))
            })
            .catch(() => {
                console.log('获取排行列表失败')
            })
    }
}

export { getRankList }
