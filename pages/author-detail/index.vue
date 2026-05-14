<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="24" color="#2a6e44" />
      </view>
      <text class="navbar-title">作者详情</text>
      <view style="width: 80rpx;" />
    </view>

    <scroll-view scroll-y class="scroll-body">
      <!-- 作者信息卡片 -->
      <view class="author-header">
        <image v-if="author.avatarUrl" class="author-avatar" :src="author.avatarUrl" mode="aspectFill" />
        <view v-else class="author-avatar-placeholder">
          <text class="avatar-text">{{ author.name ? author.name[0] : '' }}</text>
        </view>
        <view class="author-info">
          <text class="author-name">{{ author.name }}</text>
          <text class="author-dynasty">{{ author.dynasty }}</text>
        </view>
      </view>

      <!-- 简介 -->
      <view v-if="author.description" class="author-desc-card">
        <text class="desc-title">简介</text>
        <text class="desc-content">{{ author.description }}</text>
      </view>

      <!-- 该作者的诗词 -->
      <view class="poems-section">
        <text class="poems-section-title">相关诗词</text>

        <view v-if="poemsLoading && poemsList.length === 0" class="loading-more">
          <text>加载中...</text>
        </view>

        <view v-if="!poemsLoading && poemsList.length === 0" class="empty-state">
          <text class="empty-text">暂无相关诗词</text>
        </view>

        <view
          v-for="poem in poemsList"
          :key="poem.poemId"
          class="card card-white"
          @click="goToDetail(poem.poemId)"
        >
          <view class="side-tag"><text class="side-tag-text">{{ poem.dynasty }}</text></view>
          <view class="card-meta"><text class="meta-text">{{ poem.dynasty }} · 诗</text></view>
          <text class="card-title">{{ poem.title }}</text>
          <text class="card-body">{{ poem.excerpt }}</text>
          <view class="card-footer">
            <text class="card-author">{{ poem.author }}</text>
            <text class="card-more">全文阅读 →</text>
          </view>
        </view>

        <view v-if="poemsLoading && poemsList.length > 0" class="loading-more">
          <text>加载中...</text>
        </view>
        <view v-if="!poemsLoading && noMore && poemsList.length > 0" class="loading-more">
          <text>没有更多了</text>
        </view>
      </view>

      <view style="height: 40rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getAuthorDetail, getPoems } from '@/utils/request.js'

export default {
  data() {
    return {
      authorId: null,
      author: {},
      poemsList: [],
      poemsLoading: false,
      noMore: false,
      page: 1,
      pageSize: 20
    }
  },
  onLoad(options) {
    if (options.id) {
      this.authorId = options.id
      this.fetchAuthorDetail().then(() => {
        this.fetchPoems()
      })
    }
  },
  methods: {
    async fetchAuthorDetail() {
      try {
        const data = await getAuthorDetail(this.authorId)
        console.log('[作者详情] 成功:', data)
        this.author = data || {}
      } catch (err) {
        console.error('[作者详情] 失败:', err)
        uni.showToast({ title: '获取作者信息失败', icon: 'none' })
      }
    },
    async fetchPoems() {
      if (this.poemsLoading || this.noMore) return
      this.poemsLoading = true
      try {
        const data = await getPoems({
          q: this.author.name || '',
          page: this.page,
          pageSize: this.pageSize
        })
        const list = data.list || []
        if (this.page === 1) {
          this.poemsList = list
        } else {
          this.poemsList = [...this.poemsList, ...list]
        }
        if (list.length < this.pageSize) {
          this.noMore = true
        }
      } catch (err) {
        console.error('[作者诗词] 获取失败:', err)
      } finally {
        this.poemsLoading = false
      }
    },
    loadMore() {
      if (!this.noMore && !this.poemsLoading) {
        this.page++
        this.fetchPoems()
      }
    },
    goBack() {
      uni.navigateBack()
    },
    goToDetail(poemId) {
      uni.navigateTo({ url: `/pages/detail/index?id=${poemId}` })
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$bg: #f8f5ee;
$dark: #1a1a1a;
$gray: #666666;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 24rpx;
  padding-top: 70rpx;
  background: $bg;

  .navbar-left {
    width: 80rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .navbar-title {
    font-size: 36rpx;
    font-weight: 500;
    color: $green;
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
}

/* 作者头部 */
.author-header {
  display: flex;
  align-items: center;
  gap: 32rpx;
  padding: 40rpx;
  background: #fff;
  margin: 0 40rpx 24rpx;
  border-radius: 32rpx;
}

.author-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  border: 3rpx solid #e0d8c8;
  flex-shrink: 0;
}

.author-avatar-placeholder {
  width: 160rpx;
  height: 160rpx;
  border-radius: 32rpx;
  background: $green;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-text {
    font-size: 64rpx;
    color: #fff;
    font-weight: 700;
  }
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;

  .author-name {
    font-size: 44rpx;
    font-weight: 700;
    color: $dark;
  }

  .author-dynasty {
    font-size: 28rpx;
    color: $gray;
  }
}

/* 简介卡片 */
.author-desc-card {
  background: #fff;
  margin: 0 40rpx 24rpx;
  border-radius: 32rpx;
  padding: 36rpx;

  .desc-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 16rpx;
  }

  .desc-content {
    font-size: 28rpx;
    color: $gray;
    line-height: 48rpx;
  }
}

/* 诗词区 */
.poems-section {
  padding: 0 40rpx;

  .poems-section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 24rpx;
  }
}

/* 诗词卡片 */
.card {
  border-radius: 32rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
  position: relative;
  overflow: hidden;

  .side-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: $green;
    border-radius: 0 32rpx 0 16rpx;
    padding: 16rpx 14rpx 20rpx;

    .side-tag-text {
      color: #fff;
      font-size: 22rpx;
      writing-mode: vertical-rl;
      letter-spacing: 5rpx;
    }
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
    font-family: 'STSong', 'SimSun', 'Songti SC', serif;
    padding-right: 60rpx;
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
    justify-content: space-between;
  }

  .card-author {
    font-size: 24rpx;
    color: $gray;
  }

  .card-more {
    font-size: 24rpx;
    color: $green;
  }
}

.card-white {
  background: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80rpx;

  .empty-text {
    font-size: 30rpx;
    color: $gray;
  }
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  color: $gray;
  font-size: 26rpx;
}
</style>
