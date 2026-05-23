"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      faved: false,
      isVertical: false,
      studied: false,
      recommendList: [],
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
      const studiedMap = common_vendor.index.getStorageSync("studiedPoems") || {};
      this.studied = !!studiedMap[options.id];
    }
  },
  methods: {
    goToMine() {
      common_vendor.index.$emit("goToMine");
      common_vendor.index.navigateBack();
    },
    async fetchPoemDetail(id) {
      try {
        const data = await utils_request.getPoemDetail(id);
        if (data) {
          this.poem = data;
          this.faved = data.favorited === true;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:193", "获取诗词详情失败", e);
      }
      try {
        const list = await utils_request.getRecommendPoems(id);
        if (list && list.length) {
          this.recommendList = list;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:202", "获取推荐诗词失败", e);
      }
    },
    async toggleFav() {
      if (!this.poem.poemId)
        return;
      if (!common_vendor.index.getStorageSync("token")) {
        this.promptLogin();
        return;
      }
      try {
        const res = await utils_request.toggleFavorite(this.poem.poemId);
        if (res) {
          this.faved = res.favorited;
          this.poem.favorited = res.favorited;
          common_vendor.index.showToast({ title: res.message || (this.faved ? "已收藏" : "已取消收藏"), icon: "none" });
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:219", "收藏失败", e);
      }
    },
    toggleMode(mode) {
      if (mode === "recite") {
        common_vendor.index.navigateTo({ url: `/pages/recite/index?id=${this.poem.poemId || "chunxiao"}` });
      }
    },
    goPoem(id) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${id}` });
    },
    async markStudied() {
      if (this.studied)
        return;
      if (!this.poem.poemId)
        return;
      if (!common_vendor.index.getStorageSync("token")) {
        this.promptLogin();
        return;
      }
      try {
        await utils_request.submitStudyRecord({
          type: "poem",
          targetId: String(this.poem.poemId)
        });
        this.studied = true;
        const studiedMap = common_vendor.index.getStorageSync("studiedPoems") || {};
        studiedMap[this.poem.poemId] = true;
        common_vendor.index.setStorageSync("studiedPoems", studiedMap);
        common_vendor.index.showToast({ title: "已标记学完", icon: "success" });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/index.vue:249", "提交学习记录失败", e);
      }
    },
    promptLogin() {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录后再操作",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({ url: "/pages/login/index" });
          }
        }
      });
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
    c: common_vendor.o((...args) => $options.goToMine && $options.goToMine(...args)),
    d: common_vendor.o($options.toggleFav),
    e: common_vendor.p({
      type: $data.faved ? "heart-filled" : "heart",
      size: "22",
      color: $data.faved ? "#b82e2e" : "#2a6e44"
    }),
    f: common_vendor.t($data.poem.dynasty),
    g: common_vendor.t($data.poem.author),
    h: !$data.isVertical
  }, !$data.isVertical ? {
    i: common_vendor.t($data.poem.title),
    j: common_vendor.f(($data.poem.content || "").replace(/\r\n/g, "\n").split("\n"), (l, i, i0) => {
      return {
        a: common_vendor.t(l),
        b: i
      };
    })
  } : {
    k: common_vendor.f(($data.poem.content || "").replace(/\r\n/g, "\n").split("\n"), (l, i, i0) => {
      return {
        a: common_vendor.t(l),
        b: i
      };
    }),
    l: common_vendor.t($data.poem.title)
  }, {
    m: common_vendor.p({
      type: $data.faved ? "heart-filled" : "heart",
      size: "18",
      color: $data.faved ? "#fff" : "#444"
    }),
    n: common_vendor.t($data.faved ? "已收藏" : "收藏"),
    o: $data.faved ? "#fff" : "#333",
    p: $data.faved ? 1 : "",
    q: common_vendor.o((...args) => $options.toggleFav && $options.toggleFav(...args)),
    r: common_vendor.p({
      type: "loop",
      size: "18",
      color: $data.isVertical ? "#fff" : "#444"
    }),
    s: common_vendor.t($data.isVertical ? "水平显示" : "垂直显示"),
    t: $data.isVertical ? "#fff" : "#333",
    v: $data.isVertical ? 1 : "",
    w: common_vendor.o(($event) => $data.isVertical = !$data.isVertical),
    x: common_vendor.p({
      type: "sound",
      size: "18",
      color: "#444"
    }),
    y: common_vendor.o(($event) => $options.toggleMode("recite")),
    z: $data.poem.annotation && $data.poem.annotation.length
  }, $data.poem.annotation && $data.poem.annotation.length ? {
    A: common_vendor.p({
      type: "bookmarks",
      size: "120",
      color: "rgba(42,110,68,0.06)"
    }),
    B: common_vendor.f($data.poem.annotation, (n, k0, i0) => {
      return {
        a: common_vendor.t(n.word),
        b: common_vendor.t(n.explain),
        c: n.word
      };
    })
  } : {}, {
    C: common_vendor.t($data.poem.appreciation),
    D: $data.poem.translation
  }, $data.poem.translation ? {
    E: common_vendor.t($data.poem.translation)
  } : {}, {
    F: $data.poem.background
  }, $data.poem.background ? {
    G: common_vendor.t($data.poem.background)
  } : {}, {
    H: $data.poem.authorDescription
  }, $data.poem.authorDescription ? {
    I: common_vendor.t($data.poem.authorDescription)
  } : {}, {
    J: common_vendor.p({
      type: $data.studied ? "checkmarkempty" : "flag",
      size: "20",
      color: $data.studied ? "#fff" : "#e6a23c"
    }),
    K: common_vendor.t($data.studied ? "已学完" : "标记学完"),
    L: $data.studied ? "#fff" : "#e6a23c",
    M: $data.studied ? 1 : "",
    N: common_vendor.o((...args) => $options.markStudied && $options.markStudied(...args)),
    O: $data.recommendList.length
  }, $data.recommendList.length ? {
    P: common_vendor.f($data.recommendList, (item, i, i0) => {
      return common_vendor.e({
        a: "32c43d5c-7-" + i0,
        b: common_vendor.p({
          type: "bookmarks",
          size: "28",
          color: i % 2 === 0 ? "#2a6e44" : "#fff"
        }),
        c: common_vendor.n(i % 2 === 0 ? "rec-icon-light" : "rec-icon-green"),
        d: common_vendor.t(item.title),
        e: common_vendor.s(i % 2 !== 0 ? "color:#fff;" : ""),
        f: common_vendor.t(item.dynasty),
        g: common_vendor.t(item.author),
        h: common_vendor.s(i % 2 !== 0 ? "color:rgba(255,255,255,0.8);" : ""),
        i: item.isLearned
      }, item.isLearned ? {
        j: "32c43d5c-8-" + i0,
        k: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#fff"
        })
      } : {}, {
        l: common_vendor.n(i % 2 === 0 ? "rec-light" : "rec-green"),
        m: item.poemId,
        n: common_vendor.o(($event) => $options.goPoem(item.poemId), item.poemId)
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/index.js.map
