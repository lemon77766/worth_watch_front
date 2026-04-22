"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      agreed: false
    };
  },
  methods: {
    handleLogin() {
      if (!this.agreed) {
        common_vendor.index.showToast({ title: "请先同意服务协议与隐私政策", icon: "none" });
        return;
      }
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
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
    a: $data.agreed ? 1 : "",
    b: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    c: $data.agreed
  }, $data.agreed ? {
    d: common_vendor.p({
      type: "checkmarkempty",
      size: "14",
      color: "#2a6e44"
    })
  } : {}, {
    e: $data.agreed ? 1 : "",
    f: common_vendor.o(($event) => $data.agreed = !$data.agreed)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
