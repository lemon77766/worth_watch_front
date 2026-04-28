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
      >{{ line }}</text>
    </view>

    <view class="progress-wrap">
      <view class="progress-track">
        <view class="progress-fill" :style="{ width: progress + '%' }" />
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
        <view v-if="!playing" class="tri-play" />
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

    <view style="height:80rpx;" />
  </view>
</template>

<script>
const POEMS = {
  chunxiao: {
    title: '春 晓', dynasty: '唐', author: '孟浩然',
    lines: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。']
  },
  lushan: {
    title: '望庐山瀑布', dynasty: '唐', author: '李白',
    lines: ['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。']
  }
}

export default {
  data() {
    return {
      playing: false,
      currentLine: 0,
      progress: 0,
      poem: POEMS.chunxiao,
      timer: null
    }
  },
  onLoad(options) {
    if (options && options.id && POEMS[options.id]) {
      this.poem = POEMS[options.id]
    }
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing
      if (this.playing) {
        this.timer = setInterval(() => {
          this.progress = Math.min(this.progress + 1, 100)
          this.currentLine = Math.min(Math.floor(this.progress / 25), this.poem.lines.length - 1)
          if (this.progress >= 100) { this.playing = false; clearInterval(this.timer) }
        }, 150)
      } else {
        clearInterval(this.timer)
      }
    },
    prev() {
      this.currentLine = Math.max(0, this.currentLine - 1)
      this.progress = this.currentLine * 25
    },
    next() {
      this.currentLine = Math.min(this.poem.lines.length - 1, this.currentLine + 1)
      this.progress = this.currentLine * 25
    }
  },
  beforeDestroy() { clearInterval(this.timer) }
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
  /* 确保小程序/H5全屏覆盖 */
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
  padding: 48rpx 0 40rpx;

  .progress-track {
    width: 100%;
    height: 3rpx;
    background: rgba(255,255,255,0.12);
    border-radius: 2rpx;

    .progress-fill {
      height: 100%;
      background: rgba(255,255,255,0.65);
      border-radius: 2rpx;
      transition: width 0.15s linear;
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
  }
}
</style>
