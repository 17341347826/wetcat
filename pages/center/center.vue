<template>
	<view class="center index">
		<view class="dhl"></view>
		<view class="topHeader">
			<view class="header">
				<text class="header-title">WETCAT</text>
				<view style="float: right;">
					<view @click="gotoHome()">
						<image :src="indexImg" class="header-image"></image>
					</view>
					<view @click="gotoVideo()">
						<image :src="videoImg" class="header-image"></image>
					</view>
					<view>
						<image :src="myActiveImg" class="header-image"></image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!token" class="logo" @click="goLogin" hover-class="logo-hover">
			<image class="logo-img" :src="avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name" style="line-height: 88upx;">您尚未登录</text>
				<text class="go-login navigat-arrow" style="line-height: 88upx;">&#xe65e;</text>
			</view>
		</view>
		<view v-if="token" class="logo" style="flex-wrap: wrap;">
			<image class="logo-img" :src="token ? userInfo.avatarUrl :avatarUrl"></image>
			<view class="logo-title" style="height: 150upx;">
				<text style="font-size: 28upx;color: #FFFFFF;margin-right: 15upx;">动态获取昵称</text>
				<image :src="vipImg" mode="aspectFit" style="width: 100upx;height: 30upx;"></image>
				<!-- <text class="go-login navigat-arrow">&#xe65e;</text> -->
				<text style="font-size: 28upx;color: #FFFFFF;width: 100%;">id：{{userInfo.userId}}</text>
				<text style="font-size: 28upx;color: #FFFFFF;margin-top: 20upx;width: 70%;">
					会员到期日：{{vipEndTime}}
				</text>
				<text class="pay_click" @click="goPay()" style="margin-top: 20upx;">充值 ＞</text>
			</view>
		</view>
		<!-- <view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60c;</text>
				<text class="list-text">收藏图片</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item">
				<text class="list-icon">&#xe60d;</text>
				<text class="list-text">收藏图集</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view> -->
		<view class="center-list" style="margin-top: 0;">
			<view v-if="!token" class="center-list-item border-bottom" @click="goLogin">
				<!-- <text class="list-icon">&#xe60b;</text> -->
				<text class="list-text">绑定手机送
					<text style="color: #FEBF00;">会员！</text>
				</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" v-if="token" @click="onInvitation = false">
				<!-- <text class="list-icon">&#xe61a;</text> -->
				<text class="list-text">绑定邀请码</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view style="border-top: 1px solid #555555;height: 130upx; padding: 0upx 20upx;flex-wrap: wrap;background-color: #DDDDDD;" :class="{'display-none': onInvitation}">
				<input type="number" value="" placeholder="请输入邀请人ID" v-model="invitationCode" maxlength="8"
				 style="background-color: #FFFFFF;height: 60upx;margin: 10upx auto 0;width: 360upx;" />
				<view style="width: 100%;">
					<button type="primary" style="height: 40upx;font-size: 26upx;line-height: 40upx;width: 180upx;margin-right: 0;">确定</button>
					<button type="warn" style="height: 40upx;font-size: 26upx;line-height: 40upx;width: 180upx;margin-left: 0;"
					 @click="onInvitation = true;invitationCode = ''">取消</button>
				</view>
			</view>
		</view>
		<view v-if="token" class="center-list" style="border-top: 15px solid #EAEAEA;border-bottom: 15px solid #EAEAEA;margin-top: 0;">
			<view class="center-list-item">
				<!-- <text class="list-icon">&#xe609;</text> -->
				<text class="list-text" @click="loginOut()">切换账号</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="postImage">
			<image :src="downAppImg" mode="scaleToFill" style="width: 100%;height: 480upx;"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 图片路径 - start
				indexImg: this.$indexImg, // 系统头部主页图标
				videoImg: this.$videoImg, // 系统头部视频图标
				myActiveImg: this.$myActiveImg, // 系统头部个人中心图标
				downAppImg: this.$downAppImg, // 更多精彩内容请下载APP
				vipImg: '', // 判断是否为vip后动态获取
				avatarUrl: '/static/logo.png', // 未登录时的默认头像
				// 图片路径 - end
				userInfo: {}, // 登录后的个人信息
				token: '', 
				vipEndTime: '', // 会员到期时间
				onInvitation: true, // 输入邀请码是否隐藏 默认为隐藏
				invitationCode: '', // 邀请人ID
			}
		},
		onLoad() {
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.userInfo = res.data;
					if (!self.userInfo.avatarUrl) {
						self.userInfo.avatarUrl = self.avatarUrl
					}
					self.token = res.data.token;
					if (res.data.vip) {
						self.vipImg = self.$vipTrue
					} else {
						self.vipImg = self.$vipFalse
					}
				}
			})
			this.getVipTime();
			// this.updateUserInf();
		},
		methods: {
			getVipTime() { // 根据用户vip时长换算出到期日
				var nowTime = Date.parse(new Date());
				nowTime = Number((this.userInfo.validDate * 60 * 60 * 1000) + nowTime);
				var date = new Date(nowTime);
				var Y = date.getFullYear()
				var M = date.getMonth() + 1;
				var D = date.getDate();
				var h = date.getHours();
				var m = date.getMinutes();
				this.vipEndTime = Y + '-' + M + '-' + D;
				console.log(this.vipEndTime)
			},
			goLogin() { // 未登录时跳转登录的功能
					uni.navigateTo({
						url: '/pages/login/login'
					});
			},
			goPay() { // 跳转充值页
				uni.navigateTo({
					url: '/pages/center/pay'
				});
			},
			gotoHome() { // 跳转主页
				uni.redirectTo({
					url: '/pages/new/new'
				});
			},
			loginOut() { // 退出当前账号
				let self = this;
				if (this.token) {
					uni.showModal({
						title: '',
						content: '是否退出当前账号并跳转登录',
						showCancel: true,
						cancelText: '取消',
						cancelColor: '#9C9C9C',
						confirmText: true,
						confirmText: '确定',
						confirmColor: '#E96900',
						success: function(res) {
							if (res.confirm) {
								self.token = '';
								uni.removeStorage({
									key: 'user_info',
									success: function() {
										uni.navigateTo({
											url: '../../pages/login/login'
										})
									}
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})

				} else {
					uni.showToast({
						title: '尚未登录',
						icon: 'none',
					})
				}
			},
			gotoVideo() { // 跳转视频页
				uni.redirectTo({
					url: '../../pages/video/video'
				})
			},
			updateUserInf() { // 刷新用户信息
				uni.request({
					url: this.$serverUrl + '/user/detail',
					data: {},
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
					},
					method: "POST",
					success: (res) => {
						if (res.data.code !== 0) {
							return;
						}
						this.userInfo.validDate = res.data.data.validDate
						this.getVipTime();
					}
				})
			}
		}
	}
</script>

<style>
	/* 下载APP的图片 */
	.postImage {
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	/* 跳转充值页面按钮 */
	.pay_click {
		color: #FF8400;
		font-size: 38upx;
		float: right;
		margin-top: 10upx;
		width: 30%;
		text-align: right;
	}
</style>
