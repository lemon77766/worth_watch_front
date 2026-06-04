"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      agreed: false,
      loading: false,
      submitting: false,
      uploading: false,
      // 头像正在上传中
      showProfileModal: false,
      tempAvatar: "",
      tempNickname: ""
    };
  },
  methods: {
    handleLogin() {
      if (!this.agreed) {
        common_vendor.index.showToast({ title: "请先同意服务协议与隐私政策", icon: "none" });
        return;
      }
      common_vendor.index.__f__("log", "at pages/login/index.vue:113", "[登录] 开始登录流程");
      this.loading = true;
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          common_vendor.index.__f__("log", "at pages/login/index.vue:119", "[登录] uni.login 成功，code:", loginRes.code);
          utils_request.login(loginRes.code).then((data) => {
            common_vendor.index.__f__("log", "at pages/login/index.vue:122", "[登录] 登录成功，token:", data.token);
            common_vendor.index.setStorageSync("token", data.token);
            common_vendor.index.setStorageSync("isNewUser", data.isNewUser);
            this.loading = false;
            common_vendor.index.showToast({ title: "登录成功", icon: "success" });
            setTimeout(() => this.goHome(), 500);
          }).catch((err) => {
            common_vendor.index.__f__("error", "at pages/login/index.vue:129", "[登录] 后端登录失败:", err);
            this.loading = false;
            common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/index.vue:135", "[登录] uni.login 失败:", err);
          this.loading = false;
          common_vendor.index.showToast({ title: "微信登录失败，请重试", icon: "none" });
        }
      });
    },
    goHome() {
      utils_request.getUserProfile().then((data) => {
        common_vendor.index.__f__("log", "at pages/login/index.vue:144", "[登录] 服务端用户资料:", data);
        const nickname = data.nickname || data.nickName || "";
        const avatarUrl = data.avatarUrl || data.avatar || "";
        if (nickname) {
          const info = { nickname, avatarUrl };
          common_vendor.index.setStorageSync("userInfo", info);
          common_vendor.index.removeStorageSync("isNewUser");
          common_vendor.index.navigateBack({
            fail: () => {
              common_vendor.index.reLaunch({ url: "/pages/index/index" });
            }
          });
        } else {
          this.showProfileModal = true;
        }
      }).catch((err) => {
        common_vendor.index.__f__("warn", "at pages/login/index.vue:163", "[登录] 获取用户资料失败:", err);
        const isNewUser = common_vendor.index.getStorageSync("isNewUser");
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (isNewUser || !userInfo || !userInfo.nickname) {
          this.showProfileModal = true;
        } else {
          common_vendor.index.navigateBack({
            fail: () => {
              common_vendor.index.reLaunch({ url: "/pages/index/index" });
            }
          });
        }
      });
    },
    onChooseAvatar(e) {
      if (this.submitting)
        return;
      const avatarUrl = e.detail.avatarUrl;
      common_vendor.index.__f__("log", "at pages/login/index.vue:182", "[选择头像] 原始路径:", avatarUrl);
      this.tempAvatar = avatarUrl;
      const isLocalFile = avatarUrl && (avatarUrl.startsWith("wxfile://") || avatarUrl.includes("/tmp/") || avatarUrl.includes("\\tmp\\"));
      common_vendor.index.__f__("log", "at pages/login/index.vue:192", "[选择头像] 是否本地临时文件:", isLocalFile);
      if (isLocalFile) {
        common_vendor.index.__f__("log", "at pages/login/index.vue:196", "[选择头像] 开始上传本地文件");
        this.uploading = true;
        common_vendor.index.showLoading({ title: "上传头像..." });
        utils_request.uploadAvatar(avatarUrl).then((res) => {
          common_vendor.index.__f__("log", "at pages/login/index.vue:201", "[选择头像] 上传Promise成功，永久URL:", res);
          this.tempAvatar = res;
          this.uploading = false;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "头像上传成功", icon: "success" });
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/login/index.vue:207", "[选择头像] 上传Promise失败:", err);
          this.uploading = false;
          this.tempAvatar = "";
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "头像上传失败", icon: "none" });
        });
      } else {
        common_vendor.index.__f__("log", "at pages/login/index.vue:214", "[选择头像] 已是网络URL或无效路径，跳过上传");
      }
    },
    onNickNameInput(e) {
      this.tempNickname = e.detail.value;
    },
    async submitProfile() {
      if (this.submitting)
        return;
      common_vendor.index.__f__("log", "at pages/login/index.vue:223", "[提交资料] 当前tempAvatar:", this.tempAvatar);
      common_vendor.index.__f__("log", "at pages/login/index.vue:224", "[提交资料] 当前tempNickname:", this.tempNickname);
      const isLocalFile = this.tempAvatar && (this.tempAvatar.startsWith("wxfile://") || this.tempAvatar.includes("/tmp/") || this.tempAvatar.includes("\\tmp\\"));
      if (this.uploading) {
        common_vendor.index.showToast({ title: "头像上传中，请稍候", icon: "none" });
        return;
      }
      if (isLocalFile) {
        common_vendor.index.showToast({ title: "头像上传失败，请重新选择", icon: "none" });
        return;
      }
      this.submitting = true;
      common_vendor.index.showLoading({ title: "提交中..." });
      try {
        const requestData = {
          nickname: this.tempNickname || "",
          avatarUrl: this.tempAvatar || ""
        };
        common_vendor.index.__f__("log", "at pages/login/index.vue:253", "[提交资料] 发送的数据:", JSON.stringify(requestData));
        const data = await utils_request.updateUserProfile(requestData);
        common_vendor.index.__f__("log", "at pages/login/index.vue:257", "[提交资料] 后端返回:", data);
        common_vendor.index.setStorageSync("userInfo", {
          nickname: data.nickname || this.tempNickname,
          avatarUrl: data.avatarUrl || this.tempAvatar
        });
        common_vendor.index.showToast({ title: "资料完善成功", icon: "success" });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/login/index.vue:266", "[提交资料失败]", err);
        common_vendor.index.showToast({ title: "提交失败，请重试", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
        this.submitting = false;
        common_vendor.index.removeStorageSync("isNewUser");
        common_vendor.index.navigateBack({
          fail: () => {
            common_vendor.index.reLaunch({ url: "/pages/index/index" });
          }
        });
      }
    },
    skipProfile() {
      common_vendor.index.removeStorageSync("isNewUser");
      common_vendor.index.navigateBack({
        fail: () => {
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        }
      });
    },
    goBack() {
      common_vendor.index.navigateBack({
        fail: () => {
          common_vendor.index.reLaunch({ url: "/pages/index/index" });
        }
      });
    },
    goAgreement(type) {
      if (type === "service") {
        common_vendor.index.navigateTo({ url: "/pages/service-agreement/index" });
      } else {
        common_vendor.index.navigateTo({ url: "/pages/privacy/index" });
      }
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
      size: "22",
      color: "#2a6e44"
    }),
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.loading ? "登录中..." : "微信一键登录"),
    d: $data.agreed ? 1 : "",
    e: $data.loading,
    f: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    g: $data.agreed
  }, $data.agreed ? {
    h: common_vendor.p({
      type: "checkmarkempty",
      size: "14",
      color: "#2a6e44"
    })
  } : {}, {
    i: $data.agreed ? 1 : "",
    j: common_vendor.o(($event) => $data.agreed = !$data.agreed),
    k: common_vendor.o(($event) => $options.goAgreement("service")),
    l: common_vendor.o(($event) => $options.goAgreement("privacy")),
    m: $data.showProfileModal
  }, $data.showProfileModal ? {
    n: $data.tempAvatar || "/static/logo.png",
    o: common_vendor.p({
      type: "camera",
      size: "16",
      color: "#fff"
    }),
    p: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    q: $data.tempNickname,
    r: common_vendor.o((...args) => $options.onNickNameInput && $options.onNickNameInput(...args)),
    s: common_vendor.o((...args) => $options.skipProfile && $options.skipProfile(...args)),
    t: common_vendor.t($data.submitting ? "提交中..." : "完成"),
    v: $data.submitting ? 1 : "",
    w: common_vendor.o((...args) => $options.submitProfile && $options.submitProfile(...args)),
    x: common_vendor.o(() => {
    }),
    y: common_vendor.o(($event) => $data.showProfileModal = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
