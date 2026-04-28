<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">系统设置</text>
      <view style="width:72rpx;" />
    </view>

    <scroll-view scroll-y class="scroll-body">

      <!-- 用户信息卡片 -->
      <view class="user-card">
        <!-- 头像：微信官方 chooseAvatar -->
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="user-avatar" :src="userInfo.avatarUrl || '/static/logo.png'" mode="aspectFill" />
          <view class="avatar-edit-badge">
            <uni-icons type="camera" size="14" color="#fff" />
          </view>
        </button>
        <!-- 昵称：微信官方 nickname input -->
        <view class="nickname-wrap">
          <input
            class="nickname-input"
            type="nickname"
            :value="userInfo.nickname"
            placeholder="点击修改昵称"
            placeholder-class="nickname-placeholder"
            @blur="onNicknameBlur"
            @change="onNicknameChange"
          />
          <uni-icons type="compose" size="16" color="#2a6e44" />
        </view>
        <text v-if="saveStatus" class="save-status">{{ saveStatus }}</text>
      </view>
      <view class="group-title">账号</view>
      <view class="group-card">
        <view class="setting-item" v-for="item in accountItems" :key="item.label" @click="onTap(item)">
          <view class="item-left">
            <view class="item-icon-wrap" :style="{ background: item.iconBg }">
              <uni-icons :type="item.icon" size="20" :color="item.iconColor" />
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
          <view class="item-right">
            <text v-if="item.value" class="item-value">{{ item.value }}</text>
            <uni-icons type="right" size="16" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 阅读偏好 -->
      <view class="group-title">阅读偏好</view>
      <view class="group-card">
        <view class="setting-item" v-for="item in readItems" :key="item.label">
          <view class="item-left">
            <view class="item-icon-wrap" :style="{ background: item.iconBg }">
              <uni-icons :type="item.icon" size="20" :color="item.iconColor" />
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
          <view class="item-right">
            <text v-if="item.value" class="item-value">{{ item.value }}</text>
            <!-- 开关 -->
            <view v-if="item.toggle !== undefined" class="toggle" :class="{ 'toggle-on': item.toggle }" @click="item.toggle = !item.toggle">
              <view class="toggle-thumb" />
            </view>
            <uni-icons v-else type="right" size="16" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 通知设置 -->
      <view class="group-title">通知</view>
      <view class="group-card">
        <view class="setting-item" v-for="item in notifyItems" :key="item.label">
          <view class="item-left">
            <view class="item-icon-wrap" :style="{ background: item.iconBg }">
              <uni-icons :type="item.icon" size="20" :color="item.iconColor" />
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
          <view class="item-right">
            <view class="toggle" :class="{ 'toggle-on': item.toggle }" @click="item.toggle = !item.toggle">
              <view class="toggle-thumb" />
            </view>
          </view>
        </view>
      </view>

      <!-- 其他 -->
      <view class="group-title">其他</view>
      <view class="group-card">
        <view class="setting-item" v-for="item in otherItems" :key="item.label" @click="onTap(item)">
          <view class="item-left">
            <view class="item-icon-wrap" :style="{ background: item.iconBg }">
              <uni-icons :type="item.icon" size="20" :color="item.iconColor" />
            </view>
            <text class="item-label">{{ item.label }}</text>
          </view>
          <view class="item-right">
            <text v-if="item.value" class="item-value">{{ item.value }}</text>
            <uni-icons type="right" size="16" color="#ccc" />
          </view>
        </view>
      </view>

      <view style="height:60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/utils/request.js'

