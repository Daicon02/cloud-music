// 获取播放总数
const getCount = (count) => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 1e7) / 10 + '亿'
  }
}

// 防抖
const debounce = (func, delay) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
      clearTimeout(timer)
    }, delay)
  }
}

// 处理数据，找到第一个没有歌名的排行榜的索引
const filterIndex = (rankList) => {
  for (let i = 0; i < rankList.length; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1
    }
  }
}

// 处理歌手列表拼接多名歌手名字
const getName = (list) => {
  let str = ''
  if (!list) return
  list.forEach((item, index) => {
    str += index === 0 ? item.name : '/' + item.name
  })
  return str
}

// 判断空对象
const isEmptyObj = (obj) => {
  return !obj || Object.keys(obj).length === 0
}

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
const elementStyle = document.createElement('div').style

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'Transform',
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

const prefixStyle = (style) => {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 拼接歌曲的 url 链接
const getSongUrl = (id) => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 转换歌曲播放时间
const formatPlayTime = (interval) => {
  interval = interval | 0
  const minute = (interval / 60) | 0
  const second = (interval % 60).toString().padStart(2, '0')
  return `${minute}:${second}`
}

// 随机算法
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const shuffle = (arr) => {
  const newArr = []
  arr.forEach((item) => {
    newArr.push(item)
  })
  for (let i = 0; i < newArr.length; i++) {
    const j = getRandomInt(0, i)
    const t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}

// 找到当前歌曲索引
const findCurrentIndex = (song, list) => {
  return list.findIndex((item) => song.id === item.id)
}

export {
  getCount,
  debounce,
  filterIndex,
  getName,
  isEmptyObj,
  prefixStyle,
  getSongUrl,
  formatPlayTime,
  shuffle,
  findCurrentIndex
}
