<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @click="goBack">
        <uni-icons type="left" size="24" color="#2a6e44" />
      </view>
      <text class="navbar-title">我的学习合集</text>
      <view style="width: 80rpx;" />
    </view>

    <!-- 合集列表 -->
    <scroll-view scroll-y class="scroll-body">
      <!-- 空状态 -->
      <view v-if="!loading && projects.length === 0" class="empty-state">
        <view class="empty-icon-wrap">
          <uni-icons type="star" size="48" color="#2a6e44" />
        </view>
        <text class="empty-text">暂无学习合集</text>
        <text class="empty-hint">在文库页选择诗词后可创建</text>
      </view>

      <!-- 合集卡片 -->
      <view
        v-for="(project, index) in projects"
        :key="project.projectId"
        class="project-card"
        :class="{ 'is-selected': project.isSelected }"
      >
        <!-- 卡片主体 -->
        <view class="card-main" @click="onViewPoems(project)">
          <!-- 序号装饰 -->
          <view class="project-index" :class="{ 'index-active': project.isSelected }">
            <text class="index-text">{{ index + 1 }}</text>
          </view>
          <view class="project-info">
            <view class="project-name-row">
              <text class="project-name">{{ project.name }}</text>
              <view v-if="project.isSelected" class="selected-tag">
                <text class="selected-tag-text">当前</text>
              </view>
            </view>
            <view class="project-meta-row">
              <uni-icons type="paperplane" size="14" color="#999" />
              <text class="project-meta">{{ project.poemCount }} 首诗词</text>
              <text class="meta-dot">·</text>
              <uni-icons type="calendar" size="14" color="#999" />
              <text class="project-meta">{{ formatDate(project.createdAt) }}</text>
            </view>
          </view>
          <view class="arrow-wrap">
            <uni-icons type="right" size="16" color="#ccc" />
          </view>
        </view>
        <!-- 操作按钮区 -->
        <view class="card-actions">
          <view
            class="action-btn select-btn"
            :class="{ 'is-current': project.isSelected }"
            @click="onSelectAsCurrent(project)"
          >
            <uni-icons :type="project.isSelected ? 'checkmarkempty' : 'flag'" size="16" :color="project.isSelected ? '#999' : '#2a6e44'" />
            <text class="action-btn-text" :class="{ 'is-current': project.isSelected }">{{ project.isSelected ? '已选中' : '选中' }}</text>
          </view>
          <view class="action-divider" />
          <view class="action-btn rename-btn" @click="onRenameProject(project)">
            <uni-icons type="compose" size="16" color="#e6a23c" />
            <text class="action-btn-text rename-text">改名</text>
          </view>
          <view class="action-divider" />
          <view class="action-btn delete-btn" @click="onDeleteProject(project)">
            <uni-icons type="trash" size="16" color="#b82e2e" />
            <text class="action-btn-text delete-text">删除</text>
          </view>
        </view>
      </view>

      <view style="height: 60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getProjects, selectCurrentProject, deleteProject, renameProject } from '@/utils/request.js'

