"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    const now = /* @__PURE__ */ new Date();
    return {
      streak: 12,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      todayYear: now.getFullYear(),
      todayMonth: now.getMonth() + 1,
      today: now.getDate(),
      // 模拟已打卡日期（1~11号）
      checkedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
  methods: {
    prevMonth() {
      if (this.month === 1) {
        this.month = 12;
        this.year--;
      } else
        this.month--;
    },
    nextMonth() {
      if (this.month === 12) {
        this.month = 1;
        this.year++;
      } else
        this.month++;
    },
    doCheckin() {
      if (this.todayChecked)
        return;
      this.checkedDays.push(this.today);
      this.streak++;
      common_vendor.index.showToast({ title: "打卡成功！", icon: "success" });
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
        e: $data.checkedDays.includes(d) ? 1 : "",
        f: d === $data.today && $data.month === $data.todayMonth && $data.year === $data.todayYear ? 1 : "",
        g: !$data.checkedDays.includes(d) && !(d === $data.today && $data.month === $data.todayMonth && $data.year === $data.todayYear) ? 1 : ""
      } : {}, {
        h: i
      });
    }),
    m: common_vendor.f($data.rewards, (r, k0, i0) => {
      return {
        a: common_vendor.t(r.days),
        b: common_vendor.t(r.desc),
        c: r.days,
        d: $data.streak >= r.days && $data.streak < ($data.rewards[$data.rewards.indexOf(r) + 1] ? $data.rewards[$data.rewards.indexOf(r) + 1].days : 9999) ? 1 : ""
      };
    }),
    n: common_vendor.t($options.todayChecked ? "今日已打卡 ✓" : "立即打卡签到"),
    o: $options.todayChecked ? 1 : "",
    p: common_vendor.o((...args) => $options.doCheckin && $options.doCheckin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkin/index.js.map
