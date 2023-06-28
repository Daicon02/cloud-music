import { axiosInstance } from './config'

const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}

const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}

const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

const getSingerListRequest = (category, ab, count) => {
  return axiosInstance.get(
    `/artist/list?cat=${category}&initial=${ab.toLowerCase()}&offset=${count}`
  )
}

const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`)
}

const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`)
}

const getSingerInfoRequest = (id) => {
  return axiosInstance.get(`/artists?id=${id}`)
}

const getLyricRequest = (id) => {
  return axiosInstance.get(`/lyric?id=${id}`)
}

const getHotKeyWordsRequest = () => {
  return axiosInstance.get('/search/hot')
}

const getSuggestListRequest = (query) => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`)
}

const getResultSongsListRequest = (query) => {
  return axiosInstance.get(`/search?keywords=${query}`)
}

const getSongDetailRequest = (id) => {
  return axiosInstance.get(`/song/detail?ids=${id}`)
}

export {
  getBannerRequest,
  getRecommendListRequest,
  getHotSingerListRequest,
  getSingerListRequest,
  getRankListRequest,
  getAlbumDetailRequest,
  getSingerInfoRequest,
  getLyricRequest,
  getHotKeyWordsRequest,
  getSuggestListRequest,
  getResultSongsListRequest,
  getSongDetailRequest
}
