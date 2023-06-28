import { useEffect, useRef, useState } from 'react'
import { ProgressBarWrapper } from './style'
import { prefixStyle } from '../../../../api/utils'

function ProgressBar(props) {
  const { percent } = props
  const { onProgressChange } = props
  const [touch, setTouch] = useState({})
  const progressBarRef = useRef()
  const progressRef = useRef()
  const progressBtnRef = useRef()
  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
      const offsetWidth = percent * barWidth
      progressRef.current.style.width = `${offsetWidth}px`
      progressBtnRef.current.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`
    }
    // eslint-disable-next-line
  }, [percent])

  const changePercent = () => {
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    const currentPercent = progressRef.current.clientWidth / barWidth
    onProgressChange(currentPercent)
  }


  const offset = (offsetWidth) => {
    progressRef.current.style.width = `${offsetWidth}px`
    progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  const progressTouchStart = (e) => {
    const startTouch = {}
    // initial 为 true 表示滑动动作开始了
    startTouch.initiated = true
    startTouch.startX = e.touches[0].pageX
    startTouch.left = progressRef.current.clientWidth
    setTouch(startTouch)
  }

  const progressTouchMove = (e) => {
    if (!touch.initiated) return
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth)
    offset(offsetWidth)
  }

  // 点击和滑动结束事件改变 percent
  const progressTouchEnd = () => {
    const endTouch = JSON.parse(JSON.stringify(touch))
    endTouch.initiated = false
    setTouch(endTouch)
    changePercent()
  }

  const progressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    offset(offsetWidth)
    changePercent()
  }

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBarRef} onClick={progressClick}>
        <div className="progress" ref={progressRef} />
        <div
          className="progress-btn-wrapper"
          ref={progressBtnRef}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn" />
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default ProgressBar
