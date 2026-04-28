"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      overview: [
        { num: 128, unit: "天", label: "累计研习" },
        { num: 412, unit: "首", label: "已学诗词" },
        { num: 36, unit: "小时", label: "研习时长" }
      ],
      history: [
        {
          date: "今天 · 4月23日",
          items: [
            { title: "春晓", author: "孟浩然", type: "五言绝句", mode: "背诵", duration: "8分钟", iconBg: "#e6f2e9", iconColor: "#2a6e44", tagBg: "#e6f2e9", tagColor: "#2a6e44", id: "chunxiao" },
            { title: "望庐山瀑布", author: "李白", type: "七言绝句", mode: "赏析", duration: "12分钟", iconBg: "#fdecea", iconColor: "#b82e2e", tagBg: "#2a6e44", tagColor: "#fff", id: "lushan" }
          ]
        },
        {
          date: "昨天 · 4月22日",
          items: [
            { title: "静夜思", author: "李白", type: "五言绝句", mode: "背诵", duration: "6分钟", iconBg: "#e6f2e9", iconColor: "#2a6e44", tagBg: "#e6f2e9", tagColor: "#2a6e44", id: "chunxiao" },
            { title: "定风波", author: "苏轼", type: "词", mode: "吟诵", duration: "15分钟", iconBg: "#fef3e6", iconColor: "#e07820", tagBg: "#fef3e6", tagColor: "#e07820", id: "chunxiao" },
            { title: "鹿柴", author: "王维", type: "五言绝句", mode: "赏析", duration: "10分钟", iconBg: "#fdecea", iconColor: "#b82e2e", tagBg: "#2a6e44", tagColor: "#fff", id: "chunxiao" }
          ]
        },
        {
          date: "4月21日",
          items: [
            { title: "水调歌头", author: "苏轼", type: "词", mode: "背诵", duration: "20分钟", iconBg: "#e6f2e9", iconColor: "#2a6e44", tagBg: "#e6f2e9", tagColor: "#2a6e44", id: "chunxiao" },
            { title: "春望", author: "杜甫", type: "五言律诗", mode: "背诵", duration: "9分钟", iconBg: "#e6f2e9", iconColor: "#2a6e44", tagBg: "#e6f2e9", tagColor: "#2a6e44", id: "chunxiao" }
          ]
        }
      ]
    };
  },
  methods: {
    goDetail(item) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${item.id}` });
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
            a: "b1d34d02-1-" + i0 + "-" + i1,
            b: common_vendor.p({
              type: "bookmarks",
              size: "20",
              color: item.iconColor
            }),
            c: item.iconBg,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.mode),
            f: item.tagColor,
            g: item.tagBg,
            h: common_vendor.t(item.author),
            i: common_vendor.t(item.type),
            j: common_vendor.t(item.duration),
            k: item.title,
            l: common_vendor.o(($event) => $options.goDetail(item), item.title)
          };
        }),
        d: group.date
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/index.js.map
