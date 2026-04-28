<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left">
        <view class="navbar-avatar" />
        <uni-icons type="search" size="24" color="#2a6e44" />
      </view>
      <text class="navbar-title">值得看么</text>
      <view style="width:120rpx;" />
    </view>

    <!-- 分类 Tab -->
    <view class="tabs">
      <view
        v-for="tab in tabs" :key="tab"
        class="tab-item"
        :class="{ active: activeTab === tab }"
        @click="onTabChange(tab)"
      >
        <text class="tab-text">{{ tab }}</text>
        <view v-if="activeTab === tab" class="tab-line" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body" @scrolltolower="onReachBottom">

      <!-- 诗词列表 -->
      <view
        v-for="(poem, index) in poemsList"
        :key="poem.poemId"
        class="card card-white"
        @click="goToDetail(poem.poemId)"
      >
        <view class="side-tag"><text class="side-tag-text">{{ poem.dynasty }}</text></view>
        <view class="card-meta">
          <text class="meta-text">{{ poem.dynasty }} · 诗</text>
        </view>
        <text class="card-title">{{ poem.title }}</text>
        <text class="card-body">{{ poem.excerpt }}</text>
        <view class="card-footer">
          <text class="card-author">{{ poem.author }}</text>
          <text class="card-more">全文阅读 →</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-if="finished && poemsList.length > 0" class="loading-more">
        <text>— 已加载全部 —</text>
      </view>
      <view v-if="!loading && poemsList.length === 0" class="loading-more">
        <text>暂无诗词</text>
      </view>

      <view style="height:40rpx;" />
    </scroll-view>

    <!-- 底部导航 -->
    <view class="tabbar">
      <view class="tab" @click="uni.reLaunch({url:'/pages/index/index'})">
        <uni-icons type="home" size="24" color="#999" />
        <text class="tab-text">首页</text>
      </view>
      <view class="tab tab-active">
        <uni-icons type="folder" size="24" color="#2a6e44" />
        <text class="tab-text tab-text-active">文库</text>
      </view>
      <view class="tab tab-center" @click="uni.reLaunch({url:'/pages/study/index'})">
        <view class="tab-center-btn">
          <uni-icons type="compose" size="24" color="#fff" />
        </view>
        <text class="tab-text">研习</text>
      </view>
      <view class="tab">
        <uni-icons type="eye" size="24" color="#999" />
        <text class="tab-text">深读</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getPoems } from '@/utils/request.js'

export default {
  data() {
    return {
      tabs: ['朝代', '体裁', '选集'],
      activeTab: '朝代',
      poemsList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      finished: false
    }
  },
  onLoad() {
    console.log('[文库] onLoad')
    this.fetchPoems()
  },
  methods: {
    async fetchPoems() {
      console.log('[文库] fetchPoems 调用, page:', this.page)
      if (this.loading || this.finished) return
      this.loading = true
      
      try {
        const data = await getPoems({ page: this.page, pageSize: this.pageSize })
        this.total = data.total || 0
        if (this.page === 1) {
          this.poemsList = data.list || []
        } else {
          this.poemsList = [...this.poemsList, ...(data.list || [])]
        }
        if (this.poemsList.length >= this.total) {
          this.finished = true
        }
      } catch (err) {
        console.error('[文库] 获取失败:', err)
      } finally {
        this.loading = false
      }
    },
    onTabChange(tab) {
      this.activeTab = tab
      this.page = 1
      this.poemsList = []
      this.finished = false
      this.fetchPoems()
    },
    onReachBottom() {
      if (!this.finished) {
        this.page++
        this.fetchPoems()
      }
    },
    goToDetail(poemId) {
      uni.navigateTo({ url: `/pages/detail/index?id=${poemId}` })
    }
  }
}
</script>

<style lang="scss">
$green:  #2a6e44;
$red:    #b82e2e;
$bg:     #f8f5ee;
$dark:   #1a1a1a;
$gray:   #666666;
$font:   'PingFang SC', 'Noto Sans SC', 'Source Han Sans CN', -apple-system, sans-serif;
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
    letter-spacing: 2rpx;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .navbar-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: $dark;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .navbar-search {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

/* 分类 Tab */
.tabs {
  display: flex;
  padding: 0 40rpx;
  gap: 48rpx;
  background: $bg;
  margin-bottom: 8rpx;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 16rpx;

    .tab-text {
      font-size: 30rpx;
      color: $gray;
    }

    .tab-line {
      width: 40rpx;
      height: 4rpx;
      background: $green;
      border-radius: 2rpx;
      margin-top: 8rpx;
    }

    &.active .tab-text {
      color: $dark;
      font-weight: 600;
    }
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
  padding: 0 40rpx;
}

/* 通用卡片 */
.card {
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
  position: relative;
  overflow: hidden;

  /* 右侧竖排标签 */
  .side-tag {
    position: absolute;
    top: 0; right: 0;
    background: $red;
    border-radius: 0 32rpx 0 16rpx;
    padding: 16rpx 14rpx 20rpx;

    .side-tag-text {
      color: #fff;
      font-size: 22rpx;
      writing-mode: vertical-rl;
      letter-spacing: 5rpx;
    }
  }

  .side-tag-sm {
    padding: 12rpx 12rpx 16rpx;
    .side-tag-text { font-size: 20rpx; }
  }

  .card-meta {
    margin-bottom: 12rpx;
    .meta-text {
      font-size: 24rpx;
      color: $gray;
    }
  }

  .card-title {
    display: block;
    font-size: 56rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 20rpx;
    font-family: $font-bold;
    padding-right: 60rpx;
  }

  .card-title-xl {
    font-size: 72rpx;
  }

  .card-body {
    display: block;
    font-size: 28rpx;
    color: #555;
    line-height: 48rpx;
    margin-bottom: 24rpx;
    padding-right: 60rpx;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .card-more {
      font-size: 24rpx;
      color: $green;
    }
  }
}

/* 白卡 */
.card-white { background: #fff; }

/* 中绿卡（鹿柴） */
.card-green-md {
  background: linear-gradient(150deg, #4a8a55 0%, #2a6e44 60%, #1a4a2e 100%);
  min-height: 280rpx;
}

/* 大绿卡（春江花月夜） */
.card-green-lg {
  background: linear-gradient(150deg, #3d7a4a 0%, #2a6e44 50%, #1a4a2e 100%);
  min-height: 380rpx;

  .featured-label {
    display: block;
    font-size: 22rpx;
    color: rgba(255,255,255,0.55);
    letter-spacing: 3rpx;
    margin-bottom: 16rpx;
  }

  .card-en-box {
    margin-top: 20rpx;
    padding: 20rpx 24rpx;
    background: rgba(255,255,255,0.1);
    border-radius: 16rpx;

    .card-en-text {
      font-size: 22rpx;
      color: rgba(255,255,255,0.65);
      line-height: 38rpx;
    }
  }
}

/* 底部导航 */
.tabbar {
  display: flex;
  background: #fff;
  border-top: 2rpx solid #f0f0f0;
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
    .tab-text-active {
      color: $green;
      font-weight: 500;
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

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  color: $gray;
  font-size: 26rpx;
}

.card-author {
  font-size: 24rpx;
  color: $gray;
}
</style>
