import { fromJS } from 'immutable'
import { playMode } from '../../../api/config'
import * as actionTypes from './constants'
// import { mockPlaylist } from '../playlist/mock'
import _, { curry } from 'lodash'
import { findCurrentIndex } from '../../../api/utils'

const defaultState = fromJS({
  fullScreen: false,
  playing: false,
  sequencePlaylist: [],
  playlist: [],
  mode: playMode.sequence,
  currentIndex: -1,
  showPlaylist: false,
  currentSong: {},
})

const handleDeleteSong = (state, song) => {
  const newPlaylist = _.cloneDeep(state.get('playlist').toJS())
  const newSequencePlaylist = _.cloneDeep(state.get('sequencePlaylist').toJS())
  const currentIndex = state.get('currentIndex')
  let newIndex
  // 找对应歌曲在播放列表里的索引
  const targetPlaylistIndex = findCurrentIndex(song, newPlaylist)
  // 在播放列表中删除
  newPlaylist.splice(targetPlaylistIndex, 1)
  // 如果删除的歌曲在当前歌曲前面 currentIndex -- ，让当前歌曲正常播放
  if (targetPlaylistIndex < currentIndex) {
    newIndex = currentIndex - 1
  }
  // 在 sequencePlaylist 中直接删除
  const targetSequenceIndex = findCurrentIndex(song, newSequencePlaylist)
  newSequencePlaylist.splice(targetSequenceIndex, 1)

  return state.merge({
    playlist: fromJS(newPlaylist),
    sequencePlaylist: fromJS(newSequencePlaylist),
    currentIndex: fromJS(newIndex),
  })
}

const handleInsertSong = (state, song) => {
  const newPlaylist = _.cloneDeep(state.get('playlist').toJS())
  const newSequenceList = _.cloneDeep(state.get('sequencePlaylist').toJS())
  let currentIndex = state.get('currentIndex')
  // 看看有没有同款
  const fpIndex = findCurrentIndex(song, newPlaylist)
  // 如果是当前歌曲直接不处理
  if (fpIndex === currentIndex && currentIndex !== -1 ) {
    return state
  }
  currentIndex++
  // 把歌放进去，放到当前播放曲目的下一个位置
  newPlaylist.splice(currentIndex, 0, song)
  // 如果列表中已经存在要添加的歌，命名为 oldSong
  if (fpIndex > -1) {
    // 如果 oldSong 的索引再目前播放歌曲的索引小，那么删除它，同时当前 index 要 --
    if (currentIndex > fpIndex) {
      newPlaylist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 否则直接删掉 oldSong
      newPlaylist.splice(fpIndex + 1, 1)
    }
  }
  // 同理，处理 sequenceList
  let sequenceIndex =
    findCurrentIndex(newPlaylist[currentIndex], newSequenceList) + 1
  let fsIndex = findCurrentIndex(song, newSequenceList)
  // 插入歌曲
  newSequenceList.splice(sequenceIndex, 0, song)
  if (fsIndex > -1) {
    // 跟上面的类似逻辑。如果在前面就删掉，index -- 如果在后面就直接删除
    if (sequenceIndex > fsIndex) {
      newSequenceList.splice(fsIndex, 1)
      sequenceIndex--
    } else {
      newSequenceList.splice(fsIndex + 1, 1)
    }
  }
  return state.merge({
    playlist: fromJS(newPlaylist),
    sequencePlaylist: fromJS(newSequenceList),
    currentIndex: fromJS(currentIndex),
  })
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data)
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playing', action.data)
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data)
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data)
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlaylist', action.data)
    case actionTypes.SET_PLAYLIST:
      return state.set('playlist', action.data)
    case actionTypes.SET_SEQUENCE_PALYLIST:
      return state.set('sequencePlaylist', action.data)
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data)
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data)
    case actionTypes.INSTERT_SONG:
      return handleInsertSong(state, action.data)
    default:
      return state
  }
}

export default reducer
