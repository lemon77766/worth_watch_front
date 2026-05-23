"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      projects: [],
      loading: true
    };
  },
  onLoad() {
    if (!common_vendor.index.getStorageSync("token")) {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录后查看学习合集",
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
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const data = await utils_request.getProjects();
        common_vendor.index.__f__("log", "at pages/projects/index.vue:115", "[获取学习合集] 成功:", data);
        this.projects = data || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/projects/index.vue:118", "[获取学习合集] 失败:", err);
        common_vendor.index.showToast({ title: "获取合集失败", icon: "none" });
      } finally {
        this.loading = false;
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
    async onSelectAsCurrent(project) {
      if (project.isSelected)
        return;
      try {
        await utils_request.selectCurrentProject(project.projectId);
        common_vendor.index.__f__("log", "at pages/projects/index.vue:138", "[选择合集] 选中成功:", project.name);
        this.fetchProjects();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/projects/index.vue:141", "[选择合集] 选中失败:", err);
        common_vendor.index.showToast({ title: "选择合集失败", icon: "none" });
      }
    },
    onDeleteProject(project) {
      common_vendor.index.showModal({
        title: "删除确认",
        content: `确定要删除「${project.name}」吗？删除后不可恢复。`,
        confirmColor: "#b82e2e",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_request.deleteProject(project.projectId);
              common_vendor.index.__f__("log", "at pages/projects/index.vue:154", "[删除合集] 删除成功:", project.name);
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
              this.projects = this.projects.filter((p) => p.projectId !== project.projectId);
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/projects/index.vue:158", "[删除合集] 删除失败:", err);
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            }
          }
        }
      });
    },
    onRenameProject(project) {
      common_vendor.index.showModal({
        title: "修改合集名称",
        editable: true,
        placeholderText: "请输入新名称",
        content: project.name,
        confirmColor: "#2a6e44",
        success: async (res) => {
          if (res.confirm && res.content) {
            const newName = res.content.trim();
            if (!newName) {
              common_vendor.index.showToast({ title: "名称不能为空", icon: "none" });
              return;
            }
            if (newName === project.name)
              return;
            try {
              await utils_request.renameProject(project.projectId, newName);
              common_vendor.index.__f__("log", "at pages/projects/index.vue:182", "[改名合集] 改名成功:", newName);
              common_vendor.index.showToast({ title: "改名成功", icon: "success" });
              project.name = newName;
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/projects/index.vue:186", "[改名合集] 改名失败:", err);
              common_vendor.index.showToast({ title: "改名失败", icon: "none" });
            }
          }
        }
      });
    },
    onViewPoems(project) {
      common_vendor.index.navigateTo({
        url: `/pages/project-detail/index?projectId=${project.projectId}&name=${encodeURIComponent(project.name)}`
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
    c: !$data.loading && $data.projects.length === 0
  }, !$data.loading && $data.projects.length === 0 ? {
    d: common_vendor.p({
      type: "star",
      size: "48",
      color: "#2a6e44"
    })
  } : {}, {
    e: common_vendor.f($data.projects, (project, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(index + 1),
        b: project.isSelected ? 1 : "",
        c: common_vendor.t(project.name),
        d: project.isSelected
      }, project.isSelected ? {} : {}, {
        e: "46c4d245-2-" + i0,
        f: common_vendor.t(project.poemCount),
        g: "46c4d245-3-" + i0,
        h: common_vendor.t($options.formatDate(project.createdAt)),
        i: "46c4d245-4-" + i0,
        j: common_vendor.o(($event) => $options.onViewPoems(project), project.projectId),
        k: "46c4d245-5-" + i0,
        l: common_vendor.p({
          type: project.isSelected ? "checkmarkempty" : "flag",
          size: "16",
          color: project.isSelected ? "#999" : "#2a6e44"
        }),
        m: common_vendor.t(project.isSelected ? "已选中" : "选中"),
        n: project.isSelected ? 1 : "",
        o: project.isSelected ? 1 : "",
        p: common_vendor.o(($event) => $options.onSelectAsCurrent(project), project.projectId),
        q: "46c4d245-6-" + i0,
        r: common_vendor.o(($event) => $options.onRenameProject(project), project.projectId),
        s: "46c4d245-7-" + i0,
        t: common_vendor.o(($event) => $options.onDeleteProject(project), project.projectId),
        v: project.projectId,
        w: project.isSelected ? 1 : ""
      });
    }),
    f: common_vendor.p({
      type: "paperplane",
      size: "14",
      color: "#999"
    }),
    g: common_vendor.p({
      type: "calendar",
      size: "14",
      color: "#999"
    }),
    h: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    }),
    i: common_vendor.p({
      type: "compose",
      size: "16",
      color: "#e6a23c"
    }),
    j: common_vendor.p({
      type: "trash",
      size: "16",
      color: "#b82e2e"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/projects/index.js.map
