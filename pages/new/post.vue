<template>
	<view class="post">
		<view class="dhl"></view>
		<view class="topHeader" :class="{'position-fixed': topMenuPosition}">
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
				<view class="top-menu-title scroll-view-item_H" @click="goFollow()">
					<text>关注</text>
				</view>
				<view class="top-menu-title scroll-view-item_H" @click="goRecommend()">
					<text>推荐</text>
				</view>
				<view class="top-menu-title scroll-view-item_H title-active">
					<text>帖子信息</text>
					<text class="xhx"></text>
				</view>
			</view>
		</view>

		<view class="postText">
			<view class="postInof">
				<text>帖子信息</text>
			</view>
			<view class="postInof">
				<text>请下载APP查看</text>
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
				indexActiveImg: this.$indexActiveImg,
				videoImg: this.$videoImg,
				myImg: this.$myImg,
				downAppImg: this.$downAppImg,

				displayNone: false,
				topMenuPosition: true,
				refreshing: false,
				token: '',
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
			goRecommend() {
				uni.redirectTo({
					url: '../../pages/new/recommend'
				})
			},
			goFollow() {
				uni.redirectTo({
					url: '../../pages/new/new'
				})
			},
			gotoVideo() {
				uni.redirectTo({
					url: '../../pages/video/video?url=/new/post'
				})
			}
		},
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
