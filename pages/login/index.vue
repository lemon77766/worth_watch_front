<template>
  <view class="page">
    <!-- 背景水印 -->
    <text class="watermark">诗</text>

    <!-- Logo -->
    <view class="logo-wrap">
      <view class="logo-outer">
        <view class="logo-inner">
          <text class="logo-text">得值</text>
        </view>
      </view>
    </view>

    <!-- 英文副标题 -->
    <text class="en-sub">A E S T H E T I C &nbsp; P O E T R Y</text>

    <!-- 主标题 -->
    <text class="main-title">值 得 看 么</text>

    <!-- 副标题 -->
    <view class="sub-wrap">
      <text class="sub-text">观文字之极美 · 承先贤之</text>
      <text class="sub-text">雅志</text>
    </view>

    <!-- 登录按钮区域 -->
    <view class="bottom-area">
      <button
        class="login-btn"
        :class="{ agreed: agreed }"
        @click="handleLogin"
      >
        <text class="wechat-icon">💬</text>
        <text class="login-text">微信一键登录</text>
      </button>

      <!-- 协议勾选 -->
      <view class="agreement-row">
        <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
          <uni-icons v-if="agreed" type="checkmarkempty" size="14" color="#2a6e44" />
        </view>
        <view class="agreement-text-wrap">
          <text class="agree-text">我已阅读并同意 </text>
          <text class="agree-link">服务协议</text>
          <text class="agree-text"> 与 </text>
          <text class="agree-link">隐私政策</text>
          <text class="agree-text">。未注册手机号登录后将自动注册。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreed: false
    }
  },
  methods: {
    handleLogin() {
      if (!this.agreed) {
        uni.showToast({ title: '请先同意服务协议与隐私政策', icon: 'none' })
        return
      }
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$bg: #f8f5ee;
$gray: #888888;
$btn-bg: #e5e7eb;
$blue: #3b82f6;

.page {
  min-height: 100vh;
  background-color: $bg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  position: relative;
  overflow: hidden;
}

/* 水印 */
.watermark {
  position: absolute;
  font-size: 600rpx;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.06);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  pointer-events: none;
  z-index: 0;
  line-height: 1;
}

/* Logo */
.logo-wrap {
  z-index: 1;
  margin-bottom: 48rpx;
}

.logo-outer {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, #e8e4da, #f8f5ee);
  box-shadow: 8rpx 8rpx 20rpx rgba(0,0,0,0.12), -4rpx -4rpx 12rpx rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner {
  width: 148rpx;
  height: 148rpx;
  border-radius: 50%;
  background: $green;
  border: 4rpx solid rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: #fff;
  font-size: 44rpx;
  font-weight: bold;
  letter-spacing: 6rpx;
}

/* 英文副标题 */
.en-sub {
  z-index: 1;
  font-size: 22rpx;
  color: $gray;
  letter-spacing: 4rpx;
  margin-bottom: 20rpx;
}

/* 主标题 */
.main-title {
  z-index: 1;
  font-size: 72rpx;
  font-weight: bold;
  color: $green;
  letter-spacing: 10rpx;
  margin-bottom: 24rpx;
}

/* 副标题 */
.sub-wrap {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;

  .sub-text {
    font-size: 28rpx;
    color: $gray;
    line-height: 50rpx;
    text-align: center;
  }
}

/* 底部区域 */
.bottom-area {
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

/* 登录按钮 */
.login-btn {
  width: 80%;
  height: 96rpx;
  background: $btn-bg;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  border: none;
  box-shadow: none;
  transition: background 0.2s;

  &.agreed {
    background: $green;

    .login-text {
      color: #fff;
    }

    .wechat-icon {
      filter: brightness(10);
    }
  }

  &.disabled {
    opacity: 1;
  }

  .wechat-icon {
    font-size: 36rpx;
  }

  .login-text {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
  }
}

/* 协议行 */
.agreement-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  width: 80%;

  .checkbox {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #ccc;
    background: #fff;
    flex-shrink: 0;
    margin-top: 4rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.checked {
      border-color: $green;
    }
  }

  .agreement-text-wrap {
    flex: 1;
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .agree-text {
      font-size: 22rpx;
      color: $gray;
      line-height: 38rpx;
    }

    .agree-link {
      font-size: 22rpx;
      color: $blue;
      line-height: 38rpx;
    }
  }
}
</style>
