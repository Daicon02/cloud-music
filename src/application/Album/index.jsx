import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Container, Menu, SongItem, SongList, TopDesc } from './style'
import { CSSTransition } from 'react-transition-group'
import { useNavigate } from 'react-router-dom'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
// import currentAlbum from './mock'
import { getCount, getName, isEmptyObj } from '../../api/utils'
import { HEADER_HEIGHT } from '../../api/config'
import style from '../../assets/global-style'
import { connect } from 'react-redux'
import * as actions from './store/actionCreators'
import { useParams } from 'react-router-dom'
import Loading from '../../baseUI/loading'
import SongsList from '../SongsList'

const renderTopDesc = (currentAlbum) => {
  return (
    <TopDesc background={currentAlbum.coverImgUrl}>
      <div className="background">
        <div className="filter"></div>
      </div>
      <div className="img_wrapper">
        <div className="decorate" />
        <img src={currentAlbum.coverImgUrl} alt="cover" />
        <div className="play_count">
          <i className="iconfont play">&#xe885;</i>
          <span>{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万</span>
        </div>
      </div>
      <div className="desc_wrapper">
        <div className="title">{currentAlbum.name}</div>
        <div className="person">
          <div className="avatar">
            <img src={currentAlbum.creator.avatarUrl} alt="" />
          </div>
          <div className="name">{currentAlbum.creator.nickname}</div>
        </div>
      </div>
    </TopDesc>
  )
}

const renderMenu = () => {
  return (
    <Menu>
      <div>
        <i className="iconfont">&#xe6ad;</i>
        评论
      </div>
      <div>
        <i className="iconfont">&#xe86f;</i>
        点赞
      </div>
      <div>
        <i className="iconfont">&#xe62d;</i>
        收藏
      </div>
      <div>
        <i className="iconfont">&#xe606;</i>
        更多
      </div>
    </Menu>
  )
}

const renderSongList = (currentAlbum) => {
  return (
    <SongList>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部
            <span>(共 {currentAlbum.tracks.length} 首)</span>
          </span>
        </div>
        <div className="add_list">
          <i className="iconfont">&#xe62d;</i>
          <span>收藏 ({getCount(currentAlbum.subscribedCount)})</span>
        </div>
      </div>
      <SongItem>
        {currentAlbum.tracks.map((item, index) => {
          return (
            <li key={`${index}${index}`}>
              <span className="index">{index + 1}</span>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.ar)} - {item.al.name}
                </span>
              </div>
            </li>
          )
        })}
      </SongItem>
    </SongList>
  )
}

function Album(props) {
  const { currentAlbum: data, enterLoading } = props
  const { getAlbumDispatch } = props
  const [showStatus, setShowStatus] = useState(true)
  const [isMarquee, setIsMarquee] = useState(false)
  const [title, setTitle] = useState('歌单')
  const headerRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const currentAlbum = data.toJS()

  useEffect(() => {
    getAlbumDispatch(id)
  }, [getAlbumDispatch, id])

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])
  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT
      const percent = Math.abs(pos.y / minScrollY)
      const headerDom = headerRef.current
      // 划过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color']
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
        setTitle(currentAlbum.name)
        setIsMarquee(true)
      } else {
        headerDom.style.backgroundColor = ''
        headerDom.style.opacity = 1
        setTitle('歌单')
        setIsMarquee(false)
      }
    },
    [currentAlbum]
  )
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
        <Header
          ref={headerRef}
          isMarquee={isMarquee}
          title={title}
          handleClick={handleBack}
        />
        {/* {enterLoading ? <Loading /> : null} */}

        {!isEmptyObj(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            {/* <div>
              {renderTopDesc(currentAlbum)}
              {renderMenu()}
              {renderSongList(currentAlbum)}
            </div> */}

            {renderTopDesc(currentAlbum)}
            {renderMenu()}
            <SongsList songs={currentAlbum.tracks} showCollect={false} />
          </Scroll>
        ) : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => {
  return {
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDispatch(id) {
      dispatch(actions.getCurrentAlbum(id))
      dispatch(actions.changeEnterLoading(true))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Album))
