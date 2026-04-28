"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      activeTab: "全部",
      tabs: ["全部", "唐诗", "宋词", "古文"],
      stats: [
        { num: 0, label: "收藏诗词" },
        { num: 0, label: "收藏选集" },
        { num: 0, label: "收藏作者" }
      ],
      list: [],
      total: 0
    };
  },
  computed: {
    filteredList() {
      if (this.activeTab === "全部")
        return this.list;
      return this.list.filter((p) => p.category === this.activeTab);
    }
  },
  onLoad() {
    this.fetchFavorites();
  },
  methods: {
    async fetchFavorites() {
      try {
        const res = await utils_request.getFavorites({ page: 1, pageSize: 100 });
        if (res && res.list) {
          this.list = res.list.map((p) => ({
            ...p,
            preview: p.excerpt,
            cat: this.getCategory(p.dynasty)
          }));
          this.total = res.total;
          this.stats[0].num = res.total;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/favorites/index.vue:101", "获取收藏列表失败", e);
      }
    },
    getCategory(dynasty) {
      if (["唐"].includes(dynasty))
        return "唐诗";
      if (["宋"].includes(dynasty))
        return "宋词";
      return "古文";
    },
    async removeFav(p) {
      common_vendor.index.showModal({
        title: "取消收藏",
        content: `确定取消收藏《${p.title}》？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.toggleFavorite(p.poemId);
              this.list = this.list.filter((item) => item.poemId !== p.poemId);
              this.total--;
              this.stats[0].num = this.total;
              common_vendor.index.showToast({ title: "已取消收藏", icon: "none" });
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/favorites/index.vue:122", "取消收藏失败", e);
            }
          }
        }
      });
    },
    goDetail(p) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${p.poemId}` });
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
      type: "left",
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.p({
      type: "search",
      size: "20",
      color: "#2a6e44"
    }),
    d: common_vendor.f($data.stats, (s, k0, i0) => {
      return {
        a: common_vendor.t(s.num),
        b: common_vendor.t(s.label),
        c: s.label
      };
    }),
    e: common_vendor.f($data.tabs, (t, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(t),
        b: $data.activeTab === t
      }, $data.activeTab === t ? {} : {}, {
        c: t,
        d: $data.activeTab === t ? 1 : "",
        e: common_vendor.o(($event) => $data.activeTab = t, t)
      });
    }),
    f: common_vendor.f($options.filteredList, (p, k0, i0) => {
      return {
        a: common_vendor.t(p.dynasty),
        b: p.tagColor,
        c: common_vendor.t(p.title),
        d: common_vendor.t(p.author),
        e: common_vendor.t(p.excerpt),
        f: "d86558fc-2-" + i0,
        g: common_vendor.o(($event) => $options.removeFav(p), p.poemId),
        h: common_vendor.t(p.type),
        i: p.poemId,
        j: common_vendor.o(($event) => $options.goDetail(p), p.poemId)
      };
    }),
    g: common_vendor.p({
      type: "heart-filled",
      size: "22",
      color: "#b82e2e"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/favorites/index.js.map
