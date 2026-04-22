<template>
  <view class="page">
    <!-- 导航栏 -->
    <view class="navbar">
      <uni-icons type="bars" size="24" color="#2a6e44" />
      <text class="navbar-title">研习</text>
      <uni-icons type="search" size="24" color="#2a6e44" />
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- 研习天数卡片 -->
      <view class="pad">
        <view class="days-card">
          <view class="days-left">
            <text class="days-label">研习天数</text>
            <view class="days-num-row">
              <text class="days-num">128</text>
              <text class="days-unit">日</text>
            </view>
          </view>
          <view class="days-wm">
            <text class="days-wm-text">学而时习之</text>
          </view>
        </view>
      </view>

      <!-- 数据统计双卡 -->
      <view class="pad stat-row">
        <view class="stat-card bg-green">
          <text class="stat-label">已掌握诗词</text>
          <view class="stat-num-row">
            <text class="stat-num c-green">412</text>
            <text class="stat-unit">首</text>
          </view>
        </view>
        <view class="stat-card bg-pink">
          <text class="stat-label">今日新学</text>
          <view class="stat-num-row">
            <text class="stat-num c-red">3</text>
            <text class="stat-unit">首</text>
          </view>
        </view>
      </view>

      <!-- 当前目标 -->
      <view class="pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" />
            <text class="mod-title">当前目标</text>
          </view>
          <text class="mod-action">更换计划</text>
        </view>
        <view class="goal-card">
          <view class="goal-side-tag">
            <text class="goal-side-text">唐诗三百首</text>
          </view>
          <text class="goal-name">蘅塘退士·选辑</text>
          <text class="goal-desc">汇编唐代诗人七十七位，计三百一十首诗。体裁涵盖五言、七言、绝句、律诗。</text>
          <view class="goal-prog-hd">
            <text class="goal-prog-label">研习进度 64%</text>
            <text class="goal-prog-count">198 / 310</text>
          </view>
          <view class="prog-track">
            <view class="prog-fill" style="width:64%" />
          </view>
        </view>
      </view>

      <!-- 今日课业 -->
      <view class="pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" />
            <text class="mod-title">今日课业</text>
          </view>
        </view>
        <view class="lesson-card">
          <view class="lesson-icon-wrap">
            <uni-icons type="bookmarks" size="26" color="#2a6e44" />
          </view>
          <view class="lesson-info">
            <view class="lesson-hd">
              <view class="ltag ltag-light"><text class="ltag-text ltag-light-text">背诵</text></view>
              <text class="lesson-title">《春望》</text>
            </view>
            <text class="lesson-sub">杜甫·五言律诗</text>
          </view>
          <uni-icons type="right" size="18" color="#ccc" />
        </view>
        <view class="lesson-card mt-s">
          <view class="lesson-icon-wrap">
            <uni-icons type="bookmarks" size="26" color="#2a6e44" />
          </view>
          <view class="lesson-info">
            <view class="lesson-hd">
              <view class="ltag ltag-dark"><text class="ltag-text ltag-dark-text">赏析</text></view>
              <text class="lesson-title">《锦瑟》</text>
            </view>
            <text class="lesson-sub">李商隐·七言律诗</text>
          </view>
          <uni-icons type="right" size="18" color="#ccc" />
        </view>
      </view>

      <!-- 翰墨成就 -->
      <view class="pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" />
            <text class="mod-title">翰墨成就</text>
          </view>
          <text class="mod-action">查看全部</text>
        </view>
        <view class="badge-row">
          <view class="badge-item">
            <view class="badge badge-on">
              <text class="badge-text badge-text-on">初出茅庐</text>
            </view>
            <text class="badge-status">已达成</text>
          </view>
          <view class="badge-item">
            <view class="badge badge-on">
              <text class="badge-text badge-text-on">出口成章</text>
            </view>
            <text class="badge-status">已达成</text>
          </view>
          <view class="badge-item">
            <view class="badge badge-off">
              <text class="badge-text badge-text-off">一代宗师</text>
            </view>
            <text class="badge-status badge-status-off">未解锁</text>
          </view>
        </view>
      </view>

      <view style="height:40rpx;" />
    </scroll-view>

    <!-- 底部导航 -->
    <view class="tabbar">
      <view class="tab" @click="uni.reLaunch({url:'/pages/index/index'})">
        <uni-icons type="home" size="24" color="#999" />
        <text class="tab-text">雅集</text>
      </view>
      <view class="tab tab-active">
        <view class="tab-icon-bg">
          <uni-icons type="bookmarks" size="22" color="#fff" />
        </view>
        <text class="tab-text tab-text-active">研习</text>
      </view>
      <view class="tab">
        <uni-icons type="star" size="24" color="#999" />
        <text class="tab-text">藏珍</text>
      </view>
      <view class="tab">
        <uni-icons type="person" size="24" color="#999" />
        <text class="tab-text">我</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {}
</script>

<style lang="scss">
$green:     #2a6e44;
$red:       #b82e2e;
$bg:        #f8f5ee;
$dark:      #1a1a1a;
$gray:      #666666;
$font:      'PingFang SC', 'Noto Sans SC', 'Source Han Sans CN', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', 'Source Han Serif CN', serif;

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
  justify-content: space-between;
  padding: 52rpx 40rpx 20rpx;
  background: $bg;

  .navbar-title {
    font-size: 36rpx;
    font-weight: 500;
    color: $dark;
  }
}

.scroll-body { flex: 1; overflow: hidden; }

/* 统一左右内边距 */
.pad { padding: 24rpx 40rpx 0; }

