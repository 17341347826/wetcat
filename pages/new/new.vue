<template>
	<view class="index">
		<view class="dhl"></view>
		<view class="topHeader" :class="{'display-none': displayNone, 'position-fixed': topMenuPosition}">
			<view class="header">
				<text class="header-title">WETCAT</text>
				<view style="float: right;">
					<view>
						<image :src="indexActiveImg" class="header-image"></image>
					</view>
					<view @click="gotoVideo()">
						<image :src="videoImg" class="header-image"></image>
					</view>
					<view @click="gotoLogin()">
						<image :src="myImg" class="header-image"></image>
					</view>
				</view>
			</view>
			<view class="top-menu">
				<view class="top-menu-title scroll-view-item_H title-active" @click="goFollow()">
					<text>关注</text>
					<text class="xhx"></text>
				</view>
				<view class="top-menu-title scroll-view-item_H" @click="goRecommend()">
					<text>推荐</text>
				</view>
				<view class="top-menu-title scroll-view-item_H" @click="goPost()">
					<text>帖子信息</text>
				</view>
			</view>
		</view>
		<view v-for="(item, index) in list" :key="item.id" style="width: 100%;max-width: 700px;flex-wrap: wrap;margin: 0 auto;"
		 :class="{'last': index === 9}">
			<img v-if="index===9" :src="$downAppImg" class="down-app" mode="scaleToFill"></img>
			<view style="width: 100%;display: inline-block;" :class="{'translateY': index===9}">
				<view class="blogger-info inline-block">
					<image class="blogger-photo" src="../../static/logo.png"></image>
					<text class="blogger-name">{{item.userId}}</text>
					<text :id="'follow' + index" class="blogger-name guanzhu" @click="onConcern(index)">关注</text>
				</view>
				<view class="blog-title inline-block" @click="goDetail(item)">
					<text style="padding: 14px 0 0 40upx;">这是标题:{{item.title}}****第{{index + 1}}条</text>
				</view>
				<view class="blog-content inline-block" @click="goDetail(item)">
					<text style="padding: 28upx 40upx 0 40upx;display: -webkit-box;-webkit-box-orient: vertical;
					-webkit-line-clamp: 4;overflow: hidden;word-break:break-all;word-wrap:break-word;">这是正文:{{item.content}}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</text>
				</view>
				<view class="card inline-block">
					<!-- <image class="card-img" :src="item.img_src" mode="aspectFill" @click="goDetail(item)"></image> -->
					<view style="width: 100%;flex-wrap: wrap;max-height: 968upx;overflow: hidden;" @click="goDetail(item)">
						<block v-for="(event,$idx) in item.imgs" :key="$idx">
							<!-- <image v-show="$idx === 0" class="card-img" :src="event" mode="aspectFill"></image> -->
							<!-- <image v-show="$idx === 1 && index !== 9" class="card-img" :src="event" mode="aspectFill"></image> -->
							<view v-show="$idx === 0" class="card-img"></view>
							<view v-show="$idx === 1 && index !== 9" class="card-img"></view>
						</block>

						<text v-if="item.imgs && item.imgs.length > 2 && index !== 9" class="num-photo">共{{item.imgs.length}}张图片</text>
						<view v-if="item.imgs && item.imgs.length > 2 && index !== 9" class="card-num-view" @click="goDetail(item)">
							<image src="../../static/显示全部按钮.png" style="width: 100%;height: 100%;border: 1px solid;"></image>
						</view>
					</view>

					<view v-show="index !== 9" class="card-bottm ">
						<view class="car-title-view">
							<text class="card-title">#{{item.title}}</text>
						</view>
						<!-- <view @click.stop="share(item)" class="card-share-view"></view> -->
					</view>
					<text class="card-title card-hot">{{item.clickCount}}条热度</text>
				</view>
				<view style="display: inline-block;border-bottom: 15upx #36465D solid;width: 100%;"></view>
			</view>
		</view>
		<!-- <text class="loadMore">加载中...</text> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indexActiveImg: this.$indexActiveImg,
				videoImg: this.$videoImg,
				myImg: this.$myImg,
				downAppImg: this.$downAppImg,

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
			}
		},
		onLoad() {
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
				}
			})
			this.getData();
			// 	uni.getProvider({
			// 		service: 'share',
			// 		success: (e) => {
			// 			let data = []
			// 			for (let i = 0; i < e.provider.length; i++) {
			// 				switch (e.provider[i]) {
			// 					case 'weixin':
			// 						data.push({
			// 							name: '分享到微信好友',
			// 							id: 'weixin'
			// 						})
			// 						data.push({
			// 							name: '分享到微信朋友圈',
			// 							id: 'weixin',
			// 							type: 'WXSenceTimeline'
			// 						})
			// 						break;
			// 					case 'qq':
			// 						data.push({
			// 							name: '分享到QQ',
			// 							id: 'qq'
			// 						})
			// 						break;
			// 					default:
			// 						break;
			// 				}
			// 			}
			// 			this.providerList = data;
			// 		},
			// 		fail: (e) => {
			// 			console.log('获取分享通道失败', e);
			// 		}
			// 	});
		},
		onPageScroll(e) {
			if (e.scrollTop > this.top && e.scrollTop > 20) {
				this.displayNone = true;
			} else {
				this.displayNone = false;
			}
			if (e.scrollTop > 0) {
				this.topMenuPosition = true;
			} else {
				this.displayNone = false;
				this.topMenuPosition = false;
			}
			this.top = e.scrollTop;
		},
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
			gotoLogin() {
				if (this.token) {
					uni.redirectTo({
						url: '../../pages/center/center'
					})
				} else {
					uni.redirectTo({
						url: '../../pages/login/login'
					})
				}
			},
			getData() {
				this.topMenuPosition = true;
				// 如果未登录  查询热门博文第二页 如果已登录  查询关注博文第一页
				if (!this.token) {
					uni.request({
						url: this.$serverUrl + '/blog/hot',
						data: {
							pageNum: 1,
							pageSize: 10,
						},
						header: {
							// "Content-Type": "application/json;charset=UTF-8",
							"Content-Type": "application/x-www-form-urlencoded"
						},
						method: "POST",
						success: (ret) => {
									uni.stopPullDownRefresh()
							if (ret.statusCode !== 200) {
								console.log('失败!');
								this.refreshing = false;
								uni.stopPullDownRefresh();
							} else {
								this.topMenuPosition = false;
								if (this.refreshing && ret.data.data[0].id === this.list[0].id) {
									uni.showToast({
										title: '已经最新',
										icon: 'none',
									})
									this.refreshing = false;
									return;
								}
								if (this.refreshing) {
									this.refreshing = false;
									this.list = ret.data.data;
									this.fetchPageNum = 2;
								} else {
									this.list = ret.data.data;
									this.fetchPageNum += 1;
								}
							}
						},
						fail: (ret) => {
							this.refreshing = false;
							uni.stopPullDownRefresh();
						}
					});
					return
				}
				uni.request({
					url: this.$serverUrl + '/blog/follow',
					data: {
						pageNum: 1,
						pageSize: 10,
					},
					header: {
						// "Content-Type": "application/json;charset=UTF-8",
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
					},
					method: "POST",
					success: (ret) => {
								uni.stopPullDownRefresh();
						if (ret.statusCode !== 200) {
							console.log('失败!');
							this.refreshing = false;
						} else {
							console.log(ret.data.data)
							this.topMenuPosition = false;
							if (this.refreshing && ret.data.data[0].id === this.list[0].id) {
								uni.showToast({
									title: '已经最新',
									icon: 'none',
								})
								this.refreshing = false;
								return;
							}
							if (this.refreshing) {
								this.refreshing = false;
								this.list = ret.data.data.blogVOS;
								this.fetchPageNum = 2;
							} else {
								this.list = ret.data.data.blogVOS;
								this.fetchPageNum += 1;
							}
						}
						fail: (ret) => {
							uni.stopPullDownRefresh();
						}
					}
				});
			},
			goDetail(item) {
				console.log(item.id)
				uni.navigateTo({
					url: '../../pages/particulars/particulars?id=' + item.id
				});







				// uni.navigateTo({
				// 	url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
				// })
			},
			goRecommend() {
				uni.redirectTo({
					url: '../../pages/new/recommend'
				})
			},
			goPost() {
				uni.redirectTo({
					url: '../../pages/new/post'
				})
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: '当前环境无分享渠道!',
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function(value) {
					return value.name
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ?
								'WXSenceTimeline' : 'WXSceneSession',
							type: 0,
							title: 'uni-app模版',
							summary: e.title,
							imageUrl: e.img_src,
							href: 'https://uniapp.dcloud.io',
							success: (res) => {
								console.log('success:' + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel: false
								})
							}
						});
					}
				})
			},
			onConcern(idx) {
				let id = 'follow' + idx;
				if (this.token) {
					if (document.getElementById(id).innerText === '关注') {
						uni.showToast({
							title: '关注成功',
							icon: 'none',
						})
						document.getElementById(id).innerText = '取消关注'
					} else {
						uni.showModal({
							title: '',
							content: '确定不再关注？',
							showCancel: true,
							cancelText: '取消',
							cancelColor: '#9C9C9C',
							confirmText: true,
							confirmText: '确定',
							confirmColor: '#E96900',
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									uni.showToast({
										title: '已取消关注',
										icon: 'none',
									})
									document.getElementById(id).innerText = '关注'
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
					console.log(this.token)

				} else {
					uni.showModal({
						title: '尚未登录，无法关注',
						content: '请问是否跳转登录页面',
						showCancel: true,
						cancelText: '稍后登录',
						cancelColor: '#9C9C9C',
						confirmText: true,
						confirmText: '现在登录',
						success: function(res) {
							if (res.confirm) {
								uni.redirectTo({
									url: '../../pages/login/login?url=' + '/new/new'
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				}
			},
			gotoVideo() {
				uni.redirectTo({
					url: '../../pages/video/video?url=/new/new'
				})
			}
		}
	}
</script>

<style>
	.title-active {
		color: #36465D;
	}

	.scroll-view-item_H {
		display: inline-block;
		text-align: center;
	}

	.xhx {
		height: 2px;
		width: 18px;
		background-image: url('../../static/圆角矩形.png');
		display: block;
		margin: 0 auto;
		position: relative;
		top: -6px;
	}

	.blogger-info {
		width: 100%;
		margin-top: 20upx;
		padding-bottom: 20upx;
		border-bottom: #EEEEEE 1px solid;
	}

	.blogger-photo {
		width: 34px;
		height: 34px;
		border: 1rpx solid #555555;
		margin-left: 40upx;
		float: left;
	}

	.blogger-name {
		line-height: 34px;
		font-size: 14px;
		color: rgba(65, 65, 65, 1);
		font-family: Hiragino Sans GB;
		margin-left: 20upx;
		float: left;
	}

	.blog-title {
		color: #4B4B4B;
		font-weight: bold;
		font-size: 18px;
		width: 100%;
		text-align: left;
	}

	.blog-content {
		width: 100%;
		color: #4B4B4B;
		font-size: 13px;
		text-align: left;
	}

	.guanzhu {
		display: inline-block;
		float: right;
		color: #4294C7;
		margin-right: 40upx;
	}



	.postText {
		position: absolute;
		flex-wrap: wrap;
		top: 166upx;
		padding: var(--status-bar-height);
		margin: 112upx;
	}

	.postInof {
		font-size: 50upx;
		display: block;
		margin: 0 auto 30upx;
		color: #36465D;
	}

	.postImage {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
</style>
