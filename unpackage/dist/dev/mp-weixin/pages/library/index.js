"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      tabs: ["朝代", "体裁", "选集"],
      activeTab: "朝代"
    };
  },
  methods: {
    goHome() {
      common_vendor.index.navigateTo({ url: "/pages/index/index" });
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
  return {
    a: common_vendor.p({
      type: "bars",
      size: "22",
      color: "#3a3a3a"
    }),
    b: common_vendor.p({
      type: "search",
      size: "22",
      color: "#3a3a3a"
    }),
    c: common_assets._imports_0,
    d: common_vendor.f($data.tabs, (tab, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab),
        b: $data.activeTab === tab
      }, $data.activeTab === tab ? {} : {}, {
        c: tab,
        d: $data.activeTab === tab ? 1 : "",
        e: common_vendor.o(($event) => $data.activeTab = tab, tab)
      });
    }),
    e: common_vendor.p({
      type: "compose",
      size: "16",
      color: "#3a6b35"
    }),
    f: common_assets._imports_0,
    g: common_vendor.p({
      type: "heart",
      size: "18",
      color: "#fff"
    }),
    h: common_vendor.p({
      type: "home",
      size: "22",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    j: common_vendor.p({
      type: "folder",
      size: "22",
      color: "#3a6b35"
    }),
    k: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#fff"
    }),
    l: common_vendor.p({
      type: "eye",
      size: "22",
      color: "#999"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/library/index.js.map
