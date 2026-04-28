import { getUserProfile } from './request.js'

export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        avatarUrl: '',
        userId: null
      }
    }
  },
  onShow() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      // 先用本地缓存快速渲染
      const cached = uni.getStorageSync('userInfo')
      if (cached && cached.nickname) {
        this.userInfo = cached
      }
      // 再从后端拉取最新
      getUserProfile().then(data => {
        this.userInfo = {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl,
          userId: data.userId
        }
        uni.setStorageSync('userInfo', this.userInfo)
      }).catch(() => {})
    }
  }
}
