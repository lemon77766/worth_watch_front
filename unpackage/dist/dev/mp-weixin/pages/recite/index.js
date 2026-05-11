"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      playing: false,
      currentLine: 0,
      progress: 0,
      currentTime: 0,
      duration: 0,
      isDragging: false,
      poem: {
        poemId: null,
        title: "",
        dynasty: "",
        author: "",
        lines: []
      },
      audioCtx: null,
      vcn: "",
      vcnOptions: [],
      audioLoading: false,
      showVcnPanel: false
    };
  },
  computed: {
    currentVcnLabel() {
      const cur = this.vcnOptions.find((v) => v.value === this.vcn);
      return cur ? cur.label : "音色";
    }
  },
  onLoad(options) {
    this.fetchVoices();
    if (options && options.id) {
      this.fetchPoem(options.id);
    }
  },
  methods: {
    async fetchVoices() {
      try {
        const data = await utils_request.getTtsVoices();
        if (data && data.length) {
          this.vcnOptions = data.map((v) => ({ value: v.code, label: v.name, desc: v.description }));
          if (!this.vcn && this.vcnOptions.length) {
            const xiaolu = this.vcnOptions.find((v) => v.label === "小露");
            this.vcn = xiaolu ? xiaolu.value : this.vcnOptions[0].value;
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/recite/index.vue:139", "获取音色列表失败", e);
      }
    },
    async fetchPoem(id) {
      try {
        const data = await utils_request.getPoemDetail(id);
        if (data) {
          const lines = (data.content || "").replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
          this.poem = {
            poemId: data.poemId || id,
            title: data.title || "",
            dynasty: data.dynasty || "",
            author: data.author || "",
            lines
          };
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/recite/index.vue:156", "获取诗词失败", e);
      }
    },
    async playTts() {
      if (!this.poem.poemId)
        return;
      this.audioLoading = true;
      try {
        this.stopAudio();
        const token = common_vendor.index.getStorageSync("token");
        const ttsUrl = `${utils_request.BASE_URL}/api/poems/${this.poem.poemId}/tts?vcn=${this.vcn}`;
        const downloadRes = await new Promise((resolve, reject) => {
          common_vendor.index.downloadFile({
            url: ttsUrl,
            header: { Authorization: token ? `Bearer ${token}` : "" },
            success: resolve,
            fail: reject
          });
        });
        if (downloadRes.statusCode !== 200) {
          common_vendor.index.showToast({ title: "获取音频失败", icon: "none" });
          this.audioLoading = false;
          return;
        }
        this.audioCtx = common_vendor.index.createInnerAudioContext();
        this.audioCtx.src = downloadRes.tempFilePath;
        this.audioCtx.autoplay = true;
        this.audioCtx.onPlay(() => {
          this.playing = true;
          this.audioLoading = false;
        });
        this.audioCtx.onTimeUpdate(() => {
          if (this.isDragging)
            return;
          const cur = this.audioCtx.currentTime;
          const dur = this.audioCtx.duration;
          if (dur > 0) {
            this.currentTime = cur;
            this.duration = dur;
            this.progress = Math.min(100, cur / dur * 100);
            const totalLines = this.poem.lines.length;
            if (totalLines > 0) {
              const lineIdx = Math.floor(cur / dur * totalLines);
              this.currentLine = Math.min(lineIdx, totalLines - 1);
            }
          }
        });
        this.audioCtx.onEnded(() => {
          this.playing = false;
          this.progress = 100;
          this.currentLine = Math.max(0, this.poem.lines.length - 1);
        });
        this.audioCtx.onPause(() => {
          this.playing = false;
        });
        this.audioCtx.onError((err) => {
          common_vendor.index.__f__("error", "at pages/recite/index.vue:216", "TTS播放失败", err);
          this.playing = false;
          this.audioLoading = false;
          common_vendor.index.showToast({ title: "播放失败", icon: "none" });
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/recite/index.vue:222", "TTS请求失败", e);
        this.audioLoading = false;
      }
    },
    // ---- 进度条拖拽 ----
    onProgressTouchStart(e) {
      this.isDragging = true;
      this._trackRect = null;
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".progress-track").boundingClientRect((rect) => {
        if (rect)
          this._trackRect = rect;
        this._applyTouchProgress(e);
      }).exec();
    },
    onProgressTouchMove(e) {
      if (!this.isDragging)
        return;
      this._applyTouchProgress(e);
    },
    onProgressTouchEnd() {
      if (!this.isDragging)
        return;
      this.isDragging = false;
      if (this.audioCtx && this.duration > 0) {
        const seekTime = this.progress / 100 * this.duration;
        this.audioCtx.seek(seekTime);
        this.currentTime = seekTime;
      }
    },
    _applyTouchProgress(e) {
      if (!this._trackRect)
        return;
      const touch = e.touches[0] || e.changedTouches[0];
      if (!touch)
        return;
      const x = touch.clientX - this._trackRect.left;
      const percent = Math.max(0, Math.min(100, x / this._trackRect.width * 100));
      this.progress = percent;
      const totalLines = this.poem.lines.length;
      if (totalLines > 0) {
        const lineIdx = Math.floor(percent / 100 * totalLines);
        this.currentLine = Math.min(lineIdx, totalLines - 1);
      }
      if (this.duration > 0) {
        this.currentTime = percent / 100 * this.duration;
      }
    },
    // ---- 播放控制 ----
    stopAudio() {
      if (this.audioCtx) {
        this.audioCtx.stop();
        this.audioCtx.destroy();
        this.audioCtx = null;
      }
      this.playing = false;
      this.progress = 0;
      this.currentTime = 0;
      this.duration = 0;
      this.currentLine = 0;
    },
    togglePlay() {
      if (this.audioLoading)
        return;
      if (this.playing) {
        if (this.audioCtx) {
          this.audioCtx.pause();
        }
      } else if (this.audioCtx && this.duration > 0) {
        this.audioCtx.play();
        this.playing = true;
      } else {
        this.playTts();
      }
    },
    onVcnChange(vcn) {
      this.vcn = vcn;
      this.showVcnPanel = false;
      if (this.playing || this.audioCtx) {
        this.stopAudio();
        this.playTts();
      }
    },
    seekToLine(lineIdx) {
      const totalLines = this.poem.lines.length;
      if (totalLines === 0)
        return;
      this.currentLine = lineIdx;
      if (totalLines > 1) {
        this.progress = lineIdx / (totalLines - 1) * 100;
      } else {
        this.progress = 0;
      }
      if (this.audioCtx && this.duration > 0) {
        const seekTime = lineIdx / totalLines * this.duration;
        this.audioCtx.seek(seekTime);
        this.currentTime = seekTime;
        if (!this.playing) {
          this.audioCtx.play();
          this.playing = true;
        }
      }
    },
    prev() {
      const totalLines = this.poem.lines.length;
      if (totalLines === 0)
        return;
      const newLine = Math.max(0, this.currentLine - 1);
      this.currentLine = newLine;
      this.progress = totalLines > 1 ? newLine / (totalLines - 1) * 100 : 0;
      if (this.audioCtx && this.duration > 0) {
        const seekTime = newLine / totalLines * this.duration;
        this.audioCtx.seek(seekTime);
        this.currentTime = seekTime;
      }
    },
    next() {
      const totalLines = this.poem.lines.length;
      if (totalLines === 0)
        return;
      const newLine = Math.min(totalLines - 1, this.currentLine + 1);
      this.currentLine = newLine;
      this.progress = totalLines > 1 ? newLine / (totalLines - 1) * 100 : 100;
      if (this.audioCtx && this.duration > 0) {
        const seekTime = newLine / totalLines * this.duration;
        this.audioCtx.seek(seekTime);
        this.currentTime = seekTime;
      }
    },
    formatTime(seconds) {
      if (!seconds || isNaN(seconds))
        return "0:00";
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec < 10 ? "0" + sec : sec}`;
    }
  },
  beforeDestroy() {
    this.stopAudio();
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
        d: i !== $data.currentLine ? 1 : "",
        e: common_vendor.o(($event) => $options.seekToLine(i), i)
      };
    }),
    g: common_vendor.t($options.formatTime($data.currentTime)),
    h: common_vendor.t($options.formatTime($data.duration)),
    i: $data.progress + "%",
    j: $data.progress + "%",
    k: common_vendor.o((...args) => $options.onProgressTouchStart && $options.onProgressTouchStart(...args)),
    l: common_vendor.o((...args) => $options.onProgressTouchMove && $options.onProgressTouchMove(...args)),
    m: common_vendor.o((...args) => $options.onProgressTouchEnd && $options.onProgressTouchEnd(...args)),
    n: common_vendor.o((...args) => $options.prev && $options.prev(...args)),
    o: $data.audioLoading
  }, $data.audioLoading ? {} : !$data.playing ? {} : {}, {
    p: !$data.playing,
    q: common_vendor.o((...args) => $options.togglePlay && $options.togglePlay(...args)),
    r: common_vendor.o((...args) => $options.next && $options.next(...args)),
    s: common_vendor.t($options.currentVcnLabel),
    t: $data.showVcnPanel ? 1 : "",
    v: common_vendor.o(($event) => $data.showVcnPanel = !$data.showVcnPanel),
    w: $data.showVcnPanel
  }, $data.showVcnPanel ? {
    x: common_vendor.f($data.vcnOptions, (v, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(v.label),
        b: $data.vcn === v.value ? 1 : "",
        c: v.desc
      }, v.desc ? {
        d: common_vendor.t(v.desc)
      } : {}, {
        e: $data.vcn === v.value
      }, $data.vcn === v.value ? {} : {}, {
        f: v.value,
        g: $data.vcn === v.value ? 1 : "",
        h: common_vendor.o(($event) => $options.onVcnChange(v.value), v.value)
      });
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/recite/index.js.map
