"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      authors: [
        { name: "李白", title: "诗仙" },
        { name: "杜甫", title: "诗圣" },
        { name: "苏轼", title: "东坡" }
      ]
    };
  },
  methods: {
    goStudy() {
      common_vendor.index.reLaunch({ url: "/pages/study/index" });
    },
    goLibrary() {
      common_vendor.index.reLaunch({ url: "/pages/library/index" });
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
      size: "24",
      color: "#2a6e44"
    }),
    b: common_vendor.p({
      type: "right",
      size: "13",
      color: "#2a6e44"
    }),
    c: common_vendor.p({
      type: "bookmarks",
      size: "28",
      color: "#2a6e44"
    }),
    d: common_vendor.p({
      type: "heart",
      size: "28",
      color: "#b82e2e"
    }),
    e: common_vendor.f($data.authors, (a, k0, i0) => {
      return {
        a: common_vendor.t(a.name),
        b: common_vendor.t(a.title),
        c: a.name
      };
    }),
    f: common_vendor.p({
      type: "right",
      size: "22",
      color: "#fff"
    }),
    g: common_vendor.p({
      type: "home",
      size: "22",
      color: "#fff"
    }),
    h: common_vendor.p({
      type: "folder",
      size: "24",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $options.goLibrary && $options.goLibrary(...args)),
    j: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#999"
    }),
    k: common_vendor.o((...args) => $options.goStudy && $options.goStudy(...args)),
    l: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
