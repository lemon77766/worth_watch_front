"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      projectId: null,
      projectName: "",
      poemsList: [],
      page: 1,
      pageSize: 20,
      loading: false,
      noMore: false,
      loaded: false
    };
  },
  onLoad(options) {
    if (options.projectId) {
      this.projectId = parseInt(options.projectId);
    }
    if (options.name) {
      this.projectName = decodeURIComponent(options.name);
    }
    this.fetchPoems();
  },
  onShow() {
    if (this.loaded && this.projectId) {
      this.page = 1;
      this.noMore = false;
      this.fetchPoems();
    }
  },
  methods: {
    async fetchPoems() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const data = await utils_request.getProjectPoems(this.projectId, {
          page: this.page,
          pageSize: this.pageSize
        });
        common_vendor.index.__f__("log", "at pages/project-detail/index.vue:106", "[获取项目诗词] 成功:", data);
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
        common_vendor.index.__f__("error", "at pages/project-detail/index.vue:120", "[获取项目诗词] 失败:", err);
        common_vendor.index.showToast({ title: "获取诗词失败", icon: "none" });
      } finally {
        this.loading = false;
        this.loaded = true;
      }
    },
    loadMore() {
      if (!this.noMore && !this.loading) {
        this.page++;
        this.fetchPoems();
      }
    },
    formatDate(dateStr) {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    goAddPoems() {
      common_vendor.index.reLaunch({
        url: `/pages/index/index?batchProjectId=${this.projectId}&batchProjectName=${encodeURIComponent(this.projectName)}`
      });
    },
    goToDetail(poemId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${poemId}` });
    },
    onRemovePoem(poem) {
      common_vendor.index.showModal({
        title: "移除确认",
        content: `确定要将「${poem.title}」从合集中移除吗？`,
        confirmColor: "#b82e2e",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.removePoemFromProject(this.projectId, poem.poemId);
              common_vendor.index.__f__("log", "at pages/project-detail/index.vue:161", "[移除诗词] 移除成功:", poem.title);
              common_vendor.index.showToast({ title: "已移除", icon: "success" });
              this.poemsList = this.poemsList.filter((p) => p.poemId !== poem.poemId);
              common_vendor.index.$emit("onProjectPoemRemoved", { projectId: this.projectId, poemCount: this.poemsList.length });
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/project-detail/index.vue:168", "[移除诗词] 移除失败:", err);
              common_vendor.index.showToast({ title: "移除失败", icon: "none" });
            }
          }
        }
      });
    },
    onRenameProject() {
      common_vendor.index.showModal({
        title: "修改合集名称",
        editable: true,
        placeholderText: "请输入新名称",
        content: this.projectName,
        confirmColor: "#2a6e44",
        success: async (res) => {
          if (res.confirm && res.content) {
            const newName = res.content.trim();
            if (!newName) {
              common_vendor.index.showToast({ title: "名称不能为空", icon: "none" });
              return;
            }
            if (newName === this.projectName) {
              return;
            }
            try {
              await utils_request.renameProject(this.projectId, newName);
              common_vendor.index.__f__("log", "at pages/project-detail/index.vue:194", "[改名合集] 改名成功:", newName);
              common_vendor.index.showToast({ title: "改名成功", icon: "success" });
              this.projectName = newName;
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/project-detail/index.vue:198", "[改名合集] 改名失败:", err);
              common_vendor.index.showToast({ title: "改名失败", icon: "none" });
            }
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
      size: "24",
      color: "#2a6e44"
    }),
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.projectName),
    d: common_vendor.p({
      type: "compose",
      size: "22",
      color: "#2a6e44"
    }),
    e: common_vendor.o((...args) => $options.onRenameProject && $options.onRenameProject(...args)),
    f: !$data.loading && $data.poemsList.length === 0
  }, !$data.loading && $data.poemsList.length === 0 ? {
    g: common_vendor.p({
      type: "paperplane",
      size: "80",
      color: "#ccc"
    })
  } : {}, {
    h: common_vendor.f($data.poemsList, (poem, k0, i0) => {
      return {
        a: common_vendor.t(poem.dynasty),
        b: common_vendor.t(poem.dynasty),
        c: common_vendor.t(poem.title),
        d: common_vendor.t(poem.excerpt),
        e: common_vendor.t(poem.author),
        f: common_vendor.t($options.formatDate(poem.addedAt)),
        g: "37443d90-3-" + i0,
        h: common_vendor.o(($event) => $options.onRemovePoem(poem), poem.poemId),
        i: poem.poemId,
        j: common_vendor.o(($event) => $options.goToDetail(poem.poemId), poem.poemId)
      };
    }),
    i: common_vendor.p({
      type: "trash",
      size: "20",
      color: "#b82e2e"
    }),
    j: $data.loading
  }, $data.loading ? {} : {}, {
    k: !$data.loading && $data.noMore
  }, !$data.loading && $data.noMore ? {} : {}, {
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    m: common_vendor.p({
      type: "plus",
      size: "24",
      color: "#fff"
    }),
    n: common_vendor.o((...args) => $options.goAddPoems && $options.goAddPoems(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/project-detail/index.js.map
