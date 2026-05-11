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
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      try {
        const data = await utils_request.getProjects();
        common_vendor.index.__f__("log", "at pages/projects/index.vue:85", "[获取学习合集] 成功:", data);
        this.projects = data || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/projects/index.vue:88", "[获取学习合集] 失败:", err);
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
      if (project.isSelected) {
        return;
      }
      try {
        await utils_request.selectCurrentProject(project.projectId);
        common_vendor.index.__f__("log", "at pages/projects/index.vue:111", "[选择合集] 选中成功:", project.name);
        this.fetchProjects();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/projects/index.vue:116", "[选择合集] 选中失败:", err);
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
              common_vendor.index.__f__("log", "at pages/projects/index.vue:129", "[删除合集] 删除成功:", project.name);
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
              this.projects = this.projects.filter((p) => p.projectId !== project.projectId);
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/projects/index.vue:134", "[删除合集] 删除失败:", err);
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
            if (newName === project.name) {
              return;
            }
            try {
              await utils_request.renameProject(project.projectId, newName);
              common_vendor.index.__f__("log", "at pages/projects/index.vue:161", "[改名合集] 改名成功:", newName);
              common_vendor.index.showToast({ title: "改名成功", icon: "success" });
              project.name = newName;
            } catch (err) {
              common_vendor.index.__f__("error", "at pages/projects/index.vue:166", "[改名合集] 改名失败:", err);
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
      type: "bookmark",
      size: "80",
      color: "#ccc"
    })
  } : {}, {
    e: common_vendor.f($data.projects, (project, k0, i0) => {
      return common_vendor.e({
        a: "46c4d245-2-" + i0,
        b: common_vendor.p({
          type: "star",
          size: "32",
          color: project.isSelected ? "#fff" : "#2a6e44"
        }),
        c: common_vendor.t(project.name),
        d: project.isSelected
      }, project.isSelected ? {} : {}, {
        e: common_vendor.t(project.poemCount),
        f: common_vendor.t($options.formatDate(project.createdAt)),
        g: "46c4d245-3-" + i0,
        h: common_vendor.o(($event) => $options.onViewPoems(project), project.projectId),
        i: common_vendor.t(project.isSelected ? "已选中" : "选中"),
        j: project.isSelected ? 1 : "",
        k: common_vendor.o(($event) => $options.onSelectAsCurrent(project), project.projectId),
        l: common_vendor.o(($event) => $options.onRenameProject(project), project.projectId),
        m: common_vendor.o(($event) => $options.onDeleteProject(project), project.projectId),
        n: project.projectId,
        o: project.isSelected ? 1 : ""
      });
    }),
    f: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/projects/index.js.map
