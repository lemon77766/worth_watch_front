"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
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
      size: "24",
      color: "#2a6e44"
    }),
    b: common_vendor.p({
      type: "search",
      size: "24",
      color: "#2a6e44"
    }),
    c: common_vendor.p({
      type: "bookmarks",
      size: "26",
      color: "#2a6e44"
    }),
    d: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    }),
    e: common_vendor.p({
      type: "bookmarks",
      size: "26",
      color: "#2a6e44"
    }),
    f: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    }),
    g: common_vendor.p({
      type: "home",
      size: "24",
      color: "#999"
    }),
    h: common_vendor.o(($event) => common_vendor.index.reLaunch({
      url: "/pages/index/index"
    })),
    i: common_vendor.p({
      type: "bookmarks",
      size: "22",
      color: "#fff"
    }),
    j: common_vendor.p({
      type: "star",
      size: "24",
      color: "#999"
    }),
    k: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/study/index.js.map
