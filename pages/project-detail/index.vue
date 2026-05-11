<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="24" color="#2a6e44" />
      </view>
      <text class="navbar-title">{{ projectName }}</text>
      <view class="navbar-right" @click="onRenameProject">
        <uni-icons type="compose" size="22" color="#2a6e44" />
      </view>
    </view>

    <!-- 诗词列表 -->
    <scroll-view scroll-y class="scroll-body" @scrolltolower="loadMore">
      <!-- 空状态 -->
      <view v-if="!loading && poemsList.length === 0" class="empty-state">
        <uni-icons type="paperplane" size="80" color="#ccc" />
        <text class="empty-text">合集中暂无诗词</text>
        <text class="empty-hint">去文库页添加诗词到此合集</text>
      </view>

      <!-- 诗词卡片 -->
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
          <view class="card-footer-left">
            <text class="card-author">{{ poem.author }}</text>
            <text class="card-add-time">添加于 {{ formatDate(poem.addedAt) }}</text>
          </view>
          <view class="delete-btn" @click.stop="onRemovePoem(poem)">
            <uni-icons type="trash" size="20" color="#b82e2e" />
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-if="!loading && noMore" class="loading-more">
        <text>没有更多了</text>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>

    <!-- 添加诗词浮动按钮 -->
    <view class="fab-btn" @click="goAddPoems">
      <uni-icons type="plus" size="24" color="#fff" />
      <text class="fab-text">添加诗词</text>
    </view>
  </view>
</template>

<script>
import { getProjectPoems, removePoemFromProject, renameProject, addPoemToProject } from '@/utils/request.js'

export default {
  data() {
    return {
      projectId: null,
      projectName: '',
      poemsList: [],
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false,
      loaded: false
    }
  },
  onLoad(options) {
    if (options.projectId) {
      this.projectId = parseInt(options.projectId)
    }
    if (options.name) {
      this.projectName = decodeURIComponent(options.name)
    }
    this.fetchPoems()
  },
  onShow() {
    // 从文库页添加诗词返回后刷新列表（跳过首次）
    if (this.loaded && this.projectId) {
      this.page = 1
      this.noMore = false
      this.fetchPoems()
    }
  },
  methods: {
    async fetchPoems() {
      if (this.loading || this.noMore) return
      this.loading = true
      try {
        const data = await getProjectPoems(this.projectId, {
          page: this.page,
          pageSize: this.pageSize
        })
        console.log('[获取项目诗词] 成功:', data)
        
        const list = data.list || []
        if (this.page === 1) {
          this.poemsList = list
        } else {
          this.poemsList = [...this.poemsList, ...list]
        }
        
        // 判断是否还有更多
        if (list.length < this.pageSize) {
          this.noMore = true
        }
      } catch (err) {
        console.error('[获取项目诗词] 失败:', err)
        uni.showToast({ title: '获取诗词失败', icon: 'none' })
      } finally {
        this.loading = false
        this.loaded = true
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++
        this.fetchPoems()
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    },
    goBack() {
      uni.navigateBack()
    },
    goAddPoems() {
      // 跳转到首页文库 tab，自动进入批量添加模式
      uni.reLaunch({
        url: `/pages/index/index?batchProjectId=${this.projectId}&batchProjectName=${encodeURIComponent(this.projectName)}`
      })
    },
    goToDetail(poemId) {
      uni.navigateTo({ url: `/pages/detail/index?id=${poemId}` })
    },
    onRemovePoem(poem) {
      uni.showModal({
        title: '移除确认',
        content: `确定要将「${poem.title}」从合集中移除吗？`,
        confirmColor: '#b82e2e',
        success: async (res) => {
          if (res.confirm) {
            try {
              await removePoemFromProject(this.projectId, poem.poemId)
              console.log('[移除诗词] 移除成功:', poem.title)
              uni.showToast({ title: '已移除', icon: 'success' })
              // 从列表中移除
              this.poemsList = this.poemsList.filter(p => p.poemId !== poem.poemId)
              // 通知研习页更新合集数据
              uni.$emit('onProjectPoemRemoved', { projectId: this.projectId, poemCount: this.poemsList.length })
            } catch (err) {
              console.error('[移除诗词] 移除失败:', err)
              uni.showToast({ title: '移除失败', icon: 'none' })
            }
          }
        }
      })
    },
    onRenameProject() {
      uni.showModal({
        title: '修改合集名称',
        editable: true,
        placeholderText: '请输入新名称',
        content: this.projectName,
        confirmColor: '#2a6e44',
        success: async (res) => {
          if (res.confirm && res.content) {
            const newName = res.content.trim()
            if (!newName) {
              uni.showToast({ title: '名称不能为空', icon: 'none' })
              return
            }
            if (newName === this.projectName) {
              return
            }
            try {
              await renameProject(this.projectId, newName)
              console.log('[改名合集] 改名成功:', newName)
              uni.showToast({ title: '改名成功', icon: 'success' })
              this.projectName = newName
            } catch (err) {
              console.error('[改名合集] 改名失败:', err)
              uni.showToast({ title: '改名失败', icon: 'none' })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$red: #b82e2e;
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

  .navbar-right {
    width: 80rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .navbar-title {
    font-size: 36rpx;
    font-weight: 500;
    color: $green;
    max-width: 400rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  .empty-hint {
    font-size: 28rpx;
    color: $gray;
    margin-top: 16rpx;
  }
}

/* 文库卡片样式 */
.card {
  border-radius: 32rpx;
  padding: 40rpx;
  margin: 0 40rpx 24rpx;
  position: relative;
  overflow: hidden;

  .side-tag {
    position: absolute;
    top: 0;
    right: 0;
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

  .card-footer-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  .card-author {
    font-size: 24rpx;
    color: $gray;
  }

  .card-add-time {
    font-size: 24rpx;
    color: #999;
  }

  .delete-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fdecea;
    border-radius: 16rpx;
  }
}

.card-white {
  background: #fff;
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  color: $gray;
  font-size: 26rpx;
}

.fab-btn {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: $green;
  padding: 24rpx 40rpx;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 32rpx rgba(42,110,68,0.4);

  .fab-text {
    font-size: 28rpx;
    color: #fff;
    font-weight: 500;
  }
}
</style>
