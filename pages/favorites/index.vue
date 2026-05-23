<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">我的收藏</text>
      <view class="nav-btn" />
    </view>

    <!-- 统计栏 -->
    <view class="stat-bar">
      <view class="stat-left">
        <text class="stat-num">{{ total }}</text>
        <text class="stat-label">首诗词收藏</text>
      </view>
      <view class="stat-seal">
        <text class="seal-text">藏</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">
      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <view class="empty-seal">
          <text class="empty-seal-text">藏</text>
        </view>
        <text class="empty-text">暂无收藏</text>
        <text class="empty-hint">浏览诗词时点击心形即可收藏</text>
      </view>

      <!-- 收藏列表 -->
      <view class="list">
        <view
          class="poem-card"
          v-for="(p, i) in filteredList"
          :key="p.poemId"
          @click="goDetail(p)"
        >
          <!-- 左侧装饰线 -->
          <view class="card-deco">
            <view class="deco-dot" />
            <view class="deco-line" />
          </view>
          <!-- 内容 -->
          <view class="card-body">
            <view class="card-header">
              <text class="card-title">{{ p.title }}</text>
              <text class="card-dynasty">{{ p.dynasty }}</text>
            </view>
            <text class="card-author">{{ p.author }}</text>
            <text class="card-preview">{{ p.excerpt }}</text>
          </view>
          <!-- 操作 -->
          <view class="card-action" @click.stop="removeFav(p)">
            <uni-icons type="heart-filled" size="18" color="#c05050" />
          </view>
        </view>
      </view>
      <view style="height: 60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getFavorites, toggleFavorite } from '@/utils/request.js'

export default {
  data() {
    return {
      activeTab: '全部',
      tabs: ['全部'],
      list: [],
      total: 0,
      loading: true
    }
  },
  computed: {
    filteredList() {
      return this.list
    }
  },
  onLoad() {
    if (!uni.getStorageSync('token')) {
      uni.showModal({
        title: '提示',
        content: '请先登录后查看收藏',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: '/pages/login/index' })
          }
          uni.navigateBack()
        }
      })
      return
    }
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      this.loading = true
      try {
        const res = await getFavorites({ page: 1, pageSize: 100 })
        if (res && res.list) {
          this.list = res.list.map(p => ({
            ...p,
            preview: p.excerpt
          }))
          this.total = res.total
        }
      } catch (e) {
        console.error('获取收藏列表失败', e)
      } finally {
        this.loading = false
      }
    },
    async removeFav(p) {
      uni.showModal({
        title: '取消收藏',
        content: `确定取消收藏《${p.title}》？`,
        confirmColor: '#c05050',
        success: async (res) => {
          if (res.confirm) {
            try {
              await toggleFavorite(p.poemId)
              this.list = this.list.filter(item => item.poemId !== p.poemId)
              this.total--
              uni.showToast({ title: '已取消收藏', icon: 'none' })
            } catch (e) {
              console.error('取消收藏失败', e)
            }
          }
        }
      })
    },
    goDetail(p) {
      uni.navigateTo({ url: `/pages/detail/index?id=${p.poemId}` })
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$bg:    #f8f5ee;
$dark:  #1a1a1a;
$gray:  #999;
$light: #c8c2b6;
$font:      'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', serif;
$seal-red:  #c05050;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
  font-family: $font;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52rpx 36rpx 20rpx;

  .nav-btn {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: rgba(42,110,68,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-title {
    font-size: 36rpx;
    font-weight: 600;
    color: $dark;
  }
}

/* 统计栏 */
.stat-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16rpx 32rpx 0;
  padding: 32rpx 36rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);

  .stat-left {
    display: flex;
    align-items: baseline;
    gap: 12rpx;
  }

  .stat-num {
    font-size: 56rpx;
    font-weight: 700;
    color: $green;
    font-family: $font-bold;
    line-height: 1;
  }

  .stat-label {
    font-size: 26rpx;
    color: $gray;
  }

  .stat-seal {
    width: 72rpx;
    height: 72rpx;
    border: 4rpx solid $seal-red;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;

    .seal-text {
      font-size: 36rpx;
      color: $seal-red;
      font-family: $font-bold;
      font-weight: 700;
    }
  }
}

.scroll-body { flex: 1; overflow: hidden; }

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-seal {
    width: 120rpx;
    height: 120rpx;
    border: 6rpx solid $light;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36rpx;

    .empty-seal-text {
      font-size: 56rpx;
      color: $light;
      font-family: $font-bold;
      font-weight: 700;
    }
  }

  .empty-text {
    font-size: 34rpx;
    font-weight: 500;
    color: $dark;
  }

  .empty-hint {
    font-size: 26rpx;
    color: $gray;
    margin-top: 12rpx;
  }
}

/* 列表 */
.list { padding: 24rpx 32rpx 0; }

.poem-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 24rpx 28rpx 0;
  margin-bottom: 16rpx;
  display: flex;
  align-items: stretch;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  /* 左侧装饰 */
  .card-deco {
    width: 48rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 8rpx;
    flex-shrink: 0;

    .deco-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: $green;
      flex-shrink: 0;
    }

    .deco-line {
      flex: 1;
      width: 2rpx;
      background: linear-gradient(to bottom, rgba(42, 110, 68, 0.25), transparent);
      margin-top: 8rpx;
    }
  }

  /* 最后一项隐藏连线 */
  &:last-child .deco-line {
    display: none;
  }

  .card-body {
    flex: 1;
    min-width: 0;
    padding-left: 8rpx;

    .card-header {
      display: flex;
      align-items: baseline;
      gap: 14rpx;
      margin-bottom: 4rpx;
    }

    .card-title {
      font-size: 34rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-dynasty {
      font-size: 22rpx;
      color: $green;
      flex-shrink: 0;
    }

    .card-author {
      display: block;
      font-size: 24rpx;
      color: $gray;
      margin-bottom: 12rpx;
    }

    .card-preview {
      display: block;
      font-size: 26rpx;
      color: #666;
      line-height: 44rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .card-action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding-left: 16rpx;
  }
}
</style>