export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        avatarUrl: ''
      },
      saveStatus: '',
      accountItems: [
        { label: '个人信息', icon: 'person', iconBg: '#e6f2e9', iconColor: '#2a6e44', value: '苏东坡的小迷弟' },
        { label: '修改昵称', icon: 'compose', iconBg: '#e6f2e9', iconColor: '#2a6e44', value: '' }
      ],
      readItems: [
        { label: '字体大小', icon: 'font', iconBg: '#e6f2e9', iconColor: '#2a6e44', value: '标准' },
        { label: '夜间模式', icon: 'eye', iconBg: '#2a2a2a', iconColor: '#fff', toggle: false },
        { label: '自动播放吟诵', icon: 'sound', iconBg: '#fef3e6', iconColor: '#e07820', toggle: true },
        { label: '显示拼音', icon: 'info', iconBg: '#e6f2e9', iconColor: '#2a6e44', toggle: false }
      ],
      notifyItems: [
        { label: '每日打卡提醒', icon: 'calendar', iconBg: '#fef3e6', iconColor: '#e07820', toggle: true },
        { label: '研习计划提醒', icon: 'notification', iconBg: '#e6f2e9', iconColor: '#2a6e44', toggle: true },
        { label: '新内容推送', icon: 'paperplane', iconBg: '#e6f2e9', iconColor: '#2a6e44', toggle: false }
      ],
      otherItems: [
        { label: '清除缓存', icon: 'trash', iconBg: '#f0f0f0', iconColor: '#888', value: '12.3MB' },
        { label: '关于我们', icon: 'info', iconBg: '#f0f0f0', iconColor: '#888', value: 'v1.0.0' },
        { label: '隐私协议', icon: 'locked', iconBg: '#f0f0f0', iconColor: '#888', value: '' }
      ]
    }
  },
  onLoad() {
    // 加载已保存的用户信息
    const saved = uni.getStorageSync('userInfo')
    if (saved) {
      this.userInfo = saved
    }
    // 从后端获取最新信息
    getUserProfile().then(data => {
      this.userInfo = { nickname: data.nickname, avatarUrl: data.avatarUrl }
      uni.setStorageSync('userInfo', this.userInfo)
    }).catch(() => {})
  },
  methods: {
    // 微信选择头像回调
    onChooseAvatar(e) {
      const avatarUrl = e.detail.avatarUrl
      console.log('[用户信息] 选择头像:', avatarUrl)
      this.userInfo.avatarUrl = avatarUrl
      this.saveToServer()
    },
    // 昵称输入
    onNicknameChange(e) {
      this.userInfo.nickname = e.detail.value
    },
    onNicknameBlur() {
      if (this.userInfo.nickname) {
        this.saveToServer()
      }
    },
    // 提交到后端
    saveToServer() {
      this.saveStatus = '保存中...'
      updateUserProfile({
        nickname: this.userInfo.nickname,
        avatarUrl: this.userInfo.avatarUrl
      }).then(data => {
        this.saveStatus = '已保存 ✓'
        uni.setStorageSync('userInfo', {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl
        })
        console.log('[用户信息] 保存成功:', data)
        setTimeout(() => { this.saveStatus = '' }, 2000)
      }).catch(err => {
        this.saveStatus = '保存失败'
        console.error('[用户信息] 保存失败:', err)
        setTimeout(() => { this.saveStatus = '' }, 2000)
      })
    },
    onTap(item) {
      if (item.label === '清除缓存') {
        uni.showModal({
          title: '清除缓存',
          content: '确定清除 12.3MB 缓存？',
          success: (res) => {
            if (res.confirm) {
              item.value = '0KB'
              uni.showToast({ title: '清除成功', icon: 'success' })
            }
          }
        })
        return
      }
      if (item.label === '隐私协议') {
        uni.navigateTo({ url: '/pages/privacy/index' })
        return
      }
      uni.showToast({ title: item.label, icon: 'none' })
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$bg:    #f8f5ee;
$dark:  #1a1a1a;
$gray:  #888;
$font:  'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif;

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
    width: 72rpx; height: 72rpx;
    border-radius: 50%;
    background: rgba(42,110,68,0.08);
    display: flex; align-items: center; justify-content: center;
  }

  .nav-title { font-size: 36rpx; font-weight: 500; color: $dark; }
}

.scroll-body { flex: 1; overflow: hidden; }

/* 用户信息卡片 */
.user-card {
  margin: 24rpx 40rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;

  .avatar-btn {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    padding: 0;
    background: transparent;
    border: none;
    line-height: 1;

    &::after { border: none; }

    .user-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 3rpx solid #e0d8c8;
    }

    .avatar-edit-badge {
      position: absolute;
      bottom: 0; right: 0;
      width: 44rpx; height: 44rpx;
      border-radius: 50%;
      background: #2a6e44;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .nickname-wrap {
    display: flex;
    align-items: center;
    gap: 12rpx;
    border-bottom: 2rpx solid #f0ede6;
    padding-bottom: 12rpx;
    width: 100%;
    justify-content: center;

    .nickname-input {
      font-size: 34rpx;
      font-weight: 600;
      color: #1a1a1a;
      text-align: center;
      min-width: 200rpx;
    }

    .nickname-placeholder {
      color: #ccc;
      font-size: 30rpx;
    }
  }

  .save-status {
    font-size: 24rpx;
    color: #2a6e44;
  }
}

.group-title {
  font-size: 24rpx;
  color: $gray;
  padding: 28rpx 40rpx 12rpx;
  letter-spacing: 2rpx;
}

.group-card {
  margin: 0 40rpx;
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 32rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child { border-bottom: none; }

    .item-left {
      display: flex;
      align-items: center;
      gap: 24rpx;

      .item-icon-wrap {
        width: 72rpx; height: 72rpx;
        border-radius: 18rpx;
        display: flex; align-items: center; justify-content: center;
      }

      .item-label { font-size: 30rpx; color: $dark; }
    }

    .item-right {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .item-value { font-size: 26rpx; color: $gray; }
    }
  }
}

/* 开关 */
.toggle {
  width: 96rpx;
  height: 52rpx;
  border-radius: 26rpx;
  background: #ddd;
  position: relative;
  transition: background 0.25s;

  .toggle-thumb {
    position: absolute;
    top: 6rpx; left: 6rpx;
    width: 40rpx; height: 40rpx;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
    transition: left 0.25s;
  }
}

.toggle-on {
  background: $green;

  .toggle-thumb { left: 50rpx; }
}
</style>
