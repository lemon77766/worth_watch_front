"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://bighorse.top";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const fullUrl = BASE_URL + options.url;
    common_vendor.index.__f__("log", "at utils/request.js:8", `[→] ${options.method || "GET"} ${options.url}`, options.data || "");
    common_vendor.index.request({
      url: fullUrl,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      },
      timeout: 1e5,
      success: (res) => {
        if (!res.data) {
          reject(new Error("empty response"));
          return;
        }
        const { code, message, data } = res.data;
        if (code === 200) {
          common_vendor.index.__f__("log", "at utils/request.js:24", `[✓] ${options.url} ←`, JSON.stringify(data).substring(0, 100));
          resolve(data);
        } else if (code === 401) {
          common_vendor.index.removeStorageSync("token");
          reject(new Error(message || "未登录"));
        } else {
          common_vendor.index.__f__("error", "at utils/request.js:31", `[✗] ${options.url}: ${message}`);
          common_vendor.index.showToast({ title: message || "请求失败", icon: "none" });
          reject(new Error(message));
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at utils/request.js:37", `[✗] ${options.url}: ${err.errMsg}`);
        reject(err);
      }
    });
  });
};
const get = (url, data) => request({ url, method: "GET", data });
const post = (url, data) => request({ url, method: "POST", data });
const put = (url, data) => request({ url, method: "PUT", data });
const login = (code) => post("/api/auth/login", { code });
const getUserProfile = () => get("/api/user/profile");
const updateUserProfile = (data) => put("/api/user/profile", data);
const uploadAvatar = (filePath) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.index.__f__("log", "at utils/request.js:56", "[上传头像] 开始上传，文件路径:", filePath);
    common_vendor.index.__f__("log", "at utils/request.js:57", "[上传头像] 请求地址:", BASE_URL + "/api/user/avatar");
    common_vendor.index.__f__("log", "at utils/request.js:58", "[上传头像] Token:", token ? "有" : "无");
    common_vendor.index.uploadFile({
      url: BASE_URL + "/api/user/avatar",
      filePath,
      name: "file",
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        common_vendor.index.__f__("log", "at utils/request.js:66", "[上传头像] HTTP状态码:", res.statusCode);
        common_vendor.index.__f__("log", "at utils/request.js:67", "[上传头像] 响应内容:", res.data);
        try {
          const data = JSON.parse(res.data);
          common_vendor.index.__f__("log", "at utils/request.js:71", "[上传头像] 解析后:", data);
          if (data.code === 200) {
            const avatarUrl = typeof data.data === "string" ? data.data : data.data.avatarUrl;
            common_vendor.index.__f__("log", "at utils/request.js:75", "[上传头像] 上传成功，返回URL:", avatarUrl);
            resolve(avatarUrl);
          } else {
            common_vendor.index.__f__("error", "at utils/request.js:78", "[上传头像] 上传失败:", data.message);
            reject(new Error(data.message));
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at utils/request.js:82", "[上传头像] JSON解析失败:", e);
          reject(new Error("响应解析失败"));
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at utils/request.js:87", "[上传头像] 请求失败:", err);
        reject(err);
      }
    });
  });
};
const getDailyPoem = () => get("/api/poems/daily");
const getPoems = (params) => get("/api/poems/search", params);
const searchPoems = (params) => get("/api/poems/search", params);
const getPoemDetail = (id) => get(`/api/poems/${id}`);
const toggleFavorite = (id) => post(`/api/poems/${id}/favorite`);
const getStudyProgress = () => get("/api/study/progress");
const getStudyHistory = (params) => get("/api/study/history", params);
const checkIn = () => post("/api/user/check-in");
const getCheckInHistory = (year, month) => get("/api/user/check-in/history", { year, month });
const getAchievements = () => get("/api/user/achievements");
const getFavorites = (params) => get("/api/user/favorites", params);
const getRecommendDynasties = () => get("/api/poems/dynasties/recommend");
const getDailyTask = () => get("/api/poems/daily-task");
const submitStudyRecord = (data) => post("/api/study/record", data);
const getTtsVoices = () => get("/api/poems/tts/voices");
const getAuthors = (params) => get("/api/authors", params);
const getRecommendPoems = (id) => get(`/api/poems/${id}/recommend`);
const getHotAuthors = () => get("/api/authors/hot");
const getHotPoems = () => get("/api/study/hot");
const getAuthorDetail = (id) => get(`/api/authors/${id}`);
const createProject = (name) => post("/api/projects", { name });
const addPoemToProject = (projectId, poemIds) => post(`/api/projects/${projectId}/poems`, { poemIds });
const getProjects = () => get("/api/projects");
const getCurrentProject = () => get("/api/projects/current");
const getProjectPoems = (projectId, params) => get(`/api/projects/${projectId}/poems`, params);
const deleteProject = (projectId) => request({ url: `/api/projects/${projectId}`, method: "DELETE" });
const selectCurrentProject = (projectId) => post(`/api/projects/${projectId}/select`);
const removePoemFromProject = (projectId, poemId) => request({ url: `/api/projects/${projectId}/poems/${poemId}`, method: "DELETE" });
const renameProject = (projectId, name) => put(`/api/projects/${projectId}/name`, { name });
exports.BASE_URL = BASE_URL;
exports.addPoemToProject = addPoemToProject;
exports.checkIn = checkIn;
exports.createProject = createProject;
exports.deleteProject = deleteProject;
exports.get = get;
exports.getAchievements = getAchievements;
exports.getAuthorDetail = getAuthorDetail;
exports.getAuthors = getAuthors;
exports.getCheckInHistory = getCheckInHistory;
exports.getCurrentProject = getCurrentProject;
exports.getDailyPoem = getDailyPoem;
exports.getDailyTask = getDailyTask;
exports.getFavorites = getFavorites;
exports.getHotAuthors = getHotAuthors;
exports.getHotPoems = getHotPoems;
exports.getPoemDetail = getPoemDetail;
exports.getPoems = getPoems;
exports.getProjectPoems = getProjectPoems;
exports.getProjects = getProjects;
exports.getRecommendDynasties = getRecommendDynasties;
exports.getRecommendPoems = getRecommendPoems;
exports.getStudyHistory = getStudyHistory;
exports.getStudyProgress = getStudyProgress;
exports.getTtsVoices = getTtsVoices;
exports.getUserProfile = getUserProfile;
exports.login = login;
exports.post = post;
exports.put = put;
exports.removePoemFromProject = removePoemFromProject;
exports.renameProject = renameProject;
exports.request = request;
exports.searchPoems = searchPoems;
exports.selectCurrentProject = selectCurrentProject;
exports.submitStudyRecord = submitStudyRecord;
exports.toggleFavorite = toggleFavorite;
exports.updateUserProfile = updateUserProfile;
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
