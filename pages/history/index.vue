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

    <scroll-view scroll-y class="scroll-body">
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
            <view class="history-item" v-for="item in group.items" :key="item.title" @click="goDetail(item)">
              <view class="item-icon-wrap" :style="{ background: item.iconBg }">
                <uni-icons type="bookmarks" size="20" :color="item.iconColor" />
              </view>
              <view class="item-info">
                <view class="item-title-row">
                  <text class="item-title">{{ item.title }}</text>
                  <view class="item-tag" :style="{ background: item.tagBg }">
                    <text class="item-tag-text" :style="{ color: item.tagColor }">{{ item.mode }}</text>
                  </view>
                </view>
                <text class="item-sub">{{ item.author }} · {{ item.type }}</text>
              </view>
              <view class="item-duration">
                <text class="duration-text">{{ item.duration }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height:40rpx;" />
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      overview: [
        { num: 128, unit: '天', label: '累计研习' },
        { num: 412, unit: '首', label: '已学诗词' },
        { num: 36,  unit: '小时', label: '研习时长' }
      ],
      history: [
        {
          date: '今天 · 4月23日',
          items: [
            { title: '春晓', author: '孟浩然', type: '五言绝句', mode: '背诵', duration: '8分钟', iconBg: '#e6f2e9', iconColor: '#2a6e44', tagBg: '#e6f2e9', tagColor: '#2a6e44', id: 'chunxiao' },
            { title: '望庐山瀑布', author: '李白', type: '七言绝句', mode: '赏析', duration: '12分钟', iconBg: '#fdecea', iconColor: '#b82e2e', tagBg: '#2a6e44', tagColor: '#fff', id: 'lushan' }
          ]
        },
        {
          date: '昨天 · 4月22日',
          items: [
            { title: '静夜思', author: '李白', type: '五言绝句', mode: '背诵', duration: '6分钟', iconBg: '#e6f2e9', iconColor: '#2a6e44', tagBg: '#e6f2e9', tagColor: '#2a6e44', id: 'chunxiao' },
            { title: '定风波', author: '苏轼', type: '词', mode: '吟诵', duration: '15分钟', iconBg: '#fef3e6', iconColor: '#e07820', tagBg: '#fef3e6', tagColor: '#e07820', id: 'chunxiao' },
            { title: '鹿柴', author: '王维', type: '五言绝句', mode: '赏析', duration: '10分钟', iconBg: '#fdecea', iconColor: '#b82e2e', tagBg: '#2a6e44', tagColor: '#fff', id: 'chunxiao' }
          ]
        },
        {
          date: '4月21日',
          items: [
            { title: '水调歌头', author: '苏轼', type: '词', mode: '背诵', duration: '20分钟', iconBg: '#e6f2e9', iconColor: '#2a6e44', tagBg: '#e6f2e9', tagColor: '#2a6e44', id: 'chunxiao' },
            { title: '春望', author: '杜甫', type: '五言律诗', mode: '背诵', duration: '9分钟', iconBg: '#e6f2e9', iconColor: '#2a6e44', tagBg: '#e6f2e9', tagColor: '#2a6e44', id: 'chunxiao' }
          ]
        }
      ]
    }
  },
  methods: {
    goDetail(item) {
      uni.navigateTo({ url: `/pages/detail/index?id=${item.id}` })
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
</style>
