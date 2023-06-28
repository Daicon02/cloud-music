import { createRef, memo, useEffect, useRef, useState } from 'react'
import { formatPlayTime, getName, prefixStyle } from '../../../api/utils'
import {
  Bottom,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
  Middle,
  NormalPlayerContainer,
  Operators,
  ProgressWrapper,
  Top,
} from './style'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import ProgressBar from './progress-bar'
import { playMode } from '../../../api/config'
import Scroll from '../../../baseUI/scroll'

function NormalPlayer(props) {
  const { song, fullScreen, playing, duration, currentTime, percent, mode } =
    props
  const {
    toggleFullScreen,
    togglePlaylist,
    clickPlaying,
    onProgressChange,
    handlePrev,
    handleNext,
    changeMode,
  } = props
  const { currentLineNum, currentPlayingLyric, currentLyric } = props
  const normalPlayerRef = useRef()
  const cdWrapperRef = useRef()
  const [currentState, setCurrentState] = useState('')
  const lyricScrollRef = useRef()
  const lyricLineRefs = useRef([])

  useEffect(() => {
    if (!lyricScrollRef.current) return
    let bScroll = lyricScrollRef.current.getBScroll()
    if (currentLineNum > 5) {
      // 保持当前歌词在第五条的位置
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current
      bScroll.scrollToElement(lineEl, 1000)
    } else {
      // 当前歌词行数 <= 5，直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000)
    }
  }, [currentLineNum])

  // 交互逻辑
  const getPlayMode = () => {
    if (mode === playMode.sequence) {
      return '&#xe625;'
    } else if (mode === playMode.loop) {
      return '&#xe653;'
    } else return '&#xe61b;'
  }

  const toggleCurrentState = () => {
    let nextState = ''
    if (currentState !== 'lyric') {
      nextState = 'lyric'
    } else {
      nextState = ''
    }
    setCurrentState(nextState)
  }

  // UI 动画逻辑
  const getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {
      x,
      y,
      scale,
    }
  }
  // 启用帧动画
  const enter = () => {
    normalPlayerRef.current.style.display = 'block'
    const { x, y, scale } = getPosAndScale()
    // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心
    const animation = {
      0: { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
      60: { transform: `translate3d(0, 0, 0) scale(1.1)` },
      100: { transform: `translate3d(0, 0, 0) scale(1)` },
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear',
      },
    })
    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation('move')
    cdWrapperDom.style.animation = ''
  }

  const transform = prefixStyle('transform')

  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = 'all 0.4s'
    const { x, y, scale } = getPosAndScale()
    cdWrapperDom.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = ''
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSS Transition 的工作只是把动画执行一遍
    // 不置为 none 现在全屏播放器页面还是存在
    normalPlayerRef.current.style.display = 'none'
  }
  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={song?.al?.picUrl + '?param=300x300'}
            width="100%"
            height="100%"
            alt="songPic"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back">
            <i
              className="iconfont icon-back"
              onClick={() => toggleFullScreen(false)}
            >
              &#xe662;
            </i>
          </div>
          <h1 className="title">{song && song.name}</h1>
          <h1 className="subtitle">{getName(song.ar)}</h1>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState !== 'lyric'}
          >
            <CDWrapper
              style={{
                visibility: currentState !== 'lyric' ? 'visible' : 'hidden',
              }}
            >
              <div className="cd">
                <img
                  src={song?.al?.picUrl + '?param=400x400'}
                  className={`image play ${playing ? '' : 'pause'}`}
                  alt="cdPic"
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState === 'lyric'}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  className="lyric_wrapper"
                  style={{
                    visibility: currentState === 'lyric' ? 'visible' : 'hidden',
                  }}
                >
                  {currentLyric ? (
                    currentLyric.lines.map((item, index) => {
                      // 拿到每一行歌词的 DOM 对象，作为滚动歌词需要
                      lyricLineRefs.current[index] = createRef()
                      return (
                        <p
                          className={`text ${
                            currentLineNum === index ? 'current' : ''
                          }`}
                          key={`${item}${index}`}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      )
                    })
                  ) : (
                    <p className="text pure">纯音乐，请欣赏。</p>
                  )}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                onProgressChange={onProgressChange}
              />
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            {/* 播放模式 */}
            <div className="icon i-left">
              <i
                className="iconfont"
                onClick={changeMode}
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            {/* 上一曲 */}
            <div className="icon i-left">
              <i className="iconfont" onClick={handlePrev}>
                &#xe6e1;
              </i>
            </div>
            {/* 播放/暂停键 */}
            <div className="icon i-center">
              {playing ? (
                <i
                  className="iconfont"
                  onClick={(e) => clickPlaying(e, !playing)}
                >
                  &#xe723;
                </i>
              ) : (
                <i
                  className="iconfont"
                  onClick={(e) => clickPlaying(e, !playing)}
                >
                  &#xe731;
                </i>
              )}
            </div>
            {/* 下一曲 */}
            <div className="icon i-right">
              <i className="iconfont" onClick={handleNext}>
                &#xe718;
              </i>
            </div>
            {/* 歌曲列表 */}
            <div className="icon i-right">
              <i className="iconfont" onClick={togglePlaylist}>
                &#xe640;
              </i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}

export default memo(NormalPlayer)
