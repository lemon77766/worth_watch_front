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
        <text class="update-date">更新日期：2026年5月14日</text>
        <text class="intro">「值得看么」小程序（以下简称"本产品"）非常重视用户隐私保护。本隐私协议（以下简称"本协议"）将向您说明我们如何收集、使用、存储和保护您的个人信息。请您在使用本产品前仔细阅读本协议。</text>

        <view class="section" v-for="s in sections" :key="s.title">
          <view class="sec-hd">
            <view class="sec-bar" />
            <text class="sec-title">{{ s.title }}</text>
          </view>
          <text class="sec-body">{{ s.body }}</text>
        </view>

        <view class="contact-card">
          <text class="contact-title">联系我们</text>
          <text class="contact-item">邮箱：lemon77766@163.com</text>
          <text class="contact-item">地址：中国·石家庄</text>
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
          body: '我们仅收集您在使用「值得看么」过程中主动提供的信息，包括：微信授权登录时获取的公开信息（昵称、头像）；您在完善个人资料时填写的昵称、头像；您的研习记录、收藏内容、打卡数据、学习合集信息；您使用语音吟诵功能时的诗词内容与音色偏好设置；设备信息（用于优化体验，不作身份识别）。我们不会收集您的通讯录、短信、相册等敏感权限，除非您主动授权且有明确功能需要。'
        },
        {
          title: '二、信息使用',
          body: '您的信息仅用于以下目的：提供个性化的诗词推荐与研习计划；记录并展示您的学习进度与成就；发送您订阅的打卡提醒与内容推送；生成语音吟诵音频以辅助学习；改善产品功能与用户体验。我们不会将您的个人信息出售、出租或以任何商业目的提供给第三方。未经您的同意，我们不会将您的个人信息用于本协议未载明的其他目的。'
        },
        {
          title: '三、信息存储',
          body: '您的数据存储于中国境内的安全服务器，采用加密传输（HTTPS）与存储加密保护。我们采取合理的技术手段保护您的个人信息安全，防止数据遭到未经授权的访问、泄露、篡改或损坏。研习记录与收藏数据将在您注销账号后30天内完全删除。如发生个人信息安全事件，我们将依法及时向您告知事件情况及我们采取的处置措施。'
        },
        {
          title: '四、信息共享',
          body: '除以下情形外，我们不会与任何第三方共享您的个人信息：获得您明确同意后；根据法律法规规定或行政、司法机关的强制性要求；与关联公司共享：仅为本协议中声明的目的；与授权合作伙伴共享：仅为实现本产品功能所必需，如语音合成服务提供方。我们会与其签署严格的保密协议，要求其按照我们的说明、本协议以及其他相关的保密和安全措施来处理个人信息。'
        },
        {
          title: '五、您的权利',
          body: '您随时可以：查看、修改或删除您的个人信息；关闭推送通知；撤回已授予的权限；申请注销账号并删除所有数据。如需行使上述权利，请通过「我的 → 系统设置」操作，或联系我们的客服团队。我们将在收到您的请求后15个工作日内予以回复。注销账号后，我们将停止为您提供服务，并根据法律法规规定删除或匿名化处理您的个人信息。'
        },
        {
          title: '六、未成年人保护',
          body: '「值得看么」欢迎青少年用户学习传统诗词文化。若您为未满14周岁的未成年人，请在您的监护人陪同和指导下使用本产品，并由您的监护人阅读并同意本协议。我们不会主动收集未满14周岁未成年人的个人信息，仅会在监护人同意的前提下收集必要信息以提供服务。如果我们发现在未获得监护人同意的情况下收集了未成年人的个人信息，我们将尽快删除相关信息。'
        },
        {
          title: '七、Cookie及类似技术',
          body: '本产品为微信小程序，不使用传统的Cookie技术。我们可能使用微信小程序提供的本地存储功能（如Storage API）来保存您的登录状态、用户偏好设置等，以提升您的使用体验。这些本地数据仅存储在您的设备上，不会上传至服务器。您可以随时通过清除小程序数据来删除这些本地存储信息。'
        },
        {
          title: '八、协议更新',
          body: '我们可能不定期更新本隐私协议。重大变更将通过应用内通知告知您。对于您明显知悉变更后继续使用本产品的，视为您接受更新后的协议。如您不同意更新后的协议，您有权停止使用本产品并申请注销账号。本协议的任何修改均不损害您在修改前依据本协议享有的权利。'
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
  margin-bottom: 24rpx;
}

.intro {
  display: block;
  font-size: 28rpx;
  color: $gray;
  line-height: 52rpx;
  margin-bottom: 40rpx;
  text-indent: 2em;
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
