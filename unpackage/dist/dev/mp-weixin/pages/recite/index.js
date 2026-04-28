"use strict";
const common_vendor = require("../../common/vendor.js");
const POEMS = {
  chunxiao: {
    title: "春 晓",
    dynasty: "唐",
    author: "孟浩然",
    lines: ["春眠不觉晓，", "处处闻啼鸟。", "夜来风雨声，", "花落知多少。"]
  },
  lushan: {
    title: "望庐山瀑布",
    dynasty: "唐",
    author: "李白",
    lines: ["日照香炉生紫烟，", "遥看瀑布挂前川。", "飞流直下三千尺，", "疑是银河落九天。"]
  }
};
const _sfc_main = {
  data() {
    return {
      playing: false,
      currentLine: 0,
      progress: 0,
      poem: POEMS.chunxiao,
      timer: null
    };
  },
  onLoad(options) {
    if (options && options.id && POEMS[options.id]) {
      this.poem = POEMS[options.id];
    }
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing;
      if (this.playing) {
        this.timer = setInterval(() => {
          this.progress = Math.min(this.progress + 1, 100);
          this.currentLine = Math.min(Math.floor(this.progress / 25), this.poem.lines.length - 1);
          if (this.progress >= 100) {
            this.playing = false;
            clearInterval(this.timer);
          }
        }, 150);
      } else {
        clearInterval(this.timer);
      }
    },
    prev() {
      this.currentLine = Math.max(0, this.currentLine - 1);
      this.progress = this.currentLine * 25;
    },
    next() {
      this.currentLine = Math.min(this.poem.lines.length - 1, this.currentLine + 1);
      this.progress = this.currentLine * 25;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
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
      color: "rgba(255,255,255,0.7)"
    }),
    b: common_vendor.o(($event) => common_vendor.index.navigateBack()),
    c: common_vendor.t($data.poem.title),
    d: common_vendor.t($data.poem.dynasty),
    e: common_vendor.t($data.poem.author),
    f: common_vendor.f($data.poem.lines, (line, i, i0) => {
      return {
        a: common_vendor.t(line),
        b: i,
        c: i === $data.currentLine ? 1 : "",
        d: i !== $data.currentLine ? 1 : ""
      };
    }),
    g: $data.progress + "%",
    h: common_vendor.o((...args) => $options.prev && $options.prev(...args)),
    i: !$data.playing
  }, !$data.playing ? {} : {}, {
    j: common_vendor.o((...args) => $options.togglePlay && $options.togglePlay(...args)),
    k: common_vendor.o((...args) => $options.next && $options.next(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/recite/index.js.map
