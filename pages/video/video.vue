<template>
	<view class="index" style="display: flex;flex: 1;">
		<view class="dhl"></view>
		<view class="topHeader" :class="{'display-none': displayNone, 'position-fixed': topMenuPosition}">
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
			<view class="top-menu">

				<!-- <view class="top-menu-title">
					<text class="active">动态获取</text>
				</view>
				<view style="font-size: 16px;color: #9C9C9C;">
					<text class="active-on">动态获取</text>
				</view>
				<view class="top-menu-title">
					<text class="active-on">动态获取</text>
				</view> -->
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" :scroll-into-view="activeTopMenu">
					<view v-for="(item, index) in videoClassify" :id="'te'+index" :key='item.classifyId' :class="{'title-active' : nowClassify === index}"
					 class="top-menu-title scroll-view-item_H" @click='classifyActive($event, item, index)'>
						<text>{{item.name}}</text>
						<text v-if="nowClassify === index" class="xhx"></text>
					</view>
				</scroll-view>
			</view>
		</view>


		<view style="display: flex;flex: 1;width: 100%;">
			<swiper id="swiper" class="swiper" style="height: 100%;" :current='contentIndex' @change='classifyActiveChange'
			 :indicator-dots="false" :autoplay="false" :interval="interval" :duration="duration">
				<swiper-item v-for="(event, idx) in nowClassifyList" :key='idx'>
					<scroll-view class="scroll-view_H" style="height: 100%;" @scroll="scroll" scroll-y="true" :scroll-top='scrollTop'>
						<view :id="'wws' + idx" style="justify-content: space-between;flex-wrap: wrap;margin-top: 20upx;width: 750upx;max-width: 620px;margin: 0 auto;">
							<view v-for="item in event" :key='item.videoId' class="videos" @click="goDetail(item.videoId)">
								<image :src="item.cover" mode="aspectFit" style="width: 173px;height: 114px;background-color: #000000;" @error="imgDefault(item)"></image>
								<text style="color: #4B4B4B;font-size: 14px;width: 100%;">{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>







		<!-- <view style="text-align: left;flex-wrap: wrap;justify-content: space-around;">
			<view style="width: 346upx;flex-wrap: wrap;" @click="goDetail(1)">
				<image :src="movieImg" mode="aspectFit" style="width: 100%;height: 115px;"></image>
				<text style="color: #4B4B4B;font-size: 14px;">电影名xxxxx</text>
			</view>

			<view style="width: 346upx;flex-wrap: wrap;" @click="goDetail(1)">
				<image :src="movieImg" mode="aspectFit" style="width: 100%;height: 115px;"></image>
				<text style="width: 100%;color: #4B4B4B;font-size: 14px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">电影名xxxxxsssssssssssssssss</text>
			</view>
		</view> -->

		<!-- <text class="loadMore">加载中...</text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				interval: 2000,
				duration: 500,
				indexImg: this.$indexImg,
				videoActiveImg: this.$videoActiveImg,
				myImg: this.$myImg,
				movieImg: this.$movieImg,

				top: 0,
				token: '',
				displayNone: false,
				topMenuPosition: false,
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
				videoClassify: '',
				nowClassify: 0, // 视频头部菜单标题
				nowClassifyList: [], // 视频内容
				activeTopMenu: '', // 头部选择菜单自动居中
				contentIndex: 0, // 左右滑动内容对应头部菜单的index
				scrollTop: 0, // 内容部分的上下滚动值
				old: {
					scrollTop: 0
				}
			}
		},
		onLoad: function(option) {
			this.url = option.url;
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
				}
			})
			this.getData();
		},
		// onPageScroll(e) {
		// 	console.log(e.scrollTop)
		// 	if (e.scrollTop > this.top && e.scrollTop > 20) {
		// 		this.displayNone = true;
		// 	} else {
		// 		this.displayNone = false;
		// 	}
		// 	if (e.scrollTop > 0) {
		// 		this.topMenuPosition = true;
		// 	} else {
		// 		this.displayNone = false;
		// 		this.topMenuPosition = false;
		// 	}
		// 	this.top = e.scrollTop;
		// },
		// onReachBottom() {
		// 	console.log('滑动到页面底部')
		// 	this.getData();
		// },
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.refreshing = true;
			this.getData();
		},
		methods: {
			// 获取视频数据
			getData() {
				let self = this;
				uni.request({
					url: this.$serverUrl + '/home',
					data: {},
					header: {
						// "Content-Type": "application/json;charset=UTF-8",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					success: (ret) => {
						if (ret.statusCode !== 200) {
							console.log('失败!');
							self.refreshing = false;
							uni.stopPullDownRefresh();
						} else {
							self.topMenuPosition = false;
							self.videoClassify = ret.data.data.classifies;
							for (let i = 0; i < self.videoClassify.length; i++) {
								self.nowClassifyList.push(self.videoClassify[i].videos);
							}
							uni.stopPullDownRefresh();
						}
					},
					fail: (ret) => {
						self.topMenuPosition = false;
						uni.stopPullDownRefresh();
					}
				});
			},
			// 点击头部导航菜单
			classifyActive(e, item, idx) {
				if (1 < idx && idx < this.videoClassify.length - 2) {
					this.activeTopMenu = 'te' + (idx - 2);
				}
				if (idx === this.nowClassify) {
					this.scrollTop = this.old.scrollTop
					this.$nextTick(function() {
						this.scrollTop = 0
					});
					// uni.showToast({
					// 	icon: "none",
					// 	title: "纵向滚动 scrollTop 值已被修改为 0"
					// })
				}




				this.contentIndex = idx;
				// this.nowClassifyList = item.videos;
				this.nowClassify = idx;
			},
			// 内容部分上下滑动事件
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			// 内容部分左右滑动事件
			classifyActiveChange(e) {
				if (1 < e.detail.current && e.detail.current < this.videoClassify.length - 2) {
					this.activeTopMenu = 'te' + (e.detail.current - 2);
				}
				this.nowClassify = e.detail.current;
			},
			// 视频封面出错时的默认图片
			imgDefault(item) {
				item.cover = this.$movieImg;
			},
			// 点击视频进入播放页面
			goDetail(item) {
				uni.navigateTo({
					url: '../../pages/video/video_particulars?id=' + item
				});
			},


			// 系统头部
			// 跳转登录页面
			gotoLogin() {
				if (this.token) { // 已登录跳转到个人中心
					uni.redirectTo({
						url: '../../pages/center/center'
					})
				} else { // 未登录跳转到登录页面
					uni.redirectTo({
						url: '../../pages/login/login'
					})
				}
			},
			// 跳转博文页面
			gotoIndex() {
				if (this.url) {
					uni.redirectTo({
						url: '../../pages' + this.url
					})
				} else {
					uni.redirectTo({
						url: '../../pages/new/recommend'
					})
				}
			}
		}
	}
</script>

<style>
	.title-active {
		color: #36465D;
	}

	.videos {
		width: 173px;
		flex-wrap: wrap;
		margin: 6upx;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		font-size: 18px;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 20%;
		text-align: center;
	}

	.swiper {
		width: 100%;
	}

	.xhx {
		display: inline-block;
		height: 2px;
		width: 18px;
		background-image: url('../../static/圆角矩形.png');
		display: block;
		margin: 0 auto;
		position: relative;
		top: -6px;
	}
</style>
