<template>
  <view class="page">
    <view class="status-bar" />
    <text class="top-subtitle">值得看么 - 穿越千年的诗意邂逅</text>

    <view class="nav-row">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="rgba(255,255,255,0.7)" />
      </view>
      <text class="recitation-label">R E C I T A T I O N   M O D E</text>
      <view style="width:72rpx;" />
    </view>

    <view class="poem-header">
      <text class="poem-title">{{ poem.title }}</text>
      <text class="poem-author">{{ poem.dynasty }} · {{ poem.author }}</text>
    </view>

    <view class="lines-area">
      <text
        v-for="(line, i) in poem.lines" :key="i"
        class="poem-line"
        :class="{ 'line-active': i === currentLine, 'line-dim': i !== currentLine }"
        @click="seekToLine(i)"
      >{{ line }}</text>
    </view>

    <view class="progress-wrap">
      <view class="time-row">
        <text class="time-text">{{ formatTime(currentTime) }}</text>
        <text class="time-text">{{ formatTime(duration) }}</text>
      </view>
      <view
        class="progress-track"
        @touchstart="onProgressTouchStart"
        @touchmove.stop.prevent="onProgressTouchMove"
        @touchend="onProgressTouchEnd"
      >
        <view class="progress-fill" :style="{ width: progress + '%' }" />
        <view class="progress-thumb" :style="{ left: progress + '%' }" />
      </view>
    </view>

    <view class="controls">
      <view class="ctrl-btn" @click="prev">
        <view class="ctrl-icon-wrap">
          <view class="ctrl-bar" />
          <view class="ctrl-tri ctrl-tri-left" />
        </view>
      </view>
      <view class="play-btn" @click="togglePlay">
        <view v-if="audioLoading" class="loading-spinner" />
        <view v-else-if="!playing" class="tri-play" />
        <view v-else class="pause-bars">
          <view class="pause-bar" /><view class="pause-bar" />
        </view>
      </view>
      <view class="ctrl-btn" @click="next">
        <view class="ctrl-icon-wrap">
          <view class="ctrl-tri ctrl-tri-right" />
          <view class="ctrl-bar" />
        </view>
      </view>
    </view>

    <!-- 音色选择 -->
    <view class="vcn-wrap">
      <view class="vcn-toggle" @click="showVcnPanel = !showVcnPanel">
        <text class="vcn-toggle-text">{{ currentVcnLabel }}</text>
        <view class="vcn-toggle-arrow" :class="{ 'arrow-open': showVcnPanel }" />
      </view>
      <view v-if="showVcnPanel" class="vcn-panel">
        <view
          v-for="v in vcnOptions" :key="v.value"
          class="vcn-item" :class="{ 'vcn-item-active': vcn === v.value }"
          @click="onVcnChange(v.value)"
        >
          <text class="vcn-item-name" :class="{ 'vcn-item-name-active': vcn === v.value }">{{ v.label }}</text>
          <text v-if="v.desc" class="vcn-item-desc">{{ v.desc }}</text>
          <view v-if="vcn === v.value" class="vcn-check" />
        </view>
      </view>
    </view>

    <view style="height:80rpx;" />
  </view>
</template>

<script>
import { getPoemDetail, getTtsVoices, BASE_URL } from '@/utils/request.js'

