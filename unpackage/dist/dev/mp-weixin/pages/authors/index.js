"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      authors: [],
      keyword: "",
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false
    };
  },
  onLoad() {
    this.fetchAuthors();
  },
  methods: {
    async fetchAuthors() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        if (this.keyword) {
          params.q = this.keyword;
        }
        const data = await utils_request.getAuthors(params);
        common_vendor.index.__f__("log", "at pages/authors/index.vue:95", "[作者列表] 成功:", data);
        const list = data.list || [];
        if (this.page === 1) {
          this.authors = list;
        } else {
          this.authors = [...this.authors, ...list];
        }
        if (list.length < this.pageSize) {
          this.noMore = true;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/authors/index.vue:106", "[作者列表] 失败:", err);
        common_vendor.index.showToast({ title: "获取作者列表失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++;
        this.fetchAuthors();
      }
    },
    onSearch() {
      this.page = 1;
      this.authors = [];
      this.noMore = false;
      this.fetchAuthors();
    },
    clearSearch() {
      this.keyword = "";
      this.onSearch();
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    goToDetail(author) {
      if (author.authorId) {
        common_vendor.index.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` });
      }
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
    c: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    d: $data.keyword,
    e: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    f: $data.keyword
  }, $data.keyword ? {
    g: common_vendor.p({
      type: "clear",
      size: "18",
      color: "#999"
    }),
    h: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    i: !$data.loading && $data.authors.length === 0
  }, !$data.loading && $data.authors.length === 0 ? {
    j: common_vendor.p({
      type: "person",
      size: "80",
      color: "#ccc"
    })
  } : {}, {
    k: common_vendor.f($data.authors, (author, k0, i0) => {
      return common_vendor.e({
        a: author.avatarUrl
      }, author.avatarUrl ? {
        b: author.avatarUrl
      } : {
        c: common_vendor.t(author.name ? author.name[0] : "")
      }, {
        d: common_vendor.t(author.name),
        e: common_vendor.t(author.dynasty || ""),
        f: author.description
      }, author.description ? {
        g: common_vendor.t(author.description.length > 40 ? author.description.substring(0, 40) + "..." : author.description)
      } : {}, {
        h: "4b617433-3-" + i0,
        i: author.authorId,
        j: common_vendor.o(($event) => $options.goToDetail(author), author.authorId)
      });
    }),
    l: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    }),
    m: $data.loading
  }, $data.loading ? {} : {}, {
    n: !$data.loading && $data.noMore && $data.authors.length > 0
  }, !$data.loading && $data.noMore && $data.authors.length > 0 ? {} : {}, {
    o: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/authors/index.js.map
