import { useParams } from 'react-router-dom'
import {
  BgLayer,
  CollectButton,
  Container,
  ImgWrapper,
  SongListWrapper,
} from './style'
import { CSSTransition } from 'react-transition-group'
import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../baseUI/header'
// import artist from './mock'
import Scroll from '../../baseUI/scroll'
import SongsList from '../SongsList'
import { HEADER_HEIGHT } from '../../api/config'
import { connect } from 'react-redux'
import { changeEnterLoading, getSingerInfo } from './store/actionCreators'
import Loading from '../../baseUI/loading'

function Singer(props) {
  const {
    artist: immutableArtist,
    songList: immutableSongList,
    loading,
  } = props
  const { getSingerInfoDispatch } = props

  const artist = immutableArtist.toJS()
  const songList = immutableSongList.toJS()
  const [showStatus, setShowStatus] = useState(true)
  const collectButtonRef = useRef()
  const imageWrapperRef = useRef()
  const songScrollWrapperRef = useRef()
  const songScrollRef = useRef()
  const headerRef = useRef()
  const layerRef = useRef()
  // 初始图片高度
  const initialHeight = useRef(0)
  // 向上偏移尺寸，露出圆角
  const OFFSET = 10

  const navigate = useNavigate()
  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])
  const handleScroll = useCallback((pos) => {
    const height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapperRef.current
    const buttonDOM = collectButtonRef.current
    const headerDOM = headerRef.current
    const layerDOM = layerRef.current
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
    // 滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height)
    // 下拉 图片放大，按钮跟着偏移
    if (newY > 0) {
      imageDOM.style['transform'] = `scale(${1 + percent})`
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } else if (newY >= minScrollY) {
      // 上拉 但是遮罩还没超过 Header 部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = '75%'
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      // 按钮跟着移动并且逐渐透明
      buttonDOM.style['transform'] = `translatr3d(0, ${newY}px, 0)`
      buttonDOM.style['opacity'] = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      // 上滑 但是超过 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与 Header 一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  }, [])
  const { id } = useParams()
  useEffect(() => {
    getSingerInfoDispatch(id)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const h = imageWrapperRef.current.offsetHeight
    songScrollWrapperRef.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    // 把遮罩先放在下面，以裹住歌曲列表
    layerRef.current.style.top = `${h - OFFSET}px`

    songScrollRef.current.refresh()
  }, [])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      onExited={() => navigate(-1)}
      unmountOnExit
    >
      <Container>
        {loading ? <Loading /> : null}
        <Header ref={headerRef} title={artist.name} handleClick={handleBack} />
        <ImgWrapper ref={imageWrapperRef} bgUrl={artist.picUrl}>
          <div className="filter" />
        </ImgWrapper>
        <CollectButton ref={collectButtonRef}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layerRef} />
        <SongListWrapper ref={songScrollWrapperRef}>
          <Scroll ref={songScrollRef} onScroll={handleScroll}>
            <SongsList songs={songList} showCollect={false} />
          </Scroll>
        </SongListWrapper>
      </Container>
    </CSSTransition>
  )
}
const mapStateToProps = (state) => {
  return {
    artist: state.getIn(['singerInfo', 'artist']),
    songList: state.getIn(['singerInfo', 'songList']),
    loading: state.getIn(['singerInfo', 'loading']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSingerInfoDispatch(id) {
      dispatch(getSingerInfo(id))
      dispatch(changeEnterLoading(true))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Singer))
