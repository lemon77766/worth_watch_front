<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <uni-icons type="bars" size="24" color="#2a6e44" />
      <text class="navbar-title">值得看么</text>
      <view class="navbar-avatar" />
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- Banner -->
      <view class="banner">
        <!-- 背景色块模拟暖色调 -->
        <view class="banner-inner">
          <view class="banner-overlay" />

          <!-- 左上标签 -->
          <view class="tag-red banner-tag-tl">
            <text class="tag-red-text">推荐选篇</text>
          </view>

          <!-- 右侧竖排标签 -->
          <view class="banner-tag-tr">
            <text class="banner-tag-tr-text">庚子年春·刻</text>
          </view>

          <!-- 右侧水印 -->
          <view class="banner-watermark">
            <text class="banner-watermark-text">LIVING SCROLL</text>
          </view>

          <!-- 核心文字 -->
          <view class="banner-body">
            <text class="banner-title">春晓</text>
            <text class="banner-author">孟浩然·唐</text>
            <text class="banner-poem">春眠不觉晓，</text>
            <text class="banner-poem">处处闻啼鸟。</text>
          </view>

          <!-- 按钮 -->
          <view class="banner-btn-row">
            <view class="banner-btn">
              <text class="banner-btn-text">深入研习</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 热门选集 -->
      <view class="section">
        <view class="section-hd">
          <text class="section-title">热门选集</text>
          <view class="section-more">
            <text class="section-more-text">查看全部</text>
            <uni-icons type="right" size="13" color="#2a6e44" />
          </view>
        </view>

        <!-- 大卡片 -->
        <view class="col-main-card">
          <view class="col-main-left">
            <text class="col-label">SELECTED</text>
            <text class="col-name">唐诗三百首</text>
            <text class="col-desc">汇集盛唐气象，读懂中国人的精神底色。</text>
          </view>
          <view class="col-main-right">
            <view class="col-right-topbar" />
            <text class="col-right-text">唐詩精選</text>
          </view>
        </view>

        <!-- 双小卡片 -->
        <view class="col-small-row">
          <view class="col-small-card">
            <uni-icons type="bookmarks" size="28" color="#2a6e44" />
            <text class="col-small-name">宋词婉约</text>
            <text class="col-small-desc">寻寻觅觅，冷冷清清，凄凄惨惨戚戚。</text>
          </view>
          <view class="col-small-card">
            <uni-icons type="heart" size="28" color="#b82e2e" />
            <text class="col-small-name">山水田园</text>
            <text class="col-small-desc">采菊东篱下，悠然见南山。</text>
          </view>
        </view>
      </view>

      <!-- 热门作者 -->
      <view class="section">
        <view class="section-hd">
          <text class="section-title">热门作者</text>
        </view>
        <view class="author-row">
          <view class="author-card" v-for="a in authors" :key="a.name">
            <view class="author-avatar" />
            <text class="author-name">{{ a.name }}</text>
            <text class="author-sub">{{ a.title }}</text>
          </view>
        </view>
      </view>

      <!-- 时令特辑 -->
      <view class="section">
        <view class="special-card">
          <view class="special-left">
            <view class="tag-red special-tag">
              <text class="tag-red-text">时令特辑</text>
            </view>
            <text class="special-title">惊蛰·万物苏</text>
            <text class="special-desc">微雨众卉新，一雷惊蛰始。开启春季特别阅读之旅。</text>
          </view>
          <view class="special-btn">
            <uni-icons type="right" size="22" color="#fff" />
          </view>
        </view>
      </view>

      <view style="height: 40rpx;" />
    </scroll-view>

    <!-- 底部导航 -->
    <view class="tabbar">
      <view class="tab active-tab">
        <view class="tab-icon-wrap active-icon">
          <uni-icons type="home" size="22" color="#fff" />
        </view>
        <text class="tab-text active-tab-text">推荐</text>
      </view>
      <view class="tab" @click="goLibrary">
        <uni-icons type="folder" size="24" color="#999" />
        <text class="tab-text">文库</text>
      </view>
      <view class="tab" @click="goStudy">
        <uni-icons type="compose" size="24" color="#999" />
        <text class="tab-text">研习</text>
      </view>
      <view class="tab">
        <uni-icons type="person" size="24" color="#999" />
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      authors: [
        { name: '李白', title: '诗仙' },
        { name: '杜甫', title: '诗圣' },
        { name: '苏轼', title: '东坡' }
      ]
    }
  },
  methods: {
    goStudy() {
      uni.reLaunch({ url: '/pages/study/index' })
    },
    goLibrary() {
      uni.reLaunch({ url: '/pages/library/index' })
    }
  }
}
</script>

