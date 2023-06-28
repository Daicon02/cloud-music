import { connect } from 'react-redux'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import * as actions from './store/actionCreators'
import MiniPlayer from './mini-player'
// import currentSong from './mock'
import NormalPlayer from './normal-palyer'
// import { mockPlaylist } from './playlist/mock'
import {
  findCurrentIndex,
  getSongUrl,
  // isEmptyObj,
  shuffle,
} from '../../api/utils'
import { playMode } from '../../api/config'
import Playlist from './playlist'
import { getLyricRequest } from '../../api/request'
// import Lyric from '../../api/lyric-parser'
import Lyric from '../../api/lyric-parser2'

// import _ from 'lodash'

function Player(props) {
  const {
    fullScreen,
    playing,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
    // showPlaylist,
    playlist: immutablePlaylist,
    sequencePlaylist: immutableSequencePlaylist,
  } = props
  const {
    toggleFullScreenDispatch,
    togglePlaylistDispatch,
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlaylistDispatch,
  } = props
  const currentSong = immutableCurrentSong.toJS()
  const playlist = immutablePlaylist.toJS()
  const sequencePlaylist = immutableSequencePlaylist.toJS()
  // const playlist = mockPlaylist
  // const currentSong = playlist[0]

  const [preSong, setPreSong] = useState({})
  // 当前播放时长
  const [currentTime, setCurrentTime] = useState(0)
  // 总时长
  const [duration, setDuration] = useState(0)
  const [currentPlayingLyric, setPlayingLyric] = useState('')
  // 进度
  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration
  const audioRef = useRef()
  const songReady = useRef(true)
  const currentLyric = useRef()
  const currentLineNum = useRef(0)
  // 监听组件状态
  useEffect(() => {
    if (
      !playlist.length ||
      currentIndex === -1 ||
      !playlist[currentIndex] ||
      playlist[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return
    songReady.current = false
    const current = playlist[currentIndex]
    changeCurrentDispatch(current)
    audioRef.current.src = getSongUrl(current.id)
    audioRef.current.autoplay = true
    playing
      ? audioRef.current.play().then(
          () => (songReady.current = true),
          (err) => console.log(err)
        )
      : audioRef.current.pause()
    console.log(playing)
    togglePlayingDispatch(true)
    setPreSong(current)
    getLyric(current.id)
    setCurrentTime(0)
    setDuration((current.dt / 1000) | 0)
    setPlayingLyric('')
    // eslint-disable-next-line
  }, [playlist, currentIndex])

  useEffect(() => {
    playing
      ? audioRef.current.play().then(
          () => (songReady.current = true),
          (err) => console.log(err)
        )
      : audioRef.current.pause()
  }, [playing])

  // 点击播放/暂停
  const clickPlaying = useCallback(
    (e, state) => {
      e.stopPropagation()
      togglePlayingDispatch(state)
      if (currentIndex === -1) return
      state ? audioRef.current.play() : audioRef.current.pause()
      if (currentLyric.current) {
        currentLyric.current.togglePlay(currentTime * 1000)
      }
    },
    // eslint-disable-next-line 
    [currentLyric, currentTime]
  )

  // 获取当前播放时间
  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime)
  }
  // 点击/滑动切换播放进度
  const onProgressChange = useCallback(
    (currentPercent) => {
      const newTime = currentPercent * duration
      setCurrentTime(newTime)
      audioRef.current.currentTime = newTime
      if (!playing) {
        togglePlayingDispatch(true)
      }
      if (currentLyric.current) {
        currentLyric.current.seek(newTime * 1000)
      }
    },
    // eslint-disable-next-line
    [duration, playing, togglePlayingDispatch, currentLyric]
  )

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current.play()
  }
  // 上一曲
  const handlePrev = useCallback(() => {
    // playlist 只有一首歌时单曲循环
    if (playlist.length === 1) {
      handleLoop()
      return
    }
    let index
    currentIndex - 1 < 0
      ? (index = playlist.length - 1)
      : (index = currentIndex - 1)
    changeCurrentIndexDispatch(index)
    if (!playing) {
      togglePlayingDispatch(true)
    }
    // eslint-disable-next-line
  }, [playing, playlist, currentIndex])
  // 下一曲
  const handleNext = useCallback(() => {
    // playlist 只有一首歌时单曲循环
    if (playlist.length === 1) {
      handleLoop()
      return
    }
    let index
    currentIndex + 1 === playlist.length
      ? (index = 0)
      : (index = currentIndex + 1)
    changeCurrentIndexDispatch(index)
    if (!playing) {
      togglePlayingDispatch(true)
    }
    // eslint-disable-next-line
  }, [playing, playlist, currentIndex])

  // 歌曲播放完毕后
  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  const changeMode = useCallback(() => {
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
      // 随机播放
      const newList = shuffle(sequencePlaylist)
      const index = findCurrentIndex(currentSong, newList)
      changePlaylistDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    changeModeDispatch(newMode)
    // eslint-disable-next-line
  }, [mode, sequencePlaylist, currentSong])

  const handleTogglePlaylist = (e) => {
    e.stopPropagation()
    togglePlaylistDispatch(true)
  }
  const handleClearPresong = () => {
    setPreSong({})
    audioRef.current.src = ''
    songReady.current = true
  }

  const handleError = () => {
    songReady.current = true
    alert('播放出错')
  }

  const getLyric = (id) => {
    let lyric = ''
    if (currentLyric.current) {
      currentLyric.current.stop()
    }
    getLyricRequest(id)
      .then((res) => {
        lyric = res.lrc.lyric

        if (!lyric) {
          currentLyric.current = null
          return
        }
        currentLyric.current = new Lyric(lyric, handleLyric)

        currentLyric.current.play()
        currentLineNum.current = 0
        currentLyric.current.seek(0)
      })
      .catch(() => {
        songReady.current = true
        audioRef.current.play()
      })
  }
  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return
    currentLineNum.current = lineNum
    setPlayingLyric(txt)
  }

  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        playing={playing}
        duration={duration}
        currentTime={currentTime}
        percent={percent}
        mode={mode}
        toggleFullScreen={toggleFullScreenDispatch}
        togglePlaylist={handleTogglePlaylist}
        clickPlaying={clickPlaying}
        onProgressChange={onProgressChange}
        handlePrev={handlePrev}
        handleNext={handleNext}
        changeMode={changeMode}
        currentLyric={currentLyric.current}
        currentPlayingLyric={currentPlayingLyric}
        currentLineNum={currentLineNum.current}
      />
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        playing={playing}
        duration={duration}
        currentTime={currentTime}
        percent={percent}
        toggleFullScreen={toggleFullScreenDispatch}
        togglePlaylist={handleTogglePlaylist}
        clickPlaying={clickPlaying}
      />
      <Playlist clearPreSong={handleClearPresong} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fullScreen: state.getIn(['player', 'fullScreen']),
    playing: state.getIn(['player', 'playing']),
    sequencePlaylist: state.getIn(['player', 'sequencePlaylist']),
    playlist: state.getIn(['player', 'playlist']),
    mode: state.getIn(['player', 'mode']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    showPlaylist: state.getIn(['player', 'showPlaylist']),
    currentSong: state.getIn(['player', 'currentSong']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(actions.changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
      dispatch(actions.changeFullScreen(data))
    },
    togglePlaylistDispatch(data) {
      dispatch(actions.changeShowPlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(actions.changeCurrentIndex(data))
    },
    changeCurrentDispatch(data) {
      dispatch(actions.changeCurrentSong(data))
    },
    changeModeDispatch(data) {
      dispatch(actions.changePlayMode(data))
    },
    changePlaylistDispatch(data) {
      dispatch(actions.changePlaylist(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Player))
