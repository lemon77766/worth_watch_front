"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      tabs: ["朝代", "体裁", "选集"],
      activeTab: "朝代",
      poemsList: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      finished: false
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/library/index.vue:102", "[文库] onLoad");
    this.fetchPoems();
  },
  methods: {
    async fetchPoems() {
      common_vendor.index.__f__("log", "at pages/library/index.vue:107", "[文库] fetchPoems 调用, page:", this.page);
      if (this.loading || this.finished)
        return;
      this.loading = true;
      try {
        const data = await utils_request.getPoems({ page: this.page, pageSize: this.pageSize });
        this.total = data.total || 0;
        if (this.page === 1) {
          this.poemsList = data.list || [];
        } else {
          this.poemsList = [...this.poemsList, ...data.list || []];
        }
        if (this.poemsList.length >= this.total) {
          this.finished = true;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/library/index.vue:123", "[文库] 获取失败:", err);
      } finally {
        this.loading = false;
      }
    },
    onTabChange(tab) {
      this.activeTab = tab;
      this.page = 1;
      this.poemsList = [];
      this.finished = false;
      this.fetchPoems();
    },
    onReachBottom() {
      if (!this.finished) {
        this.page++;
        this.fetchPoems();
      }
    },
    goToDetail(poemId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${poemId}` });
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
      type: "search",
      size: "24",
      color: "#2a6e44"
    }),
    b: common_vendor.f($data.tabs, (tab, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab),
        b: $data.activeTab === tab
      }, $data.activeTab === tab ? {} : {}, {
        c: tab,
        d: $data.activeTab === tab ? 1 : "",
        e: common_vendor.o(($event) => $options.onTabChange(tab), tab)
      });
    }),
    c: common_vendor.f($data.poemsList, (poem, index, i0) => {
      return {
        a: common_vendor.t(poem.dynasty),
        b: common_vendor.t(poem.dynasty),
        c: common_vendor.t(poem.title),
        d: common_vendor.t(poem.excerpt),
        e: common_vendor.t(poem.author),
        f: poem.poemId,
        g: common_vendor.o(($event) => $options.goToDetail(poem.poemId), poem.poemId)
      };
    }),
    d: $data.loading
  }, $data.loading ? {} : {}, {
    e: $data.finished && $data.poemsList.length > 0
  }, $data.finished && $data.poemsList.length > 0 ? {} : {}, {
    f: !$data.loading && $data.poemsList.length === 0
  }, !$data.loading && $data.poemsList.length === 0 ? {} : {}, {
    g: common_vendor.o((...args) => $options.onReachBottom && $options.onReachBottom(...args)),
    h: common_vendor.p({
      type: "home",
      size: "24",
      color: "#999"
    }),
    i: common_vendor.o(($event) => common_vendor.index.reLaunch({
      url: "/pages/index/index"
    })),
    j: common_vendor.p({
      type: "folder",
      size: "24",
      color: "#2a6e44"
    }),
    k: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#fff"
    }),
    l: common_vendor.o(($event) => common_vendor.index.reLaunch({
      url: "/pages/study/index"
    })),
    m: common_vendor.p({
      type: "eye",
      size: "24",
      color: "#999"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/library/index.js.map
