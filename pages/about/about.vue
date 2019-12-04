<template>
	<view class="about">
			<!-- <iframe src="http://192.168.1.227:8888/recharge/create/h5" frameborder="0"></iframe> -->
			<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				shopId: '',
				url: '',
				providerList: [],
				version: '',
				sourceLink: 'https://github.com/dcloudio/uni-template-picture'
			}
		},
		onLoad: function(option){
			let self = this;
			uni.getStorage({
				key: 'user_info',
				success: function(res) {
					self.token = res.data.token
				}
			})
			if (option.id) {
				this.shopId = option.id;
			}
			if (this.token && this.shopId) {
				this.url = 'http://192.168.1.227:8888/recharge/create/h5?authorization=' + this.token + '&id=' + this.shopId + '&callbackUrl=http://192.168.1.100:8080/#/pages/center/center'
			} else {
				uni.reLaunch({
					url: '../../pages/new/recommend'
				})
			}
			console.log(this.token)
			
		},
		methods: {

		}
	}
</script>

<style>
	page,
	view {
		display: flex;
	}

	page {
		min-height: 100%;
		background-color: #FFFFFF;
	}

	image {
		width: 360upx;
		height: 360upx;
	}

	.about {
		flex-direction: column;
		flex: 1;
	}

	.content {
		flex: 1;
		padding: 30upx;
		flex-direction: column;
		justify-content: center;
	}

	.qrcode {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.qrcode .tip {
		margin-top: 20upx;
	}

	.desc {
		margin-top: 30upx;
		display: block;
	}

	.code {
		color: #e96900;
		background-color: #f8f8f8;
	}

	button {
		width: 100%;
		margin-top: 40upx;
	}

	.version {
		height: 80upx;
		line-height: 80upx;
		justify-content: center;
		color: #ccc;
	}

	.source {
		margin-top: 30upx;
		flex-direction: column;
	}

	.source-list {
		flex-direction: column;
	}

	.link {
		color: #007AFF;
	}
</style>
