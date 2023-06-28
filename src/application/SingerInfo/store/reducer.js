import { fromJS } from 'immutable'
import * as actionTypes from './constants'

const defaultState = fromJS({
  artist: {},
  songList: [],
  loading: true,
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ATRIST:
      return state.set('artist', action.data)
    case actionTypes.CHANGE_SONGS_OF_ARTIST:
      return state.set('songList', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('loading', action.data)
    default:
      return state
  }
}

export default reducer
