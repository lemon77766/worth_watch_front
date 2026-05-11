<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="24" color="#2a6e44" />
      </view>
      <text class="navbar-title">作者列表</text>
      <view style="width: 80rpx;" />
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <input
        class="search-input"
        v-model="keyword"
        placeholder="搜索作者..."
        confirm-type="search"
        @confirm="onSearch"
      />
      <view v-if="keyword" class="search-clear" @click="clearSearch">
        <uni-icons type="clear" size="18" color="#999" />
      </view>
    </view>

    <!-- 作者列表 -->
    <scroll-view scroll-y class="scroll-body" @scrolltolower="loadMore">
      <!-- 空状态 -->
      <view v-if="!loading && authors.length === 0" class="empty-state">
        <uni-icons type="person" size="80" color="#ccc" />
        <text class="empty-text">暂无作者</text>
      </view>

      <view
        v-for="author in authors"
        :key="author.authorId"
        class="author-item"
        @click="goToDetail(author)"
      >
        <image v-if="author.avatarUrl" class="author-avatar" :src="author.avatarUrl" mode="aspectFill" />
        <view v-else class="author-avatar-placeholder">
          <text class="avatar-text">{{ author.name ? author.name[0] : '' }}</text>
        </view>
        <view class="author-info">
          <text class="author-name">{{ author.name }}</text>
          <text class="author-dynasty">{{ author.dynasty || '' }}</text>
          <text v-if="author.description" class="author-desc">{{ author.description.length > 40 ? author.description.substring(0, 40) + '...' : author.description }}</text>
        </view>
        <uni-icons type="right" size="16" color="#ccc" />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-if="!loading && noMore && authors.length > 0" class="loading-more">
        <text>没有更多了</text>
      </view>

      <view style="height: 40rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getAuthors } from '@/utils/request.js'

export default {
  data() {
    return {
      authors: [],
      keyword: '',
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false
    }
  },
  onLoad() {
    this.fetchAuthors()
  },
  methods: {
    async fetchAuthors() {
      if (this.loading || this.noMore) return
      this.loading = true
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize
        }
        if (this.keyword) {
          params.q = this.keyword
        }
        const data = await getAuthors(params)
        console.log('[作者列表] 成功:', data)
        const list = data.list || []
        if (this.page === 1) {
          this.authors = list
        } else {
          this.authors = [...this.authors, ...list]
        }
        if (list.length < this.pageSize) {
          this.noMore = true
        }
      } catch (err) {
        console.error('[作者列表] 失败:', err)
        uni.showToast({ title: '获取作者列表失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++
        this.fetchAuthors()
      }
    },
    onSearch() {
      this.page = 1
      this.authors = []
      this.noMore = false
      this.fetchAuthors()
    },
    clearSearch() {
      this.keyword = ''
      this.onSearch()
    },
    goBack() {
      uni.navigateBack()
    },
    goToDetail(author) {
      if (author.authorId) {
        uni.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` })
      }
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

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  margin: 0 40rpx 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;

  .search-input {
    flex: 1;
    font-size: 30rpx;
    height: 56rpx;
  }

  .search-clear {
    padding: 8rpx;
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-text {
    font-size: 36rpx;
    color: $dark;
    margin-top: 32rpx;
  }
}

/* 作者列表项 */
.author-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 32rpx;
  margin: 0 40rpx 20rpx;
}

.author-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2rpx solid #e0d8c8;
}

.author-avatar-placeholder {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: $green;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .avatar-text {
    font-size: 40rpx;
    color: #fff;
    font-weight: 700;
  }
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  overflow: hidden;

  .author-name {
    font-size: 32rpx;
    font-weight: 600;
    color: $dark;
  }

  .author-dynasty {
    font-size: 24rpx;
    color: #999;
  }

  .author-desc {
    font-size: 24rpx;
    color: $gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  color: $gray;
  font-size: 26rpx;
}
</style>
