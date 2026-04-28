"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      faved: false,
      isVertical: false,
      poem: {
        poemId: null,
        title: "",
        author: "",
        dynasty: "",
        category: "",
        content: "",
        background: "",
        translation: "",
        annotation: [],
        appreciation: "",
        authorDescription: "",
        isFavorited: false
      }
    };
  },
  onLoad(options) {
    if (options && options.id) {
      this.fetchPoemDetail(options.id);
    }
  },
  methods: {
    async fetchPoemDetail(id) {
      try {
        const data = await utils_request.getPoemDetail(id);
        if (data) {
          this.poem = data;
          this.faved = data.favorited === true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:175", "获取诗词详情失败", e);
      }
    },
    async toggleFav() {
      if (!this.poem.poemId)
        return;
      try {
        const res = await utils_request.toggleFavorite(this.poem.poemId);
        if (res) {
          this.faved = res.favorited;
          this.poem.favorited = res.favorited;
          common_vendor.index.showToast({ title: res.message || (this.faved ? "已收藏" : "已取消收藏"), icon: "none" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:188", "收藏失败", e);
      }
    },
    toggleMode(mode) {
      if (mode === "recite") {
        common_vendor.index.navigateTo({ url: `/pages/recite/index?id=${this.poem.poemId || "chunxiao"}` });
      }
    },
    goPoem(id) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${id}` });
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
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.o($options.toggleFav),
    d: common_vendor.p({
      type: $data.faved ? "heart-filled" : "heart",
      size: "22",
      color: $data.faved ? "#b82e2e" : "#2a6e44"
    }),
    e: common_vendor.t($data.poem.dynasty),
    f: common_vendor.t($data.poem.author),
    g: !$data.isVertical
  }, !$data.isVertical ? {
    h: common_vendor.t($data.poem.title),
    i: common_vendor.f(($data.poem.content || "").replace(/\r\n/g, "\n").split("\n"), (l, i, i0) => {
      return {
        a: common_vendor.t(l),
        b: i
      };
    })
  } : {
    j: common_vendor.f(($data.poem.content || "").replace(/\r\n/g, "\n").split("\n"), (l, i, i0) => {
      return {
        a: common_vendor.t(l),
        b: i
      };
    }),
    k: common_vendor.t($data.poem.title)
  }, {
    l: common_vendor.p({
      type: $data.faved ? "heart-filled" : "heart",
      size: "18",
      color: $data.faved ? "#fff" : "#444"
    }),
    m: common_vendor.t($data.faved ? "已收藏" : "收藏"),
    n: $data.faved ? "#fff" : "#333",
    o: $data.faved ? 1 : "",
    p: common_vendor.o((...args) => $options.toggleFav && $options.toggleFav(...args)),
    q: common_vendor.p({
      type: "loop",
      size: "18",
      color: $data.isVertical ? "#fff" : "#444"
    }),
    r: common_vendor.t($data.isVertical ? "水平显示" : "垂直显示"),
    s: $data.isVertical ? "#fff" : "#333",
    t: $data.isVertical ? 1 : "",
    v: common_vendor.o(($event) => $data.isVertical = !$data.isVertical),
    w: common_vendor.p({
      type: "sound",
      size: "18",
      color: "#444"
    }),
    x: common_vendor.o(($event) => $options.toggleMode("recite")),
    y: $data.poem.annotation && $data.poem.annotation.length
  }, $data.poem.annotation && $data.poem.annotation.length ? {
    z: common_vendor.p({
      type: "bookmarks",
      size: "120",
      color: "rgba(42,110,68,0.06)"
    }),
    A: common_vendor.f($data.poem.annotation, (n, k0, i0) => {
      return {
        a: common_vendor.t(n.word),
        b: common_vendor.t(n.explain),
        c: n.word
      };
    })
  } : {}, {
    B: common_vendor.t($data.poem.appreciation),
    C: $data.poem.translation
  }, $data.poem.translation ? {
    D: common_vendor.t($data.poem.translation)
  } : {}, {
    E: $data.poem.background
  }, $data.poem.background ? {
    F: common_vendor.t($data.poem.background)
  } : {}, {
    G: $data.poem.authorDescription
  }, $data.poem.authorDescription ? {
    H: common_vendor.t($data.poem.authorDescription)
  } : {}, {
    I: common_vendor.p({
      type: "bookmarks",
      size: "28",
      color: "#2a6e44"
    }),
    J: common_vendor.o(($event) => $options.goPoem("lushan")),
    K: common_vendor.p({
      type: "bookmarks",
      size: "28",
      color: "#fff"
    }),
    L: common_vendor.p({
      type: "bookmark",
      size: "18",
      color: "#fff"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/index.js.map
