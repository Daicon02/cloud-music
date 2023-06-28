import { forwardRef, memo } from 'react'
import { HeaderContainer } from './style'
import PropTypes from 'prop-types'

const Header = forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>
        &#xe655;
      </i>
      {isMarquee ? (
        // eslint-disable-next-line
        <marquee>
          <h1>{title}</h1>
        </marquee>
      ) : (
        <h1>{title}</h1>
      )}
    </HeaderContainer>
  )
})

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool
}

Header.defaultProps = {
  handleClick: () => {},
  title: 'title',
  isMarquee: false
}

export default memo(Header)
