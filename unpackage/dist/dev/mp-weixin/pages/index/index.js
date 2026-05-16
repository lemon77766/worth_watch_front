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
      searchAuthors: [],
      searched: false,
      authors: [],
      recommendDynasties: [],
      hotPoems: [],
      libTabs: ["朝代", "体裁", "作者"],
      dynastyTabs: ["全部", "唐代", "宋代", "先秦", "近现代", "魏晋", "五代", "元代", "两汉", "南北朝", "清代", "明代", "金朝", "隋代"],
      categoryTabs: ["全部", "诗", "词", "曲", "文"],
      authorTabs: ["全部"],
      activeDynasty: "全部",
      activeCategory: "全部",
      activeAuthor: "全部",
      activeLibTab: "朝代",
      activeDynasty: "全部",
      activeCategory: "全部",
      menuItems: [
        { label: "我的学习合集", icon: "star", iconColor: "#2a6e44", iconBg: "#e6f2e9" },
        { label: "我的收藏", icon: "bookmark", iconColor: "#2a6e44", iconBg: "#e6f2e9" },
        { label: "研习历史", icon: "reload", iconColor: "#b82e2e", iconBg: "#fdecea" },
        { label: "每日打卡", icon: "calendar", iconColor: "#e07820", iconBg: "#fef3e6" },
        { label: "系统设置", icon: "gear", iconColor: "#888", iconBg: "#f0f0f0" },
        { label: "隐私协议", icon: "locked", iconColor: "#888", iconBg: "#f0f0f0" }
      ],
      // 批量处理相关
      batchMode: false,
      selectedPoems: [],
      batchTargetProjectId: null,
      batchTargetProjectName: "",
      // 合集命名弹窗
      showCollectionDialog: false,
      collectionName: "",
      // 已有合集列表
      projects: [],
      projectsLoading: false,
      selectedProjectId: null,
      // 选中的学习合集
      selectedProject: null,
      selectedProjectId: null,
      selectedProjectName: "",
      dailyTaskPoems: [],
      studyProgress: {
        studyDays: 0,
        learnedCount: 0,
        todayLearnedCount: 0
      },
      achievements: {
        total: 0,
        unlockedCount: 0,
        list: []
      },
      showAchievementPopup: false,
      selectedAchievement: null,
      mineStats: {
        favCount: 0,
        studyDays: 0
      }
    };
  },
  watch: {
    currentTab(newTab) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:664", "[首页] 切换Tab:", newTab);
      if (newTab === "library" && this.poemsList.length === 0) {
        this.fetchPoems();
      }
      if (newTab === "study") {
        this.fetchCurrentProject();
        this.fetchDailyTask();
        this.fetchStudyProgress();
        this.fetchAchievements();
      }
    }
  },
  onLoad(options) {
    this.fetchUserProfile();
    this.fetchDailyPoem();
    this.fetchHotAuthors();
    this.fetchRecommendDynasties();
    this.fetchHotPoems();
    this.fetchAchievements();
    common_vendor.index.$on("onProjectPoemRemoved", (data) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:685", "[首页] 收到合集诗词移除事件", data);
      if (this.selectedProject && this.selectedProject.projectId === data.projectId) {
        this.selectedProject.poemCount = data.poemCount;
      }
    });
    common_vendor.index.$on("goToMine", () => {
      this.currentTab = "mine";
    });
    if (options && options.batchProjectId) {
      this.batchTargetProjectId = parseInt(options.batchProjectId);
      this.batchTargetProjectName = options.batchProjectName ? decodeURIComponent(options.batchProjectName) : "";
      this.currentTab = "library";
      this.batchMode = true;
      this.selectedPoems = [];
    }
  },
  onUnload() {
    common_vendor.index.$off("onProjectPoemRemoved");
    common_vendor.index.$off("goToMine");
  },
  onShow() {
    this.fetchUserProfile();
    this.fetchMineStats();
    this.fetchCurrentProject();
    if (this.currentTab === "study") {
      this.fetchStudyProgress();
      this.fetchDailyTask();
      this.fetchAchievements();
    }
  },
  computed: {
    navTitle() {
      const map = { home: "值得看么", library: "值得看么", study: "研习", mine: "值得看么" };
      return map[this.currentTab] || "值得看么";
    }
  },
  methods: {
    async fetchHotAuthors() {
      try {
        const data = await utils_request.getHotAuthors();
        common_vendor.index.__f__("log", "at pages/index/index.vue:731", "[热门作者] 原始返回:", data);
        const list = data.list || data || [];
        const avatarMap = {
          "李白": "/static/author_libai.jpg",
          "杜甫": "/static/author_dufu.jpg",
          "苏轼": "/static/author_sushi.jpg"
        };
        const fallbackAvatars = ["/static/author_libai.jpg", "/static/author_dufu.jpg", "/static/author_sushi.jpg"];
        this.authors = list.map((a, i) => ({
          ...a,
          avatarUrl: avatarMap[a.name] || a.avatarUrl || (i < 3 ? fallbackAvatars[i] : "")
        }));
        if (list.length > 0) {
          this.authorTabs = ["全部", ...list.map((a) => a.name)];
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:749", "[热门作者] 获取失败:", err);
      }
    },
    async fetchRecommendDynasties() {
      try {
        const data = await utils_request.getRecommendDynasties();
        common_vendor.index.__f__("log", "at pages/index/index.vue:755", "[推荐朝代] 原始返回:", data);
        const list = data.list || data || [];
        this.recommendDynasties = list;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:759", "[推荐朝代] 获取失败:", err);
      }
    },
    async fetchHotPoems() {
      try {
        const data = await utils_request.getHotPoems();
        common_vendor.index.__f__("log", "at pages/index/index.vue:765", "[热门诗词] 原始返回:", data);
        this.hotPoems = data.list || data || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:768", "[热门诗词] 获取失败:", err);
      }
    },
    async fetchDailyTask() {
      try {
        const data = await utils_request.getDailyTask();
        common_vendor.index.__f__("log", "at pages/index/index.vue:774", "[每日课业] 原始返回:", JSON.stringify(data));
        const poems = data.poems || data.list || data || [];
        let learnedIds = /* @__PURE__ */ new Set();
        try {
          const historyData = await utils_request.getStudyHistory({ page: 1, pageSize: 200 });
          const historyList = historyData.list || historyData || [];
          historyList.forEach((item) => {
            if (item.poemId)
              learnedIds.add(item.poemId);
          });
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:785", "[每日课业] 获取研习历史失败:", e);
        }
        this.dailyTaskPoems = poems.map((p) => ({
          ...p,
          isLearned: learnedIds.has(p.poemId)
        }));
        common_vendor.index.__f__("log", "at pages/index/index.vue:791", "[每日课业] 处理后:", JSON.stringify(this.dailyTaskPoems.map((p) => ({ poemId: p.poemId, title: p.title, isLearned: p.isLearned }))));
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:793", "[每日课业] 获取失败:", err);
      }
    },
    async fetchStudyProgress() {
      try {
        const data = await utils_request.getStudyProgress();
        common_vendor.index.__f__("log", "at pages/index/index.vue:799", "[研习进度] 原始返回:", data);
        this.studyProgress = {
          studyDays: data.studyDays || 0,
          learnedCount: data.learnedCount || 0,
          todayLearnedCount: data.todayLearnedCount || 0
        };
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:806", "[研习进度] 获取失败:", err);
      }
    },
    async fetchAchievements() {
      try {
        const data = await utils_request.getAchievements();
        common_vendor.index.__f__("log", "at pages/index/index.vue:812", "[成就] 原始返回:", JSON.stringify(data));
        const list = (data.achievements || data.list || []).map((item) => {
          const unlocked = item.isUnlocked === true || item.isUnlocked === 1 || item.unlocked === true || item.unlocked === 1 || item.status === "UNLOCKED";
          return {
            ...item,
            isUnlocked: unlocked
          };
        });
        this.achievements = {
          total: data.total || list.length,
          unlockedCount: data.unlockedCount || list.filter((a) => a.isUnlocked).length,
          list
        };
        common_vendor.index.__f__("log", "at pages/index/index.vue:826", "[成就] 处理后:", JSON.stringify(this.achievements));
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:828", "[成就] 获取失败:", err);
      }
    },
    showAchievementInfo(item) {
      this.selectedAchievement = item;
      this.showAchievementPopup = true;
    },
    async fetchMineStats() {
      try {
        const [favRes, progressRes] = await Promise.all([
          utils_request.getFavorites({ page: 1, pageSize: 1 }),
          utils_request.getStudyProgress()
        ]);
        this.mineStats.favCount = favRes.total || 0;
        this.mineStats.studyDays = progressRes.studyDays || 0;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:844", "[我的统计] 获取失败:", err);
      }
    },
    async fetchUserProfile() {
      try {
        const data = await utils_request.getUserProfile();
        common_vendor.index.__f__("log", "at pages/index/index.vue:850", "[获取用户信息] 成功:", data);
        this.userInfo = {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl
        };
        common_vendor.index.setStorageSync("userInfo", this.userInfo);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:858", "[获取用户信息] 失败:", err);
        const localUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (localUserInfo) {
          this.userInfo = localUserInfo;
        }
      }
    },
    async fetchDailyPoem() {
      try {
        const data = await utils_request.getDailyPoem();
        common_vendor.index.__f__("log", "at pages/index/index.vue:869", "[获取每日推荐] 成功:", data);
        this.dailyPoem = data;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:872", "[获取每日推荐] 失败:", err);
      }
    },
    async fetchCurrentProject() {
      common_vendor.index.__f__("log", "at pages/index/index.vue:876", "[研习Tab] 开始获取当前选中项目...");
      try {
        const current = await utils_request.getCurrentProject();
        common_vendor.index.__f__("log", "at pages/index/index.vue:879", "[研习Tab] API返回数据:", JSON.stringify(current));
        if (current && current.projectId) {
          this.selectedProject = current;
          this.selectedProjectId = current.projectId;
          this.selectedProjectName = current.name;
          common_vendor.index.__f__("log", "at pages/index/index.vue:885", "[研习Tab] 设置选中合集:", current.name, "poemCount:", current.poemCount);
        } else {
          this.selectedProject = null;
          this.selectedProjectId = null;
          this.selectedProjectName = "";
          common_vendor.index.__f__("log", "at pages/index/index.vue:890", "[研习Tab] 暂无选中的合集");
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:893", "[研习Tab] 获取当前合集失败:", err);
        this.selectedProject = null;
        this.selectedProjectId = null;
        this.selectedProjectName = "";
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
        common_vendor.index.__f__("log", "at pages/index/index.vue:917", "[获取诗词列表] 参数:", params);
        const data = await utils_request.getPoems(params);
        common_vendor.index.__f__("log", "at pages/index/index.vue:919", "[获取诗词列表] 成功:", data);
        this.poemsList = data.list || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:922", "[获取诗词列表] 失败:", err);
      } finally {
        this.poemsLoading = false;
      }
    },
    openSearch() {
      this.searchKeyword = "";
      this.searchResults = [];
      this.searchAuthors = [];
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
    onHotAuthorClick(author) {
      if (author.authorId) {
        common_vendor.index.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` });
      } else {
        this.currentTab = "library";
        this.activeLibTab = "作者";
        this.activeAuthor = author.name;
        this.poemsPage = 1;
        this.poemsList = [];
        this.fetchPoems();
      }
    },
    onSearchAuthorClick(author) {
      this.showSearch = false;
      if (author.authorId) {
        common_vendor.index.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` });
      } else {
        this.currentTab = "library";
        this.activeLibTab = "作者";
        this.activeAuthor = author.name;
        this.poemsPage = 1;
        this.poemsList = [];
        this.fetchPoems();
      }
    },
    onRecommendDynastyClick(item) {
      this.currentTab = "library";
      this.activeLibTab = "朝代";
      this.activeDynasty = item.dynasty;
      this.poemsPage = 1;
      this.poemsList = [];
      this.fetchPoems();
    },
    async doSearch() {
      if (!this.searchKeyword.trim())
        return;
      this.searchResults = [];
      this.searchAuthors = [];
      this.searched = true;
      const poemPromise = utils_request.searchPoems({ q: this.searchKeyword, page: 1, pageSize: 50 }).then((data) => {
        this.searchResults = data.list || [];
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:1000", "[搜索诗词] 失败:", err);
      });
      const authorPromise = utils_request.getAuthors({ q: this.searchKeyword }).then((data) => {
        common_vendor.index.__f__("log", "at pages/index/index.vue:1003", "[搜索作者] 成功:", data);
        this.searchAuthors = data.list || data || [];
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/index/index.vue:1006", "[搜索作者] 失败:", err);
      });
      await Promise.all([poemPromise, authorPromise]);
    },
    shortTitle(title, maxLen = 5) {
      if (!title)
        return "";
      return title.length > maxLen ? title.slice(0, maxLen) + "……" : title;
    },
    titleSize(title, mode = "card") {
      if (!title)
        return mode === "banner" ? "96rpx" : "56rpx";
      const len = title.length;
      if (mode === "banner") {
        if (len <= 3)
          return "96rpx";
        if (len <= 5)
          return "72rpx";
        if (len <= 7)
          return "56rpx";
        return "44rpx";
      }
      if (len <= 3)
        return "56rpx";
      if (len <= 5)
        return "48rpx";
      if (len <= 7)
        return "40rpx";
      return "34rpx";
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
      if (item.label === "我的学习合集") {
        common_vendor.index.navigateTo({ url: "/pages/projects/index" });
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
    },
    // 切换批量选择模式
    toggleBatchMode() {
      this.batchMode = !this.batchMode;
      if (!this.batchMode) {
        this.selectedPoems = [];
        this.batchTargetProjectId = null;
        this.batchTargetProjectName = "";
      }
    },
    // 直接添加到预设的学习合集（从合集详情页跳过来的场景）
    async confirmBatchAddToProject() {
      if (this.selectedPoems.length === 0) {
        common_vendor.index.showToast({ title: "请先选择诗词", icon: "none" });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "添加中..." });
        await utils_request.addPoemToProject(this.batchTargetProjectId, this.selectedPoems);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: `已添加${this.selectedPoems.length}首诗词`, icon: "success" });
        this.batchMode = false;
        this.selectedPoems = [];
        this.batchTargetProjectId = null;
        this.batchTargetProjectName = "";
        common_vendor.index.$emit("onProjectUpdated");
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/index/index.vue:1095", "[批量添加] 失败:", err);
        common_vendor.index.showToast({ title: "添加失败", icon: "none" });
      }
    },
    // 切换诗词选中状态
    togglePoemSelection(poemId) {
      const index = this.selectedPoems.indexOf(poemId);
      if (index > -1) {
        this.selectedPoems.splice(index, 1);
      } else {
        this.selectedPoems.push(poemId);
      }
    },
    // 添加到学习合集
    addToCollection() {
      if (this.selectedPoems.length === 0) {
        common_vendor.index.showToast({ title: "请先选择诗词", icon: "none" });
        return;
      }
      common_vendor.index.__f__("log", "at pages/index/index.vue:1115", "[批量添加] 合集名称:", this.collectionName, "诗词ID:", this.selectedPoems);
      common_vendor.index.showToast({
        title: `已添加到"${this.collectionName}"`,
        icon: "success"
      });
      this.batchMode = false;
      this.selectedPoems = [];
      this.collectionName = "";
    },
    // 显示合集弹窗
    async showCollectionInput() {
      if (this.selectedPoems.length === 0) {
        common_vendor.index.showToast({ title: "请先选择诗词", icon: "none" });
        return;
      }
      this.collectionName = "";
      this.selectedProjectId = null;
      this.projects = [];
      this.showCollectionDialog = true;
      this.projectsLoading = true;
      try {
        const data = await utils_request.getProjects();
        common_vendor.index.__f__("log", "at pages/index/index.vue:1139", "[首页] getProjects 原始返回:", JSON.stringify(data));
        if (Array.isArray(data)) {
          this.projects = data;
        } else if (data && Array.isArray(data.list)) {
          this.projects = data.list;
        } else if (data && Array.isArray(data.records)) {
          this.projects = data.records;
        } else if (data && typeof data === "object") {
          const keys = Object.keys(data);
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              this.projects = data[key];
              break;
            }
          }
          if (this.projects.length === 0 && data.projectId) {
            this.projects = [data];
          }
        }
        common_vendor.index.__f__("log", "at pages/index/index.vue:1158", "[首页] 合集列表:", this.projects, "数量:", this.projects.length);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:1160", "[首页] 获取合集失败:", err);
        this.projects = [];
      } finally {
        this.projectsLoading = false;
      }
    },
    // 取消合集弹窗
    cancelCollection() {
      this.showCollectionDialog = false;
      this.collectionName = "";
      this.selectedProjectId = null;
    },
    // 选择已有合集
    selectProject(project) {
      this.selectedProjectId = project.projectId;
    },
    // 确认添加到已有合集
    async confirmAddToProject() {
      if (!this.selectedProjectId) {
        common_vendor.index.showToast({ title: "请先选择合集", icon: "none" });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "添加中..." });
        await utils_request.addPoemToProject(this.selectedProjectId, this.selectedPoems);
        common_vendor.index.__f__("log", "at pages/index/index.vue:1185", "[首页] 添加诗词到合集成功");
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "添加成功", icon: "success" });
        this.showCollectionDialog = false;
        this.batchMode = false;
        this.selectedPoems = [];
        this.selectedProjectId = null;
        common_vendor.index.$emit("onProjectUpdated");
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/index/index.vue:1196", "[首页] 添加失败:", err);
        common_vendor.index.showToast({ title: "添加失败", icon: "none" });
      }
    },
    // 创建新合集并添加
    async createAndAdd() {
      if (!this.collectionName.trim()) {
        common_vendor.index.showToast({ title: "请输入合集名称", icon: "none" });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "创建中..." });
        const project = await utils_request.createProject(this.collectionName.trim());
        common_vendor.index.__f__("log", "at pages/index/index.vue:1209", "[首页] 创建合集成功:", project);
        common_vendor.index.hideLoading();
        const projectId = project.projectId || project.id || project;
        await utils_request.addPoemToProject(projectId, this.selectedPoems);
        common_vendor.index.__f__("log", "at pages/index/index.vue:1214", "[首页] 添加诗词到新合集成功");
        common_vendor.index.showToast({ title: "创建并添加成功", icon: "success" });
        this.showCollectionDialog = false;
        this.batchMode = false;
        this.selectedPoems = [];
        this.selectedProjectId = null;
        common_vendor.index.$emit("onProjectUpdated");
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/index/index.vue:1224", "[首页] 创建/添加失败:", err);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    // 跳转到学习合集列表页面
    goToProjects() {
      common_vendor.index.navigateTo({ url: "/pages/projects/index" });
    },
    goToAuthors() {
      common_vendor.index.navigateTo({ url: "/pages/authors/index" });
    },
    // 跳转到当前选中合集的诗词列表
    goToProjectDetail() {
      if (!this.selectedProjectId) {
        this.goToProjects();
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/project-detail/index?projectId=${this.selectedProjectId}&name=${encodeURIComponent(this.selectedProjectName)}`
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
  }, !$data.searched ? {} : $data.searchResults.length > 0 || $data.searchAuthors.length > 0 ? common_vendor.e({
    i: $data.searchAuthors.length > 0
  }, $data.searchAuthors.length > 0 ? {
    j: common_vendor.f($data.searchAuthors, (author, k0, i0) => {
      return common_vendor.e({
        a: author.avatarUrl
      }, author.avatarUrl ? {
        b: author.avatarUrl
      } : {
        c: common_vendor.t(author.name ? author.name[0] : "")
      }, {
        d: common_vendor.t(author.name),
        e: common_vendor.t(author.dynasty || ""),
        f: "76214786-0-" + i0,
        g: "a-" + author.authorId,
        h: common_vendor.o(($event) => $options.onSearchAuthorClick(author), "a-" + author.authorId)
      });
    }),
    k: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    })
  } : {}, {
    l: $data.searchResults.length > 0
  }, $data.searchResults.length > 0 ? {
    m: common_vendor.f($data.searchResults, (poem, k0, i0) => {
      return {
        a: common_vendor.t(poem.title),
        b: $options.titleSize(poem.title, "card"),
        c: common_vendor.t(poem.excerpt),
        d: common_vendor.t(poem.author),
        e: common_vendor.t(poem.dynasty),
        f: poem.poemId,
        g: common_vendor.o(($event) => {
          $options.goToDetail(poem.poemId);
          $data.showSearch = false;
        }, poem.poemId)
      };
    })
  } : {}) : $data.searched && $data.searchResults.length === 0 && $data.searchAuthors.length === 0 ? {} : {}, {
    h: $data.searchResults.length > 0 || $data.searchAuthors.length > 0,
    n: $data.searched && $data.searchResults.length === 0 && $data.searchAuthors.length === 0,
    o: common_vendor.o(($event) => $data.showSearch = false)
  }) : {}, {
    p: $data.userInfo && $data.userInfo.avatarUrl
  }, $data.userInfo && $data.userInfo.avatarUrl ? {
    q: $data.userInfo.avatarUrl,
    r: common_vendor.o(($event) => $data.currentTab = "mine")
  } : {
    s: common_vendor.o(($event) => $data.currentTab = "mine")
  }, {
    t: common_vendor.o($options.openSearch),
    v: common_vendor.p({
      type: "search",
      size: "24",
      color: "#2a6e44"
    }),
    w: common_vendor.t($options.navTitle),
    x: $data.currentTab === "home"
  }, $data.currentTab === "home" ? common_vendor.e({
    y: $data.dailyPoem
  }, $data.dailyPoem ? {
    z: common_vendor.t($data.dailyPoem.title),
    A: $options.titleSize($data.dailyPoem.title, "banner"),
    B: common_vendor.t($data.dailyPoem.author),
    C: common_vendor.t($data.dailyPoem.dynasty),
    D: common_vendor.f(($data.dailyPoem.content || "").split("\n"), (line, index, i0) => {
      return {
        a: common_vendor.t(line),
        b: index
      };
    }),
    E: common_vendor.o(($event) => $options.goToDetail($data.dailyPoem.poemId)),
    F: "url(" + $data.dailyPoem.coverImage + ")"
  } : {}, {
    G: $data.hotPoems.length > 0
  }, $data.hotPoems.length > 0 ? {
    H: common_vendor.f($data.hotPoems, (poem, i, i0) => {
      return {
        a: common_vendor.t(i + 1),
        b: i < 3 ? 1 : "",
        c: common_vendor.t(poem.title),
        d: common_vendor.t(poem.author),
        e: common_vendor.t(poem.dynasty),
        f: common_vendor.t(poem.studyCount),
        g: poem.poemId,
        h: common_vendor.o(($event) => $options.goToDetail(poem.poemId), poem.poemId)
      };
    })
  } : {}, {
    I: $data.recommendDynasties.length > 0
  }, $data.recommendDynasties.length > 0 ? {
    J: common_vendor.t($data.recommendDynasties[0].dynasty),
    K: common_vendor.t($data.recommendDynasties[0].dynasty),
    L: common_vendor.t($data.recommendDynasties[0].poemCount),
    M: common_vendor.t($data.recommendDynasties[0].dynasty),
    N: common_vendor.o(($event) => $options.onRecommendDynastyClick($data.recommendDynasties[0]))
  } : {}, {
    O: common_vendor.f($data.recommendDynasties.slice(1, 3), (d, i, i0) => {
      return {
        a: "76214786-2-" + i0,
        b: common_vendor.t(d.dynasty),
        c: common_vendor.t(d.poemCount),
        d: i,
        e: common_vendor.o(($event) => $options.onRecommendDynastyClick(d), i)
      };
    }),
    P: common_vendor.p({
      type: "bookmarks",
      size: "28",
      color: "#2a6e44"
    }),
    Q: common_vendor.p({
      type: "right",
      size: "14",
      color: "#999"
    }),
    R: common_vendor.o((...args) => $options.goToAuthors && $options.goToAuthors(...args)),
    S: common_vendor.f($data.authors, (a, k0, i0) => {
      return common_vendor.e({
        a: a.avatarUrl
      }, a.avatarUrl ? {
        b: a.avatarUrl
      } : {}, {
        c: common_vendor.t(a.name),
        d: common_vendor.t(a.dynasty || a.description || ""),
        e: a.authorId || a.name,
        f: common_vendor.o(($event) => $options.onHotAuthorClick(a), a.authorId || a.name)
      });
    }),
    T: common_vendor.p({
      type: "right",
      size: "22",
      color: "#fff"
    })
  }) : {}, {
    U: $data.currentTab === "library"
  }, $data.currentTab === "library" ? common_vendor.e({
    V: common_vendor.f($data.libTabs, (t, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(t),
        b: $data.activeLibTab === t
      }, $data.activeLibTab === t ? {} : {}, {
        c: t,
        d: $data.activeLibTab === t ? 1 : "",
        e: common_vendor.o(($event) => $options.onLibTabChange(t), t)
      });
    }),
    W: common_vendor.p({
      type: $data.batchMode ? "checkbox" : "checkbox-unchecked",
      size: "22",
      color: $data.batchMode ? "#fff" : "#2a6e44"
    }),
    X: common_vendor.o((...args) => $options.toggleBatchMode && $options.toggleBatchMode(...args)),
    Y: $data.activeLibTab === "朝代"
  }, $data.activeLibTab === "朝代" ? {
    Z: common_vendor.f($data.dynastyTabs, (d, k0, i0) => {
      return {
        a: common_vendor.t(d),
        b: d,
        c: $data.activeDynasty === d ? 1 : "",
        d: common_vendor.o(($event) => $options.onDynastyChange(d), d)
      };
    })
  } : {}, {
    aa: $data.activeLibTab === "体裁"
  }, $data.activeLibTab === "体裁" ? {
    ab: common_vendor.f($data.categoryTabs, (c, k0, i0) => {
      return {
        a: common_vendor.t(c),
        b: c,
        c: $data.activeCategory === c ? 1 : "",
        d: common_vendor.o(($event) => $options.onCategoryChange(c), c)
      };
    })
  } : {}, {
    ac: $data.activeLibTab === "作者"
  }, $data.activeLibTab === "作者" ? {
    ad: common_vendor.f($data.authorTabs, (a, k0, i0) => {
      return {
        a: common_vendor.t(a),
        b: a,
        c: $data.activeAuthor === a ? 1 : "",
        d: common_vendor.o(($event) => $options.onAuthorChange(a), a)
      };
    })
  } : {}, {
    ae: common_vendor.f($data.poemsList, (poem, k0, i0) => {
      return common_vendor.e($data.batchMode ? common_vendor.e({
        a: $data.selectedPoems.includes(poem.poemId)
      }, $data.selectedPoems.includes(poem.poemId) ? {
        b: "76214786-6-" + i0,
        c: common_vendor.p({
          type: "checkmark",
          size: "20",
          color: "#fff"
        })
      } : {}, {
        d: $data.selectedPoems.includes(poem.poemId) ? 1 : "",
        e: common_vendor.o(($event) => $options.togglePoemSelection(poem.poemId), poem.poemId)
      }) : {}, {
        f: common_vendor.t(poem.dynasty),
        g: common_vendor.t(poem.dynasty),
        h: common_vendor.t(poem.title),
        i: $options.titleSize(poem.title, "card"),
        j: common_vendor.t(poem.excerpt),
        k: common_vendor.t(poem.author),
        l: poem.poemId,
        m: $data.selectedPoems.includes(poem.poemId) ? 1 : "",
        n: common_vendor.o(($event) => $data.batchMode ? $options.togglePoemSelection(poem.poemId) : $options.goToDetail(poem.poemId), poem.poemId)
      });
    }),
    af: $data.batchMode,
    ag: $data.poemsLoading
  }, $data.poemsLoading ? {} : {}, {
    ah: !$data.poemsLoading && $data.poemsList.length === 0
  }, !$data.poemsLoading && $data.poemsList.length === 0 ? {} : {}) : {}, {
    ai: $data.currentTab === "study"
  }, $data.currentTab === "study" ? common_vendor.e({
    aj: common_vendor.t($data.studyProgress.studyDays),
    ak: common_vendor.t($data.studyProgress.learnedCount),
    al: common_vendor.t($data.studyProgress.todayLearnedCount),
    am: common_vendor.o((...args) => $options.goToProjects && $options.goToProjects(...args)),
    an: common_vendor.t($data.selectedProjectName || "学习合集"),
    ao: common_vendor.t($data.selectedProjectName || "选择学习合集"),
    ap: common_vendor.t($data.selectedProject ? $data.selectedProject.poemCount + " 首诗词 · 点击查看诗词" : '点击上方"更换计划"选择学习合集'),
    aq: $data.selectedProject
  }, $data.selectedProject ? {
    ar: common_vendor.t($data.selectedProject.poemCount ? Math.round(($data.selectedProject.learnedCount || 0) / $data.selectedProject.poemCount * 100) : 0),
    as: common_vendor.t($data.selectedProject.learnedCount || 0),
    at: common_vendor.t($data.selectedProject.poemCount)
  } : {}, {
    av: $data.selectedProject
  }, $data.selectedProject ? {
    aw: ($data.selectedProject.poemCount ? Math.round(($data.selectedProject.learnedCount || 0) / $data.selectedProject.poemCount * 100) : 0) + "%"
  } : {}, {
    ax: common_vendor.o((...args) => $options.goToProjectDetail && $options.goToProjectDetail(...args)),
    ay: common_vendor.f($data.dailyTaskPoems, (p, i, i0) => {
      return common_vendor.e({
        a: p.isLearned
      }, p.isLearned ? {
        b: "76214786-7-" + i0,
        c: common_vendor.p({
          type: "checkmarkempty",
          size: "26",
          color: "#fff"
        })
      } : {
        d: "76214786-8-" + i0,
        e: common_vendor.p({
          type: "bookmarks",
          size: "26",
          color: "#2a6e44"
        })
      }, {
        f: common_vendor.n(p.isLearned ? "lesson-icon-done" : ""),
        g: common_vendor.t(i % 2 === 0 ? "背诵" : "赏析"),
        h: common_vendor.n(i % 2 === 0 ? "ltag-light-text" : "ltag-dark-text"),
        i: common_vendor.n(i % 2 === 0 ? "ltag-light" : "ltag-dark"),
        j: common_vendor.t(p.title),
        k: common_vendor.t(p.author),
        l: common_vendor.t(p.dynasty),
        m: p.isLearned
      }, p.isLearned ? {} : {
        n: "76214786-9-" + i0,
        o: common_vendor.p({
          type: "right",
          size: "18",
          color: "#ccc"
        })
      }, {
        p: p.poemId || i,
        q: common_vendor.s(i > 0 ? "margin-top:24rpx;" : ""),
        r: common_vendor.o(($event) => $options.goToDetail(p.poemId), p.poemId || i)
      });
    }),
    az: $data.dailyTaskPoems.length === 0
  }, $data.dailyTaskPoems.length === 0 ? {} : {}, {
    aA: common_vendor.t($data.achievements.unlockedCount),
    aB: common_vendor.t($data.achievements.total),
    aC: $data.achievements.list.length > 0
  }, $data.achievements.list.length > 0 ? {
    aD: common_vendor.f($data.achievements.list, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title),
        b: common_vendor.n(item.isUnlocked ? "badge-text-on" : "badge-text-off"),
        c: item.isUnlocked
      }, item.isUnlocked ? {
        d: "76214786-10-" + i0,
        e: common_vendor.p({
          type: "star-filled",
          size: "14",
          color: "#e6a23c"
        })
      } : {
        f: "76214786-11-" + i0,
        g: common_vendor.p({
          type: "locked",
          size: "12",
          color: "#bbb"
        })
      }, {
        h: common_vendor.n(item.isUnlocked ? "badge-on" : "badge-off"),
        i: common_vendor.t(item.isUnlocked ? "已达成" : "未解锁"),
        j: !item.isUnlocked ? 1 : "",
        k: item.achievementId,
        l: common_vendor.o(($event) => $options.showAchievementInfo(item), item.achievementId)
      });
    })
  } : {}) : {}, {
    aE: $data.currentTab === "mine"
  }, $data.currentTab === "mine" ? common_vendor.e({
    aF: $data.userInfo && $data.userInfo.avatarUrl
  }, $data.userInfo && $data.userInfo.avatarUrl ? {
    aG: $data.userInfo.avatarUrl
  } : {}, {
    aH: common_vendor.t($data.userInfo && $data.userInfo.nickname || "未设置昵称"),
    aI: common_vendor.t($data.mineStats.favCount),
    aJ: common_vendor.t($data.mineStats.studyDays),
    aK: common_vendor.f($data.menuItems, (item, k0, i0) => {
      return {
        a: "76214786-12-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "22",
          color: item.iconColor
        }),
        c: item.iconBg,
        d: common_vendor.t(item.label),
        e: "76214786-13-" + i0,
        f: item.label,
        g: common_vendor.o(($event) => $options.onMenu(item), item.label)
      };
    }),
    aL: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ccc"
    }),
    aM: common_vendor.p({
      type: "redo",
      size: "18",
      color: "#b82e2e"
    }),
    aN: common_vendor.o((...args) => $options.onLogout && $options.onLogout(...args))
  }) : {}, {
    aO: $data.currentTab === "home"
  }, $data.currentTab === "home" ? {
    aP: common_vendor.p({
      type: "home",
      size: "22",
      color: "#fff"
    })
  } : {
    aQ: common_vendor.p({
      type: "home",
      size: "24",
      color: "#999"
    })
  }, {
    aR: $data.currentTab === "home" ? 1 : "",
    aS: $data.currentTab === "home" ? 1 : "",
    aT: common_vendor.o(($event) => $data.currentTab = "home"),
    aU: $data.currentTab === "library"
  }, $data.currentTab === "library" ? {
    aV: common_vendor.p({
      type: "list",
      size: "22",
      color: "#fff"
    })
  } : {
    aW: common_vendor.p({
      type: "list",
      size: "24",
      color: "#999"
    })
  }, {
    aX: $data.currentTab === "library" ? 1 : "",
    aY: $data.currentTab === "library" ? 1 : "",
    aZ: common_vendor.o(($event) => $data.currentTab = "library"),
    ba: $data.currentTab === "study"
  }, $data.currentTab === "study" ? {
    bb: common_vendor.p({
      type: "compose",
      size: "22",
      color: "#fff"
    })
  } : {
    bc: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#999"
    })
  }, {
    bd: $data.currentTab === "study" ? 1 : "",
    be: $data.currentTab === "study" ? 1 : "",
    bf: common_vendor.o(($event) => $data.currentTab = "study"),
    bg: $data.currentTab === "mine"
  }, $data.currentTab === "mine" ? {
    bh: common_vendor.p({
      type: "person",
      size: "22",
      color: "#fff"
    })
  } : {
    bi: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    })
  }, {
    bj: $data.currentTab === "mine" ? 1 : "",
    bk: $data.currentTab === "mine" ? 1 : "",
    bl: common_vendor.o(($event) => $data.currentTab = "mine"),
    bm: $data.batchMode ? 1 : "",
    bn: $data.batchMode
  }, $data.batchMode ? common_vendor.e({
    bo: common_vendor.t($data.selectedPoems.length),
    bp: common_vendor.t($data.batchTargetProjectName ? " → " + $data.batchTargetProjectName : ""),
    bq: common_vendor.o((...args) => $options.toggleBatchMode && $options.toggleBatchMode(...args)),
    br: $data.batchTargetProjectId
  }, $data.batchTargetProjectId ? {
    bs: common_vendor.t($data.batchTargetProjectName),
    bt: common_vendor.o((...args) => $options.confirmBatchAddToProject && $options.confirmBatchAddToProject(...args))
  } : {
    bv: common_vendor.o((...args) => $options.showCollectionInput && $options.showCollectionInput(...args))
  }) : {}, {
    bw: $data.showCollectionDialog
  }, $data.showCollectionDialog ? common_vendor.e({
    bx: common_vendor.t($data.selectedPoems.length),
    by: common_vendor.p({
      type: "close",
      size: "20",
      color: "#999"
    }),
    bz: common_vendor.o((...args) => $options.cancelCollection && $options.cancelCollection(...args)),
    bA: $data.projectsLoading
  }, $data.projectsLoading ? {} : $data.projects.length === 0 ? {} : {
    bC: common_vendor.f($data.projects, (project, k0, i0) => {
      return common_vendor.e({
        a: "76214786-24-" + i0,
        b: common_vendor.p({
          type: "star",
          size: "20",
          color: $data.selectedProjectId === project.projectId ? "#fff" : "#2a6e44"
        }),
        c: common_vendor.t(project.name),
        d: common_vendor.t(project.poemCount || 0),
        e: $data.selectedProjectId === project.projectId
      }, $data.selectedProjectId === project.projectId ? {
        f: "76214786-25-" + i0,
        g: common_vendor.p({
          type: "checkmark",
          size: "20",
          color: "#2a6e44"
        })
      } : {}, {
        h: project.projectId,
        i: $data.selectedProjectId === project.projectId ? 1 : "",
        j: common_vendor.o(($event) => $options.selectProject(project), project.projectId)
      });
    })
  }, {
    bB: $data.projects.length === 0,
    bD: $data.collectionName,
    bE: common_vendor.o(($event) => $data.collectionName = $event.detail.value),
    bF: common_vendor.o((...args) => $options.createAndAdd && $options.createAndAdd(...args)),
    bG: $data.selectedProjectId
  }, $data.selectedProjectId ? {
    bH: common_vendor.o((...args) => $options.confirmAddToProject && $options.confirmAddToProject(...args))
  } : {}, {
    bI: common_vendor.o(() => {
    }),
    bJ: common_vendor.o((...args) => $options.cancelCollection && $options.cancelCollection(...args))
  }) : {}, {
    bK: $data.showAchievementPopup && $data.selectedAchievement
  }, $data.showAchievementPopup && $data.selectedAchievement ? common_vendor.e({
    bL: common_vendor.t($data.selectedAchievement.title),
    bM: common_vendor.n($data.selectedAchievement.isUnlocked ? "badge-text-on" : "badge-text-off"),
    bN: common_vendor.n($data.selectedAchievement.isUnlocked ? "badge-on" : "badge-off"),
    bO: $data.selectedAchievement.isUnlocked
  }, $data.selectedAchievement.isUnlocked ? {
    bP: common_vendor.p({
      type: "checkmarkempty",
      size: "16",
      color: "#b82e2e"
    })
  } : {}, {
    bQ: common_vendor.t($data.selectedAchievement.description),
    bR: $data.selectedAchievement.isUnlocked && $data.selectedAchievement.unlockedAt
  }, $data.selectedAchievement.isUnlocked && $data.selectedAchievement.unlockedAt ? {
    bS: common_vendor.t($data.selectedAchievement.unlockedAt)
  } : {}, {
    bT: common_vendor.o(($event) => $data.showAchievementPopup = false),
    bU: common_vendor.o(() => {
    }),
    bV: common_vendor.o(($event) => $data.showAchievementPopup = false)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
