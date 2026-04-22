<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <uni-icons type="bars" size="22" color="#3a3a3a" />
      <text class="navbar-title">值得看么</text>
      <view class="navbar-right">
        <uni-icons type="search" size="22" color="#3a3a3a" />
        <image class="navbar-avatar" src="/static/logo.png" mode="aspectFill" />
      </view>
    </view>

    <!-- 分类 Tab -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab"
        class="tab-item"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        <text class="tab-text">{{ tab }}</text>
        <view v-if="activeTab === tab" class="tab-line" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- 卡片1：静夜思 - 普通白卡 -->
      <view class="card card-white">
        <view class="card-meta">
          <text class="meta-dynasty">唐朝</text>
          <text class="meta-dot">·</text>
          <text class="meta-type">山水</text>
        </view>
        <text class="card-title">静夜思</text>
        <text class="card-body">床前明月光，疑是地上霜。举头望明月，低头思故乡。</text>
        <view class="card-footer">
          <uni-icons type="compose" size="16" color="#3a6b35" />
          <text class="card-more">全文阅读 →</text>
        </view>
        <view class="card-tag-right">
          <text class="tag-vert">李白之</text>
        </view>
      </view>

      <!-- 卡片2：鹿柴 - 山水背景卡 -->
      <view class="card card-mountain">
        <view class="card-meta">
          <text class="meta-dynasty" style="color:#fff;">唐朝</text>
          <text class="meta-dot" style="color:#fff;">·</text>
          <text class="meta-type" style="color:#fff;">山水</text>
        </view>
        <text class="card-title" style="color:#fff;">鹿柴</text>
        <text class="card-body" style="color:rgba(255,255,255,0.9);">空山不见人，但闻人语响。返景入深林，复照青苔上。</text>
        <view class="card-footer">
          <image src="/static/logo.png" class="footer-avatar" mode="aspectFill" />
          <text class="card-label" style="color:rgba(255,255,255,0.7);">INCLUDED IN TANG ZHI</text>
        </view>
        <view class="card-tag-right">
          <text class="tag-vert">王维之</text>
        </view>
      </view>

      <!-- 卡片3：春江花月夜 - 绿色大卡 -->
      <view class="card card-green">
        <text class="card-featured-label">FEATURED SELECTION</text>
        <text class="card-title card-title-lg" style="color:#fff;">春江花月夜</text>
        <text class="card-body" style="color:rgba(255,255,255,0.9);">春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明！</text>
        <view class="card-en-desc">
          <text class="en-text">The grandeur of a poem called "Tapestry of the Spring River, Flowers, Moon and Night"</text>
        </view>
        <view class="card-footer" style="margin-top:20rpx;">
          <uni-icons type="heart" size="18" color="#fff" />
          <text style="color:#fff;font-size:22rpx;margin-left:8rpx;">1.2k Reads</text>
        </view>
        <view class="card-tag-right">
          <text class="tag-vert">张若虚</text>
        </view>
      </view>

      <!-- 卡片4：定风波 - 白卡 -->
      <view class="card card-white">
        <view class="card-meta">
          <text class="meta-dynasty">宋朝</text>
          <text class="meta-dot">·</text>
          <text class="meta-type">词</text>
        </view>
        <text class="card-title">定风波</text>
        <text class="card-body">莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。</text>
        <view class="card-footer">
          <text class="card-author">苏轼</text>
          <text class="card-more" style="margin-left:auto;">全文阅读</text>
        </view>
        <view class="card-tag-right">
          <text class="tag-vert">苏轼之</text>
        </view>
      </view>

      <!-- 卡片5：青玉案·元夕 - 暗色大卡 -->
      <view class="card card-dark">
        <view class="card-meta">
          <text class="meta-dynasty" style="color:rgba(255,255,255,0.7);">宋朝</text>
          <text class="meta-dot" style="color:rgba(255,255,255,0.7);">·</text>
          <text class="meta-type" style="color:rgba(255,255,255,0.7);">词</text>
        </view>
        <text class="card-title" style="color:#fff;font-size:48rpx;">青玉案·元夕</text>
        <text class="card-body" style="color:rgba(255,255,255,0.85);">众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。</text>
        <view class="card-tag-right">
          <text class="tag-vert">辛弃疾</text>
        </view>
      </view>

      <view style="height:30rpx;" />
    </scroll-view>

    <!-- 底部 TabBar -->
    <view class="tabbar">
      <view class="tab-bar-item" @click="goHome">
        <uni-icons type="home" size="22" color="#999" />
        <text class="tab-bar-text">首页</text>
      </view>
      <view class="tab-bar-item active">
        <uni-icons type="folder" size="22" color="#3a6b35" />
        <text class="tab-bar-text active-text">文库</text>
      </view>
      <view class="tab-bar-item tab-center">
        <view class="tab-center-btn">
          <uni-icons type="compose" size="24" color="#fff" />
        </view>
        <text class="tab-bar-text">题习</text>
      </view>
      <view class="tab-bar-item">
        <uni-icons type="eye" size="22" color="#999" />
        <text class="tab-bar-text">深读</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['朝代', '体裁', '选集'],
      activeTab: '朝代'
    }
  },
  methods: {
    goHome() {
      uni.navigateTo({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss">
$green: #3a6b35;
$cream: #f5f0e8;
$text-dark: #2c2c2c;
$text-gray: #888;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $cream;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50rpx 32rpx 20rpx;
  background-color: $cream;

  .navbar-title {
    font-size: 34rpx;
    font-weight: bold;
    color: $text-dark;
    letter-spacing: 4rpx;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .navbar-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    border: 2rpx solid #ccc;
  }
}

/* 分类 Tab */
.tabs {
  display: flex;
  padding: 0 32rpx;
  gap: 48rpx;
  background-color: $cream;
  margin-bottom: 8rpx;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 12rpx;

    .tab-text {
      font-size: 30rpx;
      color: $text-gray;
    }

    .tab-line {
      width: 40rpx;
      height: 4rpx;
      background: $green;
      border-radius: 2rpx;
      margin-top: 6rpx;
    }

    &.active .tab-text {
      color: $text-dark;
      font-weight: bold;
    }
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
  padding: 0 24rpx;
}

/* 通用卡片 */
.card {
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  position: relative;
  overflow: hidden;

  .card-meta {
    display: flex;
    align-items: center;
    gap: 6rpx;
    margin-bottom: 12rpx;

    .meta-dynasty, .meta-type {
      font-size: 22rpx;
      color: $text-gray;
    }
    .meta-dot {
      font-size: 22rpx;
      color: $text-gray;
    }
  }

  .card-title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: $text-dark;
    margin-bottom: 16rpx;
  }

  .card-title-lg {
    font-size: 52rpx;
  }

  .card-body {
    display: block;
    font-size: 26rpx;
    color: #555;
    line-height: 46rpx;
    margin-bottom: 20rpx;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .footer-avatar {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }

    .card-more {
      font-size: 22rpx;
      color: $green;
    }

    .card-author {
      font-size: 22rpx;
      color: $text-gray;
    }

    .card-label {
      font-size: 18rpx;
      color: $text-gray;
      letter-spacing: 1rpx;
    }
  }

  /* 右侧竖排标签 */
  .card-tag-right {
    position: absolute;
    top: 0;
    right: 0;
    background: #c0392b;
    border-radius: 0 24rpx 0 16rpx;
    padding: 12rpx 14rpx;

    .tag-vert {
      color: #fff;
      font-size: 20rpx;
      writing-mode: vertical-rl;
      letter-spacing: 4rpx;
    }
  }
}

/* 白色卡片 */
.card-white {
  background: #fff;
}

/* 山水背景卡 */
.card-mountain {
  background: linear-gradient(160deg, #7a9e7e 0%, #4a6741 50%, #2d4a2a 100%);
  min-height: 280rpx;
}

/* 绿色大卡 */
.card-green {
  background: linear-gradient(150deg, #5a8f5a 0%, #3a6b35 60%, #2a5228 100%);
  min-height: 360rpx;

  .card-featured-label {
    display: block;
    font-size: 18rpx;
    color: rgba(255,255,255,0.6);
    letter-spacing: 3rpx;
    margin-bottom: 16rpx;
  }

  .card-en-desc {
    margin-top: 16rpx;
    padding: 16rpx;
    background: rgba(255,255,255,0.1);
    border-radius: 12rpx;

    .en-text {
      font-size: 20rpx;
      color: rgba(255,255,255,0.7);
      line-height: 34rpx;
    }
  }
}

/* 暗色大卡 */
.card-dark {
  background: linear-gradient(160deg, #3a3020 0%, #1a1a0e 100%);
  min-height: 300rpx;
  background-image: radial-gradient(circle at 70% 60%, rgba(255,200,50,0.15) 0%, transparent 60%),
                    linear-gradient(160deg, #3a3020 0%, #1a1a0e 100%);
}

/* 底部 TabBar */
.tabbar {
  display: flex;
  background: #fff;
  padding: 16rpx 0 30rpx;
  border-top: 1rpx solid #f0f0f0;

  .tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;

    .tab-bar-text {
      font-size: 20rpx;
      color: #999;
    }

    .active-text {
      color: $green;
    }
  }

  .tab-center {
    .tab-center-btn {
      width: 80rpx;
      height: 80rpx;
      background: $green;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -20rpx;
    }
  }
}
</style>
