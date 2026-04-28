<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">隐私协议</text>
      <view style="width:72rpx;" />
    </view>

    <scroll-view scroll-y class="scroll-body">
      <view class="content">
        <text class="update-date">更新日期：2026年4月23日</text>

        <view class="section" v-for="s in sections" :key="s.title">
          <view class="sec-hd">
            <view class="sec-bar" />
            <text class="sec-title">{{ s.title }}</text>
          </view>
          <text class="sec-body">{{ s.body }}</text>
        </view>

        <view class="contact-card">
          <text class="contact-title">联系我们</text>
          <text class="contact-item">邮箱：support@worthwatch.com</text>
          <text class="contact-item">地址：中国·杭州</text>
        </view>
      </view>
      <view style="height:60rpx;" />
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      sections: [
        {
          title: '一、信息收集',
          body: '我们仅收集您在使用「值得看么」过程中主动提供的信息，包括：注册时填写的昵称、手机号；研习记录、收藏内容、打卡数据；设备信息（用于优化体验，不作身份识别）。我们不会收集您的通讯录、位置、相机等敏感权限，除非您主动授权且有明确功能需要。'
        },
        {
          title: '二、信息使用',
          body: '您的信息仅用于以下目的：提供个性化的诗词推荐与研习计划；记录并展示您的学习进度与成就；发送您订阅的打卡提醒与内容推送；改善产品功能与用户体验。我们不会将您的个人信息出售、出租或以任何商业目的提供给第三方。'
        },
        {
          title: '三、信息存储',
          body: '您的数据存储于中国境内的安全服务器，采用加密传输（HTTPS）与存储加密保护。研习记录与收藏数据将在您注销账号后30天内完全删除。'
        },
        {
          title: '四、您的权利',
          body: '您随时可以：查看、修改或删除您的个人信息；关闭推送通知；申请注销账号并删除所有数据。如需行使上述权利，请通过「我的 → 系统设置」操作，或联系我们的客服团队。'
        },
        {
          title: '五、未成年人保护',
          body: '「值得看么」欢迎青少年用户学习传统诗词文化。若您未满14周岁，请在监护人陪同下使用本产品，并由监护人阅读并同意本协议。'
        },
        {
          title: '六、协议更新',
          body: '我们可能不定期更新本隐私协议。重大变更将通过应用内通知告知您。继续使用本产品即视为您接受更新后的协议。'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
$red:   #b82e2e;
$bg:    #f8f5ee;
$dark:  #1a1a1a;
$gray:  #666;
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
    width: 72rpx; height: 72rpx;
    border-radius: 50%;
    background: rgba(42,110,68,0.08);
    display: flex; align-items: center; justify-content: center;
  }

  .nav-title { font-size: 36rpx; font-weight: 500; color: $dark; }
}

.scroll-body { flex: 1; overflow: hidden; }

.content { padding: 24rpx 40rpx 0; }

.update-date {
  display: block;
  font-size: 24rpx;
  color: $gray;
  margin-bottom: 40rpx;
}

.section {
  margin-bottom: 48rpx;

  .sec-hd {
    display: flex;
    align-items: center;
    gap: 14rpx;
    margin-bottom: 20rpx;

    .sec-bar {
      width: 6rpx;
      height: 40rpx;
      background: $green;
      border-radius: 3rpx;
    }

    .sec-title {
      font-size: 32rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }
  }

  .sec-body {
    font-size: 28rpx;
    color: $gray;
    line-height: 52rpx;
    text-indent: 2em;
  }
}

.contact-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 36rpx 40rpx;
  margin-bottom: 16rpx;

  .contact-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: $dark;
    font-family: $font-bold;
    margin-bottom: 20rpx;
  }

  .contact-item {
    display: block;
    font-size: 26rpx;
    color: $gray;
    line-height: 48rpx;
  }
}
</style>
