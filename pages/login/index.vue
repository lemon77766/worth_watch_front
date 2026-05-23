<template>
  <view class="page">
    <!-- 返回按钮 -->
    <view class="back-btn" @click="goBack">
      <uni-icons type="left" size="22" color="#2a6e44" />
    </view>

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
        :disabled="loading"
        @click="handleLogin"
      >
        <text class="wechat-icon">💬</text>
        <text class="login-text">{{ loading ? '登录中...' : '微信一键登录' }}</text>
      </button>

      <!-- 协议勾选 -->
      <view class="agreement-row">
        <view class="checkbox" :class="{ checked: agreed }" @click="agreed = !agreed">
          <uni-icons v-if="agreed" type="checkmarkempty" size="14" color="#2a6e44" />
        </view>
        <view class="agreement-text-wrap">
          <text class="agree-text">我已阅读并同意 </text>
          <text class="agree-link" @click.stop="goAgreement('service')">服务协议</text>
          <text class="agree-text"> 与 </text>
          <text class="agree-link" @click.stop="goAgreement('privacy')">隐私政策</text>
          <text class="agree-text">。未注册手机号登录后将自动注册。</text>
        </view>
      </view>
    </view>

    <!-- 完善信息弹窗 -->
    <view v-if="showProfileModal" class="modal-mask" @click="showProfileModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">完善个人信息</text>
        <text class="modal-subtitle">让我们更好地认识你</text>

        <button class="modal-avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="modal-avatar" :src="tempAvatar || '/static/logo.png'" mode="aspectFill" />
          <view class="modal-avatar-badge">
            <uni-icons type="camera" size="16" color="#fff" />
          </view>
        </button>

        <view class="modal-input-wrap">
          <text class="modal-label">昵称</text>
          <input
            class="modal-input"
            type="nickname"
            :value="tempNickname"
            placeholder="请输入昵称"
            @input="onNickNameInput"
          />
        </view>

        <view class="modal-btns">
          <view class="modal-btn modal-btn-cancel" @click="skipProfile">跳过</view>
          <view class="modal-btn modal-btn-confirm" :class="{ disabled: submitting }" @click="submitProfile">{{ submitting ? '提交中...' : '完成' }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { updateUserProfile, uploadAvatar, login as apiLogin, getUserProfile } from '@/utils/request.js'

export default {
  data() {
    return {
      agreed: false,
      loading: false,
      submitting: false,
      uploading: false,  // 头像正在上传中
      showProfileModal: false,
      tempAvatar: '',
      tempNickname: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.agreed) {
        uni.showToast({ title: '请先同意服务协议与隐私政策', icon: 'none' })
        return
      }
      console.log('[登录] 开始登录流程')
      this.loading = true
      
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          console.log('[登录] uni.login 成功，code:', loginRes.code)
          
          apiLogin(loginRes.code).then(data => {
            console.log('[登录] 登录成功，token:', data.token)
            uni.setStorageSync('token', data.token)
            uni.setStorageSync('isNewUser', data.isNewUser)
            this.loading = false
            uni.showToast({ title: '登录成功', icon: 'success' })
            setTimeout(() => this.goHome(), 500)
          }).catch(() => {
            console.warn('[登录] 后端返回异常，使用临时 token')
            this.loading = false
            uni.setStorageSync('token', 'local_dev_token')
            uni.showToast({ title: '使用临时登录', icon: 'none' })
            setTimeout(() => this.goHome(), 500)
          })
        },
        fail: (err) => {
          console.error('[登录] uni.login 失败:', err)
          this.loading = false
          uni.setStorageSync('token', 'local_dev_token')
          uni.showToast({ title: '非微信环境，使用临时登录', icon: 'none' })
          setTimeout(() => this.goHome(), 500)
        }
      })
    },
    goHome() {
      // 先从服务端获取用户资料，判断是否已完善过
      getUserProfile().then(data => {
        console.log('[登录] 服务端用户资料:', data)
        const nickname = data.nickname || data.nickName || ''
        const avatarUrl = data.avatarUrl || data.avatar || ''
        if (nickname) {
          // 服务端已有资料，缓存到本地并直接进入首页
          const info = { nickname, avatarUrl }
          uni.setStorageSync('userInfo', info)
          uni.removeStorageSync('isNewUser')
          // 登录成功后返回上一页（而非reLaunch，让用户回到原浏览位置）
          uni.navigateBack({
            fail: () => {
              uni.reLaunch({ url: '/pages/index/index' })
            }
          })
        } else {
          // 服务端无资料，弹出完善信息弹窗
          this.showProfileModal = true
        }
      }).catch(err => {
        console.warn('[登录] 获取用户资料失败:', err)
        // 获取失败时回退到本地判断逻辑
        const isNewUser = uni.getStorageSync('isNewUser')
        const userInfo = uni.getStorageSync('userInfo')
        if (isNewUser || !userInfo || !userInfo.nickname) {
          this.showProfileModal = true
        } else {
          uni.navigateBack({
            fail: () => {
              uni.reLaunch({ url: '/pages/index/index' })
            }
          })
        }
      })
    },
    onChooseAvatar(e) {
      if (this.submitting) return
      
      const avatarUrl = e.detail.avatarUrl
      console.log('[选择头像] 原始路径:', avatarUrl)
      
      this.tempAvatar = avatarUrl
      
      // 判断是否为本地临时文件（微信临时路径：wxfile:// 或 http://tmp/）
      const isLocalFile = avatarUrl && (
        avatarUrl.startsWith('wxfile://') || 
        avatarUrl.includes('/tmp/') || 
        avatarUrl.includes('\\tmp\\')
      )
      console.log('[选择头像] 是否本地临时文件:', isLocalFile)
      
      // 头像选择后立即上传到服务器
      if (isLocalFile) {
        console.log('[选择头像] 开始上传本地文件')
        this.uploading = true
        uni.showLoading({ title: '上传头像...' })
        
        uploadAvatar(avatarUrl).then(res => {
          console.log('[选择头像] 上传Promise成功，永久URL:', res)
          this.tempAvatar = res // 更新为永久URL
          this.uploading = false
          uni.hideLoading()
          uni.showToast({ title: '头像上传成功', icon: 'success' })
        }).catch(err => {
          console.error('[选择头像] 上传Promise失败:', err)
          this.uploading = false
          this.tempAvatar = '' // 上传失败清空
          uni.hideLoading()
          uni.showToast({ title: '头像上传失败', icon: 'none' })
        })
      } else {
        console.log('[选择头像] 已是网络URL或无效路径，跳过上传')
      }
    },
    onNickNameInput(e) {
      this.tempNickname = e.detail.value
    },
    async submitProfile() {
      if (this.submitting) return
      
      console.log('[提交资料] 当前tempAvatar:', this.tempAvatar)
      console.log('[提交资料] 当前tempNickname:', this.tempNickname)
      
      // 判断是否为本地临时文件
      const isLocalFile = this.tempAvatar && (
        this.tempAvatar.startsWith('wxfile://') || 
        this.tempAvatar.includes('/tmp/') || 
        this.tempAvatar.includes('\\tmp\\')
      )
      
      // 如果头像正在上传中，不允许提交
      if (this.uploading) {
        uni.showToast({ title: '头像上传中，请稍候', icon: 'none' })
        return
      }
      
      // 如果选择了头像但上传失败了，不允许提交
      if (isLocalFile) {
        uni.showToast({ title: '头像上传失败，请重新选择', icon: 'none' })
        return
      }
      
      this.submitting = true
      uni.showLoading({ title: '提交中...' })
      
      try {
        const requestData = {
          nickname: this.tempNickname || '',
          avatarUrl: this.tempAvatar || ''
        }
        console.log('[提交资料] 发送的数据:', JSON.stringify(requestData))
        
        // 更新用户资料（头像URL已经在 onChooseAvatar 中上传完成）
        const data = await updateUserProfile(requestData)
        console.log('[提交资料] 后端返回:', data)
        
        uni.setStorageSync('userInfo', {
          nickname: data.nickname || this.tempNickname,
          avatarUrl: data.avatarUrl || this.tempAvatar
        })
        
        uni.showToast({ title: '资料完善成功', icon: 'success' })
      } catch (err) {
        console.error('[提交资料失败]', err)
        uni.showToast({ title: '提交失败，请重试', icon: 'none' })
      } finally {
        uni.hideLoading()
        this.submitting = false
        uni.removeStorageSync('isNewUser')
        uni.navigateBack({
          fail: () => {
            uni.reLaunch({ url: '/pages/index/index' })
          }
        })
      }
    },
    skipProfile() {
      uni.removeStorageSync('isNewUser')
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({ url: '/pages/index/index' })
        }
      })
    },
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({ url: '/pages/index/index' })
        }
      })
    },
    goAgreement(type) {
      if (type === 'service') {
        uni.navigateTo({ url: '/pages/service-agreement/index' })
      } else {
        uni.navigateTo({ url: '/pages/privacy/index' })
      }
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

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: calc(80rpx + env(safe-area-inset-top));
  left: 36rpx;
  z-index: 10;
  width: 64rpx;
  height: 64rpx;
  background: rgba(42,110,68,0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
}/* 底部弹窗 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  width: 100%;
  background: #f8f5ee;
  border-radius: 40rpx 40rpx 0 0;
  padding: 48rpx 48rpx 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .modal-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 12rpx;
  }

  .modal-subtitle {
    font-size: 26rpx;
    color: #888;
    margin-bottom: 48rpx;
  }

  .modal-avatar-btn {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    padding: 0;
    background: transparent;
    border: none;
    margin-bottom: 48rpx;

    &::after { border: none; }

    .modal-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 3rpx solid #e0d8c8;
    }

    .modal-avatar-badge {
      position: absolute;
      bottom: 0; right: 0;
      width: 48rpx; height: 48rpx;
      border-radius: 50%;
      background: #2a6e44;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .modal-input-wrap {
    width: 100%;
    margin-bottom: 48rpx;

    .modal-label {
      display: block;
      font-size: 28rpx;
      color: #1a1a1a;
      margin-bottom: 16rpx;
    }

    .modal-input {
      width: 100%;
      height: 96rpx;
      background: #fff;
      border-radius: 24rpx;
      padding: 0 32rpx;
      font-size: 32rpx;
      color: #1a1a1a;
    }
  }

  .modal-btns {
    width: 100%;
    display: flex;
    gap: 24rpx;

    .modal-btn {
      flex: 1;
      height: 96rpx;
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: 500;
    }

    .modal-btn-cancel {
      background: #e5e7eb;
      color: #666;
    }

    .modal-btn-confirm {
      background: #2a6e44;
      color: #fff;
      
      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

</style>
