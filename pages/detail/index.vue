<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="nav-back" @click="uni.navigateBack()">
        <uni-icons type="left" size="22" color="#2a6e44" />
      </view>
      <view class="nav-avatar" />
      <text class="nav-title">值得看么</text>
      <view class="nav-right">
        <uni-icons :type="faved ? 'heart-filled' : 'heart'" size="22" :color="faved ? '#b82e2e' : '#2a6e44'" @click="toggleFav" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- 诗词卡片 -->
      <view class="poem-card">
        <view class="poem-tag">
          <text class="poem-tag-text">{{ poem.dynasty }}｜{{ poem.author }}</text>
        </view>

        <view v-if="!isVertical" class="poem-body">
          <text class="poem-title">{{ poem.title }}</text>
          <text class="poem-line" v-for="(l, i) in (poem.content || '').replace(/\r\n/g, '\n').split('\n')" :key="i">{{ l }}</text>
        </view>

        <view v-else class="poem-body-vert">
          <view class="poem-lines-vert">
            <text class="poem-line-vert" v-for="(l, i) in (poem.content || '').replace(/\r\n/g, '\n').split('\n')" :key="i">{{ l }}</text>
          </view>
          <text class="poem-title-vert">{{ poem.title }}</text>
        </view>

        <view class="poem-btns">
          <view class="poem-btn" :class="{ 'poem-btn-active': faved }" @click="toggleFav">
            <uni-icons :type="faved ? 'heart-filled' : 'heart'" size="18" :color="faved ? '#fff' : '#444'" />
            <text class="poem-btn-text" :style="{ color: faved ? '#fff' : '#333' }">
              {{ faved ? '已收藏' : '收藏' }}
            </text>
          </view>
          <view class="poem-btn" :class="{ 'poem-btn-active': isVertical }" @click="isVertical = !isVertical">
            <uni-icons type="loop" size="18" :color="isVertical ? '#fff' : '#444'" />
            <text class="poem-btn-text" :style="{ color: isVertical ? '#fff' : '#333' }">
              {{ isVertical ? '水平显示' : '垂直显示' }}
            </text>
          </view>
          <view class="poem-btn" @click="toggleMode('recite')">
            <uni-icons type="sound" size="18" color="#444" />
            <text class="poem-btn-text">吟诵模式</text>
          </view>
        </view>
      </view>

      <!-- 注释模块 -->
      <view class="section" v-if="poem.annotation && poem.annotation.length">
        <view class="mod-hd">
          <view class="mod-bar green-bar" />
          <text class="mod-title">注释</text>
        </view>
        <view class="note-card">
          <view class="note-deco">
            <uni-icons type="bookmarks" size="120" color="rgba(42,110,68,0.06)" />
          </view>
          <view class="note-item" v-for="n in poem.annotation" :key="n.word">
            <text class="note-word">{{ n.word }}：</text>
            <text class="note-def">{{ n.explain }}</text>
          </view>
        </view>
      </view>

      <!-- 赏析模块 -->
      <view class="section">
        <view class="mod-hd">
          <view class="mod-bar red-bar" />
          <text class="mod-title">赏析</text>
        </view>
        <text class="analysis-text">{{ poem.appreciation }}</text>
      </view>

      <!-- 译文模块 -->
      <view class="section" v-if="poem.translation">
        <view class="mod-hd">
          <view class="mod-bar green-bar" />
          <text class="mod-title">译文</text>
        </view>
        <text class="analysis-text">{{ poem.translation }}</text>
      </view>

      <!-- 背景模块 -->
      <view class="section" v-if="poem.background">
        <view class="mod-hd">
          <view class="mod-bar blue-bar" />
          <text class="mod-title">创作背景</text>
        </view>
        <text class="analysis-text">{{ poem.background }}</text>
      </view>

      <!-- 作者简介模块 -->
      <view class="section" v-if="poem.authorDescription">
        <view class="mod-hd">
          <view class="mod-bar orange-bar" />
          <text class="mod-title">作者简介</text>
        </view>
        <text class="analysis-text">{{ poem.authorDescription }}</text>
      </view>

      <!-- 推荐研习 -->
      <view class="section">
        <text class="rec-title">推荐研习</text>
        <view class="rec-row">
          <view class="rec-card rec-light" @click="goPoem('lushan')">
            <view class="rec-icon-wrap rec-icon-light">
              <uni-icons type="bookmarks" size="28" color="#2a6e44" />
            </view>
            <text class="rec-name">望庐山瀑布</text>
            <text class="rec-sub">李白·浪漫主义</text>
          </view>
          <view class="rec-card rec-green">
            <view class="rec-icon-wrap rec-icon-green">
              <uni-icons type="bookmarks" size="28" color="#fff" />
            </view>
            <text class="rec-name" style="color:#fff;">唐诗三百首</text>
            <text class="rec-sub" style="color:rgba(255,255,255,0.8);">深度解读专辑</text>
            <view class="rec-badge">
              <uni-icons type="bookmark" size="18" color="#fff" />
            </view>
          </view>
        </view>
      </view>

      <view style="height:60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getPoemDetail, toggleFavorite } from '@/utils/request.js'

