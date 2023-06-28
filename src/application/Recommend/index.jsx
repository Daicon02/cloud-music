import { memo, useEffect } from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll'
import { Content } from './style'
import * as actionTypes from './store/actionCreators'
import { connect } from 'react-redux'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading'
import { EnterLoading } from '../../baseUI/loading/style'
import { Outlet } from 'react-router-dom'

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []
  return (
    <Content>
      {enterLoading ? (
        <EnterLoading>
          <Loading />
        </EnterLoading>
      ) : null}
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      <Outlet />
    </Content>
  )
}
// 映射 redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => {
  // 不要在这里将数据 toJS
  // 不然每次 diff 对比 props 的时候都是不一样的引用，导致不必要的重新渲染
  return {
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
  }
}

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Recommend))
