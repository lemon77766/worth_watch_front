<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">我的收藏</text>
      <view class="nav-btn">
        <uni-icons type="search" size="20" color="#2a6e44" />
      </view>
    </view>

    <!-- 统计栏 -->
    <view class="stat-bar">
      <view class="stat-item" v-for="s in stats" :key="s.label">
        <text class="stat-num">{{ s.num }}</text>
        <text class="stat-label">{{ s.label }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">
      <view class="list">
        <view
          class="poem-card"
          v-for="p in filteredList" :key="p.poemId"
          @click="goDetail(p)"
        >
          <view class="card-left">
            <view class="card-tag" :style="{ background: p.tagColor }">
              <text class="card-tag-text">{{ p.dynasty }}</text>
            </view>
            <text class="card-title">{{ p.title }}</text>
            <text class="card-author">{{ p.author }}</text>
            <text class="card-preview">{{ p.excerpt }}</text>
          </view>
          <view class="card-right">
            <view class="fav-btn" @click.stop="removeFav(p)">
              <uni-icons type="heart-filled" size="22" color="#b82e2e" />
            </view>
            <text class="card-type">{{ p.type }}</text>
          </view>
        </view>
      </view>
      <view style="height:40rpx;" />
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
      stats: [
        { num: 0, label: '收藏诗词' }
      ],
      list: [],
      total: 0
    }
  },
  computed: {
    filteredList() {
      return this.list
    }
  },
  onLoad() {
    this.fetchFavorites()
  },
  methods: {
    async fetchFavorites() {
      try {
        const res = await getFavorites({ page: 1, pageSize: 100 })
        if (res && res.list) {
          this.list = res.list.map(p => ({
            ...p,
            preview: p.excerpt
          }))
          this.total = res.total
          this.stats[0].num = res.total
        }
      } catch (e) {
        console.error('获取收藏列表失败', e)
      }
    },
    async removeFav(p) {
      uni.showModal({
        title: '取消收藏',
        content: `确定取消收藏《${p.title}》？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await toggleFavorite(p.poemId)
              this.list = this.list.filter(item => item.poemId !== p.poemId)
              this.total--
              this.stats[0].num = this.total
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
$red:   #b82e2e;
$bg:    #f8f5ee;
$dark:  #1a1a1a;
$gray:  #888;
$font:      'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', serif;

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
    font-weight: 500;
    color: $dark;
  }
}

.stat-bar {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 40rpx;
  background: #fff;
  margin: 0 40rpx;
  border-radius: 24rpx;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;

    .stat-num {
      font-size: 52rpx;
      font-weight: 700;
      color: $green;
      font-family: $font-bold;
    }

    .stat-label {
      font-size: 24rpx;
      color: $gray;
    }
  }
}

.scroll-body { flex: 1; overflow: hidden; }

.list { padding: 16rpx 40rpx 0; }

.poem-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx 36rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .card-left {
    flex: 1;

    .card-tag {
      display: inline-flex;
      border-radius: 8rpx;
      padding: 4rpx 16rpx;
      margin-bottom: 12rpx;

      .card-tag-text { color: #fff; font-size: 22rpx; }
    }

    .card-title {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
      margin-bottom: 6rpx;
    }

    .card-author {
      display: block;
      font-size: 24rpx;
      color: $gray;
      margin-bottom: 16rpx;
    }

    .card-preview {
      display: block;
      font-size: 26rpx;
      color: #555;
      line-height: 44rpx;
    }
  }

  .card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16rpx;
    padding-left: 16rpx;

    .fav-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #fdecea;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-type {
      font-size: 22rpx;
      color: $gray;
      white-space: nowrap;
    }
  }
}
</style>
