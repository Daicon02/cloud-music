import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    useMemo
} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import { PullDownLoading, PullUpLoading, ScrollContainer } from './style'
import Loading from '../loading'
import { debounce } from '../../api/utils'

const Scroll = forwardRef((props, ref) => {
    const {
        direction,
        click,
        refresh,
        pullUpLoading,
        pullDownLoading,
        bounceTop,
        bounceBottom,
        pullUp,
        pullDown,
        onScroll,
    } = props

    const PullUpDisplayStyle = pullUpLoading
        ? { display: '' }
        : { display: 'none' }
    const PullDownDisplayStyle = pullDownLoading
        ? { display: '' }
        : { display: 'none' }

    // better-scroll 实例对象
    const [bScroll, setBScroll] = useState()
    // current 指向初始化 bs 实例需要的 DOM 元素
    const scrollContainerRef = useRef()
    // 上拉下拉防抖
    const pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp])
    const pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown])
    // 创建 better-scroll
    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === 'horizontal',
            scrollY: direction === 'vertical',
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom,
            },
            mouseWheel: true,
        })
        setBScroll(scroll)
        return () => {
            setBScroll(null)
            scroll && scroll.destroy()
        }
        // eslint-disable-next-line
    }, [])
    // 每次重新渲染刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh()
        }
    })
    // 给实例绑定 scroll 事件
    useEffect(() => {
        if (!bScroll || !onScroll) return
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll)
        })
    })
    // 上拉到底判断，调用上拉刷新函数
    useEffect(() => {
        // console.log('pull up')
        if (!bScroll || !pullUp) return
        // 判断是否滑到了底部
        const handlePullUp = () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce()
            }
        }
        bScroll.on('scrollEnd', handlePullUp)
        return () => {
            bScroll.off('scrollEnd', handlePullUp)
        }
    }, [pullUp, pullUpDebounce, bScroll])
    // 下拉到底判断，调用下拉刷新函数
    useEffect(() => {
        if (!bScroll || !pullDown) return
        // 判断用户的下拉动作
        const handlePullDown = (pos) => {
            if (pos.y > 50) {
                pullDownDebounce()
            }
        }
        bScroll.on('touchEnd', handlePullDown)
        return () => {
            bScroll.off('touchEnd', handlePullDown)
        }
    }, [pullDown, pullDownDebounce ,bScroll])
    // 将方法暴露给外界组件
    useImperativeHandle(ref, () => {
        return {
            // 暴露 refresh 方法
            refresh() {
                if (bScroll) {
                    bScroll.refresh()
                    bScroll.scrollTo(0, 0)
                }
            },
            getBScroll() {
                if (bScroll) {
                    return bScroll
                }
            },
        }
    })
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            <PullDownLoading style={PullDownDisplayStyle}>
                <Loading />
            </PullDownLoading>
            <PullUpLoading style={PullUpDisplayStyle}>
                <Loading />
            </PullUpLoading>
        </ScrollContainer>
    )
})

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizontal']), // 滚动方向
    click: PropTypes.bool, // 是否支持点击
    refresh: PropTypes.bool, // 是否刷新
    onScroll: PropTypes.func, // 滑动触发的函数
    pullUp: PropTypes.func, // 上拉加载逻辑
    pullDown: PropTypes.func, // 下拉加载逻辑
    pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool, // 是否支持向上吸顶
    bounceBottom: PropTypes.bool, // 是否支持向下吸顶
}

Scroll.defaultProps = {
    direction: 'vertical',
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true,
}

export default Scroll
