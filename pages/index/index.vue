<template>
  <view class="page">
    <!-- 搜索弹窗 -->
    <view class="search-popup" v-if="showSearch" @click="showSearch = false">
      <view class="search-box" @click.stop>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索诗词、作者..."
          confirm-type="search"
          @confirm="doSearch"
          focus
        />
        <text class="search-btn" @click="doSearch">搜索</text>
      </view>
      <!-- 初始提示 -->
      <view v-if="!searched" class="search-hint">
        <text>输入关键字搜索诗词与作者</text>
      </view>
      <scroll-view scroll-y class="search-results" v-else-if="searchResults.length > 0 || searchAuthors.length > 0">
        <!-- 作者搜索结果 -->
        <view v-if="searchAuthors.length > 0" class="search-section">
          <text class="search-section-title">相关作者</text>
          <view
            v-for="author in searchAuthors"
            :key="'a-' + author.authorId"
            class="search-author-item"
            @click="onSearchAuthorClick(author)"
          >
            <image v-if="author.avatarUrl" class="search-author-avatar" :src="author.avatarUrl" mode="aspectFill" />
            <view v-else class="search-author-avatar-placeholder">
              <text class="search-avatar-text">{{ author.name ? author.name[0] : '' }}</text>
            </view>
            <view class="search-author-info">
              <text class="search-author-name">{{ author.name }}</text>
              <text class="search-author-dynasty">{{ author.dynasty || '' }}</text>
            </view>
            <uni-icons type="right" size="16" color="#ccc" />
          </view>
        </view>
        <!-- 诗词搜索结果 -->
        <view v-if="searchResults.length > 0" class="search-section">
          <text class="search-section-title">相关诗词</text>
          <view
            v-for="poem in searchResults"
            :key="poem.poemId"
            class="card card-white search-card"
            @click="goToDetail(poem.poemId); showSearch = false"
          >
            <text class="card-title">{{ shortTitle(poem.title) }}</text>
            <text class="card-body">{{ poem.excerpt }}</text>
            <text class="card-author">{{ poem.author }} · {{ poem.dynasty }}</text>
          </view>
        </view>
      </scroll-view>
      <view v-else-if="searched && searchResults.length === 0 && searchAuthors.length === 0" class="search-empty">
        <text>未找到相关结果</text>
      </view>
    </view>

    <!-- 顶部导航栏（共用） -->
    <view class="navbar">
      <view class="navbar-left">
        <image v-if="userInfo && userInfo.avatarUrl" class="navbar-avatar" :src="userInfo.avatarUrl" mode="aspectFill" @click="currentTab = 'mine'" />
        <view v-else class="navbar-avatar" @click="currentTab = 'mine'" />
        <uni-icons type="search" size="24" color="#2a6e44" @click="openSearch" />
      </view>
      <text class="navbar-title">{{ navTitle }}</text>
      <view style="width:120rpx;" />
    </view> 

    <!-- 推荐页内容 -->
    <scroll-view v-if="currentTab === 'home'" scroll-y class="scroll-body">
      <!-- Banner -->
      <view class="banner" v-if="dailyPoem">
        <view class="banner-inner" :style="{ backgroundImage: 'url(' + dailyPoem.coverImage + ')' }">
          <view class="banner-overlay" />
          <view class="tag-red banner-tag-tl">
            <text class="tag-red-text">今日推荐</text>
          </view>

          <view class="banner-watermark">
            <text class="banner-watermark-text">LIVING SCROLL</text>
          </view>
          <view class="banner-body">
            <text class="banner-title">{{ shortTitle(dailyPoem.title) }}</text>
            <text class="banner-author">{{ dailyPoem.author }}·{{ dailyPoem.dynasty }}</text>
            <text class="banner-poem" v-for="(line, index) in (dailyPoem.content || '').split('\n')" :key="index">{{ line }}</text>
          </view>
          <view class="banner-btn-row">
            <view class="banner-btn" @click="goToDetail(dailyPoem.poemId)">
              <text class="banner-btn-text">深入研习</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 加载中 -->
      <view v-else class="banner-loading">
        <text>加载中...</text>
      </view>

      <!-- 热门选集 -->
      <view class="section">
        <view class="section-hd">
          <text class="section-title">热门选集</text>
        </view>
        <view class="col-main-card" v-if="recommendDynasties.length > 0" @click="onRecommendDynastyClick(recommendDynasties[0])">
          <view class="col-main-left">
            <text class="col-label">SELECTED</text>
            <text class="col-name">{{ recommendDynasties[0].dynasty }}</text>
            <text class="col-desc">精选{{ recommendDynasties[0].dynasty }}诗词，共{{ recommendDynasties[0].poemCount }}篇</text>
          </view>
          <view class="col-main-right">
            <view class="col-right-topbar" />
            <text class="col-right-text">{{ recommendDynasties[0].dynasty }}精選</text>
          </view>
        </view>
        <view class="col-small-row">
          <view class="col-small-card" v-for="(d, i) in recommendDynasties.slice(1, 3)" :key="i" @click="onRecommendDynastyClick(d)">
            <uni-icons type="bookmarks" size="28" color="#2a6e44" />
            <text class="col-small-name">{{ d.dynasty }}</text>
            <text class="col-small-desc">共{{ d.poemCount }}篇</text>
          </view>
        </view>
      </view>

      <!-- 热门作者 -->
      <view class="section">
        <view class="section-hd">
          <text class="section-title">热门作者</text>
          <view class="section-more" @click="goToAuthors">
            <text class="section-more-text">更多</text>
            <uni-icons type="right" size="14" color="#999" />
          </view>
        </view>
        <view class="author-row">
          <view class="author-card" v-for="a in authors" :key="a.authorId || a.name" @click="onHotAuthorClick(a)">
            <image v-if="a.avatarUrl" class="author-avatar-img" :src="a.avatarUrl" mode="aspectFill" />
            <view v-else class="author-avatar" />
            <text class="author-name">{{ a.name }}</text>
            <text class="author-sub">{{ a.dynasty || a.description || '' }}</text>
          </view>
        </view>
      </view>

      <!-- 时令特辑 -->
      <view class="section">
        <view class="special-card">
          <view class="special-left">
            <view class="tag-red special-tag">
              <text class="tag-red-text">时令特辑</text>
            </view>
            <text class="special-title">惊蛰·万物苏</text>
            <text class="special-desc">微雨众卉新，一雷惊蛰始。开启春季特别阅读之旅。</text>
          </view>
          <view class="special-btn">
            <uni-icons type="right" size="22" color="#fff" />
          </view>
        </view>
      </view>
      <view style="height:40rpx;" />
    </scroll-view>

    <!-- 文库页内容 -->
    <template v-if="currentTab === 'library'">
      <!-- 主分类 Tab -->
      <view class="lib-tabs">
        <view class="lib-tabs-left">
          <view
            v-for="t in libTabs" :key="t"
            class="lib-tab-item"
            :class="{ 'lib-tab-active': activeLibTab === t }"
            @click="onLibTabChange(t)"
          >
            <text class="lib-tab-text">{{ t }}</text>
            <view v-if="activeLibTab === t" class="lib-tab-line" />
          </view>
        </view>
        <!-- 批量选择按钮 -->
        <view class="batch-btn-inline" @click="toggleBatchMode">
          <uni-icons :type="batchMode ? 'checkbox' : 'checkbox-unchecked'" size="22" :color="batchMode ? '#fff' : '#2a6e44'" />
        </view>
      </view>
      <!-- 朝代子Tab -->
      <view v-if="activeLibTab === '朝代'" class="sub-tabs">
        <view
          v-for="d in dynastyTabs" :key="d"
          class="sub-tab-item"
          :class="{ 'sub-tab-active': activeDynasty === d }"
          @click="onDynastyChange(d)"
        >
          <text>{{ d }}</text>
        </view>
      </view>
      <!-- 体裁子Tab -->
      <view v-if="activeLibTab === '体裁'" class="sub-tabs">
        <view
          v-for="c in categoryTabs" :key="c"
          class="sub-tab-item"
          :class="{ 'sub-tab-active': activeCategory === c }"
          @click="onCategoryChange(c)"
        >
          <text>{{ c }}</text>
        </view>
      </view>
      <!-- 作者子Tab -->
      <view v-if="activeLibTab === '作者'" class="sub-tabs">
        <view
          v-for="a in authorTabs" :key="a"
          class="sub-tab-item"
          :class="{ 'sub-tab-active': activeAuthor === a }"
          @click="onAuthorChange(a)"
        >
          <text>{{ a }}</text>
        </view>
      </view>
      <scroll-view scroll-y class="scroll-body">
        <!-- 诗词列表 -->
        <view
          v-for="poem in poemsList"
          :key="poem.poemId"
          class="card card-white"
          :class="{ 'card-selected': selectedPoems.includes(poem.poemId) }"
          @click="batchMode ? togglePoemSelection(poem.poemId) : goToDetail(poem.poemId)"
        >
          <!-- 批量选择圆形框 -->
          <view v-if="batchMode" class="batch-checkbox" @click.stop="togglePoemSelection(poem.poemId)">
            <view class="batch-checkbox-inner" :class="{ 'batch-checkbox-checked': selectedPoems.includes(poem.poemId) }">
              <uni-icons v-if="selectedPoems.includes(poem.poemId)" type="checkmark" size="20" color="#fff" />
            </view>
          </view>
          <view class="side-tag"><text class="side-tag-text">{{ poem.dynasty }}</text></view>
          <view class="card-meta"><text class="meta-text">{{ poem.dynasty }} · 诗</text></view>
          <text class="card-title">{{ shortTitle(poem.title) }}</text>
          <text class="card-body">{{ poem.excerpt }}</text>
          <view class="card-footer">
            <text class="card-author">{{ poem.author }}</text>
            <text class="card-more">全文阅读 →</text>
          </view>
        </view>
        <!-- 加载状态 -->
        <view v-if="poemsLoading" class="loading-more">
          <text>加载中...</text>
        </view>
        <view v-if="!poemsLoading && poemsList.length === 0" class="loading-more">
          <text>暂无诗词</text>
        </view>
        <view style="height:40rpx;" />
      </scroll-view>
    </template>

    <!-- 研习页内容 -->
    <scroll-view v-if="currentTab === 'study'" scroll-y class="scroll-body">
      <view class="s-pad">
        <view class="days-card">
          <view class="days-left">
            <text class="days-label">研习天数</text>
            <view class="days-num-row">
              <text class="days-num">{{ studyProgress.studyDays }}</text>
              <text class="days-unit">日</text>
            </view>
          </view>
          <view class="days-wm">
            <text class="days-wm-text">学而时习之</text>
          </view>
        </view>
      </view>
      <view class="s-pad stat-row">
        <view class="stat-card bg-green">
          <text class="stat-label">已掌握诗词</text>
          <view class="stat-num-row">
            <text class="stat-num c-green">{{ studyProgress.learnedCount }}</text>
            <text class="stat-unit">首</text>
          </view>
        </view>
        <view class="stat-card bg-pink">
          <text class="stat-label">今日新学</text>
          <view class="stat-num-row">
            <text class="stat-num c-red">{{ studyProgress.todayLearnedCount }}</text>
            <text class="stat-unit">首</text>
          </view>
        </view>
      </view>
      <view class="s-pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" /><text class="mod-title">当前目标</text>
          </view>
          <text class="mod-action" @click="goToProjects">更换计划</text>
        </view>
        <view class="goal-card" @click="goToProjectDetail">
          <view class="goal-side-tag"><text class="goal-side-text">{{ selectedProjectName || '学习合集' }}</text></view>
          <text class="goal-name">{{ selectedProjectName || '选择学习合集' }}</text>
          <text class="goal-desc">{{ selectedProject ? selectedProject.poemCount + ' 首诗词 · 点击查看诗词' : '点击上方"更换计划"选择学习合集' }}</text>
          <view class="goal-prog-hd" v-if="selectedProject">
            <text class="goal-prog-label">研习进度 {{ selectedProject.poemCount ? Math.round((selectedProject.learnedCount || 0) / selectedProject.poemCount * 100) : 0 }}%</text>
            <text class="goal-prog-count">{{ selectedProject.learnedCount || 0 }} / {{ selectedProject.poemCount }}</text>
          </view>
          <view class="prog-track" v-if="selectedProject"><view class="prog-fill" :style="{ width: (selectedProject.poemCount ? Math.round((selectedProject.learnedCount || 0) / selectedProject.poemCount * 100) : 0) + '%' }" /></view>
        </view>
      </view>
      <view class="s-pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" /><text class="mod-title">今日课业</text>
          </view>
        </view>
        <view class="lesson-card" v-for="(p, i) in dailyTaskPoems" :key="p.poemId || i" :style="i > 0 ? 'margin-top:24rpx;' : ''" @click="goToDetail(p.poemId)">
          <view class="lesson-icon-wrap" :class="p.isLearned ? 'lesson-icon-done' : ''">
            <uni-icons v-if="p.isLearned" type="checkmarkempty" size="26" color="#fff" />
            <uni-icons v-else type="bookmarks" size="26" color="#2a6e44" />
          </view>
          <view class="lesson-info">
            <view class="lesson-hd">
              <view :class="['ltag', i % 2 === 0 ? 'ltag-light' : 'ltag-dark']"><text :class="['ltag-text', i % 2 === 0 ? 'ltag-light-text' : 'ltag-dark-text']">{{ i % 2 === 0 ? '背诵' : '赏析' }}</text></view>
              <text class="lesson-title">《{{ p.title }}》</text>
            </view>
            <text class="lesson-sub">{{ p.author }}·{{ p.dynasty }}</text>
          </view>
          <view v-if="p.isLearned" class="lesson-done-tag"><text class="lesson-done-text">已学完</text></view>
          <uni-icons v-else type="right" size="18" color="#ccc" />
        </view>
        <view v-if="dailyTaskPoems.length === 0" class="lesson-card">
          <view class="lesson-info">
            <text class="lesson-sub">暂无课业</text>
          </view>
        </view>
      </view>
      <view class="s-pad">
        <view class="mod-hd">
          <view class="mod-title-wrap">
            <view class="mod-bar" /><text class="mod-title">翰墨成就</text>
          </view>
          <text class="mod-action">{{ achievements.unlockedCount }}/{{ achievements.total }}</text>
        </view>
        <view class="badge-row" v-if="achievements.list.length > 0">
          <view class="badge-item" v-for="item in achievements.list" :key="item.achievementId" @click="showAchievementInfo(item)">
            <view class="badge" :class="item.isUnlocked ? 'badge-on' : 'badge-off'">
              <text class="badge-text" :class="item.isUnlocked ? 'badge-text-on' : 'badge-text-off'">{{ item.title }}</text>
              <view class="badge-icon" v-if="item.isUnlocked">
                <uni-icons type="star-filled" size="14" color="#e6a23c" />
              </view>
              <view class="badge-icon badge-icon-lock" v-else>
                <uni-icons type="locked" size="12" color="#bbb" />
              </view>
            </view>
            <text class="badge-status" :class="{ 'badge-status-off': !item.isUnlocked }">{{ item.isUnlocked ? '已达成' : '未解锁' }}</text>
          </view>
        </view>
        <view class="badge-row" v-else>
          <view class="badge-item">
            <view class="badge badge-off"><text class="badge-text badge-text-off">暂无成就</text></view>
          </view>
        </view>
      </view>
      <view style="height:40rpx;" />
    </scroll-view>

    <!-- 我的页内容 -->
    <scroll-view v-if="currentTab === 'mine'" scroll-y class="scroll-body">
      <!-- 用户信息区 -->
      <view class="mine-user-area">
        <view class="mine-avatar-wrap">
          <image v-if="userInfo && userInfo.avatarUrl" class="mine-avatar" :src="userInfo.avatarUrl" mode="aspectFill" />
          <view v-else class="mine-avatar" />
          <view class="mine-cert-tag">
            <text class="mine-cert-text">雅士｜认证</text>
          </view>
        </view>
        <text class="mine-username">{{ userInfo && userInfo.nickname || '未设置昵称' }}</text>
        <view class="mine-stats-row">
          <view class="mine-stat-card">
            <text class="mine-stat-label">收藏文章</text>
            <view class="mine-stat-num-row">
              <text class="mine-stat-num">{{ mineStats.favCount }}</text>
              <text class="mine-stat-unit">篇</text>
            </view>
          </view>
          <view class="mine-stat-card">
            <text class="mine-stat-label">研习天数</text>
            <view class="mine-stat-num-row">
              <text class="mine-stat-num">{{ mineStats.studyDays }}</text>
              <text class="mine-stat-unit">日</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="mine-menu-list">
        <view class="mine-menu-item" v-for="item in menuItems" :key="item.label" @click="onMenu(item)">
          <view class="mine-menu-icon-wrap" :style="{ background: item.iconBg }">
            <uni-icons :type="item.icon" size="22" :color="item.iconColor" />
          </view>
          <text class="mine-menu-label">{{ item.label }}</text>
          <uni-icons type="right" size="16" color="#ccc" />
        </view>
      </view>

      <!-- 底部诗句 + 退出 -->
      <view class="mine-footer">
        <view class="mine-divider-wrap">
          <view class="mine-divider-line" />
          <view class="mine-divider-dot" />
        </view>
        <text class="mine-poem">回首向来萧瑟处</text>
        <text class="mine-poem">归去</text>
        <text class="mine-poem">也无风雨也无晴</text>
        <view class="mine-logout" @click="onLogout">
          <uni-icons type="redo" size="18" color="#b82e2e" />
          <text class="mine-logout-text">退出登录</text>
        </view>
      </view>
      <view style="height:40rpx;" />
    </scroll-view>

    <!-- 底部导航（共用） -->
    <view class="tabbar" :class="{ 'tabbar-hidden': batchMode }">
      <view class="tab" :class="{ 'active-tab': currentTab === 'home' }" @click="currentTab = 'home'">
        <view v-if="currentTab === 'home'" class="tab-icon-wrap">
          <uni-icons type="home" size="22" color="#fff" />
        </view>
        <uni-icons v-else type="home" size="24" color="#999" />
        <text class="tab-text" :class="{ 'active-tab-text': currentTab === 'home' }">推荐</text>
      </view>
      <view class="tab" :class="{ 'active-tab': currentTab === 'library' }" @click="currentTab = 'library'">
        <view v-if="currentTab === 'library'" class="tab-icon-wrap">
          <uni-icons type="list" size="22" color="#fff" />
        </view>
        <uni-icons v-else type="list" size="24" color="#999" />
        <text class="tab-text" :class="{ 'active-tab-text': currentTab === 'library' }">文库</text>
      </view>
      <view class="tab" :class="{ 'active-tab': currentTab === 'study' }" @click="currentTab = 'study'">
        <view v-if="currentTab === 'study'" class="tab-icon-wrap">
          <uni-icons type="compose" size="22" color="#fff" />
        </view>
        <uni-icons v-else type="compose" size="24" color="#999" />
        <text class="tab-text" :class="{ 'active-tab-text': currentTab === 'study' }">研习</text>
      </view>
      <view class="tab" :class="{ 'active-tab': currentTab === 'mine' }" @click="currentTab = 'mine'">
        <view v-if="currentTab === 'mine'" class="tab-icon-wrap">
          <uni-icons type="person" size="22" color="#fff" />
        </view>
        <uni-icons v-else type="person" size="24" color="#999" />
        <text class="tab-text" :class="{ 'active-tab-text': currentTab === 'mine' }">我的</text>
      </view>
    </view>

    <!-- 批量操作底部栏 -->
    <view v-if="batchMode" class="batch-action-bar">
      <text class="batch-count">已选 {{ selectedPoems.length }} 首{{ batchTargetProjectName ? ' → ' + batchTargetProjectName : '' }}</text>
      <view class="batch-btns">
        <view class="batch-btn-cancel" @click="toggleBatchMode">
          <text>取消</text>
        </view>
        <view v-if="batchTargetProjectId" class="batch-btn-confirm" @click="confirmBatchAddToProject">
          <text>添加到「{{ batchTargetProjectName }}」</text>
        </view>
        <view v-else class="batch-btn-confirm" @click="showCollectionInput">
          <text>添加到学习合集</text>
        </view>
      </view>
    </view>

    <!-- 合集选择弹窗 -->
    <view v-if="showCollectionDialog" class="collection-dialog-mask" @click="cancelCollection">
      <view class="collection-popup-main" @click.stop>
        <view class="popup-header">
          <text class="popup-title">添加到学习合集</text>
          <text class="popup-subtitle">已选择 {{ selectedPoems.length }} 首诗词</text>
          <view class="popup-close" @click="cancelCollection">
            <uni-icons type="close" size="20" color="#999" />
          </view>
        </view>

        <!-- 已有合集列表 -->
        <view class="popup-section">
          <text class="popup-section-title">已有合集</text>
          <view v-if="projectsLoading" class="popup-empty">
            <text class="popup-empty-text">加载中...</text>
          </view>
          <view v-else-if="projects.length === 0" class="popup-empty">
            <text class="popup-empty-text">暂无合集，请先创建</text>
          </view>
          <scroll-view v-else scroll-y style="max-height: 360rpx;">
            <view
              v-for="project in projects"
              :key="project.projectId"
              class="project-item"
              :class="{ 'project-item-selected': selectedProjectId === project.projectId }"
              @click="selectProject(project)"
            >
              <view class="project-item-icon">
                <uni-icons type="star" size="20" :color="selectedProjectId === project.projectId ? '#fff' : '#2a6e44'" />
              </view>
              <view class="project-item-info">
                <text class="project-item-name">{{ project.name }}</text>
                <text class="project-item-meta">{{ project.poemCount || 0 }} 首诗词</text>
              </view>
              <uni-icons v-if="selectedProjectId === project.projectId" type="checkmark" size="20" color="#2a6e44" />
            </view>
          </scroll-view>
        </view>

        <!-- 创建新合集 -->
        <view class="popup-section">
          <text class="popup-section-title">创建新合集</text>
          <view class="new-project-input">
            <input
              class="collection-input"
              v-model="collectionName"
              placeholder="输入新合集名称"
              maxlength="20"
            />
            <view class="input-btn" @click="createAndAdd">
              <text class="input-btn-text">创建并添加</text>
            </view>
          </view>
        </view>

        <!-- 确认添加到已有合集 -->
        <view class="popup-footer" v-if="selectedProjectId">
          <view class="confirm-btn" @click="confirmAddToProject">
            <text class="confirm-btn-text">确认添加到已有合集</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 成就详情弹窗 -->
    <view v-if="showAchievementPopup && selectedAchievement" class="achievement-popup-mask" @click="showAchievementPopup = false">
      <view class="achievement-popup" @click.stop>
        <view class="ach-popup-hd">
          <view class="ach-popup-badge" :class="selectedAchievement.isUnlocked ? 'badge-on' : 'badge-off'">
            <text class="badge-text" :class="selectedAchievement.isUnlocked ? 'badge-text-on' : 'badge-text-off'">{{ selectedAchievement.title }}</text>
          </view>
          <view class="ach-popup-status" v-if="selectedAchievement.isUnlocked">
            <uni-icons type="checkmarkempty" size="16" color="#b82e2e" />
            <text class="ach-popup-status-text ach-unlocked">已达成</text>
          </view>
          <view class="ach-popup-status" v-else>
            <text class="ach-popup-status-text ach-locked">未解锁</text>
          </view>
        </view>
        <view class="ach-popup-desc">
          <text class="ach-popup-desc-label">达成条件</text>
          <text class="ach-popup-desc-text">{{ selectedAchievement.description }}</text>
        </view>
        <view class="ach-popup-time" v-if="selectedAchievement.isUnlocked && selectedAchievement.unlockedAt">
          <text class="ach-popup-time-text">达成时间：{{ selectedAchievement.unlockedAt }}</text>
        </view>
        <view class="ach-popup-btn" @click="showAchievementPopup = false">
          <text class="ach-popup-btn-text">我知道了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserProfile, getDailyPoem, getPoems, searchPoems, createProject, addPoemToProject, getCurrentProject, getProjects, getHotAuthors, getAuthors, getRecommendDynasties, getDailyTask, getStudyProgress, getAchievements, getFavorites, getStudyHistory } from '@/utils/request.js'

