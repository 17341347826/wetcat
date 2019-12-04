<template>
	<form class='loginView' @submit="login">
		<view class="dhl"></view>
		<view>
			<text class="loginLogo">WETCAT</text>
		</view>
		<view class="input-view">
			<input class="input" type="number" v-model="phone" placeholder="  请输入手机号" name="nameValue" maxlength="11" />
		</view>
		<view class="pwdCode">
			<view class="input-view pwd">
				<input class="input" type="number" placeholder="  请输入验证码" name="passwordValue" maxlength="6" />
			</view>
			<view>
				<button type="primary" hover-class="hover" class="code" @click="onGetCode()">{{getCode ? '获取验证码' : countDown+'s'}}</button>
			</view>
		</view>
		<view class="button-view">
			<button type="default" class="login" hover-class="hover" formType="submit">登录</button>
			<view class="register" hover-class="hover" @click="register()">
				<text class="holdLogin">稍后登录</text>
			</view>
		</view>
		<view style="width: 100%;bottom: 0;height: var(--status-bar-height);background: #36465D;position: fixed;"></view>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				getCode: true, // 判断是否正在倒计时
				countDown: 60, // 获取验证码时间间隔
				gotoUrl: '', // 跳转到此页面之前的页面路径
				t1: '', // 获取验证码倒计时
				phone: '', // 输入的手机号
				videoId: '', // 从视频页跳转登录时的视频ID
			};
		},
		onLoad: function(option) {
			if (this.t1) {
				window.clearInterval(this.t1);
			}
			console.log(option, 123, this.t1)
			if (option.url) {
				this.gotoUrl = option.url;
			}
			if (option.videoId) {
				this.videoId = option.videoId;
			}
		},
		methods: {
			login(e) {
				let self = this;
				if (e.detail.value.nameValue.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
					})
					return;
				}
				uni.request({
					url: this.$serverUrl + '/user/login',
					data: {
						account: e.detail.value.nameValue,
						pwd: e.detail.value.passwordValue,
						type: 2,
						channelId: 0,
						deviceId: 0,
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					success: (res) => {
						if (res.data.code !== 0) {
							uni.showModal({
								content: res.data.msg,
								showCancel: false
							})
							return;
						}

						uni.showToast({
							title: '登录成功',
							icon: 'none',
						})
						uni.setStorage({
							key: 'user_info',
							data: res.data.data,
							success: function() {
								console.log(self.gotoUrl, 111)
								if (self.t1) {
									window.clearInterval(self.t1);
								}
								if (self.gotoUrl) {
									if (self.videoId) {
										uni.redirectTo({
											url: '../../pages' + self.gotoUrl + '?id=' + self.videoId
										})
									} else {
										uni.navigateTo({
											url: '../../pages' + self.gotoUrl
										})
									}
								} else {
									uni.navigateTo({
										url: '../../pages/center/center'
									})
								}
							}
						})

					},
					fail: () => {
						uni.showModal({
							content: '请求失败，请重试!',
							showCancel: false
						})
					}
				})
				console.log("得到账号:" + e.detail.value.nameValue + ';得到密码:' + e.detail.value.passwordValue)
			},

			register() {
				if (this.t1) {
					window.clearInterval(this.t1);
				}
				// uni.request({
				// 	url: this.$serverUrl + '/user/login',
				// 	data: {
				// 		type: 1,
				// 		channelId: 0,
				// 		deviceId: 0,
				// 	},
				// 	header: {
				// 		"Content-Type": "application/x-www-form-urlencoded"
				// 	},
				// 	method: "POST",
				// 	success: (res) => {
				// 		if (res.data.code !== 0) {
				// 			uni.showModal({
				// 				content: '请求失败，失败原因：' + res.data.msg,
				// 				showCancel: false
				// 			})
				// 			return;
				// 		}
				if (this.gotoUrl) {
					if (this.gotoUrl == '/video/video_particulars') {
						uni.navigateBack({
							delta: 1
						})
						return;
					}
					uni.redirectTo({
						url: '../../pages' + this.gotoUrl
					})
				} else {
					uni.redirectTo({
						url: '../../pages/center/center'
					})
				}
				// 	},
				// 	fail: () => {
				// 		uni.showModal({
				// 			content: '请求失败，请重试!',
				// 			showCancel: false
				// 		})
				// 	}
				// })
			},

			onGetCode() {
				if (!this.getCode) {
					uni.showToast({
						title: '验证码已发送，若未收到请' + this.countDown + '秒后再试',
						icon: 'none'
					})
					return;
				}
				if (this.phone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
					})
					return;
				}
				let self = this;
				uni.request({
					url: this.$serverUrl + '/user/sms',
					data: {
						phone: this.phone,
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					success: (res) => {
						if (res.data.code !== 0) {
							uni.showModal({
								content: '请求失败，失败原因：' + res.data.msg,
								showCancel: false
							})
							return;
						}

						self.getCode = false;
						self.t1 = setInterval(function() {
							self.countDown--;
							console.log(self.countDown)
							if (self.countDown <= 0) {
								self.getCode = true;
								self.countDown = 60;
								window.clearInterval(self.t1);
								return;
							}
						}, 1000)
					},
					fail: () => {
						uni.showModal({
							content: '请求失败，请重试!',
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style>
	.uni-input-placeholder {
		color: #A3AEBD;
		text-indent: 1em
	}
</style>