/* ── 研习天数卡片 ── */
.days-card {
  background: #f5f3eb;
  border-radius: 32rpx;
  padding: 40rpx 48rpx;
  position: relative;
  overflow: hidden;

  .days-left {
    .days-label {
      display: block;
      font-size: 32rpx;
      color: $gray;
      margin-bottom: 8rpx;
    }
    .days-num-row {
      display: flex;
      align-items: flex-end;
      gap: 8rpx;
      .days-num {
        font-size: 128rpx;
        font-weight: 700;
        color: $green;
        line-height: 1;
        font-family: $font-bold;
      }
      .days-unit {
        font-size: 32rpx;
        color: $gray;
        padding-bottom: 16rpx;
      }
    }
  }

  .days-wm {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    .days-wm-text {
      font-size: 88rpx;
      font-weight: 700;
      color: rgba(0,0,0,0.06);
      writing-mode: vertical-rl;
      letter-spacing: 10rpx;
      font-family: $font-bold;
    }
  }
}

/* ── 数据统计 ── */
.stat-row {
  display: flex;
  gap: 24rpx;

  .stat-card {
    flex: 1;
    border-radius: 32rpx;
    padding: 36rpx 40rpx;

    .stat-label {
      display: block;
      font-size: 30rpx;
      color: $gray;
      margin-bottom: 12rpx;
    }
    .stat-num-row {
      display: flex;
      align-items: flex-end;
      gap: 6rpx;
      .stat-num {
        font-size: 80rpx;
        font-weight: 600;
        line-height: 1;
        font-family: $font-bold;
      }
      .c-green { color: $green; }
      .c-red   { color: $red; }
      .stat-unit {
        font-size: 30rpx;
        color: $gray;
        padding-bottom: 10rpx;
      }
    }
  }
  .bg-green { background: #e6f2e9; }
  .bg-pink  { background: #f8ebe4; }
}

/* ── 模块标题 ── */
.mod-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .mod-title-wrap {
    display: flex;
    align-items: center;
    gap: 14rpx;

    .mod-bar {
      width: 8rpx;
      height: 44rpx;
      background: $green;
      border-radius: 4rpx;
    }
    .mod-title {
      font-size: 48rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }
  }
  .mod-action {
    font-size: 30rpx;
    color: $green;
  }
}

/* ── 当前目标卡片 ── */
.goal-card {
  background: #e8e6e1;
  border-radius: 32rpx;
  padding: 40rpx 48rpx;
  position: relative;
  overflow: hidden;

  .goal-side-tag {
    position: absolute;
    top: 0; right: 0;
    width: 56rpx;
    background: $red;
    border-radius: 0 32rpx 0 12rpx;
    padding: 20rpx 0 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .goal-side-text {
      color: #fff;
      font-size: 24rpx;
      writing-mode: vertical-rl;
      letter-spacing: 6rpx;
    }
  }

  .goal-name {
    display: block;
    font-size: 52rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 20rpx;
    padding-right: 72rpx;
    font-family: $font-bold;
  }

  .goal-desc {
    display: block;
    font-size: 32rpx;
    color: #444;
    line-height: 52rpx;
    margin-bottom: 32rpx;
    padding-right: 72rpx;
  }

  .goal-prog-hd {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    .goal-prog-label { font-size: 32rpx; color: #444; }
    .goal-prog-count { font-size: 32rpx; color: $green; }
  }

  .prog-track {
    width: 100%;
    height: 16rpx;
    background: #d0cec9;
    border-radius: 8rpx;
    overflow: hidden;

    .prog-fill {
      height: 100%;
      background: $green;
      border-radius: 8rpx;
    }
  }
}

/* ── 课业卡片 ── */
.lesson-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx 36rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;

  .lesson-icon-wrap {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #e6f2e9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lesson-info {
    flex: 1;

    .lesson-hd {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 12rpx;

      .ltag {
        border-radius: 8rpx;
        padding: 4rpx 16rpx;
        .ltag-text { font-size: 26rpx; }
      }
      .ltag-light { background: #e6f2e9; }
      .ltag-light-text { color: $green; }
      .ltag-dark  { background: $green; }
      .ltag-dark-text  { color: #fff; }

      .lesson-title {
        font-size: 44rpx;
        font-weight: 600;
        color: $dark;
        font-family: $font-bold;
      }
    }

    .lesson-sub {
      font-size: 30rpx;
      color: $gray;
    }
  }
}

.mt-s { margin-top: 24rpx; }

/* ── 成就徽章 ── */
.badge-row {
  display: flex;
  gap: 32rpx;

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;

    .badge {
      width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .badge-text {
        font-size: 32rpx;
        font-weight: 600;
        writing-mode: vertical-rl;
        letter-spacing: 6rpx;
        font-family: $font-bold;
      }
    }

    .badge-on {
      background: #fdf8f0;
      border: 3rpx dashed $red;
      .badge-text-on { color: $red; }
    }

    .badge-off {
      background: #f0f0f0;
      border: 3rpx dashed #ccc;
      .badge-text-off { color: #ccc; }
    }

    .badge-status {
      font-size: 28rpx;
      color: $gray;
    }
    .badge-status-off { color: #999; }
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
      font-size: 24rpx;
      color: $gray;
    }
  }

  .tab-active {
    .tab-icon-bg {
      width: 56rpx;
      height: 56rpx;
      background: $green;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tab-text-active {
      font-size: 24rpx;
      font-weight: 500;
      color: $green;
    }
  }
}
</style>
