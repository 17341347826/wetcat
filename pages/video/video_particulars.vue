<template>
	<view class="video_particulars">
		<view class="dhl"></view>
		<!-- 	<view class="topHeader">
			<view class="header">
				<text class="header-title">WETCAT</text>
				<view style="float: right;">
					<view @click="gotoIndex()">
						<image :src="indexImg" class="header-image"></image>
					</view>
					<view>
						<image :src="videoActiveImg" class="header-image"></image>
					</view>
					<view @click="gotoLogin()">
						<image :src="myImg" class="header-image"></image>
					</view>
				</view>
			</view>
		</view> -->
		<view v-for="item in videoInfo.nodes" :key="item.url" style="display: block;width: 100%;height: 100%;">
			<view style="max-width: 600px;height: 30%;max-height: 380px;margin: 0 auto;">
				<video style="width: 100%;height: 100%;" id="myVideo" :src="item.url" controls :page-gesture="true" @error="videoErrorCallback()"
				 :muted='videoMuted'></video>
			</view>
			<view style="max-width: 600px;margin: 0 auto;padding: 10upx;flex-wrap: wrap;">
				<text style="color: #4B4B4B;font-size: 42upx;width: 100%;">{{videoInfo.name}}</text>
				<text style="color: #9C9C9C;font-size: 26upx;margin-right: 10upx;">#标签</text>
			</view>
			<view style="max-width: 600px;margin: 0 auto;border-bottom: 15upx #36465D solid;width: 100%;"></view>

			<view style="max-width: 600px;margin: 0 auto;padding: 8upx 14upx;">猜你喜欢</view>

			<view style="max-width: 600px;margin: 0 auto;text-align: left;flex-wrap: wrap;justify-content: space-around;">
				<view v-for="event in videoLike" :key="event.videoId" style="width: 346upx;flex-wrap: wrap;" @click="goDetail(event.videoId)">
					<image :src="event.cover" mode="aspectFit" style="width: 100%;height: 115px;" @error="imgDefault(event)"></image>
					<text style="color: #4B4B4B;font-size: 14px;">{{event.name}}</text>
				</view>

				<!-- <view style="width: 346upx;flex-wrap: wrap;" @click="goDetail(1)">
					<image :src="movieImg" mode="aspectFit" style="width: 100%;height: 115px;"></image>
					<text style="width: 100%;color: #4B4B4B;font-size: 14px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">电影名xxxxxsssssssssssssssss</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indexImg: this.$indexImg,
				videoActiveImg: this.$videoActiveImg,
				myImg: this.$myImg,
				movieImg: this.$movieImg,

				top: 0,
				token: '',
				displayNone: false,
				refreshing: false,
				downAppHeight: 0,
				providerList: [],
				list: [],
				fetchPageNum: 1,
				allPhoto: {
					id: "",
					photoList: []
				},
				url: '',
				videoId: '',
				videoUrl: '',
				videoInfo: [],
				videoMuted: false, // 视频静音
				videoLike: [],
			}
		},
		onLoad: function(option) {
			console.log(option)
			this.url = option.url;
			this.videoId = option.id;
			console.log(this.videoId)
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
					self.videoUrl = "../../static/video/sp.mp4"
					if (self.videoId) {
						self.getData()
					} else {
						uni.getStorage({
							key: 'videoId',
							success: function(ret) {
								self.videoId = ret.data;
								self.getData();
							}
						})
					}
				},
				fail: function() {
					self.gotoLogin();
					return;
				}
			})
		},
		onReady: function(res) {
			let myVideo = uni.createVideoContext('myVideo');
			myVideo.play();
			// 视频底部进度条
			// document.getElementsByClassName('uni-video-bar')[0].style.width = '90%';
			// document.getElementsByClassName('uni-video-bar')[0].style.borderRadius = '4px';
			// document.getElementsByClassName('uni-video-bar')[0].style.margin = '0 auto';
			// document.getElementsByClassName('uni-video-bar')[0].style.display = 'block';
			// // 视频中央时间隐藏
			// document.getElementsByClassName('uni-video-cover-duration')[0].style.display = 'none';
			// // 视频底部进度条全屏图标
			// document.getElementsByClassName('uni-video-fullscreen')[0].style.backgroundImage = 'url(../../static/全屏.png)';
			// console.log(document.getElementsByClassName('uni-video-bar')[0].style)
		},
		methods: {
			gotoLogin() {
				let self = this;
				uni.showModal({
					title: '',
					content: '请先登录',
					showCancel: true,
					cancelText: '稍后',
					cancelColor: '#9C9C9C',
					confirmText: true,
					confirmText: '确定',
					confirmColor: '#E96900',
					success: function(res) {
						if (res.confirm) {
							console.log(self.videoId);
							uni.redirectTo({
								url: '../../pages/login/login?url=/video/video_particulars&videoId=' + self.videoId
							})

						} else if (res.cancel) {
							uni.navigateBack({
								delta: 1
							});
						}
					}
				})
			},
			getData() {
				this.topMenuPosition = true;
				uni.request({
					url: this.$serverUrl + '/video/node',
					data: {
						videoId: this.videoId
					},
					header: {
						// "Content-Type": "application/json;charset=UTF-8",
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
					},
					method: "POST",
					success: (ret) => {
						uni.stopPullDownRefresh();
						if (ret.data.code) {
							uni.showToast({
								title: ret.data.msg,
								icon: 'none',
							})
							this.refreshing = false;
						} else {
							this.topMenuPosition = false;
							this.videoInfo = ret.data.data;
							this.videoLike = ret.data.data.like;
						}
					},
					fail: (ret) => {
						this.topMenuPosition = false;
						uni.stopPullDownRefresh();
					}
				});
			},
			// 点击视频进入播放页面
			goDetail(item) {
				let myVideo = uni.createVideoContext('myVideo');
				myVideo.stop();
				uni.navigateTo({
					url: '../../pages/video/video_particulars?id=' + item
				});
			},
			onNavigationBarButtonTap: function(btn) {
				if (btn.index == 0) {
					let pages = getCurrentPages();
					let page = pages[pages.length - 1];
					// #ifdef APP-PLUS
					let currentWebview = page.$getAppWebview();
					let titleObj = currentWebview.getStyle().titleNView;
					console.log(1);
					if (!titleObj.buttons) {
						return;
					}
					if (titleObj.buttons[0].text == '\ueca6') {
						this.videoMuted = true;
						console.log(1233221123)
						titleObj.buttons[0].text = "\ue8b8";
					} else {
						titleObj.buttons[0].text = "\ueca6";
						this.videoMuted = false;
					}
					currentWebview.setStyle({
						titleNView: titleObj
					});
					// #endif
				}
			},
			videoErrorCallback(e) {
				console.log('视频错误信息:')
				// console.log(e.target.errMsg)
			},

			// 视频封面出错时的默认图片
			imgDefault(item) {
				item.cover = this.$movieImg;
			},
		}
	}
</script>

<style>
	.btn-back {
		width: 32upx;
		height: 59upx;
		position: absolute;
		top: 44px;
		margin-top: var(--status-bar-height);
		z-index: 2;
		margin-left: 10px;
		color: #9C9C9C;
	}
</style>
