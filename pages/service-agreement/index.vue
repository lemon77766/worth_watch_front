<template>
  <view class="page">
    <view class="navbar">
      <view class="nav-btn" @click="uni.navigateBack()">
        <uni-icons type="left" size="20" color="#2a6e44" />
      </view>
      <text class="nav-title">服务协议</text>
      <view style="width:72rpx;" />
    </view>

    <scroll-view scroll-y class="scroll-body">
      <view class="content">
        <text class="update-date">更新日期：2026年5月14日</text>
        <text class="intro">欢迎您使用「值得看么」小程序（以下简称"本产品"）。在使用本产品前，请您仔细阅读并充分理解本服务协议（以下简称"本协议"）。您一旦使用本产品，即视为您已充分理解并同意本协议的全部内容。</text>

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
          title: '一、服务内容',
          body: '「值得看么」是一款专注于中国传统诗词文化学习的微信小程序，致力于为用户提供诗词浏览、吟诵、研习、收藏、打卡等全方位的诗词学习体验。本产品提供的具体服务内容包括但不限于：诗词文库浏览与搜索、作者详情与作品查阅、AI语音吟诵与诗词朗读、个性化学习合集创建与管理、每日打卡与学习进度追踪、学习历史记录与回顾。我们保留随时变更、中断或终止部分服务的权利，并对服务的变更、中断或终止不承担任何责任，但我们将尽力提前通知您。'
        },
        {
          title: '二、用户账号',
          body: '您通过微信授权登录本产品，即创建了一个用户账号。您应当妥善保管您的微信账号，因您账号下发生的所有行为由您本人负责。您注册的昵称、头像等个人信息不得含有违反法律法规、侵害他人合法权益的内容，不得冒充他人或机构。若您发现账号被他人非法使用，应立即通知我们。我们有权对涉嫌违规的账号进行冻结、封禁等处理，而无需事先通知您。'
        },
        {
          title: '三、用户行为规范',
          body: '您在使用本产品时，应遵守中华人民共和国相关法律法规及微信平台规范，不得利用本产品从事任何违法违规活动。您不得对本产品进行逆向工程、反编译、反汇编，或以其他方式尝试获取本产品的源代码。您不得使用自动化脚本、爬虫等方式批量抓取本产品的诗词数据或其他内容。您不得对本产品的服务器进行恶意攻击，或以任何方式干扰本产品的正常运行。如您违反上述规定，我们有权立即终止向您提供服务，并保留追究法律责任的权利。'
        },
        {
          title: '四、知识产权',
          body: '本产品中的诗词原文属于公共文化遗产，本产品不对诗词原文主张知识产权。但本产品的界面设计、功能架构、代码实现、语音合成技术、排版样式等均受中华人民共和国知识产权法律法规保护。未经我们事先书面同意，您不得以任何方式复制、传播、展示、修改本产品的任何部分。您可以合理引用本产品中的诗词内容用于个人学习、研究或欣赏，但不得用于商业用途。'
        },
        {
          title: '五、免责声明',
          body: '本产品中的诗词内容来源于公开的古典文学作品，我们尽力确保内容的准确性与完整性，但不对内容的绝对准确性做出保证。对于因诗词文本中的标点、注释或解释产生的任何争议，以权威出版物为准。本产品提供的AI语音吟诵功能仅作为辅助学习工具，不构成专业朗诵指导。对于因网络状况、设备性能等因素导致的服务中断或数据丢失，我们不承担任何责任。本产品不对用户之间因使用本产品产生的任何纠纷承担责任。'
        },
        {
          title: '六、服务变更与终止',
          body: '我们有权根据业务发展需要，随时变更、暂停或终止本产品的部分或全部服务。在做出重大变更前，我们将通过应用内通知或其他合理方式告知您。您有权随时停止使用本产品，并可以申请注销您的账号。账号注销后，我们将按照隐私协议的约定处理您的个人信息。因不可抗力、政策调整、技术原因等导致服务中断的，我们不承担赔偿责任，但将尽力及时恢复服务。'
        },
        {
          title: '七、协议修改',
          body: '我们有权根据法律法规变化、产品功能更新等原因，对本协议进行修订。修订后的协议将在本产品内公示，自公示之日起生效。如您在协议修订后继续使用本产品，即视为您同意修订后的协议。如您不同意修订后的协议，您可以停止使用本产品并申请注销账号。'
        },
        {
          title: '八、法律适用与争议解决',
          body: '本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均有权向我们所在地有管辖权的人民法院提起诉讼。本协议中任何条款无论因何种原因完全或部分无效或不具有执行力，均不影响其他条款的效力。'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
$green: #2a6e44;
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
