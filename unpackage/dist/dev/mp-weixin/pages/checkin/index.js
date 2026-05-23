"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    const now = /* @__PURE__ */ new Date();
    return {
      streak: 0,
      totalDays: 0,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      todayYear: now.getFullYear(),
      todayMonth: now.getMonth() + 1,
      today: now.getDate(),
      checkedDays: [],
      poemDetails: {},
      selectedDay: null,
      selectedPoems: [],
      weeks: ["日", "一", "二", "三", "四", "五", "六"],
      rewards: [
        { days: 7, desc: "50积分" },
        { days: 15, desc: "100积分" },
        { days: 30, desc: "勋章" }
      ]
    };
  },
  computed: {
    todayChecked() {
      return this.month === this.todayMonth && this.year === this.todayYear && this.checkedDays.includes(this.today);
    },
    calDays() {
      const firstDay = new Date(this.year, this.month - 1, 1).getDay();
      const daysInMonth = new Date(this.year, this.month, 0).getDate();
      const cells = [];
      for (let i = 0; i < firstDay; i++)
        cells.push(null);
      for (let d = 1; d <= daysInMonth; d++)
        cells.push(d);
      while (cells.length % 7 !== 0)
        cells.push(null);
      return cells;
    }
  },
  onLoad() {
    if (!common_vendor.index.getStorageSync("token")) {
      common_vendor.index.showModal({
        title: "提示",
        content: "请先登录后使用打卡功能",
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
  },
  methods: {
    async fetchHistory() {
      try {
        const data = await utils_request.getCheckInHistory(this.year, this.month);
        if (data) {
          this.streak = data.continuousDays || 0;
          this.totalDays = data.totalDays || 0;
          const dates = data.checkedDates || [];
          this.checkedDays = dates.map((d) => {
            const parts = d.split("-");
            return parseInt(parts[2]);
          });
          this.poemDetails = data.poemDetails || {};
          this.selectedDay = null;
          this.selectedPoems = [];
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/checkin/index.vue:209", "获取打卡历史失败", e);
      }
    },
    prevMonth() {
      if (this.month === 1) {
        this.month = 12;
        this.year--;
      } else
        this.month--;
      this.fetchHistory();
    },
    nextMonth() {
      if (this.month === 12) {
        this.month = 1;
        this.year++;
      } else
        this.month++;
      this.fetchHistory();
    },
    onDayClick(d) {
      if (!d || !this.checkedDays.includes(d))
        return;
      this.selectedDay = d;
      const key = `${this.year}-${String(this.month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      this.selectedPoems = this.poemDetails[key] || [];
    },
    async doCheckin() {
      if (this.todayChecked)
        return;
      try {
        await utils_request.checkIn();
        this.checkedDays.push(this.today);
        this.streak++;
        this.totalDays++;
        common_vendor.index.showToast({ title: "打卡成功！", icon: "success" });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/checkin/index.vue:237", "打卡失败", e);
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
      type: "left",
      size: "20",
      color: "#2a6e44"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.p({
      type: "redo",
      size: "20",
      color: "#2a6e44"
    }),
    d: common_vendor.t($data.streak),
    e: common_vendor.t($data.year),
    f: common_vendor.t($data.month),
    g: common_vendor.p({
      type: "left",
      size: "16",
      color: "#2a6e44"
    }),
    h: common_vendor.o((...args) => $options.prevMonth && $options.prevMonth(...args)),
    i: common_vendor.p({
      type: "right",
      size: "16",
      color: "#2a6e44"
    }),
    j: common_vendor.o((...args) => $options.nextMonth && $options.nextMonth(...args)),
    k: common_vendor.f($data.weeks, (w, k0, i0) => {
      return {
        a: common_vendor.t(w),
        b: w
      };
    }),
    l: common_vendor.f($options.calDays, (d, i, i0) => {
      return common_vendor.e({
        a: d
      }, d ? {
        b: common_vendor.t(d),
        c: $data.checkedDays.includes(d) ? 1 : "",
        d: d === $data.today && $data.month === $data.todayMonth && $data.year === $data.todayYear ? 1 : "",
        e: $data.selectedDay === d ? 1 : "",
        f: $data.checkedDays.includes(d) ? 1 : "",
        g: d === $data.today && $data.month === $data.todayMonth && $data.year === $data.todayYear ? 1 : "",
        h: !$data.checkedDays.includes(d) && !(d === $data.today && $data.month === $data.todayMonth && $data.year === $data.todayYear) ? 1 : "",
        i: $data.selectedDay === d ? 1 : "",
        j: common_vendor.o(($event) => $options.onDayClick(d), i)
      } : {}, {
        k: i
      });
    }),
    m: $data.selectedDay
  }, $data.selectedDay ? common_vendor.e({
    n: common_vendor.t($data.month),
    o: common_vendor.t($data.selectedDay),
    p: common_vendor.p({
      type: "closeempty",
      size: "18",
      color: "#999"
    }),
    q: common_vendor.o(($event) => {
      $data.selectedDay = null;
      $data.selectedPoems = [];
    }),
    r: $data.selectedPoems.length > 0
  }, $data.selectedPoems.length > 0 ? {
    s: common_vendor.f($data.selectedPoems, (p, k0, i0) => {
      return {
        a: "394b4c50-5-" + i0,
        b: common_vendor.t(p.title),
        c: common_vendor.t(p.author),
        d: "394b4c50-6-" + i0,
        e: p.poemId,
        f: common_vendor.o(($event) => $options.goToDetail(p.poemId), p.poemId)
      };
    }),
    t: common_vendor.p({
      type: "bookmarks",
      size: "20",
      color: "#2a6e44"
    }),
    v: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    })
  } : {}) : {}, {
    w: common_vendor.t($options.todayChecked ? "今日已打卡 ✓" : "立即打卡签到"),
    x: $options.todayChecked ? 1 : "",
    y: common_vendor.o((...args) => $options.doCheckin && $options.doCheckin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkin/index.js.map