export default {
  computed: {
    navTitle() {
      const map = { home: '值得看么', library: '值得看么', study: '研习', mine: '值得看么' }
      return map[this.currentTab] || '值得看么'
    }
  },
  data() {
    return {
      userInfo: null,
      dailyPoem: null,
      currentTab: 'home',
      poemsList: [],
      poemsPage: 1,
      poemsPageSize: 20,
      poemsLoading: false,
      showSearch: false,
      searchKeyword: '',
      searchResults: [],
      searchAuthors: [],
      searched: false,
      authors: [],
      recommendDynasties: [],
      libTabs: ['朝代', '体裁', '作者'],
      dynastyTabs: ['全部', '唐代', '宋代', '先秦', '近现代', '魏晋', '五代', '元代', '两汉', '南北朝', '清代', '明代', '金朝', '隋代'],
      categoryTabs: ['全部', '诗', '词', '曲', '文'],
      authorTabs: ['全部'],
      activeDynasty: '全部',
      activeCategory: '全部',
      activeAuthor: '全部',
      activeLibTab: '朝代',
      activeDynasty: '全部',
      activeCategory: '全部',
      menuItems: [
        { label: '我的学习合集', icon: 'star',    iconColor: '#2a6e44', iconBg: '#e6f2e9' },
        { label: '我的收藏', icon: 'bookmark',   iconColor: '#2a6e44', iconBg: '#e6f2e9' },
        { label: '研习历史', icon: 'reload',     iconColor: '#b82e2e', iconBg: '#fdecea' },
        { label: '每日打卡', icon: 'calendar',   iconColor: '#e07820', iconBg: '#fef3e6' },
        { label: '系统设置', icon: 'gear',       iconColor: '#888',    iconBg: '#f0f0f0' },
        { label: '隐私协议', icon: 'locked',     iconColor: '#888',    iconBg: '#f0f0f0' }
      ],
      // 批量处理相关
      batchMode: false,
      selectedPoems: [],
      batchTargetProjectId: null,
      batchTargetProjectName: '',
      // 合集命名弹窗
      showCollectionDialog: false,
      collectionName: '',
      // 已有合集列表
      projects: [],
      projectsLoading: false,
      selectedProjectId: null,
      // 选中的学习合集
      selectedProject: null,
      selectedProjectId: null,
      selectedProjectName: '',
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
    }
  },
  watch: {
    currentTab(newTab) {
      console.log('[首页] 切换Tab:', newTab)
      if (newTab === 'library' && this.poemsList.length === 0) {
        this.fetchPoems()
      }
      if (newTab === 'study') {
        this.fetchCurrentProject()
        this.fetchDailyTask()
        this.fetchStudyProgress()
        this.fetchAchievements()
      }
    }
  },
  onLoad(options) {
    this.fetchUserProfile()
    this.fetchDailyPoem()
    this.fetchHotAuthors()
    this.fetchRecommendDynasties()
    this.fetchAchievements()
    // 监听合集诗词被移除事件
    uni.$on('onProjectPoemRemoved', (data) => {
      console.log('[首页] 收到合集诗词移除事件', data)
      if (this.selectedProject && this.selectedProject.projectId === data.projectId) {
        this.selectedProject.poemCount = data.poemCount
      }
    })
    // 监听其他页面跳转到"我的"
    uni.$on('goToMine', () => {
      this.currentTab = 'mine'
    })
    // 从学习合集详情页跳转过来，自动进入批量添加模式
    if (options && options.batchProjectId) {
      this.batchTargetProjectId = parseInt(options.batchProjectId)
      this.batchTargetProjectName = options.batchProjectName ? decodeURIComponent(options.batchProjectName) : ''
      this.currentTab = 'library'
      this.batchMode = true
      this.selectedPoems = []
    }
  },
  onUnload() {
    uni.$off('onProjectPoemRemoved')
    uni.$off('goToMine')
  },
  onShow() {
    // 每次显示页面时刷新用户信息
    this.fetchUserProfile()
    // 刷新我的页面统计
    this.fetchMineStats()
    // 每次显示页面时刷新当前选中的学习合集
    this.fetchCurrentProject()
    // 每次显示页面时刷新研习进度
    if (this.currentTab === 'study') {
      this.fetchStudyProgress()
      this.fetchDailyTask()
      this.fetchAchievements()
    }
  },
  computed: {
    navTitle() {
      const map = { home: '值得看么', library: '值得看么', study: '研习', mine: '值得看么' }
      return map[this.currentTab] || '值得看么'
    }
  },
  methods: {
    async fetchHotAuthors() {
      try {
        const data = await getHotAuthors()
        console.log('[热门作者] 原始返回:', data)
        const list = data.list || data || []
        // 本地头像映射：按名字匹配，再按位置分配
        const avatarMap = {
          '李白': '/static/author_libai.png',
          '杜甫': '/static/author_dufu.png',
          '苏轼': '/static/author_sushi.png'
        }
        const fallbackAvatars = ['/static/author_libai.png', '/static/author_dufu.png', '/static/author_sushi.png']
        this.authors = list.map((a, i) => ({
          ...a,
          avatarUrl: avatarMap[a.name] || a.avatarUrl || (i < 3 ? fallbackAvatars[i] : '')
        }))
        // 动态生成作者子Tab
        if (list.length > 0) {
          this.authorTabs = ['全部', ...list.map(a => a.name)]
        }
      } catch (err) {
        console.error('[热门作者] 获取失败:', err)
      }
    },
    async fetchRecommendDynasties() {
      try {
        const data = await getRecommendDynasties()
        console.log('[推荐朝代] 原始返回:', data)
        const list = data.list || data || []
        this.recommendDynasties = list
      } catch (err) {
        console.error('[推荐朝代] 获取失败:', err)
      }
    },
    async fetchDailyTask() {
      try {
        const data = await getDailyTask()
        console.log('[每日课业] 原始返回:', JSON.stringify(data))
        const poems = data.poems || data.list || data || []
        // 获取已学诗词ID集合，用于标记已学完
        let learnedIds = new Set()
        try {
          const historyData = await getStudyHistory({ page: 1, pageSize: 200 })
          const historyList = historyData.list || historyData || []
          historyList.forEach(item => {
            if (item.poemId) learnedIds.add(item.poemId)
          })
        } catch (e) {
          console.error('[每日课业] 获取研习历史失败:', e)
        }
        this.dailyTaskPoems = poems.map(p => ({
          ...p,
          isLearned: learnedIds.has(p.poemId)
        }))
        console.log('[每日课业] 处理后:', JSON.stringify(this.dailyTaskPoems.map(p => ({ poemId: p.poemId, title: p.title, isLearned: p.isLearned }))))
      } catch (err) {
        console.error('[每日课业] 获取失败:', err)
      }
    },
    async fetchStudyProgress() {
      try {
        const data = await getStudyProgress()
        console.log('[研习进度] 原始返回:', data)
        this.studyProgress = {
          studyDays: data.studyDays || 0,
          learnedCount: data.learnedCount || 0,
          todayLearnedCount: data.todayLearnedCount || 0
        }
      } catch (err) {
        console.error('[研习进度] 获取失败:', err)
      }
    },
    async fetchAchievements() {
      try {
        const data = await getAchievements()
        console.log('[成就] 原始返回:', JSON.stringify(data))
        const list = (data.achievements || data.list || []).map(item => {
          // 兼容 isUnlocked / unlocked / status 等字段名
          const unlocked = item.isUnlocked === true || item.isUnlocked === 1 || item.unlocked === true || item.unlocked === 1 || item.status === 'UNLOCKED'
          return {
            ...item,
            isUnlocked: unlocked
          }
        })
        this.achievements = {
          total: data.total || list.length,
          unlockedCount: data.unlockedCount || list.filter(a => a.isUnlocked).length,
          list
        }
        console.log('[成就] 处理后:', JSON.stringify(this.achievements))
      } catch (err) {
        console.error('[成就] 获取失败:', err)
      }
    },
    showAchievementInfo(item) {
      this.selectedAchievement = item
      this.showAchievementPopup = true
    },
    async fetchMineStats() {
      try {
        const [favRes, progressRes] = await Promise.all([
          getFavorites({ page: 1, pageSize: 1 }),
          getStudyProgress()
        ])
        this.mineStats.favCount = favRes.total || 0
        this.mineStats.studyDays = progressRes.studyDays || 0
      } catch (err) {
        console.error('[我的统计] 获取失败:', err)
      }
    },
    async fetchUserProfile() {
      try {
        const data = await getUserProfile()
        console.log('[获取用户信息] 成功:', data)
        this.userInfo = {
          nickname: data.nickname,
          avatarUrl: data.avatarUrl
        }
        // 保存到本地存储
        uni.setStorageSync('userInfo', this.userInfo)
      } catch (err) {
        console.error('[获取用户信息] 失败:', err)
        // 尝试从本地存储读取
        const localUserInfo = uni.getStorageSync('userInfo')
        if (localUserInfo) {
          this.userInfo = localUserInfo
        }
      }
    },
    async fetchDailyPoem() {
      try {
        const data = await getDailyPoem()
        console.log('[获取每日推荐] 成功:', data)
        this.dailyPoem = data
      } catch (err) {
        console.error('[获取每日推荐] 失败:', err)
      }
    },
    async fetchCurrentProject() {
      console.log('[研习Tab] 开始获取当前选中项目...')
      try {
        const current = await getCurrentProject()
        console.log('[研习Tab] API返回数据:', JSON.stringify(current))
        
        if (current && current.projectId) {
          this.selectedProject = current
          this.selectedProjectId = current.projectId
          this.selectedProjectName = current.name
          console.log('[研习Tab] 设置选中合集:', current.name, 'poemCount:', current.poemCount)
        } else {
          this.selectedProject = null
          this.selectedProjectId = null
          this.selectedProjectName = ''
          console.log('[研习Tab] 暂无选中的合集')
        }
      } catch (err) {
        console.error('[研习Tab] 获取当前合集失败:', err)
        this.selectedProject = null
        this.selectedProjectId = null
        this.selectedProjectName = ''
      }
    },
    async fetchPoems() {
      if (this.poemsLoading) return
      this.poemsLoading = true
      try {
        const params = {
          page: this.poemsPage,
          pageSize: this.poemsPageSize
        }
        // 根据Tab添加筛选参数
        if (this.activeLibTab === '朝代' && this.activeDynasty !== '全部') {
          params.dynasty = this.activeDynasty
        }
        if (this.activeLibTab === '体裁' && this.activeCategory !== '全部') {
          params.category = this.activeCategory
        }
        if (this.activeLibTab === '作者' && this.activeAuthor !== '全部') {
          params.q = this.activeAuthor
        }
        console.log('[获取诗词列表] 参数:', params)
        const data = await getPoems(params)
        console.log('[获取诗词列表] 成功:', data)
        this.poemsList = data.list || []
      } catch (err) {
        console.error('[获取诗词列表] 失败:', err)
      } finally {
        this.poemsLoading = false
      }
    },
    openSearch() {
      this.searchKeyword = ''
      this.searchResults = []
      this.searchAuthors = []
      this.searched = false
      this.showSearch = true
    },
    onLibTabChange(tab) {
      this.activeLibTab = tab
      this.poemsPage = 1
      this.poemsList = []
      this.fetchPoems()
    },
    onDynastyChange(dynasty) {
      this.activeDynasty = dynasty
      this.poemsPage = 1
      this.poemsList = []
      this.fetchPoems()
    },
    onCategoryChange(category) {
      this.activeCategory = category
      this.poemsPage = 1
      this.poemsList = []
      this.fetchPoems()
    },
    onAuthorChange(author) {
      this.activeAuthor = author
      this.poemsPage = 1
      this.poemsList = []
      this.fetchPoems()
    },
    onHotAuthorClick(author) {
      if (author.authorId) {
        uni.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` })
      } else {
        this.currentTab = 'library'
        this.activeLibTab = '作者'
        this.activeAuthor = author.name
        this.poemsPage = 1
        this.poemsList = []
        this.fetchPoems()
      }
    },
    onSearchAuthorClick(author) {
      this.showSearch = false
      if (author.authorId) {
        uni.navigateTo({ url: `/pages/author-detail/index?id=${author.authorId}` })
      } else {
        this.currentTab = 'library'
        this.activeLibTab = '作者'
        this.activeAuthor = author.name
        this.poemsPage = 1
        this.poemsList = []
        this.fetchPoems()
      }
    },
    onRecommendDynastyClick(item) {
      this.currentTab = 'library'
      this.activeLibTab = '朝代'
      this.activeDynasty = item.dynasty
      this.poemsPage = 1
      this.poemsList = []
      this.fetchPoems()
    },
    async doSearch() {
      if (!this.searchKeyword.trim()) return
      this.searchResults = []
      this.searchAuthors = []
      this.searched = true
      // 同时搜索诗词和作者
      const poemPromise = searchPoems({ q: this.searchKeyword, page: 1, pageSize: 50 }).then(data => {
        this.searchResults = data.list || []
      }).catch(err => {
        console.error('[搜索诗词] 失败:', err)
      })
      const authorPromise = getAuthors({ q: this.searchKeyword }).then(data => {
        console.log('[搜索作者] 成功:', data)
        this.searchAuthors = data.list || data || []
      }).catch(err => {
        console.error('[搜索作者] 失败:', err)
      })
      await Promise.all([poemPromise, authorPromise])
    },
    shortTitle(title, maxLen = 5) {
      if (!title) return ''
      return title.length > maxLen ? title.slice(0, maxLen) + '……' : title
    },
    goToDetail(poemId) {
      uni.navigateTo({ url: `/pages/detail/index?id=${poemId}` })
    },
    onMenu(item) {
      if (item.label === '系统设置') {
        uni.navigateTo({ url: '/pages/settings/index' })
        return
      }
      if (item.label === '隐私协议') {
        uni.navigateTo({ url: '/pages/privacy/index' })
        return
      }
      if (item.label === '每日打卡') {
        uni.navigateTo({ url: '/pages/checkin/index' })
        return
      }
      if (item.label === '我的收藏') {
        uni.navigateTo({ url: '/pages/favorites/index' })
        return
      }
      if (item.label === '研习历史') {
        uni.navigateTo({ url: '/pages/history/index' })
        return
      }
      if (item.label === '我的学习合集') {
        uni.navigateTo({ url: '/pages/projects/index' })
        return
      }
      uni.showToast({ title: item.label, icon: 'none' })
    },
    onLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) uni.reLaunch({ url: '/pages/login/index' })
        }
      })
    },
    // 切换批量选择模式
    toggleBatchMode() {
      this.batchMode = !this.batchMode
      if (!this.batchMode) {
        this.selectedPoems = []
        this.batchTargetProjectId = null
        this.batchTargetProjectName = ''
      }
    },
    // 直接添加到预设的学习合集（从合集详情页跳过来的场景）
    async confirmBatchAddToProject() {
      if (this.selectedPoems.length === 0) {
        uni.showToast({ title: '请先选择诗词', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '添加中...' })
        await addPoemToProject(this.batchTargetProjectId, this.selectedPoems)
        uni.hideLoading()
        uni.showToast({ title: `已添加${this.selectedPoems.length}首诗词`, icon: 'success' })
        this.batchMode = false
        this.selectedPoems = []
        this.batchTargetProjectId = null
        this.batchTargetProjectName = ''
        uni.$emit('onProjectUpdated')
      } catch (err) {
        uni.hideLoading()
        console.error('[批量添加] 失败:', err)
        uni.showToast({ title: '添加失败', icon: 'none' })
      }
    },
    // 切换诗词选中状态
    togglePoemSelection(poemId) {
      const index = this.selectedPoems.indexOf(poemId)
      if (index > -1) {
        this.selectedPoems.splice(index, 1)
      } else {
        this.selectedPoems.push(poemId)
      }
    },
    // 添加到学习合集
    addToCollection() {
      if (this.selectedPoems.length === 0) {
        uni.showToast({ title: '请先选择诗词', icon: 'none' })
        return
      }
      // TODO: 接入API
      console.log('[批量添加] 合集名称:', this.collectionName, '诗词ID:', this.selectedPoems)
      uni.showToast({
        title: `已添加到"${this.collectionName}"`,
        icon: 'success'
      })
      this.batchMode = false
      this.selectedPoems = []
      this.collectionName = ''
    },
    // 显示合集弹窗
    async showCollectionInput() {
      if (this.selectedPoems.length === 0) {
        uni.showToast({ title: '请先选择诗词', icon: 'none' })
        return
      }
      this.collectionName = ''
      this.selectedProjectId = null
      this.projects = []
      this.showCollectionDialog = true

      // 加载已有合集列表
      this.projectsLoading = true
      try {
        const data = await getProjects()
        console.log('[首页] getProjects 原始返回:', JSON.stringify(data))
        if (Array.isArray(data)) {
          this.projects = data
        } else if (data && Array.isArray(data.list)) {
          this.projects = data.list
        } else if (data && Array.isArray(data.records)) {
          this.projects = data.records
        } else if (data && typeof data === 'object') {
          const keys = Object.keys(data)
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              this.projects = data[key]
              break
            }
          }
          if (this.projects.length === 0 && data.projectId) {
            this.projects = [data]
          }
        }
        console.log('[首页] 合集列表:', this.projects, '数量:', this.projects.length)
      } catch (err) {
        console.error('[首页] 获取合集失败:', err)
        this.projects = []
      } finally {
        this.projectsLoading = false
      }
    },
    // 取消合集弹窗
    cancelCollection() {
      this.showCollectionDialog = false
      this.collectionName = ''
      this.selectedProjectId = null
    },
    // 选择已有合集
    selectProject(project) {
      this.selectedProjectId = project.projectId
    },
    // 确认添加到已有合集
    async confirmAddToProject() {
      if (!this.selectedProjectId) {
        uni.showToast({ title: '请先选择合集', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '添加中...' })
        await addPoemToProject(this.selectedProjectId, this.selectedPoems)
        console.log('[首页] 添加诗词到合集成功')
        uni.hideLoading()

        uni.showToast({ title: '添加成功', icon: 'success' })
        this.showCollectionDialog = false
        this.batchMode = false
        this.selectedPoems = []
        this.selectedProjectId = null
        uni.$emit('onProjectUpdated')
      } catch (err) {
        uni.hideLoading()
        console.error('[首页] 添加失败:', err)
        uni.showToast({ title: '添加失败', icon: 'none' })
      }
    },
    // 创建新合集并添加
    async createAndAdd() {
      if (!this.collectionName.trim()) {
        uni.showToast({ title: '请输入合集名称', icon: 'none' })
        return
      }
      try {
        uni.showLoading({ title: '创建中...' })
        const project = await createProject(this.collectionName.trim())
        console.log('[首页] 创建合集成功:', project)
        uni.hideLoading()

        const projectId = project.projectId || project.id || project
        await addPoemToProject(projectId, this.selectedPoems)
        console.log('[首页] 添加诗词到新合集成功')

        uni.showToast({ title: '创建并添加成功', icon: 'success' })
        this.showCollectionDialog = false
        this.batchMode = false
        this.selectedPoems = []
        this.selectedProjectId = null
        uni.$emit('onProjectUpdated')
      } catch (err) {
        uni.hideLoading()
        console.error('[首页] 创建/添加失败:', err)
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    // 跳转到学习合集列表页面
    goToProjects() {
      uni.navigateTo({ url: '/pages/projects/index' })
    },
    goToAuthors() {
      uni.navigateTo({ url: '/pages/authors/index' })
    },
    // 跳转到当前选中合集的诗词列表
    goToProjectDetail() {
      if (!this.selectedProjectId) {
        // 如果没有选中合集，跳转到选择页面
        this.goToProjects()
        return
      }
      uni.navigateTo({
        url: `/pages/project-detail/index?projectId=${this.selectedProjectId}&name=${encodeURIComponent(this.selectedProjectName)}`
      })
    }
  }
}
</script>

<style lang="scss">
$green:     #2a6e44;
$red:       #b82e2e;
$bg:        #f8f5ee;
$dark:      #1a1a1a;
$gray:      #666666;
$card:      #ffffff;
$font:      'PingFang SC', 'Noto Sans SC', 'Source Han Sans CN', -apple-system, sans-serif;
$font-bold: 'STSong', 'SimSun', 'Songti SC', 'Source Han Serif CN', serif;

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $bg;
  font-family: $font;
}

/* 搜索弹窗 */
.search-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  padding-top: 120rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 40rpx;
  border-radius: 24rpx;
  padding: 20rpx 30rpx;
}

.search-input {
  flex: 1;
  font-size: 32rpx;
  height: 72rpx;
}

.search-btn {
  font-size: 32rpx;
  color: $green;
  padding-left: 20rpx;
}

.search-results {
  max-height: calc(100vh - 300rpx);
  margin-top: 24rpx;
  padding: 0 40rpx;
}

.search-section {
  margin-bottom: 24rpx;
}

.search-section-title {
  display: block;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  padding-left: 4rpx;
}

.search-author-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.search-author-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.search-author-avatar-placeholder {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #2a6e44;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .search-avatar-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
  }
}

.search-author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;

  .search-author-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
  }

  .search-author-dynasty {
    font-size: 24rpx;
    color: #999;
  }
}

.search-card {
  margin-bottom: 16rpx;
}

.search-empty {
  text-align: center;
  padding: 80rpx 0;
  color: $gray;
  font-size: 28rpx;
}

.search-hint {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 40rpx;
  padding-top: 70rpx;
  background: $bg;
  position: relative;
  z-index: 10;

  .navbar-title {
    font-size: 36rpx;
    font-weight: 500;
    color: $green;
    letter-spacing: 2rpx;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .navbar-avatar {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: $dark;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .navbar-search {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.scroll-body { flex: 1; overflow: hidden; }

/* ── Banner ── */
.banner {
  margin: 62rpx 40rpx 0;

  .banner-inner {
    border-radius: 40rpx;
    height: 760rpx;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg,
      rgba(210,155,70,0.9) 0%,
      rgba(140,160,90,0.85) 45%,
      rgba(50,90,65,0.95) 100%
    );
    background-size: cover;
    background-position: center;
  }

  .banner-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12));
    z-index: 1;
    pointer-events: none;
  }

  .banner-tag-tl {
    position: absolute;
    top: 28rpx; left: 28rpx;
    z-index: 3;
  }

  .banner-tag-tr {
    position: absolute;
    top: 0; right: 28rpx;
    z-index: 3;
    width: 60rpx;
    background: $red;
    border-radius: 0 0 12rpx 12rpx;
    padding: 12rpx 0 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .banner-tag-tr-text {
      color: #fff;
      font-size: 22rpx;
      writing-mode: vertical-rl;
      letter-spacing: 6rpx;
      font-weight: 400;
    }
  }

  .banner-watermark {
    position: absolute;
    right: -30rpx; top: 50%;
    transform: translateY(-50%) rotate(90deg);
    z-index: 2;
    pointer-events: none;

    .banner-watermark-text {
      font-size: 24rpx;
      color: #aaa;
      letter-spacing: 8rpx;
      opacity: 0.6;
    }
  }

  .banner-body {
    position: absolute;
    z-index: 2;
    top: 50%; left: 0; right: 0;
    transform: translateY(-60%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .banner-title {
      font-size: 96rpx;
      font-weight: 700;
      color: $green;
      letter-spacing: 10rpx;
      line-height: 1.1;
      font-family: $font-bold;
    }

    .banner-author {
      font-size: 34rpx;
      color: rgba(255,255,255,0.75);
      margin-top: 16rpx;
      margin-bottom: 48rpx;
      letter-spacing: 2rpx;
    }

    .banner-poem {
      font-size: 34rpx;
      color: #2a2a2a;
      line-height: 56rpx;
      letter-spacing: 2rpx;
      text-align: center;
    }
  }

  .banner-btn-row {
    position: absolute;
    bottom: 48rpx; left: 0; right: 0;
    z-index: 3;
    display: flex;
    justify-content: center;

    .banner-btn {
      background: $green;
      border-radius: 24rpx;
      width: 320rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);

      .banner-btn-text {
        color: #fff;
        font-size: 32rpx;
        font-weight: 500;
        letter-spacing: 4rpx;
      }
    }
  }
}

.banner-loading {
  margin: 40rpx 40rpx 0;
  height: 760rpx;
  border-radius: 40rpx;
  background: linear-gradient(180deg, rgba(210,155,70,0.5) 0%, rgba(50,90,65,0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
}

/* 红色标签 */
.tag-red {
  display: inline-flex;
  background: $red;
  border-radius: 12rpx;
  padding: 8rpx 24rpx;

  .tag-red-text {
    color: #fff;
    font-size: 26rpx;
    font-weight: 500;
  }
}

/* Section */
.section {
  padding: 48rpx 40rpx 0;

  .section-hd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .section-title {
      font-size: 48rpx;
      font-weight: 600;
      color: $dark;
      font-family: $font-bold;
    }

    .section-more {
      display: flex;
      align-items: center;
      gap: 4rpx;

      .section-more-text {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}

/* 选集大卡片 */
.col-main-card {
  background: $card;
  border-radius: 40rpx;
  padding: 40rpx 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .col-main-left {
    flex: 1;
    margin-right: 24rpx;

    .col-label {
      display: block;
      font-size: 26rpx;
      color: $gray;
      letter-spacing: 2rpx;
      margin-bottom: 8rpx;
    }

    .col-name {
      display: block;
      font-size: 44rpx;
      font-weight: 600;
      color: $dark;
      margin-bottom: 16rpx;
      font-family: $font-bold;
    }

    .col-desc {
      display: block;
      font-size: 30rpx;
      color: $gray;
      line-height: 44rpx;
    }
  }

  .col-main-right {
    width: 160rpx;
    height: 220rpx;
    background: #f0efe9;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    flex-shrink: 0;

    .col-right-topbar {
      width: 100%;
      height: 8rpx;
      background: $green;
      margin-bottom: 24rpx;
    }

    .col-right-text {
      color: $green;
      font-size: 36rpx;
      font-weight: 500;
      writing-mode: vertical-rl;
      letter-spacing: 8rpx;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

/* 双小卡片 */
.col-small-row {
  display: flex;
  gap: 24rpx;

  .col-small-card {
    flex: 1;
    background: $card;
    border-radius: 40rpx;
    padding: 36rpx;

    .col-small-name {
      display: block;
      font-size: 40rpx;
      font-weight: 600;
      color: $dark;
      margin-top: 24rpx;
      margin-bottom: 16rpx;
      font-family: $font-bold;
    }

    .col-small-desc {
      display: block;
      font-size: 28rpx;
      color: $gray;
      line-height: 40rpx;
    }
  }
}

/* 热门作者 */
.author-row {
  display: flex;
  gap: 24rpx;

  .author-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .author-avatar {
      width: 200rpx;
      height: 200rpx;
      border-radius: 24rpx;
      background: #2a2a2a;
      border: 2rpx solid #e0e0e0;
      margin-bottom: 24rpx;
    }

    .author-avatar-img {
      width: 200rpx;
      height: 200rpx;
      border-radius: 24rpx;
      border: 2rpx solid #e0e0e0;
      margin-bottom: 24rpx;
    }

    .author-name {
      font-size: 40rpx;
      font-weight: 600;
      color: $dark;
      margin-bottom: 8rpx;
      font-family: $font-bold;
    }

    .author-sub {
      font-size: 28rpx;
      color: $gray;
    }
  }
}

/* 时令特辑 */
.special-card {
  background: #e6f2e9;
  border-radius: 40rpx;
  padding: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .special-left {
    flex: 1;
    margin-right: 32rpx;

    .special-tag { margin-bottom: 24rpx; }

    .special-title {
      display: block;
      font-size: 64rpx;
      font-weight: 600;
      color: #65b380;
      margin-bottom: 24rpx;
      letter-spacing: 2rpx;
      font-family: $font-bold;
    }

    .special-desc {
      display: block;
      font-size: 30rpx;
      color: #444;
      line-height: 48rpx;
    }
  }

  .special-btn {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: $green;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4rpx 16rpx rgba(42,110,68,0.3);
  }
}

/* ── 文库 Tab ── */
.lib-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
  background: $bg;
  margin-bottom: 8rpx;

  .lib-tabs-left {
    display: flex;
    gap: 48rpx;
  }

  .lib-tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 16rpx;

    .lib-tab-text {
      font-size: 30rpx;
      color: $gray;
    }

    .lib-tab-line {
      width: 40rpx;
      height: 4rpx;
      background: $green;
      border-radius: 2rpx;
      margin-top: 8rpx;
    }
  }

  .lib-tab-active .lib-tab-text {
    color: $dark;
    font-weight: 600;
  }

  .batch-btn-inline {
    width: 64rpx;
    height: 64rpx;
    border-radius: 16rpx;
    background: rgba(42, 110, 68, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &.active {
      background: $green;
    }
  }
}

/* 子分类 Tab */
.sub-tabs {
  display: flex;
  padding: 0 40rpx 16rpx;
  gap: 24rpx;
  flex-wrap: wrap;

  .sub-tab-item {
    padding: 12rpx 28rpx;
    border-radius: 32rpx;
    background: #f0ece4;
    font-size: 28rpx;
    color: $gray;

    &.sub-tab-active {
      background: $green;
      color: #fff;
    }
  }
}

/* 文库卡片 */
.card {
  border-radius: 32rpx;
  padding: 40rpx;
  padding-left: 100rpx;
  margin: 0 40rpx 24rpx;
  position: relative;
  overflow: hidden;

  .side-tag {
    position: absolute;
    top: 0; right: 0;
    background: $red;
    border-radius: 0 32rpx 0 16rpx;
    padding: 16rpx 14rpx 20rpx;

    .side-tag-text {
      color: #fff;
      font-size: 22rpx;
      writing-mode: vertical-rl;
      letter-spacing: 5rpx;
    }
  }

  .side-tag-sm {
    padding: 12rpx 12rpx 16rpx;
    .side-tag-text { font-size: 20rpx; }
  }

  .card-meta {
    margin-bottom: 12rpx;
    .meta-text { font-size: 24rpx; color: $gray; }
  }

  .card-title {
    display: block;
    font-size: 56rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 20rpx;
    font-family: $font-bold;
    padding-right: 60rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-title-xl { font-size: 72rpx; }

  .card-body {
    display: block;
    font-size: 28rpx;
    color: #555;
    line-height: 48rpx;
    margin-bottom: 24rpx;
    padding-right: 60rpx;
  }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .card-more { font-size: 24rpx; color: $green; }
  }
}

.card-white { background: #fff; }

.card-author {
  font-size: 24rpx;
  color: $gray;
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  color: $gray;
  font-size: 26rpx;
}

.card-green-md {
  background: linear-gradient(150deg, #4a8a55 0%, #2a6e44 60%, #1a4a2e 100%);
  min-height: 280rpx;
}

.card-green-lg {
  background: linear-gradient(150deg, #3d7a4a 0%, #2a6e44 50%, #1a4a2e 100%);
  min-height: 380rpx;

  .featured-label {
    display: block;
    font-size: 22rpx;
    color: rgba(255,255,255,0.55);
    letter-spacing: 3rpx;
    margin-bottom: 16rpx;
  }

  .card-en-box {
    margin-top: 20rpx;
    padding: 20rpx 24rpx;
    background: rgba(255,255,255,0.1);
    border-radius: 16rpx;

    .card-en-text {
      font-size: 22rpx;
      color: rgba(255,255,255,0.65);
      line-height: 38rpx;
    }
  }
}

/* ── 研习页样式 ── */
.s-pad { padding: 24rpx 40rpx 0; }

.days-card {
  background: #f5f3eb;
  border-radius: 32rpx;
  padding: 40rpx 48rpx;
  position: relative;
  overflow: hidden;

  .days-left {
    .days-label { display: block; font-size: 32rpx; color: $gray; margin-bottom: 8rpx; }
    .days-num-row {
      display: flex; align-items: flex-end; gap: 8rpx;
      .days-num { font-size: 128rpx; font-weight: 700; color: $green; line-height: 1; font-family: $font-bold; }
      .days-unit { font-size: 32rpx; color: $gray; padding-bottom: 16rpx; }
    }
  }

  .days-wm {
    position: absolute; right: 24rpx; top: 50%; transform: translateY(-50%); pointer-events: none;
    .days-wm-text { font-size: 88rpx; font-weight: 700; color: rgba(0,0,0,0.06); writing-mode: vertical-rl; letter-spacing: 10rpx; font-family: $font-bold; }
  }
}

.stat-row {
  display: flex; gap: 24rpx;
  .stat-card {
    flex: 1; border-radius: 32rpx; padding: 36rpx 40rpx;
    .stat-label { display: block; font-size: 30rpx; color: $gray; margin-bottom: 12rpx; }
    .stat-num-row {
      display: flex; align-items: flex-end; gap: 6rpx;
      .stat-num { font-size: 80rpx; font-weight: 600; line-height: 1; font-family: $font-bold; }
      .c-green { color: $green; }
      .c-red   { color: $red; }
      .stat-unit { font-size: 30rpx; color: $gray; padding-bottom: 10rpx; }
    }
  }
  .bg-green { background: #e6f2e9; }
  .bg-pink  { background: #f8ebe4; }
}

.mod-hd {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx;
  .mod-title-wrap { display: flex; align-items: center; gap: 14rpx; }
  .mod-bar { width: 8rpx; height: 44rpx; background: $green; border-radius: 4rpx; }
  .mod-title { font-size: 48rpx; font-weight: 600; color: $dark; font-family: $font-bold; }
  .mod-action { font-size: 30rpx; color: $green; }
}

.goal-card {
  background: #e8e6e1; border-radius: 32rpx; padding: 40rpx 48rpx; position: relative; overflow: hidden;
  .goal-side-tag {
    position: absolute; top: 0; right: 0; width: 56rpx; background: $red;
    border-radius: 0 32rpx 0 12rpx; padding: 20rpx 0 28rpx;
    display: flex; align-items: center; justify-content: center;
    .goal-side-text { color: #fff; font-size: 24rpx; writing-mode: vertical-rl; letter-spacing: 6rpx; }
  }
  .goal-name { display: block; font-size: 52rpx; font-weight: 600; color: $dark; margin-bottom: 20rpx; padding-right: 72rpx; font-family: $font-bold; }
  .goal-desc { display: block; font-size: 32rpx; color: #444; line-height: 52rpx; margin-bottom: 32rpx; padding-right: 72rpx; }
  .goal-prog-hd {
    display: flex; justify-content: space-between; margin-bottom: 16rpx;
    .goal-prog-label { font-size: 32rpx; color: #444; }
    .goal-prog-count { font-size: 32rpx; color: $green; }
  }
  .prog-track {
    width: 100%; height: 16rpx; background: #d0cec9; border-radius: 8rpx; overflow: hidden;
    .prog-fill { height: 100%; background: $green; border-radius: 8rpx; }
  }
}

.lesson-card {
  background: #fff; border-radius: 32rpx; padding: 32rpx 36rpx;
  display: flex; align-items: center; gap: 24rpx;
  .lesson-icon-wrap {
    width: 96rpx; height: 96rpx; border-radius: 24rpx; background: #e6f2e9;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .lesson-icon-done {
    background: $green;
  }
  .lesson-info {
    flex: 1;
    .lesson-hd { display: flex; align-items: center; gap: 16rpx; margin-bottom: 12rpx; }
    .ltag { border-radius: 8rpx; padding: 4rpx 16rpx; }
    .ltag-text { font-size: 26rpx; }
    .ltag-light { background: #e6f2e9; }
    .ltag-light-text { color: $green; }
    .ltag-dark  { background: $green; }
    .ltag-dark-text  { color: #fff; }
    .lesson-title { font-size: 44rpx; font-weight: 600; color: $dark; font-family: $font-bold; }
    .lesson-sub { font-size: 30rpx; color: $gray; }
  }
  .lesson-done-tag {
    background: #e6f2e9;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;
    .lesson-done-text {
      font-size: 24rpx;
      color: $green;
      font-weight: 500;
    }
  }
}

.badge-row {
  display: flex; gap: 32rpx; flex-wrap: wrap;
  .badge-item { display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
  .badge {
    width: 160rpx; height: 160rpx; border-radius: 16rpx;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    .badge-text { font-size: 32rpx; font-weight: 600; writing-mode: vertical-rl; letter-spacing: 6rpx; font-family: $font-bold; }
    .badge-icon {
      position: absolute; top: 8rpx; right: 8rpx;
    }
    .badge-icon-lock {
      position: absolute; bottom: 8rpx; right: 8rpx;
    }
  }
  .badge-on {
    background: linear-gradient(135deg, #fff8f0, #fdf0e0);
    border: 4rpx solid #e6a23c;
    box-shadow: 0 0 16rpx rgba(230, 162, 60, 0.4), 0 4rpx 12rpx rgba(0,0,0,0.08);
    .badge-text-on { color: #8b2020; }
  }
  .badge-off {
    background: #f0f0f0;
    border: 3rpx dashed #ccc;
    opacity: 0.5;
    .badge-text-off { color: #bbb; }
  }
  .badge-status { font-size: 28rpx; color: #e6a23c; font-weight: 600; }
  .badge-status-off { color: #aaa; }
}

/* ── 底部导航 ── */
.tabbar {
  display: flex;
  background: $bg;
  border-top: 2rpx solid #e0e0e0;
  padding: 16rpx 0 40rpx;

  .tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;

    .tab-text {
      font-size: 24rpx;
      color: $gray;
    }
  }

  .active-tab {
    .tab-icon-wrap {
      width: 56rpx;
      height: 56rpx;
      background: $green;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .active-tab-text {
      font-size: 24rpx;
      font-weight: 500;
      color: $green;
    }
  }
}
/* ── 我的页样式 ── */
.mine-user-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 40rpx 32rpx;

  .mine-avatar-wrap {
    position: relative;
    margin-bottom: 32rpx;

    .mine-avatar {
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      background: #2a2a2a;
      border: 4rpx solid #e0d8c8;
    }

    .mine-cert-tag {
      position: absolute;
      bottom: -10rpx;
      right: -20rpx;
      background: #8b2020;
      border-radius: 10rpx;
      padding: 12rpx 16rpx;

      .mine-cert-text {
        color: #fff;
        font-size: 22rpx;
        writing-mode: vertical-rl;
        letter-spacing: 4rpx;
        line-height: 1.4;
      }
    }
  }

  .mine-username {
    font-size: 48rpx;
    font-weight: 700;
    color: $dark;
    margin-bottom: 40rpx;
    font-family: $font-bold;
  }

  .mine-stats-row {
    display: flex;
    gap: 24rpx;
    width: 100%;

    .mine-stat-card {
      flex: 1;
      background: #eeece4;
      border-radius: 28rpx;
      padding: 32rpx 36rpx;

      .mine-stat-label {
        display: block;
        font-size: 26rpx;
        color: $gray;
        margin-bottom: 12rpx;
      }

      .mine-stat-num-row {
        display: flex;
        align-items: flex-end;
        gap: 6rpx;

        .mine-stat-num {
          font-size: 72rpx;
          font-weight: 600;
          color: $green;
          line-height: 1;
          font-family: $font-bold;
        }

        .mine-stat-unit {
          font-size: 28rpx;
          color: $gray;
          padding-bottom: 8rpx;
        }
      }
    }
  }
}

.mine-menu-list {
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .mine-menu-item {
    background: #fff;
    border-radius: 32rpx;
    padding: 32rpx 36rpx;
    display: flex;
    align-items: center;
    gap: 28rpx;

    .mine-menu-icon-wrap {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .mine-menu-label {
      flex: 1;
      font-size: 32rpx;
      color: $dark;
      font-weight: 500;
    }
  }
}

.mine-footer {
  padding: 64rpx 40rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .mine-divider-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 48rpx;
    gap: 8rpx;

    .mine-divider-line {
      width: 2rpx;
      height: 80rpx;
      background: #d0ccc0;
    }

    .mine-divider-dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: #c0bbb0;
    }
  }

  .mine-poem {
    display: block;
    font-size: 34rpx;
    color: $gray;
    line-height: 64rpx;
    text-align: center;
    font-family: $font-bold;
    letter-spacing: 4rpx;
  }

  .mine-logout {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-top: 56rpx;

    .mine-logout-text {
      font-size: 32rpx;
      color: $red;
      font-family: $font-bold;
    }
  }
}

/* ── 批量处理样式 ── */

/* 选中卡片样式 */
.card-selected {
  border: 4rpx solid $green !important;
  background: #f0f9f2 !important;
}

/* 批量选择圆形框 */
.batch-checkbox {
  position: absolute;
  left: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.batch-checkbox-inner {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 4rpx solid #ccc;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.batch-checkbox-checked {
  border-color: $green;
  background: $green;
}

/* 批量操作栏 */
.tabbar-hidden {
  opacity: 0;
  pointer-events: none;
}

.batch-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 2rpx solid #e8e8e8;
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.batch-count {
  font-size: 32rpx;
  color: $dark;
  font-weight: 600;
}

.batch-btns {
  display: flex;
  gap: 24rpx;
}

.batch-btn-cancel {
  padding: 20rpx 36rpx;
  border-radius: 40rpx;
  background: #f0f0f0;
  border: 2rpx solid #e0e0e0;

  text {
    font-size: 30rpx;
    color: $gray;
  }
}

.batch-btn-confirm {
  padding: 20rpx 36rpx;
  border-radius: 40rpx;
  background: $green;

  text {
    font-size: 30rpx;
    color: #fff;
    font-weight: 500;
  }
}

/* ── 合集选择弹窗 ── */
.collection-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.collection-popup-main {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 0 0 env(safe-area-inset-bottom);
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 40rpx 40rpx 24rpx;

  .popup-title {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: $dark;
    margin-bottom: 8rpx;
  }

  .popup-subtitle {
    display: block;
    font-size: 26rpx;
    color: $gray;
  }

  .popup-close {
    position: absolute;
    right: 40rpx;
    top: 40rpx;
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.popup-section {
  padding: 0 40rpx 32rpx;

  .popup-section-title {
    display: block;
    font-size: 26rpx;
    color: $gray;
    margin-bottom: 20rpx;
  }
}

.popup-empty {
  padding: 32rpx;
  text-align: center;
  background: #f8f8f8;
  border-radius: 16rpx;

  .popup-empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

.project-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  margin-bottom: 16rpx;

  &.project-item-selected {
    background: #e6f2e9;
    border: 2rpx solid $green;
  }

  .project-item-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 16rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  .project-item-info {
    flex: 1;

    .project-item-name {
      display: block;
      font-size: 32rpx;
      color: $dark;
      font-weight: 500;
      margin-bottom: 4rpx;
    }

    .project-item-meta {
      font-size: 24rpx;
      color: $gray;
    }
  }
}

.new-project-input {
  display: flex;
  gap: 20rpx;

  .collection-input {
    flex: 1;
    height: 80rpx;
    background: #f8f8f8;
    border-radius: 16rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
  }

  .input-btn {
    padding: 0 32rpx;
    height: 80rpx;
    background: $green;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .input-btn-text {
      font-size: 28rpx;
      color: #fff;
    }
  }
}

.popup-footer {
  padding: 24rpx 40rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #f0f0f0;

  .confirm-btn {
    height: 96rpx;
    background: $green;
    border-radius: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .confirm-btn-text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 500;
    }
  }
}

/* ── 成就详情弹窗 ── */
.achievement-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .ach-popup-hd {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 40rpx;

    .ach-popup-badge {
      width: 200rpx;
      height: 200rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .badge-text {
        font-size: 40rpx;
        font-weight: 600;
        writing-mode: vertical-rl;
        letter-spacing: 8rpx;
        font-family: $font-bold;
      }

      .badge-text-on { color: $red; }
      .badge-text-off { color: #ccc; }
    }

    .badge-on { background: linear-gradient(135deg, #fff8f0, #fdf0e0); border: 4rpx solid #e6a23c; box-shadow: 0 0 16rpx rgba(230, 162, 60, 0.4), 0 4rpx 12rpx rgba(0,0,0,0.08); }
    .badge-off { background: #f0f0f0; border: 3rpx dashed #ccc; opacity: 0.5; }

    .ach-popup-status {
      display: flex;
      align-items: center;
      gap: 8rpx;
    }

    .ach-popup-status-text {
      font-size: 30rpx;
      font-weight: 500;
    }

    .ach-unlocked { color: $red; }
    .ach-locked { color: #999; }
  }

  .ach-popup-desc {
    width: 100%;
    background: #f8f5ee;
    border-radius: 20rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;

    .ach-popup-desc-label {
      display: block;
      font-size: 26rpx;
      color: $gray;
      margin-bottom: 12rpx;
    }

    .ach-popup-desc-text {
      display: block;
      font-size: 32rpx;
      color: $dark;
      line-height: 52rpx;
    }
  }

  .ach-popup-time {
    width: 100%;
    margin-bottom: 32rpx;

    .ach-popup-time-text {
      font-size: 26rpx;
      color: $gray;
    }
  }

  .ach-popup-btn {
    width: 100%;
    height: 88rpx;
    background: $green;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .ach-popup-btn-text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 500;
      letter-spacing: 2rpx;
    }
  }
}

</style>
