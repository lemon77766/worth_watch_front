<template>
  <view class="page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">每日打卡</text>
      <view class="nav-btn">
        <uni-icons type="redo" size="20" color="#2a6e44" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- 连续打卡卡片 -->
      <view class="streak-card">
        <view class="flame-wrap">
          <view class="flame-bg">
            <text class="flame-icon">🔥</text>
          </view>
        </view>
        <text class="streak-label">已连续研习</text>
        <view class="streak-num-row">
          <text class="streak-num">{{ streak }}</text>
          <text class="streak-unit">天</text>
        </view>
      </view>

      <!-- 日历模块 -->
      <view class="section">
        <view class="cal-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" />
            <text class="cal-title">{{ year }}年{{ month }}月</text>
          </view>
          <view class="cal-nav">
            <view class="cal-nav-btn" @click="prevMonth">
              <uni-icons type="left" size="16" color="#2a6e44" />
            </view>
            <view class="cal-nav-btn" @click="nextMonth">
              <uni-icons type="right" size="16" color="#2a6e44" />
            </view>
          </view>
        </view>

        <view class="cal-card">
          <!-- 星期头 -->
          <view class="cal-week-row">
            <text class="cal-week" v-for="w in weeks" :key="w">{{ w }}</text>
          </view>
          <!-- 日期格子 -->
          <view class="cal-grid">
            <view
              v-for="(d, i) in calDays" :key="i"
              class="cal-cell"
            >
              <view
                v-if="d"
                class="cal-day"
                :class="{
                  'day-checked': checkedDays.includes(d),
                  'day-today': d === today && month === todayMonth && year === todayYear,
                  'day-empty': !checkedDays.includes(d) && !(d === today && month === todayMonth && year === todayYear)
                }"
              >
                <text class="cal-day-text" :class="{
                  'text-checked': checkedDays.includes(d),
                  'text-today': d === today && month === todayMonth && year === todayYear
                }">{{ d }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 图例 -->
        <view class="legend-row">
          <view class="legend-item">
            <view class="legend-dot dot-checked" />
            <text class="legend-text">已打卡</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot dot-today" />
            <text class="legend-text">今日</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot dot-empty" />
            <text class="legend-text">未打卡</text>
          </view>
        </view>
      </view>

      <!-- 打卡奖励 -->
      <view class="section">
        <view class="mod-hd">
          <view class="mod-bar" />
          <text class="mod-title">打卡奖励</text>
        </view>
        <view class="reward-row">
          <view class="reward-card" v-for="r in rewards" :key="r.days"
            :class="{ 'reward-active': streak >= r.days && streak < (rewards[rewards.indexOf(r)+1] ? rewards[rewards.indexOf(r)+1].days : 9999) }">
            <text class="reward-icon">🎖</text>
            <text class="reward-days">{{ r.days }}天</text>
            <text class="reward-desc">{{ r.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 打卡按钮 -->
      <view class="section">
        <view class="checkin-btn" :class="{ 'checked-btn': todayChecked }" @click="doCheckin">
          <text class="checkin-btn-text">{{ todayChecked ? '今日已打卡 ✓' : '立即打卡签到' }}</text>
        </view>
      </view>

      <view style="height:60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    const now = new Date()
    return {
      streak: 12,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      todayYear: now.getFullYear(),
      todayMonth: now.getMonth() + 1,
      today: now.getDate(),
      // 模拟已打卡日期（1~11号）
      checkedDays: [1,2,3,4,5,6,7,8,9,10,11],
      weeks: ['日','一','二','三','四','五','六'],
      rewards: [
        { days: 7,  desc: '50积分' },
        { days: 15, desc: '100积分' },
        { days: 30, desc: '勋章' }
      ]
    }
  },
  computed: {
    todayChecked() {
      return this.month === this.todayMonth &&
             this.year === this.todayYear &&
             this.checkedDays.includes(this.today)
    },
    calDays() {
      const firstDay = new Date(this.year, this.month - 1, 1).getDay()
      const daysInMonth = new Date(this.year, this.month, 0).getDate()
      const cells = []
      for (let i = 0; i < firstDay; i++) cells.push(null)
      for (let d = 1; d <= daysInMonth; d++) cells.push(d)
      while (cells.length % 7 !== 0) cells.push(null)
      return cells
    }
  },
  methods: {
    prevMonth() {
      if (this.month === 1) { this.month = 12; this.year-- }
      else this.month--
    },
    nextMonth() {
      if (this.month === 12) { this.month = 1; this.year++ }
      else this.month++
    },
    doCheckin() {
      if (this.todayChecked) return
      this.checkedDays.push(this.today)
      this.streak++
      uni.showToast({ title: '打卡成功！', icon: 'success' })
    }
  }
}
</script>

