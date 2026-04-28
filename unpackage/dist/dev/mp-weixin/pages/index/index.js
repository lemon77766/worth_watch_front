"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  computed: {
    navTitle() {
      const map = { home: "值得看么", library: "值得看么", study: "研习", mine: "值得看么" };
      return map[this.currentTab] || "值得看么";
    }
  },
  data() {
    return {
      userInfo: null,
      dailyPoem: null,
      currentTab: "home",
      poemsList: [],
      poemsPage: 1,
      poemsPageSize: 20,
      poemsLoading: false,
      showSearch: false,
      searchKeyword: "",
      searchResults: [],
      searched: false,
      authors: [
        { name: "李白", title: "诗仙" },
        { name: "杜甫", title: "诗圣" },
        { name: "苏轼", title: "东坡" }
      ],
      libTabs: ["朝代", "体裁", "作者"],
      dynastyTabs: ["全部", "唐代", "宋代", "先秦", "近现代", "魏晋", "五代", "元代", "两汉", "南北朝", "清代", "明代", "金朝", "隋代"],
      categoryTabs: ["全部", "诗", "词", "曲", "文"],
      authorTabs: ["全部", "李白", "苏轼", "杜甫", "白居易", "王维", "辛弃疾", "李清照", "陆游"],
      activeDynasty: "全部",
      activeCategory: "全部",
      activeAuthor: "全部",
      activeLibTab: "朝代",
      activeDynasty: "全部",
      activeCategory: "全部",
      menuItems: [
        { label: "我的收藏", icon: "bookmark", iconColor: "#2a6e44", iconBg: "#e6f2e9" },
        { label: "研习历史", icon: "reload", iconColor: "#b82e2e", iconBg: "#fdecea" },
        { label: "每日打卡", icon: "calendar", iconColor: "#e07820", iconBg: "#fef3e6" },
        { label: "系统设置", icon: "gear", iconColor: "#888", iconBg: "#f0f0f0" },
        { label: "隐私协议", icon: "locked", iconColor: "#888", iconBg: "#f0f0f0" }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:467", "[首页] 切换Tab:", newTab);
      if (newTab === "library" && this.poemsList.length === 0) {
        this.fetchPoems();
      }
    }
  },
  onLoad() {
    this.fetchUserProfile();
    this.fetchDailyPoem();
  },
  onShow() {
    this.fetchUserProfile();
  },
  computed: {
    navTitle() {
      const map = { home: "值得看么", library: "值得看么", study: "研习", mine: "值得看么" };
      return map[this.currentTab] || "值得看么";
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        const data = await utils_request.getUserProfile();
        common_vendor.index.__f__("log", "at pages/index/index.vue:491", "[获取用户信息] 成功:", data);
        this.userInfo = {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl
        };
        common_vendor.index.setStorageSync("userInfo", this.userInfo);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:499", "[获取用户信息] 失败:", err);
        const localUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (localUserInfo) {
          this.userInfo = localUserInfo;
        }
      }
    },
    async fetchDailyPoem() {
      try {
        const data = await utils_request.getDailyPoem();
        common_vendor.index.__f__("log", "at pages/index/index.vue:510", "[获取每日推荐] 成功:", data);
        this.dailyPoem = data;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:513", "[获取每日推荐] 失败:", err);
      }
    },
    async fetchPoems() {
      if (this.poemsLoading)
        return;
      this.poemsLoading = true;
      try {
        const params = {
          page: this.poemsPage,
          pageSize: this.poemsPageSize
        };
        if (this.activeLibTab === "朝代" && this.activeDynasty !== "全部") {
          params.dynasty = this.activeDynasty;
        }
        if (this.activeLibTab === "体裁" && this.activeCategory !== "全部") {
          params.category = this.activeCategory;
        }
        if (this.activeLibTab === "作者" && this.activeAuthor !== "全部") {
          params.q = this.activeAuthor;
        }
        common_vendor.index.__f__("log", "at pages/index/index.vue:534", "[获取诗词列表] 参数:", params);
        const data = await utils_request.getPoems(params);
        common_vendor.index.__f__("log", "at pages/index/index.vue:536", "[获取诗词列表] 成功:", data);
        this.poemsList = data.list || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:539", "[获取诗词列表] 失败:", err);
      } finally {
        this.poemsLoading = false;
      }
    },
    openSearch() {
      this.searchKeyword = "";
      this.searchResults = [];
      this.searched = false;
      this.showSearch = true;
    },
    onLibTabChange(tab) {
      this.activeLibTab = tab;
      this.poemsPage = 1;
      this.poemsList = [];
      this.fetchPoems();
    },
    onDynastyChange(dynasty) {
      this.activeDynasty = dynasty;
      this.poemsPage = 1;
      this.poemsList = [];
      this.fetchPoems();
    },
    onCategoryChange(category) {
      this.activeCategory = category;
      this.poemsPage = 1;
      this.poemsList = [];
      this.fetchPoems();
    },
    onAuthorChange(author) {
      this.activeAuthor = author;
      this.poemsPage = 1;
      this.poemsList = [];
      this.fetchPoems();
    },
    async doSearch() {
      if (!this.searchKeyword.trim())
        return;
      try {
        const data = await utils_request.searchPoems({ q: this.searchKeyword, page: 1, pageSize: 50 });
        common_vendor.index.__f__("log", "at pages/index/index.vue:578", "[搜索诗词] 成功:", data);
        this.searchResults = data.list || [];
        this.searched = true;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:582", "[搜索诗词] 失败:", err);
        this.searchResults = [];
      }
    },
    goToDetail(poemId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/index?id=${poemId}` });
    },
    onMenu(item) {
      if (item.label === "系统设置") {
        common_vendor.index.navigateTo({ url: "/pages/settings/index" });
        return;
      }
      if (item.label === "隐私协议") {
        common_vendor.index.navigateTo({ url: "/pages/privacy/index" });
        return;
      }
      if (item.label === "每日打卡") {
        common_vendor.index.navigateTo({ url: "/pages/checkin/index" });
        return;
      }
      if (item.label === "我的收藏") {
        common_vendor.index.navigateTo({ url: "/pages/favorites/index" });
        return;
      }
      if (item.label === "研习历史") {
        common_vendor.index.navigateTo({ url: "/pages/history/index" });
        return;
      }
      common_vendor.index.showToast({ title: item.label, icon: "none" });
    },
    onLogout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm)
            common_vendor.index.reLaunch({ url: "/pages/login/index" });
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
    a: $data.showSearch
  }, $data.showSearch ? common_vendor.e({
    b: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    c: $data.searchKeyword,
    d: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    e: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    f: common_vendor.o(() => {
    }),
    g: !$data.searched
  }, !$data.searched ? {} : $data.searchResults.length > 0 ? {
    i: common_vendor.f($data.searchResults, (poem, k0, i0) => {
      return {
        a: common_vendor.t(poem.title),
        b: common_vendor.t(poem.excerpt),
        c: common_vendor.t(poem.author),
        d: common_vendor.t(poem.dynasty),
        e: poem.poemId,
        f: common_vendor.o(($event) => {
          $options.goToDetail(poem.poemId);
          $data.showSearch = false;
        }, poem.poemId)
      };
    })
  } : $data.searched && $data.searchResults.length === 0 ? {} : {}, {
    h: $data.searchResults.length > 0,
    j: $data.searched && $data.searchResults.length === 0,
    k: common_vendor.o(($event) => $data.showSearch = false)
  }) : {}, {
    l: $data.userInfo && $data.userInfo.avatarUrl
  }, $data.userInfo && $data.userInfo.avatarUrl ? {
    m: $data.userInfo.avatarUrl
  } : {}, {
    n: common_vendor.o($options.openSearch),
    o: common_vendor.p({
      type: "search",
      size: "24",
      color: "#2a6e44"
    }),
    p: common_vendor.t($options.navTitle),
    q: $data.currentTab === "home"
  }, $data.currentTab === "home" ? common_vendor.e({
    r: $data.dailyPoem
  }, $data.dailyPoem ? {
    s: common_vendor.t($data.dailyPoem.date),
    t: common_vendor.t($data.dailyPoem.title),
    v: common_vendor.t($data.dailyPoem.author),
    w: common_vendor.t($data.dailyPoem.dynasty),
    x: common_vendor.f(($data.dailyPoem.content || "").split("\n"), (line, index, i0) => {
      return {
        a: common_vendor.t(line),
        b: index
      };
    }),
    y: common_vendor.o(($event) => $options.goToDetail($data.dailyPoem.poemId)),
    z: "url(" + $data.dailyPoem.coverImage + ")"
  } : {}, {
    A: common_vendor.p({
      type: "right",
      size: "13",
      color: "#2a6e44"
    }),
    B: common_vendor.p({
      type: "bookmarks",
      size: "28",
      color: "#2a6e44"
    }),
    C: common_vendor.p({
      type: "heart",
      size: "28",
      color: "#b82e2e"
    }),
    D: common_vendor.f($data.authors, (a, k0, i0) => {
      return {
        a: common_vendor.t(a.name),
        b: common_vendor.t(a.title),
        c: a.name
      };
    }),
    E: common_vendor.p({
      type: "right",
      size: "22",
      color: "#fff"
    })
  }) : {}, {
    F: $data.currentTab === "library"
  }, $data.currentTab === "library" ? common_vendor.e({
    G: common_vendor.f($data.libTabs, (t, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(t),
        b: $data.activeLibTab === t
      }, $data.activeLibTab === t ? {} : {}, {
        c: t,
        d: $data.activeLibTab === t ? 1 : "",
        e: common_vendor.o(($event) => $options.onLibTabChange(t), t)
      });
    }),
    H: $data.activeLibTab === "朝代"
  }, $data.activeLibTab === "朝代" ? {
    I: common_vendor.f($data.dynastyTabs, (d, k0, i0) => {
      return {
        a: common_vendor.t(d),
        b: d,
        c: $data.activeDynasty === d ? 1 : "",
        d: common_vendor.o(($event) => $options.onDynastyChange(d), d)
      };
    })
  } : {}, {
    J: $data.activeLibTab === "体裁"
  }, $data.activeLibTab === "体裁" ? {
    K: common_vendor.f($data.categoryTabs, (c, k0, i0) => {
      return {
        a: common_vendor.t(c),
        b: c,
        c: $data.activeCategory === c ? 1 : "",
        d: common_vendor.o(($event) => $options.onCategoryChange(c), c)
      };
    })
  } : {}, {
    L: $data.activeLibTab === "作者"
  }, $data.activeLibTab === "作者" ? {
    M: common_vendor.f($data.authorTabs, (a, k0, i0) => {
      return {
        a: common_vendor.t(a),
        b: a,
        c: $data.activeAuthor === a ? 1 : "",
        d: common_vendor.o(($event) => $options.onAuthorChange(a), a)
      };
    })
  } : {}, {
    N: common_vendor.f($data.poemsList, (poem, k0, i0) => {
      return {
        a: common_vendor.t(poem.dynasty),
        b: common_vendor.t(poem.dynasty),
        c: common_vendor.t(poem.title),
        d: common_vendor.t(poem.excerpt),
        e: common_vendor.t(poem.author),
        f: poem.poemId,
        g: common_vendor.o(($event) => $options.goToDetail(poem.poemId), poem.poemId)
      };
    }),
    O: $data.poemsLoading
  }, $data.poemsLoading ? {} : {}, {
    P: !$data.poemsLoading && $data.poemsList.length === 0
  }, !$data.poemsLoading && $data.poemsList.length === 0 ? {} : {}) : {}, {
    Q: $data.currentTab === "study"
  }, $data.currentTab === "study" ? {
    R: common_vendor.p({
      type: "bookmarks",
      size: "26",
      color: "#2a6e44"
    }),
    S: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    }),
    T: common_vendor.p({
      type: "bookmarks",
      size: "26",
      color: "#2a6e44"
    }),
    U: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    })
  } : {}, {
    V: $data.currentTab === "mine"
  }, $data.currentTab === "mine" ? common_vendor.e({
    W: $data.userInfo && $data.userInfo.avatarUrl
  }, $data.userInfo && $data.userInfo.avatarUrl ? {
    X: $data.userInfo.avatarUrl
  } : {}, {
    Y: common_vendor.t($data.userInfo && $data.userInfo.nickname || "未设置昵称"),
    Z: common_vendor.f($data.menuItems, (item, k0, i0) => {
      return {
        a: "76214786-9-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "22",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: "76214786-10-" + i0,
        f: item.label,
        g: common_vendor.o(($event) => $options.onMenu(item), item.label)
      };
    }),
    aa: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    }),
    ab: common_vendor.p({
      type: "redo",
      size: "18",
      color: "#b82e2e"
    }),
    ac: common_vendor.o((...args) => $options.onLogout && $options.onLogout(...args))
  }) : {}, {
    ad: $data.currentTab === "home"
  }, $data.currentTab === "home" ? {
    ae: common_vendor.p({
      type: "home",
      size: "22",
      color: "#fff"
    })
  } : {
    af: common_vendor.p({
      type: "home",
      size: "24",
      color: "#999"
    })
  }, {
    ag: $data.currentTab === "home" ? 1 : "",
    ah: $data.currentTab === "home" ? 1 : "",
    ai: common_vendor.o(($event) => $data.currentTab = "home"),
    aj: $data.currentTab === "library"
  }, $data.currentTab === "library" ? {
    ak: common_vendor.p({
      type: "list",
      size: "22",
      color: "#fff"
    })
  } : {
    al: common_vendor.p({
      type: "list",
      size: "24",
      color: "#999"
    })
  }, {
    am: $data.currentTab === "library" ? 1 : "",
    an: $data.currentTab === "library" ? 1 : "",
    ao: common_vendor.o(($event) => $data.currentTab = "library"),
    ap: $data.currentTab === "study"
  }, $data.currentTab === "study" ? {
    aq: common_vendor.p({
      type: "compose",
      size: "22",
      color: "#fff"
    })
  } : {
    ar: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#999"
    })
  }, {
    as: $data.currentTab === "study" ? 1 : "",
    at: $data.currentTab === "study" ? 1 : "",
    av: common_vendor.o(($event) => $data.currentTab = "study"),
    aw: $data.currentTab === "mine"
  }, $data.currentTab === "mine" ? {
    ax: common_vendor.p({
      type: "person",
      size: "22",
      color: "#fff"
    })
  } : {
    ay: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    })
  }, {
    az: $data.currentTab === "mine" ? 1 : "",
    aA: $data.currentTab === "mine" ? 1 : "",
    aB: common_vendor.o(($event) => $data.currentTab = "mine")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
