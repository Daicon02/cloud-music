import { memo, useRef, useState } from 'react'
import {
  ListContent,
  ListHeader,
  PlaylistWrapper,
  ScrollWrapper,
} from './style'
import { CSSTransition } from 'react-transition-group'
import {
  findCurrentIndex,
  getName,
  prefixStyle,
  shuffle,
} from '../../../api/utils'
import { connect } from 'react-redux'
import * as actions from '../store/actionCreators'
import { playMode } from '../../../api/config'
import Scroll from '../../../baseUI/scroll'
import Confirm from '../../../baseUI/confirm'

function Playlist(props) {
  const {
    showPlaylist,
    currentIndex,
    currentSong: immutableCurrentSong,
    playlist: immutablePlaylist,
    sequencePlaylist: immutableSequencePlaylist,
    mode,
  } = props
  const {
    togglePlaylistDispatch,
    changeCurrentIndexDispatch,
    changePlaylistDispatch,
    changeModeDispatch,
    deleteSongDispatch,
    clearDispatch,
    clearPreSong
  } = props
  const currentSong = immutableCurrentSong.toJS()
  const playlist = immutablePlaylist.toJS()
  const sequencePlaylist = immutableSequencePlaylist.toJS()
  const [isShow, setIsShow] = useState(false)
  // 是否允许 scroll
  const [canTouch, setCanTouch] = useState(true)
  // touchStart 后记录 y 值
  const [startY, setStartY] = useState(0)
  // touchStart 事件是否已经触发
  const [initialed, setInitialed] = useState(0)
  // 用户下滑距离
  const [distance, setDistance] = useState(0)
  const playlistRef = useRef()
  const listWrapperRef = useRef()
  const confirmRef = useRef()
  const listContentRef = useRef()
  const transform = prefixStyle('transform')

  // 控制交互逻辑
  const getCurrentIcon = (item) => {
    // 判断是不是当前正在播放的歌曲
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;' : ''
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    )
  }
  const getPlayMode = () => {
    let content, text
    if (mode === playMode.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    } else if (mode === playMode.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    } else {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={() => handleChangeMode()}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className="text" onClick={() => handleChangeMode()}>
          {text}
        </span>
      </div>
    )
  }
  // 切换播放模式
  const handleChangeMode = () => {
    const newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序播放
      changePlaylistDispatch(sequencePlaylist)
      const index = findCurrentIndex(currentSong, sequencePlaylist)
      changeCurrentIndexDispatch(index)
    } else if (newMode === 1) {
      // 单曲循环
      changePlaylistDispatch(sequencePlaylist)
    } else if (newMode === 2) {
      const newList = shuffle(sequencePlaylist)
      const index = findCurrentIndex(currentSong, newList)
      changePlaylistDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    changeModeDispatch(newMode)
  }
  // 切换歌曲
  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }
  // 删除歌曲
  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }
  // 清空歌曲列表提示
  const handleShowClear = () => {
    confirmRef.current.show()
  }
  // 清空歌曲列表
  const handleConfirmClear = () => {
    clearDispatch()
    clearPreSong()
  }

  // 控制 UI 动画
  const onEnterCB = () => {
    setIsShow(true)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }
  const onEnteringCB = () => {
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
    listWrapperRef.current.style['transition'] = 'all 0.3s'
  }
  const onExitingCB = () => {
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }
  const onExitedCB = () => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }
  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return
    setDistance(0)
    listWrapperRef.current.style['transition'] = ''
    // 记录 y 值
    setStartY(e.nativeEvent.touches[0].pageY)
    setInitialed(true)
  }
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return
    const newDistance = e.nativeEvent.touches[0].pageY - startY
    if (newDistance < 0) return
    setDistance(newDistance)
    listWrapperRef.current.style[
      transform
    ] = `translate3d(0, ${newDistance}px, 0)`
  }
  const handleTouchEnd = (e) => {
    setInitialed(false)
    // 设置阈值
    if (distance >= 150) {
      // 大于阈值则关闭 playlist
      togglePlaylistDispatch(false)
    } else {
      // 否则反弹
      listWrapperRef.current.style['transition'] = 'all 0.3s'
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
    }
  }
  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 playlist
    let state = pos.y === 0
    setCanTouch(state)
  }
  return (
    <CSSTransition
      in={showPlaylist}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlaylistWrapper
        ref={playlistRef}
        style={isShow ? { display: 'block' } : { display: 'none' }}
        onClick={() => togglePlaylistDispatch(false)}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playlist.map((item, index) => {
                  return (
                    <li
                      className="item"
                      key={`${item.id}${index}`}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span
                        className="delete"
                        onClick={(e) => handleDeleteSong(e, item)}
                      >
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  )
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text={'是否全部删除'}
          cancelBtnText={'取消'}
          confirmBtnText={'确定'}
          handleConfirm={handleConfirmClear}
        />
      </PlaylistWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => {
  return {
    currentIndex: state.getIn(['player', 'currentIndex']),
    currentSong: state.getIn(['player', 'currentSong']),
    playlist: state.getIn(['player', 'playlist']),
    sequencePlaylist: state.getIn(['player', 'sequencePlaylist']),
    showPlaylist: state.getIn(['player', 'showPlaylist']),
    mode: state.getIn(['player', 'mode']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlaylistDispatch(data) {
      dispatch(actions.changeShowPlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(actions.changeCurrentIndex(data))
    },
    changeModeDispatch(data) {
      dispatch(actions.changePlayMode(data))
    },
    changePlaylistDispatch(data) {
      dispatch(actions.changePlaylist(data))
    },
    deleteSongDispatch(data) {
      dispatch(actions.deleteSong(data))
    },
    clearDispatch() {
      // 重置组件状态
      dispatch(actions.changePlaylist([]))
      dispatch(actions.changeSequencePlaylist([]))
      dispatch(actions.changeCurrentIndex(-1))
      dispatch(actions.changeShowPlaylist(false))
      dispatch(actions.changeCurrentSong({}))
      dispatch(actions.changePlayingState(false))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(memo(Playlist))