<style lang="scss">
/* ── 变量 ── */
$green:    #2a6e44;
$red:      #b82e2e;
$bg:       #f8f5ee;
$dark:     #1a1a1a;
$gray:     #666666;
$card:     #ffffff;
$font:     'PingFang SC', 'Noto Sans SC', 'Source Han Sans CN', -apple-system, 'Helvetica Neue', sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', 'Source Han Serif CN', serif;

/* ── 页面容器 ── */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
  font-family: $font;
}

/* ── 导航栏 56px ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 40rpx;
  padding-top: 44rpx; /* 状态栏 */
  background: $bg;

  .navbar-title {
    font-size: 36rpx;   /* 18px */
    font-weight: 500;
    color: $green;
    letter-spacing: 2rpx;
  }

  .navbar-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: $dark;
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
}

/* ── Banner 380px ── */
.banner {
  margin: 48rpx 40rpx 0;

  .banner-inner {
    border-radius: 40rpx;
    height: 760rpx;
    position: relative;
    overflow: hidden;
    /* 暖橙+青绿色调模拟秋日风景 */
    background:
      linear-gradient(180deg,
        rgba(210,155,70,0.9)  0%,
        rgba(140,160,90,0.85) 45%,
        rgba(50,90,65,0.95)   100%
      );
  }

  /* 下半部分白色渐变遮罩 */
  .banner-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12));
    z-index: 1;
    pointer-events: none;
  }

  /* 左上标签 */
  .banner-tag-tl {
    position: absolute;
    top: 28rpx;
    left: 28rpx;
    z-index: 3;
  }

  /* 右侧竖排标签 */
  .banner-tag-tr {
    position: absolute;
    top: 0;
    right: 28rpx;
    z-index: 3;
    width: 100rpx;
    background: $red;
    border-radius: 0 0 16rpx 16rpx;
    padding: 20rpx 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .banner-tag-tr-text {
      color: #fff;
      font-size: 28rpx;   /* 14px */
      writing-mode: vertical-rl;
      letter-spacing: 6rpx;
      font-weight: 400;
      font-family: $font;
    }
  }

  /* 右侧水印 */
  .banner-watermark {
    position: absolute;
    right: -30rpx;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    z-index: 2;
    pointer-events: none;

    .banner-watermark-text {
      font-size: 24rpx;
      color: #aaa;
      letter-spacing: 8rpx;
      opacity: 0.6;
    }
  }

  /* 核心文字区 */
  .banner-body {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 0; right: 0;
    transform: translateY(-60%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .banner-title {
      font-size: 96rpx;   /* 48px */
      font-weight: 700;
      color: $green;
      letter-spacing: 10rpx;
      line-height: 1.1;
      font-family: $font-bold;
    }

    .banner-author {
      font-size: 34rpx;   /* 17px */
      font-weight: 400;
      color: rgba(255,255,255,0.75);
      margin-top: 16rpx;
      margin-bottom: 48rpx;
      letter-spacing: 2rpx;
      font-family: $font;
    }

    .banner-poem {
      font-size: 34rpx;   /* 17px */
      font-weight: 400;
      color: #2a2a2a;
      line-height: 56rpx;
      letter-spacing: 2rpx;
      text-align: center;
      font-family: $font;
    }
  }

  /* 按钮 */
  .banner-btn-row {
    position: absolute;
    bottom: 48rpx;
    left: 0; right: 0;
    z-index: 3;
    display: flex;
    justify-content: center;

    .banner-btn {
      background: $green;
      border-radius: 24rpx;
      width: 320rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);

      .banner-btn-text {
        color: #fff;
        font-size: 32rpx;   /* 16px */
        font-weight: 500;
        letter-spacing: 4rpx;
        font-family: $font;
      }
    }
  }
}

/* ── 通用红色标签 ── */
.tag-red {
  display: inline-flex;
  background: $red;
  border-radius: 12rpx;
  padding: 8rpx 24rpx;

  .tag-red-text {
    color: #fff;
    font-size: 26rpx;   /* 13px */
    font-weight: 500;
    font-family: $font;
  }
}