export default {
  data() {
    return {
      faved: false,
      isVertical: false,
      poem: {
        poemId: null,
        title: '',
        author: '',
        dynasty: '',
        category: '',
        content: '',
        background: '',
        translation: '',
        annotation: [],
        appreciation: '',
        authorDescription: '',
        isFavorited: false
      }
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.fetchPoemDetail(options.id)
    }
  },
  methods: {
    async fetchPoemDetail(id) {
      try {
        const data = await getPoemDetail(id)
        if (data) {
          this.poem = data
          this.faved = data.favorited === true
        }
      } catch (e) {
        console.error('获取诗词详情失败', e)
      }
    },
    async toggleFav() {
      if (!this.poem.poemId) return
      try {
        const res = await toggleFavorite(this.poem.poemId)
        if (res) {
          this.faved = res.favorited
          this.poem.favorited = res.favorited
          uni.showToast({ title: res.message || (this.faved ? '已收藏' : '已取消收藏'), icon: 'none' })
        }
      } catch (e) {
        console.error('收藏失败', e)
      }
    },
    toggleMode(mode) {
      if (mode === 'recite') {
        uni.navigateTo({ url: `/pages/recite/index?id=${this.poem.poemId || 'chunxiao'}` })
      }
    },
    goPoem(id) {
      uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
    }
  }
}
</script>

<style lang="scss">
$green:     #2a6e44;
$red:       #b82e2e;
$bg:        #f8f5ee;
$dark:      #1a1a1a;
$gray:      #666;
$font:      'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', serif;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
  font-family: $font;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  padding: 106rpx 36rpx 20rpx;
  background: $bg;
  gap: 0;

  .nav-back {
    width: 64rpx;
    height: 64rpx;
    background: rgba(42,110,68,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 500;
    color: $green;
    letter-spacing: 2rpx;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 24rpx;
    flex-shrink: 0;

    .nav-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #2a2a2a;
      border: 2rpx solid #ddd;
    }
  }
}

.scroll-body { flex: 1; overflow: hidden; }

