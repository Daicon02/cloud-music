import { fromJS } from "immutable";
import * as actionTypes from './constants'
export const defaultState = fromJS({
    singerList: [],
    enterLoading: true,     // 控制进场 Loading 动画
    pullUpLoading: false,   // 控制上拉加载动画    
    pullDownLoading: false, // 控制下拉加载动画
    pageCount: 0,           // 分页控制，当前页数
    ab: '',                 // 保存字母表选项
    category: '',           // 保存分类选项
})

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return state.set('singerList', action.data)
        case actionTypes.CHANGE_PAGE_COUNT:
            return state.set('pageCount', action.data)
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data)
        case actionTypes.CHANGE_PULLUP_LOADING:
            return state.set('pullUpLoading', action.data)
        case actionTypes.CHANGE_PULLDOWN_LOADING:
            return state.set('pullDownLoading', action.data)
        case actionTypes.CHANGE_AB:
            return state.merge({
                'ab': action.data,
                pageCount: 0,
                enterLoading: true,
            })
        case actionTypes.CHANGE_CATEGORY:
            return state.merge({
                'category': action.data,
                pageCount: 0,
                enterLoading: true,
            })
        default:
            return state
    }
}

export default reducer