/* ── Section ── */
.section {
  padding: 48rpx 40rpx 0;

  .section-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .section-title {
      font-size: 48rpx;   /* 24px */
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }

    .section-more {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .section-more-text {
        font-size: 30rpx;   /* 15px */
        color: $green;
        font-weight: 400;
        font-family: $font;
      }
    }
  }
}

/* ── 选集大卡片 ── */
.col-main-card {
  background: $card;
  border-radius: 40rpx;
  padding: 40rpx 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .col-main-left {
    flex: 1;
    margin-right: 24rpx;

    .col-label {
      display: block;
      font-size: 26rpx;   /* 13px */
      color: $gray;
      letter-spacing: 2rpx;
      margin-bottom: 8rpx;
      font-weight: 400;
      font-family: $font;
    }

    .col-name {
      display: block;
      font-size: 44rpx;   /* 22px */
      font-weight: 600;
      color: $dark;
      margin-bottom: 16rpx;
      font-family: $font-bold;
    }

    .col-desc {
      display: block;
      font-size: 30rpx;   /* 15px */
      color: $gray;
      line-height: 44rpx;
      font-weight: 400;
      font-family: $font;
    }
  }

  .col-main-right {
    width: 160rpx;
    height: 220rpx;
    background: #f0efe9;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0;
    overflow: hidden;
    flex-shrink: 0;

    .col-right-topbar {
      width: 100%;
      height: 8rpx;
      background: $green;
      margin-bottom: 24rpx;
    }

    .col-right-text {
      color: $green;
      font-size: 36rpx;   /* 18px */
      font-weight: 500;
      writing-mode: vertical-rl;
      letter-spacing: 8rpx;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: $font;
    }
  }
}

/* ── 选集双小卡片 ── */
.col-small-row {
  display: flex;
  gap: 24rpx;

  .col-small-card {
    flex: 1;
    background: $card;
    border-radius: 40rpx;
    padding: 36rpx;

    .col-small-name {
      display: block;
      font-size: 40rpx;   /* 20px */
      font-weight: 600;
      color: $dark;
      margin-top: 24rpx;
      margin-bottom: 16rpx;
      font-family: $font-bold;
    }

    .col-small-desc {
      display: block;
      font-size: 28rpx;   /* 14px */
      color: $gray;
      line-height: 40rpx;
      font-weight: 400;
      font-family: $font;
    }
  }
}

/* ── 热门作者 ── */
.author-row {
  display: flex;
  gap: 24rpx;

  .author-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .author-avatar {
      width: 200rpx;
      height: 200rpx;
      border-radius: 24rpx;
      background: #2a2a2a;
      border: 2rpx solid #e0e0e0;
      margin-bottom: 24rpx;
    }

    .author-name {
      font-size: 40rpx;   /* 20px */
      font-weight: 600;
      color: $dark;
      margin-bottom: 8rpx;
      font-family: $font-bold;
    }

    .author-sub {
      font-size: 28rpx;   /* 14px */
      color: $gray;
      font-weight: 400;
      font-family: $font;
    }
  }
}

/* ── 时令特辑 ── */
.special-card {
  background: #e6f2e9;
  border-radius: 40rpx;
  padding: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .special-left {
    flex: 1;
    margin-right: 32rpx;

    .special-tag {
      margin-bottom: 24rpx;
    }

    .special-title {
      display: block;
      font-size: 64rpx;   /* 32px */
      font-weight: 600;
      color: #65b380;
      margin-bottom: 24rpx;
      letter-spacing: 2rpx;
      font-family: $font-bold;
    }

    .special-desc {
      display: block;
      font-size: 30rpx;   /* 15px */
      color: #444;
      line-height: 48rpx;
      font-weight: 400;
      font-family: $font;
    }
  }

  .special-btn {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: $green;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4rpx 16rpx rgba(42,110,68,0.3);
  }
}

/* ── 底部导航 ── */
.tabbar {
  display: flex;
  background: $bg;
  border-top: 2rpx solid #e0e0e0;
  padding: 16rpx 0 40rpx;

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .tab-text {
      font-size: 24rpx;   /* 12px */
      color: $gray;
      font-weight: 400;
      font-family: $font;
    }
  }

  .active-tab {
    .tab-icon-wrap {
      width: 56rpx;
      height: 56rpx;
      background: $green;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .active-tab-text {
      font-size: 24rpx;   /* 12px */
      font-weight: 500;
      color: $green;
      font-family: $font;
    }
  }
}
</style>
