"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        nickname: "",
        avatarUrl: ""
      },
      saveStatus: "",
      accountItems: [
        { label: "个人信息", icon: "person", iconBg: "#e6f2e9", iconColor: "#2a6e44", value: "苏东坡的小迷弟" },
        { label: "修改昵称", icon: "compose", iconBg: "#e6f2e9", iconColor: "#2a6e44", value: "" }
      ],
      readItems: [
        { label: "字体大小", icon: "font", iconBg: "#e6f2e9", iconColor: "#2a6e44", value: "标准" },
        { label: "夜间模式", icon: "eye", iconBg: "#2a2a2a", iconColor: "#fff", toggle: false },
        { label: "自动播放吟诵", icon: "sound", iconBg: "#fef3e6", iconColor: "#e07820", toggle: true },
        { label: "显示拼音", icon: "info", iconBg: "#e6f2e9", iconColor: "#2a6e44", toggle: false }
      ],
      notifyItems: [
        { label: "每日打卡提醒", icon: "calendar", iconBg: "#fef3e6", iconColor: "#e07820", toggle: true },
        { label: "研习计划提醒", icon: "notification", iconBg: "#e6f2e9", iconColor: "#2a6e44", toggle: true },
        { label: "新内容推送", icon: "paperplane", iconBg: "#e6f2e9", iconColor: "#2a6e44", toggle: false }
      ],
      otherItems: [
        { label: "清除缓存", icon: "trash", iconBg: "#f0f0f0", iconColor: "#888", value: "12.3MB" },
        { label: "关于我们", icon: "info", iconBg: "#f0f0f0", iconColor: "#888", value: "v1.0.0" },
        { label: "服务协议", icon: "paperplane", iconBg: "#f0f0f0", iconColor: "#888", value: "" },
        { label: "隐私协议", icon: "locked", iconBg: "#f0f0f0", iconColor: "#888", value: "" }
      ]
    };
  },
  onLoad() {
    const saved = common_vendor.index.getStorageSync("userInfo");
    if (saved) {
      this.userInfo = saved;
    }
    utils_request.getUserProfile().then((data) => {
      this.userInfo = { nickname: data.nickname, avatarUrl: data.avatarUrl };
      common_vendor.index.setStorageSync("userInfo", this.userInfo);
    }).catch(() => {
    });
  },
  methods: {
    // 微信选择头像回调
    onChooseAvatar(e) {
      const avatarUrl = e.detail.avatarUrl;
      common_vendor.index.__f__("log", "at pages/settings/index.vue:164", "[用户信息] 选择头像:", avatarUrl);
      this.userInfo.avatarUrl = avatarUrl;
      this.saveToServer();
    },
    // 昵称输入
    onNicknameChange(e) {
      this.userInfo.nickname = e.detail.value;
    },
    onNicknameBlur() {
      if (this.userInfo.nickname) {
        this.saveToServer();
      }
    },
    // 提交到后端
    saveToServer() {
      this.saveStatus = "保存中...";
      utils_request.updateUserProfile({
        nickname: this.userInfo.nickname,
        avatarUrl: this.userInfo.avatarUrl
      }).then((data) => {
        this.saveStatus = "已保存 ✓";
        common_vendor.index.setStorageSync("userInfo", {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl
        });
        common_vendor.index.__f__("log", "at pages/settings/index.vue:189", "[用户信息] 保存成功:", data);
        setTimeout(() => {
          this.saveStatus = "";
        }, 2e3);
      }).catch((err) => {
        this.saveStatus = "保存失败";
        common_vendor.index.__f__("error", "at pages/settings/index.vue:193", "[用户信息] 保存失败:", err);
        setTimeout(() => {
          this.saveStatus = "";
        }, 2e3);
      });
    },
    onTap(item) {
      if (item.label === "清除缓存") {
        common_vendor.index.showModal({
          title: "清除缓存",
          content: "确定清除 12.3MB 缓存？",
          success: (res) => {
            if (res.confirm) {
              item.value = "0KB";
              common_vendor.index.showToast({ title: "清除成功", icon: "success" });
            }
          }
        });
        return;
      }
      if (item.label === "隐私协议") {
        common_vendor.index.navigateTo({ url: "/pages/privacy/index" });
        return;
      }
      if (item.label === "服务协议") {
        common_vendor.index.navigateTo({ url: "/pages/service-agreement/index" });
        return;
      }
      common_vendor.index.showToast({ title: item.label, icon: "none" });
    }
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
  return common_vendor.e({
    a: common_vendor.p({
      type: "left",
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: $data.userInfo.avatarUrl || "/static/logo.png",
    d: common_vendor.p({
      type: "camera",
      size: "14",
      color: "#fff"
    }),
    e: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    f: $data.userInfo.nickname,
    g: common_vendor.o((...args) => $options.onNicknameBlur && $options.onNicknameBlur(...args)),
    h: common_vendor.o((...args) => $options.onNicknameChange && $options.onNicknameChange(...args)),
    i: common_vendor.p({
      type: "compose",
      size: "16",
      color: "#2a6e44"
    }),
    j: $data.saveStatus
  }, $data.saveStatus ? {
    k: common_vendor.t($data.saveStatus)
  } : {}, {
    l: common_vendor.f($data.accountItems, (item, k0, i0) => {
      return common_vendor.e({
        a: "6d4e92a4-3-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "20",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: item.value
      }, item.value ? {
        f: common_vendor.t(item.value)
      } : {}, {
        g: "6d4e92a4-4-" + i0,
        h: item.label,
        i: common_vendor.o(($event) => $options.onTap(item), item.label)
      });
    }),
    m: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    }),
    n: common_vendor.f($data.readItems, (item, k0, i0) => {
      return common_vendor.e({
        a: "6d4e92a4-5-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "20",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: item.value
      }, item.value ? {
        f: common_vendor.t(item.value)
      } : {}, {
        g: item.toggle !== void 0
      }, item.toggle !== void 0 ? {
        h: item.toggle ? 1 : "",
        i: common_vendor.o(($event) => item.toggle = !item.toggle, item.label)
      } : {
        j: "6d4e92a4-6-" + i0,
        k: common_vendor.p({
          type: "right",
          size: "16",
          color: "#ccc"
        })
      }, {
        l: item.label
      });
    }),
    o: common_vendor.f($data.notifyItems, (item, k0, i0) => {
      return {
        a: "6d4e92a4-7-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "20",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: item.toggle ? 1 : "",
        f: common_vendor.o(($event) => item.toggle = !item.toggle, item.label),
        g: item.label
      };
    }),
    p: common_vendor.f($data.otherItems, (item, k0, i0) => {
      return common_vendor.e({
        a: "6d4e92a4-8-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "20",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: item.value
      }, item.value ? {
        f: common_vendor.t(item.value)
      } : {}, {
        g: "6d4e92a4-9-" + i0,
        h: item.label,
        i: common_vendor.o(($event) => $options.onTap(item), item.label)
      });
    }),
    q: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/index.js.map
