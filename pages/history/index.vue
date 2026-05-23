<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">研习历史</text>
      <view style="width:72rpx;" />
    </view>

    <!-- 总览卡片 -->
    <view class="overview-card">
      <view class="ov-item" v-for="o in overview" :key="o.label">
        <text class="ov-num">{{ o.num }}</text>
        <text class="ov-unit">{{ o.unit }}</text>
        <text class="ov-label">{{ o.label }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body" @scrolltolower="loadMore">
      <!-- 时间线 -->
      <view class="timeline">
        <view class="day-group" v-for="group in history" :key="group.date">
          <!-- 日期标题 -->
          <view class="day-hd">
            <view class="day-dot" />
            <text class="day-date">{{ group.date }}</text>
            <text class="day-count">共研习 {{ group.items.length }} 首</text>
          </view>
          <!-- 该日记录 -->
          <view class="day-items">
            <view class="history-item" v-for="item in group.items" :key="item.poemId" @click="goDetail(item)">
              <view class="item-info">
                <view class="item-title-row">
                  <text class="item-title">{{ item.title }}</text>
                </view>
                <text class="item-sub">{{ item.author }} · {{ item.dynasty }}</text>
              </view>

            </view>
          </view>
        </view>
        <view v-if="history.length === 0 && !loading" class="empty-tip">
          <text class="empty-text">暂无研习记录</text>
        </view>
      </view>
      <view style="height:40rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getStudyHistory, getStudyProgress } from '@/utils/request.js'

export default {
  data() {
    return {
      overview: [
        { num: 0, unit: '天', label: '累计研习' },
        { num: 0, unit: '首', label: '已学诗词' }
      ],
      history: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false
    }
  },
  onLoad() {
    if (!uni.getStorageSync('token')) {
      uni.showModal({
        title: '提示',
        content: '请先登录后查看研习历史',
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
    this.fetchHistory()
    this.fetchProgress()
  },
  methods: {
    async fetchProgress() {
      try {
        const data = await getStudyProgress()
        if (data) {
          this.overview[0].num = data.studyDays || 0
          this.overview[1].num = data.learnedCount || 0
        }
      } catch (e) {
        console.error('获取研习进度失败', e)
      }
    },
    async fetchHistory() {
      if (this.loading) return
      this.loading = true
      try {
        const data = await getStudyHistory({ page: this.page, pageSize: this.pageSize })
        if (data) {
          this.total = data.total || 0
          // 按日期分组
          const list = data.list || []
          const grouped = {}
          const now = new Date()
          const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
          const yesterday = new Date(now)
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
          list.forEach(item => {
            const rawDate = item.studiedAt ? item.studiedAt.split(/[T ]/)[0] : '未知日期'
            let displayDate = rawDate
            if (rawDate === todayStr) {
              const m = parseInt(rawDate.split('-')[1])
              const d = parseInt(rawDate.split('-')[2])
              displayDate = `今天 · ${m}月${d}日`
            } else if (rawDate === yesterdayStr) {
              const m = parseInt(rawDate.split('-')[1])
              const d = parseInt(rawDate.split('-')[2])
              displayDate = `昨天 · ${m}月${d}日`
            } else {
              const m = parseInt(rawDate.split('-')[1])
              const d = parseInt(rawDate.split('-')[2])
              displayDate = `${m}月${d}日`
            }
            if (!grouped[rawDate]) {
              grouped[rawDate] = { date: displayDate, items: [] }
            }
            grouped[rawDate].items.push({
              poemId: item.poemId,
              title: item.title,
              author: item.author,
              dynasty: item.dynasty,
              excerpt: item.excerpt,
              score: item.score,
              studiedAt: item.studiedAt,
              iconBg: '#e6f2e9',
              iconColor: '#2a6e44',
              tagBg: '#2a6e44',
              tagColor: '#fff',
              mode: '已学完'
            })
          })
          if (this.page === 1) {
            this.history = Object.values(grouped)
          } else {
            this.history = [...this.history, ...Object.values(grouped)]
          }
        }
      } catch (e) {
        console.error('获取研习历史失败', e)
      } finally {
        this.loading = false
      }
    },
    loadMore() {
      if (this.history.length < this.total) {
        this.page++
        this.fetchHistory()
      }
    },
    goDetail(item) {
      if (item.poemId) {
        uni.navigateTo({ url: `/pages/detail/index?id=${item.poemId}` })
      }
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

/* 总览卡片 */
.overview-card {
  margin: 0 40rpx 8rpx;
  background: $green;
  border-radius: 32rpx;
  padding: 40rpx;
  display: flex;
  justify-content: space-around;

  .ov-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rpx;

    .ov-num {
      font-size: 56rpx;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      font-family: $font-bold;
    }

    .ov-unit {
      font-size: 24rpx;
      color: rgba(255,255,255,0.7);
    }

    .ov-label {
      font-size: 24rpx;
      color: rgba(255,255,255,0.6);
      margin-top: 4rpx;
    }
  }
}

.scroll-body { flex: 1; overflow: hidden; }

/* 时间线 */
.timeline {
  padding: 32rpx 40rpx 0;
}

.day-group {
  margin-bottom: 40rpx;

  .day-hd {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;

    .day-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: $green;
      flex-shrink: 0;
    }

    .day-date {
      font-size: 28rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }

    .day-count {
      font-size: 24rpx;
      color: $gray;
      margin-left: auto;
    }
  }

  .day-items {
    margin-left: 8rpx;
    border-left: 3rpx solid #e0dbd0;
    padding-left: 32rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
}

.history-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;

  .item-icon-wrap {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;

    .item-title-row {
      display: flex;
      align-items: center;
      gap: 16rpx;
      margin-bottom: 8rpx;

      .item-title {
        font-size: 32rpx;
        font-weight: 600;
        color: $dark;
        font-family: $font-bold;
      }

      .item-tag {
        border-radius: 8rpx;
        padding: 4rpx 14rpx;

        .item-tag-text { font-size: 22rpx; }
      }
    }

    .item-sub {
      font-size: 24rpx;
      color: $gray;
    }
  }

  .item-duration {
    .duration-text {
      font-size: 24rpx;
      color: $gray;
      white-space: nowrap;
    }
  }
}

.empty-tip {
  padding: 80rpx 0;
  text-align: center;
  .empty-text {
    font-size: 28rpx;
    color: $gray;
  }
}
</style>
