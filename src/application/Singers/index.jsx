import { memo, useState, useEffect, useRef } from 'react'
import Horizon from '../../baseUI/horizon-item'
import { alphaTypes, categoryTypes } from '../../api/config'
import { List, ListContainer, ListItem, NavContainer } from './style'
import Scroll from '../../baseUI/scroll'
import * as actions from './store/actionCreators'
import { connect } from 'react-redux'
import Loading from '../../baseUI/loading'
import { EnterLoading } from '../../baseUI/loading/style'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

// 渲染歌手列表
const renderList = (singerList, navigate) => {
  const enterDetail = (id) => {
    navigate(`/singers/${id}`)
  }
  return (
    <List>
      {singerList.toJS().map((item, index) => {
        return (
          <ListItem
            key={`${item.accountId}${index}`}
            onClick={() => enterDetail(item.id)}
          >
            <div className="img_wrapper">
              <LazyLoad>
                <img
                  src={`${item.picUrl}?param=300x300`}
                  width="100%"
                  height="100%"
                  alt="singer"
                />
              </LazyLoad>
            </div>
            <span className="name">{item.name}</span>
          </ListItem>
        )
      })}
    </List>
  )
}

function Singers(props) {
  const {
    getHotSingerListDispatch,
    pullDownRefreshDispatch,
    pullUpRefreshDispach,
    updateAb,
    updateCategory,
  } = props
  const {
    singerList,
    enterLoading,
    pullDownLoading,
    pullUpLoading,
    pageCount,
    ab,
    category,
  } = props

  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const handleUpdateAb = (newAb) => {
    if (newAb === ab) return
    updateAb(newAb)
  }
  const handleUpdateCategory = (newCat) => {
    if (newCat === category) return
    updateCategory(newCat)
  }
  const handlePullUp = () => {
    pullUpRefreshDispach(category === '' && ab === '', pageCount)
  }
  const handlePullDown = () => {
    pullDownRefreshDispatch(category, ab)
  }
  useEffect(() => {
    if (!singerList.length && !category && !ab) {
      getHotSingerListDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const enterLoadingStyle = enterLoading ? { display: '' } : { display: 'none' }
  return (
    <NavContainer>
      <Horizon
        list={categoryTypes}
        title={'分类（默认热门）:'}
        oldVal={category}
        handleClick={(val) => handleUpdateCategory(val)}
      />
      <Horizon
        list={alphaTypes}
        title={'首字母:'}
        oldVal={ab}
        handleClick={(val) => handleUpdateAb(val)}
      />
      <ListContainer>
        <EnterLoading style={enterLoadingStyle}>
          <Loading />
        </EnterLoading>
        <Scroll
          ref={scrollRef}
          pullDown={handlePullDown}
          pullUp={handlePullUp}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
        >
          {renderList(singerList, navigate)}
        </Scroll>
      </ListContainer>
      <Outlet />
    </NavContainer>
  )
}

const mapStateToProps = (state) => {
  return {
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount']),
    ab: state.getIn(['singers', 'ab']),
    category: state.getIn(['singers', 'category']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerListDispatch() {
      dispatch(actions.getHotSingerList())
    },
    updateAb(newAb) {
      dispatch(actions.changeAB(newAb))
      dispatch(actions.getSingerList())
    },
    updateCategory(newCat) {
      dispatch(actions.changeCategory(newCat))
      dispatch(actions.getSingerList())
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispach(hot, count) {
      dispatch(actions.changePullUpLoading(true))
      dispatch(actions.changePageCount(count + 1))
      if (hot) {
        dispatch(actions.refreshMoreHotSingerList())
        // actions.refreshMoreHotSingerList()
      } else {
        dispatch(actions.refreshMoreSingerList())
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch(category, ab) {
      dispatch(actions.changePullDownLoading(true))
      dispatch(actions.changePageCount(0))
      if (category === '' && ab === '') {
        dispatch(actions.getHotSingerList())
      } else {
        dispatch(actions.getSingerList())
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Singers))
