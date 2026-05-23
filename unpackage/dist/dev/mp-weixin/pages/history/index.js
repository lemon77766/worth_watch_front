"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      overview: [
        { num: 0, unit: "天", label: "累计研习" },
        { num: 0, unit: "首", label: "已学诗词" }
      ],
      history: [],
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false
    };
  },
  onLoad() {
    if (!common_vendor.index.getStorageSync("token")) {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录后查看研习历史",
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
    this.fetchHistory();
    this.fetchProgress();
  },
  methods: {
    async fetchProgress() {
      try {
        const data = await utils_request.getStudyProgress();
        if (data) {
          this.overview[0].num = data.studyDays || 0;
          this.overview[1].num = data.learnedCount || 0;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/history/index.vue:96", "获取研习进度失败", e);
      }
    },
    async fetchHistory() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const data = await utils_request.getStudyHistory({ page: this.page, pageSize: this.pageSize });
        if (data) {
          this.total = data.total || 0;
          const list = data.list || [];
          const grouped = {};
          const now = /* @__PURE__ */ new Date();
          const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
          list.forEach((item) => {
            const rawDate = item.studiedAt ? item.studiedAt.split(/[T ]/)[0] : "未知日期";
            let displayDate = rawDate;
            if (rawDate === todayStr) {
              const m = parseInt(rawDate.split("-")[1]);
              const d = parseInt(rawDate.split("-")[2]);
              displayDate = `今天 · ${m}月${d}日`;
            } else if (rawDate === yesterdayStr) {
              const m = parseInt(rawDate.split("-")[1]);
              const d = parseInt(rawDate.split("-")[2]);
              displayDate = `昨天 · ${m}月${d}日`;
            } else {
              const m = parseInt(rawDate.split("-")[1]);
              const d = parseInt(rawDate.split("-")[2]);
              displayDate = `${m}月${d}日`;
            }
            if (!grouped[rawDate]) {
              grouped[rawDate] = { date: displayDate, items: [] };
            }
            grouped[rawDate].items.push({
              poemId: item.poemId,
              title: item.title,
              author: item.author,
              dynasty: item.dynasty,
              excerpt: item.excerpt,
              score: item.score,
              studiedAt: item.studiedAt,
              iconBg: "#e6f2e9",
              iconColor: "#2a6e44",
              tagBg: "#2a6e44",
              tagColor: "#fff",
              mode: "已学完"
            });
          });
          if (this.page === 1) {
            this.history = Object.values(grouped);
          } else {
            this.history = [...this.history, ...Object.values(grouped)];
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/history/index.vue:155", "获取研习历史失败", e);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (this.history.length < this.total) {
        this.page++;
        this.fetchHistory();
      }
    },
    goDetail(item) {
      if (item.poemId) {
        common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${item.poemId}` });
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
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.f($data.overview, (o, k0, i0) => {
      return {
        a: common_vendor.t(o.num),
        b: common_vendor.t(o.unit),
        c: common_vendor.t(o.label),
        d: o.label
      };
    }),
    d: common_vendor.f($data.history, (group, k0, i0) => {
      return {
        a: common_vendor.t(group.date),
        b: common_vendor.t(group.items.length),
        c: common_vendor.f(group.items, (item, k1, i1) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.author),
            c: common_vendor.t(item.dynasty),
            d: item.poemId,
            e: common_vendor.o(($event) => $options.goDetail(item), item.poemId)
          };
        }),
        d: group.date
      };
    }),
    e: $data.history.length === 0 && !$data.loading
  }, $data.history.length === 0 && !$data.loading ? {} : {}, {
    f: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/index.js.map
