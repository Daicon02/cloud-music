import { memo, forwardRef } from 'react'
import { getName } from '../../api/utils'
import { SongItem, SongList } from './style'
import { connect } from 'react-redux'
import {
  changeCurrentIndex,
  changeCurrentSong,
  changePlayingState,
  changePlaylist,
  changeSequencePlaylist,
  
} from '../Player/store/actionCreators'


const SongsList = forwardRef((props, refs) => {
  const { songs, collectCount, ShowCollect } = props
  const {
    changePlaylistDispatch,
    changeCurrentIndexDispatch,
    changeSequencePlaylistDispatch,
    changeCurrentSongDispatch,
    togglePlayingDispatch
  } = props
  const totalCount = songs.length

  const selectItem = (e, index) => {
    changePlaylistDispatch(songs)
    changeSequencePlaylistDispatch(songs)
    // console.log(index)
    changeCurrentIndexDispatch(index)
    // changeCurrentSongDispatch(songs[index])
    togglePlayingDispatch(true)
  }

  const songList = (list) => {
    const res = []
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      res.push(
        <li key={`${item.id}${i}`} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} -{' '}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏 ({Math.floor(count / 1000) / 10} 万)</span>
      </div>
    )
  }

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部 <span>(共 {totalCount} 首)</span>
          </span>
        </div>
        {ShowCollect ? collect(collectCount) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongList>
  )
})

const mapDispatchToProps = (dispatch) => {
  return {
    changePlaylistDispatch(data) {
      dispatch(changePlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeSequencePlaylistDispatch(data) {
      dispatch(changeSequencePlaylist(data))
    },
    changeCurrentSongDispatch(data) {
      dispatch(changeCurrentSong(data))
    },
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    }
  }
}

export default connect(null, mapDispatchToProps)(memo(SongsList))
