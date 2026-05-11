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
        <uni-icons type="bookmark" size="80" color="#ccc" />
        <text class="empty-text">暂无学习合集</text>
        <text class="empty-hint">在文库页选择诗词后可创建</text>
      </view>

      <!-- 合集卡片 -->
      <view
        v-for="project in projects"
        :key="project.projectId"
        class="project-card"
        :class="{ 'is-selected': project.isSelected }"
      >
        <!-- 卡片主体：查看合集中的诗词 -->
        <view class="card-main" @click="onViewPoems(project)">
          <view class="project-icon">
            <uni-icons type="star" size="32" :color="project.isSelected ? '#fff' : '#2a6e44'" />
          </view>
          <view class="project-info">
            <view class="project-name-row">
              <text class="project-name">{{ project.name }}</text>
              <view v-if="project.isSelected" class="selected-tag">
                <text class="selected-tag-text">已选中</text>
              </view>
            </view>
            <text class="project-meta">{{ project.poemCount }} 首诗词 · {{ formatDate(project.createdAt) }}</text>
          </view>
          <uni-icons type="right" size="16" color="#ccc" class="arrow-icon" />
        </view>
        <!-- 操作按钮区 -->
        <view class="card-actions">
          <view
            class="action-btn select-btn"
            :class="{ 'is-current': project.isSelected }"
            @click="onSelectAsCurrent(project)"
          >
            <text class="action-btn-text">{{ project.isSelected ? '已选中' : '选中' }}</text>
          </view>
          <view class="action-btn rename-btn" @click="onRenameProject(project)">
            <text class="action-btn-text">改名</text>
          </view>
          <view class="action-btn delete-btn" @click="onDeleteProject(project)">
            <text class="action-btn-text">删除</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx;" />
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
      // 如果已经是当前选中的，不做处理
      if (project.isSelected) {
        return
      }
      try {
        await selectCurrentProject(project.projectId)
        console.log('[选择合集] 选中成功:', project.name)
        
        // 刷新列表，更新选中状态
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
              // 从列表中移除
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
      // 使用微信小程序内置的编辑对话框
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
            if (newName === project.name) {
              return
            }
            try {
              await renameProject(project.projectId, newName)
              console.log('[改名合集] 改名成功:', newName)
              uni.showToast({ title: '改名成功', icon: 'success' })
              // 更新本地数据
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
      // 点击卡片主体 = 跳转到诗词列表页
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

.project-card {
  background: #fff;
  margin: 0 40rpx 24rpx;
  border-radius: 32rpx;
  overflow: hidden;

  &.is-selected {
    background: linear-gradient(135deg, #e6f2e9 0%, #fff 100%);
  }

  .card-main {
    display: flex;
    align-items: center;
    padding: 32rpx 36rpx;
    overflow: hidden;
  }

  .project-icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #e6f2e9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    flex-shrink: 0;

    .is-selected & {
      background: $green;
    }
  }

  .project-info {
    flex: 1;
    overflow: hidden;

    .project-name-row {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 8rpx;
    }

    .project-name {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: $dark;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .selected-tag {
      background: $green;
      border-radius: 8rpx;
      padding: 4rpx 12rpx;
      flex-shrink: 0;

      .selected-tag-text {
        font-size: 22rpx;
        color: #fff;
      }
    }

    .project-meta {
      display: block;
      font-size: 26rpx;
      color: $gray;
    }
  }

  .arrow-icon {
    margin-left: 16rpx;
    flex-shrink: 0;
  }

  /* 操作按钮区 */
  .card-actions {
    display: flex;
    border-top: 1rpx solid #f0f0f0;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24rpx 0;
    background: #fafafa;

    .action-btn-text {
      font-size: 28rpx;
    }

    &.select-btn {
      border-right: 1rpx solid #f0f0f0;

      .action-btn-text {
        color: $green;
      }

      &.is-current .action-btn-text {
        color: $gray;
      }
    }

    &.rename-btn {
      border-right: 1rpx solid #f0f0f0;

      .action-btn-text {
        color: #e6a23c;
      }
    }

    &.delete-btn {
      .action-btn-text {
        color: $red;
      }
    }
  }
}
</style>
