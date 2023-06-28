import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchBoxWrapper } from './style'
import { debounce } from '../../api/utils'

function SearchBox(props) {
  // 从父组件热门搜索中拿到的新关键字
  const { newQuery } = props
  // 父组件针对搜索关键字请求相关的处理
  const { handleQuery } = props
  const [query, setQuery] = useState('')
  const queryRef = useRef()
  // 根据关机字是否存在决定清空按钮的提示
  const displayStyle = query ? { display: 'block' } : { display: 'none' }

  useEffect(() => {
    queryRef.current.focus()
  }, [])

  useEffect(() => {
    handleQueryDebounce(query)
  }, [query])

  useEffect(() => {
    if (newQuery !== query) {
      setQuery(newQuery)
    }
  }, [newQuery])

  const handleChange = (e) => {
    // 搜索框内容改变
    setQuery(e.currentTatget.value)
  }

  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500)
  }, [handleQuery])

  const clearQuery = () => {
    // 清空搜括框内容
    setQuery('')
    queryRef.current.focus()
  }
  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={props.back}>
        &#xe655;
      </i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        value={query}
        onChange={handleChange}
      />
      <i
        className="iconfont icon-delete"
        onClick={clearQuery}
        style={displayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  )
}

export default SearchBox