export default {
  data() {
    return {
      projects: [],
      loading: true
    }
  },
  onLoad() {
    if (!uni.getStorageSync('token')) {
      uni.showModal({
        title: '提示',
        content: '请先登录后查看学习合集',
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
    this.fetchProjects()
  },
  methods: {
    async fetchProjects() {
      this.loading = true
      try {
        const data = await getProjects()
        console.log('[获取学习合集] 成功:', data)
        this.projects = data || []
      } catch (err) {
        console.error('[获取学习合集] 失败:', err)
        uni.showToast({ title: '获取合集失败', icon: 'none' })
      } finally {
        this.loading = false
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
    async onSelectAsCurrent(project) {
      if (project.isSelected) return
      try {
        await selectCurrentProject(project.projectId)
        console.log('[选择合集] 选中成功:', project.name)
        this.fetchProjects()
      } catch (err) {
        console.error('[选择合集] 选中失败:', err)
        uni.showToast({ title: '选择合集失败', icon: 'none' })
      }
    },
    onDeleteProject(project) {
      uni.showModal({
        title: '删除确认',
        content: `确定要删除「${project.name}」吗？删除后不可恢复。`,
        confirmColor: '#b82e2e',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteProject(project.projectId)
              console.log('[删除合集] 删除成功:', project.name)
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.projects = this.projects.filter(p => p.projectId !== project.projectId)
            } catch (err) {
              console.error('[删除合集] 删除失败:', err)
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    onRenameProject(project) {
      uni.showModal({
        title: '修改合集名称',
        editable: true,
        placeholderText: '请输入新名称',
        content: project.name,
        confirmColor: '#2a6e44',
        success: async (res) => {
          if (res.confirm && res.content) {
            const newName = res.content.trim()
            if (!newName) {
              uni.showToast({ title: '名称不能为空', icon: 'none' })
              return
            }
            if (newName === project.name) return
            try {
              await renameProject(project.projectId, newName)
              console.log('[改名合集] 改名成功:', newName)
              uni.showToast({ title: '改名成功', icon: 'success' })
              project.name = newName
            } catch (err) {
              console.error('[改名合集] 改名失败:', err)
              uni.showToast({ title: '改名失败', icon: 'none' })
            }
          }
        }
      })
    },
    onViewPoems(project) {
      uni.navigateTo({
        url: `/pages/project-detail/index?projectId=${project.projectId}&name=${encodeURIComponent(project.name)}`
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
$gray: #888;

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
    font-weight: 600;
    color: $dark;
  }
}

.scroll-body {
  flex: 1;
  overflow: hidden;
  padding: 0 32rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-icon-wrap {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background: rgba(42, 110, 68, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;
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

/* 合集卡片 */
.project-card {
  background: #fff;
  border-radius: 28rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);

  &.is-selected {
    border-left: 6rpx solid $green;
  }

  .card-main {
    display: flex;
    align-items: center;
    padding: 32rpx 28rpx;
  }

  .project-index {
    width: 64rpx;
    height: 64rpx;
    border-radius: 20rpx;
    background: #f0ede6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    flex-shrink: 0;

    .index-text {
      font-size: 28rpx;
      font-weight: 700;
      color: $gray;
    }

    &.index-active {
      background: $green;

      .index-text {
        color: #fff;
      }
    }
  }

  .project-info {
    flex: 1;
    overflow: hidden;

    .project-name-row {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 10rpx;
    }

    .project-name {
      font-size: 34rpx;
      font-weight: 600;
      color: $dark;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selected-tag {
      background: rgba(42, 110, 68, 0.1);
      border-radius: 8rpx;
      padding: 4rpx 14rpx;
      flex-shrink: 0;

      .selected-tag-text {
        font-size: 20rpx;
        color: $green;
        font-weight: 500;
      }
    }

    .project-meta-row {
      display: flex;
      align-items: center;
      gap: 6rpx;
    }

    .project-meta {
      font-size: 24rpx;
      color: $gray;
    }

    .meta-dot {
      font-size: 22rpx;
      color: #ccc;
      margin: 0 4rpx;
    }
  }

  .arrow-wrap {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12rpx;
    flex-shrink: 0;
  }

  /* 操作按钮区 */
  .card-actions {
    display: flex;
    align-items: center;
    border-top: 1rpx solid #f5f2ec;
    background: #fdfbf7;
    padding: 0 8rpx;
  }

  .action-divider {
    width: 1rpx;
    height: 36rpx;
    background: #eee;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 22rpx 0;

    .action-btn-text {
      font-size: 26rpx;
      font-weight: 500;
    }

    &.select-btn .action-btn-text {
      color: $green;

      &.is-current {
        color: $gray;
      }
    }

    .rename-text {
      color: #e6a23c;
    }

    .delete-text {
      color: $red;
    }
  }
}
</style>
