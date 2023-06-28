import { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { getRankList } from './store/actionCreators'
import { filterIndex } from '../../api/utils'
import { Container, List, ListItem, SongList } from './style'
import Scroll from '../../baseUI/scroll'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const renderSongList = (list) => {
    return list.length ? (
        <SongList>
            {list.map((item, index) => {
                return (
                    <li key={index}>
                        {index + 1}. {item.first} - {item.second}
                    </li>
                )
            })}
        </SongList>
    ) : null
}

const renderRankList = (list, global, navigate) => {

    const enterDetail = (detail) => {
        navigate(`/rank/${detail.id}`)
    }
    return (
      <List globalRank={global}>
            {list.map((item, index) => {
                return (
                    <ListItem
                        key={`${item.coverImgId}${index}`}
                        tracks={item.tracks}
                        onClick={() => enterDetail(item)}
                    >
                        <div className="img_wrapper">
                            <img src={item.coverImgUrl} alt="cover" />
                            <div className="decorate"></div>
                            <span className="update_frequency">
                                {item.updateFrequency}
                            </span>
                        </div>
                        {renderSongList(item.tracks)}
                    </ListItem>
                )
            })}
        </List>
    )
}

function Rank(props) {
    const { rankList: list, loading } = props
    const { getRankListDispatch } = props
    const rankList = list ? list.toJS() : []
    const globalStartIndex = filterIndex(rankList)
    const officialList = rankList.slice(0, globalStartIndex)
    const globalList = rankList.slice(globalStartIndex)
    const displayStyle = loading ? { display: 'none' } : { display: '' }
    const navigate = useNavigate()
    useEffect(() => {
        getRankListDispatch()
        // eslint-disable-next-line
    }, [])

    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="official" style={displayStyle}>
                        官方榜
                    </h1>
                    {renderRankList(officialList, false, navigate)}
                    <h1 className="global" style={displayStyle}>
                        全球榜
                    </h1>
                    {renderRankList(globalList, true, navigate)}
                </div>
            </Scroll>
            <Outlet />
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        rankList: state.getIn(['rank', 'rankList']),
        loading: state.getIn(['rank', 'loading']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getRankListDispatch() {
            dispatch(getRankList())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Rank))
