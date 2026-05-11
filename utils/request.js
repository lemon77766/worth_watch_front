const BASE_URL = 'http://192.168.1.109:8080'
export { BASE_URL }

const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    const fullUrl = BASE_URL + options.url
    console.log(`[→] ${options.method || 'GET'} ${options.url}`, options.data || '')
    
    uni.request({
      url: fullUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      timeout: 100000,
      success: (res) => {
        if (!res.data) { reject(new Error('empty response')); return }
        const { code, message, data } = res.data
        
        if (code === 200) {
          console.log(`[✓] ${options.url} ←`, JSON.stringify(data).substring(0, 100))
          resolve(data)
        } else if (code === 401) {
          uni.removeStorageSync('token')
          uni.reLaunch({ url: '/pages/login/index' })
          reject(new Error(message))
        } else {
          console.error(`[✗] ${options.url}: ${message}`)
          uni.showToast({ title: message || '请求失败', icon: 'none' })
          reject(new Error(message))
        }
      },
      fail: (err) => {
        console.error(`[✗] ${options.url}: ${err.errMsg}`)
        reject(err)
      }
    })
  })
}

export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const put = (url, data) => request({ url, method: 'PUT', data })

export const login = (code) => post('/api/auth/login', { code })
export const getUserProfile = () => get('/api/user/profile')
export const updateUserProfile = (data) => put('/api/user/profile', data)

// 头像上传（使用 uni.uploadFile）
export const uploadAvatar = (filePath) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    console.log('[上传头像] 开始上传，文件路径:', filePath)
    console.log('[上传头像] 请求地址:', BASE_URL + '/api/user/avatar')
    console.log('[上传头像] Token:', token ? '有' : '无')
    
    uni.uploadFile({
      url: BASE_URL + '/api/user/avatar',
      filePath: filePath,
      name: 'file',
      header: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        console.log('[上传头像] HTTP状态码:', res.statusCode)
        console.log('[上传头像] 响应内容:', res.data)
        
        try {
          const data = JSON.parse(res.data)
          console.log('[上传头像] 解析后:', data)
          if (data.code === 200) {
            // 后端返回格式可能是 {avatarUrl: "..."} 或直接是 URL 字符串
            const avatarUrl = typeof data.data === 'string' ? data.data : data.data.avatarUrl
            console.log('[上传头像] 上传成功，返回URL:', avatarUrl)
            resolve(avatarUrl)
          } else {
            console.error('[上传头像] 上传失败:', data.message)
            reject(new Error(data.message))
          }
        } catch (e) {
          console.error('[上传头像] JSON解析失败:', e)
          reject(new Error('响应解析失败'))
        }
      },
      fail: (err) => {
        console.error('[上传头像] 请求失败:', err)
        reject(err)
      }
    })
  })
}
export const getDailyPoem = () => get('/api/poems/daily')
export const getPoems = (params) => get('/api/poems/search', params)
export const searchPoems = (params) => get('/api/poems/search', params)
export const getPoemDetail = (id) => get(`/api/poems/${id}`)
export const toggleFavorite = (id) => post(`/api/poems/${id}/favorite`)
export const getStudyProgress = () => get('/api/study/progress')
export const getStudyHistory = (params) => get('/api/study/history', params)
export const checkIn = () => post('/api/user/check-in')
export const getCheckInHistory = (year, month) => get('/api/user/check-in/history', { year, month })
export const getAchievements = () => get('/api/user/achievements')
export const getFavorites = (params) => get('/api/user/favorites', params)
export const getFeaturedMilestones = () => get('/api/milestones/featured')
export const getRecommendDynasties = () => get('/api/poems/dynasties/recommend')
export const getDailyTask = () => get('/api/poems/daily-task')
export const submitStudyRecord = (data) => post('/api/study/record', data)
export const getPoemTts = (id, vcn = 'x4_xiaoyan') => get(`/api/poems/${id}/tts`, { vcn })
export const getTtsVoices = () => get('/api/poems/tts/voices')
export const getAuthors = (params) => get('/api/authors', params)
export const getRecommendPoems = (id) => get(`/api/poems/${id}/recommend`)
export const getHotAuthors = () => get('/api/authors/hot')
export const getAuthorDetail = (id) => get(`/api/authors/${id}`)

// 项目/学习合集相关
export const createProject = (name) => post('/api/projects', { name })
export const addPoemToProject = (projectId, poemIds) => post(`/api/projects/${projectId}/poems`, { poemIds })
export const getProjects = () => get('/api/projects')
export const getCurrentProject = () => get('/api/projects/current')
export const getProjectDetail = (projectId) => get(`/api/projects/${projectId}`)
export const getProjectPoems = (projectId, params) => get(`/api/projects/${projectId}/poems`, params)
export const deleteProject = (projectId) => request({ url: `/api/projects/${projectId}`, method: 'DELETE' })
export const selectCurrentProject = (projectId) => post(`/api/projects/${projectId}/select`)
export const removePoemFromProject = (projectId, poemId) => request({ url: `/api/projects/${projectId}/poems/${poemId}`, method: 'DELETE' })
export const renameProject = (projectId, name) => put(`/api/projects/${projectId}/name`, { name })

export default request
