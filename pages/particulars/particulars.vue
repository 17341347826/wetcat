<template>
	<view class="" style="display:block;margin: 0 auto;">
		<view style="width: 100%;display: inline-block;">
			<view class="blogger-info inline-block">
				<image class="blogger-photo" src="../../static/logo.png"></image>
				<text class="blogger-name">{{blogInfo.nickname}}</text>
				<text class="blogger-name guanzhu">关注</text>
			</view>
			<view class="blog-title inline-block">
				<text style="padding: 14px 0 0 40upx;">这是标题:{{blogInfo.title}}</text>
			</view>
			<view class="blog-content inline-block">
				<text style="padding: 28upx 40upx 0 40upx;">这是正文:{{blogInfo.content}}</text>
			</view>
			<view class="card inline-block">
				<block v-for="(event,$idx) in blogInfo.imgs" :key="$idx">
					<!-- <image class="card-img" :src="event" mode="aspectFill"></image> -->
					<view class="card-img"></view>
				</block>

				<view class="card-bottm ">
					<view class="car-title-view">
						<text class="card-title">#{{blogInfo.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="fgx"></view>
		<view style="color: #9C9C9C;font-size:18px;border-bottom: 1px solid #EEEEEE;height: 34px;line-height: 34px;padding-left: 15px;">
			<text :class="{'zw-active': onCommentHot}" @click="onComment()" style="margin-right: 50upx;">评论{{commentsInfo.length}}</text>
			<text :class="{'zw-active': !onCommentHot}" @click="onHot()">热度{{blogInfo.clickCount}}</text>
		</view>
		<view v-if="commentsInfo.length > 0" style="margin: 35upx 0 10px;">
			<view>
				<image src="../../static/logo.png" mode="" class="blogger-photo"></image>
			</view>
			<view>
				<text>
					<text style="font-size: 14px;display: block;margin-bottom: 5px;">{{commentsInfo[0].nickname}}</text>
					<text style="font-size: 15px;color: #4B4B4B;display: block;word-break:break-all;word-wrap:break-word;padding-right: 40upx;">{{commentsInfo[0].comment}}xassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</text>
				</text>
				
			</view>
		</view>
		<image v-if="downApp" :src="$downAppImg" mode="aspectFill" style="width: 100%;height: 480upx;position: absolute;"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				downApp: false,
				blogInfo: {},
				commentsInfo: [],
				token: '',
				onCommentHot: true,
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
				}
			})
			if (option.id) {
				this.getBlogInfo(option.id)
				if (this.token) {
					this.clickAdd(option.id);
				}
			} else {
				uni.navigateBack({
					delta: 1
				})
			}
		},
		methods: {
			getBlogInfo(id) {
				uni.request({
					url: this.$serverUrl + '/blog/detail',
					data: {
						id: Number(id)
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
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
						console.log(res.data.data);
						this.blogInfo = res.data.data;
						this.commentsInfo = this.blogInfo.comments;
						this.downApp = true;
					},
					fail: () => {
						uni.showModal({
							content: '点击接口调用失败!',
							showCancel: false
						})
					}
				})
			},
			clickAdd(id) {
				uni.request({
					url: this.$serverUrl + '/blog/click',
					data: {
						id: Number(id)
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
						"authorization": this.token
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
					},
					fail: () => {
						uni.showModal({
							content: '点击接口调用失败!',
							showCancel: false
						})
					}
				})
			},
			onComment() {
				this.onCommentHot = true;
			},
			onHot() {
				this.onCommentHot = false;
			}
		}
	}
</script>

<style>
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
	.zw-active {
		color: #36465D;
		border-bottom: ;
	}
	.blogger-photo {
		width: 34px;
		height: 34px;
		border: 1rpx solid #555555;
		margin: 0 20upx 0 40upx;
		float: left;
	}
</style>
