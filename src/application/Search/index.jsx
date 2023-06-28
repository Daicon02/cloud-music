import { CSSTransition } from 'react-transition-group'
import { Container, HotKey, ShortcutWrapper } from './style'
import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBox from '../../baseUI/search-box'
import {
  changeEnterLoading,
  getHotKeyWords,
  getSuggestList,
} from './store/actionCreators'
import { connect } from 'react-redux'
import Scroll from '../../baseUI/scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading'
import { List, ListItem } from '../Singers/style'
import { SongItem } from '../SongsList/style'
import { getName } from '../../api/utils'
import { changePlaylist, getSongDetail } from '../Player/store/actionCreators'

function Search(props) {
  const {
    hotList,
    enterLoading,
    suggestList: immutableSuggestList,
    songsList: immutableSongsList,
    songsCount,
  } = props
  const {
    getHotKeyWordsDispatch,
    getSuggestListDispatch,
    changeEnterLoadingDispatch,
    getSongDetailDispatch,
  } = props

  const suggestList = immutableSuggestList.toJS()
  const songsList = immutableSongsList.toJS()

  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    setShow(true)
    if (!hotList.size) {
      getHotKeyWordsDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const searchBack = () => {
    setShow(false)
  }

  const handleQuery = (q) => {
    setQuery(q)
    if (!q) return
    changeEnterLoadingDispatch(true)
    getSuggestListDispatch(q)
  }

  const renderHotKey = () => {
    const list = hotList ? hotList.toJS() : []
    return (
      <ul>
        {list.map((item, index) => {
          return (
            <li
              className="item"
              key={`${item.first}${index}`}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderSingers = () => {
    const singers = suggestList.artists
    if (!singers || !singers.length) return
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={`${item.accountId}${index}`}
              onClick={() => navigate(`/singers/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      src={require('./singer.png')}
                      width="100%"
                      height="100%"
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="singer"
                  />
                </LazyLoad>
              </div>
              <span className="name">歌手：{item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }
  const renderAlbum = () => {
    const albums = suggestList.playlists
    if (!albums || !albums.length) return
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={`${item.accountId}${index}`}
              onClick={() => navigate(`/album/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      src={require('./music.png')}
                      alt="album"
                      width="100%"
                      height="100%"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    alt="album"
                    width="100%"
                    height="100%"
                  />
                </LazyLoad>
              </div>
              <span className="name">歌单：{item.name}</span>
            </ListItem>
          )
        })}
      </List>
    )
  }
  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: '20px' }}>
        {songsList.map((item, index) => {
          return (
            <li key={`${item.id}${index}`} onClick={(e) => selectItem(e,item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          )
        })}
      </SongItem>
    )
  }

  const selectItem = (e, id) => {
    e.stopPropagation()
    getSongDetailDispatch(id)
  }

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container play={songsCount}>
        <SearchBox
          back={searchBack}
          newQuery={query}
          handleQuery={handleQuery}
        ></SearchBox>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScroll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>

      </Container>
    </CSSTransition>
  )
}

// const defaultState = fromJS({
//   hotList: [],
//   suggestList: [],
//   songsList: [],
//   enterLoading: false,
// })

const mapStateToProps = (state) => {
  return {
    hotList: state.getIn(['search', 'hotList']),
    suggestList: state.getIn(['search', 'suggestList']),
    songsList: state.getIn(['search', 'songsList']),
    enterLoading: state.getIn(['search', 'enterLoading']),
    songsCount: state.getIn(['player', 'playlist']).size,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords())
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data))
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSongDetailDispatch(data) {
      dispatch(getSongDetail(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Search))
