import { memo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { List, ListItem } from './style'

function Horizon(props) {
    const { list, oldVal, title } = props
    const { handleClick } = props

    const Category = useRef(null)
    useEffect(() => {
        let categoryDOM = Category.current
        let tagElements = categoryDOM.querySelectorAll('span')
        let totalWidth = 0
        Array.from(tagElements).forEach(ele => {
            totalWidth += ele.offsetWidth
        })
        categoryDOM.style.width = `${totalWidth}px`
    }, [])
    return (
        <Scroll direction={'horizontal'}>
            <div ref={Category}>
                <List>
                    <span>{title}</span>
                    {list.map((item, index) => {
                        return (
                            <ListItem
                                key={`${item.key}${index}`}
                                className={`${
                                    oldVal === item.key ? 'selected' : ''
                                }`}
                                onClick={() => handleClick(item.key)}
                            >
                                {item.name}
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </Scroll>
    )
}

Horizon.defaultProps = {
    list: [],
    oldVal: '',
    title: '',
    handleClick: null,
}
Horizon.propTypes = {
    list: PropTypes.array,
    oldVal: PropTypes.string,
    title: PropTypes.string,
    handleClick: PropTypes.func,
}

export default memo(Horizon)
