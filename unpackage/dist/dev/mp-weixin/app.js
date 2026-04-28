"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_request = require("./utils/request.js");
if (!Math) {
  "./pages/login/index.js";
  "./pages/index/index.js";
  "./pages/library/index.js";
  "./pages/study/index.js";
  "./pages/detail/index.js";
  "./pages/recite/index.js";
  "./pages/checkin/index.js";
  "./pages/favorites/index.js";
  "./pages/history/index.js";
  "./pages/settings/index.js";
  "./pages/privacy/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    const token = common_vendor.index.getStorageSync("token");
    if (!token) {
      common_vendor.index.reLaunch({ url: "/pages/login/index" });
    }
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$request = utils_request.request;
  app.config.globalProperties.$get = utils_request.get;
  app.config.globalProperties.$post = utils_request.post;
  app.config.globalProperties.$put = utils_request.put;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