/* 诗词卡片 */
.poem-card {
  margin: 72rpx 40rpx 0;
  border-radius: 40rpx;
  overflow: hidden;
  position: relative;
  min-height: 700rpx;
  background: linear-gradient(180deg,
    rgba(200,150,60,0.92) 0%,
    rgba(120,150,100,0.88) 50%,
    rgba(50,90,70,0.95) 100%
  );
  display: flex;
  flex-direction: column;

  .poem-tag {
    position: absolute;
    top: 0; right: 32rpx;
    background: #8b2020;
    border-radius: 0 0 16rpx 16rpx;
    padding: 20rpx 20rpx 24rpx;
    z-index: 2;

    .poem-tag-text {
      color: #fff;
      font-size: 24rpx;
      writing-mode: vertical-rl;
      letter-spacing: 6rpx;
      line-height: 1.5;
    }
  }

  .poem-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 48rpx 40rpx;
    z-index: 1;

    .poem-title {
      display: block;
      font-size: 80rpx;
      font-weight: 700;
      color: $dark;
      letter-spacing: 12rpx;
      margin-bottom: 40rpx;
      font-family: $font-bold;
      text-align: center;
    }

    .poem-line {
      display: block;
      font-size: 36rpx;
      color: #1a1a1a;
      line-height: 80rpx;
      letter-spacing: 4rpx;
      text-align: center;
      font-family: $font-bold;
    }
  }

  .poem-btns {
    display: flex;
    gap: 24rpx;
    padding: 0 40rpx 40rpx;
    z-index: 1;

    .poem-btn {
      flex: 1;
      height: 80rpx;
      background: rgba(255,255,255,0.85);
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12rpx;

      .poem-btn-text {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .poem-btn-active {
      background: $green;
    }
  }

  /* 垂直模式布局 */
  .poem-body-vert {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: 60rpx 48rpx 32rpx;
    z-index: 1;
    gap: 32rpx;

    .poem-lines-vert {
      display: flex;
      flex-direction: row-reverse;
      gap: 32rpx;

      .poem-line-vert {
        writing-mode: vertical-rl;
        font-size: 36rpx;
        color: #1a1a1a;
        letter-spacing: 6rpx;
        line-height: 1.6;
        font-family: $font-bold;
      }
    }

    .poem-title-vert {
      writing-mode: vertical-rl;
      font-size: 80rpx;
      font-weight: 700;
      color: $dark;
      letter-spacing: 12rpx;
      font-family: $font-bold;
      align-self: flex-end;
    }
  }
}

/* 通用 section */
.section {
  padding: 48rpx 40rpx 0;

  .mod-hd {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 32rpx;

    .mod-bar {
      width: 8rpx;
      height: 48rpx;
      border-radius: 4rpx;
    }
    .green-bar  { background: $green; }
    .red-bar    { background: $red; }
    .blue-bar   { background: #4a90d9; }
    .orange-bar { background: #e6a23c; }

    .mod-title {
      font-size: 48rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }
  }
}

/* 注释卡片 */
.note-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 40rpx 48rpx;
  position: relative;
  overflow: hidden;

  .note-deco {
    position: absolute;
    right: 24rpx;
    bottom: 16rpx;
    pointer-events: none;
    opacity: 0.5;
  }

  .note-item {
    display: flex;
    align-items: baseline;
    margin-bottom: 32rpx;

    &:last-child { margin-bottom: 0; }

    .note-word {
      font-size: 32rpx;
      font-weight: 600;
      color: $green;
      font-family: $font-bold;
      flex-shrink: 0;
    }

    .note-def {
      font-size: 32rpx;
      color: $dark;
      line-height: 48rpx;
    }
  }
}

/* 赏析 */
.analysis-text {
  display: block;
  font-size: 32rpx;
  color: $gray;
  line-height: 60rpx;
  text-indent: 2em;
}

/* 推荐研习 */
.rec-title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: $dark;
  margin-bottom: 32rpx;
  font-family: $font-bold;
}

.rec-row {
  display: flex;
  gap: 24rpx;

  .rec-card {
    flex: 1;
    border-radius: 40rpx;
    padding: 40rpx 32rpx 48rpx;
    position: relative;
    overflow: hidden;
    min-height: 380rpx;
    display: flex;
    flex-direction: column;

    .rec-icon-wrap {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32rpx;
    }

    .rec-name {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      color: $dark;
      line-height: 56rpx;
      margin-bottom: 16rpx;
      font-family: $font-bold;
    }

    .rec-sub {
      display: block;
      font-size: 26rpx;
      color: $gray;
    }

    .rec-badge {
      position: absolute;
      right: 0; bottom: 0;
      width: 80rpx;
      height: 80rpx;
      background: $red;
      border-radius: 40rpx 0 40rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .rec-light {
    background: #eeece4;
    .rec-icon-light { background: rgba(42,110,68,0.1); }
  }

  .rec-green {
    background: #6a9e72;
    .rec-icon-green { background: rgba(255,255,255,0.2); }
  }
}
</style>
