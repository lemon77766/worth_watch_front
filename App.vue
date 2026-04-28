<script>
	export default {
		onLaunch: function() {
			// 如果没有token，跳转到登录页
			const token = uni.getStorageSync('token')
			if (!token) {
				uni.reLaunch({ url: '/pages/login/index' })
			}
			// 如果有token，直接进入首页（首页会自动验证token有效性）
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
