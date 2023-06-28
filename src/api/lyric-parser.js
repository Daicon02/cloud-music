const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

class Lyric {
  constructor(lrc, handler = () => {}) {
    this.lrc = lrc
    this.lines = []
    this.handler = handler
    this.state = STATE_PAUSE
    this.curLineIndex = 0
    this.startStamp = 0
    this._initLines()
  }
  _initLines() {
    // 解析代码
    const lines = this.lrc.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      let result = timeExp.exec(line)
      if (!result) continue
      const txt = line.replace(timeExp, '').trim()
      if (txt) {
        if (result[3].length === 3) {
          result[3] = result[3] / 10
        }
        this.lines.push({
          time:
            result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
          txt,
        })
      }
    }
    this.lines.sort((a, b) => a.time - b.time)
  }

  _findCurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }
  _callHandler(i) {
    if (i < 0) return
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i,
    })
  }
  // isSeek 标识位表示用户是否手动调整进度
  _playRest(isSeek = false) {
    let line = this.lines[this.curLineIndex]
    let delay
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp)
    } else {
      // 拿到上一行的歌词开始事件，算间隔
      let preTime = this.lines[this.curLineIndex - 1]
        ? this.lines[this.curLineIndex - 1].time
        : 0
      delay = line.time - preTime
    }
    this.tiemr = setTimeout(() => {
      this._callHandler(this.curLineIndex++)
      if (
        this.curLineIndex < this.lines.length &&
        this.state === STATE_PLAYING
      ) {
        this._playRest()
      }
    }, delay)
  }

  // offset 为时间进度， isSeek 标识为表示用户是否手动调整进度
  play(offset = 0, isSeek = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING
    // 找到当前所在的hang
    this.curLineIndex = this._findCurLineIndex(offset)
    // 现在正处于第 this.curLineIndex -1 行
    // 立即定位，方式是调用传回来的回调函数，并把当前歌词信息传给它
    this._callHandler(this.curLineIndex - 1)
    this.offset = offset
    // 根据时间进度判断歌曲开始的时间戳
    this.startStamp = +new Date() - offset

    if (this.curLineIndex < this.lines.length) {
      clearTimeout(this.timer)
      // 继续播放
      this._playRest(isSeek)
    }
  }



  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.offset = offset
    } else {
      this.state = STATE_PLAYING
      this.play(offset, true)
    }
  }
  stop() {
    this.state = STATE_PAUSE
    this.offset = 0
    clearTimeout(this.timer)
  }
  seek(offset) {
    this.play(offset, true)
  }
}

export default Lyric