export default {
  data() {
    return {
      playing: false,
      currentLine: 0,
      progress: 0,
      currentTime: 0,
      duration: 0,
      isDragging: false,
      poem: {
        poemId: null,
        title: '',
        dynasty: '',
        author: '',
        lines: []
      },
      audioCtx: null,
      vcn: 'x4_xiaolu',
      vcnOptions: [],
      audioLoading: false,
      showVcnPanel: false
    }
  },
  computed: {
    currentVcnLabel() {
      const cur = this.vcnOptions.find(v => v.value === this.vcn)
      return cur ? cur.label : '音色'
    }
  },
  onLoad(options) {
    this.voicesReady = this.fetchVoices()
    if (options && options.id) {
      this.fetchPoem(options.id)
    }
  },
  methods: {
    async fetchVoices() {
      try {
        const data = await getTtsVoices()
        if (data && data.length) {
          this.vcnOptions = data.map(v => ({ value: v.code, label: v.name, desc: v.description }))
          if (this.vcnOptions.length) {
            const xiaolu = this.vcnOptions.find(v => v.label === '小露') || this.vcnOptions.find(v => v.value === 'x4_xiaolu')
            this.vcn = xiaolu ? xiaolu.value : this.vcnOptions[0].value
          }
        }
      } catch (e) {
        console.error('获取音色列表失败', e)
      }
    },
    async fetchPoem(id) {
      try {
        const data = await getPoemDetail(id)
        if (data) {
          const lines = (data.content || '').replace(/\r\n/g, '\n').split('\n').filter(l => l.trim())
          this.poem = {
            poemId: data.poemId || id,
            title: data.title || '',
            dynasty: data.dynasty || '',
            author: data.author || '',
            lines
          }
        }
      } catch (e) {
        console.error('获取诗词失败', e)
      }
    },
    async playTts() {
      if (!this.poem.poemId) return
      // 等待音色列表加载完成，确保默认音色已设置
      if (this.voicesReady) {
        await this.voicesReady
      }
      this.audioLoading = true
      try {
        this.stopAudio()
        const token = uni.getStorageSync('token')
        const ttsUrl = `${BASE_URL}/api/poems/${this.poem.poemId}/tts?vcn=${this.vcn}`
        const downloadRes = await new Promise((resolve, reject) => {
          uni.downloadFile({
            url: ttsUrl,
            header: { Authorization: token ? `Bearer ${token}` : '' },
            success: resolve,
            fail: reject
          })
        })
        if (downloadRes.statusCode !== 200) {
          uni.showToast({ title: '获取音频失败', icon: 'none' })
          this.audioLoading = false
          return
        }
        this.audioCtx = uni.createInnerAudioContext()
        this.audioCtx.src = downloadRes.tempFilePath
        this.audioCtx.autoplay = true

        this.audioCtx.onPlay(() => {
          this.playing = true
          this.audioLoading = false
        })

        // 实时同步：音频位置 → 进度条 + 行高亮
        this.audioCtx.onTimeUpdate(() => {
          if (this.isDragging) return
          const cur = this.audioCtx.currentTime
          const dur = this.audioCtx.duration
          if (dur > 0) {
            this.currentTime = cur
            this.duration = dur
            this.progress = Math.min(100, (cur / dur) * 100)
            const totalLines = this.poem.lines.length
            if (totalLines > 0) {
              const lineIdx = Math.floor((cur / dur) * totalLines)
              this.currentLine = Math.min(lineIdx, totalLines - 1)
            }
          }
        })

        this.audioCtx.onEnded(() => {
          this.playing = false
          this.progress = 100
          this.currentLine = Math.max(0, this.poem.lines.length - 1)
        })

        this.audioCtx.onPause(() => {
          this.playing = false
        })

        this.audioCtx.onError((err) => {
          console.error('TTS播放失败', err)
          this.playing = false
          this.audioLoading = false
          uni.showToast({ title: '播放失败', icon: 'none' })
        })
      } catch (e) {
        console.error('TTS请求失败', e)
        this.audioLoading = false
      }
    },

    // ---- 进度条拖拽 ----
    onProgressTouchStart(e) {
      this.isDragging = true
      this._trackRect = null
      const query = uni.createSelectorQuery().in(this)
      query.select('.progress-track').boundingClientRect(rect => {
        if (rect) this._trackRect = rect
        this._applyTouchProgress(e)
      }).exec()
    },
    onProgressTouchMove(e) {
      if (!this.isDragging) return
      this._applyTouchProgress(e)
    },
    onProgressTouchEnd() {
      if (!this.isDragging) return
      this.isDragging = false
      // seek 音频到对应位置
      if (this.audioCtx && this.duration > 0) {
        const seekTime = (this.progress / 100) * this.duration
        this.audioCtx.seek(seekTime)
        this.currentTime = seekTime
      }
    },
    _applyTouchProgress(e) {
      if (!this._trackRect) return
      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) return
      const x = touch.clientX - this._trackRect.left
      const percent = Math.max(0, Math.min(100, (x / this._trackRect.width) * 100))
      this.progress = percent
      // 预览当前行
      const totalLines = this.poem.lines.length
      if (totalLines > 0) {
        const lineIdx = Math.floor((percent / 100) * totalLines)
        this.currentLine = Math.min(lineIdx, totalLines - 1)
      }
      if (this.duration > 0) {
        this.currentTime = (percent / 100) * this.duration
      }
    },

    // ---- 播放控制 ----
    stopAudio() {
      if (this.audioCtx) {
        this.audioCtx.stop()
        this.audioCtx.destroy()
        this.audioCtx = null
      }
      this.playing = false
      this.progress = 0
      this.currentTime = 0
      this.duration = 0
      this.currentLine = 0
    },
    togglePlay() {
      if (this.audioLoading) return
      if (this.playing) {
        // 暂停
        if (this.audioCtx) {
          this.audioCtx.pause()
        }
      } else if (this.audioCtx && this.duration > 0) {
        // 恢复播放
        this.audioCtx.play()
        this.playing = true
      } else {
        // 首次播放
        this.playTts()
      }
    },
    onVcnChange(vcn) {
      this.vcn = vcn
      this.showVcnPanel = false
      if (this.playing || this.audioCtx) {
        this.stopAudio()
        this.playTts()
      }
    },
    seekToLine(lineIdx) {
      const totalLines = this.poem.lines.length
      if (totalLines === 0) return
      this.currentLine = lineIdx
      if (totalLines > 1) {
        this.progress = (lineIdx / (totalLines - 1)) * 100
      } else {
        this.progress = 0
      }
      if (this.audioCtx && this.duration > 0) {
        const seekTime = (lineIdx / totalLines) * this.duration
        this.audioCtx.seek(seekTime)
        this.currentTime = seekTime
        // 如果当前未播放，开始播放
        if (!this.playing) {
          this.audioCtx.play()
          this.playing = true
        }
      }
    },
    prev() {
      const totalLines = this.poem.lines.length
      if (totalLines === 0) return
      const newLine = Math.max(0, this.currentLine - 1)
      this.currentLine = newLine
      this.progress = totalLines > 1 ? (newLine / (totalLines - 1)) * 100 : 0
      if (this.audioCtx && this.duration > 0) {
        const seekTime = (newLine / totalLines) * this.duration
        this.audioCtx.seek(seekTime)
        this.currentTime = seekTime
      }
    },
    next() {
      const totalLines = this.poem.lines.length
      if (totalLines === 0) return
      const newLine = Math.min(totalLines - 1, this.currentLine + 1)
      this.currentLine = newLine
      this.progress = totalLines > 1 ? (newLine / (totalLines - 1)) * 100 : 100
      if (this.audioCtx && this.duration > 0) {
        const seekTime = (newLine / totalLines) * this.duration
        this.audioCtx.seek(seekTime)
        this.currentTime = seekTime
      }
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00'
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min}:${sec < 10 ? '0' + sec : sec}`
    }
  },
  beforeDestroy() {
    this.stopAudio()
  }
}
</script>

<style lang="scss">
$fb: 'STSong', 'SimSun', 'Songti SC', serif;
$f:  'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;

.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #2e3328 0%, #232b20 50%, #1a2018 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  padding: 0 48rpx;
  font-family: $f;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow-y: auto;
}

.status-bar { height: 88rpx; }

.top-subtitle {
  text-align: center;
  font-size: 22rpx;
  color: rgba(255,255,255,0.3);
  letter-spacing: 2rpx;
  margin-bottom: 24rpx;
}

/* 导航行 */
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 48rpx;

  .nav-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .recitation-label {
    font-size: 20rpx;
    color: rgba(255,255,255,0.35);
    letter-spacing: 3rpx;
  }
}

/* 标题 */
.poem-header {
  text-align: center;
  margin-bottom: 72rpx;

  .poem-title {
    display: block;
    font-size: 96rpx;
    font-weight: 700;
    color: #fff;
    letter-spacing: 16rpx;
    font-family: $fb;
    margin-bottom: 20rpx;
  }

  .poem-author {
    display: block;
    font-size: 36rpx;
    color: rgba(255,255,255,0.45);
    letter-spacing: 4rpx;
  }
}

/* 诗句 */
.lines-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 0 8rpx;

  .poem-line {
    display: block;
    font-size: 52rpx;
    line-height: 100rpx;
    letter-spacing: 6rpx;
    font-family: $fb;
    transition: color 0.3s, font-size 0.3s;
  }

  .line-active {
    color: #fff;
    font-size: 58rpx;
    font-weight: 600;
  }

  .line-dim {
    color: rgba(255,255,255,0.28);
  }
}

/* 进度条 */
.progress-wrap {
  padding: 32rpx 0 16rpx;

  .time-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .time-text {
      font-size: 22rpx;
      color: rgba(255,255,255,0.4);
      font-variant-numeric: tabular-nums;
    }
  }

  .progress-track {
    width: 100%;
    height: 40rpx;          /* 加大触摸区域 */
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;

    &::before {              /* 可视细线背景 */
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 4rpx;
      background: rgba(255,255,255,0.12);
      border-radius: 2rpx;
    }

    .progress-fill {
      position: absolute;
      left: 0;
      height: 4rpx;
      background: rgba(255,255,255,0.7);
      border-radius: 2rpx;
      transition: width 0.1s linear;
    }

    .progress-thumb {
      position: absolute;
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      background: #fff;
      transform: translateX(-50%);
      box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.4);
      transition: left 0.1s linear;
    }
  }
}

/* 控制区 */
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80rpx;
  padding-bottom: 16rpx;

  .ctrl-btn {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .ctrl-icon-wrap {
      display: flex;
      align-items: center;
      gap: 8rpx;
    }

    .ctrl-bar {
      width: 5rpx;
      height: 40rpx;
      background: rgba(255,255,255,0.55);
      border-radius: 3rpx;
    }

    .ctrl-tri {
      width: 0;
      height: 0;
    }

    .ctrl-tri-left {
      border-top: 20rpx solid transparent;
      border-bottom: 20rpx solid transparent;
      border-right: 32rpx solid rgba(255,255,255,0.55);
    }

    .ctrl-tri-right {
      border-top: 20rpx solid transparent;
      border-bottom: 20rpx solid transparent;
      border-left: 32rpx solid rgba(255,255,255,0.55);
    }
  }

  .play-btn {
    width: 136rpx;
    height: 136rpx;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 40rpx rgba(0,0,0,0.45);

    .tri-play {
      width: 0;
      height: 0;
      border-top: 24rpx solid transparent;
      border-bottom: 24rpx solid transparent;
      border-left: 40rpx solid #1a2018;
      margin-left: 8rpx;
    }

    .pause-bars {
      display: flex;
      gap: 12rpx;

      .pause-bar {
        width: 10rpx;
        height: 44rpx;
        background: #1a2018;
        border-radius: 5rpx;
      }
    }

    .loading-spinner {
      width: 40rpx;
      height: 40rpx;
      border: 4rpx solid #1a2018;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 音色选择 */
.vcn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32rpx;

  .vcn-toggle {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 12rpx 32rpx;
    border-radius: 32rpx;
    background: rgba(255,255,255,0.1);
    border: 1rpx solid rgba(255,255,255,0.15);

    .vcn-toggle-text {
      font-size: 24rpx;
      color: rgba(255,255,255,0.7);
    }

    .vcn-toggle-arrow {
      width: 0;
      height: 0;
      border-left: 10rpx solid transparent;
      border-right: 10rpx solid transparent;
      border-top: 10rpx solid rgba(255,255,255,0.5);
      transition: transform 0.2s;
    }

    .arrow-open {
      transform: rotate(180deg);
    }
  }

  .vcn-panel {
    margin-top: 16rpx;
    background: rgba(30,40,28,0.95);
    border: 1rpx solid rgba(255,255,255,0.12);
    border-radius: 20rpx;
    padding: 8rpx 0;
    min-width: 400rpx;

    .vcn-item {
      display: flex;
      align-items: center;
      padding: 20rpx 32rpx;
      gap: 16rpx;

      .vcn-item-name {
        font-size: 26rpx;
        color: rgba(255,255,255,0.55);
      }

      .vcn-item-name-active {
        color: #fff;
      }

      .vcn-item-desc {
        font-size: 22rpx;
        color: rgba(255,255,255,0.3);
        flex: 1;
      }

      .vcn-check {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: rgba(42,110,68,0.9);
      }
    }

    .vcn-item-active {
      background: rgba(42,110,68,0.25);
    }
  }
}
</style>
