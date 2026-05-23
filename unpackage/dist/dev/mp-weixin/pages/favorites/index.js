"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      activeTab: "全部",
      tabs: ["全部"],
      list: [],
      total: 0,
      loading: true
    };
  },
  computed: {
    filteredList() {
      return this.list;
    }
  },
  onLoad() {
    if (!common_vendor.index.getStorageSync("token")) {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录后查看收藏",
        confirmText: "去登录",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({ url: "/pages/login/index" });
          }
          common_vendor.index.navigateBack();
        }
      });
      return;
    }
    this.fetchFavorites();
  },
  methods: {
    async fetchFavorites() {
      this.loading = true;
      try {
        const res = await utils_request.getFavorites({ page: 1, pageSize: 100 });
        if (res && res.list) {
          this.list = res.list.map((p) => ({
            ...p,
            preview: p.excerpt
          }));
          this.total = res.total;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/favorites/index.vue:113", "获取收藏列表失败", e);
      } finally {
        this.loading = false;
      }
    },
    async removeFav(p) {
      common_vendor.index.showModal({
        title: "取消收藏",
        content: `确定取消收藏《${p.title}》？`,
        confirmColor: "#c05050",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.toggleFavorite(p.poemId);
              this.list = this.list.filter((item) => item.poemId !== p.poemId);
              this.total--;
              common_vendor.index.showToast({ title: "已取消收藏", icon: "none" });
            } catch (e) {
              common_vendor.index.__f__("error", "at pages/favorites/index.vue:131", "取消收藏失败", e);
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
  return common_vendor.e({
    a: common_vendor.p({
      type: "left",
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.t($data.total),
    d: !$data.loading && $data.list.length === 0
  }, !$data.loading && $data.list.length === 0 ? {} : {}, {
    e: common_vendor.f($options.filteredList, (p, i, i0) => {
      return {
        a: common_vendor.t(p.title),
        b: common_vendor.t(p.dynasty),
        c: common_vendor.t(p.author),
        d: common_vendor.t(p.excerpt),
        e: "d86558fc-1-" + i0,
        f: common_vendor.o(($event) => $options.removeFav(p), p.poemId),
        g: p.poemId,
        h: common_vendor.o(($event) => $options.goDetail(p), p.poemId)
      };
    }),
    f: common_vendor.p({
      type: "heart-filled",
      size: "18",
      color: "#c05050"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/favorites/index.js.map
