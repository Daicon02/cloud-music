import { MiniPlayerContainer } from './style'
import { getName } from '../../../api/utils'
import { CSSTransition } from 'react-transition-group'
import { useRef } from 'react'
import ProgressCircle from './progress-circle'

function MiniPlayer(props) {
  const { song, fullScreen, playing, percent } = props
  const { toggleFullScreen, clickPlaying, togglePlaylist } = props
  const miniPlayerRef = useRef()

  return (
    <CSSTransition
      classNames="mini"
      in={!fullScreen}
      timeout={400}
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? '' : 'pause'}`}
              src={song.al && song.al.picUrl}
              alt="img"
              width="40"
              height="40"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control" onClick={(e) => clickPlaying(e, !playing)}>
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i className="iconfont icon-mini icon-pause">&#xe650;</i>
            ) : (
              <i className="iconfont icon-mini icon-play">&#xe61e;</i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont" onClick={togglePlaylist}>&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default MiniPlayer
