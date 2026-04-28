"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      sections: [
        {
          title: "一、信息收集",
          body: "我们仅收集您在使用「值得看么」过程中主动提供的信息，包括：注册时填写的昵称、手机号；研习记录、收藏内容、打卡数据；设备信息（用于优化体验，不作身份识别）。我们不会收集您的通讯录、位置、相机等敏感权限，除非您主动授权且有明确功能需要。"
        },
        {
          title: "二、信息使用",
          body: "您的信息仅用于以下目的：提供个性化的诗词推荐与研习计划；记录并展示您的学习进度与成就；发送您订阅的打卡提醒与内容推送；改善产品功能与用户体验。我们不会将您的个人信息出售、出租或以任何商业目的提供给第三方。"
        },
        {
          title: "三、信息存储",
          body: "您的数据存储于中国境内的安全服务器，采用加密传输（HTTPS）与存储加密保护。研习记录与收藏数据将在您注销账号后30天内完全删除。"
        },
        {
          title: "四、您的权利",
          body: "您随时可以：查看、修改或删除您的个人信息；关闭推送通知；申请注销账号并删除所有数据。如需行使上述权利，请通过「我的 → 系统设置」操作，或联系我们的客服团队。"
        },
        {
          title: "五、未成年人保护",
          body: "「值得看么」欢迎青少年用户学习传统诗词文化。若您未满14周岁，请在监护人陪同下使用本产品，并由监护人阅读并同意本协议。"
        },
        {
          title: "六、协议更新",
          body: "我们可能不定期更新本隐私协议。重大变更将通过应用内通知告知您。继续使用本产品即视为您接受更新后的协议。"
        }
      ]
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "left",
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.f($data.sections, (s, k0, i0) => {
      return {
        a: common_vendor.t(s.title),
        b: common_vendor.t(s.body),
        c: s.title
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/privacy/index.js.map