<style lang="scss">
$green:     #2a6e44;
$red:       #b82e2e;
$bg:        #f8f5ee;
$dark:      #1a1a1a;
$gray:      #999;
$font:      'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', serif;

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
  padding: 52rpx 36rpx 20rpx;
  background: $bg;

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

.scroll-body { flex: 1; overflow: hidden; }

/* 连续打卡卡片 */
.streak-card {
  margin: 24rpx 40rpx 0;
  background: #eeecea;
  border-radius: 40rpx;
  padding: 56rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .flame-wrap {
    margin-bottom: 32rpx;

    .flame-bg {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: rgba(255,160,60,0.15);
      display: flex;
      align-items: center;
      justify-content: center;

      .flame-icon { font-size: 56rpx; }
    }
  }

  .streak-label {
    font-size: 30rpx;
    color: $gray;
    margin-bottom: 12rpx;
  }

  .streak-num-row {
    display: flex;
    align-items: flex-end;
    gap: 8rpx;

    .streak-num {
      font-size: 120rpx;
      font-weight: 700;
      color: $green;
      line-height: 1;
      font-family: $font-bold;
    }

    .streak-unit {
      font-size: 36rpx;
      color: $green;
      padding-bottom: 16rpx;
      font-weight: 500;
    }
  }
}

/* 通用 section */
.section {
  padding: 40rpx 40rpx 0;
}

.mod-hd {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 28rpx;
}

.mod-bar {
  width: 8rpx;
  height: 44rpx;
  background: $red;
  border-radius: 4rpx;
}

.mod-title {
  font-size: 44rpx;
  font-weight: 600;
  color: $dark;
  font-family: $font-bold;
}

/* 日历标题行 */
.cal-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;

  .mod-title-wrap {
    display: flex;
    align-items: center;
    gap: 14rpx;

    .mod-bar { background: $green; }
  }

  .cal-title {
    font-size: 44rpx;
    font-weight: 600;
    color: $dark;
    font-family: $font-bold;
  }

  .cal-nav {
    display: flex;
    gap: 16rpx;

    .cal-nav-btn {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
      background: rgba(42,110,68,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

/* 日历卡片 */
.cal-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 32rpx 24rpx;

  .cal-week-row {
    display: flex;
    margin-bottom: 16rpx;

    .cal-week {
      flex: 1;
      text-align: center;
      font-size: 26rpx;
      color: $gray;
    }
  }

  .cal-grid {
    display: flex;
    flex-wrap: wrap;

    .cal-cell {
      width: calc(100% / 7);
      display: flex;
      justify-content: center;
      padding: 8rpx 0;

      .cal-day {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .cal-day-text {
          font-size: 28rpx;
          color: $gray;
        }
      }

      .day-checked {
        background: $green;
        .text-checked { color: #fff; font-weight: 600; }
      }

      .day-today {
        border: 3rpx solid $green;
        background: transparent;
        .text-today { color: $green; font-weight: 600; }
      }
    }
  }
}

/* 图例 */
.legend-row {
  display: flex;
  justify-content: center;
  gap: 48rpx;
  margin-top: 32rpx;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .legend-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
    }

    .dot-checked { background: $green; }
    .dot-today   { border: 2rpx solid $green; background: transparent; }
    .dot-empty   { background: #ccc; }

    .legend-text {
      font-size: 26rpx;
      color: $gray;
    }
  }
}

/* 打卡奖励 */
.reward-row {
  display: flex;
  gap: 20rpx;

  .reward-card {
    flex: 1;
    background: #f0ede6;
    border-radius: 28rpx;
    padding: 32rpx 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;

    .reward-icon { font-size: 48rpx; }

    .reward-days {
      font-size: 30rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }

    .reward-desc {
      font-size: 24rpx;
      color: $gray;
    }
  }

  .reward-active {
    background: #f5e8e8;
    border: 2rpx solid rgba(184,46,46,0.2);
  }
}

/* 打卡按钮 */
.checkin-btn {
  background: $green;
  border-radius: 50rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 24rpx rgba(42,110,68,0.3);

  .checkin-btn-text {
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
    letter-spacing: 4rpx;
    font-family: $font-bold;
  }
}

.checked-btn {
  background: #8aad8a;
  box-shadow: none;
}
</style>
