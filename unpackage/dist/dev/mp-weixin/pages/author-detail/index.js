"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      authorId: null,
      author: {},
      poemsList: [],
      poemsLoading: false,
      noMore: false,
      page: 1,
      pageSize: 20
    };
  },
  onLoad(options) {
    if (options.id) {
      this.authorId = options.id;
      this.fetchAuthorDetail();
      this.fetchPoems();
    }
  },
  methods: {
    async fetchAuthorDetail() {
      try {
        const data = await utils_request.getAuthorDetail(this.authorId);
        common_vendor.index.__f__("log", "at pages/author-detail/index.vue:98", "[作者详情] 成功:", data);
        this.author = data || {};
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/author-detail/index.vue:101", "[作者详情] 失败:", err);
        common_vendor.index.showToast({ title: "获取作者信息失败", icon: "none" });
      }
    },
    async fetchPoems() {
      if (this.poemsLoading || this.noMore)
        return;
      this.poemsLoading = true;
      try {
        const data = await utils_request.getPoems({
          q: this.author.name || "",
          page: this.page,
          pageSize: this.pageSize
        });
        const list = data.list || [];
        if (this.page === 1) {
          this.poemsList = list;
        } else {
          this.poemsList = [...this.poemsList, ...list];
        }
        if (list.length < this.pageSize) {
          this.noMore = true;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/author-detail/index.vue:124", "[作者诗词] 获取失败:", err);
      } finally {
        this.poemsLoading = false;
      }
    },
    loadMore() {
      if (!this.noMore && !this.poemsLoading) {
        this.page++;
        this.fetchPoems();
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
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
      type: "left",
      size: "24",
      color: "#2a6e44"
    }),
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: $data.author.avatarUrl
  }, $data.author.avatarUrl ? {
    d: $data.author.avatarUrl
  } : {
    e: common_vendor.t($data.author.name ? $data.author.name[0] : "")
  }, {
    f: common_vendor.t($data.author.name),
    g: common_vendor.t($data.author.dynasty),
    h: $data.author.description
  }, $data.author.description ? {
    i: common_vendor.t($data.author.description)
  } : {}, {
    j: $data.poemsLoading && $data.poemsList.length === 0
  }, $data.poemsLoading && $data.poemsList.length === 0 ? {} : {}, {
    k: !$data.poemsLoading && $data.poemsList.length === 0
  }, !$data.poemsLoading && $data.poemsList.length === 0 ? {} : {}, {
    l: common_vendor.f($data.poemsList, (poem, k0, i0) => {
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
    m: $data.poemsLoading && $data.poemsList.length > 0
  }, $data.poemsLoading && $data.poemsList.length > 0 ? {} : {}, {
    n: !$data.poemsLoading && $data.noMore && $data.poemsList.length > 0
  }, !$data.poemsLoading && $data.noMore && $data.poemsList.length > 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/author-detail/index.js.map
